<script lang="ts" setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const pin = ref('')
const unlock = () => {
  if (pin.value === '1044') {
    emit('update:modelValue', false)
  }
}
const field = ref(null)
onMounted(() => {
  field.value.focus()
})
</script>

<template>
  <!-- pin 1044 must be entered to unlock -->

  <div class="mt-40 max-w-xl mx-auto">
    <v-text-field
        class="text-center w-32"
        label="PIN"
        v-model="pin"
        variant="outlined"
        autofocus
        ref="field"
        min="1000"
        maxlength="4"
        @update:model-value="unlock"
        max="9999"/>
    <!--    <v-btn @click="unlock">Entsperren</v-btn>-->
  </div>
</template>

