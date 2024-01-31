<script setup lang="ts">
// const supabase = useSupabaseClient()
const email = ref('roy-udo.kuehmichel@johanniter.de')
const password = ref('vm#BR%aWHWR8$x')
// const user = useSupabaseUser()

const signIn = async () => {
  // const {data, error} = await supabase.auth.signInWithPassword({
  //   email: email.value,
  //   password: password.value,
  // })
  // if (error) {
  //   console.error(error)
  // } else {
  //   console.log(data)
  //   navigateTo('/apps')
  // }
}
//
// watch(()=>user, (newValue) => {
//   if (newValue) {
//     navigateTo('/apps')
//   }
// }, {immediate: true})
</script>
<template>
  <div>
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
