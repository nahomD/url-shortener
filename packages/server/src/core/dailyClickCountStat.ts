export default class DailyClickCountStat {
  constructor(
    private totalClicks: number,
    private dailyClickCounts: Array<DailyClickCount>
  ) {}
}

export class DailyClickCount {
  constructor(private day: string, private totalClick: number) {}
}
