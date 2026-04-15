import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col pt-[4.25rem]">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer hideProgressBar position="top-center" theme="light" />
    </div>
  );
}
