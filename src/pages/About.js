import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhone, FaHandsHelping } from 'react-icons/fa';

// Add this after your imports
const stateColors = {
  'North India': {
    gradient: 'from-red-600 to-red-800',
    hover: 'hover:shadow-red-500/10',
    border: 'hover:border-red-500/50'
  },
  'South India': {
    gradient: 'from-yellow-600 to-yellow-800',
    hover: 'hover:shadow-yellow-500/10',
    border: 'hover:border-yellow-500/50'
  },
  'East India': {
    gradient: 'from-green-600 to-green-800',
    hover: 'hover:shadow-green-500/10',
    border: 'hover:border-green-500/50'
  },
  'West India': {
    gradient: 'from-purple-600 to-purple-800',
    hover: 'hover:shadow-purple-500/10',
    border: 'hover:border-purple-500/50'
  },
  'Central India': {
    gradient: 'from-blue-600 to-blue-800',
    hover: 'hover:shadow-blue-500/10',
    border: 'hover:border-blue-500/50'
  },
  'Northeast India': {
    gradient: 'from-teal-600 to-teal-800',
    hover: 'hover:shadow-teal-500/10',
    border: 'hover:border-teal-500/50'
  }
};

// Add this function to determine state region
const getStateRegion = (stateName) => {
  const regions = {
    'North India': ['Delhi', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Punjab', 'Rajasthan', 'Uttarakhand'],
    'South India': ['Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana'],
    'East India': ['Bihar', 'Jharkhand', 'Odisha', 'West Bengal'],
    'West India': ['Goa', 'Gujarat', 'Maharashtra'],
    'Central India': ['Chhattisgarh', 'Madhya Pradesh', 'Uttar Pradesh'],
    'Northeast India': ['Arunachal Pradesh', 'Assam', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura']
  };

  for (const [region, states] of Object.entries(regions)) {
    if (states.includes(stateName)) {
      return region;
    }
  }
  return 'Central India'; // default
};

const SearchBar = ({ onSearch }) => (
  <div className="relative max-w-2xl mx-auto mb-12">
    <input
      type="text"
      placeholder="Search by state name or NGO..."
      className="w-full bg-gray-800 text-white px-6 py-4 rounded-xl border border-gray-700 
        focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      onChange={(e) => onSearch(e.target.value)}
    />
    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>
);

const DetailModal = ({ state, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 overflow-y-auto"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.95, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.95, y: 20 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-gray-900 rounded-xl w-full max-w-2xl my-8"
    >
      <div className="max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{state.state}</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="bg-blue-900/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-200 mb-2">Emergency Contacts</h3>
              <div className="space-y-2 text-blue-100">
                <p><span className="font-medium">Main:</span> {state.contacts.main}</p>
                <p><span className="font-medium">Email:</span> {state.contacts.email}</p>
                <p><span className="font-medium">Address:</span> {state.contacts.address}</p>
              </div>
            </div>

            <div className="bg-green-900/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-200 mb-4">Local NGOs</h3>
              <div className="grid gap-4">
                {state.ngos.map((ngo, idx) => (
                  <div key={idx} className="bg-black/25 p-3 rounded-lg hover:bg-black/40 transition-colors">
                    <p className="font-medium text-white">{ngo.name}</p>
                    <p className="text-sm text-green-200">{ngo.address}</p>
                    <p className="text-sm text-green-200">{ngo.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-blue-900 shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">ResQTech</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-blue-800/30 rounded-lg transition-all"
            >
              Home
            </Link>
            <Link 
              to="/relocation" 
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-blue-800/30 rounded-lg transition-all"
            >
              Relocation
            </Link>
            <Link 
              to="/community-help" 
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-blue-800/30 rounded-lg transition-all"
            >
              Community Help
            </Link>
            <Link 
              to="/mitigation" 
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-blue-800/30 rounded-lg transition-all"
            >
              Mitigation
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-2 text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-all"
            >
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/relocation"
                  className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Relocation
                </Link>
                <Link
                  to="/community-help"
                  className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Community Help
                </Link>
                <Link
                  to="/mitigation"
                  className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mitigation
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2 rounded-md text-white bg-blue-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

function About() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [error] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add useEffect to simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const stateContacts = {
    national: {
      name: "National Disaster Management Authority",
      address: "NDMA Bhawan A-1, Safdarjung Enclave New Delhi - 110029",
      phone: "+91-11-26701728",
      email: "controlroom@ndma.gov.in",
      fax: "+91-11-26701729"
    },
    states: [
      {
        state: "Andhra Pradesh",
        contacts: {
          main: "+91 8645246600, 0863-2377099",
          email: "ed-apsdma@ap.gov.in",
          address: "Genious JR Towers, D.No:21/2B, Pathuru Cross Road Centre, Tadepalli Mandal, Guntur District, AP-522501"
        },
        ngos: [
          {
            name: "Gayatri Rural Educational Society",
            address: "Bharathi Sriramulu Nivas, Bankars Colony, Srikakulam",
            phone: "08942-211069"
          },
          {
            name: "Voluntary Integrated Development Society",
            address: "D.no. 10-2-211/20-21, Teachers Colony, Rayadurg",
            phone: "08942-211069"
          },
          {
            name: "Adarsha Rural Development Society",
            address: "Kodikonda Village, Chilamathur, Anantapur",
            phone: "08942-211069"
          },
          {
            name: "Green Field Rural Development Society",
            address: "Somaghatta Village, Chilamathur Mandal",
            phone: "08556-201224"
          },
          {
            name: "Gramajeevan Youth Association",
            address: "Nallarallapalli, Kanisettypalli Post",
            phone: "08556-204050"
          }
        ]
      },
      {
        state: "Arunachal Pradesh",
        contacts: {
          main: "8974126892, 7085761208",
          email: "angujogam@gmail.com",
          address: "District Disaster Management Office, HQ"
        },
        ngos: [
          {
            name: "Tribal Welfare Development Society",
            address: "Chatim Lodge 1st Floor Near P.K.point, Changlang",
            phone: "03808-223020"
          },
          {
            name: "Mahabodhi Maitri Mandala",
            address: "Jyotipur Village, P.O. Diyun, Via- Namsai",
            phone: "8258881057"
          },
          {
            name: "Seva Kendra Arunachal East",
            address: "P.O. Miao, Changlang",
            phone: "9862239485"
          },
          {
            name: "Diocese of Miao",
            address: "Miao, P.O Miao, Changlang",
            phone: "8131851234"
          },
          {
            name: "Akarum Society",
            address: "Jairampur, Changlang District",
            phone: "9378131767"
          }
        ]
      },
      {
        state: "Assam",
        contacts: {
          main: "1070 (Toll Free), 0361-2237219",
          email: "sdma.assam@gmail.com",
          address: "State Control Room, Dispur"
        },
        ngos: [
          {
            name: "Uttar Betna Samaj Sangskarak",
            address: "Village Maharipara, Baksa",
            phone: "9859086738"
          },
          {
            name: "Ababeel Foundation",
            address: "Vill- Bhakuamari, Baksa",
            phone: "8812892931"
          },
          {
            name: "Nagada",
            address: "H.O/P.O: Doomni dist: Baksa",
            phone: "9101126993"
          },
          {
            name: "Anbesha Group of Society",
            address: "Vill- Niz Juluki, Baksa",
            phone: "8402996494"
          },
          {
            name: "Namsecdo",
            address: "Bareigaon, Ghagra Chowk, Baksa",
            phone: "7002932558"
          }
        ]
      },
      {
        state: "Bihar",
        contacts: {
          main: "0612-2547232",
          email: "info@bsdma.org",
          address: "Sardar Patel Bhawan, 5th Floor, Nehru Path, Patna-800023"
        },
        ngos: [
          {
            name: "Fight For Right Association",
            address: "Alimuddin Iqbal Market, Araria",
            phone: "9973607875"
          },
          {
            name: "Xavier Foundation",
            address: "Keshri Tola, Kothi Hat Road, Forbesganj",
            phone: "9939260016"
          },
          {
            name: "Bharti Sewa Sadan Trust",
            address: "Shivpuri, Ward No- 09 Bhudan",
            phone: "7782833655"
          },
          {
            name: "Bhardwaj Sewa Kendra",
            address: "Sultan Pokhar, Forbesganj",
            phone: "7781804022"
          },
          {
            name: "Manokamana",
            address: "Hanumant Nagar, Araria",
            phone: "9931028432"
          }
        ]
      },
      {
        state: "Chhattisgarh",
        contacts: {
          main: "07751-221004",
          email: "relief.cg@nic.in",
          address: "Office of the Collector and District Magistrate"
        },
        ngos: [
          {
            name: "Association of Professional Social Workers",
            address: "Krishna Enclave, Raipur",
            phone: "9417170356"
          },
          {
            name: "Institute for Social Research",
            address: "Sector 15, Bhilai",
            phone: "9872709772"
          },
          {
            name: "Environment Society of India",
            address: "Karuna Sadan, Raipur",
            phone: "9417004937"
          },
          {
            name: "Srisai Cultural Development Society",
            address: "Nayanapalli Village, Raipur",
            phone: "8701843732"
          },
          {
            name: "Assembly of Believers Trust",
            address: "Astha Apartments, Raipur",
            phone: "8289016677"
          }
        ]
      },
      {
        state: "Goa",
        contacts: {
          main: "0832-2419550",
          email: "controlroom.goa@nic.in",
          address: "Secretariat, Alto-Porvorim, Goa-403501"
        },
        ngos: [
          {
            name: "Amar Bharati Gram Vikas Sanstha",
            address: "Anandi Rajput Niwas, Bicholim",
            phone: "9247352663"
          },
          {
            name: "El Shaddai Charitable Trust",
            address: "Socol Vaddo, Assagao",
            phone: "9260671710"
          },
          {
            name: "Eco Kshatriya Foundation",
            address: "Bairo Palmar, St. Estevam",
            phone: "7757002102"
          },
          {
            name: "Futsal Association of Goa",
            address: "Pearl Building, Assolna",
            phone: "9423837501"
          },
          {
            name: "Carmelite Monestry",
            address: "Cloistered Carmel, Chicalim",
            phone: "9545925938"
          }
        ]
      },
      {
        state: "Gujarat",
        contacts: {
          main: "+91-79-23259283",
          email: "smgr5-gsdma@gujarat.gov.in",
          address: "Block No.11, 5th Floor, Udyog Bhavan, Gandhinagar"
        },
        ngos: [
          {
            name: "Mahiti",
            address: "Dholera opp. Bhimtalav",
            phone: "9558803902"
          },
          {
            name: "Nehru Foundation for Development",
            address: "Thaltej Tekra, Ahmedabad",
            phone: "9825415319"
          },
          {
            name: "Dharti Charitable Trust",
            address: "Dahegamda, Bavla",
            phone: "9824424371"
          },
          {
            name: "Khushbu Jivan Jyot Vikas Trust",
            address: "G.H.Board, Bapunagar",
            phone: "9898961684"
          },
          {
            name: "Sahyog Pragati Mandal",
            address: "Ambica Nagar Society",
            phone: "9426948537"
          }
        ]
      },
      {
        state: "Haryana",
        contacts: {
          main: "8558893911",
          email: "sdma@haryana.gov.in",
          address: "Revenue & Disaster Management Department, Chandigarh"
        },
        ngos: [
          {
            name: "Infosys Federation",
            address: "Sharda Nagar, Ambala",
            phone: "9416665790"
          },
          {
            name: "Logos Faith Foundation",
            address: "Himmat Pura, Ambala",
            phone: "9896491313"
          },
          {
            name: "District Red Cross Society",
            address: "Court Road, Ambala",
            phone: "9416494782"
          },
          {
            name: "Samuh",
            address: "Kanwla Near Gurudwara",
            phone: "9888005979"
          },
          {
            name: "Amolly Foundation",
            address: "Dayal Bagh, Ambala Cantt",
            phone: "7988788519"
          }
        ]
      },
      {
        state: "Himachal Pradesh",
        contacts: {
          main: "0177-2880331",
          email: "sdma-hp@nic.in",
          address: "HP Secretariat, Shimla-171002"
        },
        ngos: [
          {
            name: "Shitikantha Welfare Society",
            address: "Village Glassin, Ghumarwin",
            phone: "9736085002"
          },
          {
            name: "Arpan Foundation",
            address: "Amarpur, Ghumarwin",
            phone: "9418017280"
          },
          {
            name: "Krishak Vikas Association",
            address: "Village Swara, Ghumarwin",
            phone: "7018060961"
          },
          {
            name: "Baglamukhi Human Being Society",
            address: "Vill Soi, Ghumarwin",
            phone: "7974310549"
          },
          {
            name: "High Tech Education Society",
            address: "Purthi Tehsil Pangi",
            phone: "8988281433"
          }
        ]
      },
      {
        state: "Jharkhand",
        contacts: {
          main: "2400220, 2400700",
          email: "homejharkhand@gmail.com",
          address: "2nd Floor, Project Bhawan, Dhurwa, Ranchi-834004"
        },
        ngos: [
          {
            name: "Sahyogini",
            address: "Bahadurpur, Bokaro",
            phone: "9431145778"
          },
          {
            name: "Shree Amar Sanskar Kalyan Kendra",
            address: "Prasad Bhawan, Jainamore",
            phone: "9430768685"
          },
          {
            name: "IITTS Private Education Trust",
            address: "Bari Co-operative Colony, Bokaro",
            phone: "9430771117"
          },
          {
            name: "Aastha Rehabilitation Centre",
            address: "Main Road Phusro, Bermo",
            phone: "9905338888"
          },
          {
            name: "Adhunik Mahila Utthan Samiti",
            address: "Sector-2/d, Bokaro Steel City",
            phone: "7654874721"
          }
        ]
      },
      {
        state: "Karnataka",
        contacts: {
          main: "+91 080 67355000",
          email: "Director@ksndmc.org",
          address: "Major Sandeep Unnikrishnan Road, Bangalore-560064"
        },
        ngos: [
          {
            name: "BCM Grameen Abhivrddai",
            address: "Badaradinni, Bilagi",
            phone: "9972841191"
          },
          {
            name: "Matrushakti Grameen",
            address: "Basaveshwar Nagar Bilagi",
            phone: "9535428143"
          },
          {
            name: "Village Foundation",
            address: "Main Road Channal",
            phone: "9740946030"
          },
          {
            name: "Navodaya Rural Development",
            address: "Engineering College Road, Bagalkot",
            phone: "9441101306"
          },
          {
            name: "Vrutti",
            address: "AECS Layout, RMV 2nd Stage",
            phone: "9480990870"
          }
        ]
      },
      {
        state: "Kerala",
        contacts: {
          main: "0471-2364424",
          email: "keralasdma@gmail.com",
          address: "Observatory Hills, Vikas Bhavan P.O, Thiruvananthapuram-695033"
        },
        ngos: [
          {
            name: "Alleppey Diocesan Charitable Society",
            address: "Convent Square, Alappuzha",
            phone: "9446544899"
          },
          {
            name: "Malankara Orthodox Church Mission",
            address: "St Pauls Mission, Mavelikkara",
            phone: "9947399066"
          },
          {
            name: "Sriyog Sadhanapadham",
            address: "Educational Trust, Alappuzha",
            phone: "9497112606"
          },
          {
            name: "Winfrid Students Social Welfare",
            address: "Samina Manzil, Alappuzha",
            phone: "8943155331"
          },
          {
            name: "Moksha Charitable Foundation",
            address: "Vadakketh House, Alappuzha",
            phone: "9048098940"
          }
        ]
      },
      {
        state: "Madhya Pradesh",
        contacts: {
          main: "0755-2446132",
          email: "mpstatecoord.sdma@mp.gov.in",
          address: "Paryavaran Parisar, Bhopal-462016"
        },
        ngos: [
          {
            name: "Aastha Gramothan Samiti",
            address: "Village Nipaniya, Agar Malwa",
            phone: "7999845733"
          },
          {
            name: "Aadivasi Sabhayta",
            address: "Patel Falya, Jobat",
            phone: "8305553525"
          },
          {
            name: "Virat Social Welfare Society",
            address: "Amarkantak Road, Anuppur",
            phone: "9713374567"
          },
          {
            name: "Devendra Kumar Foundation",
            address: "Village Post Cholna, Anuppur",
            phone: "7566003154"
          },
          {
            name: "Gurudev Samaj Kalyan Samiti",
            address: "Sharma Colony, Ashoknagar",
            phone: "9826219324"
          }
        ]
      },
      {
        state: "Maharashtra",
        contacts: {
          main: "022-22694719",
          email: "dmcell.mumbai@gmail.com",
          address: "Municipal Head Office, Mumbai-400001"
        },
        ngos: [
          {
            name: "Smruti Gramin Adivasi Vikas",
            address: "K.G.Road, Akole, Ahmednagar",
            phone: "9423462260"
          },
          {
            name: "Lokmudra Foundation",
            address: "Manusawali, Akole",
            phone: "9765308811"
          },
          {
            name: "Rashtratej Gramin Vikas Sanstha",
            address: "Ambalica Sugar Factory, Karjat",
            phone: "8805941515"
          },
          {
            name: "Muskan Social Welfare",
            address: "Ekta Colony, Ahmednagar",
            phone: "9545687868"
          },
          {
            name: "Dnyanganga Gramin Sheti",
            address: "Nirmal Nagar, Sangamner",
            phone: "9689981166"
          }
        ]
      },
      {
        state: "Manipur",
        contacts: {
          main: "0385-2458385",
          email: "sdma.manipur@gov.in",
          address: "Deputy Commissioner Office, Imphal East"
        },
        ngos: [
          {
            name: "Peoples Foundation Manipur",
            address: "Kumbi Bazar, Bishnupur",
            phone: "9856611334"
          },
          {
            name: "Rural Development Association",
            address: "Keinou Bazar, Nambol",
            phone: "9615446446"
          },
          {
            name: "Youth Development Association",
            address: "Keinou Thongkha, Bishnupur",
            phone: "9862502040"
          },
          {
            name: "Tidim Peoples Foundation",
            address: "Kwakta Sabal Leikai, Moirang",
            phone: "9615119081"
          },
          {
            name: "Rural Educational Development",
            address: "Thanga Tongbram, Moirang",
            phone: "9436039543"
          }
        ]
      },
      {
        state: "Meghalaya",
        contacts: {
          main: "0364-2502098",
          email: "sdmadeptt-meg@gov.in",
          address: "Lower Lachumiere, Shillong-793001"
        },
        ngos: [
          {
            name: "Khyrim Multipurpose Society",
            address: "Nongkrem",
            phone: "9862471383"
          },
          {
            name: "Khasi Cultural Society",
            address: "Mawsynram",
            phone: "8794997834"
          },
          {
            name: "Kayzey Society",
            address: "Mawngap Mawsmai",
            phone: "9402554223"
          },
          {
            name: "Bosco Reach Out",
            address: "Sacred Heart College, Shillong",
            phone: "9435569149"
          },
          {
            name: "Missionary Sisters of Mary",
            address: "East Khasi Hills",
            phone: "9435341836"
          }
        ]
      },
      {
        state: "Mizoram",
        contacts: {
          main: "0389-2329202",
          email: "sdma-miz@nic.in",
          address: "Disaster Management & Rehabilitation, Aizawl-796001"
        },
        ngos: [
          {
            name: "COD NERC",
            address: "Dr C. Lalthanga Building, Aizawl",
            phone: "9862551753"
          },
          {
            name: "Gan Sabra Society",
            address: "Zonuam, Aizawl",
            phone: "9436362493"
          },
          {
            name: "Mission Foundation Movement",
            address: "Bawngkawn, Lunglei Road",
            phone: "9862558637"
          },
          {
            name: "Zomi Cultural Society",
            address: "Bawngkawn South, Aizawl",
            phone: "9089239299"
          },
          {
            name: "Hoi Philoi",
            address: "Tuikual North, Aizawl",
            phone: "9862539298"
          }
        ]
      },
      {
        state: "Nagaland",
        contacts: {
          main: "0370-2291122",
          email: "sdma.nagaland@nsdma.org",
          address: "Civil Secretariat, Kohima-797001"
        },
        ngos: [
          {
            name: "Bethesda Youth Welfare Centre",
            address: "Circuit House Colony, Dimapur",
            phone: "9436003967"
          },
          {
            name: "Abiogenesis Society",
            address: "Nuton Bosti, Dimapur",
            phone: "9436003009"
          },
          {
            name: "Development Association of Nagaland",
            address: "Bishops House, Dimapur",
            phone: "9862919542"
          },
          {
            name: "Pro Rural",
            address: "OK Complex, Dimapur",
            phone: "9436832176"
          },
          {
            name: "Khala Lagha Welfare Society",
            address: "Thilixu Village, Dimapur",
            phone: "9089140461"
          }
        ]
      },
      {
        state: "Odisha",
        contacts: {
          main: "18001218242",
          email: "revsec.od@nic.in",
          address: "Revenue & Disaster Management Department, Bhubaneswar-751001"
        },
        ngos: [
          {
            name: "Thermal Youth Club",
            address: "Talcher Thermal, Anugul",
            phone: "9938741114"
          },
          {
            name: "Centre for Development Service",
            address: "Banarpal, Anugul",
            phone: "9937683561"
          },
          {
            name: "Social Research Institute",
            address: "Manpur, Bantala",
            phone: "9937795291"
          },
          {
            name: "FREMSS Odisha",
            address: "Podagarh, Rengali",
            phone: "9937509718"
          },
          {
            name: "National Education Society",
            address: "Mohanipal, Derang",
            phone: "9437821823"
          }
        ]
      },
      {
        state: "Punjab",
        contacts: {
          main: "0172-2740611",
          email: "punjabdisaster@gmail.com",
          address: "2nd Floor, Punjab Civil Secretariat-1, Chandigarh"
        },
        ngos: [
          {
            name: "Captain Gurdeep Singh Society",
            address: "National City Homes, Amritsar",
            phone: "9501141111"
          },
          {
            name: "Lok Kalyan Samiti",
            address: "New Ranjitpura-3, Chheharta",
            phone: "9872465799"
          },
          {
            name: "SSAI Creations",
            address: "Partap Avenue, Amritsar",
            phone: "9888282228"
          },
          {
            name: "United Khalsa Foundation",
            address: "Ganda Singh Colony, Amritsar",
            phone: "9779798601"
          },
          {
            name: "Kirtan Promotion Society",
            address: "Ganda Singh Colony, Tarn Taran Road",
            phone: "8288987140"
          }
        ]
      },
      {
        state: "Rajasthan",
        contacts: {
          main: "0141-2227084",
          email: "relief-rj@nic.in",
          address: "DM & Relief Department, Jaipur"
        },
        ngos: [
          {
            name: "Social Participation Rural Health",
            address: "Mission Compound, Nasirabad",
            phone: "9414379407"
          },
          {
            name: "Saaransh",
            address: "Housing Board Colony, Ajmer",
            phone: "9828371806"
          },
          {
            name: "Roman Catholic Social Service",
            address: "Near Power House, Madar",
            phone: "9460177710"
          },
          {
            name: "Gramin Mahila Vikash Sansthan",
            address: "Sumer Nagar, Madanganj",
            phone: "9672979032"
          },
          {
            name: "Kalyani Rural Development",
            address: "Panchsheel Housing Board, Ajmer",
            phone: "9413501910"
          }
        ]
      },
      {
        state: "Sikkim",
        contacts: {
          main: "03592-202675",
          email: "sikkimsdma@gmail.com",
          address: "Secretariat, Gangtok"
        },
        ngos: [
          {
            name: "Sikkim Development Foundation",
            address: "Gangtok",
            phone: "03592-202675"
          },
          {
            name: "Sikkim Manipal University",
            address: "Gangtok",
            phone: "03592-202675"
          },
          {
            name: "Sikkim State AIDS Control Society",
            address: "Gangtok",
            phone: "03592-202675"
          },
          {
            name: "Sikkim State Legal Services Authority",
            address: "Gangtok",
            phone: "03592-202675"
          },
          {
            name: "Sikkim State Social Welfare Board",
            address: "Gangtok",
            phone: "03592-202675"
          }
        ]
      },
      {
        state: "Tamil Nadu",
        contacts: {
          main: "044-25671545",
          email: "tnsdma@tn.gov.in",
          address: "Ezhilagam, Chepauk, Chennai-600005"
        },
        ngos: [
          {
            name: "Tamil Nadu Voluntary Health Association",
            address: "Chennai",
            phone: "044-25671545"
          },
          {
            name: "Tamil Nadu Science Forum",
            address: "Chennai",
            phone: "044-25671545"
          },
          {
            name: "Tamil Nadu Women's Collective",
            address: "Chennai",
            phone: "044-25671545"
          },
          {
            name: "Tamil Nadu Social Service Society",
            address: "Chennai",
            phone: "044-25671545"
          },
          {
            name: "Tamil Nadu State AIDS Control Society",
            address: "Chennai",
            phone: "044-25671545"
          }
        ]
      },
      {
        state: "Telangana",
        contacts: {
          main: "040-23456005",
          email: "sdma.telangana@gmail.com",
          address: "BRKR Bhavan, Tank Bund Road, Hyderabad-500063"
        },
        ngos: [
          {
            name: "Telangana State AIDS Control Society",
            address: "Hyderabad",
            phone: "040-23456005"
          },
          {
            name: "Telangana State Legal Services Authority",
            address: "Hyderabad",
            phone: "040-23456005"
          },
          {
            name: "Telangana State Social Welfare Board",
            address: "Hyderabad",
            phone: "040-23456005"
          },
          {
            name: "Telangana State Women's Commission",
            address: "Hyderabad",
            phone: "040-23456005"
          },
          {
            name: "Telangana State Youth Welfare Board",
            address: "Hyderabad",
            phone: "040-23456005"
          }
        ]
      },
      {
        state: "Tripura",
        contacts: {
          main: "0381-2416045",
          email: "sdma.tripura@gmail.com",
          address: "Secretariat, Agartala"
        },
        ngos: [
          {
            name: "Tripura State AIDS Control Society",
            address: "Agartala",
            phone: "0381-2416045"
          },
          {
            name: "Tripura State Legal Services Authority",
            address: "Agartala",
            phone: "0381-2416045"
          },
          {
            name: "Tripura State Social Welfare Board",
            address: "Agartala",
            phone: "0381-2416045"
          },
          {
            name: "Tripura State Women's Commission",
            address: "Agartala",
            phone: "0381-2416045"
          },
          {
            name: "Tripura State Youth Welfare Board",
            address: "Agartala",
            phone: "0381-2416045"
          }
        ]
      },
      {
        state: "Uttar Pradesh",
        contacts: {
          main: "0522-2238419",
          email: "sdma.up@gmail.com",
          address: "Bapu Bhawan, Secretariat, Lucknow-226001"
        },
        ngos: [
          {
            name: "Uttar Pradesh State AIDS Control Society",
            address: "Lucknow",
            phone: "0522-2238419"
          },
          {
            name: "Uttar Pradesh State Legal Services Authority",
            address: "Lucknow",
            phone: "0522-2238419"
          },
          {
            name: "Uttar Pradesh State Social Welfare Board",
            address: "Lucknow",
            phone: "0522-2238419"
          },
          {
            name: "Uttar Pradesh State Women's Commission",
            address: "Lucknow",
            phone: "0522-2238419"
          },
          {
            name: "Uttar Pradesh State Youth Welfare Board",
            address: "Lucknow",
            phone: "0522-2238419"
          }
        ]
      },
      {
        state: "Uttarakhand",
        contacts: {
          main: "0135-2710334",
          email: "sdma.uk@gmail.com",
          address: "Secretariat, Dehradun"
        },
        ngos: [
          {
            name: "Uttarakhand State AIDS Control Society",
            address: "Dehradun",
            phone: "0135-2710334"
          },
          {
            name: "Uttarakhand State Legal Services Authority",
            address: "Dehradun",
            phone: "0135-2710334"
          },
          {
            name: "Uttarakhand State Social Welfare Board",
            address: "Dehradun",
            phone: "0135-2710334"
          },
          {
            name: "Uttarakhand State Women's Commission",
            address: "Dehradun",
            phone: "0135-2710334"
          },
          {
            name: "Uttarakhand State Youth Welfare Board",
            address: "Dehradun",
            phone: "0135-2710334"
          }
        ]
      },
      {
        state: "West Bengal",
        contacts: {
          main: "033-22143526",
          email: "sdma.wb@gmail.com",
          address: "Nabanna, Howrah"
        },
        ngos: [
          {
            name: "West Bengal State AIDS Control Society",
            address: "Howrah",
            phone: "033-22143526"
          },
          {
            name: "West Bengal State Legal Services Authority",
            address: "Howrah",
            phone: "033-22143526"
          },
          {
            name: "West Bengal State Social Welfare Board",
            address: "Howrah",
            phone: "033-22143526"
          },
          {
            name: "West Bengal State Women's Commission",
            address: "Howrah",
            phone: "033-22143526"
          },
          {
            name: "West Bengal State Youth Welfare Board",
            address: "Howrah",
            phone: "033-22143526"
          }
        ]
      }
    ]
  };

  const filteredStates = stateContacts.states.filter(state => {
    const searchLower = searchTerm.toLowerCase();
    return (
      state.state.toLowerCase().includes(searchLower) ||
      state.ngos.some(ngo => ngo.name.toLowerCase().includes(searchLower))
    );
  });

  // Add this before your return statement
  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>;
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="container mx-auto px-6 py-12 pt-24"> {/* Added pt-24 */}
        <div className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white text-center mb-8"
          >
            Emergency Services Directory
          </motion.h1>

          <SearchBar onSearch={setSearchTerm} />
        </div>

        {/* State Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredStates.map((state, index) => {
            const region = getStateRegion(state.state);
            const colors = stateColors[region];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedState(state)}
                className={`bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-750 
                  transition-all hover:shadow-xl ${colors.hover} border border-gray-700 
                  ${colors.border}`}
              >
                <div className={`bg-gradient-to-r ${colors.gradient} p-4`}>
                  <h3 className="text-xl font-bold text-white">{state.state}</h3>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <FaPhone className="w-4 h-4" />
                    <span>{state.contacts.main}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <FaHandsHelping className="w-4 h-4" />
                    <span>{state.ngos.length} NGOs Available</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* About Section - Moved down */}
        <section className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold text-white mb-6"
          >
            About ResQTech
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-300 text-lg"
          >
            ResQTech is a comprehensive disaster management platform providing real-time assistance 
            and guidance during various types of disasters. Our mission is to help communities 
            prepare for, respond to, and recover from disasters effectively.
          </motion.p>
        </section>
      </main>

      {/* Update Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About ResQTech</h3>
              <p className="text-gray-400 text-sm">
                Real-time disaster monitoring and management system for India
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white text-sm">Home</Link></li>
                <li><Link to="/relocation" className="text-gray-400 hover:text-white text-sm">Relocation</Link></li>
                <li><Link to="/community-help" className="text-gray-400 hover:text-white text-sm">Community Help</Link></li>
                <li><Link to="/mitigation" className="text-gray-400 hover:text-white text-sm">Mitigation</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>National Emergency: 112</li>
                <li>Ambulance: 108</li>
                <li>Police: 100</li>
                <li>Fire: 101</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com/resqtech" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/resqtech" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} ResQTech. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedState && (
          <DetailModal 
            state={selectedState} 
            onClose={() => setSelectedState(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default About;