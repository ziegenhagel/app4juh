<template>
  <v-app-bar color="#eb003c">
    <div style="background:#000548" class="p-2 h-full">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </div>
    <img src="/image/app4juh.svg" alt="App4Juh Logo" class="w-32"/>
    <v-app-bar-title>
      <span class="font-bold">Accounts</span> verwalten
    </v-app-bar-title>
    <template #append>
      <v-btn @click="play"
             v-if="currentQuiz"
             color="#deff00"
             variant="flat" prepend-icon="mdi-play">Quiz starten
      </v-btn>
      <!--      <v-btn @click="logout" color="white"  variant="flat" prepend-icon="mdi-logout">Ausloggen</v-btn>-->
    </template>

  </v-app-bar>

  <!--  <v-navigation-drawer v-model="drawer">-->
  <!--    <div class="px-2 mt-2">-->
  <!--      <v-skeleton-loader type="list-item-avatar" v-for="i in 5" v-if="quizzes.length === 0"/>-->
  <!--      <template v-else>-->
  <!--        <v-list-->
  <!--            id="quiz-list"-->
  <!--            class="space-y-2"-->
  <!--            item-props v-model="currentQuiz" :items="quizzes"/>-->
  <!--      </template>-->
  <!--      <v-spacer/>-->
  <!--      <v-btn class="w-full mt-1" @click="createQuiz()" variant="tonal" prepend-icon="mdi-plus">Quiz erstellen </v-btn>-->
  <!--    </div>-->
  <!--    <template #append>-->
  <!--      <div class="p-2">-->
  <!--        <v-btn to="/quiz/manage" class="w-full" size="large" color="#010545" variant="flat" prepend-icon="mdi-chevron-left">-->
  <!--        Verlassen-->
  <!--        </v-btn>-->
  <!--      </div>-->
  <!--    </template>-->
  <!--  </v-navigation-drawer>-->

  <div class="mt-12 px-4">
    <v-card>
      <v-card-title>
        <h1 class="text-4xl mt-2 mb-3">Account erstellen</h1>
      </v-card-title>
      <v-card-text>
        <v-text-field
            label="E-Mail"
            v-model="email"
            variant="outlined"
            type="email"/>
        <v-text-field
            label="Passwort"
            variant="outlined"
            v-model="password"
            type="text"/>
        <div class="flex">
          <v-btn
              color="#010545"
              class="me-2"
              prepend-icon="mdi-refresh"
              size="large"
              @click="refreshPassword">Passwort neu generieren
          </v-btn>
          <v-spacer/>
          <v-btn
              color="#eb003c"
              size="large"
              :loading="loading"
              :disabled="password !== password2 || email.length === 0 || password.length === 0"
              prepend-icon="mdi-check"
              @click="createAccount">Account erstellen
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script setup>
import {Client, Databases, ID, Query} from "appwrite";

definePageMeta({layout: 'quiz'})
const appwrite = useAppwrite()

const email = ref('accounts2@faktorxmensch.com')

// 30 zufällige kurze deutsche Wörter als basis für das passwort
const natur_words = ['Sonne', 'Mond', 'Sterne', 'Himmel', 'Wolke', 'Regen', 'Schnee', 'Wind', 'Sturm', 'Blitz', 'Donner', 'Nebel', 'Wetter', 'Wolke', 'Regenbogen', 'Sonne', 'Mond', 'Stern', 'Himmel', 'Wolke', 'Regen', 'Schnee', 'Wind', 'Sturm', 'Blitz', 'Donner', 'Nebel', 'Wetter', 'Wolke', 'Regenbogen']
const food_words = ['Apfel', 'Birne', 'Banane', 'Erdbeere', 'Kirsche', 'Pfirsich', 'Zitrone', 'Orange', 'Mandarine', 'Kiwi', 'Ananas', 'Melone', 'Wassermelone', 'Traube', 'Weintraube', 'Erdbeere', 'Kirsche', 'Pfirsich', 'Zitrone', 'Orange', 'Mandarine', 'Kiwi', 'Ananas', 'Melone', 'Wassermelone', 'Traube', 'Weintraube', 'Erdbeere', 'Kirsche', 'Pfirsich']
const safeRandomPassword = () => natur_words[Math.floor(Math.random() * natur_words.length)] + Math.floor(Math.random() * 8 + 1) + food_words[Math.floor(Math.random() * food_words.length)]

const password = ref(safeRandomPassword())
const password2 = password
const loading = ref(false)

const refreshPassword = () => {
  password.value = safeRandomPassword()
}

const user = await appwrite.account.get()

const createAccount = async () => {
  loading.value = true
  if (password.value !== password2.value) {
    return alert('Passwörter stimmen nicht überein')
  }
  try {
    const data = await appwrite.account.create(ID.unique(), email.value, password.value)
    // const data = {$id: '1234'} // TODO: remove this line
    console.log('data', data)
    loading.value = false
    if (data.$id) {


      // kopiere alle quizeze vom aktuellen benutzer
      const userId = user.$id

      const quizzes = await appwrite.database.listDocuments('quiz', 'quizzes', [
        Query.equal('user', userId)
      ])
      console.log('quizzes', quizzes)

      console.log('quizzes', quizzes)

      let titles = []
      for (const quiz of quizzes.documents) {
        const docId = ID.unique()
        const newQuiz = appwrite.database.createDocument('quiz', 'quizzes',
            docId,
            {
              title: quiz.title,
              subtitle: quiz.subtitle,
              user: data.$id,
              questions: quiz.questions,
              insel: quiz.insel,
            })
        console.log('newQuiz', newQuiz)

        titles.push(quiz.title)
      }

      Swal.fire({
        title: 'Account erstellt',
        html: 'Du kannst dich jetzt mit der E-mail <b>' + email.value + '</b> anmelden! Folgende Nachricht kannst Du dem Benutzer senden: <textarea class="border p-1 rounded w-full mt-3 h-24">' +
            'Hallo, \n' +
            'Dein Account für das Quiz im App4juh unter https://app4juh.de/ wurde erfolgreich erstellt. Die PIN ist 1044. Für die Quiz Verwaltung kannst Du dich mit deiner E-Mail-Adresse "' + email.value + '" und deinem Passwort "' + password.value + '" unter https://app4juh.de/quiz/ anmelden.\n' +
            'Folgende Quizze wurden ebenfalls kopiert: ' + titles.join(', ') + '\n' +
            'Viel Spaß! \n' +
            user.name +
            '</textarea>',

        icon: 'success',
        confirmButtonText: 'Okay'
      })


    } else {
      Swal.fire({
        title: 'Fehler',
        html: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut!',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  } catch (err) {
    console.log('err', err)
    loading.value = false
    Swal.fire({
      title: 'Fehler',
      html: 'Es ist ein Fehler aufgetreten: ' + err.message,
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }
}
</script>

<style>
.v-main {
  @apply bg-gray-100;
}

.v-btn {
  font-size: 1.2em;
  text-transform: none;
}

div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm {
  background-color: #eb003c !important;
  border-radius: 0.5em !important;
}

.v-switch__track.bg-green {
  background-color: #b2d200 !important;
  //border: 2px solid #000548 !important;
}

.v-switch__thumb {
  //background-color: #eb003c !important;
}

.swal2-confirm {
  outline: none !important;
  box-shadow: 0 0 0 3px #eb003c44 !important;
  font-size: 1.1em !important;
}

#quiz-list {
  .v-list-item {
    @apply py-2 px-2 rounded;

    .v-list-item-title {
      @apply font-bold;
    }
  }
}
</style>
