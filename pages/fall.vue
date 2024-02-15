<template>
  <div>
    <v-app-bar color="#eb003c" dark>
      <img src="/image/app4juh.svg" alt="App4Juh Logo" class="w-32"/>
      <v-app-bar-title>
        <span class="font-bold">Fall</span> erstellen
      </v-app-bar-title>
    </v-app-bar>
    <main class="max-w-lg pb-10 mx-auto px-4 mt-10">

      <template v-if="step==0">
        <h1 class="text-4xl mb-6">Einstellungen</h1>
        <h2 class="text-2xl mt-4 mb-6">Welchen Kurs machst du?</h2>
        <div class="flex flex-col gap-4">
          <v-btn v-for="course in courses" @click="form.course = course" size="x-large" rounded
                 :color="course.color"
                 :variant="form.course?.title!== course.title
                 && form.course !== null
                  ? 'outlined' : 'elevated'"
                 class="w-full"
                 style="text-transform:none"
                 :prepend-icon="course.icon">
            {{ course.title }}
          </v-btn>

        </div>
        <h2 v-if="form.course" class="text-2xl mt-8 mb-6">Und welche Zielgruppe ist heute anwesend?</h2>
        <v-text-field
            v-if="form.course"
            autofocus
            v-model="form.zielgruppe"
            label="Zielgruppe"
            placeholder="z.B. Dachbauer"
            outlined
            class="w-full"
            style="text-transform:none"
        />

        <v-btn @click="step++" v-if="form.course" size="large"
               color="#eb003c"
               class="w-full"
               rounded
               prepend-icon="mdi-check">{{ form.zielgruppe.length > 0 ? 'Festlegen' : 'Keine Zielgruppe' }}
        </v-btn>

      </template>
      <template v-else-if="step==1">
        <h1 class="text-4xl mb-6">{{ form.course.title }}</h1>
        <h2 class="text-2xl mt-4 mb-6">Auf welcher Insel bist du?</h2>

        <v-btn size="x-large" rounded
               color="#eb003c"
               class="w-full mb-4"
               style="text-transform:none"
               @click="zuFall"
               prepend-icon="mdi-shuffle-variant">
          Mir egal, Hauptsache bunt!
        </v-btn>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <v-btn v-for="(insel,i) in inseln"
                 @click="inselFall(insel)"
                 stacked
                 rounded
                 class="rounded-full h-auto aspect-square"
                 v-show="insel.fall"
                 :color="insel.color">
            <img :src="'/quiz/inseln/i' +i+ '.svg'" class="w-16 h-16 aspect-square rounded-full"/>
            <h1 class="font-semibold text-lg text-white" style="line-height:110%;text-transform:none;">{{
                insel.name
              }}</h1>
          </v-btn>
        </div>
      </template>
    </main>
  </div>
</template>
<script setup>
definePageMeta({layout: 'quiz'})
import {inseln} from "~/composables/inseln"
useHead({
  title: 'Fälle',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: 'Erstelle einen Fall für deinen Kurs'
    }
  ]
})

const step = ref(0)
const courses = [
  {
    title: 'DVB Busfahrer',
    chatgpt_title: 'Erste Hilfe Kurs Speziell für DVB Busfahrer',
    short: 'DVB',
    icon: 'mdi-bus',
    color: '#ffb800'

  },
  {
    title: 'Erste Hilfe Kurs',
    chatgpt_title: 'Erste Hilfe Kurs nach DGUV 304-001',
    short: 'EH',
    icon: 'mdi-heart-pulse',
    color: '#eb003c'
  },
  {
    title: 'Schulsanitätsdienst',
    chatgpt_title: 'Erste Hilfe Kurs erweitert auf Schulsanitätsdienst Niveau',
    icon: 'mdi-school',
    short: 'SSD',
    color: '#2f7cc2'
  },
  {
    title: 'Sanitätshelfer',
    chatgpt_title: 'Sanitätshelfer Qualifikation in 87 UE',
    short: 'SanH',
    icon: 'mdi-hospital-building',
    color: '#4b5257'
  }
]
const form = ref({
  course: null,
  zielgruppe: '',
  insel: null,
  fallauswahl: ''
})

// watch auf course, falls der dvb wird kannst du die zielgruppe auf "Busfahrer" setzen
watch(() => form.value.course, (course) => {
  if (course?.short === 'DVB') {
    form.zielgruppe = 'Busfahrer'
    step.value++
  }
})


const inselFall = (insel) => {
  form.insel = insel
  form.fallauswahl = insel.fall
  submit()
}
const zuFall = () => {
  form.insel = null
  form.fallauswahl = ''
  submit()
}

const submit = async () => {
  console.log('form', form.value)
  // const proxy prefix url
  const url = 'https://cors.app4juh.de/'
  // const api url
  const api = 'https://p2.faktorxmensch.com/api/service/app4juh/fall'

  // have a swal that is loading forever and not closeable and only shows laoding
  Swal.fire({
    title: 'Wähle Fallbeispiel',
    html: 'Dein Fallbeispiel wird generiert. Bitte warten...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading()
    }
  })

  // post there in the for of the post body being {kursart, insel, zielgruppe, fall}
  fetch(url + api + '?kursart=' + encodeURIComponent(form.value.course.chatgpt_title) + '&insel=' + encodeURIComponent(form.value.insel?.name) + '&zielgruppe=' + encodeURIComponent(form.value.zielgruppe) + '&fall=' + encodeURIComponent(form.value.fallauswahl)
  ).then(response => response.json())
      .then(async data => {
        console.log('Success:', data);
        /* beispiel antwort
        {
    "diagnose_schlagwort": "Herzinfarkt",
    "fallbeispiel_aufgabe": "Sie sind als Busfahrer für die DVB unterwegs. Plötzlich klagt ein Fahrgast über starke Schmerzen in der Brust und Atemnot. Er wirkt blass und schwitzt stark. Wie reagieren Sie?",
    "fallbeispiel_aufloesung": "Der Fahrgast zeigt typische Anzeichen eines Herzinfarkts. Als Busfahrer im DVB - Erste Hilfe Kurs haben Sie gelernt, wie Sie bei einem Herzinfarkt vorgehen sollten. Sie stoppen den Bus an einer sicheren Stelle, stellen den Warnblinker an und informieren die Leitstelle über den Notfall. Sie bitten die anderen Fahrgäste, den Bus zu verlassen und rufen weitere Hilfe herbei. Da Sie als Busfahrer über erweiterte Erste-Hilfe-Kenntnisse verfügen, können Sie dem Fahrgast beim Platznehmen unterstützen und ihn dazu ermutigen, sich den Oberkörper zu lockern und tief durchzuatmen. Sie überwachen sein Bewusstsein und seine Atmung und bereiten sich darauf vor, bei einem Herzstillstand eine Herzdruckmassage durchzuführen, falls erforderlich. Sie nutzen die im Bus befindliche Ausrüstung, wie den Defibrillator, um im Ernstfall lebensrettende Maßnahmen einzuleiten. Sobald professionelle Hilfe eintrifft, übergeben Sie die weitere Versorgung des Patienten an das Rettungsteam.",
    "success": true
}
         */
        if (data.success) {
          await Swal.fire({
            title: 'Fallbeispiel',
            html: data.fallbeispiel_aufgabe,
            icon: 'success',
            confirmButtonText: 'Auflösung anzeigen'
          })

          await Swal.fire({
            title: data.diagnose_schlagwort,
            html: data.fallbeispiel_aufloesung,
            icon: 'success',
            confirmButtonText: 'Fall beenden'
          })
        } else {
          await Swal.fire({
            title: 'Fehler',
            html: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut!',
            icon: 'error',
            confirmButtonText: 'Okay'
          })
        }
      })
      .catch(async (error) => {
        console.error('Error:', error);
        await Swal.fire({
          title: 'Fehler',
          html: 'Es ist ein Fehler aufgetreten: ' + error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      });
}

</script>
