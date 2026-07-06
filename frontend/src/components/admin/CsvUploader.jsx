import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useElection } from '../../context/ElectionContext';

export default function CsvUploader({ onComplete }) {
  const { processCsvData, resetData } = useElection();
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
    let csv = 'Timestamp,Grade,PresidentChoice,VPChoice\n';
    const grades = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
    const presidents = ['John Doe', 'Jane Smith'];
    const vps = ['Alice W.', 'Bob M.'];
    
    for(let i=0; i<300; i++) {
       const grade = grades[Math.floor(Math.random() * grades.length)];
       const pres = presidents[Math.floor(Math.random() * presidents.length)];
       const vp = vps[Math.floor(Math.random() * vps.length)];
       csv += `2026-10-01T10:00:00Z,${grade},${pres},${vp}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mock_votes.csv';
    a.click();
  };

  return (
    <div className="csv-uploader-wrapper" style={{ padding: '1.5rem', background: 'var(--surface-color)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
      <h3 className="card-title mb-4">Import Live Votes CSV</h3>
      
      <div 
        className={`upload-dropzone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        style={{
          border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border-color)'}`,
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragActive ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <input ref={inputRef} type="file" accept=".csv" onChange={handleChange} style={{ display: 'none' }} />
        
        {status === 'success' ? (
           <div className="flex flex-col items-center gap-2" style={{ color: 'var(--success)' }}>
             <CheckCircle size={32} />
             <p>Data imported and streaming successfully!</p>
           </div>
        ) : status === 'error' ? (
           <div className="flex flex-col items-center gap-2" style={{ color: 'var(--danger)' }}>
             <AlertCircle size={32} />
             <p>Error: Please upload a valid CSV file.</p>
           </div>
        ) : file ? (
           <div className="flex flex-col items-center gap-2" style={{ color: 'var(--accent)' }}>
             <FileText size={32} />
             <p className="font-semibold">{file.name}</p>
             <p className="text-sm text-secondary">Ready to process</p>
           </div>
        ) : (
           <div className="flex flex-col items-center gap-2 text-secondary">
             <Upload size={32} />
             <p>Drag & drop your CSV file here, or click to browse</p>
             <p className="text-sm">Format: Timestamp, Grade, PresidentChoice, VPChoice</p>
           </div>
        )}
      </div>

      <div className="flex-between mt-4">
        <button className="btn btn-secondary text-sm" onClick={(e) => { e.stopPropagation(); generateMockCsv(); }}>
           Download Sample CSV
        </button>
        <div className="flex gap-2">
          <button 
            className="btn btn-danger" 
            onClick={(e) => { e.stopPropagation(); resetData(); setFile(null); setStatus('idle'); }}
          >
             Remove Data
          </button>
          <button 
            className="btn btn-primary" 
            disabled={!file || status === 'uploading' || status === 'success'}
            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
          >
             {status === 'uploading' ? 'Processing...' : 'Start Import'}
          </button>
        </div>
      </div>
    </div>
  );
}