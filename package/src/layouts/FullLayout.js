import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Container } from "reactstrap";
import { useState, useEffect } from "react";
// import CheckToken from "../views/CheckToken";
import { useAuth } from '../views/AuthContext';

const FullLayout = () => {
  // const [token, setToken] = useState(localStorage.getItem('token') != null);

  // useEffect(() => {
  //   // Update token state when 'token' in localStorage changes
  //   const checkToken = () => {
  //     setToken(localStorage.getItem('token') != null);
  //     console.log("token");
  //   };

  //   window.addEventListener("storage", checkToken);

  //   return () => {
  //     window.removeEventListener("storage", checkToken);
  //   };
  // }, []);

  // // let token = localStorage.getItem('token') != null;
  //  console.log("token");
  //const token = CheckToken();
  // const { isLoggedIn } = useAuth();
  // const [isSidebarOpen, setSidebarOpen] = useState(false);
  // const [isSidebarOpen, setSidebarOpen] = useState(false);
  // const toggleSidebar = () => {
  //   setSidebarOpen(!isSidebarOpen);
  // };
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  // Function to toggle mobile menu visibility
  const toggleMobileMenu = () => {
    if (window.innerWidth < 1000) {
      console.log("butto appear <1000");
      setMobileMenuOpen(!isMobileMenuOpen);
    }
  };
  return (
    <main >  
      {/* style={{ backgroundColor: "black" }} */}
      {/********header**********/}
      <Header onToggleMobileMenu={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} /> {/* Pass isMobileMenuOpen state and toggleMobileMenu function as props */}
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        {isLoggedIn && (
          <aside className={`sidebarArea shadow ${isMobileMenuOpen ? 'showSidebar' : ''}`}>
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} />
          </aside>
        )}
        {/********Content Area**********/}
        {/* <div className="contentArea" style={{ zIndex: 1 }}> */}
        <div className={`contentArea ${isMobileMenuOpen ? 'overlay' : ''}`} style={{ zIndex: 900 }}>
          {/********Middle Content**********/}
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
