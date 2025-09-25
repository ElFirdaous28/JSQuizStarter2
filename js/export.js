export function exportPDF(elementId, filename) {
    html2canvas(document.getElementById(elementId), { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight + 10;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(filename);
    });
}

export function exportJSON(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename.endsWith(".json") ? filename : filename + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function exportCSV(data, filename) {
    if (!data || !data.length) return;

    // get keys so they became headers
    const headers = Object.keys(data[0]).join(",");

    // convert object to csv
    const rows = data.map(obj =>
        Object.values(obj)
            .map(value => `"${value}"`)
            .join(",")
    );

    // join headers and values
    const csvContent = [headers, ...rows].join("\n");

    // 4. Create a Blob
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // create link to download the file
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.endsWith(".csv") ? filename : filename + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}