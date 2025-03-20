import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import HealthCareABI from "../assets/HealthCare.json";
import contractAddresses from "../assets/deployed_addresses.json";

const Signup = () => {
  const [userType, setUserType] = useState("hospital");
  const [formData, setFormData] = useState({});
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    connectToMetamask();
  }, []);

  async function connectToMetamask() {
    try {
      if (!window.ethereum) throw new Error("MetaMask not detected!");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Failed to connect to MetaMask.");
    }
  }

  async function registerUser() {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = contractAddresses["HealthCareModule#HealthCare"];
      const contract = new ethers.Contract(contractAddress, HealthCareABI.abi, signer);

      let tx;
      if (userType === "hospital") {
        tx = await contract.registerHospital(
          formData.encryptedName,
          formData.encryptedEmail,
          formData.encryptedPhone,
          formData.encryptedAddress,
          formData.encryptedRegNumber,
          formData.encryptedAdminName
        );
        
      } else {
        tx = await contract.registerPerson(
          formData.encryptedName,
          formData.encryptedEmail,
          formData.encryptedPhone,
          formData.encryptedAddress,
          formData.sex
        );
      }

      await tx.wait();
      alert("Registration successful!");
      navigate("/Login");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed.");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl flex">
        <div className="w-2/3 p-6">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Signup</h2>
          <button onClick={connectToMetamask} className="bg-gray-500 text-white py-2 px-4 rounded mb-4 w-full">
            {walletAddress ? `Connected: ${walletAddress}` : "Connect Wallet"}
          </button>
          <form className="space-y-4">
  <select
    className="input-field"
    value={userType}
    onChange={(e) => setUserType(e.target.value)}
  >
    <option value="hospital">Hospital</option>
    <option value="person">Person</option>
  </select>

  <input type="text" placeholder="Name" className="input-field" onChange={(e) => setFormData({ ...formData, encryptedName: e.target.value })} />
  <input type="email" placeholder="Email" className="input-field" onChange={(e) => setFormData({ ...formData, encryptedEmail: e.target.value })} />
  <input type="text" placeholder="Phone" className="input-field" onChange={(e) => setFormData({ ...formData, encryptedPhone: e.target.value })} />
  <input type="text" placeholder="Address" className="input-field" onChange={(e) => setFormData({ ...formData, encryptedAddress: e.target.value })} />

  {userType === "hospital" && (
    <>
      <input type="text" placeholder="Registration Number" className="input-field" onChange={(e) => setFormData({ ...formData, encryptedRegNumber: e.target.value })} />
      <input type="text" placeholder="Admin Name" className="input-field" onChange={(e) => setFormData({ ...formData, encryptedAdminName: e.target.value })} />
    </>
  )}

  {userType === "person" && (
    <select className="input-field" onChange={(e) => setFormData({ ...formData, sex: e.target.value })}>
      <option value="0">Male</option>
      <option value="1">Female</option>
      <option value="2">Other</option>
    </select>
  )}

  <button type="button" onClick={registerUser} className="bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-green-700">
    Signup
  </button>
</form>

        </div>
      </div>
    </div>
  );
};

export default Signup;
