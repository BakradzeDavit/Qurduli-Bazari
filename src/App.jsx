import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import HomePage from "./Pages/HomePage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import FriendsPage from "./Pages/FriendsPage.jsx";
import PostsPage from "./Pages/PostsPage.jsx";
import Header from "./components/Header.jsx";
import { auth } from "./firebase.js";

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  useEffect(() => {
    window.backend.getAllUsers().then((data) => {
      console.log("Users:", data);
      setUsers(data);
    });
  }, [auth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div>
        {user ? (
          <div>
            <Header /> {/* ✅ Always visible when logged in */}
            <Routes>
              <Route path="/" element={<HomePage user={user} users={users} />} />
              <Route
                path="/Profile"
                element={<ProfilePage handleLogout={handleLogout} user={user}/>}
              />
              <Route path="/Posts" element={<PostsPage />} />
              <Route path="/Friends" element={<FriendsPage />} />
            </Routes>
          </div>
        ) : (
          <div className="RegistrationPage" id="registrationPage">
            {isLogin ? (
              <Login setIsLogin={setIsLogin} />
            ) : (
              <SignUp setIsLogin={setIsLogin} />
            )}
          </div>
        )}
      </div>
    </Router>
  );
}
