import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import user2 from "../assets/images/users/msgoose.png";
import user1 from "../assets/images/users/mrgoose.png";
import probg from "../assets/images/bg/fonas2.png";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
// import CheckToken from "../views/CheckToken";
import { useAuth } from '../views/AuthContext';
import {useState} from 'react'
import './Sidebar.css'
const navigation = [
  {
    title: "Pagrindinis",
    href: "/",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Lyderių lentelė",
    href: "/podium",
    icon: "bi bi-trophy-fill",
  },
  //TODO: ADMIN DALYKAI

  {
    title: "Namų darbai",
    href: "/all-homework",
    icon: "bi bi-book",
  },
  {
    title: "Užbaigti namų darbai",
    href: "/finished-assignments",
    icon: "bi bi-bookmark-check",
  },
  {
    title: "Profilis",
    href: "/profile",
    icon: "bi bi-person-circle",
  },
  {
    title: "school",
    href: "/add-school",
    icon: "bi bi-person-circle",
  }
];

const Sidebar = ({ isMobileMenuOpen }) => {
  //const { handleLogoutt } = CheckToken();
  const { logout } = useAuth();
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  // const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // const toggleMobileMenu = () => {
  //   setMobileMenuOpen(!isMobileMenuOpen);
  // };

  let location = useLocation();
  let token = localStorage.getItem('token');
  let name = "";
  let user;
let surname="";
let gender = 0;
let role = "";
  if(token!=null) {
    const decodedToken = jwtDecode(token);
    name = decodedToken.name;
    surname = decodedToken.surname;
    role = decodedToken.role;
    console.log("role:) :   " + role);
    gender = decodedToken.gender;
    if(gender===1)
    {
      user = user1;
    }
    else user = user2;
  }

  const filteredNavigation = navigation.filter((navItem) => {
    if (role === 2) {
      return (
        // navItem.title !== "Mokytojai" &&
        navItem.title !== "Lyderių lentelė"
      );
    } else if (role === 1) {
      return (
        // navItem.title !== "Mokiniai" &&
        // navItem.title !== "Klasės" &&
        navItem.title !== "Namų darbai"
      );
    }
    return true;
  });
  

  const navigate  = useNavigate();
  const handleLogout = () => {
    localStorage.clear(); // Clear all items from localStorage
   // handleLogoutt(null);
    logout();
    navigate('/login');
    
  };


  return (
    <div className={`sidebarWrapper ${isMobileMenuOpen ? 'mobileMenuOpen' : ''}`}>
      {/* <Button className="mobileMenuButton" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
      </Button> */}
       
      <div className="d-flex flex-column position-relative">
        <div className="profilebg position-relative" 
        style={{
      background: `url(${probg}) no-repeat` ,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '250px', // Set a fixed width
      height: '250px', // Set a fixed height
      position: 'relative', // Add this line to make sure the position is relative
      }}>
          <div className="d-flex align-items-center justify-content-center position-absolute top-50 start-50 translate-middle">
      <img src={user} alt="user" className="rounded-circle" width="170" style={{ marginTop: '-30px' }} />
    </div>
          <div className="bg-dark text-white p-2 position-absolute bottom-0 start-0 w-100" style={{ opacity: '0.8' }}>
            {name} {surname}
          </div>
        </div>
      </div>
      <div className="p-3">
        <Nav vertical className="sidebarNav">
          {filteredNavigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <Link
                to={navi.href}
                className={location.pathname === navi.href ? 'active nav-link py-3' : 'nav-link text-secondary py-3'}
                style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}
              >
                <i className={navi.icon} style={{ marginRight: '10px', fontSize: '1.2em' }}></i>
                <span className="d-inline-block">{navi.title}</span>
              </Link>
            </NavItem>
          ))}
          <Button
            style={{ backgroundColor: '#bf1a2f', border: 'none' }}
            tag="a"
            target="_blank"
            className="mt-3"
            onClick={handleLogout}
          >
            Atsijungti
          </Button>
        </Nav>
      </div>
    </div>
  );
};

{/* <div className={`sidebarWrapper ${isMobileMenuOpen ? 'mobileMenuOpen' : ''}`}>
  
<div className="d-flex flex-column position-relative">
<Button className="mobileMenuButton" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
      </Button>
  <div
    className="profilebg position-relative"
    style={{
      background: `url(${probg}) no-repeat`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '250px', // Set a fixed width
      height: '250px', // Set a fixed height
      position: 'relative', // Add this line to make sure the position is relative
    }}
  >
    <div className="d-flex align-items-center justify-content-center position-absolute top-50 start-50 translate-middle">
      <img src={user} alt="user" className="rounded-circle" width="150" style={{ marginTop: '-30px' }} />
    </div>
    <div className="bg-dark text-white p-2 position-absolute bottom-0 start-0 w-100" style={{ opacity: '0.8' }}>
      {name} {surname}
    </div>
  </div>
</div>
<div className="p-3">
  <Nav vertical className="sidebarNav">
    {filteredNavigation.map((navi, index) => (
      <NavItem key={index} className="sidenav-bg">
        <Link
          to={navi.href}
          className={
            location.pathname === navi.href
              ? 'active nav-link py-3'
              : 'nav-link text-secondary py-3'
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          <i
            className={navi.icon}
            style={{ marginRight: '10px', fontSize: '1.2em' }}
          ></i>
          <span className="d-inline-block">{navi.title}</span>
        </Link>
      </NavItem>
    ))}
    <Button
      style={{ backgroundColor: '#bf1a2f', border: 'none' }}
      tag="a"
      target="_blank"
      className="mt-3"
      onClick={handleLogout}
    >
      Atsijungti
    </Button>
  </Nav>
</div>
</div> */}

//   );
// };


export default Sidebar;
