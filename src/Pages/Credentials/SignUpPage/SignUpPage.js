import React, { useEffect, useState } from "react";
import "./SignUpPage.css";
import { Link, useNavigate } from "react-router-dom";
import { OTPAPI, SignUpAPI } from "../../../utils/APIs/credentialsApis";
import MessageModal from "../../MessageModal/MessageModal";
import Loader from "../../Loader/Loader";

const countryCode = "+91";
const SignUpPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(""); // Changed to a string for a 4-digit OTP
  const [countryCode, setCountryCode] = useState("+91");
  const [step, setStep] = useState("signup");
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true); // Initially disabled
  const [countdown, setCountdown] = useState(30); // Countdown starts at 10 seconds

  const navigate = useNavigate();

  const validatePhoneNumber = (phone) => /^[6-9]\d{9}$/.test(phone);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
      setError("");
    }
  };

  const handleBackToHome = () => {
    navigate("/"); // Navigate to the home route
  };

  const [referralCode, setReferralCode] = useState(""); // New state for referral code

  const handleSendOtp = async () => {
    if (!name.trim()) {
      setMessage("Name cannot be empty.");
      handleShow();
      return;
    }
    if (!validatePhoneNumber(phone)) {
      setMessage("Enter a valid 10-digit phone number starting with 6-9.");
      handleShow();
      return;
    }
    if (!termsAccepted) {
      setMessage("You must accept the Terms & Conditions.");
      handleShow();
      return;
    }

    const data = {
      customer: {
        full_name: name,
        country_code: countryCode,
        mobile: phone,
        referral_code: referralCode || "", // Add referral code to payload (optional)
      },
    };

    try {
      setLoading(true);
      const response = await SignUpAPI(data);
      console.log("API Response:", response);
      if (response?.status === 200 && response?.data?.success === true) {
        const message = response?.data?.message;

        const regex = /OTP for (\d{10}): (\d{4})/;
        const match = message.match(regex);

        if (match) {
          const mobileNumber = match[1];
          const otp = match[2];
          localStorage.setItem("mobile", mobileNumber);
          localStorage.setItem("OTP", otp);
          setPhone(localStorage.getItem("mobile"));
          console.log("Mobile Number:", mobileNumber);
          console.log("OTP:", otp);
          setMessage(response.data.message || "OTP sent successfully.");
          handleShow();
        } else {
          setMessage("No match found");
          handleShow();
        }
        setStep("otp");
      } else {
        setMessage(response?.data?.message || "Failed to send OTP.");
        handleShow();
      }
    } catch (err) {
      setLoading(false);
      console.error("Error sending OTP:", err);
      setMessage("An error occurred while sending OTP.");
      handleShow();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = otp.split("");
      newOtp[index] = value || "";
      setOtp(newOtp.join(""));

      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = otp.split("");
      if (!newOtp[index]) {
        if (index > 0) {
          const prevInput = document.getElementById(`otp-${index - 1}`);
          prevInput?.focus();
        }
      } else {
        newOtp[index] = "";
        setOtp(newOtp.join(""));
      }
    }
  };

  const handleBack = () => setStep("signup");

  const handleVerifyOtp = async () => {
    const data = {
      customer: {
        country_code: countryCode,
        mobile: phone,
        otp: otp,
      },
    };

    try {
      setLoading(true);
      const response = await OTPAPI(data);
      console.log("API Response:", response);
      if (response?.status === 200 && response?.data?.success === true) {
        sessionStorage.setItem(
          "ServiceProviderUserToken",
          response?.data?.token
        );
        sessionStorage.setItem("user_name", name);
        sessionStorage.setItem("IsLogedIn", true);

        setMessage("Sign up successful!");
        setShow(true);
        handleShow();

        setTimeout(() => {
          navigate("/");
        }, 2000);
        setStep("otp");
      } else {
        setMessage(
          response?.data?.message || "Failed to send OTP. Please try again."
        );
        handleShow();
      }
    } catch (err) {
      setLoading(false);
      console.error("Error sending OTP:", err);
      setMessage("An error occurred while sending OTP. Please try again.");
      handleShow();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;

    if (isDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 0) return prev - 1;
          clearInterval(timer);
          setIsDisabled(false);
          return 0;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isDisabled]);

  const handleResendClick = () => {
    handleSendOtp();
    setIsDisabled(true);
    setCountdown(10);
  };

  const handleTermsClick = () => {
    navigate("/terms-and-conditions"); // Navigate to the Terms & Conditions page
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="signup-container-unique">
        <div className="login-container">
          {step === "signup" ? (
            <div className="signup-card-unique">
              <h2 className="signup-title-unique">Sign Up</h2>
              <label className="login-label text-left">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="name-input-unique"
                placeholder="Enter your name"
              />
              <label className="login-label text-left">Phone Number</label>
              <div className="phone-input">
                <span className="country-code-display">{countryCode}</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  className={`phone-number-input ${
                    error ? "input-error-unique" : ""
                  }`}
                  placeholder="Enter phone number"
                />
              </div>
              <label className="login-label text-left">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="referral-input-unique"
                placeholder="Enter referral code (if any)"
              />

              <div className="terms-container-unique">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  className="terms-checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
                <label htmlFor="terms-checkbox" className="terms-and-condition">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="terms-link-unique"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default anchor behavior
                      window.open("/terms-and-conditions", "_blank"); // Open in new tab
                    }}
                  >
                    Terms & Conditions
                  </a>{" "}
                  & Privacy Policy.
                </label>
              </div>
              {error && <p className="error-message-unique">{error}</p>}
              <button
                className="send-otp-button-unique"
                onClick={handleSendOtp}
              >
                Send OTP
              </button>
              <p className="login-link-container-unique">
                Already a user?{" "}
                <a href="/login" className="login-link-unique">
                  Log In
                </a>
              </p>
              <button
                className="back-button-unique1"
                onClick={handleBackToHome}
              >
                ← Back To Home
              </button>
            </div>
          ) : (
            <div className="otp-card-unique">
              <button onClick={handleBack} className="back-button-unique">
                ← Back
              </button>
              <h2 className="otp-title-unique">One Time Password</h2>
              <p className="otp-instructions-unique">
                Enter the OTP sent to your phone.
              </p>
              <div className="otp-input-container-unique">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleVerifyOtp();
                      else handleKeyDown(index, e);
                    }}
                    className="otp-input-unique"
                    inputMode="numeric"
                  />
                ))}
              </div>
              {error && <p className="error-message-unique">{error}</p>}
              <button
                className="verify-otp-button-unique mb-2"
                onClick={handleVerifyOtp}
              >
                Sign Up
              </button>
              <p className="resend-otp-unique">
                Didn’t receive OTP?{" "}
                <button
                  className="resend-button-unique"
                  onClick={handleResendClick}
                  disabled={isDisabled}
                >
                  {isDisabled ? `Resend in ${countdown}s` : "Resend"}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
      <MessageModal
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        message={message}
      />
    </>
  );
};

export default SignUpPage;
