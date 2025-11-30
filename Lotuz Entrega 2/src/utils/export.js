export const exportToCSV = (rows, headers, filename = 'export.csv') => {
  const headerLine = headers.map(h => '"' + h.label + '"').join(',');
  const lines = rows.map(r => headers.map(h => {
    const val = r[h.key];
    const str = val == null ? '' : String(val).replace(/"/g, '""');
    return '"' + str + '"';
  }).join(','));
  const csvContent = [headerLine, ...lines].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToExcel = (rows, headers, filename = 'export.xls') => {
  const headerRow = headers.map(h => `<th>${h.label}</th>`).join('');
  const bodyRows = rows.map(r => `<tr>${headers.map(h => `<td>${r[h.key] ?? ''}</td>`).join('')}</tr>`).join('');
  const tableHTML = `
    <table>
      <thead><tr>${headerRow}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  `;
  const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
