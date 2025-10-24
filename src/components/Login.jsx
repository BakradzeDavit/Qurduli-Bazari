import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
function Login({ setIsLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStates, setPasswordStates] = useState([false]);

  const handleToggle = (index) => {
    const newStates = [...passwordStates];
    newStates[index] = !newStates[index];
    setPasswordStates(newStates);
  };
  function login() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Logged in!", userCredential.user);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  return (
    <div className={`login card p-4 shadow-sm `} id="login">
      <h2 className="text-center mb-3">Login</h2>

      <div className="mb-3">
        <input
          className="form-control"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3 position-relative">
        <input
          className="form-control"
          type={passwordStates[0] ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <i
          className={`bi ${passwordStates[0] ? "bi-eye" : "bi-eye-slash"} position-absolute eye`}
          style={{ top: "10px", right: "10px", cursor: "pointer" }}
          onClick={() => handleToggle(0)}
        ></i>
      </div>

      <button
        onClick={login}
        className="btn btn-primary w-100 mb-2"
        id="loginBtn"
      >
        Login
      </button>

      <h4 className="w-100 text-center">
        Don’t have an account?{" "}
        <button
          className="link-primary toggleReg"
          onClick={() => setIsLogin(false)}
        >
          Sign up here
        </button>
      </h4>
    </div>
  );
}

export default Login;
