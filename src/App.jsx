import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/Auth/AuthForm';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function AppContent() {
  const { currentUser } = useAuth();

  return currentUser ? <Dashboard /> : <AuthForm />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="font-inter">
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;