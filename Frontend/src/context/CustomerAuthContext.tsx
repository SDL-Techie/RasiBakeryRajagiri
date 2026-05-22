// // import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// // import { onAuthStateChanged, signOut } from 'firebase/auth';
// // import { auth } from '../firebase/firebaseConfig';

// // interface Customer {
// //   id: string;
// //   name: string;
// //   mobile: string;
// //   email?: string;
// //   address: string;
// //   landmark: string;
  
// // }

// // interface CustomerAuthContextType {
// //   customer: Customer | null;
// //   isLoggedIn: boolean;
// //   login: (customerData: Customer) => void;
// //   logout: () => Promise<void>;
// //   updateCustomer: (updates: Partial<Customer>) => void;
// // }

// // const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

// // export const useCustomerAuth = () => {
// //   const context = useContext(CustomerAuthContext);
// //   if (!context) {
// //     throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
// //   }
// //   return context;
// // };

// // interface CustomerAuthProviderProps {
// //   children: ReactNode;
// // }

// // export const CustomerAuthProvider: React.FC<CustomerAuthProviderProps> = ({ children }) => {
// //   const [customer, setCustomer] = useState<Customer | null>(null);
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);

// //   useEffect(() => {
// //     // Check localStorage on mount
// //     const customerId = localStorage.getItem('customerId');
// //     const customerName = localStorage.getItem('customerName');
// //     const customerMobile = localStorage.getItem('customerMobile');
// //     const isCustomerLoggedIn = localStorage.getItem('isCustomerLoggedIn');

// //     if (customerId && customerName && customerMobile && isCustomerLoggedIn === 'true') {
// //       // Load customer data from localStorage (basic info)
// //       // In a real app, you'd fetch full customer data from Firestore
// //       setCustomer({
// //         id: customerId,
// //         name: customerName,
// //         mobile: customerMobile,
// //         address: '', // Would need to fetch from Firestore
// //         landmark: '' // Would need to fetch from Firestore
// //       });
// //       setIsLoggedIn(true);
// //     }

// //     // Listen to Firebase auth state changes
// //     const unsubscribe = onAuthStateChanged(auth, (user) => {
// //       if (!user) {
// //         // User signed out
// //         setCustomer(null);
// //         setIsLoggedIn(false);
// //         localStorage.removeItem('customerId');
// //         localStorage.removeItem('customerName');
// //         localStorage.removeItem('customerMobile');
// //         localStorage.removeItem('isCustomerLoggedIn');
// //       }
// //     });

// //     return () => unsubscribe();
// //   }, []);

// //   const login = (customerData: Customer) => {
// //     setCustomer(customerData);
// //     setIsLoggedIn(true);
// //     localStorage.setItem('customerId', customerData.id);
// //     localStorage.setItem('customerName', customerData.name);
// //     localStorage.setItem('customerMobile', customerData.mobile);
// //     localStorage.setItem('isCustomerLoggedIn', 'true');
// //   };

// //   const logout = async () => {
// //     try {
// //       await signOut(auth);
// //       setCustomer(null);
// //       setIsLoggedIn(false);
// //     } catch (error) {
// //       console.error('Logout error:', error);
// //     }
// //   };

// //   const updateCustomer = (updates: Partial<Customer>) => {
// //     if (customer) {
// //       const updatedCustomer = { ...customer, ...updates };
// //       setCustomer(updatedCustomer);
// //       // Update localStorage if needed
// //       if (updates.name) localStorage.setItem('customerName', updates.name);
// //     }
// //   };

// //   const value: CustomerAuthContextType = {
// //     customer,
// //     isLoggedIn,
// //     login,
// //     logout,
// //     updateCustomer
// //   };

// //   return (
// //     <CustomerAuthContext.Provider value={value}>
// //       {children}
// //     </CustomerAuthContext.Provider>
// //   );
// // };



// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { auth } from '../firebase/firebaseConfig';

// // ✅ Updated Customer interface
// interface Customer {
//   id: string;
//   name: string;
//   mobile: string;
//   role?: string; // ✅ IMPORTANT (customer / retailer)
//   email?: string;
//   address: string;
//   landmark: string;
// }

// // ✅ Context type
// interface CustomerAuthContextType {
//   customer: Customer | null;
//   isLoggedIn: boolean;
//   authLoading: boolean;
//   login: (customerData: Customer) => void;
//   logout: () => Promise<void>;
//   updateCustomer: (updates: Partial<Customer>) => void;
// }

// // ✅ Create context
// const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

// // ✅ Custom hook
// export const useCustomerAuth = () => {
//   const context = useContext(CustomerAuthContext);
//   if (!context) {
//     throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
//   }
//   return context;
// };

// interface CustomerAuthProviderProps {
//   children: ReactNode;
// }

// export const CustomerAuthProvider: React.FC<CustomerAuthProviderProps> = ({ children }) => {
//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [authLoading, setAuthLoading] = useState(true);

//   useEffect(() => {
//     // 🔹 Load from localStorage
//     const customerId = localStorage.getItem('customerId');
//     const customerName = localStorage.getItem('customerName');
//     const customerMobile = localStorage.getItem('customerMobile');
//     const customerRole = localStorage.getItem('customerRole');
//     const isCustomerLoggedIn = localStorage.getItem('isCustomerLoggedIn');

//     if (
//       customerId &&
//       customerName &&
//       customerMobile &&
//       isCustomerLoggedIn === 'true'
//     ) {
//       setCustomer({
//         id: customerId,
//         name: customerName,
//         mobile: customerMobile,
//         role: customerRole || 'customer', // ✅ default
//         address: '',
//         landmark: ''
//       });

//       setIsLoggedIn(true);
//     }

//     // 🔹 Firebase auth listener
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (!user) {
//         setCustomer(null);
//         setIsLoggedIn(false);

//         localStorage.removeItem('customerId');
//         localStorage.removeItem('customerName');
//         localStorage.removeItem('customerMobile');
//         localStorage.removeItem('customerRole'); // ✅ remove role
//         localStorage.removeItem('isCustomerLoggedIn');
//       }
//       setAuthLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // ✅ LOGIN
//   const login = (customerData: Customer) => {
//     setCustomer(customerData);
//     setIsLoggedIn(true);

//     localStorage.setItem('customerId', customerData.id);
//     localStorage.setItem('customerName', customerData.name);
//     localStorage.setItem('customerMobile', customerData.mobile);
//     localStorage.setItem('customerRole', customerData.role || 'customer'); // ✅ SAVE ROLE
//     localStorage.setItem('isCustomerLoggedIn', 'true');
//   };

//   // ✅ LOGOUT
//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setCustomer(null);
//       setIsLoggedIn(false);

//       localStorage.clear(); // 🔥 simple reset
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // ✅ UPDATE CUSTOMER
//   const updateCustomer = (updates: Partial<Customer>) => {
//     if (customer) {
//       const updatedCustomer = { ...customer, ...updates };
//       setCustomer(updatedCustomer);

//       // 🔹 Sync localStorage
//       if (updates.name) localStorage.setItem('customerName', updates.name);
//       if (updates.mobile) localStorage.setItem('customerMobile', updates.mobile);
//       if (updates.role) localStorage.setItem('customerRole', updates.role);
//     }
//   };

//   const value: CustomerAuthContextType = {
//     customer,
//     isLoggedIn,
//     authLoading,
//     login,
//     logout,
//     updateCustomer
//   };

//   return (
//     <CustomerAuthContext.Provider value={value}>
//       {children}
//     </CustomerAuthContext.Provider>
//   );
// };


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ✅ Updated Customer interface
interface Customer {
  id: string;
  name: string;
  mobile: string;
  role?: string; 
  email?: string;
  address?: string;
  landmark?: string;
}

interface CustomerAuthContextType {
  customer: Customer | null;
  isLoggedIn: boolean;
  authLoading: boolean;
  login: (customerData: Customer, token: string) => void;
  logout: () => void;
  updateCustomer: (updates: Partial<Customer>) => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

export const CustomerAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ✅ FIX: Initialize state SYNCHRONOUSLY from localStorage
  // This prevents the "flash" of logged-out state on refresh
  const [customer, setCustomer] = useState<Customer | null>(() => {
    const id = localStorage.getItem('customerId');
    const name = localStorage.getItem('customerName');
    const mobile = localStorage.getItem('customerMobile');
    const role = localStorage.getItem('customerRole');

    if (id && name && mobile) {
      return { id, name, mobile, role: role || 'customer', address: '', landmark: '' };
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isCustomerLoggedIn') === 'true';
  });

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Since we are no longer using Firebase, we just confirm initialization is done
    setAuthLoading(false);
  }, []);

  // ✅ LOGIN (Used with your Node.js backend)
  const login = (customerData: Customer, token: string) => {
    setCustomer(customerData);
    setIsLoggedIn(true);

    localStorage.setItem('customerToken', token); // Store your JWT token from Node
    localStorage.setItem('customerId', customerData.id);
    localStorage.setItem('customerName', customerData.name);
    localStorage.setItem('customerMobile', customerData.mobile);
    localStorage.setItem('customerRole', customerData.role || 'customer');
    localStorage.setItem('isCustomerLoggedIn', 'true');
  };

  // ✅ LOGOUT
  const logout = () => {
    setCustomer(null);
    setIsLoggedIn(false);
    localStorage.clear(); 
  };

  // ✅ UPDATE CUSTOMER
  const updateCustomer = (updates: Partial<Customer>) => {
    setCustomer((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      
      // Sync localStorage so refresh keeps the new data
      if (updates.name) localStorage.setItem('customerName', updates.name);
      if (updates.mobile) localStorage.setItem('customerMobile', updates.mobile);
      if (updates.role) localStorage.setItem('customerRole', updates.role);
      
      return updated;
    });
  };

  const value = {
    customer,
    isLoggedIn,
    authLoading,
    login,
    logout,
    updateCustomer
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {!authLoading && children}
    </CustomerAuthContext.Provider>
  );
};