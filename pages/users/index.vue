<script setup lang="ts">
interface User {
  id: string
  name: string
  dob: string
  phone?: string
  vehicle?: string
  account?: string
}

const users = ref<User[]>([])

onMounted(async () => {
  let token = localStorage.getItem('token')
  if (!token) {
    return navigateTo('/login')
  }
  await fetchUsers()
})

const backend = useRuntimeConfig().public.backend

async function fetchUsers() {
  const token = localStorage.getItem('token')
  const res = await fetch(`${backend}/users?page=${page.value}&limit=${limit.value}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const json = await res.json()
  if (!res.ok) {
    return alert('Error: ' + json.message)
  }
  users.value = json.users
  count.value = json.count
}

const limit = ref(20);
const page = ref(1);
const count = ref(0);

watch([page, limit], fetchUsers)

const dob = (date: string) => new Date(date).toLocaleDateString("en-GB")
const dob2 = (date: string) => date.split('T')[0]

async function deleteUser(user: User) {
  const ok = confirm('Are you sure want to delete ' + user.name.toLowerCase() + ' ?')
  if (!ok) {
    return
  }
  const token = localStorage.getItem('token')
  const res = await fetch(`${backend}/users/${user.id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const json = await res.json()
  if (!res.ok) {
    return alert('Error: ' + json.message)
  }
  const index = users.value.findIndex(e => e.id === user.id)
  users.value.splice(index, 1)
}
</script>

<template>
  <Header />
  <v-container>
    <div class="d-flex justify-between align-center mt-5">
      <h1>Users</h1>
      <v-btn class="bg-red text-white" size="small" title="Add new user" @click="navigateTo('/users/add')">ADD
        user</v-btn>
    </div>
    <div class="bg-red-lighten-4 pa-4">
      <NuxtLink to="/" class="me-2 fw-semibold td-none align-center">Home</NuxtLink>
      <v-icon icon="mdi-chevron-right" class="me-2 text-red"></v-icon>
      <NuxtLink class="disabled me-2 fw-bold td-none text-red-lighten-2">Users</NuxtLink>
    </div>
    <v-card shadow="xl" class="mt-5" elevation="6">
      <v-table class="mt-5">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">DOB</th>
            <th class="text-left">Phone</th>
            <th class="text-left">Vehicle No</th>
            <th class="text-left">Account No</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user of users" :key="user.id">
            <td>
              <NuxtLink :to="`/?name=${user.name}&dob=${dob2(user.dob)}`" class="fw-bold">{{ user.name }}</NuxtLink>
            </td>
            <td>{{ dob(user.dob) }}</td>
            <td>{{ user.phone || '❌' }}</td>
            <td>{{ user.vehicle || '❌' }}</td>
            <td>{{ user.account || '❌' }}</td>
            <td>
              <v-btn icon="mdi-pencil" color="deep-orange" title="Edit" class="text-white me-2" size="x-small" @click="navigateTo(`/users/${user.id}`)"></v-btn>
              <v-btn icon="mdi-close" color="red" title="Delete" class="d-inline-flex align-center text-white"
                size="x-small" @click="deleteUser(user)"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-pagination v-if="count > limit" v-model="page" :length="Math.ceil(count / limit)"
        rounded="circle"></v-pagination>

      <div class="my-10"></div>
    </v-card>
  </v-container>
</template>

<style scoped>
th {
  font-weight: bold !important;
  text-transform: uppercase;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>