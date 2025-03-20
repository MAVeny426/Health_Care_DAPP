import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import doctor from "../assets/images/docter.jpg";
import Navbar from "../components/Navbar";

const MainHome = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const [userType, setUserType] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    const storedWalletAddress = localStorage.getItem("walletAddress");
  
    console.log("Stored UserType:", storedUserType);
    console.log("Stored Wallet Address:", storedWalletAddress);
  
    if (storedUserType) setUserType(storedUserType);
    if (storedWalletAddress) setWalletAddress(storedWalletAddress);
  }, [location]);
  
  return (
    <>
      {/* Branding and Navbar Section */}
      <div style={{ 
        position: "absolute", 
        top: "20px", 
        left: "0px", 
        width: "100%",
        fontSize: "2.5rem", 
        fontWeight: "bold", 
        color: "white", 
        background: "green", 
        textAlign: "left",
        padding: "10px 50px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span>NeuroMed</span>
        
        {/* Navbar and Wallet Address Display */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {userType && <Navbar userType={userType} />}
          {walletAddress && (
            <span style={{
              fontSize: "1rem", 
              background: "#fff",
              color: "green",
              padding: "5px 10px",
              borderRadius: "5px",
              fontWeight: "bold"
            }}>
              {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
            </span>
          )}
        </div>
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
          </div>
          
          {/* Right Side - Doctor Image */}
          <div style={{ maxWidth: "50%", display: "flex", justifyContent: "center" }}>
            <img src={doctor} alt="Doctor" style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }} />
          </div>
        </div>
      </div>

      {/* Services Section */}
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

export default MainHome;
