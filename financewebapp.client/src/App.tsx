import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Portfolio from "./pages/Portfolio";
import Trading from "./pages/Trading";
import MyPage from "./pages/MyPage";
import Calendar from "./pages/Calendar";
import QuarterlyReport from "./pages/QuarterlyReport";
import { StockProvider } from "./contexts/StockProvider";
import RegisterLogin from "./pages/RegisterLogin";

const App: React.FC = (): JSX.Element => {
  return (

    <div className="full-page">
      <Router>
        <Navbar />
        <div className="page-info">
          <StockProvider>
            <Routes>
              <Route path="/" element={<RegisterLogin />} />
              
              <Route path="/myportfolio" element={<Portfolio />} />
              <Route path="/trading" element={<Trading />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/mypage" element={<MyPage />} />

              <Route path="/quarterlyreport" element={<QuarterlyReport />} />

            </Routes>
          </StockProvider>
        </div>
        <Footer />
      </Router>
    </div>
  );
};

export default App;