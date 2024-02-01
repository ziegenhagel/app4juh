<template>
  <div v-if="ready" class="h-full absolute inset-0 flex-col flex justify-center items-center bg-gray-300">
    <h1 class="text-4xl">{{ question.title }}</h1>
    <div class="grid grid-cols-2 gap-4">
      <div v-for="(answer, index) in question.answers" :key="index">
        <v-btn @click="next" class="w-full" color="primary">{{ answer.title }}</v-btn>
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
        @click="clearQuiz" class="my-8" prepend-icon="mdi-play">Quiz starten
    </v-btn>
  </div>
</template>
<script setup>
import {Query} from 'appwrite'

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
      await appwrite.database.createDocument('quiz', 'clicks', {
        quiz: quiz.$id,
        session,
        client_freigabe: true,
        questionIndex: questionIndex.value,
      })
      status.value = 'show_question'
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
  next()
})
</script>
