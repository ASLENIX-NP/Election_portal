import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateElectionPDF = (stats, chartData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(59, 130, 246); // Blue
  doc.text("Official Election Results", 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  doc.text("Certified by: System Administrator", 14, 36);

  // Stats Section
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Summary Statistics", 14, 50);
  
  const statsBody = stats.map(s => [s.label, s.value]);
  doc.autoTable({
    startY: 55,
    head: [['Metric', 'Value']],
    body: statsBody,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] }
  });

  // Results Section
  const nextY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text("Detailed Candidate Results", 14, nextY);

  const resultsBody = chartData.map(c => [c.name, c.votes]);
  doc.autoTable({
    startY: nextY + 5,
    head: [['Candidate / Position', 'Total Votes']],
    body: resultsBody.sort((a, b) => b[1] - a[1]), // Sort by votes desc
    theme: 'striped',
    headStyles: { fillColor: [139, 92, 246] } // Purple
  });

  // Footer Signature Line
  const finalY = doc.lastAutoTable.finalY + 30;
  if (finalY < 250) {
    doc.line(14, finalY, 80, finalY);
    doc.text("Principal Signature", 14, finalY + 8);
    
    doc.line(120, finalY, 190, finalY);
    doc.text("Election Commissioner", 120, finalY + 8);
  }

  doc.save('Election_Results_Official.pdf');
};

export const generateElectionCSV = (chartData) => {
  const headers = ['Candidate,Position,Votes'];
  const rows = chartData.map(c => {
    // Basic parse of "John Doe (Pres)" to extract name and position
    const match = c.name.match(/(.+) \((.+)\)/);
    const name = match ? match[1] : c.name;
    const pos = match ? match[2] : 'Unknown';
    return `${name},${pos},${c.votes}`;
  });

  const csvContent = headers.concat(rows).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "Election_Raw_Data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
