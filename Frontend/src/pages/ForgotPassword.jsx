import axios from "axios";
import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [inputClicked, setInputClicked] = useState({
    email: false,
    otp: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handlestep1 = async () => {
    try {
      setError("");
      setLoading(true);
      const result = await axios.post(
        "http://localhost:8080/api/auth/send-otp",
        { email },
        { withCredentials: true }
      );
      console.log(result.data.message);
      setStep(2);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message);
      setLoading(false);
      console.log(error);
    }
  };

  const handlestep2 = async () => {
    try {
      setError("");
      setLoading(true);
      const result = await axios.post(
        "http://localhost:8080/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true }
      );
      console.log(result.data.message);
      setStep(3);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message);
      setLoading(false);
      console.log(error);
    }
  };
  const handlestep3 = async () => {
    try {
      setError("");
      if (newPassword !== confirmPassword) {
        console.log("Passwords do not match");
        setError("Passwords do not match");
        return;
      }
      setLoading(true);
      const result = await axios.post(
        "http://localhost:8080/api/auth/reset-password",
        { email, newPassword },
        { withCredentials: true }
      );
      console.log(result.data.message);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setInputClicked({
        email: false,
        otp: false,
        newPassword: false,
        confirmPassword: false,
      });
      setLoading(false);
      navigate('/signin');
    } catch (error) {
      setError(error.response?.data?.message);
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center">
      {step === 1 && (
        <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]">
          <h2 className="text-[25px] font-semibold">Forgot Password ?</h2>
          <div
            className="mt-[30px] relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[5px] border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, email: true })}
          >
            <label
              htmlFor="email"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                inputClicked.email ? "top-[-15px]" : ""
              }`}
            >
              Enter Your Email
            </label>
            <input
              type="email"
              id="email"
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p className="text-red-700">{error}</p>}

          <button
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
            disabled={loading}
            onClick={handlestep1}
          >
            {loading ? <ClipLoader size={30} color={"white"} /> : "Send OTP"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]">
          <h2 className="text-[25px] font-semibold">Forgot Password ?</h2>
          <div
            className="mt-[30px] relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[5px] border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, otp: true })}
          >
            <label
              htmlFor="otp"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                inputClicked.otp ? "top-[-15px]" : ""
              }`}
            >
              Enter OTP
            </label>
            <input
              type="email"
              id="otp"
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
              required
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          {error && <p className="text-red-700">{error}</p>}

          <button
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
            disabled={loading}
            onClick={handlestep2}
          >
            {loading ? <ClipLoader size={30} color={"white"} /> : "Submit"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]">
          <h2 className="text-[25px] font-semibold">Reset Password </h2>
          <div
            className="mt-[30px] relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[5px] border-2 border-black"
            onClick={() =>
              setInputClicked({ ...inputClicked, newPassword: true })
            }
          >
            <label
              htmlFor="newPassword"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                inputClicked.newPassword ? "top-[-15px]" : ""
              }`}
            >
              Enter New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div
            className="mt-[30px] relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[5px] border-2 border-black"
            onClick={() =>
              setInputClicked({ ...inputClicked, confirmPassword: true })
            }
          >
            <label
              htmlFor="confirmPassword"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                inputClicked.confirmPassword ? "top-[-15px]" : ""
              }`}
            >
              {" "}
              Confirm Your Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error === "Passwords do not match" && (
            <p className="text-red-700">{error}</p>
          )}
          {error && error !== "Passwords do not match" && (
            <p className="text-green-700 font-semibold px-[20px] mt-[10px] text-center">
              {error}
            </p>
          )}
          <button
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
            disabled={loading}
            onClick={handlestep3}
          >
            {loading ? (
              <ClipLoader size={30} color={"white"} />
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
