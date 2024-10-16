import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateRoom from './UpdateRoom';

const RoomList = () => {
  const [rooms, setRooms] = useState({
    singleRooms: [],
    doubleRooms: [],
    suiteRooms: []
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Pagination state for each room type
  const [currentSinglePage, setCurrentSinglePage] = useState(1);
  const [currentDoublePage, setCurrentDoublePage] = useState(1);
  const [currentSuitePage, setCurrentSuitePage] = useState(1);
  
  const itemsPerPage = 12; // Number of items to show per page

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error("There was an error fetching the rooms!", error);
      }
    };
    fetchRooms();
  }, []);

  const refreshRooms = async () => {
    const response = await axios.get('http://localhost:5000/api/rooms');
    setRooms(response.data);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 border-green-500';
      case 'Occupied':
        return 'bg-red-100 border-red-500';
      case 'Maintenance':
        return 'bg-yellow-100 border-yellow-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  const renderRoomCard = (room) => {
    const statusColor = getStatusColor(room.Status);
    return (
      <div key={room.RoomID} className={`shadow-lg rounded-lg overflow-hidden m-4 p-4 border-l-4 ${statusColor} flex-1 transition duration-500`}>
        <h3 className="text-xl font-bold text-teal-800">Room ID: {room.RoomID}</h3>
        <p className="text-gray-600">
          Price: <span className="font-medium">${parseFloat(room.PricePerNight).toFixed(2)}</span>
        </p>
        <p className="text-gray-600">Status: <span className="font-medium">{room.Status}</span></p>
        <p className="text-gray-600">Room Type: <span className="font-medium">{room.RoomType}</span></p>
        <button onClick={() => setSelectedRoom(room.RoomID)} className="mt-4 bg-teal-500 text-white rounded-lg px-4 py-2 hover:bg-teal-600 transition duration-200">
          Update
        </button>
      </div>
    );
  };

  // Current rooms and pagination for each type
  const singleRooms = rooms.singleRooms;
  const doubleRooms = rooms.doubleRooms;
  const suiteRooms = rooms.suiteRooms;

  const totalSinglePages = Math.ceil(singleRooms.length / itemsPerPage);
  const totalDoublePages = Math.ceil(doubleRooms.length / itemsPerPage);
  const totalSuitePages = Math.ceil(suiteRooms.length / itemsPerPage);

  const currentSingleRooms = singleRooms.slice((currentSinglePage - 1) * itemsPerPage, currentSinglePage * itemsPerPage);
  const currentDoubleRooms = doubleRooms.slice((currentDoublePage - 1) * itemsPerPage, currentDoublePage * itemsPerPage);
  const currentSuiteRooms = suiteRooms.slice((currentSuitePage - 1) * itemsPerPage, currentSuitePage * itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-teal-50 rounded-lg shadow-md mt-6">
      <h2 className="text-3xl font-semibold text-center mb-6 text-teal-600">Room Management</h2>

      {/* Single Rooms Section */}
      <div className="border border-teal-400 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-medium mb-2">Single Rooms</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
          {currentSingleRooms.map(renderRoomCard)}
        </div>
        {/* Single Rooms Pagination Controls */}
        <div className="flex justify-between mt-6">
          <button 
            onClick={() => setCurrentSinglePage((prev) => Math.max(prev - 1, 1))} 
            disabled={currentSinglePage === 1}
            className="bg-teal-500 text-white rounded-lg px-4 py-2 hover:bg-teal-600 transition duration-200"
          >
            Previous
          </button>
          <span className="self-center text-lg">
            Page {currentSinglePage} of {totalSinglePages}
          </span>
          <button 
            onClick={() => setCurrentSinglePage((prev) => Math.min(prev + 1, totalSinglePages))} 
            disabled={currentSinglePage === totalSinglePages}
            className="bg-teal-500 text-white rounded-lg px-4 py-2 hover:bg-teal-600 transition duration-200"
          >
            Next
          </button>
        </div>
      </div>

      {/* Double Rooms Section */}
      <div className="border border-teal-400 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-medium mb-2">Double Rooms</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
          {currentDoubleRooms.map(renderRoomCard)}
        </div>
        {/* Double Rooms Pagination Controls */}
        <div className="flex justify-between mt-6">
          <button 
            onClick={() => setCurrentDoublePage((prev) => Math.max(prev - 1, 1))} 
            disabled={currentDoublePage === 1}
            className="bg-teal-500 text-white rounded-lg px-4 py-2 hover:bg-teal-600 transition duration-200"
          >
            Previous
          </button>
          <span className="self-center text-lg">
            Page {currentDoublePage} of {totalDoublePages}
          </span>
          <button 
            onClick={() => setCurrentDoublePage((prev) => Math.min(prev + 1, totalDoublePages))} 
            disabled={currentDoublePage === totalDoublePages}
            className="bg-teal-500 text-white rounded-lg px-4 py-2 hover:bg-teal-600 transition duration-200"
          >
            Next
          </button>
        </div>
      </div>

      {/* Suites Section */}
      <div className="border border-teal-400 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-medium mb-2">Suites</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
          {currentSuiteRooms.map(renderRoomCard)}
        </div>
        {/* Suite Rooms Pagination Controls */}
        <div className="flex justify-between mt-6">
          <button 
            onClick={() => setCurrentSuitePage((prev) => Math.max(prev - 1, 1))} 
            disabled={currentSuitePage === 1}
            className="bg-teal-500 text-white rounded-lg px-4 py-2 hover:bg-teal-600 transition duration-200"
          >
            Previous
          </button>
          <span className="self-center text-lg">
            Page {currentSuitePage} of {totalSuitePages}
          </span>
          <button 
            onClick={() => setCurrentSuitePage((prev) => Math.min(prev + 1, totalSuitePages))} 
            disabled={currentSuitePage === totalSuitePages}
            className="bg-teal-500 text-white rounded-lg px-4 py-2 hover:bg-teal-600 transition duration-200"
          >
            Next
          </button>
        </div>
      </div>

      {selectedRoom && (
        <UpdateRoom roomID={selectedRoom} onClose={() => setSelectedRoom(null)} refreshRooms={refreshRooms} />
      )}
    </div>
  );
};

export default RoomList;
