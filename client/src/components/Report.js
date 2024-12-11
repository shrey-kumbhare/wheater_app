import React from "react";

const Report = ({ searchHistory }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Search Report
        </h2>
        {searchHistory.length === 0 ? (
          <p className="text-center text-gray-500">
            No search history available.
          </p>
        ) : (
          <ul className="space-y-4">
            {searchHistory.map((entry, index) => (
              <li
                key={index}
                className="bg-gray-100 p-4 rounded-md shadow-md hover:bg-blue-50 transition duration-300"
              >
                <p className="text-lg text-blue-600 font-semibold">
                  User:{" "}
                  <span className="font-normal text-gray-800">
                    {entry.username}
                  </span>
                </p>
                <p className="text-lg text-blue-600 font-semibold">
                  City:{" "}
                  <span className="font-normal text-gray-800">
                    {entry.city}
                  </span>
                </p>
                <p className="text-lg text-blue-600 font-semibold">
                  Temperature:{" "}
                  <span className="font-normal text-gray-800">
                    {entry.temperature}°C
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Report;
