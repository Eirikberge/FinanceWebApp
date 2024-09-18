import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Portfolio from "./pages/Portfolio";
import Trading from "./pages/Trading";
import MyPage from "./pages/MyPage";
import Calendar from "./pages/Calendar";
import QuarterlyReport from "./pages/QuarterlyReport";
import RegisterLogin from "./pages/RegisterLogin";
import { StockProvider } from "./contexts/StockProvider";
import { AuthProvider } from "./contexts/AuthProvider";
import RequireAuth from "./components/RequireAuth";
import NoPage from "./pages/NoPage";

const App: React.FC = (): JSX.Element => {
  return (

    <div className="full-page">
      <Router>
        <Navbar />
        <div className="page-info">
          <AuthProvider>
            <StockProvider>
              <Routes>
                <Route path="/login" element={<RegisterLogin />} />

                <Route element={<RequireAuth />}>
                
                <Route path="/" element={<Portfolio />} />
                <Route path="/myportfolio" element={<Portfolio />} />
                <Route path="/trading" element={<Trading />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/mypage" element={<MyPage />} />

                <Route path="/quarterlyreport" element={<QuarterlyReport />} />

                <Route path="*" element={<NoPage />} />

                </Route>

              </Routes>
            </StockProvider>
          </AuthProvider>
        </div>
        <Footer />
      </Router>
    </div>
  );
};

export default App;