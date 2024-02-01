<template>
  <div v-if="ready">
    {{ quiz }}
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
const quiz = res.documents[0]
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
  ready.value=true
}
</script>
