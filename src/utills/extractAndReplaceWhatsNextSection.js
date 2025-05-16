export default function extractAndReplaceWhatsNextSection(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const headerRegex = /^#{0,6}\s*what's next\b.*$/i;
  const bulletLines = [];

  let headerIdx = -1;
  let startIdx = -1;
  let endIdx = -1;

  // Step 1: Find "What's Next?" header
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // if (headerRegex.test(line)) {
    if (line.toLowerCase().includes("what's next")) {
      headerIdx = i;
      // console.log(`Found "What's Next" header at line ${i}: "${lines[i]}"`);
      break;
    }
  }

  if (headerIdx === -1) {
    return text;
  }

  // Step 2: Skip blank lines and optional subheader
  let i = headerIdx + 1;
  while (i < lines.length && lines[i].trim() === "") {
    // console.log(`Skipping empty line at ${i}`);
    i++;
  }

  if (i < lines.length && !/^[•\-*]/.test(lines[i].trim())) {
    i++;
  }

  // Step 3: Detect bullet points (including • character)
  const bulletRegex = /^[•\-*]\s+/;

  startIdx = i;
  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") {
      endIdx = i;
      continue;
    }

    if (!bulletRegex.test(line)) {
      endIdx = i;
      break;
    }

    // let newLine = line.replace(/\*/g, "").trimStart();
    let newLine = line.replace(/^\*/, "").trimStart();
    bulletLines.push(newLine);
  }

  if (bulletLines.length === 0) {
    return text;
  } else {
    endIdx = startIdx + bulletLines.length + 1;
  }

  // Step 4: Create markdown buttons
  const buttonMarkdown = bulletLines
    .map((line) => {
      const label = line.length > 120 ? line.slice(0, 120) + "..." : line;
      return `\n [${label}]()`;
    })
    .join("\n");

  // Step 5: Replace bullets in original text
  const newLines = [
    ...lines.slice(0, startIdx),
    buttonMarkdown,
    ...lines.slice(endIdx),
  ];

  const result = newLines.join("\n");

  return result;
}
