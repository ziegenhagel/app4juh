<template>
  <div v-if="connecting" class="h-full absolute inset-0 w-full flex-col flex justify-center items-center bg-gray-300">
    <div class="w-64 shadow-lg overflow-hidden rounded-lg">
      <img :src="urlQR" class="w-64 h-64 object-cover"/>
      <div class="w-64">
        <v-progress-linear indeterminate color="#EB003C"></v-progress-linear>
      </div>
    </div>
    <v-btn @click="connecting = false" class="my-8" prepend-icon="mdi-play">Quiz starten</v-btn>
  </div>
</template>
<script setup>
const route = useRoute()
const appwrite = useAppwrite()
const allquizzes = await appwrite.database.listDocuments('quiz', 'quizzes')
const quiz = allquizzes.documents.find(quiz => quiz.$id === route.params.quiz)
definePageMeta({layout: 'quiz'})
const connecting = ref(true)
const urlQR = computed(() => {
  // get current url and add /client to it, then via googles chart qr
  return `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${url.value}`
})
const url = computed(() => {
  return window.location.origin + '/quiz/play/' + quiz.$id + '/client'
})
</script>
