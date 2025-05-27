export default function highlightMarkdownTable(markdown) {
  const tableRegex = /(\|.+\|\n\|[-:\s|]+\|\n(?:\|.*\|\n?)*)/g;

  return markdown.replace(tableRegex, (table) => {
    return processTable(table);
  });
}

function stripMarkdown(text) {
  return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
}

function processTable(tableMarkdown) {
  const rows = tableMarkdown.trim().split("\n").filter(Boolean);

  const header = rows[0]
    .split("|")
    .map((cell) => cell.trim())
    .slice(1, -1);

  const bodyRows = rows.slice(2).map((row) =>
    row
      .split("|")
      .map((cell) => cell.trim())
      .slice(1, -1)
  );

  const numCols = header.length;
  const columns = Array.from({ length: numCols }, (_, i) =>
    bodyRows.map((row) => row[i])
  );

  const isNumericColumn = columns.map((col) =>
    col.every((cell) => {
      const clean = stripMarkdown(cell);
      return !isNaN(parseFloat(clean)) && isFinite(clean);
    })
  );

  const numericValues = columns.map((col, i) =>
    isNumericColumn[i] ? col.map((cell) => parseFloat(stripMarkdown(cell))) : []
  );

  const thresholds = numericValues.map((col) => {
    if (!col.length) return null;
    const sorted = [...col].sort((a, b) => a - b);
    const top10 = sorted[Math.floor(sorted.length * 0.9)];
    const bottom10 = sorted[Math.floor(sorted.length * 0.1)];
    return { top10, bottom10 };
  });

  const lightGreen = "#00CC00";
  const lightRed = "#FF0000";

  const highlightedRows = bodyRows.map((row) =>
    row.map((cell, colIndex) => {
      if (!isNumericColumn[colIndex]) return cell;

      const value = parseFloat(stripMarkdown(cell));
      const truncated = Math.floor(value); // Remove decimal part
      const { top10, bottom10 } = thresholds[colIndex];
      const displayValue = truncated.toString();

      if (value >= top10) {
        return `<div style="color: ${lightGreen}; font-weight: bold; height: 100%; width: 100%;">${displayValue}</div>`;
      } else if (value <= bottom10) {
        return `<div style="color: ${lightRed}; font-weight: bold; height: 100%; width: 100%;">${displayValue}</div>`;
      } else {
        return displayValue;
      }
    })
  );

  const headerLine = `| ${header.join(" | ")} |`;
  const separatorLine = `| ${header.map(() => "---").join(" | ")} |`;
  const bodyLines = highlightedRows.map((row) => `| ${row.join(" | ")} |`);

  return [headerLine, separatorLine, ...bodyLines].join("\n");
}
