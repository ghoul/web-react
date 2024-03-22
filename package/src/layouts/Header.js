import React, { useState, useEffect }  from "react";
import { useNavigate } from "react-router-dom";
import {Navbar, NavbarBrand, Button} 
from "reactstrap";
import logo from "../assets/images/logos/goose.png";
import './Sidebar.css'
import Cookies from "js-cookie";

const Header = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const token = Cookies.get('token');
  let logged = token != null;
  const navigate = useNavigate();

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!logged) {
      navigate("/login");
    }
  }, [logged, navigate]);

  return (
<Navbar style={{ backgroundColor: '#98d3de', width: 'fit-content', height: 'fit-content' }} className="fix-header justify-content-center">
  <NavbarBrand href="/" className="mx-auto">
    <img src={logo} alt="logo" style={{ width: '100%' }} />
  </NavbarBrand>
      {isSmallScreen && (
        <Button className="mobileMenuButton" style={{ backgroundColor: "#bf1a2f", color: "white", border: "none" }} onClick={onToggleMobileMenu}>        
        {isMobileMenuOpen ? <i class="bi bi-x-lg"></i> : <i className="bi bi-list"></i>}
      </Button>
    )}
</Navbar>
  );
}

export default Header;
