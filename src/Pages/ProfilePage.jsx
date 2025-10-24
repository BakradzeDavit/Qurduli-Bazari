import React from "react";

function ProfilePage({ handleLogout, user }) {
const handleEditUsername = () => {
  // Logic to handle username editing
  console.log("Edit username clicked");
}

  return (
    <div>
      {/* <form action="/upload" method="post" enctype="multipart/form-data">
        <label htmlFor="imageUpload">Choose an image:</label>
        <input type="file" id="imageUpload" name="image" accept="image/*" />
        <button type="submit">Upload</button>
      </form> */}

      <h1>{user.displayName}'s Profile</h1>
      <p>Email: {user.email}</p>
      <div>
        <p>Username: {user.displayName}</p>
        <i className="bi bi-pencil pointer" onClick={handleEditUsername}></i>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default ProfilePage;
