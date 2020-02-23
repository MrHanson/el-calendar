<template>
  <div id="app">
    <Calendar ref="calendar" v-model="selectedDate" :locale="locale"></Calendar>
    <div class="operation">
      <div class="row">
        locale:
        <label for="locale"><input v-model="locale" type="radio" name="cn" value="cn" />cn</label>
        <label for="locale"><input v-model="locale" type="radio" name="en" value="en" />en</label>
      </div>
      <div class="row">
        <button @click="backToToday">Back to today</button>
        <button @click="toPreMonth">To previous month</button>
        <button @click="toNextMonth">To next month</button>
        <button @click="toPreYear">To previous year</button>
        <button @click="toNextYear">To next year</button>
        <button @click="toSpecificDate">To 2019/07/01</button>
      </div>
      <div class="row">
        Selected date: <span style="color: red">{{ selectedDate }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from '../src/Calendar'

export default {
  data() {
    return {
      selectedDate: new Date(),
      locale: 'cn'
    }
  },

  components: { Calendar },

  methods: {
    backToToday() {
      this.$refs['calendar'].backToToday()
    },
    toPreMonth() {
      this.$refs['calendar'].toPreMonth()
    },
    toNextMonth() {
      this.$refs['calendar'].toNextMonth()
    },
    toPreYear() {
      this.$refs['calendar'].toPreYear()
    },
    toNextYear() {
      this.$refs['calendar'].toNextYear()
    },
    toSpecificDate() {
      this.$refs['calendar'].toSpecificDate(2019, 7, 1)
    }
  }
}
</script>

<style>
html,
body {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#app {
  position: relative;
  width: 70%;
  margin: 0 auto;
  padding: 8px;
  display: flex;
}
.operation {
  padding: 16px 0;
}
.operation .row {
  margin: 16px 0;
}
</style>
