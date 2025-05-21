export default function getPromptTime(timeStamp) {
  const delta = timeStamp.end - timeStamp.start;
  const seconds = Math.floor(delta / 1000); // 3 seconds
  const leftoverMs = delta % 1000;
  return seconds + "sec. " + leftoverMs + "ms.";
}
