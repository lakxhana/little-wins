import React from 'react';

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉 Little Wins</h1>
      <p style={{ fontSize: '1.5rem', textAlign: 'center' }}>
        Docker is working! Your React app is running successfully.
      </p>
      <div style={{
        marginTop: '2rem',
        padding: '1rem 2rem',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)'
      }}>
        <p>✅ React is set up</p>
        <p>✅ Docker is configured</p>
        <p>✅ Everything is working!</p>
      </div>
    </div>
  );
}

export default App;

