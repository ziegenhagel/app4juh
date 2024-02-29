<template>
  <h1 class="text-4xl font-bold">Ideen</h1>
  <!-- alle als gelbe zettel -->
  <div class="md:grid md:grid-cols-2 flex flex-col gap-6 xl:grid-cols-3 xl:gap-8 mt-6">
    <div v-for="idea in ideas" :key="idea" class="bg-yellow-200 p-4 shadow lg:shadow-md">
      <p class="text-lg">{{ idea }}</p>
    </div>
  </div>
</template>
<script setup>
const oldIdeas = ['Insel 1, Strasse aufs Whiteboard zeichnen, dann Stückchenweise weiter ausbauen mit Auto hinmalen, zweites Auto daneben, Kurve dazu malen, Rettungswagen dazu, etc.',
    'Im Büro kann man auf Windows Q ein OCR Reader installieren, Roy-Udo hat die Datei dazu. Kein Admin Recht nötig.',
    'Window Power Toys installieren, is mega!',
    'Snapdrop nutzen',
    'Am Ende mit den Memory Karten nutzen, für mehr Zeit und als Wiederholung mit Haptik',
    'Story: Kleiner Max hat Spüli getrunken, blubbert -> Story von Boris',
    'Story: Methanol Vergiftung Der Anasthesist Chefarzt musste Alkohol mittrinken',
    'DKMS und Organspende Ausweis in die Hand drücken',
    'Viel wiederholen, nach jeder Pause kurze gemeinsame Wiederholung',
    'Radiologin in Dresden überfahren, weil kein Eigenschutz',
    'Immer im Unterricht mit Handschuhen arbeiten und Steril arbeiten',
    'Wald und Wiesenmedizin, wenn kein EH Koffer da ist - Selbstschutz Inhalte',
]

const moreIdeas = 'Klicken raus machen, mit Handschuhen arbeiten, mit der App arbeiten, mit Filmen arbeiten, App for You, selbst spielen, selbst legen lassen, Plakate, Helikopter, Flip-Chart, Helm hinfallen, richtiges RUD, Motivation am Anfang, Diamanten, Vollbild Fallbeispiel Bilder auch mit Gerüchen und Szene erzählen, Monitor schwarz machen, Verband, Päckchen, der Knoten, der Angehörige und andere Störungen, Plakate miteinander in Verbindung setzen, organisatorisches in der Mitte, mögliches AB Testing, Namen lernen und sitzplan, 1 Fakt pro Person'.split(', ')
const ideas = [...oldIdeas, ...moreIdeas]

useHead({
  title: 'Ideen',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: 'Notizen und Ideen für die Ausbildung'
    }
  ]
})
</script>
