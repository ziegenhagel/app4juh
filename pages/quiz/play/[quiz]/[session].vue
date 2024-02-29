<template>
  <div class="p-4">
    <template v-if="question">
      <h1 class="text-3xl mt-4"><b>Frage {{ questionIndex + 1 }}</b> {{ question.title }}</h1>
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
      <img :src=" '/quiz/inseln/i' + quiz.insel + '.svg' " alt="insel" class="w-24 mb-6"/>
      <h1 class="text-3xl font-medium" :style="{color: inseln[quiz.insel].color}">Gratulation!</h1>
      <h2 class="text-xl px-5 mt-2 text-center">{{ correctAnswers }} von {{ correctAnswers + wrongAnswers }} Fragen
        richtig beantwortet</h2>
    </div>
    <div v-else
         class="h-full absolute inset-0 w-full flex-col flex justify-center items-center bg-gray-100">

      <div v-if="presenterAsk" class="p-8 flex flex-col gap-4">

        <h1 class="text-4xl">Spielmodus</h1>
        <h1 class="text-xl">Möchten Sie als Dozent oder als Teilnehmer:in spielen?</h1>
        <v-btn @click="alsDozent" prepend-icon="mdi-play">Als
          Dozent
        </v-btn>
        <v-btn @click="presenterAsk = false" class="mb-12" prepend-icon="mdi-play">Als Teilnehmer:in</v-btn>
      </div>

      <div class="text-4xl w-full mb-24 p-6 flex flex-col text-center items-center gap-4" v-else>
        <img :src=" '/quiz/inseln/i' + quiz.insel + '.svg' " alt="insel" class="w-24"/>
        <div>
          <h1 class="text-4xl my-4 font-bold" :style="{color: inseln[quiz.insel].color}">{{
              inseln[quiz.insel].name
            }}</h1>
          <h2 class="text-2xl">{{ quiz.title }}</h2>
        </div>
      </div>
    </div>
    <img src="/logo.svg"
         v-if="!question"
         alt="icon" class="icon p-6 h-24 w-full"
         style="position:fixed;left:0;bottom:0;right:0"/>
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
const correctAnswers = ref(0)
const wrongAnswers = ref(0)

// ACTIONS
const clickAnswer = async (answer) => {

  // inc correct or wrong answers
  if (question.value.answers[answer].correct) {
    correctAnswers.value++

  } else {
    wrongAnswers.value++
    // Swal.fire({
    //   title: 'Eingelogg: ' + question.value.answers[answer].title,
    //   // text: 'Ist leider falsch.',
    //   // icon: 'error',
    //   showConfirmButton: false,
    //   timer: 1500
    // })
  }
  Swal.fire({
    title: 'Eingelogg: ' + question.value.answers[answer].title,
    // text: 'Ist richtig!',
    // icon: 'success',
    showConfirmButton: false,
    timer: 1500
  })
  console.log('Du hast ' + correctAnswers.value + ' von ' + (correctAnswers.value + wrongAnswers.value) + ' Fragen richtig beantwortet')

  // Swal.fire({
  //   title: question.value.answers[answer].title,
  //   text: '... wurde als Antwort gespeichert.',
  //   // icon: 'info',
  //   showConfirmButton: false,
  //   timer: 1500
  // })

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
  // ask before leaving the website
  if (typeof window !== 'undefined')
    window.onbeforeunload = function () {
      window.alert('Möchtest du die Seite wirklich verlassen?')
      return 'Möchtest du die Seite wirklich verlassen?'
    }

  console.log('setupAppwriteClickListener')
  client.subscribe('databases.quiz.collections.clicks.documents', async (event) => {
    if (event.payload.session === route.params.session && event.payload.quiz === quiz.value.$id) {
      if (event.payload.client_freigabe) {

        if (event.payload.questionIndex === questionIndex.value) {
          status.value = 'show_solution'
        } else {
          // if questionIndex is higher, show next question
          if (event.payload.questionIndex > questionIndex.value) {
            questionIndex.value = event.payload.questionIndex
            status.value = 'show_question'
          } else {
            console.log('anscheinend kennen wir die Frage schon')
          }
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

const alsDozent = async () => {
  // ask for pin 1044, and only continue via swal if the pin is correct
  const {value: pin} = await Swal.fire({
    title: 'Dozenten PIN',
    input: 'text',
    inputLabel: 'Bitte geben Sie die Dozenten PIN ein',
    inputPlaceholder: 'Dozenten PIN',
    inputAttributes: {
      maxlength: 4,
      autocapitalize: 'off',
      autocorrect: 'off'
    }
  })

  if (pin !== '1044') {
    return Swal.fire('Falsche PIN', 'Die eingegebene PIN war falsch', 'error')
  }


  // redirect to="'/quiz/play/' + route.params.quiz + '?session='+ route.params.session"
  const router = useRouter()
  await router.push('/quiz/play/' + route.params.quiz + '?session=' + route.params.session)
}
</script>
<style>

h1, h2 {
  color: #010545
}

.answer {
  color: #010545;
  @apply rounded-lg text-3xl shadow-lg
}

@media (max-height: 500px) {
  .icon {
    display: none;
  }
}
</style>
