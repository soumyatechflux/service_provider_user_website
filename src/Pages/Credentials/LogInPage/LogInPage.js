import React, { useEffect, useState } from "react";
import "./LogInPage.css";
import { Link, useNavigate } from "react-router-dom";
import { LoginAPI, OTPAPI } from "../../../utils/APIs/credentialsApis";
import MessageModal from "../../MessageModal/MessageModal";
import Loader from "../../Loader/Loader";
import CommonMessageModal from "../../CommonMessageModal/CommonMessageModal";

const countryCode = "+91";

const LogInPage = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(""); // Changed to a string for a 4-digit OTP
  const [countryCode, setCountryCode] = useState("+91"); // Default country code
  const [step, setStep] = useState("login"); // 'login' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(true); // Initially disabled
  const [countdown, setCountdown] = useState(30); // Countdown starts at 10 seconds
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const validatePhoneNumber = (phone) => /^[6-9]\d{9}$/.test(phone);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
      // setError("");
    }
  };

  const handleSendOtp = async () => {
    if (!validatePhoneNumber(phone)) {
      setMessage("Enter a valid 10-digit phone number starting with 6-9.");
      handleShow();
      return;
    }

    const data = {
      customer: {
        country_code: countryCode,
        mobile: phone,
      },
    };

    try {
      setLoading(true);
      const response = await LoginAPI(data);
      console.log("API Response:", response);
      if (response?.status === 200 && response?.data?.success === true) {
        const message = response?.data?.message;

        // Extract the mobile number and OTP
        const regex = /OTP for (\d{10}): (\d{4})/;
        const match = message.match(regex);

        if (match) {
          const mobileNumber = match[1];
          const otp = match[2];
          localStorage.setItem("mobile", mobileNumber);
          localStorage.setItem("OTP", otp);
          setPhone(localStorage.getItem("mobile"));
          // setOtp(localStorage.getItem("OTP"));
          console.log("Mobile Number:", mobileNumber); // 7878787878
          console.log("OTP:", otp);
          setMessage(
            response.data.message ||
              "OTP Sended successfuly to your registered mobile number."
          );
          handleShow();
        } else {
          setMessage("No match found");
          handleShow();
        }
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

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      // Allow only one digit
      const newOtp = otp.split("");
      newOtp[index] = value || ""; // Update the specific digit
      setOtp(newOtp.join(""));

      if (value && index < 3) {
        // Move to the next input field if a digit is entered
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = otp.split("");

      if (!newOtp[index]) {
        // Move to the previous input if the current is already empty
        if (index > 0) {
          const prevInput = document.getElementById(`otp-${index - 1}`);
          prevInput?.focus();
        }
      } else {
        // Clear the current input value
        newOtp[index] = "";
        setOtp(newOtp.join("")); // Join without a separator
      }
    }
  };

  const handleBack = () => setStep("login");

  const handleVerifyOtp = async () => {
    const data = {
      customer: {
        country_code: countryCode,
        mobile: phone,
        otp: otp,
      },
    };


  try {
    setLoading(true); // Start loader
  
    const response = await OTPAPI(data);
    console.log("API Response:", response);
  
    if (response?.status === 200 && response?.data?.success === true) {
      // Store token and login status
      sessionStorage.setItem(
        "ServiceProviderUserToken",
        response?.data?.token
      );
      sessionStorage.setItem("IsLogedIn", true);
  
      // Show success message in modal
      
  
      // Navigate to home after a short delay (optional)
      
        navigate("/");
      

      setMessage(response?.data?.message || "LogIn Successful");
      setShow(true);
      handleShow(); // Show the modal
    } else {
      console.error("Failed:", response?.data?.message);
  
      // Show failure message in modal
      setMessage(
        response?.data?.message || "Failed to verify OTP. Please try again."
      );
      setShow(true);
      handleShow();
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
  
    // Show error message in modal
    setMessage("An error occurred while verifying OTP. Please try again.");
    setShow(true);
    handleShow();
  } finally {
    // Stop the loader in all cases
    setLoading(false);
  }
}

  useEffect(() => {
    let timer;

    // Start countdown on mount and whenever the button is disabled
    if (isDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 0) return prev - 1; // Decrement countdown
          clearInterval(timer); // Clear timer when countdown reaches 0
          setIsDisabled(false); // Enable the button
          return 0;
        });
      }, 1000);
    }

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [isDisabled]);

  const handleResendClick = () => {
    handleSendOtp(); // Call the resend OTP function
    setIsDisabled(true); // Disable the button
    setCountdown(10); // Reset the countdown
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="login-page-container">
        <div className="login-container">
          {step === "login" ? (
            <div className="login-card">
              <h2 className="login-title">Login</h2>
              <label className="login-label text-left">Phone Number</label>
              <div className="phone-input">
                {/* Display the fixed country code */}
                <span className="country-code-display">{countryCode}</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()} // Send OTP on Enter
                  className={`phone-number-input ${
                    error ? "input-error-unique" : ""
                  }`}
                  placeholder="Enter phone number"
                />
              </div>

              <button className="send-otp-button" onClick={handleSendOtp}>
                Send OTP
              </button>
            </div>
          ) : (
            <div className="otp-card">
              <div className="otp-header">
                <button onClick={handleBack} className="back-button">
                  ←
                </button>
                <h2 className="otp-title">One Time Password</h2>
              </div>
              <p className="otp-instructions">
                Enter the OTP sent to your phone.
              </p>
              <div className="otp-input-container">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={otp[index] || ""} // Extract each digit from the OTP string
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleVerifyOtp(); // Trigger Verify OTP on Enter
                      } else {
                        handleKeyDown(index, e); // Handle Backspace or other keys
                      }
                    }}
                    className="otp-input-unique"
                    inputMode="numeric"
                  />
                ))}
              </div>
              <p className="resend-text">
                Didn't receive OTP Code?{" "}
                <button
                  className="resend-button-unique"
                  onClick={handleResendClick}
                  disabled={isDisabled}
                >
                  {isDisabled ? `Resend in ${countdown}s` : "Resend"}
                </button>
              </p>
              <button className="verify-otp-button" onClick={handleVerifyOtp}>
                Verify OTP
              </button>
            </div>
          )}
          <div>
            <p className="signup-text">
              Don't have an account?{" "}
              <Link to="/sign-up" className="signup-link">
                Sign Up
              </Link>
            </p>
          </div>
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

export default LogInPage;
