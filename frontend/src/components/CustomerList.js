import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    CustomerID: null,
    Email: '',
    Password: '',
    Name: '',
    Phone: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10); // Show 10 customers per page

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error("There was an error fetching the customers!", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/customers/up/${formData.CustomerID}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/customers', formData);
      }
      resetForm();
      fetchCustomers(); // Refresh the customer list
    } catch (error) {
      console.error("There was an error saving the customer!", error);
    }
  };

  const resetForm = () => {
    setFormData({ CustomerID: null, Email: '', Password: '', Name: '', Phone: '' });
    setIsEditing(false);
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://localhost:5000/api/customers/de/${id}`);
        fetchCustomers(); // Refresh the customer list after deletion
      } catch (error) {
        console.error("There was an error deleting the customer!", error);
      }
    }
  };

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const totalPages = Math.ceil(customers.length / customersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-teal-50 rounded-lg shadow-md mt-6">
      <h2 className="text-3xl font-semibold text-center mb-6 text-teal-600">Customer Management</h2>

      {/* Form for adding/editing a customer */}
      <div className="border border-teal-300 rounded-lg p-6 mb-6 bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="border border-teal-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="border border-teal-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="border border-teal-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="border border-teal-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button type="submit" className="w-full bg-teal-600 text-white rounded-lg px-4 py-3 hover:bg-teal-700 transition duration-200">
            {isEditing ? 'Update Customer' : 'Add Customer'}
          </button>
        </form>
      </div>

      <ul className="bg-white shadow-lg rounded-lg divide-y divide-gray-200">
        {currentCustomers.map(customer => (
          <li key={customer.CustomerID} className="flex justify-between items-center py-3 px-4 hover:bg-teal-100 transition duration-150">
            <div>
              <span className="font-medium text-teal-600">{customer.Name}</span> <span className="text-gray-500">({customer.Email})</span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(customer)}
                className="bg-yellow-500 text-white rounded-lg px-3 py-1 hover:bg-yellow-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(customer.CustomerID)}
                className="bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 1} 
          className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-teal-600">Page {currentPage} of {totalPages}</span>
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages} 
          className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomerList;
