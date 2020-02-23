import Vue from 'vue'

export class Calendar extends Vue {
  /** Binding value */
  value: Date

  /** today value */
  today: Date

  /** week banner text */
  weekText: Array<string>

  /** banner year text */
  bannerYearText: string

  /** banner month text */
  bannerMonthText: string

  /** show mark or not */
  dotArr: Array<boolean>

  /** footer comment */
  comment: string

  backToToday: () => void

  toPreMonth: () => void

  toNextMonth: () => void

  toSpecificDate: (year: number, month: number, date: number) => void
}
