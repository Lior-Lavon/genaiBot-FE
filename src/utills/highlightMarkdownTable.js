export default function highlightMarkdownTable(markdown) {
  const tableRegex = /(\|.+\|\n\|[-:\s|]+\|\n(?:\|.*\|\n?)*)/g;

  return markdown.replace(tableRegex, (table) => {
    return processTable(table) + "\n\n" + "<br/><br/>";
  });
}

// Helper: strip markdown and emojis (anything non-digit, non-dot, non-plus, non-minus)
function stripMarkdownAndEmoji(text) {
  if (!text) return "";
  // Remove bold/italic markdown
  let stripped = text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1");
  // Remove emojis/non-numeric characters except + - .
  stripped = stripped.replace(/[^\d.+-]/g, "");
  return stripped;
}

function processTable(tableMarkdown) {
  const rows = tableMarkdown.trim().split("\n").filter(Boolean);

  // Extract header cells (trim and remove empty edges)
  const header = rows[0]
    .split("|")
    .map((cell) => cell.trim())
    .slice(1, -1);

  // Extract body rows as array of cell strings
  const bodyRows = rows.slice(2).map((row) =>
    row
      .split("|")
      .map((cell) => cell.trim())
      .slice(1, -1)
  );

  const numCols = header.length;

  // Build columns: arrays of cells for each column
  const columns = Array.from({ length: numCols }, (_, i) =>
    bodyRows.map((row) => row[i])
  );

  // Helper: strip markdown and emojis (anything non-digit, non-dot, non-plus, non-minus)
  function stripMarkdownAndEmoji(text) {
    if (!text) return "";
    // Remove bold/italic markdown
    let stripped = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1");
    // Remove emojis/non-numeric characters except + - .
    stripped = stripped.replace(/[^\d.+-]/g, "");
    return stripped;
  }

  // Determine which columns are numeric by checking all cells after stripping markdown and emojis
  const isNumericColumn = columns.map((col, i) => {
    const headerTitle = header[i].toLowerCase().trim();

    // Hardcode exclusion list (can be expanded as needed)
    const excludedHeaders = ["rank", "#", "index", "position"];

    if (excludedHeaders.includes(headerTitle)) return false;

    let hasValidNumber = false;

    const allCellsAreNumericLike = col.every((cell) => {
      const clean = stripMarkdownAndEmoji(cell).trim();
      if (clean === "-" || clean === "") return true;
      const isNumber = !isNaN(parseFloat(clean)) && isFinite(clean);
      if (isNumber) hasValidNumber = true;
      return isNumber;
    });

    return hasValidNumber && allCellsAreNumericLike;
  });

  // Extract numeric values for threshold calc, ignoring missing cells
  const numericValues = columns.map((col, i) =>
    isNumericColumn[i]
      ? col
          .map((cell) => {
            const clean = stripMarkdownAndEmoji(cell).trim();
            if (clean === "-" || clean === "") return null;
            return parseFloat(clean);
          })
          .filter((v) => v !== null)
      : []
  );

  // Calculate top10 and bottom10 thresholds per numeric column
  const thresholds = numericValues.map((col) => {
    if (!col.length) return null;
    const sorted = [...col].sort((a, b) => a - b);
    const top10 = sorted[Math.floor(sorted.length * 0.9)];
    const bottom10 = sorted[Math.floor(sorted.length * 0.1)];
    return { top10, bottom10 };
  });

  const lightGreen = "#66BB6A";
  const lightRed = "#E57373";

  // Build <colgroup> for equal widths (e.g. 100% / numCols each)
  const colWidthPercent = (100 / numCols).toFixed(2);

  const colGroup = `<colgroup>${Array(numCols)
    .fill(`<col style="width:${colWidthPercent}%;"></col>`)
    .join("")}</colgroup>`;

  // Build header row HTML
  const headerHtml = header
    .map(
      (cell) =>
        `<th style="text-align:left; padding:6px; border:1px solid #ddd;">${cell}</th>`
    )
    .join("");

  // Build body rows with highlighted cells
  const bodyHtml = bodyRows
    .map((row) =>
      row
        .map((cell, colIndex) => {
          const isNumeric = isNumericColumn[colIndex];
          const textAlign = isNumeric ? "right" : "left";

          // Clean cell text (remove markdown formatting)
          let cleanText = cell
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/\*(.*?)\*/g, "$1")
            .trim();

          if (!isNumeric) {
            return `<td style="text-align:${textAlign}; padding:6px; border:1px solid #ddd;">${cleanText}</td>`;
          }

          const match = cleanText.match(/^([+\-]?\d*\.?\d+)(.*)$/);
          if (!match) {
            return `<td style="text-align:${textAlign}; padding:6px; border:1px solid #ddd;">${cleanText}</td>`;
          }

          const numStr = match[1];
          const suffix = match[2] || "";
          const num = parseFloat(numStr);

          if (isNaN(num)) {
            return `<td style="text-align:${textAlign}; padding:6px; border:1px solid #ddd;">${cleanText}</td>`;
          }

          const formattedNum = Number.isInteger(num)
            ? num.toString()
            : num.toString().replace(/\.0+$/, "");

          const displayValue = formattedNum + suffix;

          const threshold = thresholds[colIndex];
          let color = "inherit";
          if (threshold && threshold.top10 !== threshold.bottom10) {
            if (num >= threshold.top10) color = lightGreen;
            else if (num <= threshold.bottom10) color = lightRed;
          }

          return `<td style="text-align:${textAlign}; font-weight:bold; color:${color}; padding:6px; border:1px solid #ddd;">${displayValue}</td>`;
        })
        .join("")
    )
    .map((cells) => `<tr>${cells}</tr>`)
    .join("\n");

  const html = `
<table style="border-collapse: collapse; table-layout: fixed; width: 100%; font-family: Arial, sans-serif;">
  ${colGroup}
  <thead>
    <tr>${headerHtml}</tr>
  </thead>
  <tbody>
    ${bodyHtml}
  </tbody>
</table>
  `;

  return html.trim();
}
