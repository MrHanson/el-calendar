<template>
  <div id="app">
    <Calendar v-model="today" comment="*some comment"></Calendar>
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
  watch: {
    today(val) {
      console.log(val)
    }
  },
  components: { Calendar }
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
  width: 60%;
  margin: 0 auto;
  padding: 8px;
}
</style>
