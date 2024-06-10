import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Portfolio from "./pages/Portfolio";
import Trading from "./pages/Trading";
import MyPage from "./pages/MyPage";
import Calendar from "./pages/Calendar";
const App: React.FC = (): JSX.Element => {
  return (
    <div className="full-page">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/myportfolio" element={<Portfolio />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;