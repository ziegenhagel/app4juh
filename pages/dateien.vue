<template>
  <div class="text-4xl">
    <v-skeleton-loader elevation="2" type="article" v-if="path == null"/>
    <v-btn @click="goBack" v-if="path?.length > 1" class="mb-2">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-card v-if="files.length > 0">
      <v-list lines="one">
        <template v-if="files.filter(item => item.isDir).length > 0">
          <v-list-subheader>Ordner</v-list-subheader>
          <v-list-item
              v-for="folder in files.filter(item => item.isDir)"
              :title="folder.name"
              @click="readDir(folder.path)"
              prepend-icon="mdi-folder"/>
          <v-divider inset></v-divider>
        </template>

        <template v-if="files.filter(item => !item.isDir).length > 0">
          <v-list-subheader>Dateien</v-list-subheader>
          <v-list-item
              v-for="file in files.filter(item => !item.isDir)"
              :key="file.name"
              @click="openFile(file.path)"
              :title="file.name"
              prepend-icon="mdi-file"/>
        </template>

      </v-list>
    </v-card>
  </div>
</template>
<script setup>
const files = ref([])
const corsURI = 'https://cors.app4juh.de/'
const baseURI = corsURI + 'https://files.app4juh.de/api/public/share/dVl84zgi'
const path = ref(null)

const readDir = async (url) => {
  const response = await fetch(baseURI + url)
  const data = await response.json()
  path.value = url
  files.value = data.items
  // entferne dateien die mit . beginnen
  files.value = files.value.filter(item => !item.name.startsWith('.'))
}

const goBack = () => {
  const url = path.value.split('/')
  url.pop()
  readDir(url.join('/'))
}

onMounted(() => {
  readDir('/')
})

const openFile = (url) => {
  window.open('https://files.app4juh.de/api/public/dl/dVl84zgi' + url + '?inline=true')
}

</script>
