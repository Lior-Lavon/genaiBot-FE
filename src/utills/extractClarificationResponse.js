export default function extractClarificationResponse(jsonObj) {
  const { clarifications } = jsonObj;
  let retVal = "##### Just a few clarifications needed 🤔";

  return { clarifications, title: retVal };
}
