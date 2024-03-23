import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import user2 from "../assets/images/users/msgoose.png";
import user1 from "../assets/images/users/mrgoose.png";
import probg from "../assets/images/bg/fonas2.png";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../views/AuthContext';
import './Sidebar.css'
import Cookies from "js-cookie";

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
    title: "Mokyklų tvarkymas",
    href: "/manage-school",
    icon: "bi bi-person-circle",
  },
  {
    title: "Profilis",
    href: "/profile",
    icon: "bi bi-person-circle",
  }
];

const Sidebar = ({ isMobileMenuOpen }) => {
  const { logout } = useAuth();

  let location = useLocation();
  const userString = Cookies.get('user');
  var userData = userString ? JSON.parse(userString) : ''
  let name = "";
  let user = user1;
  let surname="";
  let gender = 0;
  let role = "";
  if(userData!=null) {
    name = userData.first_name;
    surname = userData.last_name;
    role = userData.role;
    gender = userData.gender;
    user = gender === 1 ? user1 : user2;
  }

  const filteredNavigation = navigation.filter((navItem) => {
    if (role === 3) { //admin
      return (
        navItem.title !== "Lyderių lentelė" &&
        navItem.title !== "Pagrindinis" &&
        navItem.title !== "Profilis" &&
        navItem.title !== "Užbaigti namų darbai" &&
        navItem.title !== "Namų darbai" 
      );
    }else if (role === 2) { //teacher
      return (
        navItem.title !== "Lyderių lentelė" &&
        navItem.title !== "Mokyklų tvarkymas"
      );
    } else if (role === 1) { //student
      return (
        navItem.title !== "Namų darbai" &&
        navItem.title !== "Mokyklų tvarkymas"
      );
    }
    return true;
  });
  

  const navigate  = useNavigate();
  const handleLogout = () => {
    localStorage.clear(); 
    logout();
    navigate('/login');
  };

  return (
    <div className={`sidebarWrapper ${isMobileMenuOpen ? 'mobileMenuOpen' : ''}`}>
      <div className="d-flex flex-column position-relative">
        <div className="profilebg position-relative" 
        style={{
      background: `url(${probg}) no-repeat` ,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '250px', 
      height: '250px', 
      position: 'relative',
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

export default Sidebar;
