export function formatTabularRows(
  columns: string[],
  rows: Array<Array<number | string | null>>,
  emptyMessage: string,
) {
  if (!columns.length) {
    return emptyMessage;
  }

  const header = columns.join(' | ');
  const separator = columns.map(() => '---').join(' | ');
  const body = rows.length
    ? rows.map((row) => row.map((value) => String(value ?? 'null')).join(' | ')).join('\n')
    : 'No rows returned.';

  return `${header}\n${separator}\n${body}`;
}

export function formatRubricLines(values: Array<[string, string | number]>) {
  return values.map(([label, value]) => `${label}: ${value}`).join('\n');
}
