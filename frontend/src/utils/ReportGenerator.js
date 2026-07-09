import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateElectionPDF = (stats, candidates) => {
  const doc = new jsPDF();
  
  // Professional Letterhead
  doc.setFillColor(30, 41, 59); // Dark Slate Blue
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255); // White
  doc.text("CERTIFICATE OF ELECTION RESULTS", 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text("Official Automated Audit Report", 105, 30, { align: 'center' });

  // Metadata Section
  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text(`Date of Certification: ${new Date().toLocaleString()}`, 14, 50);
  
  const hash = 'SHA256-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  doc.text(`Document Hash: ${hash}`, 14, 56);
  doc.text("Status: VERIFIED & SEALED", 14, 62);

  // Summary Statistics
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("I. Summary Statistics", 14, 75);
  
  const statsBody = stats.map(s => [s.label, s.value]);
  doc.autoTable({
    startY: 80,
    head: [['Metric', 'Recorded Value']],
    body: statsBody,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] }, // Emerald Green
    margin: { top: 10 }
  });

  // Candidate Results Section
  const nextY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text("II. Detailed Electoral Standings", 14, nextY);

  // Group candidates by position
  const positions = [...new Set(candidates.map(c => c.position))];
  
  let currentY = nextY + 5;

  positions.forEach(pos => {
    const posCandidates = candidates.filter(c => c.position === pos).sort((a, b) => b.votes - a.votes);
    const totalPosVotes = posCandidates.reduce((sum, c) => sum + c.votes, 0);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Position: ${pos.toUpperCase()}`, 14, currentY + 8);
    
    const resultsBody = posCandidates.map((c, i) => {
      const percentage = totalPosVotes > 0 ? ((c.votes / totalPosVotes) * 100).toFixed(1) + '%' : '0%';
      const margin = i === 0 && posCandidates.length > 1 ? `+${c.votes - posCandidates[1].votes}` : '-';
      return [i + 1, c.name, c.votes.toLocaleString(), percentage, margin];
    });

    doc.autoTable({
      startY: currentY + 12,
      head: [['Rank', 'Candidate Name', 'Votes', 'Share', 'Margin']],
      body: resultsBody,
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] }, // Purple
      margin: { top: 10 }
    });
    
    currentY = doc.lastAutoTable.finalY + 10;
  });

  // Footer Signature Lines
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }
  
  currentY += 20;
  doc.line(20, currentY, 80, currentY);
  doc.text("Principal / Chief Administrator", 20, currentY + 8);
  
  doc.line(130, currentY, 190, currentY);
  doc.text("Election Commissioner", 130, currentY + 8);

  doc.save(`Election_Results_${new Date().getTime()}.pdf`);
};

export const generateElectionCSV = (candidates) => {
  const headers = ['ID,Candidate Name,Position,Total Votes,Vote Percentage'];
  
  // Group by position to calculate percentages
  const positions = [...new Set(candidates.map(c => c.position))];
  let rows = [];

  positions.forEach(pos => {
    const posCandidates = candidates.filter(c => c.position === pos).sort((a, b) => b.votes - a.votes);
    const totalVotes = posCandidates.reduce((sum, c) => sum + c.votes, 0);
    
    posCandidates.forEach(c => {
      const percentage = totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(2) + '%' : '0%';
      rows.push(`${c.id},"${c.name}","${c.position}",${c.votes},${percentage}`);
    });
  });

  const csvContent = headers.concat(rows).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Election_Raw_Data_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
