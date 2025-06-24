import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMapPin, FiBook, FiBriefcase, FiHome, FiHeart, FiEdit, FiMail, FiPhone } = FiIcons;

const ProfileView = ({ onEdit }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [currentUser]);

  const loadProfile = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const docRef = doc(db, 'profiles', currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <SafeIcon icon={FiUser} className="text-6xl text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Profile Found</h3>
        <p className="text-gray-600 mb-6">Create your profile to get started</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEdit}
          className="bg-gradient-to-r from-rose-500 to-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-rose-600 hover:to-primary-600 transition-all duration-200"
        >
          Create Profile
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-rose-500 to-primary-500 rounded-xl shadow-lg p-8 text-white mb-8"
      >
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiUser} className="text-4xl text-white" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold mb-2">{profile.fullName}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/90">
              {profile.age && <span>Age: {profile.age}</span>}
              {profile.height && <span>Height: {profile.height}</span>}
              {profile.city && profile.state && (
                <span className="flex items-center">
                  <SafeIcon icon={FiMapPin} className="mr-1" />
                  {profile.city}, {profile.state}
                </span>
              )}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <SafeIcon icon={FiEdit} />
            <span>Edit Profile</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <SafeIcon icon={FiUser} className="text-rose-500 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900">Personal Details</h3>
          </div>
          
          <div className="space-y-4">
            {profile.dateOfBirth && (
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth:</span>
                <span className="font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
              </div>
            )}
            {profile.gender && (
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium capitalize">{profile.gender}</span>
              </div>
            )}
            {profile.maritalStatus && (
              <div className="flex justify-between">
                <span className="text-gray-600">Marital Status:</span>
                <span className="font-medium capitalize">{profile.maritalStatus.replace('-', ' ')}</span>
              </div>
            )}
            {profile.motherTongue && (
              <div className="flex justify-between">
                <span className="text-gray-600">Mother Tongue:</span>
                <span className="font-medium capitalize">{profile.motherTongue}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Education & Career */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <SafeIcon icon={FiBook} className="text-rose-500 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900">Education & Career</h3>
          </div>
          
          <div className="space-y-4">
            {profile.education && (
              <div className="flex justify-between">
                <span className="text-gray-600">Education:</span>
                <span className="font-medium capitalize">{profile.education.replace('-', ' ')}</span>
              </div>
            )}
            {profile.occupation && (
              <div className="flex justify-between">
                <span className="text-gray-600">Occupation:</span>
                <span className="font-medium">{profile.occupation}</span>
              </div>
            )}
            {profile.income && (
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Income:</span>
                <span className="font-medium">{profile.income} Lakhs</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Family Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <SafeIcon icon={FiHome} className="text-rose-500 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900">Family & Religion</h3>
          </div>
          
          <div className="space-y-4">
            {profile.religion && (
              <div className="flex justify-between">
                <span className="text-gray-600">Religion:</span>
                <span className="font-medium capitalize">{profile.religion}</span>
              </div>
            )}
            {profile.caste && (
              <div className="flex justify-between">
                <span className="text-gray-600">Caste:</span>
                <span className="font-medium">{profile.caste}</span>
              </div>
            )}
            {profile.familyType && (
              <div className="flex justify-between">
                <span className="text-gray-600">Family Type:</span>
                <span className="font-medium capitalize">{profile.familyType}</span>
              </div>
            )}
            {profile.familyStatus && (
              <div className="flex justify-between">
                <span className="text-gray-600">Family Status:</span>
                <span className="font-medium capitalize">{profile.familyStatus.replace('-', ' ')}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Lifestyle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <SafeIcon icon={FiHeart} className="text-rose-500 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900">Lifestyle</h3>
          </div>
          
          <div className="space-y-4">
            {profile.diet && (
              <div className="flex justify-between">
                <span className="text-gray-600">Diet:</span>
                <span className="font-medium capitalize">{profile.diet.replace('-', ' ')}</span>
              </div>
            )}
            {profile.smoking && (
              <div className="flex justify-between">
                <span className="text-gray-600">Smoking:</span>
                <span className="font-medium capitalize">{profile.smoking}</span>
              </div>
            )}
            {profile.drinking && (
              <div className="flex justify-between">
                <span className="text-gray-600">Drinking:</span>
                <span className="font-medium capitalize">{profile.drinking}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Horoscope Match:</span>
              <span className="font-medium">{profile.horoscopeMatch ? 'Required' : 'Not Required'}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* About Section */}
      {profile.about && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">About Me</h3>
          <p className="text-gray-700 leading-relaxed">{profile.about}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfileView;