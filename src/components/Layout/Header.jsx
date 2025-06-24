import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiUser, FiLogOut } = FiIcons;

const Header = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-rose-500 to-primary-500 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <SafeIcon icon={FiHeart} className="text-white text-2xl" />
            <h1 className="text-2xl font-bold text-white">VforVivah</h1>
          </motion.div>
          
          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <SafeIcon icon={FiUser} className="text-lg" />
                <span className="hidden sm:inline">{currentUser.email}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200"
              >
                <SafeIcon icon={FiLogOut} className="text-white" />
                <span className="text-white hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;