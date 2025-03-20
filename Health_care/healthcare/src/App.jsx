import React , { useState } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import AddPatient from './pages/AddPatient';
import Signup from './pages/Signup'
import Login from './pages/Login';
import MainHome from './pages/MainHome';
import PatientDetails from './pages/PatientDetails';
import Profile from './pages/Profile';



const App = () => {
  const [userType, setUserType] = useState(null);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* A common layout with Navbar */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/AddPatient" element={<AddPatient userType={localStorage.getItem("userType")} />} />
          <Route path='/Signup' element={<Signup />} />
          <Route path='/Login' element={<Login setUserType={setUserType} />} />
          <Route path='/MainHome' element={<MainHome />} />
          <Route path='/PatientDetails' element={<PatientDetails />} />
          <Route path='/Profile' element={<Profile />} />

        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

// Layout component to wrap Navbar with routes
const Layout = () => (
  <div>
    {/* <Navbar /> */}
    {/* This will render the nested route component */}
    <Outlet />
  </div>
);

export default App;
