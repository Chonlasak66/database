import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpdateRoom = ({ roomID, onClose, refreshRooms }) => {
  const [roomData, setRoomData] = useState({
    PricePerNight: '',
    Status: '',
    RoomType: '',
  });

  useEffect(() => {
    // Fetch the current room data when the component mounts
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/rooms/si/${roomID}`);
        const { PricePerNight, Status, RoomType } = response.data;
        setRoomData({
          PricePerNight: PricePerNight ?? '', // Ensure it's a controlled input
          Status: Status ?? 'Available', // Default to 'Available' if undefined
          RoomType: RoomType ?? 'Single', // Default to 'RoomSingle' if undefined
        });
      } catch (error) {
        console.error("There was an error fetching the room data!", error);
      }
    };

    fetchRoomData();
  }, [roomID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Determine the appropriate URL based on RoomType
      let apiURL = '';
      if (roomData.RoomType === 'Single') {
        apiURL = `http://localhost:5000/api/rooms/usi/${roomID}`;
      } else if (roomData.RoomType === 'Double') {
        apiURL = `http://localhost:5000/api/rooms/udu/${roomID}`;
      } else if (roomData.RoomType === 'Suite') {
        apiURL = `http://localhost:5000/api/rooms/usu/${roomID}`;
      }

      // Make the PUT request to the appropriate URL
      await axios.put(apiURL, roomData);
      refreshRooms(); // Refresh the room list after the update
      onClose(); // Close the update form
    } catch (error) {
      console.error("There was an error updating the room!", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="PricePerNight">Price Per Night</label>
            <input
              type="number"
              id="PricePerNight"
              name="PricePerNight"
              value={roomData.PricePerNight}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="Status">Status</label>
            <select
              id="Status"
              name="Status"
              value={roomData.Status}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg w-full p-2"
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="RoomType">Room Type</label>
            <select
              id="RoomType"
              name="RoomType"
              value={roomData.RoomType}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg w-full p-2"
            >
              <option value="Single">RoomSingle</option>
              <option value="Double">RoomDouble</option>
              <option value="Suite">RoomSuite</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button type="submit" className=" bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200">
              Update Room
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRoom;
