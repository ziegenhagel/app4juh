<template>
  <v-app>
    <v-main>
      <div class="max-w-6xl mx-auto">
        <slot/>
      </div>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
useHead({
  title: 'Quiz',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: 'Quiz für Ausbildung'
    }
  ]
})
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
.v-application, body {
  font-family: 'Maven Johanniter', sans-serif;
}
</style>
