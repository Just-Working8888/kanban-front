import { Container } from "./components/Container";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import Modal from "react-modal";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";

function App() {
  const queryClient = new QueryClient();
  Modal.setAppElement("#root");

  return (
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route
              path="/"
              element={
                <>
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
                </>
              }
            />
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />

          </Routes>
        </QueryClientProvider>
      </QueryParamProvider>
    </BrowserRouter>
  );
}

export default App;
