import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="app">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;