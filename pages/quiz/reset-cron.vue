<template>
  <div>
    <h1>Reset Cron</h1>
    <p>Resetting the cron job...</p>
  </div>
</template>
<script setup>
import {Query} from "appwrite";

definePageMeta({
  layout:'quiz'
})
const appwrite = useAppwrite()
// delete all documents from the collection clicks
const resetCron = async () => {
  try {
    const response = await appwrite.database.listDocuments('quiz', 'clicks',[
      Query.limit(100)
    ])
    response.documents.forEach(async (doc) => {
      await appwrite.database.deleteDocument('quiz', 'clicks', doc.$id)
      console.log('Deleted document', doc.$id)
    })
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  resetCron()
} )
</script>
