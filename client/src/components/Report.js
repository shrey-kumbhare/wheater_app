// client/src/components/Report.js
import React from "react";

const Report = ({ searchHistory }) => {
  console.log(searchHistory);
  return (
    <div>
      <h2>Search Report</h2>
      <ul>
        {searchHistory.map((entry, index) => (
          <li key={index}>
            User: {entry.username}, City: {entry.city}, Temperature:{" "}
            {entry.temperature}°C
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Report;
