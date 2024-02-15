<template>
  <div class="grid grid-cols-2 gap-x-4 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
  md:gap-x-8 lg:gap-x-12 xl:gap-x-16
  justify-center items-center
  max-w-6xl mx-auto
">
    <div v-for="(app,index) in data" :key="app.title" class="-mt-6 md:-mt-2 lg:mt-0">
      <nuxt-link :to="app.url"
                 :disabled="app.disabled"
                 :class="{'opacity-50 pointer-events-none cursor-not-allowed': app.disabled}"
                 class="text-center rounded-xl px-2 overflow-hidden">
        <img :src="'/appicons/' + index + '.jpeg'" class="aspect-square shadow-lg"/>
        <div class="font-semibold text-2xl pt-2">{{ app.title }}</div>
      </nuxt-link>
    </div>
  </div>
</template>
<script setup>
// import {ID, Client} from "appwrite";
useHead({
  title: 'Apps',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: 'Apps der Johanniter-Unfall-Hilfe e.V.'
    }
  ]

})

// const client2 = new Client()
//     .setEndpoint('https://appwrite.app4juh.de/v1')
//     .setProject('65b9164341c233319168');

// const client = useAppwrite()
// const {account, database, realtime} = client

// try {
//   // const account = appwrite.account;
//   await account.createEmailSession('test@example.com','test@example.com');
//   console.log('Successfully logged in');
//   // Handle successful login, like redirecting the user
// } catch (error) {
//   console.error('Error logging in:', error.message);
//   // Handle login errors
// }

// try {
//   const res = await account.get()
//   console.log(res)
// } catch (err) {
//   console.log(err)
// }
// console.log('client', client)
// console.log('client2', client2)
//
//
// client2.subscribe('databases', response => {
//   console.log('Database event received', response)
//   if (response.events.includes('buckets.*.files.*.create')) {
//     // Log when a new file is uploaded
//     console.log(response.payload);
//   }
// });
//
// const promise = database.createDocument(
//     '65b917095f3f32e043b8',
//     '65b9171323ba8a72f465',
//     ID.unique(),
//     {
//       name: 'John Doe',
//       status: 'draft',
//     }
// );
//
// promise.then(function (response) {
//   console.log(response);
// }, function (error) {
//   console.log(error);
// });
//
const data = ref([
  {
    title: '112 Trainer',
    disabled: false,
    subtitle: 'Simulieren von Anrufen',
    url: 'https://112.app4juh.de',
  },
  {
    title: 'Fileshare',
    disabled: false,
    subtitle: 'Teile Dateien mit anderen',
    url: 'https://pairdrop.net'
    //https://qr.gofxm.de/
  },
  {
    title: 'Fallbeispiele',
    disabled: true,
    subtitle: 'Fallbeispiele für die Ausbildung',
    url: 'https://fallbeispiele.app4juh.de',
  },
  {
    title: 'Quiz',
    disabled: false,
    subtitle: 'Quiz für die Ausbildung',
    url: 'https://app4juh.de/quiz',
  }
])
</script>
<style>
img {
  border-radius: 26%;
}
</style>
