import { Option } from '@/types';

function idEq(a: unknown, b: unknown): boolean {
  return String(a) === String(b);
}

/**
 * "All" row uses `value: null`. Toggles between every real option id in `dataWithoutAllRow` and an empty selection.
 * Never returns null — the All pseudo-value must not be sent to APIs.
 */
export function multiSelectToggleAllRow(currentValue: unknown, dataWithoutAllRow: Option[]): unknown[] {
  const allIds = dataWithoutAllRow.map(o => o.value).filter(v => v != null && v !== '');
  const current = Array.isArray(currentValue) ? currentValue.filter(v => v != null && v !== '') : [];
  const allSelected =
    allIds.length > 0 && allIds.every(id => current.some(c => idEq(c, id)));
  return allSelected ? [] : [...allIds];
}
