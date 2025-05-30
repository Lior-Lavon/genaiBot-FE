function normalizeHeaderLine(line) {
  const stripped = line.replace(/\*/g, "").trim();
  const noHeading = stripped.replace(/^#+\s*/, "");
  return "### " + noHeading;
}

export default function extractAndReplaceWhatsNextSection(text) {
  console.log("text : ", text);

  const lines = text.replace(/\r\n|\r/g, "\n").split("\n");
  const bulletRegex = /^[•\-*]\s+/;
  const headerRegex =
    /^(?:\*{2}|#+\s*)?\s*(what's next|next steps|try these)(\W|$)/i;

  // Step 1: Find header
  const headerIdx = lines.findIndex((line) => headerRegex.test(line.trim()));

  if (headerIdx === -1) {
    return {
      cleanedText: text,
      whatsNextSection: null,
    };
  }

  // normalize the header
  let headerLine = normalizeHeaderLine(lines[headerIdx]);
  const sectionLines = [];
  const bulletLines = [];

  let i = headerIdx + 1;

  // Skip blank lines
  while (i < lines.length && lines[i].trim() === "") {
    sectionLines.push(lines[i++]);
  }

  // Optional paragraphs before bullets
  while (
    i < lines.length &&
    lines[i].trim() !== "" &&
    !bulletRegex.test(lines[i].trim())
  ) {
    sectionLines.push(lines[i++]);
  }

  // Bullets and subparagraphs
  while (i < lines.length) {
    const line = lines[i];
    if (bulletRegex.test(line.trim())) {
      let bullet = line.replace(bulletRegex, "");
      i++;
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !bulletRegex.test(lines[i].trim())
      ) {
        bullet += " " + lines[i++].trim();
      }
      bulletLines.push(bullet.replace(/\*\*(.*?)\*\*/g, "$1").trim());
    } else if (line.trim() === "") {
      sectionLines.push(line);
      i++;
    } else {
      break;
    }
  }

  // Convert bullets to buttons
  const buttonMarkdown = bulletLines
    .map((line) => {
      // const label = line.length > 120 ? line.slice(0, 120) + "..." : line;
      const label = line;
      return `[${label}]()`;
    })
    .join("\n\n");

  const whatsNextSection = [
    headerLine,
    ...sectionLines,
    "",
    buttonMarkdown,
  ].join("\n");
  const cleanedText = [...lines.slice(0, headerIdx), ...lines.slice(i)].join(
    "\n"
  );

  return {
    cleanedText,
    whatsNextSection,
  };
}
