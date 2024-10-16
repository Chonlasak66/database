import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    PaymentStatus: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(9); // Set the number of payments per page

  useEffect(() => {
    fetchPayments();
  }, []);

  // Fetch the payments from the API
  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments');
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for updating payments
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/payments/${editId}`, formData);
        fetchPayments(); // Refresh payment list after update
        resetForm(); // Reset the form after successful update
      }
    } catch (error) {
      console.error("Error updating payment", error);
    }
  };

  // Handle editing an existing payment
  const handleEdit = (payment) => {
    setFormData({
      PaymentStatus: payment.PaymentStatus,
    });
    setIsEditing(true);
    setEditId(payment.PaymentID);
  };

  // Reset form to its default state
  const resetForm = () => {
    setFormData({
      PaymentStatus: '',
    });
    setIsEditing(false);
    setEditId(null);
  };

  // Pagination logic
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(payments.length / paymentsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-teal-50 rounded-lg shadow-lg mt-6">
      <h2 className="text-3xl font-semibold text-center mb-6 text-teal-600">Payment Management</h2>

      {/* Form for updating payment status */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="mb-6 border border-teal-300 rounded-lg p-6 bg-white shadow-md">
          <label htmlFor="PaymentStatus" className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
          <select
            id="PaymentStatus"
            name="PaymentStatus"
            value={formData.PaymentStatus}
            onChange={handleChange}
            required
            className="border border-teal-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
          >
            <option value="">Select Payment Status</option>
            <option value="Pending">Pending</option>
            <option value="Cancel">Cancel</option>
            <option value="Success">Success</option>
          </select>
          <button type="submit" className="w-full bg-teal-600 text-white rounded-lg px-4 py-3 hover:bg-teal-700 transition duration-200">
            Update Status
          </button>
        </form>
      )}

      {/* Payment List as Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPayments.map(payment => (
          <div key={payment.PaymentID} className="bg-white shadow-lg rounded-lg p-4 flex flex-col transition-transform transform hover:scale-105">
          {/* Make PaymentID more prominent */}
          <div className="mb-4 p-4 bg-teal-100 border border-teal-500 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-teal-800">Payment ID: {payment.PaymentID}</h3>
          </div>
          
          <p><strong className="text-teal-600">Reservation ID:</strong> {payment.ReservationID}</p>
          <p><strong className="text-teal-600">Amount:</strong> ${(parseFloat(payment.Amount) || 0).toFixed(2)}</p>
          <p><strong className="text-teal-600">Date:</strong> {new Date(payment.PaymentDate).toLocaleDateString()}</p>
          <p><strong className="text-teal-600">Status:</strong> {payment.PaymentStatus}</p>
          
          <button
            onClick={() => handleEdit(payment)}
            className="mt-2 text-blue-500 hover:underline transition duration-150"
          >
            Edit Status
          </button>
        </div>
        ))}
      </div>

      {/* Pagination buttons */}
      <div className="flex justify-between mt-4">
        <button 
          onClick={handlePreviousPage} 
          disabled={currentPage === 1}
          className={`bg-teal-600 text-white rounded-lg px-4 py-2 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-700 transition duration-200"}`}
        >
          Previous
        </button>
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
          className={`bg-teal-600 text-white rounded-lg px-4 py-2 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-700 transition duration-200"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaymentList;
