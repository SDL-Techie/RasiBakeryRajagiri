// // import React, { useState, useEffect } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { Download, X } from 'lucide-react';
// // import './PWAInstall.css';

// // const PWAInstall: React.FC = () => {
// //   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
// //   const [showPopup, setShowPopup] = useState(false);

// //   useEffect(() => {
// //     const handler = (e: any) => {
// //       e.preventDefault();
// //       setDeferredPrompt(e);
// //       setShowPopup(true);
// //     };

// //     window.addEventListener('beforeinstallprompt', handler);

// //     return () => {
// //       window.removeEventListener('beforeinstallprompt', handler);
// //     };
// //   }, []);

// //   const handleInstall = async () => {
// //     if (!deferredPrompt) return;
// //     deferredPrompt.prompt();
// //     const { outcome } = await deferredPrompt.userChoice;
// //     if (outcome === 'accepted') {
// //       console.log('User accepted the install prompt');
// //     }
// //     setDeferredPrompt(null);
// //     setShowPopup(false);
// //   };

// //   return (
// //     <AnimatePresence>
// //       {showPopup && (
// //         <motion.div 
// //           className="rasi-pwa-overlay"
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           exit={{ opacity: 0 }}
// //         >
// //           <motion.div 
// //             className="rasi-pwa-modal"
// //             initial={{ y: 100, opacity: 0 }}
// //             animate={{ y: 0, opacity: 1 }}
// //             exit={{ y: 100, opacity: 0 }}
// //           >
// //             <button className="rasi-pwa-close" onClick={() => setShowPopup(false)}>
// //               <X size={20} />
// //             </button>
// //             <div className="rasi-pwa-icon">🥐</div>
// //             <h3>Install Rasi Bakery App</h3>
// //             <p>Install the app for faster access and special offers directly from your home screen.</p>
// //             <div className="rasi-pwa-actions">
// //               <button className="rasi-pwa-install-btn" onClick={handleInstall}>
// //                 <Download size={18} /> Install App
// //               </button>
// //               <button className="rasi-pwa-dismiss-btn" onClick={() => setShowPopup(false)}>
// //                 Dismiss
// //               </button>
// //             </div>
// //           </motion.div>
// //         </motion.div>
// //       )}
// //     </AnimatePresence>
// //   );
// // };

// // export default PWAInstall;



// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Download, X } from 'lucide-react';
// import './PWAInstall.css';

// const PWAInstall: React.FC = () => {
//   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
//   const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     const handler = (e: any) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setShowPopup(true);
//     };

//     // Listen for the browser's native install capability
//     window.addEventListener('beforeinstallprompt', handler);

//     // NEW: Listen for manual clicks from the Navbar or other buttons
//     const manualTriggerHandler = async () => {
//       if (deferredPrompt) {
//         deferredPrompt.prompt();
//         const { outcome } = await deferredPrompt.userChoice;
//         if (outcome === 'accepted') {
//           console.log('User accepted the install prompt');
//         }
//         setDeferredPrompt(null);
//         setShowPopup(false);
//       } else {
//         // If the browser already installed it or doesn't support it
//         alert('PWA installation is not supported on this browser, or it is already installed!');
//       }
//     };

//     window.addEventListener('triggerPwaInstall', manualTriggerHandler);

//     return () => {
//       window.removeEventListener('beforeinstallprompt', handler);
//       window.removeEventListener('triggerPwaInstall', manualTriggerHandler);
//     };
//   }, [deferredPrompt]); // re-run effect when deferredPrompt updates

//   const handleInstall = async () => {
//     if (!deferredPrompt) return;
//     deferredPrompt.prompt();
//     const { outcome } = await deferredPrompt.userChoice;
//     if (outcome === 'accepted') {
//       console.log('User accepted the install prompt');
//     }
//     setDeferredPrompt(null);
//     setShowPopup(false);
//   };

//   return (
//     <AnimatePresence>
//       {showPopup && (
//         <motion.div 
//           className="rasi-pwa-overlay"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <motion.div 
//             className="rasi-pwa-modal"
//             initial={{ y: 100, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: 100, opacity: 0 }}
//           >
//             <button className="rasi-pwa-close" onClick={() => setShowPopup(false)}>
//               <X size={20} />
//             </button>
//             <div className="rasi-pwa-icon">🥐</div>
//             <h3>Install Rasi Bakery App</h3>
//             <p>Install the app for faster access and special offers directly from your home screen.</p>
//             <div className="rasi-pwa-actions">
//               <button className="rasi-pwa-install-btn" onClick={handleInstall}>
//                 <Download size={18} /> Install App
//               </button>
//               <button className="rasi-pwa-dismiss-btn" onClick={() => setShowPopup(false)}>
//                 Dismiss
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default PWAInstall;


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import './PWAInstall.css';

const PWAInstall: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPopup(true);
    };

    // Listen for the browser's native install capability
    window.addEventListener('beforeinstallprompt', handler);

    // Explicitly open the custom UI modal on manual clicks
    const manualTriggerHandler = () => {
      setShowPopup(true);
    };

    window.addEventListener('triggerPwaInstall', manualTriggerHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('triggerPwaInstall', manualTriggerHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback message if native prompt is unavailable (iOS Safari, already installed, etc.)
      alert('To install, open your browser settings menu and choose "Add to Home Screen".');
      setShowPopup(false);
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowPopup(false);
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div 
          className="rasi-pwa-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="rasi-pwa-modal"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <button className="rasi-pwa-close" onClick={() => setShowPopup(false)}>
              <X size={20} />
            </button>
            <div className="rasi-pwa-icon">🥐</div>
            <h3>Install Rasi Bakery App</h3>
            <p>Install the app for faster access and special offers directly from your home screen.</p>
            <div className="rasi-pwa-actions">
              <button className="rasi-pwa-install-btn" onClick={handleInstall}>
                <Download size={18} /> Install App
              </button>
              <button className="rasi-pwa-dismiss-btn" onClick={() => setShowPopup(false)}>
                Dismiss
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstall;