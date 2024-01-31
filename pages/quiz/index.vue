<template>
  <v-app-bar color="#EB003C">
    <div style="background:#000548" class="w-4 h-full"></div>
    <img src="/image/app4juh.svg" alt="App4Juh Logo" class="w-32"/>
    <v-app-bar-title>
      <span class="font-bold">Quiz</span>
    </v-app-bar-title>
  </v-app-bar>

  <div class="mt-6">
    <v-text-field
        label="E-Mail"
        v-model="email"
        type="email"/>

    <v-text-field
        label="Passwort"
        v-model="password"
        type="password"/>

    <v-btn @click="signIn">Anmelden</v-btn>
  </div>
</template>
<script setup>
definePageMeta({layout: 'quiz'})
const email = ref('royudo@googlemail.com')
const password = ref('Akkon1952!')
const appwrite = useAppwrite()

const signIn = async () => {
  const data = await appwrite.account.createEmailSession(email.value, password.value)
  console.log('data', data)
  await checkLogin()
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
