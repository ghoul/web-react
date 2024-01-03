import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import user2 from "../assets/images/users/msgoose.png";
import user1 from "../assets/images/users/mrgoose.png";
import probg from "../assets/images/bg/fonas2.png";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const navigation = [
  {
    title: "Pagrindinis",
    href: "/",
    icon: "bi bi-speedometer2",
  },
  //TODO: ADMIN DALYKAI
//   {
//     title: "Mokytojai",
//     href: "/alerts",
//     icon: "bi bi-bell",
//   },
//   {
//     title: "Mokiniai",
//     href: "/badges",
//     icon: "bi bi-patch-check",
//   },
//   {
//     title: "Mokyklos",
//     href: "/buttons",
//     icon: "bi bi-hdd-stack",
//   },
//   {
//     title: "Cards",
//     href: "/cards",
//     icon: "bi bi-card-text",
 // },
//  {
//     title: "Aktyvūs namų darbai", //->>>> Pagrindinis
//     href: "/grid",
//     icon: "bi bi-columns",
//   },
  {
    title: "Namų darbai",
    href: "/all-homework",
    icon: "bi bi-book",
  },
  {
    title: "Klasės",
    href: "/all-classes",
    icon: "bi bi-123",
  },
  {
    title: "Mokiniai",
    href: "/all-students",
    icon: "bi bi-people",
  },
  {
    title: "Mokytojai",
    href: "/all-teachers",
    icon: "bi bi-people",
  },
  {
    title: "Mokykla",
    href: "/breadcrumbs",
    icon: "bi bi-building",
  },
  {
    title: "Profilis",
    href: "/profile",
    icon: "bi bi-person-circle",
  }
];

const Sidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();
  let token = localStorage.getItem('token');
  let name = "";
  let user;
let surname="";
let gender = 0;
  if(token!=null) {
    const decodedToken = jwtDecode(token);
    name = decodedToken.name;
    surname = decodedToken.surname;
    gender = decodedToken.gender;
    if(gender==="1")
    {
      user = user1;
    }
    else user = user2;
  }


  const navigate  = useNavigate();
  const handleLogout = () => {
    localStorage.clear(); // Clear all items from localStorage
    navigate('/login');
    
  };
  return (
    <div>
      {/* <div className="d-flex align-items-center"></div>
      <div
        className="profilebg"
        style={{ background: `url(${probg}) no-repeat`, backgroundSize: 'cover',width: '250px', // Set a fixed width
        height: '250px'}} // Add this line }}
      >
        <div className="p-3 d-flex">
           <img src={user1} alt="user" width="50" className="rounded-circle" /> 
          <img src={user1} alt="user" className="position-absolute" style={{ width: '100px', height: 'auto' }} />
          <Button
            color="white"
            className="ms-auto text-white d-lg-none"
            onClick={() => showMobilemenu()}
          >
            <i className="bi bi-x"></i>
          </Button>
        </div>
        
        <div className="bg-dark text-white p-2 opacity-75 mt-auto">{name} {surname}</div> 
      </div> */}
      <div className="d-flex flex-column position-relative">
    <div
      className="profilebg position-relative"
      style={{
        background: `url(${probg}) no-repeat`,
        backgroundSize: 'cover',
        width: '240px', // Set a fixed width
        height: '240px', // Set a fixed height
      }}
    >
      <div className="d-flex align-items-center justify-content-center position-absolute top-50 start-50 translate-middle">
        <img src={user} alt="user" className="rounded-circle" width="150" style={{ marginTop: '-30px' }}/>
      </div>
      <div className="bg-dark text-white p-2 position-absolute bottom-0 start-0 w-100" style={{ opacity: '0.8' }}>
  {name} {surname}
</div>
    </div>
    </div>
      {/* <div className="p-3 mt-2">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <Link
                to={navi.href}
                className={
                  location.pathname === navi.href
                    ? "active nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </Link>
            </NavItem>
          ))}
          <Button
            color="danger"
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
      <div className="p-3 ">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
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
    </div>
  );
};

export default Sidebar;
