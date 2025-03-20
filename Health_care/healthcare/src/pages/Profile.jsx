import React, { useState } from 'react';
import { ethers } from 'ethers';
import contractAddresses from "../assets/deployed_addresses.json";
import HealthCareABI from "../assets/HealthCare.json";

const Profile = () => {
    const [id, setId] = useState('');
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    const provider = new ethers.BrowserProvider(window.ethereum); // Use Web3Provider
    const signer = provider.getSigner();
    const contractAddress = contractAddresses["HealthCareModule#HealthCare"];
    const contract = new ethers.Contract(contractAddress, HealthCareABI.abi, signer);

    const handleSearch = async () => {
        if (!id) {
            setError('Please enter an ID');
            return;
        }
        try {
            const [name, age, disease, hospital] = await contract.getProfileById(id);
            setProfile({
                name,
                age,
                disease,
                hospital
            });
            setError('');
        } catch (err) {
            setError('Profile not found or error fetching data');
            setProfile(null);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-1/3 bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold text-center text-green-600 mb-4">Get your details with your ID</h2>
                <input
                    type="text"
                    placeholder="Enter ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                    onClick={handleSearch}
                    className="w-full p-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                >
                    Search
                </button>
                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            </div>
            <div className="w-2/3 p-6 bg-white shadow-md rounded-lg ml-4">
                {profile ? (
                    <div>
                        <h3 className="text-xl font-semibold text-blue-600 mb-4">Profile Details</h3>
                        <p className="text-lg"><strong>Name:</strong> {profile.name}</p>
                        <p className="text-lg"><strong>Age:</strong> {profile.age}</p>
                        <p className="text-lg"><strong>Disease:</strong> {profile.disease}</p>
                        <p className="text-lg"><strong>Hospital:</strong> {profile.hospital}</p>
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No profile found. Please search by ID.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
