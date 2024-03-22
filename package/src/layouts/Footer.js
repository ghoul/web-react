import React from "react";
import "./font.css";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#98d3de', color: 'black', paddingTop: '10px', fontFamily: 'Russo One, sans-serif'} }>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <p className="text-center Russo One, sans-serif">&copy; {new Date().getFullYear()} Goose </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
