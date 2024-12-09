import { Container } from "./components/Container";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import Modal from "react-modal";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import Profile from "./components/Profile/Profile";
import Protected from "./components/Protected/Protected";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const queryClient = new QueryClient();
  Modal.setAppElement("#root");
  
  return (
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            path="/"
            element={
              <Protected fallBack={<Navigate to={'/login'} />}>
                <Container />
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </Protected>
            }
          />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="profile" element={<Profile />} />


        </Routes>
      </QueryClientProvider>
    </QueryParamProvider>
  );
}

export default App;
