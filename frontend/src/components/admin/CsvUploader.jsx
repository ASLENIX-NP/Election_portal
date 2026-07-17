import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useElection } from '@/context/ElectionContext';

export default function CsvUploader({ onComplete }) {
  const { processCsvData, resetData, positions, candidates } = useElection();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setStatus('error');
      return;
    }
    setFile(selectedFile);
    setStatus('idle');
  };

  const handleUpload = () => {
    if (!file) return;
    setStatus('uploading');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      processCsvData(text);
      setStatus('success');
      setTimeout(() => {
        if(onComplete) onComplete();
      }, 1500);
    };
    reader.onerror = () => {
      setStatus('error');
    };
    reader.readAsText(file);
  };

  const generateMockCsv = () => {
    // Generate headers dynamically based on positions
    const posTitles = positions.map(p => p.title);
    let csv = `Timestamp,Grade,${posTitles.map(t => t.replace(/ /g, '')).join(',')}\n`;
    
    const grades = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
    
    for(let i=0; i<300; i++) {
       const grade = grades[Math.floor(Math.random() * grades.length)];
       let row = `2026-10-01T10:00:00Z,${grade}`;
       
       posTitles.forEach(posTitle => {
         const posCandidates = candidates.filter(c => c.position === posTitle);
         if (posCandidates.length > 0) {
           const randCand = posCandidates[Math.floor(Math.random() * posCandidates.length)];
           row += `,${randCand.name}`;
         } else {
           row += `,None`;
         }
       });
       
       csv += `${row}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mock_votes.csv';
    a.click();
  };

  return (
    <div className="csv-uploader-wrapper" style={{ padding: '1.5rem', background: '#ffffff', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 12px 32px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)' }}>
          <Upload size={16} color="#fff" />
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0' }}>Import Live Votes</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Stream simulated or actual CSV data</p>
        </div>
      </div>
      
      <div 
        className={`upload-dropzone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        style={{
          border: `2px dashed ${dragActive ? '#6366f1' : 'var(--border-color)'}`,
          borderRadius: '16px',
          padding: '2rem 1rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragActive ? 'rgba(99, 102, 241, 0.04)' : '#fafbfc',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '160px'
        }}
        onMouseOver={(e) => { if (!dragActive) { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'; e.currentTarget.style.background = '#f8fafc'; } }}
        onMouseOut={(e) => { if (!dragActive) { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = '#fafbfc'; } }}
      >
        <input ref={inputRef} type="file" accept=".csv" onChange={handleChange} style={{ display: 'none' }} />
        
        {status === 'success' ? (
           <div style={{ color: '#10b981', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'fadeIn 0.3s ease' }}>
             <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <CheckCircle size={28} />
             </div>
             <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Data imported!</p>
             <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>Streaming seamlessly</p>
           </div>
        ) : status === 'error' ? (
           <div style={{ color: '#ef4444', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'fadeIn 0.3s ease' }}>
             <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <AlertCircle size={28} />
             </div>
             <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Invalid File</p>
             <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>Please upload a CSV file.</p>
           </div>
        ) : file ? (
           <div style={{ color: '#6366f1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'fadeIn 0.3s ease' }}>
             <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
               <FileText size={24} />
             </div>
             <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
             <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Ready to process</p>
           </div>
        ) : (
           <div style={{ color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' }}>
             <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', marginBottom: '4px' }}>
               <Upload size={22} />
             </div>
             <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}>Click or drag file here</p>
             <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.7 }}>CSV format required</p>
           </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '0.5rem' }}>
        <button 
          disabled={!file || status === 'uploading' || status === 'success'}
          onClick={(e) => { e.stopPropagation(); handleUpload(); }}
          style={{ 
            width: '100%', padding: '12px', borderRadius: '12px', 
            background: (!file || status === 'uploading' || status === 'success') ? '#e2e8f0' : '#0f172a', 
            color: (!file || status === 'uploading' || status === 'success') ? '#94a3b8' : '#ffffff', 
            fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: (!file || status === 'uploading' || status === 'success') ? 'not-allowed' : 'pointer', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s ease',
            boxShadow: (!file || status === 'uploading' || status === 'success') ? 'none' : '0 4px 12px rgba(15,23,42,0.2)'
          }}
          onMouseOver={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseOut={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {status === 'uploading' ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <div style={{ width: '14px', height: '14px', border: '2px solid #94a3b8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
               Processing...
            </span>
          ) : 'Start Import'}
        </button>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            style={{ 
              flex: 1, padding: '10px', borderRadius: '12px', background: '#f8fafc', color: '#64748b', 
              border: '1px solid #e2e8f0', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s ease' 
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}
            onClick={(e) => { e.stopPropagation(); generateMockCsv(); }}
          >
             Sample CSV
          </button>
          <button 
            style={{ 
              flex: 1, padding: '10px', borderRadius: '12px', background: '#fff1f2', color: '#e11d48', 
              border: '1px solid #ffe4e6', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s ease' 
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#ffe4e6'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#fff1f2'; }}
            onClick={(e) => { e.stopPropagation(); resetData(); setFile(null); setStatus('idle'); }}
          >
             Clear Data
          </button>
        </div>
      </div>
    </div>
  );
}