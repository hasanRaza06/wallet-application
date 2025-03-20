import React from "react";

const Profile = () => {
  // Retrieve user data from localStorage
  const user = localStorage.getItem("user")|| {};

  return (
    <div className="p-4 border rounded-lg shadow-md w-80 mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
      <p><strong>Name:</strong> {user.name || "N/A"}</p>
      <p><strong>Email:</strong> {user.email || "N/A"}</p>
      <p><strong>Wallet:</strong> ${user.wallet || "0.00"}</p>
    </div>
  );
};

export default Profile;
