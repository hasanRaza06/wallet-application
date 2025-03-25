import React from "react";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentForm from "./components/payments/PaymenetForm";
import Success from "./components/payments/Success";
import Failure from "./components/payments/Failure";

const App = () => {
  return (
    <div className="bg-slate-200">
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/payment" element={<PaymentForm />} />
          <Route path="/payment/callback" element={<PaymentCallbackHandler />} />
          <Route path="/payment/success" element={<Success />} />
          <Route path="/payment/failure" element={<Failure />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
