export default function highlightMarkdownTable(markdown) {
  const tableRegex = /(\|.+\|\n\|[-:\s|]+\|\n(?:\|.*\|\n?)*)/g;

  if (!tableRegex.test(markdown)) {
    console.log("❌ Table not found in markdown");
    return markdown;
  }

  console.log("✅ Table found in markdown");

  return markdown.replace(tableRegex, (table) => {
    console.log("📋 Processing a table:");
    console.log(table);
    return processTable(table);
  });
}

function stripMarkdown(text) {
  // Remove bold, italic, and other inline markdown characters
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

  console.log("🧩 Header:", header);
  console.log("🔢 Number of columns:", header.length);
  console.log("🧾 Body rows:", bodyRows.length);

  const numCols = header.length;
  const columns = Array.from({ length: numCols }, (_, i) =>
    bodyRows.map((row) => row[i])
  );

  // Determine numeric columns
  const isNumericColumn = columns.map((col, i) => {
    const numeric = col.every((cell) => {
      const clean = stripMarkdown(cell);
      return !isNaN(parseFloat(clean)) && isFinite(clean);
    });
    console.log(
      `🔍 Column "${header[i]}" is ${numeric ? "numeric ✅" : "not numeric ❌"}`
    );
    return numeric;
  });

  const numericValues = columns.map((col, i) =>
    isNumericColumn[i] ? col.map((cell) => parseFloat(stripMarkdown(cell))) : []
  );

  const thresholds = numericValues.map((col, i) => {
    if (!col.length) return null;
    const sorted = [...col].sort((a, b) => a - b);
    const top10 = sorted[Math.floor(sorted.length * 0.9)];
    const bottom10 = sorted[Math.floor(sorted.length * 0.1)];
    console.log(
      `📈 "${header[i]}" - Top 10% >= ${top10}, Bottom 10% <= ${bottom10}`
    );
    return { top10, bottom10 };
  });

  const highlightedRows = bodyRows.map((row) => {
    return row.map((cell, colIndex) => {
      if (!isNumericColumn[colIndex]) return cell;

      const value = parseFloat(stripMarkdown(cell));
      const { top10, bottom10 } = thresholds[colIndex];

      if (value >= top10) {
        return `<span style="color: green; font-weight: bold;">${cell}</span>`;
      } else if (value <= bottom10) {
        return `<span style="color: red; font-weight: bold;">${cell}</span>`;
      } else {
        return cell;
      }
    });
  });

  const headerLine = `| ${header.join(" | ")} |`;
  const separatorLine = `| ${header.map(() => "---").join(" | ")} |`;
  const bodyLines = highlightedRows.map((row) => `| ${row.join(" | ")} |`);

  console.log("✅ Finished processing table");

  return [headerLine, separatorLine, ...bodyLines].join("\n");
}
