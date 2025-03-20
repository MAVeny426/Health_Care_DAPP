import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ userType }) => {
  return (
    <nav className="p-2 text-gray-800">
      <div className="container mx-auto flex justify-between items-center">

        {userType === "hospital" ? (
          <div className="space-x-3 text-xl text-white">
            <Link to="/MainHome" className="hover:underline">Dashboard</Link>
            <Link to="/AddPatient" className="hover:underline">Add Patient</Link>
            <Link to="/PatientDetails" className="hover:underline">Patient Details</Link>
            <Link to="/" className="hover:underline">Logout</Link>
          </div>
        ) : userType === "person" ? (
          <div className="space-x-3 text-2xl text-white">
            <Link to="/MainHome" className="hover:underline">Dashboard</Link>
            <Link to="/profile" className="hover:underline">Profile</Link>
            <Link to="/" className="hover:underline">Logout</Link>
            
          </div>
        ) : (
          <div className="text-sm">
            <Link to="/" className="hover:underline">Logout</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
