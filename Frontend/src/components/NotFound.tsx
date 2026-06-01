import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [isHomeHovered, setIsHomeHovered] = useState(false);
  const [isBackHovered, setIsBackHovered] = useState(false);

  // --- Inline CSS Styles Object ---
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '75vh',
      padding: '20px',
      backgroundColor: 'transparent',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    } as React.CSSProperties,

    card: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      textAlign: 'center' as const,
      maxWidth: '440px',
      width: '100%',
    },

    iconBox: {
      backgroundColor: '#fffbeb', // Light Amber tint
      color: '#f59e0b',            // Warm Amber warning color
      padding: '20px',
      borderRadius: '50%',
      marginBottom: '24px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Inline bounce approximation via CSS transition can be handled,
      // but for standard rendering, standard layout properties work perfectly
    } as React.CSSProperties,

    title: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#111827',
      margin: '0 0 10px 0',
      letterSpacing: '-0.025em',
    },

    message: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
      color: '#6b7280',
      margin: '0 0 32px 0',
    },

    actions: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
    },

    btnHome: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: isHomeHovered ? '#d97706' : '#8b4513', 
      color: '#ffffff',
      fontSize: '0.95rem',
      fontWeight: 500,
      padding: '12px 24px',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transform: isHomeHovered ? 'translateY(-1px)' : 'translateY(0)',
      transition: 'all 0.2s ease',
      boxShadow: isHomeHovered 
        ? '0 6px 8px -1px rgba(217, 119, 6, 0.3)' 
        : '0 4px 6px -1px rgba(245, 158, 11, 0.2)',
    } as React.CSSProperties,

    btnBack: {
      background: 'none',
      border: 'none',
      color: isBackHovered ? '#111827' : '#4b5563', // Hover dynamic swap
      fontSize: '0.9rem',
      fontWeight: 500,
      cursor: 'pointer',
      padding: '8px 12px',
      transition: 'color 0.15s ease',
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Warning Icon Box */}
        <div style={styles.iconBox}>
          <AlertTriangle size={44} />
        </div>

        {/* Text Area */}
        <h1 style={styles.title}>Oops! Page Not Found</h1>
        <p style={styles.message}>
          It looks like you've taken a wrong turn or entered a route that doesn't exist. 
          Let's get you back to enjoying something delicious!
        </p>

        {/* Action Button Navigation */}
        <div style={styles.actions}>
          <button 
            onClick={() => navigate('/')} 
            style={styles.btnHome}
            onMouseEnter={() => setIsHomeHovered(true)}
            onMouseLeave={() => setIsHomeHovered(false)}
          >
            <Home size={18} />
            Go to Home Page
          </button>
          
          <button 
            onClick={() => navigate(-1)} 
            style={styles.btnBack}
            onMouseEnter={() => setIsBackHovered(true)}
            onMouseLeave={() => setIsBackHovered(false)}
          >
            &larr; Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;