<template>
  <div v-if="ready" @click="next" class="h-full absolute inset-0 flex-col flex bg-gray-100 px-10 py-12 my-3 cursor-pointer">
    <h1 class="text-5xl">
      <b>Frage {{ questionIndex + 1 }}</b>
      {{ question.title }}</h1>
    <div class="flex flex-col gap-4 mt-16">
      <div class="answer overflow-hidden" v-for="(answer, index) in question.answers" :key="index">
        <div class="p-6">
          <div class="w-8 d-inline-block font-bold">{{ ['A', 'B', 'C', 'D', 'E', 'F'][index] }}</div>
          {{ answer.title }}
        </div>
        <div class="progress-wrapper" v-if="status === 'show_solution'">
          <div :style="{width: 4 * 100 / 7 + '%'}"
               class="h-1 -mt-1 transition-all duration-1000 ease-in-out"
               :class="answer.correct ? 'bg-green-500' : 'bg-[#010545]'"
          ></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="finished"
       class="h-full absolute inset-0 w-full flex-col flex justify-center items-center bg-gray-300">
    <h1 class="text-4xl">Quiz beendet</h1>
  </div>
  <div v-else class="h-full absolute inset-0 w-full flex-col flex justify-center items-center bg-gray-300">
    <div class="w-64 bg-white shadow-lg overflow-hidden rounded-lg">
      <img :src="urlQR" class="w-64 h-64 object-cover"/>
      <div class="-mt-4 text-center w-full mx-auto text-mono pb-3 text-lg">{{ session }}</div>
      <div class="w-64">
        <v-progress-linear indeterminate color="#EB003C"></v-progress-linear>
      </div>
    </div>
    <v-btn
        @click="next" class="my-8" prepend-icon="mdi-play">Quiz starten
    </v-btn>
  </div>

  <!-- CI -->
  <img src="/icon.svg" alt="icon" class="icon" style="position:fixed;width:55px;left:0;bottom:0;margin:40px">
  <div class="aus-liebe-zum-leben">Aus Liebe zum Leben</div>
</template>
<script setup>
import {ID, Query} from 'appwrite'

const route = useRoute()
const appwrite = useAppwrite()
const session = Math.random().toString(36).substring(7)
const res = await appwrite.database.listDocuments('quiz', 'quizzes', [
  Query.equal('$id', route.params.quiz)
])
let quiz = res.documents[0]
//  quiz questions must be json parsed
quiz.questions = JSON.parse(quiz.questions)

definePageMeta({layout: 'quiz'})
const ready = ref(false)
const url = computed(() => window.location.origin + '/quiz/play/' + quiz.$id + '/' + session)
const urlQR = computed(() => `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${url.value}`)
const clearQuiz = async () => {
  // get all clicks from that quiz and session
  const res = await appwrite.database.listDocuments('quiz', 'clicks', [
    Query.equal('quiz', quiz.$id),
    Query.equal('session', session)
  ])
  // delete all from that quiz and session
  await Promise.all(res.documents.map(click => appwrite.database.deleteDocument('quiz', 'clicks', click.$id)))
  ready.value = true
}
const questionIndex = ref(-1)
const question = computed(() => quiz.questions[questionIndex.value])
const finished = ref(false)
const status = ref('show_solution')
const next = async () => {
  // wir zeigen die Antworten
  if (status.value === 'show_solution') {
    // Die User dürfen nun die nächste Frage anklicken
    questionIndex.value++
    if (questionIndex.value < quiz.questions.length) {
      status.value = 'show_question'
      await appwrite.database.createDocument('quiz', 'clicks',
          ID.unique(),
          {
            quiz: quiz.$id,
            session,
            client_freigabe: true,
            questionIndex: questionIndex.value,
          })
      console.log('next', questionIndex.value)
    } else {
      ready.value = false
      finished.value = true
    }
  } else {
    // wir zeigen die Frage
    status.value = 'show_solution'
  }
}

onMounted(() => {
  clearQuiz()
  // next()
})
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
  @apply rounded-lg bg-white text-3xl shadow-lg
}
</style>
