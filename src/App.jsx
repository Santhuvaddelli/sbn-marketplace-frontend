import Header from "./components/Header";
import Categories from "./components/Categories";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import Member from "./components/member";
import ProductPage from "./components/productPage";
import Login from "./components/login";
import SingleProductPage from "./components/SingleProductPage";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";

import LoggedInLayout from "./components/LoggedInLayout";
import Dashboard from "./components/Dashboard";
import AddProduct from "./components/AddProduct";
import MyProducts from "./components/MyProducts";
import Enquiries from "./components/Enquiries";
import MyProfile from "./components/MyProfile";


function App() {
  const location = useLocation();

  const isMemberPage = location.pathname === "/member";
  const isLoginPage = location.pathname === "/login";
  const isLoggedHomePage = location.pathname.startsWith("/home");

  return (
    <div className="page">
      {!isLoginPage && !isLoggedHomePage && <Header />}
      {!isMemberPage && !isLoginPage && !isLoggedHomePage && <Categories />}

      <div className="content">
        <Routes>
          {/* -------- PUBLIC ROUTES -------- */}
          <Route path="/" element={<Banner />} />
          <Route path="/member" element={<Member />} />
          <Route path="/login" element={<Login />} />

          <Route path="/products/:category/:item/:product" element={<ProductPage />} />
          <Route path="/products/:category/:item" element={<ProductPage />} />
          <Route path="/products/:category" element={<ProductPage />} />
          <Route path="/product/:slug" element={<SingleProductPage />} />

          {/* -------- LOGGED IN ROUTES -------- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<LoggedInLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="my-products" element={<MyProducts />} />
              <Route path="enquiries" element={<Enquiries />} />
              <Route path="my-profile" element={<MyProfile />} />
            </Route>
          </Route>
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />

      {!isLoginPage && !isLoggedHomePage && <Footer />}
    </div>
  );
}

export default App;
