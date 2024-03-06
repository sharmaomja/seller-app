import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { Dropdown } from 'react-bootstrap'; 
import logo from '../../../assets/logo2.png'

const Navbar = () => {
  const dropdownStyle = {
    background: 'linear-gradient(to right, #FFFF00, #FFD700)', 
    padding: '10px',
    width: '160px', 
    color: '#000'
  };
  
  const dropdownItemStyle = {
    background: 'linear-gradient(to right, #FFFF00, #FFD700)', 
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
      <nav className="bg-yellow-400 p-2">
        <div className="max-w-8xl flex items-center justify-between">
        <Link to="/dashboard" className="ml-8 text-gray-600 text-2xl font-bold">
        <img src={logo} alt="Logo" className="h-12" /> {/* Use your logo here */}
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