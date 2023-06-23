export default class DailyClickCountStat {
  constructor(
    private totalClicks: number,
    private dailyClickCounts: Array<DailyClickCount>
  ) {}

  getTotalClicks() {
    return this.totalClicks;
  }

  getDailyClickCounts() {
    return this.dailyClickCounts;
  }
}

export class DailyClickCount {
  constructor(private day: string, private totalClicks: number) {}
}
