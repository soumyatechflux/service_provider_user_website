import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MessageModal from "../../MessageModal/MessageModal";

const RazorpayPayment = ({ BookingData, callRazorPay, handleConfirmBooking }) => {
  const navigate = useNavigate();
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    // On script load, set the state to true indicating it's ready
    script.onload = () => {
      console.log("Razorpay script loaded successfully!");
      setIsScriptReady(true);
    };

    // On error loading script, log the error
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle the payment process using Razorpay
  const handlePayment = () => {
    if (window.Razorpay && isScriptReady) {
      const {
        key,
        amount,
        currency,
        business_name,
        business_logo,
        callback_url,
        product_description,
        customer_detail,
        razorpayModalTheme,
        notes,
        id, // Order ID generated from your backend
      } = BookingData;

      const options = {
        key,
        amount,
        currency: currency || "INR",
        name: business_name,
        description: product_description,
        image: business_logo,
        order_id: id,

        handler: (response) => {
          fetch(callback_url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
              }
              return res.json();
            })
            .then((data) => {
              console.log("Payment verified!", data);
              handleConfirmBooking();
              // navigate("/user-profile");
            })
            .catch((err) => {
              
              console.error("Verification failed:", err);
              alert("Payment verification failed. Please try again.");
              setMessage("Payment verification failed. Please try again.");
        setShow(true);
        handleShow(); // Show the modal
              // handleConfirmBooking();

            });
        },

        prefill: {
          name: customer_detail?.name,
          email: customer_detail?.email,
          contact: customer_detail?.contact,
        },
        notes: {
          address: notes?.address,
          order_id: id,
          order_details: product_description,
        },
        theme: {
          color: razorpayModalTheme || "#F37254",
        },
        modal: {
          ondismiss: () => {
            // alert("Payment modal closed");
            setMessage("Payment modal closed");
        setShow(true);
        handleShow(); // Show the modal
          },
        },
      };

      // Create the Razorpay instance and open the payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        // alert(`Payment failed! Error: ${response.error.description}`);
        setMessage(`Payment failed! Error: ${response.error.description}`);
        setShow(true);
        handleShow(); // Show the modal
      });
      razorpay.open();
    } else {
      console.error("Razorpay object not found or script not ready.");
    }
    <MessageModal
  show={show}
  handleClose={handleClose}
  handleShow={handleShow}
  message={message}
  />
  };

  // Trigger payment on component load if `callRazorPay` is true and script is ready
  useEffect(() => {
    if (callRazorPay && isScriptReady) {
      handlePayment();
    }
  }, [callRazorPay, isScriptReady]);

  return null; // This component doesn't render anything on its own
};


export default RazorpayPayment;
