<template>
  <div class="calendar">
    <div class="banner">
      <div class="arrow arrow-left" @click="toPreMonth"></div>
      <span>{{ curYear + bannerYearText }}</span>
      <span>{{ curMonth + bannerMonthText }}</span>
      <div class="arrow arrow-right" @click="toNextMonth"></div>
    </div>
    <div class="week-text">
      <div class="date-item date-item__week" v-for="text in weekText" :key="text">{{ text }}</div>
    </div>
    <div>
      <div
        v-for="(item, j) in monthArr"
        :key="'cur' + j"
        class="date-item"
        @click="() => _handleItemSelect(item)"
      >
        <span
          :class="{
            'current-month': item.monthFlag === 1,
            today: item.isToday,
            'is-selected':
              item.monthFlag === 1 &&
              item.val === `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`,
            'is-marked': item.marked
          }"
          >{{ item.date }}</span
        >
      </div>
    </div>
    <div class="comment">
      {{ comment }}
    </div>
  </div>
</template>

<script>
function getMonthMaxDate(year, month) {
  const isGapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31
    case 4:
    case 6:
    case 9:
    case 11:
      return 30
    case 2:
      return isGapYear ? 29 : 28
  }
}

function getDayOfWeek(year, month, date) {
  return new Date(year, month - 1, date).getDay()
}

export default {
  name: 'Calendar',

  props: {
    value: {
      type: Date,
      default: () => new Date()
    },
    today: {
      type: Date,
      default: () => new Date()
    },
    weekText: {
      type: Array,
      default: () => ['日', '一', '二', '三', '四', '五', '六']
    },
    bannerYearText: {
      type: String,
      default: '年'
    },
    bannerMonthText: {
      type: String,
      default: '月'
    },
    // Notice：markArr为boolean数组，长度必须与当前月最大日相等
    markArr: {
      type: Array,
      default: () => {
        const date = new Date()
        const len = getMonthMaxDate(date.getFullYear(), date.getMonth() + 1)
        return new Array(len).fill(false)
      }
    },
    comment: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      curYear: new Date().getFullYear(),
      curMonth: new Date().getMonth() + 1,
      curDay: new Date().getDay(),
      curDate: new Date().getDate(),
      monthArr: []
    }
  },

  created() {
    // set current moment
    this.curYear = this.value.getFullYear()
    this.curMonth = this.value.getMonth() + 1
    this.curDay = this.value.getDay()
    this.curDate = this.value.getDate()

    this._updateMonthArr()
  },

  methods: {
    backToToday() {
      this.curYear = this.today.getFullYear()
      this.curMonth = this.today.getMonth() + 1
      this.$emit('input', new Date(this.curYear, this.curMonth - 1, this.today.getDate()))
      this._updateMonthArr()
    },
    toPreMonth() {
      if (this.curMonth === 1) {
        this.curYear = this.curYear - 1
        this.curMonth = 12
      } else {
        this.curMonth = this.curMonth - 1
      }
      this._updateMonthArr()
      this.$emit('premonth')
    },
    toNextMonth() {
      if (this.curMonth === 12) {
        this.curYear = this.curYear + 1
        this.curMonth = 1
      } else {
        this.curMonth = this.curMonth + 1
      }
      this._updateMonthArr()
      this.$emit('nextmonth')
    },
    toSpecificDate(year, month, date) {
      this.curYear = year
      this.curMonth = month
      this.$emit('input', new Date(year, month - 1, date))
    },
    _handleItemSelect(item) {
      if (item.monthFlag === 1) {
        this.$emit('input', new Date(this.curYear, this.curMonth - 1, item.date))
      } else if (item.monthFlag === 0) {
        this.toPreMonth()
        this.$emit('input', new Date(this.curYear, this.curMonth - 1, item.date))
      } else {
        this.toNextMonth()
        this.$emit('input', new Date(this.curYear, this.curMonth - 1, item.date))
      }
    },
    // monthFlag: 0 previous month, 1 current month, 2 next month
    _getDateArr(beginDate = 1, endDate = 31, monthFlag = 1) {
      if (beginDate > endDate) {
        return []
      }

      const toDate = this.today.getDate()

      let tarMonth = this.curMonth
      let tarYear = this.curYear
      if (monthFlag === 0) {
        if (this.curMonth === 1) {
          tarMonth = 12
          tarYear = this.curYear - 1
        } else {
          tarMonth = this.curMonth - 1
        }
      } else if (monthFlag === 2) {
        if (this.curMonth === 12) {
          tarMonth = 1
          tarYear = this.curYear + 1
        } else {
          tarMonth = this.curMonth + 1
        }
      }

      return new Array(endDate - beginDate + 1).fill().map((_, index) => ({
        val: `${tarYear}-${tarMonth}-${index + beginDate}`,
        date: index + beginDate,
        monthFlag,
        marked: monthFlag === 1 && this.markArr[index],
        isToday: this._getDateStr(this.today) === `${tarYear}-${tarMonth}-${index + beginDate}`
      }))
    },
    _updateMonthArr() {
      let maxDateOfPreMonth
      if (this.curMonth === 1) {
        maxDateOfPreMonth = getMonthMaxDate(this.curYear - 1, 12)
      } else {
        maxDateOfPreMonth = getMonthMaxDate(this.curYear, this.curMonth - 1)
      }
      const firstDayOfCurMonth = getDayOfWeek(this.curYear, this.curMonth, 1)
      const preMonthArr = this._getDateArr(
        maxDateOfPreMonth - firstDayOfCurMonth + 1,
        maxDateOfPreMonth,
        0
      )
      const curMonthArr = this._getDateArr(1, getMonthMaxDate(this.curYear, this.curMonth), 1)
      const nextMonthArr = this._getDateArr(1, getMonthMaxDate(this.curYear, this.curMonth + 1), 2)
      const result = preMonthArr.concat(curMonthArr).concat(nextMonthArr)
      // 6 line max: 6 * 7 = 42
      this.monthArr = result.slice(0, 42)
    },
    _getDateStr(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
  }
}
</script>

<style>
.calendar {
  width: 400px;
  box-sizing: border-box;
  padding: 18px;
  color: #000;
}

.calendar span {
  font-size: 16px;
  line-height: 16px;
  user-select: none;
}

.calendar .banner {
  font-size: 0;
  line-height: 16px;
  text-align: center;
}
.arrow {
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  cursor: pointer;
  user-select: none;
}
.arrow-left {
  border-left: 8px solid transparent;
  border-right: 8px solid #409eff;
  margin-right: 16px;
}

.arrow-right {
  border-right: 8px solid transparent;
  border-left: 8px solid #409eff;
  margin-left: 16px;
}

.calendar .date-item {
  box-sizing: border-box;
  position: relative;
  display: inline-block;
  width: 52px;
  line-height: 52px;
  height: 52px;
  text-align: center;
  color: #c0c4cc;
  user-select: none;
}

.calendar .date-item span {
  display: inline-block;
  padding: 8px;
  margin: 6px;
  width: 20px;
  height: 20px;
}

.calendar .date-item__week {
  color: #000 !important;
}

.calendar .current-month {
  color: #000 !important;
}

.calendar .current-month:hover {
  background-color: #f2f8fe;
  border-radius: 50%;
  cursor: pointer;
}

.calendar .today {
  color: #409eff !important;
}

.calendar .is-selected {
  background-color: #409eff !important;
  color: #fff !important;
  border-radius: 50%;
}

.calendar .is-marked::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid #000;
  left: 50%;
  transform: translateX(-50%);
  bottom: 5px;
}

.calendar .comment {
  padding: 16px;
  color: #c0c4cc;
}
</style>
