import { useState } from 'react';
import './App.css';

function App() {
  const [rawText, setRawText] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false); // State for the Copy button

  const handleExtract = async () => {
    setLoading(true);
    setError('');
    setExtractedData(null);
    setCopied(false);

    if (!rawText.trim()) {
      setError('Please enter some raw text to extract data from.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:6969/extract/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw_text: rawText }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract data');
      }

      const data = await response.json();
      setExtractedData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Professional Copy to Clipboard functionality
  const handleCopy = () => {
    if (extractedData) {
      navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  return (
    <div style={{ 
      padding: '2rem 4rem', 
      height: '90vh', 
      boxSizing: 'border-box', 
      display: 'flex', 
      flexDirection: 'column',
      maxWidth: '1200px', // Slightly narrower to make top/bottom look better
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Section */}
      <h1 style={{ color: '#818cf8', margin: '10px 0' }}>Structured Data Extractor</h1>
      <p style={{ color: '#94a3b8', margin: '0 0 25px 0', fontSize: '18px' }}>
        Transform messy, unstructured text into perfect JSON schemas instantly.
      </p>
      
      {/* Main Layout Container: Stacks Top (Input) and Bottom (Output) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1, minHeight: 0 }}>
        
        {/* ==========================================
            TOP SECTION: Text Area + Height-Matching Button 
            ========================================== */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', height: '35%', minHeight: '200px' }}>
          
          {/* Text Input */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <textarea 
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              style={{ 
                flex: 1, 
                width: '100%', 
                padding: '1rem', 
                fontSize: '16px', 
                color: '#f8fafc', // Off-white text
                resize: 'none', 
                overflowY: 'auto',
                boxSizing: 'border-box',
                borderRadius: '8px',
                backgroundColor: '#1e293b', // Slate 800
                border: '1px solid #475569', // Slate 600
                outline: 'none',
                fontFamily: 'inherit'
              }}
              placeholder="Paste messy text here..."
            />
            {error && <p style={{ color: '#ef4444', margin: '10px 0 0 0', fontSize: '14px', fontWeight: '500' }}>Error: {error}</p>}
          </div>

          {/* Narrow, Height-Matching Extract Button */}
          <button 
            onClick={handleExtract} 
            disabled={loading || !rawText}
            style={{ 
              width: '140px', // Fixed narrow width
              height: '100%', // Automatically stretches to match the textarea height
              padding: '12px', 
              fontSize: '18px', 
              fontWeight: 'bold',
              cursor: loading || !rawText ? 'not-allowed' : 'pointer', 
              backgroundColor: loading || !rawText ? '#334155' : '#4f46e5', // Indigo primary
              color: loading || !rawText ? '#94a3b8' : '#ffffff', 
              border: 'none', 
              borderRadius: '8px',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box'
            }}
          >
            {loading ? 'Extracting...' : 'Extract'}
          </button>
        </div>

        {/* ==========================================
            BOTTOM SECTION: JSON Output Box
            ========================================== */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Structured JSON Output</h3>
          
          <div style={{ 
            flex: 1, 
            backgroundColor: '#0f172a', // Slate 900 (very dark)
            color: '#34d399', // Emerald Green for JSON syntax
            padding: '2.5rem 1rem 1rem 1rem', 
            border: '1px solid #334155',
            borderRadius: '8px', 
            overflowY: 'auto',
            overflowX: 'auto',
            position: 'relative', 
            boxSizing: 'border-box',
            boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.1)' // Inner shadow for depth
          }}>
            
            {/* Anchored Copy Button */}
            {extractedData && (
              <button 
                onClick={handleCopy}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '6px 14px',
                  backgroundColor: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            )}

            {extractedData ? (
              <pre style={{ margin: 0, fontSize: '15px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                {JSON.stringify(extractedData, null, 2)}
              </pre>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#475569', fontStyle: 'italic', margin: 0 }}>JSON payload will appear here...</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;