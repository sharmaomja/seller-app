import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Dropdown } from 'react-bootstrap'; 

const Navbar = () => {
  const dropdownStyle = {
    background: 'linear-gradient(to right, #FFFF00, #FFD700)', // Gradient color for the button (yellow to gold)
    padding: '10px',
    width: '160px', 
    color: '#000'
  };
  
  const dropdownItemStyle = {
    background: 'linear-gradient(to right, #FFFF00, #FFD700)', // Gradient color for the dropdown item list (yellow to gold)
    marginTop: '20px',
    color: '#fff', 
  };
  
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/seller-login');
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/seller-login');
  };

  if (!isLoggedIn) return null;

  return (
      <nav className="bg-yellow-500 p-2">
        <div className="max-w-8xl flex items-center justify-between">
          <Link to="/dashboard" className="ml-8 text-white text-2xl font-bold">
            BidsB2C Seller
          </Link>
  
          <div className="flex items-center mr-8 mb-1">
            <Dropdown>
              <Dropdown.Toggle variant="outline-light" id="dropdown-basic" style={dropdownStyle}>
                Menu
              </Dropdown.Toggle>
  
              <Dropdown.Menu style={dropdownItemStyle}>
                <Dropdown.Item as={Link} to="/dashboard">Dashboard</Dropdown.Item>
                <Dropdown.Item as={Link} to="/profile">Account</Dropdown.Item>
                <Dropdown.Item as={Link} to="/add-product">Add Products</Dropdown.Item>
                <Dropdown.Item as={Link} to="/list-product">Your Products</Dropdown.Item>
                <Dropdown.Item as={Link} to="/orders">View Orders</Dropdown.Item>
                <Dropdown.Item as={Link} to="/returns">Returns</Dropdown.Item>
                <Dropdown.Item as={Link} to="/update-status">Update Status</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Sign Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </nav>
    );
  };

export default Navbar;