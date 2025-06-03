// src/components/layouts/MainLayout.jsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => (
  <>
    <Header />
    <main className="min-h-screen">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default MainLayout;
