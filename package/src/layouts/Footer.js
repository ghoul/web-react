import React from "react";
import "./font.css";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#181A1F', color: 'white', padding: '20px 0' }}>
      <div className="container">
        <div className="row">
        <div className="col-md-6 text-center">
            <h6>Susisiekite su mumis</h6>
            <p>
              <span>el. paštas: yoyo@gmail.com</span> | 
              <span> tel. nr.: +868686866</span>
            </p>
        </div>
          <div className="col-md-6 text-center">
            <h6>Mus galite rasti</h6>
            <p>
              <span>Facebook "Yoyo meistrai"</span> | 
              <span> Instagram @yoyo_meistrai</span>
            </p>
          </div>
          <div className="col-md-12">
            <p className="text-center antiqua">&copy; {new Date().getFullYear()} Yoyo meistrai</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
