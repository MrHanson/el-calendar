<template>
  <div class="calendar">
    <div class="banner">
      <div class="arrow-wrap arrow-wrap--left">
        <div class="arrow arrow--outer" @click="toPreYear"></div>
        <div v-show="datePaneVisible" class="arrow arrow--inner" @click="toPreMonth"></div>
      </div>

      <!-- banner locale -->
      <span v-show="yearPaneVisible">{{ localeYearRange }}</span>
      <span v-show="!yearPaneVisible" @click="showYearPane">{{ localeYear }}</span>
      <span v-show="datePaneVisible" @click="showMonthPane">{{ localeMonth }}</span>
      <div class="arrow-wrap arrow-wrap--right">
        <div v-show="datePaneVisible" class="arrow arrow--inner" @click="toNextMonth"></div>
        <div class="arrow arrow--outer" @click="toNextYear"></div>
      </div>
    </div>

    <div v-show="datePaneVisible" class="pane pane--date">
      <div class="week-text">
        <div v-for="text in weekText" :key="text" class="date-item date-item__week">
          {{ text }}
        </div>
      </div>
      <div>
        <div
          v-for="(item, j) in dateArr"
          :key="'date' + j"
          class="date-item"
          @click="_handleDateItemSelect(item)"
        >
          <span
            :class="{
              'date-item--current-month': item.monthFlag === 1,
              'date-item--today': item.isToday,
              'date-item--selected':
                item.monthFlag === 1 &&
                item.val === `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`,
              'date-item--dotted': item.dotted
            }"
          >
            {{ item.date }}
          </span>
        </div>
      </div>
    </div>
    <div v-show="monthPaneVisible" class="pane pane--month">
      <div
        v-for="(month, k) in monthArr"
        :key="'month' + k"
        :class="{
          'month-item': true,
          'month-item--selected':
            k === value.getMonth() &&
            curMonth === value.getMonth() + 1 &&
            curYear === value.getFullYear()
              ? 'bolder'
              : ''
        }"
        @click="_handleMonthItemSelect(k)"
      >
        {{ month }}
      </div>
    </div>
    <div v-show="yearPaneVisible" class="pane pane--year">
      <div
        class="year-item"
        v-for="(year, l) in yearArr"
        :key="'year' + l"
        :class="{ 'year-item': true, 'year-item-selected': l === value.getFullYear() }"
        @click="_handleYearItemSelect(year)"
      >
        {{ year }}
      </div>
    </div>
    <div class="comment">
      <slot name="comment"></slot>
    </div>
  </div>
</template>

<script>
// prettier-ignore
const MONTH_ARR_CN = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
// prettier-ignore
const MONTH_ARR_EN = ['Jan','Feb','Mar','Apr','May','un','Jul','Ang','Sep','Oct','Nov','Dec']

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

function isNaNs(...args) {
  return Array.prototype.map.call(args, item => isNaN(item))
}

export default {
  name: 'Calendar',

  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: Date,
      default: () => new Date()
    },
    today: {
      type: Date,
      default: () => new Date()
    },
    locale: {
      type: String,
      default: 'cn',
      validator: val => ['cn', 'en'].includes(val)
    },
    /* Notice: dotArr: Array<boolean>
               length of dotArr must be same as 
               max date of current month */
    dotArr: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      curYear: this.value.getFullYear(),
      curMonth: this.value.getMonth() + 1,
      paneStatus: 0 /* 0 date-pane, 1 month-pane, 2 year-pane */,
      dateArr: []
    }
  },

  watch: {
    dotArr: {
      deep: true,
      immediate: true,
      handler() {
        this._updateMonthArr()
      }
    }
  },

  created() {
    this._updateMonthArr()
  },

  computed: {
    yearRangeStart() {
      return Math.floor(this.curYear / 10) * 10
    },
    yearRangeEnd() {
      return Math.floor(this.curYear / 10) * 10 + 9
    },
    localeYearRange() {
      if (this.locale === 'cn') {
        return `${this.yearRangeStart}年-${this.yearRangeEnd}年`
      } else if (this.locale === 'en') {
        return `${this.yearRangeStart}-${this.yearRangeEnd}`
      }
    },
    localeYear() {
      if (this.locale === 'cn') {
        return this.curYear + '年'
      } else if (this.locale === 'en') {
        return this.curYear
      }
    },
    localeMonth() {
      if (this.locale === 'cn') {
        return this.curMonth + '月'
      } else if (this.locale === 'en') {
        return MONTH_ARR_EN[this.curMonth - 1]
      }
    },
    weekText() {
      switch (this.locale) {
        case 'cn':
          return ['日', '一', '二', '三', '四', '五', '六']
        case 'en':
          return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      }
    },
    monthArr() {
      switch (this.locale) {
        case 'cn':
          return MONTH_ARR_CN
        case 'en':
          return MONTH_ARR_EN
      }
    },
    yearArr() {
      const that = this
      return new Array(10).fill().map((_, index) => that.yearRangeStart + index)
    },
    datePaneVisible() {
      return this.paneStatus === 0
    },
    monthPaneVisible() {
      return this.paneStatus === 1
    },
    yearPaneVisible() {
      return this.paneStatus === 2
    }
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
        this.curYear--
        this.curMonth = 12
      } else {
        this.curMonth--
      }
      this._updateMonthArr()
      this.$emit('premonth', { year: this.curYear, month: this.curMonth })
    },
    toNextMonth() {
      if (this.curMonth === 12) {
        this.curYear++
        this.curMonth = 1
      } else {
        this.curMonth++
      }
      this._updateMonthArr()
      this.$emit('nextmonth', { year: this.curYear, month: this.curMonth })
    },
    toPreYear() {
      this.curYear--
      this._updateMonthArr()
      this.$emit('preyear', { year: this.curYear, month: this.curMonth })
    },
    toNextYear() {
      this.curYear++
      this._updateMonthArr()
      this.$emit('nextyear', { year: this.curYear, month: this.curMonth })
    },
    toSpecificDate(year, month, date) {
      // v0.1.2 fix bug: params of toSpecificDate must be integer
      const intYear = parseInt(year)
      const intMonth = parseInt(month)
      const intDate = parseInt(date)
      if (isNaNs(intYear, intMonth, intDate).some(item => item === true)) return

      this.curYear = intYear
      this.curMonth = intMonth
      this._updateMonthArr()
      this.$emit('input', new Date(intYear, intMonth - 1, intDate))
    },
    showYearPane() {
      this.paneStatus = 2
    },
    showMonthPane() {
      this.paneStatus = 1
    },
    showDatePane() {
      this.paneStatus = 0
    },
    _handleDateItemSelect(item) {
      if (item.monthFlag === 0) {
        this.toPreMonth()
      } else if (item.monthFlag === 2) {
        this.toNextMonth()
      }
      this.$emit('input', new Date(this.curYear, this.curMonth - 1, item.date))
    },
    _handleMonthItemSelect(item) {
      this.curMonth = item + 1
      this._updateMonthArr()
      this.showDatePane()
    },
    _handleYearItemSelect(item) {
      console.log(item)
    },
    // monthFlag: 0 previous month, 1 current month, 2 next month
    _getDateArr(beginDate = 1, endDate = 31, monthFlag = 1) {
      if (beginDate > endDate) {
        return []
      }

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
        dotted: monthFlag === 1 && this.dotArr[index],
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
      const preDateArr = this._getDateArr(
        maxDateOfPreMonth - firstDayOfCurMonth + 1,
        maxDateOfPreMonth,
        0
      )
      const curDateArr = this._getDateArr(1, getMonthMaxDate(this.curYear, this.curMonth), 1)
      const nextDateArr = this._getDateArr(1, getMonthMaxDate(this.curYear, this.curMonth + 1), 2)

      // 6 line max: 6 * 7 = 42
      this.dateArr = preDateArr
        .concat(curDateArr)
        .concat(nextDateArr)
        .slice(0, 42)
    },
    _getDateStr(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
  }
}
</script>

<style>
.calendar {
  box-sizing: border-box;
  width: 400px;
  padding: 18px;
  color: #000;
  user-select: none;
}

.calendar span {
  font-size: 16px;
  line-height: 16px;
  user-select: none;
}

.calendar .banner {
  position: relative;
  font-size: 0;
  line-height: 16px;
  text-align: center;
}
.calendar .banner span {
  margin: 0 8px;
}

.calendar .banner span:hover {
  color: #409eff;
  cursor: pointer;
}

/* arrow relevant */
.arrow-wrap {
  display: inline-block;
  position: relative;
  color: #607d8b;
}

.arrow-wrap--left {
  position: absolute;
  left: 4px;
}
.arrow-wrap--left .arrow--inner::before {
  content: '<';
}
.arrow-wrap--left .arrow--outer {
  position: relative;
}
.arrow-wrap--left .arrow--outer::after {
  content: '<';
  display: inline-block;
  transform: translateX(-6px);
}
.arrow-wrap--left .arrow--outer::before {
  content: '<';
}

.arrow-wrap--right {
  position: absolute;
  right: 4px;
}
.arrow-wrap--right .arrow--inner::before {
  content: '>';
}
.arrow-wrap--right .arrow--outer {
  position: relative;
}
.arrow-wrap--right .arrow--outer::before {
  content: '>';
  display: inline-block;
  transform: translateX(6px);
}
.arrow-wrap--right .arrow--outer::after {
  content: '>';
}

.arrow-wrap .arrow {
  display: inline-block;
  font-size: 16px;
  line-height: 16px;
  margin: 0 16px;
  cursor: pointer;
}

.arrow-wrap .arrow:hover {
  color: #409eff;
}

/* pane--date relevant */
.calendar .date-item {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  width: 52px;
  height: 52px;
  line-height: 52px;
  color: #c0c4cc;
  text-align: center;
  user-select: none;
}

.calendar .date-item span {
  box-sizing: content-box;
  display: inline-block;
  width: 20px;
  height: 20px;
  padding: 8px;
  margin: 6px;
}

.calendar .date-item__week {
  color: #000 !important;
}

.calendar .pane--date .date-item--current-month {
  color: #000 !important;
}

.calendar .date-item--current-month:hover {
  cursor: pointer;
  background-color: #f2f8fe;
  border-radius: 50%;
}

.calendar .pane--date .date-item--today {
  color: #409eff !important;
}

.calendar .pane--date .date-item--selected {
  color: #fff !important;
  background-color: #409eff !important;
  border-radius: 50%;
}

.calendar .date-item--dotted::after {
  position: absolute;
  bottom: 10px;
  left: 50%;
  content: '';
  border: 1.5px solid #000;
  border-radius: 50%;
  transform: translateX(-50%);
}

/* pane--month relevant */
.calendar .pane--month {
  margin: 16px;
  border-top: 1px solid #e7e6e6;
}
.calendar .pane--month .month-item {
  display: inline-block;
  box-sizing: border-box;
  width: 25%;
  text-align: center;
  padding: 16px;
  margin: 16px 0;
  color: #000;
  cursor: pointer;
}
.calendar .pane--month .month-item:hover {
  color: #409eff;
}
.calendar .pane--month .month-item--selected {
  color: #409eff;
  font-weight: bold;
}

/* pane--year relevant */
.calendar .pane--year .year-item {
  display: inline-block;
  width: 25%;
  box-sizing: border-box;
  color: #000;
}

.calendar .comment {
  color: #c0c4cc;
}
</style>
