<script setup lang="ts">
const email = ref('')
const password = ref('')
const form = ref()
const backend = useRuntimeConfig().public.backend

async function login() {
  const { valid } = await form.value.validate()
  if (!valid) {
    return
  }
  const res = await fetch(`${backend}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
    headers: {'Content-Type': 'application/json'}
  })
  const json = await res.json()
  if(!res.ok) {
    return alert('Error: ' + json.message)
  }
  const {token} = json
  localStorage.setItem('token', token)
  navigateTo('/')
}
</script>

<template>
  <div class="card2 mt-10">
    <v-card class="card pa-8" elevation="10">
      <h1 class="text-center text-red mb-5">Login</h1>
      <v-form ref="form">
        <v-text-field color="red" :rules="[e => !!e || 'Email is required']" v-model="email" label="Enter your email"
          variant="outlined" density="compact"></v-text-field>
        <v-text-field color="red" v-model="password" label="Enter your password" type="password"
          :rules="[e => !!e || 'Email is required']" variant="outlined" density="compact"></v-text-field>
        <div class="d-flex justify-end mr-5">
          <v-btn @click="login" class="bg-red text-white">login</v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<style scoped>
.card {
  width: 600px;
}

.card2 {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
