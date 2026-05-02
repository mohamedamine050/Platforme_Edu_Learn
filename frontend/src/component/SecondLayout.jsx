import Sidebar from "./Sidebar";

const SecondLayout = ({ children }) => {
  return (
    <div className="secondLayout">
      <Sidebar />
      <div className="mainContent">
        {children}
      </div>
    </div>
  );
};

export default SecondLayout;
