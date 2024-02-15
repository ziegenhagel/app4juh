<template>
  <div v-if="ready" @click="next"
       class="h-full absolute inset-0 flex-col flex bg-gray-100 px-10 py-12 my-3 cursor-pointer">
    <h1 class="text-4xl">
      <b>Frage {{ questionIndex + 1 }}</b>
      {{ question.title }}</h1>
    <div class="flex flex-col gap-4 mt-8">
      <div class="answer overflow-hidden" v-for="(answer, index) in question.answers" :key="index"
           :class="status === 'show_solution' && answer.correct ? 'bg-green-600/90 text-white' : 'bg-white'">
        <div class="p-4">
          <div class="w-8 d-inline-block font-bold">{{ ['A', 'B', 'C', 'D', 'E', 'F'][index] }}</div>
          {{ answer.title }}
        </div>
        <div class="progress-wrapper" v-if="status === 'show_solution'">
          <div :style="{width: answer.clicks * 100 / question.clicks + '%'}"
               class="h-1 -mt-1 transition-all duration-1000 ease-in-out"
               :class="answer.correct ? 'bg-green-700' : 'bg-[#010545]'"
          ></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="finished"
       class="h-full absolute inset-0 w-full flex-col flex justify-center items-center bg-gray-100">
    <h1 class="text-4xl">Quiz beendet</h1>
  </div>
  <div v-else class="h-full absolute inset-0 w-full flex-col flex justify-center items-center bg-gray-100">
    <div v-if="showQr" class="w-64 bg-white shadow-lg overflow-hidden rounded-lg">
      <img :src="urlQR" class="w-64 h-64 object-cover"/>
      <div class="-mt-4 text-center w-full mx-auto text-mono pb-3 text-lg">{{ session }}</div>
      <div class="w-64">
        <v-progress-linear indeterminate color="#EB003C"></v-progress-linear>
      </div>
    </div>
    <h1 class="text-4xl" v-else>{{ quiz.title }}</h1>
    <v-btn @click="startenBtn" class="mt-8" prepend-icon="mdi-play">Starten!</v-btn>
    <v-btn @click="clearQuiz" variant="text" class="opacity-20 m-2 position-fixed top-0 left-0" prepend-icon="mdi-replay"></v-btn>
  </div>

  <!-- CI -->
  <img src="/logo.svg" alt="icon" class="icon"
       style="position:fixed;width:150px;left:50%;margin-left:-75px;bottom:25px">
  <!--  <img src="/icon.svg" alt="icon" class="icon" style="position:fixed;width:55px;left:0;bottom:0;margin:40px">-->
  <!--  <div class="aus-liebe-zum-leben">Aus Liebe zum Leben</div>-->
</template>
<script setup>
import {ID, Query} from 'appwrite'

const route = useRoute()
const appwrite = useAppwrite()
const client = useAppwriteClient()
const session = route.query.session || Math.random().toString(36).substring(7)
const showQr = ref(route.query.session === undefined)
const res = await appwrite.database.listDocuments('quiz', 'quizzes', [
  Query.equal('$id', route.params.quiz)
])
let quizTmp = res.documents[0]

//  quiz questions must be json parsed
quizTmp.questions = JSON.parse(quizTmp.questions)

// each question has a total count of clicks, and each answer has a count of clicks
quizTmp.questions.forEach(question => {
  question.answers.forEach(answer => {
    answer.clicks = 0
  })
  question.clicks = 0
})

const quiz = ref(quizTmp)

definePageMeta({layout: 'quiz'})
const ready = ref(false)
const url = computed(() => window.location.origin + '/quiz/play/' + quiz.value.$id + '/' + session)
const urlQR = computed(() => `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${url.value}`)

const clearQuiz = async () => {
  // get all clicks from that quiz and session
  const res = await appwrite.database.listDocuments('quiz', 'clicks', [
    Query.equal('quiz', quiz.value.$id),
    Query.equal('session', session)
  ])
  // delete all from that quiz and session
  await Promise.all(res.documents.map(click => appwrite.database.deleteDocument('quiz', 'clicks', click.$id)))
  console.log('got quiz and session clicks', quiz.value, session)
  ready.value = true
}
const questionIndex = ref(-1)
const question = computed(() => quiz.value.questions?.[questionIndex.value])
const finished = ref(false)
const status = ref('show_solution')
const next = async () => {
  // wir zeigen die Antworten
  if (status.value === 'show_solution') {
    console.log('status changed to show_question, new questionIndex', questionIndex.value)
    // Die User dürfen nun die nächste Frage anklicken
    questionIndex.value++
    if (questionIndex.value < quiz.value.questions.length) {
      status.value = 'show_question'
      // await appwrite.database.createDocument('quiz', 'clicks',
      //     ID.unique(),
      //     {
      //       quiz: quiz.value.$id,
      //       session,
      //       client_freigabe: true,
      //       questionIndex: questionIndex.value,
      //     })
      // console.log('next', questionIndex.value)
    } else {
      ready.value = false
      finished.value = true

      // jetzt alle clicks zu dieser session löschen
      const res = await appwrite.database.listDocuments('quiz', 'clicks', [
        Query.equal('session', session)
      ])
      console.log('res', res)

    }
  } else {
    // wir zeigen die Frage
    status.value = 'show_solution'
    console.log('status changed to show_solution')

  }

  console.log('creating click freigabe')
  await appwrite.database.createDocument('quiz', 'clicks',
      ID.unique(),
      {
        quiz: quiz.value.$id,
        session,
        client_freigabe: true,
        questionIndex: questionIndex.value,
      })
}

// listen to clicks
const setupAppwriteClickListener = () => {
  console.log('setupAppwriteClickListener')
  client.subscribe('databases.quiz.collections.clicks.documents', async (event) => {
    if (event.payload.session === session && event.payload.quiz === quiz.value.$id) {
      // in the current quiz, update the question and answer clicks
      quiz.value.questions[event.payload.questionIndex].clicks++
      quiz.value.questions[event.payload.questionIndex].answers[event.payload.choiceIndex].clicks++
    }
    console.log('click', event)
  })
}

const setPresenter = async () => {
  console.log('setPresenter')
  await appwrite.database.createDocument('quiz', 'clicks',
      ID.unique(),
      {
        quiz: quiz.value.$id,
        session,
        has_presenter: true,
        questionIndex: -1,
        choiceIndex: -1
      })
  console.log('setPresenter')
}

setPresenter()
onMounted(() => {
  // clearQuiz()
  setupAppwriteClickListener()
  // next()
})

const startenBtn = async () => {
  console.log('startenBtn')
  await next()
  ready.value = true
}
</script>
<style>
.aus-liebe-zum-leben {
  position: fixed;
  bottom: 0;
  right: 50px;
  bottom: 35px;
  font-weight: 600;
  font-size: 1.5em;
  color: #EB003C;
}

h1, h2 {
  color: #010545
}

.answer {
  color: #010545;
  @apply rounded-lg text-2xl shadow-lg
}
</style>
