<script setup lang="ts">
const name = ref('')
const dob = ref('')
const phone = ref('')
const vehicle = ref('')
const account = ref('')
const form = ref()
const dobError = ref(false)

onMounted(async () => {
  let token = localStorage.getItem('token')
  if (!token) {
    return navigateTo('/login')
  }
})

const backend = useRuntimeConfig().public.backend

async function createUser() {
  if(!dob.value) {
    dobError.value = true;
  }
  const { valid } = await form.value.validate()
  if (!valid) {
    return
  }
  if(dobError.value) {
    return
  }
  const token = localStorage.getItem('token')
  const res = await fetch(`${backend}/users`, {
    method: 'POST',
    body: JSON.stringify({
      name: name.value,
      dob: dob.value,
      phone: phone.value,
      account: account.value,
      vehicle: vehicle.value,
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  const json = await res.json()
  if(!res.ok) {
    return alert('Error: ' + json.message)
  }
  navigateTo('/users')
}
</script>

<template>
  <Header></Header>
  <v-container>
    <div class="d-flex justify-between align-center mt-5">
      <h1>Add User</h1>
    </div>

    <div class="bg-red-lighten-4 pa-4">
      <NuxtLink to="/" class="me-2 fw-semibold td-none align-center">Home</NuxtLink>
      <v-icon icon="mdi-chevron-right" class="me-2 text-red"></v-icon>
      <NuxtLink to="/users" class="me-2 fw-bold td-none">Users</NuxtLink>
      <v-icon icon="mdi-chevron-right" class="me-2 text-red"></v-icon>
      <NuxtLink class="disabled me-2 fw-bold td-none text-red-lighten-2">Add</NuxtLink>
    </div>

    <v-card class="pa-8 mt-5" elevation="6">
      <v-form ref="form" class="mx-auto" style="max-width: 600px;">
        <v-text-field v-model="name" density="compact" color="red" label="Name" placeholder="Enter name" variant="outlined"
          :rules="[e => !!e || 'Name is required']" class="mb-1"></v-text-field>

        <p class="fz-15 text-grey-darken-2">Date of birth</p>
        <input v-model="dob" type="date" placeholder="Select DOB" class="bg-grey-lighten-3 w-100 h-3 pa-4" >
        <p v-if="dobError" class="ps-4 text-red-darken-3 fz-17">Date of birth is required</p>
        <div class="mb-5"></div>

        <v-text-field v-model="phone" density="compact" color="red" label="Phone" placeholder="Enter phone"
          variant="outlined" class="mb-1"></v-text-field>

        <v-text-field v-model="vehicle" density="compact" color="red" label="Vehicle" placeholder="Enter vehicle"
          variant="outlined" class="mb-1"></v-text-field>

        <v-text-field v-model="account" density="compact" color="red" label="Account" placeholder="Enter account"
          variant="outlined" class="mb-1"></v-text-field>

        <div class="d-flex justify-end">
          <v-btn class="bg-red text-white px-10" @click="createUser">save</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>
