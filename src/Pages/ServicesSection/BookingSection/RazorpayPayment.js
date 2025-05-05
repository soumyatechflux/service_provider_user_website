import React, { useState, useEffect, useRef, useCallback } from "react";
import Loader from "../../Loader/Loader";
import MessageModal from "../../MessageModal/MessageModal";
import MessageModal2 from "../../MessageModal2/MessageModal2";

const RAZORPAY_SCRIPT_ID = "razorpay-script";

const RazorpayPayment = ({ 
  BookingData, 
  callRazorPay, 
  handleConfirmBooking,
  onPaymentComplete 
}) => {
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isScriptReady, setIsScriptReady] = useState(!!window.Razorpay);
  const paymentProcessedRef = useRef(false);
  const razorpayInstance = useRef(null);

  const resetPaymentState = useCallback(() => {
    razorpayInstance.current?.close();
    razorpayInstance.current = null;
    paymentProcessedRef.current = false;
    setLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    setShow(false);
    resetPaymentState();
  }, [resetPaymentState]);

  // Load Razorpay script
  useEffect(() => {
    if (isScriptReady) return;

    const existingScript = document.getElementById(RAZORPAY_SCRIPT_ID);
    if (existingScript) {
      existingScript.onload = () => setIsScriptReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.id = RAZORPAY_SCRIPT_ID;

    script.onload = () => setIsScriptReady(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      resetPaymentState();
    };

    document.body.appendChild(script);

    return resetPaymentState;
  }, [isScriptReady, resetPaymentState]);

  const handlePayment = useCallback(async () => {
    resetPaymentState(); // Clean up any previous instances

    if (!window.Razorpay) {
      console.error("Razorpay not available");
      return;
    }

    try {
      const options = {
        key: BookingData.key,
        amount: BookingData.amount,
        currency: BookingData.currency || "INR",
        name: BookingData.business_name,
        description: BookingData.product_description,
        image: BookingData.business_logo,
        order_id: BookingData.id,
        handler: async (response) => {
          try {
            setLoading(true);
            const verificationResponse = await fetch(BookingData.callback_url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verificationResponse.ok) {
              throw new Error("Verification failed");
            }

            const data = await verificationResponse.json();
            if (!data.success) {
              throw new Error(data.message || "Payment verification failed");
            }

            handleConfirmBooking();
            onPaymentComplete?.();
            paymentProcessedRef.current = true;
          } catch (error) {
            setMessage(error.message || "Payment verification failed");
            setShow(true);
            throw error; // Re-throw to trigger payment.failed
          } finally {
            setLoading(false);
          }
        },
        prefill: BookingData.customer_detail || {},
        notes: BookingData.notes || {},
        theme: {
          color: BookingData.razorpayModalTheme || "#F37254",
        },
        modal: {
          ondismiss: () => {
            setMessage("Payment was cancelled");
            setShow(true);
            resetPaymentState();
          },
        },
      };

      razorpayInstance.current = new window.Razorpay(options);
      
      razorpayInstance.current.on("payment.failed", (response) => {
        setMessage(response.error.description || "Payment failed");
        setShow(true);
        resetPaymentState();
      });

      razorpayInstance.current.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      setMessage("Payment initialization failed");
      setShow(true);
      resetPaymentState();
    }
  }, [BookingData, handleConfirmBooking, onPaymentComplete, resetPaymentState]);

  useEffect(() => {
    if (callRazorPay && isScriptReady && !paymentProcessedRef.current) {
      paymentProcessedRef.current = true;
      setLoading(true);
      handlePayment().catch(() => {
        setLoading(false);
        paymentProcessedRef.current = false;
      });
    }
  }, [callRazorPay, isScriptReady, handlePayment]);

  return (
    <>
      {loading && <Loader />}
      <MessageModal2
        show={show}
        handleClose={handleClose}
        message={message}
      />
    </>
  );
};

export default React.memo(RazorpayPayment);