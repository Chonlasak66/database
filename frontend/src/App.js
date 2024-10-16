import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './index.css'; // Import Tailwind styles
import CustomerList from './components/CustomerList';
import ReservationList from './components/ReservationList';
import RoomList from './components/RoomList';
import PaymentList from './components/PaymentList';
import Login from './components/Login'; // <-- Import the Login component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
  const [customerId, setCustomerId] = useState(null); // Store customer ID

  const handleLoginSuccess = (id) => {
    setIsLoggedIn(true); // Set login to true on successful login
    setCustomerId(id); // Store customer ID
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Reset login state
    setCustomerId(null); 
  };

  return (
    <Router>
      <div className="min-h-screen bg-teal-100 p-6">
        {!isLoggedIn ? ( 
          // Show login page if not logged in
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            <h1 className="text-4xl font-bold text-center mb-6 text-green-700">Hotel Reservation System</h1>
            
            {/* Navbar */}
            <nav className="bg-white shadow-lg rounded-lg p-4 mb-6">
              <ul className="flex justify-center space-x-8">
                
                <li>
                  <Link 
                    to="/customers" 
                    className="text-green-600 hover:bg-green-100 rounded-lg px-4 py-2 transition duration-200 font-medium"
                  >
                    Customers
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/reservations" 
                    className="text-green-600 hover:bg-green-100 rounded-lg px-4 py-2 transition duration-200 font-medium"
                  >
                    Reservations
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/rooms" 
                    className="text-green-600 hover:bg-green-100 rounded-lg px-4 py-2 transition duration-200 font-medium"
                  >
                    Rooms
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/payments" 
                    className="text-green-600 hover:bg-green-100 rounded-lg px-4 py-2 transition duration-200 font-medium"
                  >
                    Payments
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="bg-red-100 text-red-600 hover:bg-red-100 rounded-lg px-4 py-2 transition duration-200 font-medium"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </nav>

            {/* Routes */}
            <Routes>
              <Route path="/" element={<CustomerList/>} />
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/reservations" element={<ReservationList customerId={customerId} />} />
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/payments" element={<PaymentList />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
