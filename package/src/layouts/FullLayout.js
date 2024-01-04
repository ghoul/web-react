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
  const { isLoggedIn } = useAuth();
  return (
    <main >  
      {/* style={{ backgroundColor: "black" }} */}
      {/********header**********/}
      <Header />
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        {isLoggedIn && (<aside className="sidebarArea shadow" id="sidebarArea" >
          <Sidebar />
        </aside>)
}
        {/********Content Area**********/}
        <div className="contentArea">
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
