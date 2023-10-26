export enum ExpectedLifeSpanType {
  Years = 'YEARS',
  Months = 'MONTHS',
  Weeks = 'WEEKS',
  Days = 'DAYS',
}

export const expectedLifeSpanTypes = new Map([
  [ExpectedLifeSpanType.Years, 'Years'],
  [ExpectedLifeSpanType.Months, 'Months'],
  [ExpectedLifeSpanType.Weeks, 'Weeks'],
  [ExpectedLifeSpanType.Days, 'Days'],
]);
