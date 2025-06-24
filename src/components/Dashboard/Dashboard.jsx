import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../Layout/Header';
import ProfileForm from '../Profile/ProfileForm';
import ProfileView from '../Profile/ProfileView';
import BrowseProfiles from '../Browse/BrowseProfiles';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiUsers, FiHeart, FiSettings } = FiIcons;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: FiUser },
    { id: 'browse', label: 'Browse Profiles', icon: FiUsers },
    { id: 'matches', label: 'My Matches', icon: FiHeart },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  const handleProfileSaved = () => {
    setIsEditing(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return isEditing ? (
          <ProfileForm onProfileSaved={handleProfileSaved} />
        ) : (
          <ProfileView onEdit={() => setIsEditing(true)} />
        );
      case 'browse':
        return <BrowseProfiles />;
      case 'matches':
        return (
          <div className="text-center py-12">
            <SafeIcon icon={FiHeart} className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">Matches feature will be available soon</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <SafeIcon icon={FiSettings} className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">Settings panel coming soon</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-2 mb-8"
        >
          <nav className="flex space-x-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsEditing(false);
                }}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-rose-500 to-primary-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={tab.icon} />
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab + (isEditing ? '-edit' : '-view')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;