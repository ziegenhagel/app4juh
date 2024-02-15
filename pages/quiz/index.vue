<template>
  <v-app-bar color="#EB003C">
    <div style="background:#000548" class="w-4 h-full"></div>
    <img src="/image/app4juh.svg" alt="App4Juh Logo" class="w-32"/>
    <v-app-bar-title>
      <span class="font-bold">Quiz</span>
    </v-app-bar-title>
  </v-app-bar>

  <div class="max-w-lg mx-auto px-4 mt-20">
    <h1 class="text-4xl mb-6">Anmelden</h1>
    <v-text-field
        label="E-Mail"
        v-model="email"
        variant="outlined"
        type="email"/>

    <v-text-field
        label="Passwort"
        variant="outlined"
        v-model="password"
        type="password"/>

    <v-btn
        color="#EB003C"
        size="large"
        :loading="loading"
        prepend-icon="mdi-login"
        @click="signIn">Anmelden</v-btn>
  </div>
</template>
<script setup>
definePageMeta({layout: 'quiz'})
const email = ref('')
const password = ref('')
const loading = ref(false)
const appwrite = useAppwrite()

const signIn = async () => {
  loading.value = true
  const data = await appwrite.account.createEmailSession(email.value, password.value)
  console.log('data', data)
  await checkLogin()
  loading.value = false
}

// check if user is logged in appwrite.account.get()
const checkLogin = async () => {
  try {
    const data = await appwrite.account.get()
    console.log('logged in?', data)
    // redirect to /manage
    if (data.$id) {
      navigateTo('/quiz/manage')
    }
  } catch (err) {
    console.log('err', err)
  }
}

await checkLogin()
</script>
