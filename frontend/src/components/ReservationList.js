import React, { useEffect, useState } from "react";
import axios from "axios";

const ReservationList = ({ customerId }) => {
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    ReservationID: null,
    CheckinDate: "",
    CheckinTime: "",
    CheckoutDate: "",
    CheckoutTime: "",
    CustomerID: customerId || "", // Pre-fill with customerId or leave empty if not provided
    RoomID: "",
    RoomType: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [reservationsPerPage] = useState(5); // Number of reservations to display per page

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/reservations"
      );
      setReservations(response.data);
    } catch (error) {
      console.error("There was an error fetching the reservations!", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/reservations", formData);
      resetForm();
      fetchReservations(); // Refresh the reservation list
    } catch (error) {
      console.error("There was an error saving the reservation!", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      try {
        await axios.delete(`http://localhost:5000/api/reservations/${id}`);
        fetchReservations(); // Refresh the reservation list after deletion
      } catch (error) {
        console.error("There was an error deleting the reservation!", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      ReservationID: null,
      CheckinDate: "",
      CheckinTime: "",
      CheckoutDate: "",
      CheckoutTime: "",
      CustomerID: customerId || "",
      RoomID: "",
      RoomType: "",
    });
    setIsEditing(false);
  };

  // Pagination logic
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );
  const totalPages = Math.ceil(reservations.length / reservationsPerPage);

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
    <div className="max-w-4xl mx-auto p-6 bg-teal-50 rounded-lg shadow-md mt-6">
      <h2 className="text-3xl font-semibold text-center mb-6 text-teal-600">
        Reservation Management
      </h2>

      {/* Form for adding a reservation */}
      <div className="border border-teal-300 rounded-lg p-6 mb-6 bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              name="CheckinDate"
              value={formData.CheckinDate}
              onChange={handleChange}
              placeholder="Checkin Date"
              required
              className="border border-teal-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <select
              name="CheckinTime"
              value={formData.CheckinTime}
              onChange={handleChange}
              required
              className="border border-teal-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select Checkin Time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
            </select>

            <input
              type="date"
              name="CheckoutDate"
              value={formData.CheckoutDate}
              onChange={handleChange}
              placeholder="Checkout Date"
              required
              className="border border-teal-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <select
              name="CheckoutTime"
              value={formData.CheckoutTime}
              onChange={handleChange}
              required
              className="border border-teal-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select Checkout Time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
            </select>

            <input
              type="text"
              name="CustomerID"
              value={formData.CustomerID}
              onChange={handleChange}
              placeholder="Customer ID"
              required
              readOnly // Make this field read-only
              className="border border-teal-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100"
            />
            <input
              type="text"
              name="RoomID"
              value={formData.RoomID}
              onChange={handleChange}
              placeholder="Room ID"
              required
              className="border border-teal-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <select
              name="RoomType"
              value={formData.RoomType}
              onChange={handleChange}
              required
              className="border border-teal-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select Room Type</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white rounded-lg px-4 py-3 hover:bg-teal-700 transition duration-200"
          >
            Create Reservation
          </button>
        </form>
      </div>

      {/* Display reservations */}
      <ul className="bg-white shadow-lg rounded-lg divide-y divide-gray-200">
        {currentReservations.map((reservation) => (
          <li
            key={reservation.ReservationID}
            className="py-4 px-6 hover:bg-teal-100 transition duration-150"
          >
            {/* Reservation ID - make it more prominent */}
            <div className="mb-4 p-4 bg-teal-100 border border-teal-500 rounded-lg shadow-sm">
              <span className="font-bold text-teal-800 text-xl">
                Reservation ID: {reservation.ReservationID}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-teal-600">Customer ID:</span>{" "}
                {reservation.CustomerID}
              </div>
              <div>
                <span className="font-medium text-teal-600">Room ID:</span>{" "}
                {reservation.RoomID} ({reservation.RoomType})
              </div>
              <div>
                <span className="font-medium text-teal-600">
                  Reservation Date:
                </span>{" "}
                {new Date(reservation.ReservationDate).toLocaleString()}
              </div>
              <div>
                <span className="font-medium text-teal-600">Check-in:</span>{" "}
                {new Date(reservation.CheckinDate).toLocaleDateString()} (
                {reservation.CheckinTime})
              </div>
              <div>
                <span className="font-medium text-teal-600">Check-out:</span>{" "}
                {new Date(reservation.CheckOutDate).toLocaleDateString()} (
                {reservation.CheckOutTime})
              </div>
            </div>

            <button
              onClick={() => handleDelete(reservation.ReservationID)}
              className="mt-4 bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-red-600 transition duration-200"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`bg-teal-600 text-white rounded-lg px-4 py-2 ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-teal-700 transition duration-200"
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`bg-teal-600 text-white rounded-lg px-4 py-2 ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-teal-700 transition duration-200"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReservationList;
