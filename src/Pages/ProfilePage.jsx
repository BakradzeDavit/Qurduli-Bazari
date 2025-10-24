import React, { useState } from "react";

function ProfilePage({ handleLogout, user, setUser }) {
  const [username, setUsername] = useState(user.displayName || "");
  const [changeusername, setChangeUsername] = useState(false);
  
  const handleEditUsername = async () => {
    setChangeUsername(true);
    
    if (username && changeusername) {
      const updatedUser = await window.backend.updateUsername(user.uid, username);
      if (updatedUser) {
        setUser(updatedUser);
      } else {
        alert("Failed to update username.");
      }
      setChangeUsername(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Profile Info */}
        <div className="space-y-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 pb-8 border-b">
            <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-5xl font-bold">
              {user.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{user.displayName}</h2>
              <p className="text-gray-500 mt-1">{user.email}</p>
            </div>
          </div>

          {/* Username Edit */}
          <div className="pb-8 border-b">
            <label className="block text-sm font-medium text-gray-500 mb-3">
              Username
            </label>
            <div className="flex items-center gap-4">
              {changeusername ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new username"
                />
              ) : (
                <p className="flex-1 text-lg text-gray-800">{user.displayName}</p>
              )}
              <button
                onClick={handleEditUsername}
                className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <i className={changeusername ? "bi bi-check-lg text-xl" : "bi bi-pencil text-xl"}></i>
              </button>
            </div>
          </div>

          {/* Email (read-only) */}
          <div className="pb-8 border-b">
            <label className="block text-sm font-medium text-gray-500 mb-3">
              Email
            </label>
            <p className="text-lg text-gray-800">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;