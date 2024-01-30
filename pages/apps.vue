<template>
  <div class="grid grid-cols-2 gap-x-4 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
  md:gap-x-8 lg:gap-x-12 xl:gap-x-16
  justify-center items-center
  max-w-6xl mx-auto
">
    <div v-for="(app,index) in data" :key="app.title" class="-mt-6 md:-mt-2 lg:mt-0">
      <nuxt-link :to="app.url"
                 class="text-center rounded-xl px-2 overflow-hidden">
        <img :src="'/appicons/' + index + '.jpeg'" class="aspect-square"/>
        <div class="font-semibold text-2xl pt-2">{{ app.title }}</div>
      </nuxt-link>
    </div>
  </div>
</template>
<script setup>
const data = ref([
  {
    title: '112 Trainer',
    subtitle: 'Simulieren von Anrufen',
    url: 'https://112.app4juh.de',
  },
  {
    title: 'Fileshare',
    subtitle: 'Teile Dateien mit anderen',
    url: 'https://share.app4juh.de',
  },
  {
    title: 'Fallbeispiele',
    subtitle: 'Fallbeispiele für die Ausbildung',
    url: 'https://fallbeispiele.app4juh.de',
  },
  {
    title: 'Quiz',
    subtitle: 'Quiz für die Ausbildung',
    url: 'https://quiz.app4juh.de',
  }
])
</script>
<style>
img {
  border-radius: 26%;
}
</style>
