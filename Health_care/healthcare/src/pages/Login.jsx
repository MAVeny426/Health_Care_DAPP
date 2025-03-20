import React, { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import HealthCareABI from "../assets/HealthCare.json";
import contractAddresses from "../assets/deployed_addresses.json";

const Login = ({ setUserType }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();

  async function connectToMetamask() {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed. Please install MetaMask and try again.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      localStorage.setItem("walletAddress", address); // Store wallet address
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Failed to connect to MetaMask.");
    }
  }

  const checkRegistration = async () => {
    let address = walletAddress || localStorage.getItem("walletAddress");
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = contractAddresses["HealthCareModule#HealthCare"];
      const contract = new ethers.Contract(contractAddress, HealthCareABI.abi, signer);
  
      // Check the userType mapping
      const userTypeEnum = await contract.userTypes(address);
      console.log("User Type Enum:", userTypeEnum.toString());
  
      if (userTypeEnum.toString() === "0") {
        alert("Wallet not registered.");
        return;
      }
  
      // Convert userTypeEnum to a meaningful string
      const userType = userTypeEnum.toString() === "1" ? "hospital" : "person";
  
      // Store userType and walletAddress
      setUserType(userType);
      localStorage.setItem("userType", userType);
      localStorage.setItem("walletAddress", address);
  
      alert(`Login successful! You are logged in as ${userType} with wallet ${address}`);
  
      // Navigate to MainHome after a short delay
      setTimeout(() => {
        navigate("/MainHome", { replace: true });
      }, 200);
      
    } catch (error) {
      console.error("Error checking registration:", error);
      alert("Login failed.");
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      {/* Back Button */}
      <button 
        className="absolute top-4 left-4 text-green-600 hover:text-green-800 transition duration-300" 
        onClick={() => navigate("/Home")}
      >
        <FaArrowLeft size={24} />
      </button>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-green-600 text-4xl font-bold mb-6">Login</h2>

        <button 
          onClick={connectToMetamask} 
          className="w-full bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded mb-4 transition duration-300"
        >
          {walletAddress ? `Connected: ${walletAddress}` : "Connect Wallet"}
        </button>

        <button 
          onClick={checkRegistration} 
          className="w-full bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
