<template>
  <v-app-bar color="#EB003C">
    <div style="background:#000548" class="w-4 h-full"></div>
    <img src="/image/app4juh.svg" alt="App4Juh Logo" class="w-32"/>
    <v-app-bar-title>
      <span class="font-bold">Quiz</span> verwalten
    </v-app-bar-title>
    <template #append>
      <v-btn @click="play" variant="elevated" prepend-icon="mdi-play">Quiz starten</v-btn>
      <!--      <v-btn @click="logout" color="white"  variant="flat" prepend-icon="mdi-logout">Ausloggen</v-btn>-->
    </template>

  </v-app-bar>

  <v-navigation-drawer v-model="drawer">
    <div class="px-2 mt-2">
      <v-skeleton-loader type="list-item-avatar" v-for="i in 5" v-if="quizzes.length === 0"/>
      <template v-else>
        <v-list
            class="space-y-2"
            item-props v-model="currentQuiz" :items="quizzes"/>
        <v-btn class="w-full"
               @click="createQuiz"
               variant="tonal" prepend-icon="mdi-plus">Quiz erstellen
        </v-btn>
      </template>
      <v-spacer/>
    </div>

    <template #append>
      <div class="p-2">
        <v-btn @click="importQuiz" class="w-full" color="primary" variant="flat" prepend-icon="mdi-import">Quiz
          importieren
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
  <div class="mt-12" v-if="currentQuiz">
    <div class="flex">
      <h1 class="mb-4 text-3xl font-bold">{{ currentQuiz?.title }}</h1>
      <v-spacer/>
      <v-btn @click="saveCurrentQuiz"
             :loading="loading"
             class="mb-4" color="primary" prepend-icon="mdi-content-save">Speichern
      </v-btn>
    </div>
    <!--    <v-select v-model="currentQuestion" :items="currentQuiz.questions" item-text="title" item-value="value"-->
    <!--              label="Frage bearbeiten"-->
    <!--              variant="outlined"-->
    <!--              class="w-full"/>-->

    <!-- AKTUELLE FRAGE -->
    <v-card v-for="(question, index) in currentQuiz.questions" :key="index" class="mb-4">
      <v-card-text>
        <v-text-field v-model="question.title" :label="'Frage  ' + (index + 1)" variant="outlined" class="mt-2 w-full"/>
        <div class="flex flex-wrap space-x-2">
          <!--        <v-btn prepend-icon="mdi-plus" @click="addAnswer(question)" color="primary"> Antwort hinzufügen</v-btn>-->
          <!--        <v-btn prepend-icon="mdi-delete" color="error" @click="deleteAnswer(question)"> Antwort löschen</v-btn>-->
        </div>
        <div class="mt-4 md:grid md:grid-cols-2 md:gap-x-4">
          <div v-for="(answer, index) in question.answers" class="flex">
            <v-text-field :key="index" v-model="answer.title" label="Antwort"
                          variant="outlined" class="me-2 w-full"/>
            <v-switch v-model="answer.correct" color="green" inset/>
          </div>
        </div>
        <v-alert density="compact" v-if="question.answers?.filter(answer => answer.correct).length === 0"
                 type="warning">
          Es muss mindestens eine richtige Antwort geben!
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- FRAGE HINZUFÜGEN -->
    <div class="flex gap-2">
      <v-btn @click="shareQuiz" class="mb-10" color="" prepend-icon="mdi-share">Quiz teilen</v-btn>
      <v-spacer/>
      <v-btn @click="addQuestion" class="mb-2" color="primary" prepend-icon="mdi-plus">Frage hinzufügen</v-btn>
    </div>

  </div>
</template>
<script setup>
import {Client, Databases, ID} from "appwrite";


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
  const allquizzes = await appwrite.database.listDocuments('quiz', 'quizzes')
  console.log('allquizzes', allquizzes)
  // get quizzes from user_has_quiz
  const user = await appwrite.account.get()
  const userHasQuiz = await appwrite.database.listDocuments('quiz', 'user_has_quiz')

  console.log('userHasQuiz', userHasQuiz)

  // now filter
  const userQuizzes = allquizzes.documents.filter(quiz => {
    return userHasQuiz.documents.find(userHasQuiz => userHasQuiz.quiz === quiz.$id)
  })
  console.log('userQuizzes', userQuizzes)
  quizzes.value = userQuizzes.map(quiz => ({
    title: quiz.title,
    subtitle: quiz.subtitle,
    value: quiz.$id,
    prependIcon: 'mdi-format-list-text',
    onclick: () => {
      console.log('quiz', quiz)
      currentQuiz.value = {
        title: quiz.title,
        subtitle: quiz.subtitle,
        questions: JSON.parse(quiz.questions),
        $id: quiz.$id,
      }
    }
  }))
}
const createQuiz = async (pOld = null) => {
  // get title and subttle via swal
  let formValues
  if (!pOld) {
    const {value: formValuesT} = await Swal.fire({
      title: 'Quiz erstellen',
      html:
          '<input id="swal-input1" class="swal2-input" placeholder="Titel">' +
          '<input id="swal-input2" class="swal2-input" placeholder="Untertitel">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value
        ]
      }
    })
    formValues = formValuesT
  } else {
    formValues = [pOld.title, pOld.subtitle]
  }

  // create id
  const docId = ID.unique()
  const data = await appwrite.database.createDocument('quiz', 'quizzes',
      docId,
      {
        title: formValues[0],
        subtitle: formValues[1],
        questions:
            pOld ? pOld.questions :
                '[{"title":"Neue Frage #1","answers":[{"title":"Antwort 1","correct":true},{"title":"Antwort 2","correct":false},{"title":"Antwort 3","correct":false},{"title":"Antwort 4","correct":false}]}]'
      })
  console.log('data', data)
  console.log('docId', docId)

  const user = await appwrite.account.get()
  // then add to user_has_quiz
  const userHasQuiz = await appwrite.database.createDocument('quiz', 'user_has_quiz',
      ID.unique(),
      {
        user: user.$id,
        quiz: data.$id
      })
  console.log('userHasQuiz', userHasQuiz)

  await getQuizzes()

  // then select quiz
  currentQuiz.value = quizzes.value.find(quiz => quiz.value === docId)
}

const logout = async () => {
  await appwrite.account.deleteSession('current')
  navigateTo('/quiz')
}

const addQuestion = async () => {
  currentQuiz.value.questions.push({
    title: 'Neue Frage #' + (currentQuiz.value.questions.length + 1),
    answers: [
      {
        title: 'Antwort 1',
        correct: false
      },
      {
        title: 'Antwort 2',
        correct: false
      },
      {
        title: 'Antwort 3',
        correct: false
      },
      {
        title: 'Antwort 4',
        correct: false
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
</script>

<style>
.v-main {
  @apply bg-gray-100;
}
</style>
