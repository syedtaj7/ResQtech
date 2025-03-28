import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, collection, addDoc, query, orderBy, serverTimestamp, updateDoc, doc, arrayUnion, arrayRemove, onSnapshot, setDoc, getDocs, where, limit, getDoc } from 'firebase/firestore';
import imageCompression from 'browser-image-compression';
import { DISASTER_CATEGORIES } from '../config/disasterCategories';
import { AlertTabs } from '../components/AlertTabs';
import { FilterBar } from '../components/FilterBar';
import { AlertCard } from '../components/AlertCard';

const loadTensorFlow = async () => {
  if (window.tf && window.mobilenet) return;
  
  try {
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
    await new Promise((resolve, reject) => {
      script1.onload = resolve;
      script1.onerror = reject;
      document.head.appendChild(script1);
    });

    const script2 = document.createElement('script');
    script2.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet';
    await new Promise((resolve, reject) => {
      script2.onload = resolve;
      script2.onerror = reject;
      document.head.appendChild(script2);
    });
  } catch (error) {
    console.error('Failed to load TensorFlow:', error);
    throw new Error('Failed to load image processing libraries');
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyCvhf8pCWQySk2HGKPnbMnZ7HQiGuEYkOw",
  authDomain: "resqtech-da121.firebaseapp.com",
  projectId: "resqtech-da121",
  storageBucket: "resqtech-da121.firebasestorage.app",
  messagingSenderId: "35397966843",
  appId: "1:35397966843:web:56c8ccb3994a412971095e",
  measurementId: "G-HN15MLX4HZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Weather API integration can be added here when needed

// Add these utility functions after Firebase initialization
// Removed unused getWeatherData function to resolve the error

// Add this constant at the top of the file after imports
const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

// Add these styles near the top of your file, after imports
const gradientButtonStyle = `
  relative overflow-hidden
  bg-gradient-to-r from-blue-600 to-purple-600 
  hover:from-blue-500 hover:to-purple-500
  text-white font-medium
  rounded-xl
  transition-all duration-300
  transform hover:scale-[1.02]
  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
`;

// Update the alert card styles
const alertCardStyle = `
  bg-gray-800/50 backdrop-blur-sm
  border border-gray-700/50
  rounded-xl p-6
  transform transition-all duration-300
  hover:border-blue-500/30
  hover:bg-gray-800/70
`;

// Modify the main content area styling
const mainContentStyle = `
  flex-grow p-8 
  bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800
`;

// Update form input styles
const inputStyle = `
  w-full px-4 py-3 
  bg-gray-800/50 
  border border-gray-700 
  rounded-xl
  focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 
  transition-all duration-300
  placeholder-gray-500
`;

// Add after imports, before CommunityHelp function
const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="relative max-w-4xl w-full">
        <img 
          src={imageUrl} 
          alt="Enlarged view" 
          className="w-full h-auto rounded-lg"
          onClick={e => e.stopPropagation()} 
        />
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/75 transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

function CommunityHelp() {
  // Add effect to load TensorFlow
  useEffect(() => {
    loadTensorFlow().catch(console.error);
  }, []);

  // Add missing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [upvotingId, setUpvotingId] = useState(null);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIncident, setSelectedIncident] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [activeTab, setActiveTab] = useState('recent');
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'latest',
    severity: 'all'
  });
  const [tabsData, setTabsData] = useState({
    'recent': [],
    'my-posts': [],
    'saved': []
  });
  const [isTabLoading, setIsTabLoading] = useState(false);

  // Update handleGoogleSignIn function
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setAuthError('');
      
      // Configure Google provider
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, googleProvider);
      
      // Add user to Firestore if needed
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        name: result.user.displayName,
        email: result.user.email,
        lastLogin: serverTimestamp()
      }, { merge: true });

    } catch (error) {
      console.error('Google auth error:', error);
      setAuthError(
        error.code === 'auth/popup-closed-by-user' 
          ? 'Sign-in cancelled. Please try again.' 
          : error.code === 'auth/popup-blocked'
          ? 'Popup was blocked. Please allow popups for this site.'
          : 'Failed to sign in with Google. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError(
        error.code === 'auth/wrong-password' ? 'Invalid email or password' :
        error.code === 'auth/user-not-found' ? 'No account found with this email' :
        error.code === 'auth/email-already-in-use' ? 'Email already registered' :
        'Authentication failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Update the useEffects for data fetching

// 1. First, combine the two useEffects for tab data
useEffect(() => {
  if (!user) return;
  
  let unsubscribe = () => {};
  const fetchData = async () => {
    setIsTabLoading(true);
    try {
      const alertsRef = collection(db, 'alerts');

      switch(activeTab) {
        case 'recent':
          // Use real-time listener for recent tab
          unsubscribe = onSnapshot(
            query(alertsRef, orderBy('timestamp', 'desc'), limit(20)),
            (snapshot) => {
              const recentAlerts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              console.log('Recent alerts:', recentAlerts); // Add this debug log
              setTabsData(prev => ({ ...prev, recent: recentAlerts }));
              setIsTabLoading(false);
            },
            (error) => {
              console.error('Error fetching recent alerts:', error);
              setIsTabLoading(false);
            }
          );
          break;

        case 'my-posts':
          const myPostsQuery = query(
            alertsRef,
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
          );
          const myPostsSnap = await getDocs(myPostsQuery);
          const myPosts = myPostsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setTabsData(prev => ({ ...prev, 'my-posts': myPosts }));
          break;

        case 'saved':
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const savedIds = userDoc.data()?.savedAlerts || [];
          const savedAlerts = await Promise.all(
            savedIds.map(async (id) => {
              const alertDoc = await getDoc(doc(alertsRef, id));
              if (alertDoc.exists()) {
                return { id: alertDoc.id, ...alertDoc.data() };
              }
              return null;
            })
          );
          setTabsData(prev => ({ 
            ...prev, 
            'saved': savedAlerts.filter(alert => alert !== null) 
          }));
          break;

        default:
          console.warn(`Unhandled tab type: ${activeTab}`);
          break;
      }
    } catch (error) {
      console.error('Error fetching tab data:', error);
    } finally {
      setIsTabLoading(false);
    }
  };

  fetchData();

  // Cleanup function
  return () => {
    unsubscribe();
  };
}, [user, activeTab]);

// 2. Remove the duplicate useEffect for alerts
// Remove this useEffect:
// useEffect(() => {
//   if (!user) return;
//   const alertsRef = collection(db, 'alerts');
//   const q = query(alertsRef, orderBy('timestamp', 'desc'));
//   ...
// }, [user]);

  // Simplify handleImageChange function
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      setIsProcessing(true);
  
      if (!file.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please select an image.');
      }
  
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      };
      
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result;
        setImageFile(base64String);
        setImagePreview(base64String);
      };
  
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error handling image:', error);
      alert(error.message || 'Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Update handleSubmitAlert function
  const handleSubmitAlert = async (e) => {
    e.preventDefault();
    
    if (!imageFile || !description || !location || !selectedCategory || !selectedIncident) {
      alert('Please fill in all fields and add an image');
      return;
    }
  
    try {
      setIsUploading(true);
      
      const alertData = {
        imageUrl: imageFile,
        description,
        location,
        state: selectedState,
        category: selectedCategory,
        incidentType: selectedIncident,
        userId: user.uid,
        userEmail: user.email,
        timestamp: serverTimestamp(),
        upvotes: 0,
        upvotedBy: []
      };
  
      console.log('Creating alert with data:', alertData); // Add this debug log
      
      const docRef = await addDoc(collection(db, 'alerts'), alertData);
      console.log('Alert created with ID:', docRef.id); // Add this debug log
  
      // Reset form
      setImageFile(null);
      setImagePreview(null);
      setDescription('');
      setLocation('');
      setSelectedCategory('');
      setSelectedIncident('');
      
      window.alert('Alert submitted successfully');
    } catch (error) {
      console.error('Error creating alert:', error);
      window.alert('Failed to create alert. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpvote = async (alertId) => {
    if (!user) return;
    
    try {
      setUpvotingId(alertId);
      const alertRef = doc(db, 'alerts', alertId);
      const alert = alerts.find(a => a.id === alertId);
      const hasUpvoted = alert.upvotedBy?.includes(user.uid);
  
      await updateDoc(alertRef, {
        upvotes: hasUpvoted ? alert.upvotes - 1 : alert.upvotes + 1,
        upvotedBy: hasUpvoted 
          ? arrayRemove(user.uid)
          : arrayUnion(user.uid)
      });
  
      // Update local state
      setAlerts(alerts.map(alert => {
        if (alert.id === alertId) {
          return {
            ...alert,
            upvotes: hasUpvoted ? alert.upvotes - 1 : alert.upvotes + 1,
            upvotedBy: hasUpvoted 
              ? alert.upvotedBy.filter(id => id !== user.uid)
              : [...(alert.upvotedBy || []), user.uid]
          };
        }
        return alert;
      }));
    } catch (error) {
      console.error('Error updating upvote:', error);
    } finally {
      setUpvotingId(null);
    }
  }

  // Add to CommunityHelp component
  const handleShare = async (alert) => {
    try {
      await navigator.share({
        title: `${alert.category} Alert in ${alert.location}`,
        text: alert.description,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Update the handleSaveAlert function
const handleSaveAlert = async (alertItem) => {
  if (!user) {
    window.alert('Please sign in to save alerts');
    return;
  }
  
  try {
    setIsTabLoading(true);
    const userRef = doc(db, 'users', user.uid);
    
    // Get current user data
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() || {};
    const currentSavedAlerts = userData.savedAlerts || [];
    const isAlreadySaved = currentSavedAlerts.includes(alertItem.id);

    if (isAlreadySaved) {
      // Remove from saved alerts
      await updateDoc(userRef, {
        savedAlerts: arrayRemove(alertItem.id)
      });

      // Update local state
      setTabsData(prev => ({
        ...prev,
        saved: prev.saved.filter(a => a.id !== alertItem.id)
      }));

      window.alert('Alert removed from saved');
    } else {
      // Add to saved alerts
      await updateDoc(userRef, {
        savedAlerts: arrayUnion(alertItem.id)
      });

      // Update local state
      setTabsData(prev => ({
        ...prev,
        saved: [...(prev.saved || []), alertItem]
      }));

      window.alert('Alert saved successfully');
    }

  } catch (error) {
    console.error('Error saving alert:', error);
    window.alert('Failed to save alert. Please try again.');
  } finally {
    setIsTabLoading(false);
  }
};

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Add filter logic
  const filteredAlerts = useMemo(() => {
  const currentAlerts = activeTab === 'recent' 
    ? tabsData.recent || []
    : tabsData[activeTab] || [];

  return currentAlerts
    .filter(alert => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          alert.location.toLowerCase().includes(searchLower) ||
          alert.description.toLowerCase().includes(searchLower)
        );
      }
      if (filters.severity !== 'all') {
        return alert.severity === filters.severity;
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'upvotes') {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }
      if (filters.sortBy === 'severity') {
        const severityA = a.severity || 'low';
        const severityB = b.severity || 'low';
        return severityB.localeCompare(severityA);
      }
      return b.timestamp?.seconds || 0 - (a.timestamp?.seconds || 0);
    });
}, [tabsData, activeTab, filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <nav className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">ResQTech - Community Help</div>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
              <Link to="/relocation" className="hover:text-blue-200 transition-colors">Relocation</Link>
              <Link to="/community-help" className="text-blue-200 font-semibold">Community Help</Link>
              <Link to="/mitigation" className="hover:text-blue-200 transition-colors">Mitigation</Link>
              <Link to="/about" className="hover:text-blue-200 transition-colors">About</Link>
            </div>
          </div>
        </nav>
      </header>

      <main className={mainContentStyle}>
        {!user ? (
          <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900 bg-auth-pattern">
            <div className="w-full max-w-md animate-slideUp">
              <div className="relative group">
                {/* Decorative elements */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                
                <div className="relative px-8 py-10 bg-gray-900 ring-1 ring-gray-800/50 rounded-2xl backdrop-blur-xl">
                  {/* Header */}
                  <div className="text-center space-y-6 mb-8">
                    <div className="relative inline-block animate-float">
                      <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20"></div>
                      <svg className="w-16 h-16 text-blue-500 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" 
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" 
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold">
                      <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {isLoginMode ? 'Welcome Back' : 'Join ResQTech'}
                      </span>
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {isLoginMode 
                        ? 'Sign in to connect with your community' 
                        : 'Create an account to start helping others'}
                    </p>
                  </div>

                  {/* Social Login */}
                  <button
                    onClick={handleGoogleSignIn}
                    className="group relative w-full bg-white text-gray-900 rounded-xl p-3.5 font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-300"
                  >
                    <span className="absolute inset-0 w-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl transition-all duration-500 ease-out group-hover:w-full opacity-0 group-hover:opacity-20"></span>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-900 text-gray-500">or continue with email</span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {authError && (
                    <div className="mb-6 animate-shake">
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-400 text-sm">{authError}</p>
                      </div>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleAuth} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 block">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputStyle}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 block">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputStyle}
                        placeholder="Enter your password"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={gradientButtonStyle}
                    >
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 group-hover:transition-opacity"></span>
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <span>{isLoginMode ? 'Signing in...' : 'Creating account...'}</span>
                        </div>
                      ) : (
                        <span>{isLoginMode ? 'Sign in' : 'Create account'}</span>
                      )}
                    </button>
                  </form>

                  {/* Toggle Login/Register */}
                  <p className="mt-6 text-center text-sm text-gray-400">
                    {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                      onClick={() => {
                        setIsLoginMode(!isLoginMode);
                        setAuthError('');
                      }}
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      {isLoginMode ? 'Register now' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Alerts Feed */}
            <div className="col-span-2">
              <AlertTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <FilterBar filters={filters} setFilters={setFilters} />
              
              {/* In the JSX where alerts are rendered */}
              <div className="space-y-6">
                {isTabLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : filteredAlerts.length > 0 ? (
                  filteredAlerts.map(alert => (
                    <div className={alertCardStyle}>
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        onUpvote={() => handleUpvote(alert.id)}
                        onShare={() => handleShare(alert)}
                        onSave={() => handleSaveAlert(alert)}
                        onImageClick={() => handleImageClick(alert.imageUrl)}
                        isUpvoting={upvotingId === alert.id}
                        isSaved={user?.savedAlerts?.includes(alert.id)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    {activeTab === 'my-posts' 
                      ? "You haven't posted any alerts yet"
                      : activeTab === 'saved'
                      ? "No saved alerts"
                      : "No alerts found. Be the first to report an incident!"}
                  </div>
                )}
              </div>
            </div>

            {/* Report Form */}
            <div className="form-container">
              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                Report Incident
              </h2>
              <form onSubmit={handleSubmitAlert} className="space-y-4">
                {/* Location and State Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <div className="select-wrapper">
                      <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="custom-select"
                        required
                      >
                        <option value="">Select state</option>
                        {INDIAN_STATES.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                
                  <div className="form-group">
                    <label className="form-label">City/District *</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={inputStyle}
                      placeholder="Enter city or district"
                      required
                    />
                  </div>
                </div>

                {/* Incident Category */}
                <div className="form-group">
                  <label className="form-label">Incident Category *</label>
                  <div className="select-wrapper">
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedIncident('');
                      }}
                      className="custom-select"
                      required
                    >
                      <option value="">Select category</option>
                      {Object.keys(DISASTER_CATEGORIES).map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Specific Incident Dropdown */}
                {selectedCategory && (
                  <div className="form-group">
                    <label className="form-label">Specific Incident *</label>
                    <div className="select-wrapper">
                      <select
                        value={selectedIncident}
                        onChange={(e) => setSelectedIncident(e.target.value)}
                        className="custom-select"
                        required
                      >
                        <option value="">Select incident type</option>
                        {DISASTER_CATEGORIES[selectedCategory].map((incident) => (
                          <option key={incident.value} value={incident.value}>
                            {incident.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Description Second */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field"
                    rows="3"
                    placeholder="Describe the incident and current conditions"
                    required
                  />
                </div>

                {/* Image Upload Last */}
                {location && description && (
                  <div>
                    <label className={`
  w-full flex flex-col items-center px-4 py-6
  bg-gray-800/50 backdrop-blur-sm
  border-2 border-dashed border-gray-600
  rounded-xl
  cursor-pointer
  transition-all duration-300
  hover:border-blue-500/50 hover:bg-gray-800/70
  ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
`}>
                      {isProcessing ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                          <span className="mt-2 text-sm">Processing image...</span>
                        </div>
                      ) : !imageFile ? (
                        <>
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="mt-2 text-sm">Select an image that shows current conditions</span>
                        </>
                      ) : (
                        <div className="text-center">
                          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="mt-2 text-sm">Image selected - Click to change</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        disabled={!location || !description} 
                      />
                    </label>

                    {imagePreview && (
                      <div className="mt-2 relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploading || !imageFile || !location || !description}
                  className={`${gradientButtonStyle} w-full py-3 ${
                    isUploading || !imageFile || !location || !description
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Submit Alert'
                  )}
                </button>
              </form>

              <button
                onClick={() => signOut(auth)}
                className="mt-4 w-full bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 mt-auto relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-auth-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* About Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">About ResQTech</h3>
              <p className="text-gray-400 text-sm">
                Real-time disaster monitoring and management system for communities in need.
              </p>
            </div>
      
            {/* Quick Links Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white text-sm">Home</Link></li>
                <li><Link to="/relocation" className="text-gray-400 hover:text-white text-sm">Relocation</Link></li>
                <li><Link to="/community-help" className="text-gray-400 hover:text-white text-sm">Community Help</Link></li>
                <li><Link to="/mitigation" className="text-gray-400 hover:text-white text-sm">Mitigation</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">About</Link></li>
              </ul>
            </div>
      
            {/* Emergency Contacts Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>National Emergency: 112</li>
                <li>Ambulance: 108</li>
                <li>Police: 100</li>
                <li>Fire: 101</li>
              </ul>
            </div>
      
            {/* Social Links Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <button type="button" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </button>
                <button type="button" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
      
          <div className="mt-8 border-t border-gray-700 pt-8">
            <div className="text-center text-sm text-gray-400">
              © {new Date().getFullYear()} ResQTech. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      {selectedImage && (
        <ImageModal 
          imageUrl={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
}

export default CommunityHelp;