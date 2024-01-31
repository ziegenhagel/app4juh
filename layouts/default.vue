<template>
  <v-app>
    <v-app-bar flat>
      <img src="/image/app4juh_blau.svg" alt="App4Juh Logo" class="w-32 h-full mx-auto"/>
    </v-app-bar>

    <template v-if="locked">

      <!-- pin 1044 must be entered to unlock -->
      <pin v-model="locked"/>
    </template>
    <template v-else>
      <v-app-bar class="-mt-3">
        <v-tabs
            class="mx-auto max-w-6xl"
            v-model="activeTab" grow color="#EB003C">
          <v-tab v-for="tab in tabs"
                 :to="'/'+tab.toLowerCase()"
                 :key="tab">{{ tab }}
          </v-tab>
        </v-tabs>
      </v-app-bar>
      <v-container>
        <v-main>
          <div class="max-w-6xl mx-auto">
            <slot/>

            <!--          <v-btn class="w-full mt-4 " variant="text" @click="logout">Ausloggen</v-btn>-->
          </div>
        </v-main>
      </v-container>
    </template>
  </v-app>
</template>
<script setup lang="ts">
const tabs = ['Apps', 'Material', 'Ideen']
const activeTab = ref(tabs[0])

// see if locked is false in local storage otherwise always true
const locked = ref(localStorage.getItem('locked') === 'false' ? false : true)

// when locked changes, save to local storage
watch(locked, (newValue) => {
  localStorage.setItem('locked', newValue)
})

// const supabase = useSupabaseClient()
// const logout = async () => {
//   await supabase.auth.signOut()
//   navigateTo('/login')
// }
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
