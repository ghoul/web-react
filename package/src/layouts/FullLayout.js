import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Container } from "reactstrap";

const FullLayout = () => {
  let token = localStorage.getItem('token') != null;

  return (
    <main >  
      {/* style={{ backgroundColor: "black" }} */}
      {/********header**********/}
      <Header />
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        {token && (<aside className="sidebarArea shadow" id="sidebarArea" >
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
