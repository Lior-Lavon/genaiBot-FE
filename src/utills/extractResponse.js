export default function extractResponse(jsonObj) {
  const { response, suggested_next_steps } = jsonObj;
  let retVal = response;

  //  check if the response contains suggested_next_steps
  if (suggested_next_steps != undefined) {
    // iterate over the suggested_next_steps and create the json buttons
    const buttonMarkdown = suggested_next_steps
      .map((line) => {
        const label = line.length > 120 ? line.slice(0, 120) + "..." : line;
        return `\n [${label}]()`;
      })
      .join("\n");
    retVal +=
      "\n\n" + "##### Suggested Next Steps 🤔" + "\n\n" + buttonMarkdown;
  }

  return retVal;
}
