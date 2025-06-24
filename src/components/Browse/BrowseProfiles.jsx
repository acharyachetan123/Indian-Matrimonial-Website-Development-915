import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiMapPin, FiBook, FiBriefcase, FiHeart, FiFilter, FiSearch } = FiIcons;

const BrowseProfiles = () => {
  const { currentUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    ageMin: '',
    ageMax: '',
    religion: '',
    education: '',
    city: '',
    maritalStatus: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, [currentUser]);

  useEffect(() => {
    applyFilters();
  }, [profiles, filters]);

  const loadProfiles = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const profilesRef = collection(db, 'profiles');
      const q = query(profilesRef, where('userId', '!=', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const profilesData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.dateOfBirth) {
          const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
          data.age = age;
        }
        profilesData.push({ id: doc.id, ...data });
      });
      
      setProfiles(profilesData);
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...profiles];

    if (filters.ageMin) {
      filtered = filtered.filter(profile => profile.age >= parseInt(filters.ageMin));
    }
    if (filters.ageMax) {
      filtered = filtered.filter(profile => profile.age <= parseInt(filters.ageMax));
    }
    if (filters.religion) {
      filtered = filtered.filter(profile => profile.religion === filters.religion);
    }
    if (filters.education) {
      filtered = filtered.filter(profile => profile.education === filters.education);
    }
    if (filters.city) {
      filtered = filtered.filter(profile => 
        profile.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    if (filters.maritalStatus) {
      filtered = filtered.filter(profile => profile.maritalStatus === filters.maritalStatus);
    }

    setFilteredProfiles(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      ageMin: '',
      ageMax: '',
      religion: '',
      education: '',
      city: '',
      maritalStatus: ''
    });
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
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <SafeIcon icon={FiUsers} className="text-rose-500 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-900">Browse Profiles</h2>
          <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm font-medium">
            {filteredProfiles.length} profiles
          </span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <SafeIcon icon={FiFilter} />
          <span>Filters</span>
        </motion.button>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Age</label>
              <input
                type="number"
                value={filters.ageMin}
                onChange={(e) => handleFilterChange('ageMin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="18"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Age</label>
              <input
                type="number"
                value={filters.ageMax}
                onChange={(e) => handleFilterChange('ageMax', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
              <select
                value={filters.religion}
                onChange={(e) => handleFilterChange('religion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="hindu">Hindu</option>
                <option value="muslim">Muslim</option>
                <option value="christian">Christian</option>
                <option value="sikh">Sikh</option>
                <option value="buddhist">Buddhist</option>
                <option value="jain">Jain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
              <select
                value={filters.education}
                onChange={(e) => handleFilterChange('education', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="high-school">High School</option>
                <option value="diploma">Diploma</option>
                <option value="bachelors">Bachelor's</option>
                <option value="masters">Master's</option>
                <option value="phd">PhD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
              <select
                value={filters.maritalStatus}
                onChange={(e) => handleFilterChange('maritalStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="never-married">Never Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="text-rose-600 hover:text-rose-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Profiles Grid */}
      {filteredProfiles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiSearch} className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Profiles Found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more results</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-rose-500 to-primary-500 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiUsers} className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{profile.fullName}</h3>
                    <div className="flex items-center space-x-3 text-white/90 text-sm">
                      {profile.age && <span>Age: {profile.age}</span>}
                      {profile.height && <span>Height: {profile.height}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 space-y-4">
                {profile.city && profile.state && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <SafeIcon icon={FiMapPin} className="text-rose-500" />
                    <span>{profile.city}, {profile.state}</span>
                  </div>
                )}

                {profile.education && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <SafeIcon icon={FiBook} className="text-rose-500" />
                    <span className="capitalize">{profile.education.replace('-', ' ')}</span>
                  </div>
                )}

                {profile.occupation && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <SafeIcon icon={FiBriefcase} className="text-rose-500" />
                    <span>{profile.occupation}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {profile.religion && (
                    <span className="bg-rose-100 text-rose-600 px-2 py-1 rounded-full text-xs font-medium capitalize">
                      {profile.religion}
                    </span>
                  )}
                  {profile.maritalStatus && (
                    <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs font-medium capitalize">
                      {profile.maritalStatus.replace('-', ' ')}
                    </span>
                  )}
                  {profile.horoscopeMatch && (
                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">
                      Horoscope Match
                    </span>
                  )}
                </div>

                {profile.about && (
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {profile.about}
                  </p>
                )}
              </div>

              {/* Profile Actions */}
              <div className="px-6 pb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-rose-500 to-primary-500 text-white py-2 rounded-lg font-medium hover:from-rose-600 hover:to-primary-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiHeart} />
                  <span>Show Interest</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default BrowseProfiles;