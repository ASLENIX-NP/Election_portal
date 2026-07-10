import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { Power, Settings as SettingsIcon, ShieldAlert, Clock, EyeOff, Palette, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useElection } from '@/context/ElectionContext';

export default function AdminSettings() {
  const { 
    electionTitle, academicYear, status, updateElectionConfig, setStatus,
    advancedSettings, updateAdvancedSettings
  } = useElection();
  
  const [titleInput, setTitleInput] = useState(electionTitle);
  const [yearInput, setYearInput] = useState(academicYear);
  const [localSettings, setLocalSettings] = useState(advancedSettings);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTitleInput(electionTitle);
    setYearInput(academicYear);
    setLocalSettings(advancedSettings);
  }, [electionTitle, academicYear, advancedSettings]);

  const handleSaveConfig = () => {
    updateElectionConfig(titleInput, yearInput);
    updateAdvancedSettings(localSettings);
    // Note: In a real app, this might trigger a toast notification.
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

  const CustomToggle = ({ label, description, checked, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <div style={{ paddingRight: '1rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{label}</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{description}</p>
      </div>
      <div 
        onClick={onChange}
        style={{
          width: '46px', height: '24px', borderRadius: '12px', background: checked ? 'var(--success)' : 'var(--border-color)',
          position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease', flexShrink: 0
        }}
      >
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px',
          left: checked ? '24px' : '2px', transition: 'left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }} />
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header authentic-header">
        <div>
          <div className="header-title-row">
            <h1>Platform Settings</h1>
          </div>
          <p className="header-subtitle">Configure election rules, security protocols, and branding.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSaveConfig} style={{ background: 'var(--text-primary)', color: 'var(--bg-color)', padding: '0.75rem 1.5rem' }}>
          <CheckCircle2 size={18} />
          Save All Changes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <Card className="authentic-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)' }}>
                <SettingsIcon size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>General Configuration</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Core election details</p>
              </div>
            </div>

            <div className="form-group mb-4">
              <label>Election Title</label>
              <input type="text" className="form-control" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Academic Year</label>
              <input type="text" className="form-control" value={yearInput} onChange={(e) => setYearInput(e.target.value)} />
            </div>
          </Card>

          <Card className="authentic-card" style={{ padding: '1.5rem', border: status === 'Active' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="stat-icon-wrapper" style={{ background: status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: status === 'Active' ? 'var(--success)' : 'var(--danger)' }}>
                <Power size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Live Status Control</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Currently: <strong style={{ color: status === 'Active' ? 'var(--success)' : 'var(--danger)' }}>{status}</strong></p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              {status === 'Active' ? (
                <>
                  <button className="btn" style={{ flex: 1, justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }} onClick={() => setStatus('Ended')}>End Election</button>
                  <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStatus('Paused')}>Pause Voting</button>
                </>
              ) : (
                <button className="btn" style={{ flex: 1, justifyContent: 'center', background: 'var(--success)', color: 'white', border: 'none' }} onClick={() => setStatus('Active')}>Resume / Start Election</button>
              )}
            </div>
          </Card>

          <Card className="authentic-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                <Clock size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Scheduled Voting</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Automate start and stop times</p>
              </div>
            </div>
            <CustomToggle label="Enable Scheduling" description="System will strictly enforce voting within the window below." checked={localSettings.scheduledVoting} onChange={() => toggleSetting('scheduledVoting')} />
            
            {localSettings.scheduledVoting && (
              <div className="mt-4" style={{ display: 'flex', gap: '1rem', animation: 'fadeIn 0.3s ease' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Start Time</label>
                  <input type="datetime-local" className="form-control" value={localSettings.startTime} onChange={e => setLocalSettings({...localSettings, startTime: e.target.value})} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>End Time</label>
                  <input type="datetime-local" className="form-control" value={localSettings.endTime} onChange={e => setLocalSettings({...localSettings, endTime: e.target.value})} />
                </div>
              </div>
            )}
          </Card>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <Card className="authentic-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="stat-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
                <ShieldAlert size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Security & Authentication</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Protect election integrity</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <CustomToggle label="Require OTP Verification" description="Send a One-Time Password to student emails before allowing them to vote." checked={localSettings.requireOTP} onChange={() => toggleSetting('requireOTP')} />
              <CustomToggle label="Single Device Enforcement" description="Prevent users from starting multiple voting sessions across different devices." checked={localSettings.singleDevice} onChange={() => toggleSetting('singleDevice')} />
            </div>
          </Card>

          <Card className="authentic-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                <EyeOff size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Voter Anonymity & Proof</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Manage privacy guarantees</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <CustomToggle label="Strict Anonymity" description="Admins cannot see individual voting choices, only participation status." checked={localSettings.strictAnonymity} onChange={() => toggleSetting('strictAnonymity')} />
              <CustomToggle label="Cryptographic Receipts" description="Allow voters to download a hash receipt to verify their vote post-election." checked={localSettings.voterReceipts} onChange={() => toggleSetting('voterReceipts')} />
            </div>
          </Card>

          <Card className="authentic-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                <Palette size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Branding & Portal</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Customize the voter experience</p>
              </div>
            </div>
            
            <div className="form-group mb-4">
              <label>Primary Brand Color</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="color" value={localSettings.brandColor} onChange={e => setLocalSettings({...localSettings, brandColor: e.target.value})} style={{ width: '50px', height: '40px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{localSettings.brandColor}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Organization Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--surface-hover)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'var(--bg-color)', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {localSettings.schoolLogo ? (
                    <img src={localSettings.schoolLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <ImageIcon size={20} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                  )}
                </div>
                <div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleLogoUpload} style={{ display: 'none' }} />
                  <button type="button" className="btn btn-secondary text-sm" onClick={() => fileInputRef.current?.click()}>Upload Logo</button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Transparent PNG recommended. Max 2MB.</p>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
