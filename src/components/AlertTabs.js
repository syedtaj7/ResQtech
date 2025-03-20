import React from 'react';

export const AlertTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'recent', label: 'Recent Alerts', icon: 'clock' },
    { id: 'my-posts', label: 'My Posts', icon: 'user' },
    { id: 'saved', label: 'Saved Alerts', icon: 'bookmark' }
  ]; // Removed emergency contact tab

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 flex space-x-1 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-medium transition-all
            ${activeTab === tab.id 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
        >
          <span className="mr-2">
            {getIcon(tab.icon)}
          </span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const getIcon = (name) => {
  const icons = {
    clock: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    user: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    bookmark: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
  };
  return icons[name];
};