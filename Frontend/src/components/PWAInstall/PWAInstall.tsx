// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // // import { Download, X } from 'lucide-react';
// // // // // import './PWAInstall.css';

// // // // // const PWAInstall: React.FC = () => {
// // // // //   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
// // // // //   const [showPopup, setShowPopup] = useState(false);

// // // // //   useEffect(() => {
// // // // //     const handler = (e: any) => {
// // // // //       e.preventDefault();
// // // // //       setDeferredPrompt(e);
// // // // //       setShowPopup(true);
// // // // //     };

// // // // //     window.addEventListener('beforeinstallprompt', handler);

// // // // //     return () => {
// // // // //       window.removeEventListener('beforeinstallprompt', handler);
// // // // //     };
// // // // //   }, []);

// // // // //   const handleInstall = async () => {
// // // // //     if (!deferredPrompt) return;
// // // // //     deferredPrompt.prompt();
// // // // //     const { outcome } = await deferredPrompt.userChoice;
// // // // //     if (outcome === 'accepted') {
// // // // //       console.log('User accepted the install prompt');
// // // // //     }
// // // // //     setDeferredPrompt(null);
// // // // //     setShowPopup(false);
// // // // //   };

// // // // //   return (
// // // // //     <AnimatePresence>
// // // // //       {showPopup && (
// // // // //         <motion.div 
// // // // //           className="rasi-pwa-overlay"
// // // // //           initial={{ opacity: 0 }}
// // // // //           animate={{ opacity: 1 }}
// // // // //           exit={{ opacity: 0 }}
// // // // //         >
// // // // //           <motion.div 
// // // // //             className="rasi-pwa-modal"
// // // // //             initial={{ y: 100, opacity: 0 }}
// // // // //             animate={{ y: 0, opacity: 1 }}
// // // // //             exit={{ y: 100, opacity: 0 }}
// // // // //           >
// // // // //             <button className="rasi-pwa-close" onClick={() => setShowPopup(false)}>
// // // // //               <X size={20} />
// // // // //             </button>
// // // // //             <div className="rasi-pwa-icon">🥐</div>
// // // // //             <h3>Install Rasi Bakery App</h3>
// // // // //             <p>Install the app for faster access and special offers directly from your home screen.</p>
// // // // //             <div className="rasi-pwa-actions">
// // // // //               <button className="rasi-pwa-install-btn" onClick={handleInstall}>
// // // // //                 <Download size={18} /> Install App
// // // // //               </button>
// // // // //               <button className="rasi-pwa-dismiss-btn" onClick={() => setShowPopup(false)}>
// // // // //                 Dismiss
// // // // //               </button>
// // // // //             </div>
// // // // //           </motion.div>
// // // // //         </motion.div>
// // // // //       )}
// // // // //     </AnimatePresence>
// // // // //   );
// // // // // };

// // // // // export default PWAInstall;



// // // // import React, { useState, useEffect } from 'react';
// // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // import { Download, X } from 'lucide-react';
// // // // import './PWAInstall.css';

// // // // const PWAInstall: React.FC = () => {
// // // //   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
// // // //   const [showPopup, setShowPopup] = useState(false);

// // // //   useEffect(() => {
// // // //     const handler = (e: any) => {
// // // //       e.preventDefault();
// // // //       setDeferredPrompt(e);
// // // //       setShowPopup(true);
// // // //     };

// // // //     // Listen for the browser's native install capability
// // // //     window.addEventListener('beforeinstallprompt', handler);

// // // //     // NEW: Listen for manual clicks from the Navbar or other buttons
// // // //     const manualTriggerHandler = async () => {
// // // //       if (deferredPrompt) {
// // // //         deferredPrompt.prompt();
// // // //         const { outcome } = await deferredPrompt.userChoice;
// // // //         if (outcome === 'accepted') {
// // // //           console.log('User accepted the install prompt');
// // // //         }
// // // //         setDeferredPrompt(null);
// // // //         setShowPopup(false);
// // // //       } else {
// // // //         // If the browser already installed it or doesn't support it
// // // //         alert('PWA installation is not supported on this browser, or it is already installed!');
// // // //       }
// // // //     };

// // // //     window.addEventListener('triggerPwaInstall', manualTriggerHandler);

// // // //     return () => {
// // // //       window.removeEventListener('beforeinstallprompt', handler);
// // // //       window.removeEventListener('triggerPwaInstall', manualTriggerHandler);
// // // //     };
// // // //   }, [deferredPrompt]); // re-run effect when deferredPrompt updates

// // // //   const handleInstall = async () => {
// // // //     if (!deferredPrompt) return;
// // // //     deferredPrompt.prompt();
// // // //     const { outcome } = await deferredPrompt.userChoice;
// // // //     if (outcome === 'accepted') {
// // // //       console.log('User accepted the install prompt');
// // // //     }
// // // //     setDeferredPrompt(null);
// // // //     setShowPopup(false);
// // // //   };

// // // //   return (
// // // //     <AnimatePresence>
// // // //       {showPopup && (
// // // //         <motion.div 
// // // //           className="rasi-pwa-overlay"
// // // //           initial={{ opacity: 0 }}
// // // //           animate={{ opacity: 1 }}
// // // //           exit={{ opacity: 0 }}
// // // //         >
// // // //           <motion.div 
// // // //             className="rasi-pwa-modal"
// // // //             initial={{ y: 100, opacity: 0 }}
// // // //             animate={{ y: 0, opacity: 1 }}
// // // //             exit={{ y: 100, opacity: 0 }}
// // // //           >
// // // //             <button className="rasi-pwa-close" onClick={() => setShowPopup(false)}>
// // // //               <X size={20} />
// // // //             </button>
// // // //             <div className="rasi-pwa-icon">🥐</div>
// // // //             <h3>Install Rasi Bakery App</h3>
// // // //             <p>Install the app for faster access and special offers directly from your home screen.</p>
// // // //             <div className="rasi-pwa-actions">
// // // //               <button className="rasi-pwa-install-btn" onClick={handleInstall}>
// // // //                 <Download size={18} /> Install App
// // // //               </button>
// // // //               <button className="rasi-pwa-dismiss-btn" onClick={() => setShowPopup(false)}>
// // // //                 Dismiss
// // // //               </button>
// // // //             </div>
// // // //           </motion.div>
// // // //         </motion.div>
// // // //       )}
// // // //     </AnimatePresence>
// // // //   );
// // // // };

// // // // export default PWAInstall;


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

//     // Explicitly open the custom UI modal on manual clicks
//     const manualTriggerHandler = () => {
//       setShowPopup(true);
//     };

//     window.addEventListener('triggerPwaInstall', manualTriggerHandler);

//     return () => {
//       window.removeEventListener('beforeinstallprompt', handler);
//       window.removeEventListener('triggerPwaInstall', manualTriggerHandler);
//     };
//   }, []);

//   const handleInstall = async () => {
//     if (!deferredPrompt) {
//       // Fallback message if native prompt is unavailable (iOS Safari, already installed, etc.)
//       alert('To install, open your browser settings menu and choose "Add to Home Screen".');
//       setShowPopup(false);
//       return;
//     }
    
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


// // import React, { useState, useEffect } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { Download, X } from 'lucide-react';
// // import './PWAInstall.css';

// // const PWAInstall: React.FC = () => {
// //   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
// //   const [showPopup, setShowPopup] = useState(false);

// //   useEffect(() => {
// //     // 1. Check if the app is currently running as an installed PWA standalone window
// //     const isRunningStandalone = 
// //       window.matchMedia('(display-mode: standalone)').matches || 
// //       (navigator as any).standalone || 
// //       document.referrer.includes('android-app://');

// //     // 2. Check if the user has already installed it in a previous session via localStorage
// //     const isAlreadyInstalled = localStorage.getItem('rasi_pwa_installed') === 'true';

// //     // If either condition is met, stop execution immediately and do not listen for prompts
// //     if (isRunningStandalone || isAlreadyInstalled) {
// //       return;
// //     }

// //     const handler = (e: any) => {
// //       e.preventDefault();
// //       setDeferredPrompt(e);
// //       setShowPopup(true);
// //     };

// //     // Listen for the browser's native install capability
// //     window.addEventListener('beforeinstallprompt', handler);

// //     // Explicitly open the custom UI modal on manual clicks (e.g., from Navbar)
// //     const manualTriggerHandler = () => {
// //       setShowPopup(true);
// //     };

// //     window.addEventListener('triggerPwaInstall', manualTriggerHandler);

// //     // Listen for the native browser success event to flag it in localStorage
// //     const handleAppInstalledSuccess = () => {
// //       console.log('Rasi Bakery App installed successfully via browser tracking.');
// //       localStorage.setItem('rasi_pwa_installed', 'true');
// //       setShowPopup(false);
// //     };
// //     window.addEventListener('appinstalled', handleAppInstalledSuccess);

// //     return () => {
// //       window.removeEventListener('beforeinstallprompt', handler);
// //       window.removeEventListener('triggerPwaInstall', manualTriggerHandler);
// //       window.removeEventListener('appinstalled', handleAppInstalledSuccess);
// //     };
// //   }, []);

// //   const handleInstall = async () => {
// //     if (!deferredPrompt) {
// //       // Fallback message if native prompt is unavailable (iOS Safari, already installed, etc.)
// //       alert('To install, open your browser settings menu and choose "Add to Home Screen".');
// //       setShowPopup(false);
// //       return;
// //     }
    
// //     deferredPrompt.prompt();
// //     const { outcome } = await deferredPrompt.userChoice;
    
// //     if (outcome === 'accepted') {
// //       console.log('User accepted the install prompt');
// //       // Set key to remember selection across refreshes
// //       localStorage.setItem('rasi_pwa_installed', 'true');
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

// // import React, { useState, useEffect } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { Download, X } from 'lucide-react';
// // import axios from 'axios';
// // import './PWAInstall.css';

// // const PWAInstall: React.FC = () => {
// //   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
// //   const [showPopup, setShowPopup] = useState(false);

// //  // const API_URL = "http://localhost:4000/api/v1";

// //  useEffect(() => {
// //     const user = JSON.parse(
// //     localStorage.getItem('user') || '{}'
// //   );
// //   console.log("User:", user);
// //   console.log("pwaInstalled:", user?.pwaInstalled);

// //   const beforeInstallHandler = (e: any) => {
// //     console.log("beforeinstallprompt fired");
// //     e.preventDefault();
// //     setDeferredPrompt(e);
// //     setShowPopup(true);
// //   };

// //   console.log(
// //   "Standalone:",
// //   window.matchMedia('(display-mode: standalone)').matches
// // );

// //   window.addEventListener(
// //     "beforeinstallprompt",
// //     beforeInstallHandler
// //   );

// //   return () => {
// //     window.removeEventListener(
// //       "beforeinstallprompt",
// //       beforeInstallHandler
// //     );
// //   };
// // }, []);

// //   useEffect(() => {
// //     const user = JSON.parse(localStorage.getItem('user') || '{}');

// //     const isRunningStandalone =
// //       window.matchMedia('(display-mode: standalone)').matches ||
// //       (navigator as any).standalone ||
// //       document.referrer.includes('android-app://');

// //     if (isRunningStandalone) {
// //       localStorage.setItem('rasi_pwa_installed', 'true');
// //       return;
// //     }

// //     const isAlreadyInstalled =
// //       user?.pwaInstalled === true ||
// //       localStorage.getItem('rasi_pwa_installed') === 'true';

// //     if (isAlreadyInstalled) {
// //       return;
// //     }

// //     const beforeInstallHandler = (e: any) => {
// //       console.log('beforeinstallprompt fired');

// //       e.preventDefault();

// //       setDeferredPrompt(e);
// //       setShowPopup(true);
// //     };

// //     // const handleAppInstalledSuccess = async () => {
// //     //   try {
// //     //     console.log('PWA Installed');

// //     //     localStorage.setItem(
// //     //       'rasi_pwa_installed',
// //     //       'true'
// //     //     );

// //     //     if (user?._id) {
// //     //       await axios.put(
// //     //         `${API_URL}/pwa-installed/${user._id}`
// //     //       );

// //     //       const updatedUser = {
// //     //         ...user,
// //     //         pwaInstalled: true
// //     //       };

// //     //       localStorage.setItem(
// //     //         'user',
// //     //         JSON.stringify(updatedUser)
// //     //       );
// //     //     }

// //     //     setShowPopup(false);
// //     //   } catch (error) {
// //     //     console.error(
// //     //       'PWA Update Error:',
// //     //       error
// //     //     );
// //     //   }
// //     // };

// //     const handleAppInstalledSuccess = async () => {
// //   try {
// //     localStorage.setItem(
// //       'rasi_pwa_installed',
// //       'true'
// //     );

// //     if (user?._id) {

// //       const response = await axios.put(
// //         `http://localhost:4000/api/v1/pwa-installed/${user._id}`
// //       );

// //       const updatedUser = {
// //         ...user,
// //         pwaInstalled: true
// //       };

// //       localStorage.setItem(
// //         'user',
// //         JSON.stringify(updatedUser)
// //       );

// //       console.log(response.data);
// //     }

// //     setShowPopup(false);

// //   } catch (error) {
// //     console.error(error);
// //   }
// // };
// //     const manualTriggerHandler = () => {
// //       setShowPopup(true);
// //     };

// //     window.addEventListener(
// //       'beforeinstallprompt',
// //       beforeInstallHandler
// //     );

// //     window.addEventListener(
// //       'appinstalled',
// //       handleAppInstalledSuccess
// //     );

// //     window.addEventListener(
// //       'triggerPwaInstall',
// //       manualTriggerHandler
// //     );

// //     return () => {
// //       window.removeEventListener(
// //         'beforeinstallprompt',
// //         beforeInstallHandler
// //       );

// //       window.removeEventListener(
// //         'appinstalled',
// //         handleAppInstalledSuccess
// //       );

// //       window.removeEventListener(
// //         'triggerPwaInstall',
// //         manualTriggerHandler
// //       );
// //     };
// //   }, []);

// //   const handleInstall = async () => {
// //     if (!deferredPrompt) {
// //       alert(
// //         'To install, open browser menu and choose "Add to Home Screen".'
// //       );
// //       return;
// //     }

// //     deferredPrompt.prompt();

// //     const { outcome } =
// //       await deferredPrompt.userChoice;

// //     console.log('Install outcome:', outcome);

// //     if (outcome === 'accepted') {
// //       console.log('Install accepted');
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
// //             <button
// //               className="rasi-pwa-close"
// //               onClick={() =>
// //                 setShowPopup(false)
// //               }
// //             >
// //               <X size={20} />
// //             </button>

// //             <div className="rasi-pwa-icon">
// //               🥐
// //             </div>

// //             <h3>
// //               Install Rasi Bakery App
// //             </h3>

// //             <p>
// //               Install the app for faster
// //               access and special offers
// //               directly from your home
// //               screen.
// //             </p>

// //             <div className="rasi-pwa-actions">
// //               <button
// //                 className="rasi-pwa-install-btn"
// //                 onClick={handleInstall}
// //               >
// //                 <Download size={18} />
// //                 Install App
// //               </button>

// //               <button
// //                 className="rasi-pwa-dismiss-btn"
// //                 onClick={() =>
// //                   setShowPopup(false)
// //                 }
// //               >
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


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import './PWAInstall.css';

const PWAInstall: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Only save the deferredPrompt, don't show the popup automatically
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Don't show popup here - only save the prompt for later use
    };

    // Listen for the browser's native install capability (just to save the prompt)
    window.addEventListener('beforeinstallprompt', handler);

    // Only show popup when manually triggered (navbar button or after login)
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