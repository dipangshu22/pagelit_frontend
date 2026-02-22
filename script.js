const backendURL = "https://pagelit-backend-1.onrender.com";

const output = document.getElementById("output");
const downloadSection = document.getElementById("downloadSection");

// Convert Images → PDF
async function convertToPDF() {
    const files = document.getElementById("fileInput").files;

    if (!files.length) {
        alert("Please select images first");
        return;
    }

    output.innerText = "Generating PDF...";
    downloadSection.innerHTML = "";

    const formData = new FormData();
    for (let file of files) {
        formData.append("files", file);
    }

    try {
        const response = await fetch(`${backendURL}/convert-to-pdf`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("Failed");

        const blob = await response.blob();

        output.innerText = "PDF generated successfully ✅";

        window.generatedPDF = blob;

        downloadSection.innerHTML =
            `<button onclick="downloadPDFFromBlob()">Download PDF</button>`;

    } catch (error) {
        output.innerText = "Error generating PDF ❌";
    }
}

function downloadPDFFromBlob() {
    if (!window.generatedPDF) return;

    const url = URL.createObjectURL(window.generatedPDF);
    const link = document.createElement("a");
    link.href = url;
    link.download = "converted.pdf";
    link.click();
    URL.revokeObjectURL(url);
}


// Image → Text
async function imageToText() {
    const file = document.getElementById("fileInput").files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    output.innerText = "Extracting text...";
    downloadSection.innerHTML = "";

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${backendURL}/image-to-text`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("Failed");

        const data = await response.json();

        output.innerText = data.extracted_text || "No text detected.";

        downloadSection.innerHTML =
            `<button onclick="downloadText()">Download Text</button>`;

    } catch (error) {
        output.innerText = "Error extracting text ❌";
    }
}

function downloadText() {
    const text = output.innerText;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "extracted_text.txt";
    link.click();

    URL.revokeObjectURL(url);
}
async function removeBackground() {
    const file = document.getElementById("fileInput").files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://127.0.0.1:8000/remove-background", {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("Failed");

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "background_removed.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (err) {
        alert("Background removal failed");
    }
}