<script setup lang="ts">
import getNumerologyChart from './numerology';

const name = ref('')

const dobDay = ref('')
const dobMonth = ref('')
const dobYear = ref('')
const dob = computed(() => `${dobYear.value}-${dobMonth.value.toString().padStart(2, '0')}-${dobDay.value.toString().padStart(2, '0')}T00:00:00Z`)

const now = new Date().toISOString().split('T')[0].split('-')
const dateDay = ref(now[2])
const dateMonth = ref(now[1])
const dateYear = ref(now[0])
const date = computed(() => `${dateYear.value}-${dateMonth.value.toString().padStart(2, '0')}-${dateDay.value.toString().padStart(2, '0')}T00:00:00Z`)

const form = ref()

const route = useRoute()
const chart = ref<ReturnType<typeof getNumerologyChart> | undefined>()

onMounted(async () => {
  let token = localStorage.getItem('token')
  if (!token) {
    return navigateTo('/login')
  }
  name.value = (route.query.name as string | undefined) ?? ''
  chart.value = undefined
  if(route.query.dob) {
    const [year, month, day] = (route.query.dob as string).split('-')
    dobYear.value = year
    dobMonth.value = month
    dobDay.value = day
  }
})

async function calculate() {
  try {
    chart.value = undefined
    const { valid } = await form.value.validate()
    if (!valid) {
      return
    }
    const _dob = new Date(dob.value)
    const _date = new Date(date.value)
    if(_dob > _date) {
      return alert('DOB must be less than the date')
    }
    chart.value = getNumerologyChart(_dob, _date)
    console.log(chart.value)
  } catch (error) {
    console.error(error)
    alert('Error: some unknown error occurred')
  }
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
      <v-form ref="form" class="mx-auto mt-8 pa-4" style="max-width: 600px;">
        <h2 v-if="name" class="mb-4">{{ name }}</h2>

        <p class="mb-2">Date of birth:</p>
        <div class="d-flex">
          <v-text-field v-model="dobDay" label="Day" placeholder="Day"
          :rules="[e => !!e || 'Day is required']" variant="outlined" color="red" density="compact" class="mb-4 d-inline-block" type="number"></v-text-field>

          <v-text-field v-model="dobMonth" label="Month" placeholder="Month"
          :rules="[e => !!e || 'Month is required']" variant="outlined" color="red" density="compact" class="mb-4 d-inline-block" type="number"></v-text-field>

          <v-text-field v-model="dobYear" label="Year" placeholder="Year"
          :rules="[e => !!e || 'Year is required']" variant="outlined" color="red" density="compact" class="mb-4 d-inline-block" type="number"></v-text-field>
        </div>

        <p class="mt-0 mb-2">Date:</p>
        <div class="d-flex">
          <v-text-field v-model="dateDay" label="Day" placeholder="Day"
          :rules="[e => !!e || 'Day is required']" variant="outlined" color="red" density="compact" class="mb-4 d-inline-block" type="number"></v-text-field>

          <v-text-field v-model="dateMonth" label="Month" placeholder="Month"
          :rules="[e => !!e || 'Month is required']" variant="outlined" color="red" density="compact" class="mb-4 d-inline-block" type="number"></v-text-field>

          <v-text-field v-model="dateYear" label="Year" placeholder="Year"
          :rules="[e => !!e || 'Year is required', e => +dobYear <= +e || 'Must be greater than or equal to DOB year']" variant="outlined" color="red" density="compact" class="mb-4 d-inline-block" type="number"></v-text-field>
        </div>

        <div class="d-flex justify-end">
          <v-btn class="bg-red text-white px-6 me-3" @click="chart = undefined">reset</v-btn>
          <v-btn class="bg-red text-white px-10" @click="calculate">calculate</v-btn>
        </div>
      </v-form>

      <div class="my-10"></div>
    </v-card>

    <v-card v-if="chart" shadow="xl" class="mt-5 pa-5" elevation="6">
      <h2 class="mb-4">Chart</h2>

      <v-row class="my-4">
        <v-col cols="12" md="6">
          <div class="grid">
            <div class="cell">{{ chart.grid1[1] }}</div>
            <div class="cell">{{ chart.grid1[2] }}</div>
            <div class="cell">{{ chart.grid1[3] }}</div>
            <div class="cell">{{ chart.grid1[4] }}</div>
            <div class="cell">{{ chart.grid1[5] }}</div>
            <div class="cell">{{ chart.grid1[6] }}</div>
            <div class="cell">{{ chart.grid1[7] }}</div>
            <div class="cell">{{ chart.grid1[8] }}</div>
            <div class="cell">{{ chart.grid1[9] }}</div>
          </div>
          <p class="text-center grid-title fw-semibold">DOB, Basic & Destiny</p>
        </v-col>

        <v-col cols="12" md="6">
          <div class="grid">
            <div class="cell" v-html="chart.grid2[1]"></div>
            <div class="cell" v-html="chart.grid2[2]"></div>
            <div class="cell" v-html="chart.grid2[3]"></div>
            <div class="cell" v-html="chart.grid2[4]"></div>
            <div class="cell" v-html="chart.grid2[5]"></div>
            <div class="cell" v-html="chart.grid2[6]"></div>
            <div class="cell" v-html="chart.grid2[7]"></div>
            <div class="cell" v-html="chart.grid2[8]"></div>
            <div class="cell" v-html="chart.grid2[9]"></div>
          </div>
          <p class="text-center grid-title fw-semibold">MD, AD & PD</p>
        </v-col>
      </v-row>

      <p class="grid-title"><b>Basic:</b> {{ chart.basic }}</p> <br>
      <p class="grid-title"><b>Destiny:</b> {{ chart.destiny }}</p> <br>

      <p class="maha-dasha-text"><b>Maha Dasha:</b>
        {{ readable(chart.currentMahaDasha!.start) }}
        -
        {{ readable(chart.currentMahaDasha!.end) }},
        <b>Value:</b> {{ chart.currentMahaDasha!.value }}
      </p> <br>

      <p class="antar-dasha-text"><b>Antar Dasha:</b>
        {{ readable(chart.currentAntarDasha!.start) }}
        -
        {{ readable(chart.currentAntarDasha!.end) }},
        <b>Value:</b> {{ chart.currentAntarDasha!.value }}
      </p> <br>

      <p class="pratyantar-dasha-text"><b>Pratyantar Dasha:</b>
        {{ readable(chart.currentPd!.start) }}
        -
        {{ readable(chart.currentPd!.end) }},
        <b>Value:</b> {{ chart.currentPd!.pd }},
        <b>Difference:</b> {{ chart.currentPd!.pdValue }}
      </p> <br>

      <v-expansion-panels multiple>
        <!-- Maha Dasha -->
        <v-expansion-panel>
          <v-expansion-panel-title class="maha-dasha"><b>Maha Dasha List:</b></v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-table style="max-width: 500px;" density="compact" class="maha-dasha">
              <thead>
                <tr>
                  <th class="text-left">Start</th>
                  <th class="text-left">End</th>
                  <th class="text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="md of chart.mahaDasha" :class="{ 'current-md': md.current }">
                  <td>{{ md.start.toLocaleDateString("en-GB") }}</td>
                  <td>{{ md.end.toLocaleDateString("en-GB") }}</td>
                  <td>{{ md.value }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Antar Dasha -->
        <v-expansion-panel>
          <v-expansion-panel-title class="antar-dasha"><b>Antar Dasha List:</b></v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-table style="max-width: 500px;" density="compact" class="antar-dasha">
              <thead>
                <tr>
                  <th class="text-left">Start</th>
                  <th class="text-left">End</th>
                  <th class="text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ad of chart.antarDasha" :class="{ 'current-ad': ad.current }">
                  <td>{{ ad.start.toLocaleDateString("en-GB") }}</td>
                  <td>{{ ad.end.toLocaleDateString("en-GB") }}</td>
                  <td>{{ ad.value }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Pratyantar Dasha -->
        <v-expansion-panel>
          <v-expansion-panel-title class="pratyantar-dasha"><b>Pratyantar Dasha List:</b></v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-table style="max-width: 600px;" density="compact" class="pratyantar-dasha">
              <thead>
                <tr>
                  <th class="text-left">Start</th>
                  <th class="text-left">End</th>
                  <th class="text-left">Sequence</th>
                  <th class="text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pd of chart.pratyantarDasha" :class="{ 'current-pd': pd.current }">
                  <td>{{ pd.start.toLocaleDateString("en-GB") }}</td>
                  <td>{{ pd.end.toLocaleDateString("en-GB") }}</td>
                  <td>{{ pd.pd }}</td>
                  <td>{{ pd.pdValue }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

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
  margin: 10px auto;
  border: 3px solid #800020;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  background-color: white;
  border: 2px solid #800020;
  color: black;
  width: 100px;
  height: 100px;
  color: #e9a200;
}

th {
  font-weight: bold !important;
  text-transform: uppercase;
}

.current-md {
  background-color: #efd1ff;
  color: black;
}

.current-ad {
  background-color: #ffe1cd;
  color: black;
}

.current-pd {
  background-color: #d2f1ff;
  color: black;
}

.grid-title {
  color: #800020;
}

.maha-dasha {
  background-color: #5c038c;
  color: white;
}

.antar-dasha {
  background-color: #f2670d;
  color: white;
}

.pratyantar-dasha {
  background-color: #598da6;
  color: white;
}

.maha-dasha-text {
  color: #5c038c;
}

.antar-dasha-text {
  color: #f2670d;
}

.pratyantar-dasha-text {
  color: #598da6;
}
</style>
