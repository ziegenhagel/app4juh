<template>
  <v-app>
    <v-app-bar flat>
      <img src="/image/app4juh_blau.svg" alt="App4Juh Logo" class="w-32 h-32 mx-auto"/>
    </v-app-bar>
    <v-app-bar flat class="-mt-3">
      <v-tabs v-model="activeTab" grow color="#EB003C">
        <v-tab v-for="tab in tabs" :key="tab">{{ tab }}</v-tab>
      </v-tabs>
    </v-app-bar>
    <v-main class="bg-gray-100">

    </v-main>
  </v-app>
</template>
<script setup lang="ts">
const tabs = ['Apps', 'Dateien', 'Ideen']
const activeTab = ref(tabs[0])
</script>
<style>
.v-slide-group {
  height: 3em;
  margin-bottom: -1em;
}

.v-tab.v-tab.v-btn {
  height: 3em;
  text-transform: none;
  font-weight: 550;
  font-size: 1em;
}
</style>
