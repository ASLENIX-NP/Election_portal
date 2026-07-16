import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { Power, Settings as SettingsIcon, ShieldAlert, Clock, EyeOff, Palette, Image as ImageIcon, CheckCircle2, GraduationCap, Plus, X } from 'lucide-react';
import { useElection } from '@/context/ElectionContext';
import '../dashboard.css';

export default function AdminSettings() {
  const { 
    electionTitle, academicYear, status, updateElectionConfig, setStatus,
    advancedSettings, updateAdvancedSettings
  } = useElection();
  
  const [titleInput, setTitleInput] = useState(electionTitle);
  const [yearInput, setYearInput] = useState(academicYear);
  const [localSettings, setLocalSettings] = useState(advancedSettings);
  const [newClassInput, setNewClassInput] = useState('');
  const [saved, setSaved] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTitleInput(electionTitle);
    setYearInput(academicYear);
    setLocalSettings(advancedSettings);
  }, [electionTitle, academicYear, advancedSettings]);

  const handleSaveConfig = () => {
    updateElectionConfig(titleInput, yearInput);
    updateAdvancedSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleSetting = (key) => {
    setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalSettings({ ...localSettings, schoolLogo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const Toggle = ({ label, description, checked, onChange }) => (
    <div style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '12px 14px', background: '#fafbfc', borderRadius: '8px', 
      border: '1px solid var(--border-color)' 
    }}>
      <div style={{ paddingRight: '1rem' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{label}</h4>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>{description}</p>
      </div>
      <div 
        onClick={onChange}
        style={{
          width: '36px', height: '20px', borderRadius: '10px', 
          background: checked ? '#059669' : 'rgba(0,0,0,0.12)',
          position: 'relative', cursor: 'pointer', transition: 'background 0.2s ease', flexShrink: 0
        }}
      >
        <div style={{
          width: '16px', height: '16px', borderRadius: '50%', background: 'white', 
          position: 'absolute', top: '2px',
          left: checked ? '18px' : '2px', transition: 'left 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)', 
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }} />
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#0f172a', margin: '0 0 4px 0' }}>
            Settings
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            Election configuration, security, and branding
          </p>
        </div>
        <button 
          onClick={handleSaveConfig} 
          style={{ 
            background: saved ? '#059669' : '#0f172a', color: '#fff', border: 'none', 
            padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', 
            transition: 'all 0.2s ease', fontFamily: 'inherit'
          }}
        >
          <CheckCircle2 size={15} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* General Config */}
          <div className="dashboard-panel" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 4px 0', color: '#0f172a' }}>General</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0 0 1rem 0' }}>Core election details</p>

            <div className="form-group">
              <label style={{ fontSize: '0.78rem', fontWeight: 500, color: '#64748b' }}>Election Title</label>
              <input type="text" className="form-control" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 500, color: '#64748b' }}>Academic Year</label>
              <input type="text" className="form-control" value={yearInput} onChange={(e) => setYearInput(e.target.value)} />
            </div>
          </div>

          {/* Live Status */}
          <div className="dashboard-panel" style={{ padding: '1.25rem', borderLeft: status === 'Active' ? '3px solid #059669' : '3px solid #dc2626' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 2px 0', color: '#0f172a' }}>Election Status</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>
                  Currently: <span style={{ color: status === 'Active' ? '#059669' : '#dc2626', fontWeight: 600 }}>{status}</span>
                </p>
              </div>
              <Power size={18} color={status === 'Active' ? '#059669' : '#dc2626'} />
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {status === 'Active' ? (
                <>
                  <button className="btn" style={{ flex: 1, justifyContent: 'center', background: 'rgba(220,38,38,0.05)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.12)', padding: '8px', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }} onClick={() => setStatus('Ended')}>End Election</button>
                  <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: '0.8rem', fontWeight: 500 }} onClick={() => setStatus('Paused')}>Pause</button>
                </>
              ) : (
                <button className="btn" style={{ flex: 1, justifyContent: 'center', background: '#059669', color: 'white', border: 'none', padding: '8px', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }} onClick={() => setStatus('Active')}>Start / Resume</button>
              )}
            </div>
          </div>

          {/* Voting Eligibility */}
          <div className="dashboard-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <GraduationCap size={16} color="#059669" />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: '#0f172a' }}>Voting Eligibility</h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0 0 1rem 0' }}>Select which classes/grades can participate</p>
            
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {(localSettings.availableGrades || ['9th', '10th', '11th', '12th']).map(grade => {
                const isSelected = localSettings.eligibleGrades?.includes(grade);
                return (
                  <button
                    key={grade}
                    onClick={() => {
                      const currentGrades = localSettings.eligibleGrades || [];
                      const newGrades = isSelected
                        ? currentGrades.filter(g => g !== grade)
                        : [...currentGrades, grade];
                      setLocalSettings({ ...localSettings, eligibleGrades: newGrades });
                    }}
                    style={{
                      padding: '5px 12px', borderRadius: '6px',
                      border: isSelected ? '1px solid rgba(5, 150, 105, 0.2)' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(5, 150, 105, 0.06)' : '#fff',
                      color: isSelected ? '#059669' : '#94a3b8',
                      fontWeight: 500, fontSize: '0.78rem',
                      cursor: 'pointer', transition: 'all 0.15s ease',
                      fontFamily: 'inherit'
                    }}
                  >
                    {grade}
                  </button>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input 
                type="text" 
                placeholder="Add class..." 
                value={newClassInput}
                onChange={e => setNewClassInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newClassInput.trim()) {
                    const val = newClassInput.trim();
                    const currentAvailable = localSettings.availableGrades || ['9th', '10th', '11th', '12th'];
                    if (!currentAvailable.includes(val)) {
                      const newAvailable = [...currentAvailable, val];
                      const newEligible = [...(localSettings.eligibleGrades || []), val];
                      setLocalSettings({ ...localSettings, availableGrades: newAvailable, eligibleGrades: newEligible });
                    }
                    setNewClassInput('');
                  }
                }}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.78rem', flex: 1, fontFamily: 'inherit' }}
              />
              <button 
                onClick={() => {
                  if (newClassInput.trim()) {
                    const val = newClassInput.trim();
                    const currentAvailable = localSettings.availableGrades || ['9th', '10th', '11th', '12th'];
                    if (!currentAvailable.includes(val)) {
                      const newAvailable = [...currentAvailable, val];
                      const newEligible = [...(localSettings.eligibleGrades || []), val];
                      setLocalSettings({ ...localSettings, availableGrades: newAvailable, eligibleGrades: newEligible });
                    }
                    setNewClassInput('');
                  }
                }}
                style={{ 
                  background: '#fafbfc', border: '1px solid var(--border-color)', 
                  padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', 
                  display: 'flex', alignItems: 'center', gap: '3px', 
                  fontSize: '0.78rem', fontWeight: 500, color: '#64748b', fontFamily: 'inherit' 
                }}
              >
                <Plus size={13} /> Add
              </button>
            </div>
          </div>

          {/* Scheduling */}
          <div className="dashboard-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Clock size={16} color="#d97706" />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: '#0f172a' }}>Scheduling</h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0 0 1rem 0' }}>Automate start and stop times</p>
            <Toggle label="Enable Scheduling" description="Enforce voting within the configured time window." checked={localSettings.scheduledVoting} onChange={() => toggleSetting('scheduledVoting')} />
            
            {localSettings.scheduledVoting && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '0.75rem', animation: 'fadeIn 0.2s ease' }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: '0.75rem' }}>Start</label>
                  <input type="datetime-local" className="form-control" value={localSettings.startTime} onChange={e => setLocalSettings({...localSettings, startTime: e.target.value})} style={{ fontSize: '0.78rem' }} />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: '0.75rem' }}>End</label>
                  <input type="datetime-local" className="form-control" value={localSettings.endTime} onChange={e => setLocalSettings({...localSettings, endTime: e.target.value})} style={{ fontSize: '0.78rem' }} />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Security */}
          <div className="dashboard-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <ShieldAlert size={16} color="#dc2626" />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: '#0f172a' }}>Security</h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0 0 1rem 0' }}>Authentication and integrity</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Toggle label="OTP Verification" description="Send one-time password before voting." checked={localSettings.requireOTP} onChange={() => toggleSetting('requireOTP')} />
              <Toggle label="Single Device Lock" description="Prevent multi-device voting sessions." checked={localSettings.singleDevice} onChange={() => toggleSetting('singleDevice')} />
            </div>
          </div>

          {/* Privacy */}
          <div className="dashboard-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <EyeOff size={16} color="#7c3aed" />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: '#0f172a' }}>Privacy</h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0 0 1rem 0' }}>Anonymity and voter proof</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Toggle label="Strict Anonymity" description="Admin cannot view individual choices." checked={localSettings.strictAnonymity} onChange={() => toggleSetting('strictAnonymity')} />
              <Toggle label="Crypto Receipts" description="Voters can verify their vote post-election." checked={localSettings.voterReceipts} onChange={() => toggleSetting('voterReceipts')} />
            </div>
          </div>

          {/* Branding */}
          <div className="dashboard-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Palette size={16} color="#0891b2" />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: '#0f172a' }}>Branding</h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0 0 1rem 0' }}>Customize the portal appearance</p>
            
            <div className="form-group">
              <label style={{ fontSize: '0.75rem' }}>Brand Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="color" value={localSettings.brandColor} onChange={e => setLocalSettings({...localSettings, brandColor: e.target.value})} style={{ width: '36px', height: '28px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: "'SF Mono', monospace" }}>{localSettings.brandColor}</span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.75rem' }}>Organization Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fafbfc', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#fff', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {localSettings.schoolLogo ? (
                    <img src={localSettings.schoolLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <ImageIcon size={16} style={{ color: '#94a3b8', opacity: 0.5 }} />
                  )}
                </div>
                <div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleLogoUpload} style={{ display: 'none' }} />
                  <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} style={{ padding: '5px 12px', fontSize: '0.75rem', fontWeight: 500 }}>Upload</button>
                  <p style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px', margin: '4px 0 0' }}>PNG recommended · Max 2MB</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
