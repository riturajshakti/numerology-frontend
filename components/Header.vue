<script setup lang="ts">
function logout() {
  localStorage.removeItem('token')
  navigateTo('/login')
}

const route = useRoute()
</script>

<template>
  <div class="d-flex justify-between align-center bg-red-lighten-4 py-3 px-10">
    <NuxtLink href="/" title="Home">
      <img src="/logo.png" alt="Logo" width="40" height="40">
    </NuxtLink>

    <div class="d-flex">
      <NuxtLink v-if="route.path != '/'" to="/" class="me-4"><b>Home</b></NuxtLink>
      <NuxtLink to="/users" class="me-5"><b>Users</b></NuxtLink>
      <v-btn @click="logout" icon="mdi-logout" color="red" title="Logout" size="small"></v-btn>
    </div>
  </div>
</template>

<style scoped>
a {
  text-transform: uppercase;
  text-decoration: none;
  display: flex;
  align-items: center;
  font-size: 16px;
}

a:hover {
  text-decoration: underline;
}
</style>