import React from "react";
import { useNavigate } from "react-router-dom";
import doctor from '../assets/images/docter.jpg';
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <>
      {/* Branding on Top Left */}
      <div style={{ 
        position: "absolute", 
        top: "20px", 
        left: "0px", 
        width: "100%",
        fontSize: "4rem", 
        fontWeight: "bold", 
        color: "white", 
        background: "green", 
        textAlign: "left",
        padding: "10px 80px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span>NeuroMed</span>
        <button 
          style={{ 
            backgroundColor: "white", 
            color: "green", 
            padding: "10px 20px", 
            border: "none", 
            borderRadius: "5px", 
            fontSize: "1rem", 
            cursor: "pointer",
            marginRight: "50px"
          }}
          onClick={() => navigate('/signup')} // Navigate to Signup page
        >
          Signup
        </button>
      </div>

      {/* Main Section */}
      <div style={{ backgroundColor: "#f5fdf6", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
        <div style={{ display: "flex", maxWidth: "1200px", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Left Side - Text Content */}
          <div style={{ maxWidth: "50%" }}>
            <h1 style={{ color: "#1b5e20", fontSize: "2.5rem" }}>
              Get Quick <br /> <strong>Medical Services</strong>
            </h1>
            <p style={{ color: "#555", fontSize: "1rem", lineHeight: "1.6" }}>
              Lorem ipsum is simply dummy text of the printing and typesetting industry.
              It has survived not only five centuries but also the leap into electronic typesetting.
            </p>
            <button 
              style={{ 
                backgroundColor: "#1b5e20", 
                color: "white", 
                padding: "10px 20px", 
                border: "none", 
                borderRadius: "5px", 
                fontSize: "1rem", 
                cursor: "pointer", 
                marginTop: "15px" 
              }}
              onClick={() => navigate('/login')} // Navigate to Login page
            >
              Login
            </button>
          </div>
          
          {/* Right Side - Doctor Image */}
          <div style={{ maxWidth: "50%", display: "flex", justifyContent: "center" }}>
            <img src={doctor} alt="Doctor" style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }} />
          </div>
        </div>
      </div>

      {/* New Services Section */}
      <div style={{ backgroundColor: "white", padding: "50px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", color: "#1b5e20", marginBottom: "20px" }}>Our Services</h2>
        <p style={{ fontSize: "1rem", color: "#555", maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis venenatis, nulla non interdum tincidunt, augue massa
          sodales elit, ut vehicula risus ligula a massa. Proin eget nulla ut sapien consectetur tincidunt.
        </p>
      </div>
    </>
  );
};

export default Home;
