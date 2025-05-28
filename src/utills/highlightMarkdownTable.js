export default function highlightMarkdownTable(markdown) {
  const tableRegex = /(\|.+\|\n\|[-:\s|]+\|\n(?:\|.*\|\n?)*)/g;

  return markdown.replace(tableRegex, (table) => {
    return processTable(table);
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

  // Determine which columns are numeric by checking all cells after stripping markdown and emojis
  const isNumericColumn = columns.map((col) =>
    col.every((cell) => {
      const clean = stripMarkdownAndEmoji(cell).trim();
      if (clean === "-" || clean === "") return true; // treat missing as valid
      return !isNaN(parseFloat(clean)) && isFinite(clean);
    })
  );

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

  const lightGreen = "#00CC00";
  const lightRed = "#FF0000";

  // Format rows, highlight whole numeric columns according to thresholds
  const highlightedRows = bodyRows.map((row) =>
    row.map((cell, colIndex) => {
      if (!isNumericColumn[colIndex]) {
        // Non-numeric columns output as is (preserve markdown, emojis, etc)
        return cell;
      }

      // Clean the cell by removing markdown but preserve suffix (emojis, text)
      // We want to keep emojis in suffix, so parse original cell for suffix instead of stripped
      // 1. Strip markdown from original cell (bold, italic)
      let cleanText = cell
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .trim();

      // 2. Extract number and suffix with regex: number (with + or -) + anything else as suffix
      const match = cleanText.match(/^([+\-]?\d*\.?\d+)(.*)$/);
      if (!match) {
        // fallback if no number detected, return original cleaned text
        return cleanText;
      }

      const numStr = match[1];
      const suffix = match[2] || "";

      const num = parseFloat(numStr);
      if (isNaN(num)) {
        return cleanText;
      }

      // Remove .0 if integer
      const formattedNum = Number.isInteger(num)
        ? num.toString()
        : num.toString().replace(/\.0+$/, "");

      const displayValue = formattedNum + suffix;

      const threshold = thresholds[colIndex];
      if (!threshold) {
        return displayValue;
      }

      if (num >= threshold.top10) {
        return `<div style="color: ${lightGreen}; font-weight: bold; height: 100%; width: 100%;">${displayValue}</div>`;
      } else if (num <= threshold.bottom10) {
        return `<div style="color: ${lightRed}; font-weight: bold; height: 100%; width: 100%;">${displayValue}</div>`;
      } else {
        return displayValue;
      }
    })
  );

  // Rebuild markdown table
  const headerLine = `| ${header.join(" | ")} |`;
  const separatorLine = `| ${header.map(() => "---").join(" | ")} |`;
  const bodyLines = highlightedRows.map((row) => `| ${row.join(" | ")} |`);

  return [headerLine, separatorLine, ...bodyLines].join("\n");
}
