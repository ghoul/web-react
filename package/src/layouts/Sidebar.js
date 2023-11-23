import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import user1 from "../assets/images/users/user4.jpg";
import probg from "../assets/images/bg/download.jpg";
import { useNavigate } from 'react-router-dom';
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
    icon: "bi bi-columns",
  },
  {
    title: "Klasės",
    href: "/all-classes",
    icon: "bi bi-layout-split",
  },
  {
    title: "Mokiniai",
    href: "/all-students",
    icon: "bi bi-textarea-resize",
  },
  {
    title: "Mokytojai",
    href: "/all-teachers",
    icon: "bi bi-textarea-resize",
  },
  {
    title: "Mokykla",
    href: "/breadcrumbs",
    icon: "bi bi-link",
  },
  {
    title: "Profilis",
    href: "/about",
    icon: "bi bi-people",
  },
  // {
  //   title: "Atsijungti",
  //   href: "/login",
  //   icon: "bi bi-people",
  // },
];

const Sidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();
  const navigate  = useNavigate();
  const handleLogout = () => {
    localStorage.clear(); // Clear all items from localStorage
    navigate('/login');
    
  };
  return (
    <div>
      <div className="d-flex align-items-center"></div>
      <div
        className="profilebg"
        style={{ background: `url(${probg}) no-repeat` }}
      >
        <div className="p-3 d-flex">
          <img src={user1} alt="user" width="50" className="rounded-circle" />
          <Button
            color="white"
            className="ms-auto text-white d-lg-none"
            onClick={() => showMobilemenu()}
          >
            <i className="bi bi-x"></i>
          </Button>
        </div>
        <div className="bg-dark text-white p-2 opacity-75">Steave Rojer</div>
      </div>
      <div className="p-3 mt-2">
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
    </div>
  );
};

export default Sidebar;
