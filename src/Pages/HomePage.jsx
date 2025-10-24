import { signOut } from "firebase/auth";
import { auth } from "../firebase.js"; // adjust path if needed

function HomePage({ user, users }) {
  

  return (
    <div className="homescreen" id="homeScreen">
      

      <h1 id="welcomeText">
        Welcome to the Chat App {user.displayName || user.email}
        <ul>
          {users.map((User) => {
            return <li className="p-2" key={User.uid}>{User.displayName || User.email}</li>;
          })}
        </ul>
      </h1>
    </div>
  );
}

export default HomePage;
