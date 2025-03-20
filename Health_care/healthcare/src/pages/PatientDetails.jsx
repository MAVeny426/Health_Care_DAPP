import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";
import contractAddresses from "../assets/deployed_addresses.json";
import HealthCareABI from "../assets/HealthCare.json";

const PatientDetails = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 1 = Hospital, other values = Person
  const [searchId, setSearchId] = useState("");
  const [searchedPatient, setSearchedPatient] = useState(null);

  useEffect(() => {
    const storedWallet = localStorage.getItem("walletAddress");
    if (storedWallet) {
      setWalletAddress(storedWallet);
      fetchUserType(storedWallet);
    }
  }, []);

  useEffect(() => {
    if (walletAddress && userType === 1) {
      fetchAllPatients();
    }
  }, [walletAddress, userType]); // Wait until userType updates

  async function fetchUserType(wallet) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = contractAddresses["HealthCareModule#HealthCare"];
      const contract = new ethers.Contract(contractAddress, HealthCareABI.abi, signer);

      const type = await contract.getUserType(wallet); // Pass wallet instead of walletAddress
      setUserType(Number(type)); // 1 = Hospital, other values = Person
    } catch (error) {
      console.error("Error fetching user type:", error);
    }
  }

  async function fetchAllPatients() {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = contractAddresses["HealthCareModule#HealthCare"];
      const contract = new ethers.Contract(contractAddress, HealthCareABI.abi, signer);

      console.log("Fetching patient details from blockchain...");
      const patientData = await contract.getAllPatients();

      if (!patientData || patientData.length < 2) {
        console.warn("No patient data found.");
        setPatients([]);
        return;
      }

      const ids = patientData[0];
      const names = patientData[1];

      const formattedPatients = ids.map((id, index) => ({
        id: id.toString(),
        name: names[index],
      }));

      console.log("Fetched Patients:", formattedPatients);
      setPatients(formattedPatients);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      alert("Error fetching patient data: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    if (!searchId.trim()) return;
    const foundPatient = patients.find(patient => patient.id === searchId);
    setSearchedPatient(foundPatient || null);
  }

  return (
    <>
      <Navbar userType={userType} />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-green-600 text-4xl font-bold text-center w-full">
            Patient Details
          </h2>
        </div>

        {/* Search & Connected Account Section */}
        <div className="flex justify-end items-center mb-4 space-x-2">
          {userType === 1 && (
            <>
              <input
                type="text"
                placeholder="Search by ID"
                className="px-2 py-1 border rounded text-sm"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <button 
                onClick={handleSearch}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Search
              </button>
            </>
          )}
          <p className="text-gray-600 text-sm">
            Connected: <span className="text-green-600 font-semibold">{walletAddress || "Not connected"}</span>
          </p>
        </div>

        {/* Search Result */}
        {userType === 1 && searchedPatient && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-bold text-green-600">Search Result</h3>
            <p><strong>ID:</strong> {searchedPatient.id}</p>
            <p><strong>Name:</strong> {searchedPatient.name}</p>
          </div>
        )}

        {/* Patient List */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {loading ? (
            <p className="text-center text-gray-500">Loading patient data...</p>
          ) : patients.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  {userType === 1 && <th className="border border-gray-300 px-4 py-2 text-left">Patient ID</th>}
                  <th className="border border-gray-300 px-4 py-2 text-left">Patient Name</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-100">
                    {userType === 1 && <td className="border border-gray-300 px-4 py-2">{patient.id}</td>}
                    <td className="border border-gray-300 px-4 py-2">{patient.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No patient records found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientDetails;
