import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Container } from "reactstrap";
import { useState } from "react";
import { useAuth } from '../views/AuthContext';
import "./Sidebar.css"

const FullLayout = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  const toggleMobileMenu = () => {
    if (window.innerWidth < 1000) {
      setMobileMenuOpen(!isMobileMenuOpen);
    }
  };
  return (
    <main >  
      <Header onToggleMobileMenu={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
      <div className="pageWrapper d-lg-flex">
        {isLoggedIn && (
          <aside className={`sidebarArea shadow ${isMobileMenuOpen ? 'showSidebar' : ''}`}>
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} />
          </aside>
        )}
        <div className={`contentArea`} style={{ zIndex: 900 }}>
          <Container className="p-4" fluid>
            <Outlet />
          </Container>
        </div>
      </div>
      <Footer/>
    </main>
  );
};

export default FullLayout;
