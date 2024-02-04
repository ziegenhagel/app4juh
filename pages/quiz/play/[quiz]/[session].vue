<template>
  <div class="p-4">
    <template v-if="question">
      <h1 class="text-3xl"><b>Frage {{ questionIndex + 1 }}</b> {{ question.title }}</h1>
      <div class="flex flex-col gap-4 mt-8" :class="status === 'waiting' ? 'opacity-50 pointer-events-none' : ''">
        <div class="answer overflow-hidden" v-for="(answer, index) in question.answers" :key="index"
             @click="clickAnswer(index)"
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
    </template>
    <div v-else-if="questionIndex>1"
         class="h-full absolute inset-0 w-full flex-col flex justify-center items-center bg-gray-100">
      <h1 class="text-4xl">Quiz beendet</h1>
    </div>
    <div v-else
         class="h-full absolute inset-0 w-full flex-col flex justify-center items-center bg-gray-100">

      <div v-if="presenterAsk" class="p-8 flex flex-col gap-4">

        <h1 class="text-4xl">Spielmodus</h1>
        <h1 class="text-xl">Möchten Sie als Dozent oder als Teilnehmer:in spielen?</h1>
        <v-btn :to="'/quiz/play/' + route.params.quiz + '?session='+ route.params.session" prepend-icon="mdi-play">Als
          Dozent
        </v-btn>
        <v-btn @click="presenterAsk = false" class="mb-12" prepend-icon="mdi-play">Als Teilnehmer:in</v-btn>
      </div>

      <h1 class="text-4xl" v-else>Bitte warten</h1>
    </div>
    <img src="/logo.svg" alt="icon" class="icon"
         style="position:fixed;width:150px;left:50%;margin-left:-75px;bottom:25px">
  </div>
</template>
<script setup>
import {ID, Query} from 'appwrite'

definePageMeta({layout: 'quiz'})
const route = useRoute()
const appwrite = useAppwrite()

// GET QUIZ
const res = await appwrite.database.listDocuments('quiz', 'quizzes', [
  Query.equal('$id', route.params.quiz)
])


// Schauen nach quiz+session in den clicks, ob schon ein has_presenter = true ist
const presenter = await appwrite.database.listDocuments('quiz', 'clicks', [
  Query.equal('quiz', res.documents[0].$id),
  Query.equal('session', route.params.session),
  Query.equal('has_presenter', true)
])

console.log('presenter', presenter.total)
const presenterAsk = ref(presenter.total === 0)

// SETUP QUIZ
let quizTmp = res.documents[0]
quizTmp.questions = JSON.parse(quizTmp.questions)
quizTmp.questions.forEach(question => {
  question.answers.forEach(answer => {
    answer.clicks = 0
  })
  question.clicks = 0
})
const quiz = ref(quizTmp)
const questionIndex = ref(-1)
const question = computed(() => quiz.value.questions?.[questionIndex.value])

// ZUSTAND VARIABLEN
const status = ref('show_question') // show_solution, waiting
const finished = ref(false)

// ACTIONS
const clickAnswer = async (answer) => {
  console.log('clickAnswer', answer)
  if (status.value !== 'show_question') return

  status.value = 'waiting'
  await appwrite.database.createDocument('quiz', 'clicks',
      ID.unique(),
      {
        quiz: quiz.value.$id,
        session: route.params.session,
        client_freigabe: false, // nein, wir sind ja selbst der client. client_freigabe auf der aktuellen questionIndex setzt status auf show_solution
        questionIndex: questionIndex.value,
        choiceIndex: answer
      })
}


const setupAppwriteClickListener = () => {
  console.log('setupAppwriteClickListener')
  client.subscribe('databases.quiz.collections.clicks.documents', async (event) => {
    if (event.payload.session === route.params.session && event.payload.quiz === quiz.value.$id) {
      if (event.payload.client_freigabe) {

        if (event.payload.questionIndex === questionIndex.value) {
          status.value = 'show_solution'
        } else {
          // if questionIndex is higher, show next question
          questionIndex.value++
          status.value = 'show_question'
        }

        // START QUIZ
        if (questionIndex.value === -1) {
          questionIndex.value = 0
          status.value = 'show_question'
        }
      } else {
        // in the current quiz, update the question and answer clicks
        quiz.value.questions[event.payload.questionIndex].clicks++
        quiz.value.questions[event.payload.questionIndex].answers[event.payload.choiceIndex].clicks++
      }
    }
    console.log('click', event)
  })
}

const client = useAppwriteClient()

onMounted(setupAppwriteClickListener)
</script>
<style>

h1, h2 {
  color: #010545
}

.answer {
  color: #010545;
  @apply rounded-lg text-3xl shadow-lg
}
</style>
