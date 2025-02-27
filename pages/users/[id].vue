<script setup lang="ts">
const user = ref<User | undefined>()
const form = ref()
const route = useRoute()

const dobDay = ref('')
const dobMonth = ref('')
const dobYear = ref('')
const dobHour = ref('')
const dobMinute = ref('')
const dobSecond = ref('')

interface User {
  id: string
  name: string
  dob: string
  birth_place?: string
  address?: string
  occupation?: string
  email?: string
  highest_education?: string
  phone?: string
  createdAt: number
}

onMounted(async () => {
  let token = localStorage.getItem('token')
  if (!token) {
    return navigateTo('/login')
  }
  await fetchUser()
})

async function fetchUser() {
  const token = localStorage.getItem('token')
  const res = await fetch(`${backend}/users/${route.params.id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const json = await res.json()
  if (!res.ok) {
    alert('Error: ' + json.message)
    navigateTo('/users')
    return
  }
  user.value = json.user
  user.value!.dob = (user.value!.dob as string)
  let dob = user.value!.dob
  dobYear.value = dob.split('T')[0].split('-')[0]
  dobMonth.value = dob.split('T')[0].split('-')[1]
  dobDay.value = dob.split('T')[0].split('-')[2]
  dobHour.value = dob.split('T')[1].split(':')[0]
  dobMinute.value = dob.split('T')[1].split(':')[1]
  dobSecond.value = dob.split('T')[1].split(':')[2]
}

const backend = useRuntimeConfig().public.backend

async function updateUser() {
  if (!user.value) {
    return
  }
  const { valid } = await form.value.validate()
  if (!valid) {
    return
  }
  const token = localStorage.getItem('token')
  const res = await fetch(`${backend}/users/${user.value.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: user.value.name,
      dob: `${dobYear.value}-${dobMonth.value.toString().padStart(2, '0')}-${dobDay.value.toString().padStart(2, '0')}T${dobHour.value.toString().padStart(2, '0')}:${dobMinute.value.toString().padStart(2, '0')}:${dobSecond.value.toString().padStart(2, '0')}`,
      birthPlace: user.value.birth_place,
      address: user.value.address,
      occupation: user.value.occupation,
      email: user.value.email,
      highestEducation: user.value.highest_education,
      phone: user.value.phone,
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  const json = await res.json()
  if (!res.ok) {
    return alert('Error: ' + json.message)
  }
  navigateTo('/users')
}
</script>

<template>
  <Header></Header>
  <v-container>
    <div class="d-flex justify-between align-center mt-5">
      <h1>Edit User</h1>
    </div>

    <div class="bg-red-lighten-4 pa-4">
      <NuxtLink to="/" class="me-2 fw-semibold td-none align-center">Home</NuxtLink>
      <v-icon icon="mdi-chevron-right" class="me-2 text-red"></v-icon>
      <NuxtLink to="/users" class="me-2 fw-bold td-none">Users</NuxtLink>
      <v-icon icon="mdi-chevron-right" class="me-2 text-red"></v-icon>
      <NuxtLink class="disabled me-2 fw-bold td-none text-red-lighten-2">{{ user?.name ?? 'Edit' }}</NuxtLink>
    </div>

    <v-card class="pa-8 mt-5" elevation="6">
      <v-form v-if="user" ref="form" class="mx-auto" style="max-width: 600px;">
        <v-text-field v-model="user.name" density="compact" color="red" label="Name" placeholder="Enter name"
          variant="outlined" :rules="[e => !!e || 'Name is required']" class="mb-1"></v-text-field>

        <p class="mb-2">Date of birth:</p>
        <div class="d-flex">
          <v-text-field v-model="dobDay" label="Day" placeholder="Day" :rules="[e => !!e || 'Day is required']"
            variant="outlined" color="red" density="compact" class="mb-4 d-inline-block" type="number"></v-text-field>

          <v-text-field v-model="dobMonth" label="Month" placeholder="Month" :rules="[e => !!e || 'Month is required']"
            variant="outlined" color="red" density="compact" class="mb-4 d-inline-block" type="number"></v-text-field>

          <v-text-field v-model="dobYear" label="Year" placeholder="Year" :rules="[e => !!e || 'Year is required',  e => +e <= new Date().getFullYear() || 'Can\'t be future year']"
            variant="outlined" color="red" density="compact" class="mb-4 d-inline-block" type="number"></v-text-field>
        </div>

        <p class="mb-2">Time of birth:</p>
        <div class="d-flex">
          <v-text-field v-model="dobHour" label="Hour" placeholder="Hour" :rules="[e => !!e || 'Hour is required']"
            variant="outlined" color="red" density="compact" class="mb-4 d-inline-block" type="number"></v-text-field>

          <v-text-field v-model="dobMinute" label="Minute" placeholder="Minute"
            :rules="[e => !!e || 'Minute is required']" variant="outlined" color="red" density="compact"
            class="mb-4 d-inline-block" type="number"></v-text-field>

          <v-text-field v-model="dobSecond" label="Second" placeholder="Second"
            :rules="[e => !!e || 'Second is required']" variant="outlined" color="red" density="compact"
            class="mb-4 d-inline-block" type="number"></v-text-field>
        </div>

        <v-text-field v-model="user.birth_place" density="compact" color="red" label="Birth Place"
          placeholder="Enter birth place" variant="outlined" class="mb-1"></v-text-field>

        <v-text-field v-model="user.address" density="compact" color="red" label="Address" placeholder="Enter address"
          variant="outlined" class="mb-1"></v-text-field>

        <v-text-field v-model="user.occupation" density="compact" color="red" label="Occupation"
          placeholder="Enter occupation" variant="outlined" class="mb-1"></v-text-field>

        <v-text-field v-model="user.email" density="compact" color="red" label="Email" placeholder="Enter email"
          variant="outlined" class="mb-1"></v-text-field>

        <v-text-field v-model="user.highest_education" density="compact" color="red" label="Highest Education"
          placeholder="Enter highest education" variant="outlined" class="mb-1"></v-text-field>

        <v-text-field v-model="user.phone" density="compact" color="red" label="Phone" placeholder="Enter phone"
          variant="outlined" class="mb-1"></v-text-field>

        <div class="d-flex justify-end">
          <v-btn class="bg-red text-white px-10" @click="updateUser">save</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>
