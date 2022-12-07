import { ArraySliceSelector } from '../node';

export function applySliceSelector(node: ArraySliceSelector, json: any): object {
  if (Array.isArray(json)) {
    const step = node.step ?? 1;
    const start = node.start ?? (step >= 0 ? 0 : json.length - 1);
    const end = node.end ?? (step >= 0 ? json.length : -json.length - 1);
    const array = [];

    const [lower, upper] = bounds(start, end, step, json.length);

    // IF step > 0 THEN
    //
    //   i = lower
    //   WHILE i < upper:
    //     SELECT a(i)
    //     i = i + step
    //   END WHILE
    //
    // ELSE if step < 0 THEN
    //
    //   i = upper
    //   WHILE lower < i:
    //     SELECT a(i)
    //     i = i + step
    //   END WHILE
    //
    // END IF
    if (step > 0) {
      for (let i = lower; i < upper; i += step) {
        array.push(json[i]);
      }
    } else if (step < 0) {
      for (let i = upper; lower < i; i += step) {
        array.push(json[i]);
      }
    }

    return array;
  } else {
    throw new Error(`JSON node ${JSON.stringify(json)} is not an array`);
  }
}

// FUNCTION Normalize(i, len):
//   IF i >= 0 THEN
//     RETURN i
//   ELSE
//     RETURN len + i
//   END IF
function normalized(index: number, length: number): number {
  if (index >= 0) {
    return index;
  } else {
    return length + index;
  }
}

// FUNCTION Bounds(start, end, step, len):
//   n_start = Normalize(start, len)
//   n_end = Normalize(end, len)
//
//   IF step >= 0 THEN
//     lower = MIN(MAX(n_start, 0), len)
//     upper = MIN(MAX(n_end, 0), len)
//   ELSE
//     upper = MIN(MAX(n_start, -1), len-1)
//     lower = MIN(MAX(n_end, -1), len-1)
//   END IF
//
//   RETURN (lower, upper)
function bounds(start: number, end: number, step: number, length: number): [number, number] {
  const nStart = normalized(start, length);
  const nEnd = normalized(end, length);

  let lower;
  let upper;
  if (step >= 0) {
    lower = Math.min(Math.max(nStart, 0), length);
    upper = Math.min(Math.max(nEnd, 0), length);
  } else {
    upper = Math.min(Math.max(nStart, -1), length - 1);
    lower = Math.min(Math.max(nEnd, -1), length - 1);
  }

  return [lower, upper];
}