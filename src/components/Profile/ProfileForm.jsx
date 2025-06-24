import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiUser, FiHeart, FiMapPin, FiBook, FiBriefcase, FiHome } = FiIcons;

const ProfileForm = ({ onProfileSaved }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

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
        reset(docSnap.data());
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
    setLoading(false);
  };

  const onSubmit = async (data) => {
    if (!currentUser) return;
    
    setSaving(true);
    try {
      const profileData = {
        ...data,
        userId: currentUser.uid,
        email: currentUser.email,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'profiles', currentUser.uid), profileData);
      onProfileSaved && onProfileSaved();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <SafeIcon icon={FiUser} className="text-rose-500 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                {...register('fullName', { required: 'Full name is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                type="date"
                {...register('dateOfBirth', { required: 'Date of birth is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                {...register('gender', { required: 'Gender is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <select
                {...register('height')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select Height</option>
                <option value="4ft10in">4&apos;10&quot;</option>
                <option value="4ft11in">4&apos;11&quot;</option>
                <option value="5ft0in">5&apos;0&quot;</option>
                <option value="5ft1in">5&apos;1&quot;</option>
                <option value="5ft2in">5&apos;2&quot;</option>
                <option value="5ft3in">5&apos;3&quot;</option>
                <option value="5ft4in">5&apos;4&quot;</option>
                <option value="5ft5in">5&apos;5&quot;</option>
                <option value="5ft6in">5&apos;6&quot;</option>
                <option value="5ft7in">5&apos;7&quot;</option>
                <option value="5ft8in">5&apos;8&quot;</option>
                <option value="5ft9in">5&apos;9&quot;</option>
                <option value="5ft10in">5&apos;10&quot;</option>
                <option value="5ft11in">5&apos;11&quot;</option>
                <option value="6ft0in">6&apos;0&quot;</option>
                <option value="6ft1in">6&apos;1&quot;</option>
                <option value="6ft2in">6&apos;2&quot;</option>
                <option value="6ft3in">6&apos;3&quot;</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
              <select
                {...register('maritalStatus')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select Status</option>
                <option value="never-married">Never Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue</label>
              <select
                {...register('motherTongue')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select Language</option>
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
                <option value="tamil">Tamil</option>
                <option value="telugu">Telugu</option>
                <option value="marathi">Marathi</option>
                <option value="gujarati">Gujarati</option>
                <option value="bengali">Bengali</option>
                <option value="kannada">Kannada</option>
                <option value="malayalam">Malayalam</option>
                <option value="punjabi">Punjabi</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Location Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <SafeIcon icon={FiMapPin} className="text-rose-500 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900">Location</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                {...register('country')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="e.g., India"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                {...register('state')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="e.g., Maharashtra"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                {...register('city')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="e.g., Mumbai"
              />
            </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Highest Education</label>
              <select
                {...register('education')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select Education</option>
                <option value="high-school">High School</option>
                <option value="diploma">Diploma</option>
                <option value="bachelors">Bachelor&apos;s Degree</option>
                <option value="masters">Master&apos;s Degree</option>
                <option value="phd">PhD</option>
                <option value="professional">Professional Degree</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
              <input
                {...register('occupation')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
              <select
                {...register('income')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select Income Range</option>
                <option value="0-3">0 - 3 Lakhs</option>
                <option value="3-5">3 - 5 Lakhs</option>
                <option value="5-7">5 - 7 Lakhs</option>
                <option value="7-10">7 - 10 Lakhs</option>
                <option value="10-15">10 - 15 Lakhs</option>
                <option value="15-20">15 - 20 Lakhs</option>
                <option value="20-25">20 - 25 Lakhs</option>
                <option value="25+">25+ Lakhs</option>
              </select>
            </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
              <select
                {...register('religion')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select Religion</option>
                <option value="hindu">Hindu</option>
                <option value="muslim">Muslim</option>
                <option value="christian">Christian</option>
                <option value="sikh">Sikh</option>
                <option value="buddhist">Buddhist</option>
                <option value="jain">Jain</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
              <input
                {...register('caste')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter caste (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Family Type</label>
              <select
                {...register('familyType')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select Family Type</option>
                <option value="nuclear">Nuclear Family</option>
                <option value="joint">Joint Family</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Family Status</label>
              <select
                {...register('familyStatus')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select Family Status</option>
                <option value="middle-class">Middle Class</option>
                <option value="upper-middle">Upper Middle Class</option>
                <option value="rich">Rich</option>
                <option value="affluent">Affluent</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Lifestyle & Preferences */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <SafeIcon icon={FiHeart} className="text-rose-500 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900">Lifestyle & Preferences</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diet</label>
              <select
                {...register('diet')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select Diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="jain-vegetarian">Jain Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Smoking</label>
              <select
                {...register('smoking')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select Option</option>
                <option value="no">No</option>
                <option value="occasionally">Occasionally</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Drinking</label>
              <select
                {...register('drinking')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select Option</option>
                <option value="no">No</option>
                <option value="occasionally">Occasionally</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('horoscopeMatch')}
                className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Horoscope matching required
              </label>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
            <textarea
              {...register('about')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-primary-500 text-white px-8 py-3 rounded-lg font-medium hover:from-rose-600 hover:to-primary-600 transition-all duration-200 disabled:opacity-50"
          >
            <SafeIcon icon={FiSave} />
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default ProfileForm;