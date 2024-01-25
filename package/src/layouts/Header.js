import React, { useState, useEffect }  from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import { ReactComponent as LogoWhite } from "../assets/images/logos/materialprowhite.svg";
import user1 from "../assets/images/users/smile.png";
import logo from "../assets/images/logos/goose.png";
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from './config';

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [categories, setCategories] = useState([]);
  const navigate  = useNavigate();

  let admin = localStorage.getItem('admin');
  admin = admin === 'true';
  let token = localStorage.getItem('token'); 
  let logged = localStorage.getItem('token') != null;


  // const fetchCategories = async () => {
  //   try {
  //     const response = await fetch(`${BACKEND_URL}/categories/', {
  //       method: 'GET',  // Specify the GET method
  //       headers: {
  //         'Authorization' : `${token}`,
  //         'Content-Type': 'application/json',  // Specify the content type if required
  //       },
  //     });
  //     const data = await response.json();
  //     console.log("categories: " + data);
  //     setCategories(data);
  //   } catch (error) {
  //     console.error('Error fetching categories:', error);
  //   }
  // };
  

  // useEffect(() => {
  //   // Fetch categories initially
  //   fetchCategories();

  //   // Fetch categories every 5 seconds (for example)
  //   const intervalId = setInterval(() => {
  //     fetchCategories();
  //   }, 6000); // 5000 milliseconds = 5 seconds

  //   // Clean up the interval when the component is unmounted or dependencies change
  //   return () => clearInterval(intervalId);
  // }, []); // Run the effect only once after the initial render


  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all items from localStorage
    navigate('/login');
    
  };

  return (
<Navbar style={{ backgroundColor: '#98d3de', width: 'fit-content', height: 'fit-content' }} className="fix-header justify-content-center">
  <NavbarBrand href="/" className="mx-auto">
    <img src={logo} alt="logo" style={{ width: '100%' }} />
  </NavbarBrand>
  {/* <Button color="primary" className="d-lg-none" onClick={() => showMobilemenu()}>
    <i className="bi bi-list"></i>
  </Button> */}
  {!logged && (
    <>
      <NavItem>
        <Link to="/login" className="nav-link" style={{ color: 'white' }}>
          Prisijungti   | 
        </Link>
      </NavItem>
      {/* <span style={{ color: 'white', margin: '0 10px' }}>|</span> */}
      <NavItem>
        <Link to="/signup" className="nav-link" style={{ color: 'white' }}>
          |   Registruotis
        </Link>
      </NavItem>
    </>
  )}
</Navbar>
  );
  }

//   return (
//     <Navbar style={{ backgroundColor: '#181A1F' }} dark expand="md" className="fix-header">
//       <div className="d-flex align-items-center">
//         <NavbarBrand href="/">
//           <img
//               src={logo}
//               alt="logo"
//               width="70"
//             ></img>
//         </NavbarBrand>
//         <Button
//           color="primary"
//           className=" d-lg-none"
//           onClick={() => showMobilemenu()} //todo
//         >
//           <i className="bi bi-list"></i>
//         </Button>
//       </div>
//       {/* <div className="hstack gap-2">
//         <Button
//           color="primary"
//           size="sm"
//           className="d-sm-block d-md-none"
//           onClick={Handletoggle}
//         >
//           {isOpen ? (
//             <i className="bi bi-x"></i>
//           ) : (
//             <i className="bi bi-three-dots-vertical" ></i>
//           )}
//         </Button>
//           </div>*/}

//       {/* <Collapse navbar isOpen={isOpen}> */}
//         {/*<Nav className="me-auto" navbar>
          
//           <NavItem style={{'marginLeft':'28px'}}>
//             <Link to="/about" className="nav-link" style={{ color: 'white' }}>
//               Apie
//             </Link>
//           </NavItem>
//           {logged && (<UncontrolledDropdown inNavbar nav >
//             <DropdownToggle caret nav style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
//             {admin ? (
//             <Link to={`/categories`} className="nav-link custom-link" style={{ color: 'white', padding: '0', margin: '0' }}>
//               Kategorijos
//             </Link>
//             ) : (
//             <span style={{ color: 'white' }}>Kategorijos</span>
//             )}
//             </DropdownToggle>
//             <DropdownMenu end>
//               {categories.map((category) => (
//                 <DropdownItem key={category.id}>
//                   <Link to={`/category/${category.type}`} className="nav-link" style={{ color: 'black' }}>
//                     {category.type}
//                   </Link>
//                 </DropdownItem>
//               ))}
//             </DropdownMenu>
//           </UncontrolledDropdown>
//           )}
//         {admin && (
//         <NavItem>
//           <Link to="/trick/create" className="nav-link" style={{ color: 'white' }}>
//             Pridėti triuką
//           </Link>
//         </NavItem>
//       )}
//       {!logged && (
//           <NavItem>
//             <Link to="/login" className="nav-link" style={{ color: 'white' }}>
//               Prisijungti
//             </Link>
//           </NavItem>
//       )}
//           {/* <NavItem>
//             <Link to="/signup" className="nav-link" style={{ color: 'black' }}>
//               Registruotis
//             </Link>
//       </NavItem> 
//       </Nav>*/}
//         {/* {logged && (
//           <Dropdown isOpen={dropdownOpen} toggle={toggle}>
//           <DropdownToggle color="transparent">
//             <img
//               src={user1}
//               alt="profile"
//               className="rounded-circle"
//               width="50"
//               height="50"
//             ></img>
//           </DropdownToggle>
//           <DropdownMenu>
//             <DropdownItem header>Nustatymai</DropdownItem>
//             {/* <DropdownItem>Profilis</DropdownItem>
//             <DropdownItem divider />
//             <DropdownItem onClick={handleLogout}>Atsijungti</DropdownItem>
//           </DropdownMenu>
//         </Dropdown>
//         )}
//       </Collapse>*/}
//     </Navbar> 
//   );
// };

export default Header;
