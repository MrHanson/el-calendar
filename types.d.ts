import Vue from 'vue'

export class Calendar extends Vue {
  /** Binding value */
  value: Date

  /** today value */
  today: Date

  locale: 'cn' | 'en'

  /** show mark or not */
  dotArr: Array<boolean>

  backToToday: () => void

  toPreMonth: () => void

  toNextMonth: () => void

  toPreYear: () => void

  toNextYear: () => void

  toSpecificDate: (year: number, month: number, date: number) => void
}
