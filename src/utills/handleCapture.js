import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import ReactSwal from "../utills/alert";

export default function handleCapture(answerRef, mode) {
  if (!answerRef.current) return;

  if (mode === "clipboard") {
    html2canvas(answerRef.current, {
      backgroundColor: "#F0F0F0",
      scale: 2,
    }).then((canvas) => {
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          ReactSwal.fire({
            icon: "success",
            title: "Heads up!",
            text: "Image copied to clipboard!",
          });
        }
      });
    });
  } else if (mode === "pdf") {
    const opt = {
      margin: 0.5,
      filename: "report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(answerRef.current).save();
  }
}
