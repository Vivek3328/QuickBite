import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Full-screen auth shell (no main app navbar/footer) — matches typical delivery-app sign-in flows.
 */
export function AuthLayout() {
  return (
    <>
      <Outlet />
      <ToastContainer hideProgressBar position="top-center" theme="light" />
    </>
  );
}
