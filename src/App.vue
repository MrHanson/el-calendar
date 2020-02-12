<template>
  <div id="app">
    <Calendar ref="calendar" v-model="today" comment="*some comment"></Calendar>
    <div class="operation">
      <div class="row">
        <button @click="backToToday">Back to today</button>
        <button @click="toPreMonth">To previous month</button>
        <button @click="toNextMonth">To next month</button>
      </div>
      <div class="row">
        Selected date: <span style="color: red">{{ today }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from './Calendar'

export default {
  data() {
    return {
      today: new Date()
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
