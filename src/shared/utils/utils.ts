// https://stackoverflow.com/a/32108184/136559
export function isEmptyObject(obj: object): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

type UnixTime = number;

export function toTimestamp(date: Date): UnixTime {
  return Math.round(date.getTime() / 1000); // https://github.com/gajus/slonik/issues/70
}
