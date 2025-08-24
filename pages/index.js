import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Home() {
  const rows = 20;
  const cols = 10;
  const [text, setText] = useState("");
  const gridRef = useRef(null);

  const cells = Array.from({ length: rows * cols }, (_, i) => text[i] || "");

  // شمارش کاراکتر
  const charCount = text.length;
  const maxChars = rows * cols;

  // ذخیره به PNG
  const downloadPNG = async () => {
    if (!gridRef.current) return;
    const canvas = await html2canvas(gridRef.current);
    const link = document.createElement("a");
    link.download = "wongoji.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // ذخیره به PDF
  const downloadPDF = async () => {
    if (!gridRef.current) return;
    const canvas = await html2canvas(gridRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // محاسبه نسبت برای جا گرفتن تصویر
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("wongoji.pdf");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100 font-sans">
      <h1 className="text-2xl font-bold mb-4">📝 Wongoji Editor</h1>

      {/* شمارش کاراکتر */}
      <div className="mb-2 text-gray-700">
        کاراکترها: {charCount} / {maxChars}
      </div>

      {/* ناحیه ورودی متن */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="이곳에 한국어를 입력하세요..."
        className="w-full max-w-lg h-24 p-2 border rounded mb-6"
      />

      {/* دکمه‌های خروجی */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={downloadPNG}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
           دانلود تصویر (PNG) 📷
        </button>
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          دانلود PDF 📄
        </button>
      </div>

      {/* شبکه وونگوجی */}
      <div
        ref={gridRef}
        className="grid border-2 border-black bg-white"
        style={{
          gridTemplateRows: `repeat(${rows}, 2rem)`,
          gridTemplateColumns: `repeat(${cols}, 2rem)`,
        }}
      >
        {cells.map((char, i) => (
          <div
            key={i}
            className={`flex items-center justify-center border text-lg font-[Noto_Sans_KR] ${
              (Math.floor(i / cols) + 1) % 5 === 0 ? "border-b-2" : ""
            }`}
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  );
}
