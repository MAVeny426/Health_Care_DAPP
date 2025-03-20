import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";
import contractAddresses from "../assets/deployed_addresses.json";
import HealthCareABI from "../assets/HealthCare.json";

const AddPatient = ({ userType }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const storedWallet = localStorage.getItem("walletAddress");
    if (storedWallet) {
      setWalletAddress(storedWallet);
    }
  }, []);

  const [form, setForm] = useState({
    name: "",
    dob: "",
    age: "",
    sex: "Male",
    email: "",
    address: "",
    cellPhone: "",
    workPhone: "",
    doctorName: "",
    appointmentReason: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  // Upload patient details to IPFS and get the hash
  async function uploadToIPFS(form) {
    // This function will handle IPFS upload and return the IPFS hash.
    // You can use Pinata or any other IPFS service for this.
    const ipfsHash = "sample-ipfs-hash";  // Replace this with actual IPFS hash
    return ipfsHash;
  }

  async function addPatientDetails() {
    if (!walletAddress) {
      alert("Wallet is not connected.");
      return;
    }
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = contractAddresses["HealthCareModule#HealthCare"];
      const contract = new ethers.Contract(contractAddress, HealthCareABI.abi, signer);
  
      // Check if user is a hospital
      const userType = await contract.getUserType(walletAddress);
      if (Number(userType) !== 1) { // 1 = Hospital
        alert("Access denied! Only hospitals can add patient details.");
        return;
      }
  
      // Upload patient data to IPFS
      const ipfsHash = await uploadToIPFS(form);
  
      // Send transaction to blockchain
      console.log("Sending transaction...");
      const tx = await contract.addPatientDetails(walletAddress, ipfsHash);
      
      setStatus("Transaction pending...");
      await tx.wait();
      
      setStatus("Patient details successfully added!");
      alert("Patient details stored on blockchain!");
  
      // Get transaction hash
      const txHash = tx.hash;
  
      // Save patient data to MongoDB
      await fetch("http://localhost:3001/patients/addPatient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, walletAddress, txHash, ipfsHash }),
      });
  
      alert("Patient details stored in MongoDB!");
    } catch (error) {
      console.error("Error:", error);
      alert("Submission failed: " + error.message);
    }
  }
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar userType={userType} />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-green-600 text-4xl font-bold text-center mb-6">Add Patient</h2>
          
          <p className="text-center text-gray-600 mb-4">
            Connected Wallet: <span className="text-green-600">{walletAddress || "Not connected"}</span>
          </p>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Patient Name" className="p-2 border rounded-md" onChange={handleChange} />
            <input type="date" name="dob" placeholder="Date of Birth" className="p-2 border rounded-md" onChange={handleChange} />
            <input type="number" name="age" placeholder="Age" className="p-2 border rounded-md" onChange={handleChange} />
            <select name="sex" className="p-2 border rounded-md" onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input type="email" name="email" placeholder="Email" className="p-2 border rounded-md" onChange={handleChange} />
            <input type="text" name="address" placeholder="Address" className="p-2 border rounded-md" onChange={handleChange} />
            <input type="text" name="cellPhone" placeholder="Cell Phone" className="p-2 border rounded-md" onChange={handleChange} />
            <input type="text" name="workPhone" placeholder="Work Phone" className="p-2 border rounded-md" onChange={handleChange} />
            <input type="text" name="doctorName" placeholder="Doctor's Name" className="p-2 border rounded-md" onChange={handleChange} />
            <input type="text" name="appointmentReason" placeholder="Appointment Reason" className="p-2 border rounded-md" onChange={handleChange} />
            <input type="text" name="emergencyContact" placeholder="Emergency Contact" className="p-2 border rounded-md" onChange={handleChange} />
            <input type="text" name="emergencyPhone" placeholder="Emergency Phone" className="p-2 border rounded-md" onChange={handleChange} />
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={addPatientDetails}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Add Patient
            </button>
          </div>

          <p className="text-center text-red-600 mt-4">{status}</p>
        </div>
      </div>
    </>
  );
};

export default AddPatient;
