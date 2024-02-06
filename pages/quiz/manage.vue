<template>
  <v-app-bar color="#eb003c">
    <div style="background:#000548" class="p-2 h-full">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </div>
    <img src="/image/app4juh.svg" alt="App4Juh Logo" class="w-32"/>
    <v-app-bar-title>
      <span class="font-bold">Quiz</span> verwalten
    </v-app-bar-title>
    <template #append>
      <v-btn @click="play"
             v-if="currentQuiz"
             color="#deff00"
             variant="flat" prepend-icon="mdi-play">Quiz starten
      </v-btn>
      <v-btn @click="logout"
             v-if="!currentQuiz"
             color="white" variant="flat" prepend-icon="mdi-logout">Ausloggen</v-btn>
    </template>

  </v-app-bar>

  <v-navigation-drawer v-model="drawer">
    <div class="px-2 mt-2">
      <v-skeleton-loader type="list-item-avatar" v-for="i in 5" v-if="quizzes.length === 0"/>
      <template v-else>
        <v-list
            id="quiz-list"
            class="space-y-2"
            item-props v-model="currentQuiz" :items="quizzes"/>
      </template>
      <v-spacer/>
      <v-btn class="w-full mt-1" @click="createQuiz()" variant="tonal" prepend-icon="mdi-plus">Quiz erstellen</v-btn>
    </div>

    <template #append>
      <div class="p-2">
        <v-btn @click="importQuiz" class="w-full" size="large" color="#010545" variant="flat" prepend-icon="mdi-import">
          Quiz
          importieren
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
  <div class="mt-12 px-4" v-if="currentQuiz" :key="currentQuiz.$id">
    <div class="flex items-center gap-4 justify-between pb-4">
      <img :src="'/quiz/inseln/i' + (currentQuiz.insel ?? 0) + '.svg'" class="w-16 h-16 rounded-full"/>
      <div>
        <h1 class="text-3xl font-bold" :style="'color: ' + inseln[currentQuiz.insel ?? 0].color">
          {{ currentQuiz.title }}</h1>
        <h3 class="text-xl font-semibold">{{ currentQuiz.subtitle }}</h3>
      </div>
      <v-spacer/>
      <v-btn @click="saveCurrentQuiz"
             :loading="loading"
             class="mb-4" color="#010545" prepend-icon="mdi-content-save">Speichern
      </v-btn>
    </div>
    <!--    <v-select v-model="currentQuestion" :items="currentQuiz.questions" item-text="title" item-value="value"-->
    <!--              label="Frage bearbeiten"-->
    <!--              variant="outlined"-->
    <!--              class="w-full"/>-->

    <!-- AKTUELLE FRAGE -->
    <v-card v-for="(question, index) in currentQuiz.questions" :key="index" class="mb-4 border" variant="flat">
      <v-card-text>
        <v-text-field v-model="question.title" :label="'Frage  ' + (index + 1)" variant="outlined" class="mt-2 w-full"/>
        <div class="flex flex-wrap space-x-2">
          <!--        <v-btn prepend-icon="mdi-plus" @click="addAnswer(question)" color="primary"> Antwort hinzufügen</v-btn>-->
          <!--        <v-btn prepend-icon="mdi-delete" color="error" @click="deleteAnswer(question)"> Antwort löschen</v-btn>-->
        </div>
        <div class="mt-4 md:grid md:grid-cols-2 md:gap-x-4">
          <div v-for="(answer, index) in question.answers" class="flex">
            <v-text-field :key="index" v-model="answer.title"
                          :label="'Antwort ' + ['A', 'B', 'C', 'D', 'E', 'F'][index]"
                          :items="['A', 'B', 'C', 'D', 'E', 'F']" :item-text="item => item" :item-value="item => item"
                          :rules="[v => !!v || 'Eingabe erforderlich']" variant="outlined" class="me-2 w-full"/>
            <v-switch v-model="answer.correct" color="green" inset/>
          </div>
        </div>
        <v-alert density="compact" v-if="question.answers?.filter(answer => answer.correct).length === 0"
                 color="#eb003c"
                 type="warning">
          Es muss mindestens eine richtige Antwort geben!
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- FRAGE HINZUFÜGEN -->
    <div class="flex gap-2">
      <v-btn @click="shareQuiz" class="mb-10" variant="tonal" color="#010545" prepend-icon="mdi-share">Teilen
      </v-btn>
      <v-btn @click="showQr" class="mb-10" variant="tonal" color="#010545" prepend-icon="mdi-qrcode">
        In PowerPoint
        einfügen
      </v-btn>
      <v-spacer/>
      <!-- quiz löschen -->
      <v-btn @click="deleteQuiz" class="mb-10" color="#eb003c" variant="flat" prepend-icon="mdi-delete">Löschen
      </v-btn>
      <v-btn @click="addQuestion" class="mb-2" color="#010545" variant="flat" prepend-icon="mdi-plus">Frage hinzufügen
      </v-btn>
    </div>

  </div>
</template>
<script setup>
import {Client, Databases, ID, Query} from "appwrite";

definePageMeta({layout: 'quiz'})
const appwrite = useAppwrite()
const quizzes = ref([])
const currentQuiz = ref(null)
const drawer = ref(true)
const currentQuestion = ref(null)

// check if  user is logged in
const checkLogin = async () => {
  const data = await appwrite.account.get()
  console.log('logged in?', data)
  // redirect to /manage
  if (!data.$id) {
    navigateTo('/quiz')
  } else {
    await getQuizzes()
  }
}
const getQuizzes = async () => {
  const user = await appwrite.account.get()
  const allquizzes = await appwrite.database.listDocuments('quiz', 'quizzes', [
    Query.equal('user', user.$id)
  ])
  console.log('allquizzes', allquizzes)
  // get quizzes from user_has_quiz
  const userHasQuiz = await appwrite.database.listDocuments('quiz', 'user_has_quiz')

  console.log('userHasQuiz', userHasQuiz)

  // now filter
  const userQuizzes = allquizzes.documents.filter(quiz => {
    return true
    return userHasQuiz.documents.find(userHasQuiz => userHasQuiz.quiz === quiz.$id)
  })
  console.log('userQuizzes', userQuizzes)
  quizzes.value = userQuizzes.map(quiz => ({
    title: quiz.title,
    color: inseln[quiz.insel ?? 0].color,
    subtitle: quiz.subtitle,
    value: quiz.$id,
    // prependIcon: 'mdi-format-list-text',
    // have an image
    prependAvatar: '/quiz/inseln/i' + quiz.insel + '.svg',
    // color: inseln[quiz.insel ?? 0].color,
    onclick: () => {
      console.log('quiz', quiz)
      currentQuiz.value = {
        title: quiz.title,
        subtitle: quiz.subtitle,
        insel: quiz.insel,
        questions: JSON.parse(quiz.questions),
        $id: quiz.$id,
      }
    }
  }))
}

import {inseln} from "~/composables/inseln"

const logout = async () => {
  await appwrite.account.deleteSession('current')
  navigateTo('/quiz')
}

const createQuiz = async (pOld = null) => {
  // get title and subttle via swal
  let formValues
  console.log('pOld', pOld)
  if (!pOld) {

    // get quiz insel index via swal
    const inselIndex = await Swal.fire({
      title: 'Insel für das Quiz auswählen',
      width: 600,
      html:
          '<div id="inselselect" class="grid grid-cols-4 gap-x-4 gap-y-8 my-4">' +
          inseln.map((insel, index) => {
            return '<div class="flex flex-col gap-4 items-center cursor-pointer hover:font-bold' +
                // on click set inselIndex, make font bold and clear all others
                '" onclick="document.getElementById(\'inselIndex\').value = ' + index + '; document.getElementById(\'inselselect\').querySelectorAll(\'.flex\').forEach(el => el.style.fontWeight = \'normal\')' +
                '; this.style.fontWeight = \'bold\'">' +
                '<img src="/quiz/inseln/i' + index + '.svg" class="w-16 h-16 rounded-full" />' +
                '<span class="text-center">' + insel.name + '</span>' +
                '</div>'
          }).join('')
          +
          '</div>' +
          '<input id="inselIndex" type="hidden" class="swal2-input" placeholder="Insel Index">',
      // text auf button
      confirmButtonText: 'Weiter',
      focusConfirm: false,
      preConfirm: () => {
        return document.getElementById('inselIndex').value
      }
    })

    // wenn nichts ausgewählt wurde, dann abbrechen
    if (inselIndex.value === undefined) {
      return
    }

    const {value: formValuesT} = await Swal.fire({
      // title: 'Quiz erstellen',
      html:
          '<div class="flex mt-4 gap-4 items-center">' +
          '<img src="/quiz/inseln/i' + inselIndex.value + '.svg" class="w-16 h-16 rounded-full" />' +
          '<div class="flex flex-col items-start"><h1 class="text-2xl text-left w-full font-bold">Quiz erstellen</h1>' +
          '<h2 class="font-semibold w-full text-left text-xl">' + inseln[inselIndex.value].name + '</h2>' +
          '</div>' +
          '</div>' +
          '<input id="swal-input1" required class="mx-1 swal2-input" placeholder="Titel">' +
          '<input id="swal-input2" required class="mx-1 swal2-input" placeholder="Untertitel">',
      focusConfirm: false,
      // button text
      confirmButtonText: 'Quiz erstellen',
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value
        ]
      }
    })
    console.log('insel index:', inselIndex)
    formValues = [...formValuesT, inselIndex.value]
  } else {
    formValues = [pOld.title, pOld.subtitle, pOld.insel || 0]
  }

  const user = await appwrite.account.get()
  // create uuid 4
  const docId = ID.unique()
  const data = await appwrite.database.createDocument('quiz', 'quizzes',
      docId,
      {
        title: formValues[0],
        subtitle: formValues[1],
        insel: formValues[2],
        user: user.$id,
        questions:
            pOld ? pOld.questions :
                '[{"title":"Neue Frage #1","answers":[{"title":"Antwort 1","correct":true},{"title":"Antwort 2","correct":false},{"title":"Antwort 3","correct":false},{"title":"Antwort 4","correct":false}]}]'
      })
  console.log('data', data)
  console.log('docId', docId)

  // then add to user_has_quiz
  const userHasQuiz = await appwrite.database.createDocument('quiz', 'user_has_quiz',
      ID.unique(),
      {
        user: user.$id,
        quiz: data.$id
      })
  console.log('userHasQuiz', userHasQuiz)

  // wenn das alles geklappt hat, dann sage dem user, dass das quiz erstellt wurde
  await Swal.fire({
    title: 'Quiz erstellt',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  })


  await getQuizzes()

  // then click the last element in the list
  setTimeout(() => {
    document.getElementById('quiz-list').querySelectorAll('.v-list-item')[document.getElementById('quiz-list').querySelectorAll('.v-list-item').length - 1].click()
  }, 100)

  await nextTick()

}


const addQuestion = async () => {
  const correct = Math.floor(Math.random() * 4)
  currentQuiz.value.questions.push({
    title: 'Neue Frage #' + (currentQuiz.value.questions.length + 1),
    answers: [
      {
        title: 'Antwort 1',
        correct: correct === 0
      },
      {
        title: 'Antwort 2',
        correct: correct === 1
      },
      {
        title: 'Antwort 3',
        correct: correct === 2
      },
      {
        title: 'Antwort 4',
        correct: correct === 3
      },
    ]
  })

  // die auch direkt auswählen
  currentQuestion.value = currentQuiz.value.questions[currentQuiz.value.questions.length - 1]
}

onMounted(() => {
  checkLogin()
})
const loading = ref(false)
const saveCurrentQuiz = async () => {
  loading.value = true
  console.log('currentQuiz', currentQuiz.value.$id)
  const data = await appwrite.database.updateDocument('quiz', 'quizzes',
      currentQuiz.value.$id,
      {
        title: currentQuiz.value.title,
        subtitle: currentQuiz.value.subtitle,
        questions: JSON.stringify(currentQuiz.value.questions)
      })
  console.log('data', data)
  loading.value = false

  // show success or error
  if (data.$id) {
    await Swal.fire({
      title: 'Quiz gespeichert',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  } else {
    await Swal.fire({
      title: 'Fehler',
      icon: 'error',
      timer: 2000,
      showConfirmButton: false
    })
  }
}

const play = () => {
  // open in new tab and start quiz
  window.open('/quiz/play/' + currentQuiz.value.$id)
}

const shareQuiz = async () => {
  // zeige die id zum teilen an
  await Swal.fire({
    title: 'Quiz teilen',
    html: 'Teile diese ID mit anderen Trainer:innen:<br><br>' +
        '<div class="text-2xl font-bold">' + currentQuiz.value.$id + '</div>',
    icon: 'info',
    timer: 5000,
    showConfirmButton: false
  })
}

// beim imortieren kann man zwischen mitbearbeiten und kopieren wählen
const importQuiz = async () => {
  // zeige die id zum teilen an
  const {value: formValues} = await Swal.fire({
    title: 'Quiz importieren',
    html:
        '<input id="swal-input1" class="swal2-input" placeholder="Quiz ID">' +
        '<select id="swal-input2" class="hidden swal2-input">' +
        '<option value="copy">Kopieren</option>' +
        '<option value="edit">Mitbearbeiten</option>' +
        '</select>',
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value
      ]
    }
  })

  console.log('formValues', formValues)

  // from all quizzes get the one with the id
  const allquizzes = await appwrite.database.listDocuments('quiz', 'quizzes')
  const quizToCopy = allquizzes.documents.find(quiz => quiz.$id === formValues[0])

  if (!quizToCopy) {
    await Swal.fire({
      title: 'Fehler',
      html: 'Quiz mit der ID <b>' + formValues[0] + '</b> nicht gefunden',
      icon: 'error',
      timer: 5000,
      showConfirmButton: false
    })
    return
  }

  // create new quiz with same data using the create Quiz function
  await createQuiz(quizToCopy)

  // tell user that quiz was imported
  await Swal.fire({
    title: 'Quiz importiert',
    html: 'Das Quiz wurde importiert',
    icon: 'success',
    timer: 5000,
    showConfirmButton: false
  })

}

const currentQR = computed(() => {
  return window.location.origin + '/quiz/play/' + currentQuiz.value.$id + '/pp-' + Math.random().toString(36).substring(7)
})
const showQr = async () => {
  // zeige die id zum teilen an
  await Swal.fire({
    // title: 'Kopiere diesen QR Code und füge ihn in PowerPoint ein',
    // use google charts api, the qr code is THE CURRENT SITE URL, then /quiz/play/ + quiz id + / +  create random long session id
    html: '<div class="w-full flex flex-col items-center justify-center">' +
        '<h2 class="text-2xl font-bold">Kopiere den folgenden QR Code und füge ihn in PowerPoint ein:</h2>' +
        '<img src="https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + currentQR.value + '"/>' +
        '<p>Du musst diesen QR Code dann im Kurs als erster scannen, um das Quiz zu moderieren.</p>' +
        '</div>',
    // icon: 'info',
    // timer: 5000,
    showConfirmButton: false
  })
}

const deleteQuiz = async () => {
  const {isConfirmed} = await Swal.fire({
    title: 'Quiz löschen',
    html: 'Bist du sicher, dass du das Quiz <b>' + currentQuiz.value.title + '</b> löschen möchtest?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ja, löschen',
    cancelButtonText: 'Abbrechen'
  })

  if (isConfirmed) {
    // delete quiz
    const data = await appwrite.database.deleteDocument('quiz', 'quizzes', currentQuiz.value.$id)
    console.log('data', data)

    // delete user_has_quiz
    const user = await appwrite.account.get()
    const userHasQuiz = await appwrite.database.listDocuments('quiz', 'user_has_quiz')
    const userHasQuizToDelete = userHasQuiz.documents.find(userHasQuiz => userHasQuiz.quiz === currentQuiz.value.$id)
    console.log('userHasQuizToDelete', userHasQuizToDelete)
    const userHasQuizDeleted = await appwrite.database.deleteDocument('quiz', 'user_has_quiz', userHasQuizToDelete.$id)
    console.log('userHasQuizDeleted', userHasQuizDeleted)

    // tell user that quiz was deleted
    await Swal.fire({
      title: 'Quiz gelöscht',
      html: 'Das Quiz <b>' + currentQuiz.value.title + '</b> wurde gelöscht',
      icon: 'success',
      timer: 5000,
      showConfirmButton: false
    })

    // get quizzes again
    await getQuizzes()
    currentQuiz.value = null
  }
}
</script>

<style>
.v-main {
  @apply bg-gray-100;
}

.v-btn {
  font-size: 1.1em;
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
