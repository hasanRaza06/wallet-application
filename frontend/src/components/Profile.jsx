import React from "react";

const Profile = () => {
  // Retrieve and parse user data from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {};

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-b pb-2 mb-4">
        Profile Details
      </h2>
      <div className="text-lg space-y-3 text-gray-700 dark:text-gray-300">
        <p>
          <span className="font-semibold">Name:</span> {user.name || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default Profile;
