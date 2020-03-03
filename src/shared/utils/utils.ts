type UnixTime = number;

export function toTimestamp(date: Date): UnixTime {
  return Math.round(date.getTime() / 1000); // https://github.com/gajus/slonik/issues/70
}

// eslint-disable-next-line
export function noop() {}
