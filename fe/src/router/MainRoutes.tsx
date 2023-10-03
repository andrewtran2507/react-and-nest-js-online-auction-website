import React from "react";
import { Routes, Route } from "react-router-dom";

const Login = React.lazy(() => import("pages/Login"));
const Register = React.lazy(()=>import("pages/Register"));
const Home = React.lazy(()=> import("pages/Home"));
const Item = React.lazy(()=> import("pages/Item"));

const MainRoutes = () => {
  return (
    <React.Suspense fallback={<span>Loading</span>}>
      <Routes>
        <Route path="*" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/item" element={<Item />} />
      </Routes>
    </React.Suspense>
  );
};

export default MainRoutes;
