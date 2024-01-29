import React from 'react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="max-w-8xl my-4 p-4 bg-white rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
      </div>
    </div>
  );
};

export default Dashboard;
