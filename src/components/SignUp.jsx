import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase.js";

function SignUp({ setIsLogin }) {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Track visibility of password fields: [password, confirmPassword]
  const [passwordStates, setPasswordStates] = useState([false, false]);

  // Toggle password visibility
  const handleToggle = (index) => {
    const newStates = [...passwordStates];
    newStates[index] = !newStates[index];
    setPasswordStates(newStates);
  };

  const signUp = () => {
    setError(""); // reset previous errors

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Update display name
        updateProfile(user, { displayName })
          .then(() => {
            console.log("User registered!", user);
            setIsLogin(true); // switch to login page
          })
          .catch((err) => {
            console.error(err.message);
            setError(err.message);
          });
      })
      .catch((err) => {
        console.error(err.message);
        setError(err.message);
      });
  };

  return (
    <div className="signup card p-4 shadow-sm" id="signup">
      <h2 className="text-center mb-3">Sign Up</h2>

      {error && <div className="text-danger mb-3">{error}</div>}

      <div className="mb-3">
        <input
          className="form-control"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      {/* Password field */}
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

      {/* Confirm Password field */}
      <div className="mb-3 position-relative">
        <input
          className="form-control"
          type={passwordStates[1] ? "text" : "password"}
          placeholder="Repeat Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <i
          className={`bi ${passwordStates[1] ? "bi-eye" : "bi-eye-slash"} position-absolute eye`}
          style={{ top: "10px", right: "10px", cursor: "pointer" }}
          onClick={() => handleToggle(1)}
        ></i>
      </div>

      <button
        onClick={signUp}
        className="btn btn-primary w-100 mb-2"
        id="signupBtn"
      >
        Sign Up
      </button>

      <h4 className="w-100 text-center">
        Already have an account?{" "}
        <button
          className="link-primary toggleReg"
          onClick={() => setIsLogin(true)}
        >
          Login here
        </button>
      </h4>
    </div>
  );
}

export default SignUp;
