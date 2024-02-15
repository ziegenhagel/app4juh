<template>
</template>
<script setup>
onMounted(() => {
  if(typeof window === 'undefined') return navigateTo('/apps')
  window.location.href = '/apps'
  // return navigateTo('/apps')
})
</script>
