<script setup lang="ts">
import getNumerologyChart from './numerology';

const name = ref('')
const dob = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const form = ref()

const route = useRoute()
const chart = ref<ReturnType<typeof getNumerologyChart> | undefined>()

onMounted(async () => {
  let token = localStorage.getItem('token')
  if (!token) {
    return navigateTo('/login')
  }
  name.value = (route.query.name as string | undefined) ?? ''
  dob.value = (route.query.dob as string | undefined) ?? '1996-01-10'
  chart.value = undefined
})

async function calculate() {
  const { valid } = await form.value.validate()
  if (!valid) {
    return
  }
  chart.value = getNumerologyChart(new Date(dob.value), new Date(date.value))
}

function readable(date: Date): string {
  return date.toLocaleDateString('en-GB')
}
</script>

<template>
  <Header />

  <v-container>
    <div class="d-flex justify-between align-center mt-5">
      <h1>Numerology</h1>
    </div>
    <v-card shadow="xl" class="mt-5" elevation="6">
      <v-form ref="form" class="mx-auto mt-8" style="max-width: 600px;">
        <h2 v-if="name" class="mb-4">{{ name }}</h2>

        <v-text-field v-model="dob" label="Date of birth" placeholder="Enter date of birth"
          :rules="[e => !!e || 'DOB is required']" variant="outlined" color="red" density="compact" class="mb-4"
          type="date"></v-text-field>

        <v-text-field v-model="date" label="Current Date" placeholder="Enter current date or inspection date"
          :rules="[e => !!e || 'Date is required']" variant="outlined" color="red" density="compact" class="mb-4"
          type="date"></v-text-field>

        <div class="d-flex justify-end">
          <v-btn class="bg-red text-white px-10" @click="calculate">calculate</v-btn>
        </div>
      </v-form>

      <div class="my-10"></div>
    </v-card>

    <v-card v-if="chart" shadow="xl" class="mt-5 pa-5" elevation="6">
      <h2 class="mb-4">Chart</h2>

      <div class="grid">
        <div class="cell">{{ chart.grid[1] }}</div>
        <div class="cell">{{ chart.grid[2] }}</div>
        <div class="cell">{{ chart.grid[3] }}</div>
        <div class="cell">{{ chart.grid[4] }}</div>
        <div class="cell">{{ chart.grid[5] }}</div>
        <div class="cell">{{ chart.grid[6] }}</div>
        <div class="cell">{{ chart.grid[7] }}</div>
        <div class="cell">{{ chart.grid[8] }}</div>
        <div class="cell">{{ chart.grid[9] }}</div>
      </div>

      <p><b>Basic:</b> {{ chart.basic }}</p> <br>
      <p><b>Destiny:</b> {{ chart.destiny }}</p> <br>

      <p><b>Maha Dasha:</b>
        {{ readable(chart.currentMahaDasha.start) }}
        -
        {{ readable(chart.currentMahaDasha.end) }},
        <b>Value:</b> {{ chart.currentMahaDasha.value }}
      </p> <br>

      <p><b>Antar Dasha:</b>
        {{ readable(chart.antarDasha.start) }}
        -
        {{ readable(chart.antarDasha.end) }},
        <b>Value:</b> {{ chart.antarDasha.value }}
      </p> <br>

      <p><b>Pratyantar Dasha:</b>
        {{ readable(chart.currentPd.start) }}
        -
        {{ readable(chart.currentPd.end) }},
        <b>Value:</b> {{ chart.currentPd.pd }}, 
        <b>Difference:</b> {{ chart.currentPd.pdValue }}
      </p> <br>

      <h4 class="mt-5"><b>Maha Dasha List:</b></h4>
      <v-table style="max-width: 500px;">
        <caption>
        </caption>
        <thead>
          <tr>
            <th class="text-left">Start</th>
            <th class="text-left">End</th>
            <th class="text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="md of chart.mahaDasha" :class="{current: md.current}">
            <td>{{ md.start.toLocaleDateString("en-GB") }}</td>
            <td>{{ md.end.toLocaleDateString("en-GB") }}</td>
            <td>{{ md.value }}</td>
          </tr>
        </tbody>
      </v-table>

      <h4 class="mt-5"><b>Pratyantar Dasha List:</b></h4>
      <v-table style="max-width: 600px;">
        <caption>
        </caption>
        <thead>
          <tr>
            <th class="text-left">Start</th>
            <th class="text-left">End</th>
            <th class="text-left">Sequence</th>
            <th class="text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pd of chart.pratyantarDasha" :class="{current: pd.current}">
            <td>{{ pd.start.toLocaleDateString("en-GB") }}</td>
            <td>{{ pd.end.toLocaleDateString("en-GB") }}</td>
            <td>{{ pd.pd }}</td>
            <td>{{ pd.pdValue }}</td>
          </tr>
        </tbody>
      </v-table>

      <div class="my-10"></div>
    </v-card>
  </v-container>
</template>

<style scoped>
.img {
  background-image: url('/images/banner2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 682px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 0;
  width: 305px;
  margin: 50px auto;
  border: 3px solid black;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  background-color: white;
  border: 2px solid black;
  color: black;
  width: 100px;
  height: 100px;
}

th {
  font-weight: bold !important;
  text-transform: uppercase;
}

.current {
  background-color: rgb(255, 227, 227);
}
</style>
