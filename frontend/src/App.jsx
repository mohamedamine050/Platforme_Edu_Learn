import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Offers from "./pages/Offers";
import Matiere from "./pages/Matiere";
import Assistance from "./pages/Assistance";
import Chapitres from "./pages/Chapitres";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import PrivateRoute from "./component/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/assistance" element={<Assistance />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes — require authentication */}
        <Route element={<PrivateRoute />}>
          <Route path="/matiere" element={<Matiere />} />
          <Route path="/chapitres/:courseId" element={<Chapitres />} />
          <Route path="/video/:chapterId" element={<Video />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;