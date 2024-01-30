<template>
  <v-app>
    <v-app-bar flat>
      <img src="/image/app4juh_blau.svg" alt="App4Juh Logo" class="w-32 h-32 mx-auto"/>
    </v-app-bar>
    <v-app-bar
        flat class="-mt-3">
      <v-tabs
          class="mx-auto max-w-6xl"
          v-model="activeTab" grow color="#EB003C">
        <v-tab v-for="tab in tabs" :key="tab">{{ tab }}</v-tab>
      </v-tabs>
    </v-app-bar>
    <v-container>
      <v-main>
        <apps v-if="activeTab === 0"/>
        <files v-if="activeTab === 1"/>
      </v-main>
    </v-container>
  </v-app>
</template>
<script setup lang="ts">
const tabs = ['Apps', 'Dateien', 'Ideen']
const activeTab = ref(tabs[0])
</script>
<style>
.v-application__wrap {
  @apply bg-gray-100;
}

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

/* get fonts in /fonts
MAVENJOHANNITER-BOLD.TTF
MAVENJOHANNITER-MEDIUM.TTF
MAVENJOHANNITER-REGULAR.TTF
MAVENJOHANNITER-SEMIBOLD.TTF
 */

@font-face {
  font-family: 'Maven Johanniter';
  src: url('/fonts/MAVENJOHANNITER-REGULAR.TTF') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'Maven Johanniter';
  src: url('/fonts/MAVENJOHANNITER-MEDIUM.TTF') format('truetype');
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: 'Maven Johanniter';
  src: url('/fonts/MAVENJOHANNITER-SEMIBOLD.TTF') format('truetype');
  font-weight: 600;
  font-style: normal;
}

@font-face {
  font-family: 'Maven Johanniter';
  src: url('/fonts/MAVENJOHANNITER-BOLD.TTF') format('truetype');
  font-weight: bold;
  font-style: normal;
}

/* and use them everywhere */
.v-application {
  font-family: 'Maven Johanniter', sans-serif;
}
</style>
