import React, { useEffect, useRef, useState } from "react";
import "./BookingSection.css";
import { ChevronLeft, MapPin, Voicemail } from "lucide-react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import RazorpayPayment from "./RazorpayPayment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { ArrowBarDown } from "react-bootstrap-icons";
import EditAddressForm from "../../ProfilePage/ProfileDetails/EditAddressForm/EditAddressForm";
import { Dropdown, Modal } from "react-bootstrap";
import AddAddressForm from "../../ProfilePage/ProfileDetails/AddAddressForm/AddAddressForm";
import { BsThreeDotsVertical } from "react-icons/bs";
import MessageModal from "../../MessageModal/MessageModal";
import { IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronRight, ChevronDown } from "react-feather";
import { FaRupeeSign, FaPercent } from "react-icons/fa";
import { useJsApiLoader } from "@react-google-maps/api";
import { LoadScript } from "@react-google-maps/api";
import { Button } from "react-bootstrap";
import LocationModal from "../../ProfilePage/ProfileDetails/LocationModal";
import Loader from "../../Loader/Loader";
import { addDays, differenceInDays } from "date-fns";
import DriverBookingMap from "./DriverBookingMap";

const BookingSection = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const token = sessionStorage.getItem("ServiceProviderUserToken");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = location.state || {}; // Handle case where no state is passed
  const [dishesOptionsArray, setdishesOptionsArray] = useState([]);

  const [isTimeDropdownOpen, setTimeDropdownOpen] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [
    selectedMenuItemsForChefForParty,
    setSelectedMenuItemsForChefForParty,
  ] = useState([]);

  const [menu, setMenu] = useState([]);
  const [SelectedNamesOfDishes, setSelectedNamesOfDishes] = useState([]);

  // const [selectedTime, setSelectedTime] = useState("");
  const [showGrid, setShowGrid] = useState(false);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isAddingAddress, setIsAddingAddress] = useState(false); // New state for address form
  const [addressToEdit, setAddressToEdit] = useState(null); // Track the address being edited
  const [isEditingAddress, setIsEditingAddress] = useState(false); // State for editing address modal
  const [makeDisable, setMakeDisable] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [addresses, setAddresses] = useState([]);

  const [isSecureFeeChecked, setIsSecureFeeChecked] = useState(true);

  const [isUsePoints, setIsUsePoints] = useState(false);

  const dropdownRef = useRef(null); // Reference to the dropdown container

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close the dropdown
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const cancelAddAddress = () => {
    setNewAddress({
      houseNumber: "",
      streetAddress: "",
      streetAddressLine: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    });
    setIsAddingAddress(false);
  };

  const [newAddress, setNewAddress] = useState({
    houseNumber: "",
    streetAddress: "",
    streetAddressLine: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.status && response?.data?.success) {
        const data = response?.data?.data;

        setAddresses(data?.address);

        if (data?.address?.length > 0) {
          setSelectedLocation(data?.address[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const [basicDataByGet, setBasicDataByGet] = useState();

  useEffect(() => {
    const fetchBasicDataFun = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/booking_data/${service?.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response?.data?.success === true) {
          setBasicDataByGet(response?.data?.data || {});
        } else {
          setBasicDataByGet({});
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurant locations:", error);
        setBasicDataByGet({});
        setLoading(false);
      }
    };
    fetchBasicDataFun();
  }, []);

  const [DataForPricesAppliedGet, setDataForPricesAppliedGet] = useState({});

  const FunctionDataForPricesApplied = async () => {
    setLoading(true);

    const selectedCouponObject = DataForPricesAppliedGet?.discount?.find(
      (coupon) => coupon.voucher_id === selectedCoupon
    );

    const voucherCode = selectedCouponObject
      ? selectedCouponObject.voucher_code
      : null;

    try {
      const body = {
        booking: {
          category_id: service?.category_id || "",
          sub_category_id: service?.id || "",

          visit_date:
            service?.id === 9 ? MonthlySubscriptionStartDate : selectedDate,

          visit_time: selectedTime,

          // is_secure_fee :
          //  service?.category_id === 2 ? isSecureFeeChecked : false,

          is_secure_fee: false,

          // is_use_points : isUsePoints, // ✅ Sending checkbox value

          visit_address_id:
            service?.category_id !== 2 ? selectedLocation?.address_id : "",

          // address_from:
          //   service?.category_id === 2
          //     ? selectedLocationFromForDriver?.address_id
          //     : "",
          // address_to:
          //   service?.category_id === 2
          //     ? selectedLocationToForDriver?.address_id
          //     : "",

          address_from:
            service?.category_id === 2 ? DriverCoordinates.startPoint : "",
          address_to:
            service?.category_id === 2 ? DriverCoordinates.endPoint : "",

          short_address_from:
            service?.category_id === 2 ? DriverCoordinates.startPoint : "",
          short_address_to:
            service?.category_id === 2 ? DriverCoordinates.endPoint : "",

          address_from_latitude:
            service?.category_id === 2
              ? DriverCoordinates.startCoordinates.lat
              : "",

          address_from_longitude:
            service?.category_id === 2
              ? DriverCoordinates.startCoordinates.lng
              : "",

          address_to_latitude:
            service?.category_id === 2
              ? DriverCoordinates.endCoordinates.lat
              : "",

          address_to_longitude:
            service?.category_id === 2
              ? DriverCoordinates.endCoordinates.lng
              : "",

          no_of_hours_booked: "",
          number_of_people: SelectedObjectOfPeople || {},
          guest_name: BookingForGuestName || "Guest",
          instructions: specialRequests || "",
          payment_mode: "",
          dishes:
            service?.id === 1 || service?.id === 2 ? SelectedNamesOfDishes : [],

          driver_time_duration:
            service?.category_id === 2
              ? SelectedNumberOfHoursObjectForDriver
              : {},

          transmission_type:
            service?.category_id === 2 ? selectedCarTransmissionType : "",
          car_type: service?.category_id === 2 ? selectedCarType : "",

          gardener_time_duration:
            service?.id === 8 ? SelectedNumberOfHoursObjectForGardner : {},

          gardener_monthly_subscription:
            service?.id === 9
              ? SelectedNumberOfSlotsObjectForMonthlyGardner
              : {},

          gardener_visiting_slots: service?.id === 9 ? selectedVisitDates : [],

          voucher_code: voucherCode ? voucherCode : "",

          // menu: service?.id === 3 ? selectedMenuItemsForChefForParty : [],
          menu:
            service?.id === 3
              ? selectedMenuItemsForChefForParty
                  .filter((item) => item.quantity > 0)
                  .map((item) => ({
                    ...item,
                    price: parseFloat(item.price),
                  }))
              : [],
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/booking_pricing`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success === true) {
        setDataForPricesAppliedGet(response?.data?.data);
        setStep(5);
        // window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(
          response?.data?.message ||
            "An error occurred. Please try again later."
        );
        setDataForPricesAppliedGet({});
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(
        error.response?.status === 400
          ? "Invalid request. Please check your inputs."
          : "An error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  console.log("setDataForPricesAppliedGet : ", setDataForPricesAppliedGet);

  const dishesArray = Array.isArray(DataForPricesAppliedGet.dishes)
    ? DataForPricesAppliedGet.dishes
    : JSON.parse(DataForPricesAppliedGet.dishes || "[]");

  const [selectedCoupon, setSelectedCoupon] = useState(null); // State to hold the selected coupon
  const [isCouponsVisible, setIsCouponsVisible] = useState(false); // State to toggle coupon menu visibility

  // Function to handle radio button change
  const handleRadioChange = (voucherId) => {
    setSelectedCoupon(voucherId); // Update the selected coupon when a radio button is clicked
  };

  // Handle visibility of coupons dropdown
  const handleCouponsVisibility = () => {
    setIsCouponsVisible((prevState) => !prevState);
  };

  const [BookingForGuestName, setBookingForGuestName] = useState("");

  useEffect(() => {
    const storedName = sessionStorage.getItem("user_name");
    if (storedName) {
      setBookingForGuestName(storedName);
    }
  }, []);

  const [step, setStep] = useState(1); // Manage the current step

  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  });

  const [selectedTime, setSelectedTime] = useState("");
  const [minTime, setMinTime] = useState("");

  useEffect(() => {
    updateMinTime(new Date());
  }, []);

  const formatTimeTo12Hour = (time) => {
    const [hours, minutes] = time.split(":").map(Number);

    // Convert hours to 12-hour format
    const adjustedHours = hours % 12 || 12; // If hours is 0 or 12, it should display 12 (AM/PM format)
    const period = hours < 12 ? "AM" : "PM";

    // Return the formatted time
    return `${adjustedHours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  // Helper to get current time in HH:MM format in Asia/Kolkata timezone
  const getCurrentTimeInDelhi = () => {
    const now = new Date();
    const delhiTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const hours = String(delhiTime.getHours()).padStart(2, "0");
    const minutes = String(
      Math.floor(delhiTime.getMinutes() / 15) * 15
    ).padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const updateMinTime = (date) => {
    const isToday = date.toDateString() === new Date().toDateString();
    setMinTime(isToday ? getCurrentTimeInDelhi() : "00:00");
  };

  // const handleDateChange = (newDate) => {
  //   const delhiDate = new Date(
  //     newDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  //   );

  //   setSelectedDate(delhiDate);

  //   const isToday = delhiDate.toDateString() === new Date().toDateString();

  //   if (isToday) {
  //     updateMinTime(new Date()); // Update minTime to current time for today
  //   } else {
  //     setMinTime("00:00"); // Reset minTime for future dates
  //   }

  //   setSelectedTime(""); // Clear the time selection
  // };

  // Handle date change
  const handleDateChange = (newDate) => {
    console.log("New Date:", newDate); // Log the value of newDate
    if (!newDate) {
      console.error("Invalid date selected:", newDate);
      return;
    }

    const delhiDate = new Date(
      newDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    console.log("Delhi Date:", delhiDate); // Log the computed Delhi date
    setSelectedDate(delhiDate);

    const isToday = delhiDate.toDateString() === new Date().toDateString();

    if (isToday) {
      setMinTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      ); // Set minTime for today
    } else {
      setMinTime("00:00"); // Reset minTime for future dates
    }

    setSelectedTime(""); // Clear the time selection
  };

  const getUpcomingDatesToVisits = (startDate, endDate) => {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      console.error("Invalid date parameters");
      return [];
    }

    // Calculate the total number of days between start and end dates
    const totalDays = differenceInDays(endDate, startDate);

    // Generate dates array
    const dates = Array.from({ length: totalDays + 1 }, (_, i) =>
      addDays(startDate, i)
    );

    console.log("Generated Dates:", dates); // Log for debugging
    return dates;
  };

  // Generate dynamic dates
  const getUpcomingDates = () => {
    const today = new Date();
    return Array.from({ length: 60 }, (_, i) => addDays(today, i)); // 7 days for performance optimization
  };

  const generateTimeIntervals = () => {
    const intervals = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        intervals.push(
          `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`
        );
      }
    }
    return intervals;
  };

  const timeOptions = generateTimeIntervals();

  const timeToMinutes = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  };

  const getCurrentTimeInHHMM = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };
  const [filteredTimeOptions, setFilteredTimeOptions] = useState([]);
  const [adjustedStartTime, setAdjustedStartTime] = useState(0);

  useEffect(() => {
    if (basicDataByGet?.sub_category?.booking_time_before) {
      setAdjustedStartTime(basicDataByGet.sub_category.booking_time_before);
    }
  }, [basicDataByGet]);

  useEffect(() => {
    const filterTimeOptions = () => {
      if (!selectedDate || timeOptions.length === 0) return;

      const currentDate = new Date();
      const today = currentDate.toDateString();
      const currentTime = getCurrentTimeInHHMM();

      const serviceStartTime =
        basicDataByGet?.sub_category?.service_start_time || "00:00";
      const serviceEndTime =
        basicDataByGet?.sub_category?.service_end_time || "23:59";

      const currentTimeInMinutes = timeToMinutes(currentTime);
      let startBoundary = timeToMinutes(serviceStartTime);

      console.log(
        currentTimeInMinutes,
        "currentTimeInMinutescurrentTimeInMinutes"
      );
      console.log(adjustedStartTime, "adjustedStartTimeadjustedStartTime");

      if (selectedDate.toDateString() === today) {
        // Consider both current time and adjusted start time
        startBoundary = Math.max(
          currentTimeInMinutes,
          startBoundary,
          adjustedStartTime
        );
      }

      const options = timeOptions.filter((time) => {
        const timeInMinutes = timeToMinutes(time);
        return (
          timeInMinutes >= startBoundary &&
          timeInMinutes <= timeToMinutes(serviceEndTime)
        );
      });

      setFilteredTimeOptions(options);
    };

    filterTimeOptions();
  }, [selectedDate, basicDataByGet, adjustedStartTime]);

  const [people, setPeople] = useState(1);

  const [SelectedObjectOfPeople, setSelectedObjectOfPeople] = useState(null);

  const [totalPrice, setTotalPrice] = useState();
  const [approxTime, setApproxTime] = useState();
  const [basePrice, setBasePrice] = useState(totalPrice);

  const [specialRequests, setSpecialRequests] = useState();

  const [selectedLocation, setSelectedLocation] = useState({});

  const [selectedLocationFromForDriver, setSelectedLocationFromForDriver] =
    useState({});
  const [selectedLocationToForDriver, setSelectedLocationToForDriver] =
    useState({});

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      setSelectedLocation(addresses[0]);
      setSelectedLocationFromForDriver(addresses[0]);
      setSelectedLocationToForDriver(addresses[0]);
    }
  }, [addresses]);

  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);

  const nextStep = () => {
    setLoading(true);
    setStep((prev) => prev + 1);
    setLoading(false);
  };

  const prevStep = () => {
    setLoading(true);

    setStep((prev) => prev - 1);
    setLoading(false);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenTra, setIsDropdownOpenTra] = useState(false);

  const [selectedCarType, setSelectedCarType] = useState(""); // Renamed state

  const carOptions = [
    { id: 1, name: "SUV" },
    { id: 2, name: "Sedan" },
    { id: 3, name: "Hatchback" },
    { id: 4, name: "Luxury" },
  ];

  // Handle checkbox change
  const handleCheckboxChangeForDriver = (name) => {
    setSelectedCarType(name);
    setIsDropdownOpen(false);
  };

  const [selectedCarTransmissionType, setSelectedCarTransmissionType] =
    useState(""); // Renamed state

  const carTransmissionOptions = [
    { id: 1, name: "Manual" },
    { id: 2, name: "Automatic" },
  ];

  // Handle checkbox change
  const handleCheckboxChangeForDriverCarTransmission = (name) => {
    setSelectedCarTransmissionType(name);
    setIsDropdownOpenTra(false);
  };

  const validateFieldsStepOne = (e) => {
    e.preventDefault();

    // if (service.id !== 9) {
    if (
      BookingForGuestName === "" ||
      selectedDate === "" ||
      selectedTime === "" ||
      people <= 0
    ) {
      setMessage("Please fill all required fields.");
      setShow(true);
      handleShow();
      return;
    }
    // }

    if (service?.category_id === 2) {
      if (
        BookingForGuestName === "" ||
        selectedDate === "" ||
        selectedTime === "" ||
        (service?.category_id === 2 &&
          (selectedCarTransmissionType === "" || selectedCarType === ""))
      ) {
        setMessage("Please fill all required fields.");
        setShow(true);
        handleShow();
        return;
      }
    }

    nextStep();
  };

  const [locationData, setLocationData] = useState({
    latitude: "",
    longitude: "",
    city: "",
    district: "",
    state: "",
    country: "",
    postalCode: "",
    formattedAddress: "",
    landmark: "",
    streetAddressLine2: "",
  });

  const fetchDefaultAddress = async (addressId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/address/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();

        if (result.success === true) {
          const data = result.data; // Data fetched successfully

          setLocationData({
            latitude: data?.latitude || "",
            longitude: data?.longitude || "",
            city: data?.city || "",
            district: data?.district || "",
            state: data?.state || "",
            country: data?.country || "",
            postalCode: data?.postal_code || "", // Correcting the naming
            formattedAddress: data?.formatted_address || "", // Correcting the naming
            landmark: data?.landmark || "",
            streetAddressLine2: data?.street_address_line2 || "", // Correcting the naming
          });
          setLoading(false);
        } else {
          setLoading(false);
          // Show error message via toast
          toast.error(`Failed to fetch address: ${result.message}`);
        }
      } else {
        setLoading(false);
        // Handle failed response status
        toast.error("Error fetching address: " + response.statusText);
      }
    } catch (error) {
      setLoading(false);
      // Show error message via toast
      toast.error(`Error fetching address: ${error.message}`);
    }
  };

  const [callRazorPay, setCallRazorPay] = useState(false);
  const [BookingData, setBookingData] = useState();

  const selectedCouponObject = DataForPricesAppliedGet?.discount?.find(
    (coupon) => coupon.voucher_id === selectedCoupon
  );

  const voucherCode = selectedCouponObject
    ? selectedCouponObject.voucher_code
    : null;

  const handlePayment = async (mod) => {
    setLoading(true);

    // const selectedCouponObject = DataForPricesAppliedGet?.discount?.find(
    //   (coupon) => coupon.voucher_id === selectedCoupon
    // );

    // const voucherCode = selectedCouponObject
    //   ? selectedCouponObject.voucher_code
    //   : null;

    try {
      const body = {
        booking: {
          booking_id: DataForPricesAppliedGet
            ? DataForPricesAppliedGet.booking_id
            : "",
          payment_mode: mod,
          voucher_code: voucherCode ? voucherCode : "",
        },
      };

      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/book_service`,

        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);

      if (response.status === 200) {
        // toast.success(response?.data?.message || "Successful!");

        if (mod === "cod") {
          // toast.info("Please confirm your booking to proceed.");

          nextStep(true);
        }

        if (response?.data?.order) {
          if (response.data.order?.success === false) {
            toast.error(response.data.order?.message || "An error occurred!");
          } else {
            setBookingData(response?.data?.order);
            setCallRazorPay(true);
          }
        } else {
          setBookingData(null);
          setCallRazorPay(false);
        }
      } else {
        // toast.error(response.data.error_msg || "Please try again.");
        // setModalMessage(response.data.error_msg || "Please try again.");
        // setShowModal(true);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      // toast.error("An error occurred. Please try again later.");
      // setModalMessage("An error occurred. Please try again later.");
    }
  };

  const handleConfirmAddress = (e) => {
    e.preventDefault();

    if (service?.category_id === 2) {
      // console.log(DriverCoordinates,"DriverCoordinatesDriverCoordinates")
      if (
        !DriverCoordinates ||
        !DriverCoordinates.startPoint ||
        !DriverCoordinates.startCoordinates ||
        !DriverCoordinates.startCoordinates.lat ||
        !DriverCoordinates.startCoordinates.lng ||
        !DriverCoordinates.endPoint ||
        !DriverCoordinates.endCoordinates ||
        !DriverCoordinates.endCoordinates.lat ||
        !DriverCoordinates.endCoordinates.lng ||
        !DriverCoordinates.distance ||
        !DriverCoordinates.duration
      ) {
        toast.error(
          "Please provide complete pickup and drop location details."
        );
        return;
      }
    }

    if (service?.category_id !== 2) {
      if (!selectedLocation?.address_id) {
        toast.error("Please provide address details.");
        return;
      }
    }

    FunctionDataForPricesApplied();

    // setStep(5);
    // window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [
    OptionsForNumberOFHoursForGardnerArray,
    setOptionsForNumberOFHoursForGardnerArray,
  ] = useState([]);
  const [
    SelectedNumberOfHoursObjectForGardner,
    setSelectedNumberOfHoursObjectForGardner,
  ] = useState({ hours: 0, price: 0 });

  useEffect(() => {
    if (basicDataByGet?.gardener_time_durations?.length) {
      setOptionsForNumberOFHoursForGardnerArray(
        basicDataByGet?.gardener_time_durations
      );
      // Initialize with the first option's hours and price
      const firstOption = basicDataByGet?.gardener_time_durations[0];
      setSelectedNumberOfHoursObjectForGardner({
        hours: firstOption.hours,
        price: firstOption.price,
      });
    }
  }, [basicDataByGet]);

  // Handle decrement
  const handleDecrementHousForGardner = () => {
    const currentIndex = OptionsForNumberOFHoursForGardnerArray.findIndex(
      (option) => option.hours === SelectedNumberOfHoursObjectForGardner?.hours
    );

    if (currentIndex > 0) {
      const previousOption =
        OptionsForNumberOFHoursForGardnerArray[currentIndex - 1];
      setSelectedNumberOfHoursObjectForGardner({
        hours: previousOption.hours,
        price: previousOption.price,
      });
    } else {
      // Show toast notification for min limit
      toast.error("You have to select at least the minimum number of hours.");
    }
  };

  // Handle increment
  const handleIncrementHousForGardner = () => {
    const currentIndex = OptionsForNumberOFHoursForGardnerArray.findIndex(
      (option) => option.hours === SelectedNumberOfHoursObjectForGardner?.hours
    );

    if (currentIndex < OptionsForNumberOFHoursForGardnerArray.length - 1) {
      const nextOption =
        OptionsForNumberOFHoursForGardnerArray[currentIndex + 1];
      setSelectedNumberOfHoursObjectForGardner({
        hours: nextOption.hours,
        price: nextOption.price,
      });
    } else {
      // Show toast notification for max limit
      toast.error("You've reached the maximum number of hours.");
    }
  };

  const [
    OptionsForNumberOFHoursForDriverArray,
    setOptionsForNumberOFHoursForDriverArray,
  ] = useState([]);
  const [
    SelectedNumberOfHoursObjectForDriver,
    setSelectedNumberOfHoursObjectForDriver,
  ] = useState({ hours: 0, price: 0 });

  useEffect(() => {
    if (basicDataByGet?.driver_time_durations?.length) {
      setOptionsForNumberOFHoursForDriverArray(
        basicDataByGet?.driver_time_durations
      );
      // Initialize with the first option's hours and price
      const firstOption = basicDataByGet?.driver_time_durations[0];
      setSelectedNumberOfHoursObjectForDriver({
        hours: firstOption.hours,
        price: firstOption.price,
      });
    }
  }, [basicDataByGet]);

  // Handle decrement
  const handleDecrementHousForDriver = () => {
    const currentIndex = OptionsForNumberOFHoursForDriverArray.findIndex(
      (option) => option.hours === SelectedNumberOfHoursObjectForDriver?.hours
    );

    if (currentIndex > 0) {
      const previousOption =
        OptionsForNumberOFHoursForDriverArray[currentIndex - 1];
      setSelectedNumberOfHoursObjectForDriver({
        hours: previousOption.hours,
        price: previousOption.price,
      });
    } else {
      // Show toast notification for min limit
      toast.error("You have to select at least the minimum number of hours.");
    }
  };

  // Handle increment
  const handleIncrementHousForDriver = () => {
    const currentIndex = OptionsForNumberOFHoursForDriverArray.findIndex(
      (option) => option.hours === SelectedNumberOfHoursObjectForDriver?.hours
    );

    if (currentIndex < OptionsForNumberOFHoursForDriverArray.length - 1) {
      const nextOption =
        OptionsForNumberOFHoursForDriverArray[currentIndex + 1];
      setSelectedNumberOfHoursObjectForDriver({
        hours: nextOption.hours,
        price: nextOption.price,
      });
    } else {
      // Show toast notification for max limit
      toast.error("You've reached the maximum number of hours.");
    }
  };

  const [
    OptionsForNumberOFSlotsForMonthlyGardnerArray,
    setOptionsForNumberOFSlotsForMonthlyGardnerArray,
  ] = useState([]);
  const [
    SelectedNumberOfSlotsObjectForMonthlyGardner,
    setSelectedNumberOfSlotsObjectForMonthlyGardner,
  ] = useState({ visit: 0, hours: 0, price: 0 });

  useEffect(() => {
    if (basicDataByGet?.gardener_monthly_subscriptions?.length) {
      setOptionsForNumberOFSlotsForMonthlyGardnerArray(
        basicDataByGet?.gardener_monthly_subscriptions
      );
      // Initialize with the first option's hours and price
      const firstOption = basicDataByGet?.gardener_monthly_subscriptions[0];
      setSelectedNumberOfSlotsObjectForMonthlyGardner({
        visit: firstOption.visit,
        hours: firstOption.hours,
        price: firstOption.price,
      });
    }
  }, [basicDataByGet]);

  const handleDecrementVisitsForMonthlyGardner = () => {
    const currentIndex =
      OptionsForNumberOFSlotsForMonthlyGardnerArray.findIndex(
        (option) =>
          option.visit === SelectedNumberOfSlotsObjectForMonthlyGardner?.visit
      );

    if (currentIndex > 0) {
      const previousOption =
        OptionsForNumberOFSlotsForMonthlyGardnerArray[currentIndex - 1];
      setSelectedNumberOfSlotsObjectForMonthlyGardner({
        visit: previousOption.visit,
        hours: previousOption.hours,
        price: previousOption.price,
      });
    } else {
      // Show toast notification for min limit
      toast.error("You have to select at least the minimum number of visit.");
    }
  };

  const handleIncrementVisitsForMonthlyGardner = () => {
    const currentIndex =
      OptionsForNumberOFSlotsForMonthlyGardnerArray.findIndex(
        (option) =>
          option.visit === SelectedNumberOfSlotsObjectForMonthlyGardner?.visit
      );

    if (
      currentIndex <
      OptionsForNumberOFSlotsForMonthlyGardnerArray.length - 1
    ) {
      const nextOption =
        OptionsForNumberOFSlotsForMonthlyGardnerArray[currentIndex + 1];
      setSelectedNumberOfSlotsObjectForMonthlyGardner({
        visit: nextOption.visit,
        hours: nextOption.hours,
        price: nextOption.price,
      });
    } else {
      // Show toast notification for max limit
      toast.error("You've reached the maximum number of visits.");
    }
  };

  const minPeople = basicDataByGet?.no_of_people[0]?.people_count;
  const maxPeople =
    basicDataByGet?.no_of_people[basicDataByGet?.no_of_people.length - 1]
      ?.people_count;

  const htmlToText = (htmlString) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlString;
    return tempElement.textContent || tempElement.innerText;
  };

  useEffect(() => {
    setdishesOptionsArray(basicDataByGet?.dishes);
  }, [basicDataByGet]);

  // Initialize the menu with default quantities
  useEffect(() => {
    if (basicDataByGet?.menu) {
      const initialMenu = basicDataByGet?.menu.map((item, index) => ({
        ...item,
        quantity: index === 0 ? 1 : 0, // Set 1 for the first item, 0 for others
      }));
      setMenuItems(initialMenu);

      // Initialize selectedMenuItemsForChefForParty based on the menu
      const initialSelectedItems = basicDataByGet?.menu.map((item, index) => ({
        name: item.name,
        price: item.price,
        quantity: index === 0 ? 1 : 0, // Set 1 for the first item, 0 for others
      }));
      setSelectedMenuItemsForChefForParty(initialSelectedItems);
    }
  }, [basicDataByGet]);

  // Calculate the total quantity of all selected items
  const calculateTotalQuantityForChefForParty = () => {
    return selectedMenuItemsForChefForParty.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  const calculateTotalPriceForMenuForChefForParty = () => {
    return selectedMenuItemsForChefForParty.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleQuantityChangeForMenuItemsForChefForParty = (index, value) => {
    const totalQuantity = calculateTotalQuantityForChefForParty();

    // if (
    //   totalQuantity + value - selectedMenuItemsForChefForParty[index].quantity >
    //   4
    // ) {
    //   toast.error("Maximum total quantity reached (4).");
    //   return;
    // }

    // Prevent negative quantities for individual items
    if (value < 0) value = 0;

    // Prevent the total quantity from being less than 1
    const newTotalQuantity =
      totalQuantity + value - selectedMenuItemsForChefForParty[index].quantity;
    if (newTotalQuantity < 1) {
      toast.error("You have to select at least 1 menu.");
      return; // Prevent further changes if total quantity would become less than 1
    }

    // Update the selectedMenuItemsForChefForParty state
    const updatedSelectedItems = [...selectedMenuItemsForChefForParty];
    updatedSelectedItems[index].quantity = value;
    setSelectedMenuItemsForChefForParty(updatedSelectedItems);
  };

  // Calculate the total price for each item
  const calculateTotalForMenuItemForChefForParty = (price, quantity) =>
    price * quantity;

  const [dishesOptionsArrayOri, setDishesOptionsArrayOri] = useState([]);

  // Set dishesOptionsArrayOri in useEffect
  useEffect(() => {
    if (basicDataByGet?.dishes) {
      const options = basicDataByGet.dishes.map((dish) => ({
        id: String(dish?.dish_id), // Ensure IDs are strings
        name: dish?.dish_name || "Unnamed Dish",
      }));
      setDishesOptionsArrayOri(options); // Update state
    } else {
      setDishesOptionsArrayOri([]); // Set an empty array if dishes are undefined
    }
  }, [basicDataByGet]); // Re-run when basicDataByGet changes

  const handleCheckboxChange = (id) => {
    if (menu.includes(id)) {
      setMenu(menu.filter((item) => item !== id));
    } else {
      setMenu([...menu, id]);
    }
  };

  useEffect(() => {
    setPeople(minPeople);
  }, [minPeople]);

  useEffect(() => {
    if (basicDataByGet?.no_of_people?.length > 0) {
      const initialObject = basicDataByGet.no_of_people[0];
      setSelectedObjectOfPeople({
        aprox_time: Number(initialObject.aprox_time),
        price: Number(initialObject.base_price),
        people_count: Number(initialObject.people_count),
      });
    }
  }, [basicDataByGet?.no_of_people]);

  useEffect(() => {
    if (basicDataByGet?.no_of_people) {
      const selectedObject = basicDataByGet.no_of_people.find(
        (item) => Number(item.people_count) === Number(people)
      );

      if (selectedObject) {
        setSelectedObjectOfPeople({
          aprox_time: Number(selectedObject.aprox_time),
          price: Number(selectedObject.base_price),
          people_count: Number(selectedObject.people_count),
        });
      }
    }
  }, [people, basicDataByGet?.no_of_people]);

  const handleIncrement = () => {
    if (people < maxPeople) {
      setPeople(people + 1);
    } else {
      toast.error(`Maximum limit reached: ${maxPeople} people`);
    }
  };

  const handleDecrement = () => {
    if (people > minPeople) {
      setPeople(people - 1);
    } else {
      toast.error(`Minimum limit reached: ${minPeople} people`);
    }
  };

  useEffect(() => {
    if (Array.isArray(basicDataByGet?.no_of_people) && people !== undefined) {
      const selectedEntry = basicDataByGet.no_of_people.find(
        (item) => Number(item?.people_count) === Number(people)
      );

      if (selectedEntry) {
        setTotalPrice(selectedEntry.base_price);
        setApproxTime(selectedEntry.aprox_time);
      } else {
        console.log("No matching entry found for people:", people);
      }
    }
  }, [people, basicDataByGet?.no_of_people]);

  useEffect(() => {
    if (dishesOptionsArrayOri && dishesOptionsArrayOri.length > 0) {
      const selectedOptions = dishesOptionsArrayOri.filter((option) =>
        menu.includes(option?.id)
      );
      setSelectedNamesOfDishes(selectedOptions.map((option) => option.name));
    } else {
      setSelectedNamesOfDishes([]);
    }
  }, [menu, dishesOptionsArrayOri]);

  const formatTime = (timeInMinutes) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours} hour(s) and ${minutes} minute(s)`;
    } else if (hours > 0) {
      return `${hours} hour(s)`;
    } else {
      return `${minutes} minute(s)`;
    }
  };

  useEffect(() => {
    if (service?.id === 3) {
      setBasePrice(
        parseFloat(totalPrice) +
          parseFloat(calculateTotalPriceForMenuForChefForParty())
      );
    } else {
      if (service?.id === 8 && service?.id !== 9) {
        setBasePrice(SelectedNumberOfHoursObjectForGardner?.price);
      } else if (service?.id !== 8 && service?.id === 9) {
        setBasePrice(SelectedNumberOfSlotsObjectForMonthlyGardner?.price);
      } else if (service?.category_id === 2) {
        setBasePrice(SelectedNumberOfHoursObjectForDriver?.price);
      } else {
        setBasePrice(totalPrice);
      }
    }
  }, [
    totalPrice,
    service,
    people,
    selectedMenuItemsForChefForParty,
    SelectedNumberOfHoursObjectForGardner,
    SelectedNumberOfSlotsObjectForMonthlyGardner,
    SelectedNumberOfHoursObjectForDriver,
  ]);

  const getISTDate = (date = new Date()) => {
    // Convert to UTC and adjust by IST offset (+5:30)
    const istOffset = 5 * 60 + 30; // Minutes offset for IST
    const utcDate = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
    return new Date(utcDate + istOffset * 60 * 1000);
  };

  const [MonthlySubscriptionStartDate, setMonthlySubscriptionStartDate] =
    useState(getISTDate());

  const [MonthlySubscriptionEndsDate, setMonthlySubscriptionEndsDate] =
    useState(() => {
      const initialEndDate = getISTDate();
      initialEndDate.setDate(initialEndDate.getDate() + 30);
      return initialEndDate;
    });

  const handleStartDateChange = (newDate) => {
    console.log("New Date:", newDate); // Log the value of newDate

    if (!newDate) {
      console.error("Invalid date selected:", newDate);
      return;
    }

    // Convert newDate to IST
    const delhiDate = new Date(
      newDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    console.log("Delhi Date:", delhiDate); // Log the computed Delhi date
    setSelectedDate(delhiDate);
    setMonthlySubscriptionStartDate(delhiDate);

    // Check if the selected date is today
    const isToday = delhiDate.toDateString() === new Date().toDateString();

    if (isToday) {
      const currentISTTime = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      });
      setMinTime(currentISTTime); // Set minTime for today
    } else {
      setMinTime("00:00"); // Reset minTime for future dates
    }

    // Calculate the end date in IST timezone
    if (newDate) {
      const calculatedEndDate = new Date(
        delhiDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      calculatedEndDate.setDate(calculatedEndDate.getDate() + 30);
      setMonthlySubscriptionEndsDate(calculatedEndDate);
    }

    setSelectedTime(""); // Clear the time selection
  };

  const [selectedVisitDates, setSelectedVisitDates] = useState([]);

  // useEffect(() => {
  //   if (SelectedNumberOfSlotsObjectForMonthlyGardner?.visit > 0) {
  //     // Calculate the hours per visit
  //     const hoursPerVisit =
  //       SelectedNumberOfSlotsObjectForMonthlyGardner.hours /
  //       SelectedNumberOfSlotsObjectForMonthlyGardner.visit;

  //     // Initialize the selected dates array
  //     const newVisitDates = [];

  //     // Calculate the date for each visit
  //     let currentDate = new Date(MonthlySubscriptionStartDate);
  //     for (
  //       let i = 0;
  //       i < SelectedNumberOfSlotsObjectForMonthlyGardner.visit;
  //       i++
  //     ) {
  //       newVisitDates.push({
  //         date: currentDate.toISOString().split("T")[0], // Format date to YYYY-MM-DD
  //         hours: hoursPerVisit,
  //       });

  //       // Increment the date by 7 days for each visit (adjust as needed)
  //       currentDate.setDate(currentDate.getDate() + 3); // You can change the interval as needed
  //     }

  //     // Update the state
  //     setSelectedVisitDates(newVisitDates);
  //   }
  // }, [
  //   SelectedNumberOfSlotsObjectForMonthlyGardner,
  //   MonthlySubscriptionStartDate,
  //   selectedVisitDates
  // ]);

  useEffect(() => {
    if (SelectedNumberOfSlotsObjectForMonthlyGardner?.visit > 0) {
      // const hoursPerVisit =
      //   SelectedNumberOfSlotsObjectForMonthlyGardner.hours /
      //   SelectedNumberOfSlotsObjectForMonthlyGardner.visit;

      const hoursPerVisit = SelectedNumberOfSlotsObjectForMonthlyGardner.hours;

      const newVisitDates = [];
      let currentDate = new Date(MonthlySubscriptionStartDate);
      for (
        let i = 0;
        i < SelectedNumberOfSlotsObjectForMonthlyGardner.visit;
        i++
      ) {
        newVisitDates.push({
          date: currentDate.toISOString().split("T")[0],
          hours: hoursPerVisit,
        });
        currentDate.setDate(currentDate.getDate() + 3);
      }

      setSelectedVisitDates(newVisitDates);
    }
  }, [
    SelectedNumberOfSlotsObjectForMonthlyGardner,
    MonthlySubscriptionStartDate,
  ]);

  const convertToAmPm = (time) => {
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours, 10);
    const amPm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 hour to 12 for AM/PM format

    return `${hour}:${minutes} ${amPm}`;
  };

  const handleApplyCoupen = async () => {
    setLoading(true);

    const selectedCouponObject = DataForPricesAppliedGet?.discount?.find(
      (coupon) => coupon.voucher_id === selectedCoupon
    );

    const voucherCode = selectedCouponObject
      ? selectedCouponObject.voucher_code
      : null;

    try {
      const body = {
        booking_id: DataForPricesAppliedGet?.booking_id || "",
        voucher_code: voucherCode || "",
      };

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/discount/verify`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setDataForPricesAppliedGet(response?.data?.data);
        setOriginalData(response?.data?.data); // Store the discounted data as the new base
        toast.success(response?.data?.message || "Coupon applied successfully.");
        setIsCouponsVisible(false);
      } else {
        toast.error(response?.data?.message || "Invalid coupon.");
        setSelectedCoupon(null);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
};


  const [dataAfterUsePoint, setDataAfterUsePoint] = useState({});
  const [originalData, setOriginalData] = useState(null); // Store original data

  const toggleUsePoints = async () => {
    const newUsePoints = !isUsePoints;
    setIsUsePoints(newUsePoints);

    const bookingId = DataForPricesAppliedGet?.booking_id;

    if (newUsePoints && bookingId) {
      // Store the latest discounted data before applying points
      if (!originalData) {
        setOriginalData(DataForPricesAppliedGet);
      }

      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/booking_wallet_points_use`,
          { booking_id: bookingId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDataForPricesAppliedGet(response?.data?.data);
        console.log("API Response after checkbox ticked:", response?.data?.data);
      } catch (error) {
        console.error("Error calling API:", error);
      } finally {
        setLoading(false);
      }
    } else if (!newUsePoints && originalData) {
      setDataForPricesAppliedGet(originalData); // Restore the discounted price
      setOriginalData(null);
      console.log("Restored original data after unticking checkbox:", originalData);
    }
};


  const [DriverCoordinates, setDriverCoordinates] = useState({});

  const handleSelectedPoints = (data) => {
    // console.log('Selected Route Details:', data);
    setDriverCoordinates(data);
    // alert(`Start Point: ${data.startPoint}\nEnd Point: ${data.endPoint}\nDistance: ${data.distance}`);
  };

  const handleRemoveCoupen = async () => {
    setLoading(true);

    try {
      const body = {
        booking_id: DataForPricesAppliedGet
          ? DataForPricesAppliedGet.booking_id
          : "",
        //  voucher_code: voucherCode ? voucherCode : "",
        voucher_code: "",
      };

      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/discount/verify`,

        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);

      if (response.data.success) {
        setDataForPricesAppliedGet(response?.data?.data);
        // toast.success(response?.data?.message || "Coupen id Valid.");
        toast.success("Coupen removed succesfully");
        setIsCouponsVisible(true);
        setSelectedCoupon(null);
      } else {
        toast.error(
          response?.data?.message || "Coupen id Invalid at this time."
        );
        setSelectedCoupon(null);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const [showMoreCancellationPolicy, setShowMoreCancellationPolicy] =
    useState(false);
  const [showMoreBookingSummary, setShowMoreBookingSummary] = useState(false);
  const [showMoreAdditionalDetails, setShowMoreAdditionalDetails] =
    useState(false);

  const toggleVisibility = (type) => {
    console.log("Clicked", type);
    if (type === "cancellation") {
      setShowMoreCancellationPolicy(!showMoreCancellationPolicy);
    } else if (type === "booking") {
      setShowMoreBookingSummary(!showMoreBookingSummary);
    } else if (type === "additional") {
      setShowMoreAdditionalDetails(!showMoreAdditionalDetails);
    }
  };

  // Function to limit text to a specific number of words
  const limitTextByWords = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" "); // Split by spaces to get words
    return words.slice(0, wordLimit).join(" "); // Limit the number of words and join them back
  };

  const cancellationPolicy = htmlToText(
    basicDataByGet?.sub_category?.cancellation_policy || ""
  );
  const additionalDetails = htmlToText(
    basicDataByGet?.sub_category?.booking_details || ""
  );
  const bookingSummery = htmlToText(
    basicDataByGet?.sub_category?.booking_summary || ""
  );

  const wordLimit = 50; // Specify the number of words to display

  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  // });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY, // Your API key
    libraries: ["places"], // Add the Places library here
  });

  // If the script is not loaded, return null or a loader.
  if (!isLoaded) {
    return null; // Or show a custom loader component.
  }

  return (
    <>
      {loading && <Loader />}

      <div className="container nav-container booking-booking-container">
        {step === 1 && (
          <div
            className="booking-booking-form"
            //  onSubmit={handleSubmitForm}
          >
            {loading && <Loader />}

            <div className="booking-form-header">
              <button
                className="booking-back-button"
                onClick={() => navigate("/")}
              >
                ←
              </button>
              <h1 className="booking-form-title">Booking For :</h1>
            </div>

            <form style={{ padding: "1rem" }}>
              <div className="booking-form-group">
                <label className="booking-form-label" htmlFor="guestName">
                  Enter Booking Guest Name
                </label>
                <input
                  type="text"
                  id="guestName"
                  name="guestName"
                  placeholder="Booking Guest Name"
                  value={BookingForGuestName} // Controlled component value
                  onChange={(e) => setBookingForGuestName(e.target.value)} // Updates the selected date
                />
              </div>

              {service?.id !== 9 && (
                <>
                  <div>
                    {/* Date Picker */}
                    {/* <div className="booking-form-group flex-fill">
                      <label
                        className="booking-form-label"
                        htmlFor="date-input"
                      >
                        Select Visit Date
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={selectedDate}
                          onChange={handleDateChange}
                          minDate={new Date()} // Disable past dates
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </div> */}

                    <div className="booking-form flex-fill mb-4">
                      <label className="booking-form-label">
                        Select Visit Date
                      </label>
                      <div className="date-scroll-container">
                        {getUpcomingDates().map((date, index) => {
                          const isSelected =
                            selectedDate &&
                            selectedDate.toDateString() === date.toDateString();
                          return (
                            <div
                              key={index}
                              className={`date-item ${
                                isSelected ? "selected" : ""
                              }`}
                              onClick={() => handleDateChange(date)} // Handle click with div
                              role="button"
                              tabIndex={0}
                              onKeyPress={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  handleDateChange(date); // Handle keyboard interaction
                                }
                              }}
                            >
                              <span className="day">{format(date, "EEE")}</span>
                              <span className="date">{format(date, "dd")}</span>
                              <span className="month">
                                {format(date, "MMM")}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="booking-form-group">
                      <label className="booking-form-label">
                        Select Time of Visit
                      </label>

                      <div
                        className={`booking-time-dropdown-wrapper-time ${
                          isTimeDropdownOpen ? "active" : ""
                        }`}
                        onClick={() => setTimeDropdownOpen(!isTimeDropdownOpen)}
                      >
                        <div className="booking-time-dropdown-button">
                          {selectedTime
                            ? formatTimeTo12Hour(selectedTime)
                            : "Select a time"}
                          <span>{isTimeDropdownOpen ? "▲" : "▼"}</span>
                        </div>

                        {isTimeDropdownOpen &&
                          (filteredTimeOptions.length > 0 ? (
                            <div className="booking-time-options-grid">
                              {filteredTimeOptions.map((time) => (
                                <div
                                  key={time}
                                  className={`booking-time-option ${
                                    selectedTime === time ? "selected" : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedTime(time);
                                    setTimeDropdownOpen(false); // Close dropdown on selection
                                  }}
                                >
                                  {formatTimeTo12Hour(time)}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div
                              className="time-dropdown-placeholder"
                              style={{
                                color: "red",
                                cursor: "not-allowed",
                                opacity: 0.7,
                                padding: "8px",
                                fontStyle: "italic",
                              }}
                            >
                              No more time options are available for choosen
                              date.
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {service?.id === 9 && (
                <>
                  <div>
                    {/* Date Picker */}
                    <div className="booking-form flex-fill mb-4">
                      <label className="booking-form-label">
                        Monthly Package Start Date
                      </label>
                      <div className="date-scroll-container">
                        {getUpcomingDates().map((date, index) => {
                          const isSelected =
                            MonthlySubscriptionStartDate &&
                            MonthlySubscriptionStartDate.toDateString() ===
                              date.toDateString();
                          return (
                            <div
                              key={index}
                              className={`date-item ${
                                isSelected ? "selected" : ""
                              }`}
                              onClick={() => handleStartDateChange(date)} // Handle click with div
                              role="button"
                              tabIndex={0}
                              onKeyPress={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  handleStartDateChange(date); // Handle keyboard interaction
                                }
                              }}
                            >
                              <span className="day">{format(date, "EEE")}</span>
                              <span className="date">{format(date, "dd")}</span>
                              <span className="month">
                                {format(date, "MMM")}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="booking-cooking-time">
                      Your Subscription Starts From: {/* <br /> */}
                      <strong>
                        {MonthlySubscriptionStartDate
                          ? MonthlySubscriptionStartDate.toDateString()
                          : "Not selected"}
                      </strong>
                      <br />
                      Your Subscription Ends At: {/* <br /> */}
                      <strong>
                        {MonthlySubscriptionEndsDate
                          ? MonthlySubscriptionEndsDate.toDateString()
                          : "Not calculated"}
                      </strong>
                    </div>
                  </div>
                </>
              )}

              <div>
                {service?.category_id === 1 && (
                  <>
                    {/* <div className="booking-form-group">
                      <label className="booking-form-label">
                        Number of People
                      </label>
                      <div className="booking-counter-container">
                        <button
                          type="button"
                          className="booking-counter-button"
                          onClick={handleDecrement}
                        >
                          -
                        </button>
                        <span className="booking-counter-value">{people}</span>
                        <button
                          type="button"
                          className="booking-counter-button"
                          onClick={handleIncrement}
                        >
                          +
                        </button>
                      </div>
                      <div className="booking-cooking-time">
                        Total Cooking Time: {formatTime(approxTime)}
                      </div>
                    </div> */}

                    <div className="booking-form-group">
                      <label className="booking-form-label">
                        Number of People
                      </label>

                      <div className="div-people-count">
                        <div className="people-counter-container">
                          <span className="people-counter-label">
                            Select Number of People
                          </span>
                          <div className="people-counter">
                            <button
                              type="button"
                              className="counter-button"
                              onClick={handleDecrement}
                            >
                              -
                            </button>
                            <span className="counter-value">{people}</span>
                            <button
                              type="button"
                              className="counter-button"
                              onClick={handleIncrement}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="cooking-time-container pt-3">
                          <span className="people-counter-label">
                            Estimated Time
                          </span>{" "}
                          <span className="cooking-time-value">
                            {formatTime(approxTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {service?.category_id === 2 && (
                  <>
                    {service.id === 6 && (
                      <>
                        <div className="booking-form-group">
                          <div className="d-flex justify-content-between align-items-center">
                            <label className="booking-form-label mb-0">
                              Number of Hours:
                            </label>
                            <span className="counter-value">
                              Maximum{" "}
                              {SelectedNumberOfHoursObjectForDriver?.hours}{" "}
                              Hours
                            </span>
                          </div>

                          {/* <div className="div-people-count">
                      <div className="people-counter-container">

<span className="people-counter-label">Select Number of Hours</span>
                      <div className="people-counter">
                        <button
                          type="button"
                          className="counter-button"
                          onClick={handleDecrementHousForDriver}
                        >
                          -
                        </button>
                        <span className="counter-value">
                          {SelectedNumberOfHoursObjectForDriver?.hours}
                        </span>
                        <button
                          type="button"
                          className="counter-button"
                          onClick={handleIncrementHousForDriver}
                        >
                          +
                        </button>
                        </div>
                        </div>
                      </div> */}
                        </div>
                      </>
                    )}

                    {service.id !== 6 && service.id !== 7 && (
                      <>
                        <div className="booking-form-group">
                          <label className="booking-form-label">
                            Number of Hours
                          </label>
                          <div className="div-people-count">
                            <div className="people-counter-container">
                              <span className="people-counter-label">
                                Select Number of Hours
                              </span>
                              <div className="people-counter">
                                <button
                                  type="button"
                                  className="counter-button"
                                  onClick={handleDecrementHousForDriver}
                                >
                                  -
                                </button>
                                <span className="counter-value">
                                  {SelectedNumberOfHoursObjectForDriver?.hours}
                                </span>
                                <button
                                  type="button"
                                  className="counter-button"
                                  onClick={handleIncrementHousForDriver}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {service?.id === 7 && (
                      <>
                        <div className="booking-form-group">
                          <label className="booking-form-label">
                            Number of Days
                          </label>
                          <div className="div-people-count">
                            <div className="people-counter-container">
                              <span className="people-counter-label">
                                Select Number of Days
                              </span>
                              <div className="people-counter">
                                <button
                                  type="button"
                                  className="counter-button"
                                  onClick={handleDecrementHousForDriver}
                                >
                                  -
                                </button>
                                <span className="counter-value">
                                  {/* {SelectedNumberOfHoursObjectForDriver?.hours} */}
                                  <span className="counter-value">
                                    {SelectedNumberOfHoursObjectForDriver?.hours &&
                                      `${(
                                        SelectedNumberOfHoursObjectForDriver.hours /
                                        24
                                      ).toFixed(1)} ${
                                        SelectedNumberOfHoursObjectForDriver.hours >
                                        24
                                          ? "days"
                                          : "day"
                                      }`}
                                  </span>
                                </span>
                                <button
                                  type="button"
                                  className="counter-button"
                                  onClick={handleIncrementHousForDriver}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                {service?.category_id === 3 && service?.id === 8 && (
                  <>
                    <div className="booking-form-group">
                      <label className="booking-form-label">
                        Number of Hours
                      </label>

                      <div className="div-people-count">
                        <div className="people-counter-container">
                          <span className="people-counter-label">
                            Select Number of Hours
                          </span>
                          <div className="people-counter">
                            <button
                              type="button"
                              className="counter-button"
                              onClick={handleDecrementHousForGardner}
                            >
                              -
                            </button>
                            <span className="counter-value">
                              {SelectedNumberOfHoursObjectForGardner?.hours}
                            </span>
                            <button
                              type="button"
                              className="counter-button"
                              onClick={handleIncrementHousForGardner}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {service?.category_id === 3 && service?.id === 9 && (
                  <>
                    <div className="booking-form-group">
                      <label className="booking-form-label">
                        Select Time of Visit For All Slots
                      </label>

                      <div
                        className={`booking-time-dropdown-wrapper-time ${
                          isTimeDropdownOpen ? "active" : ""
                        }`}
                        onClick={() => setTimeDropdownOpen(!isTimeDropdownOpen)}
                      >
                        <div className="booking-time-dropdown-button">
                          {selectedTime
                            ? formatTimeTo12Hour(selectedTime)
                            : "Select a time"}
                          <span>{isTimeDropdownOpen ? "▲" : "▼"}</span>
                        </div>

                        {isTimeDropdownOpen &&
                          (filteredTimeOptions.length > 0 ? (
                            <div className="booking-time-options-grid">
                              {filteredTimeOptions.map((time) => (
                                <div
                                  key={time}
                                  className={`booking-time-option ${
                                    selectedTime === time ? "selected" : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedTime(time);
                                    setTimeDropdownOpen(false); // Close dropdown on selection
                                  }}
                                >
                                  {formatTimeTo12Hour(time)}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div
                              className="time-dropdown-placeholder"
                              style={{
                                color: "red",
                                cursor: "not-allowed",
                                opacity: 0.7,
                                padding: "8px",
                                fontStyle: "italic",
                              }}
                            >
                              No more time options are available for choosen
                              date.
                            </div>
                          ))}
                      </div>
                    </div>

                    <div
                      style={{ marginTop: "20px" }}
                      className="booking-form-group"
                    >
                      <label className="booking-form-label">
                        Number of Visiting Slots
                      </label>
                      <div className="div-people-count">
                        {/* 

  <div className="people-counter-container">

    <span className="people-counter-label">Select Number of Visits</span>
    <div className="people-counter">
                        <button
                          type="button"
                          className="counter-button"
                          onClick={handleDecrementVisitsForMonthlyGardner}
                        >
                          -
                        </button>
                        <span className="counter-value">
                          {SelectedNumberOfSlotsObjectForMonthlyGardner?.visit}
                        </span>
                        <button
                          type="button"
                          className="counter-button"
                          onClick={handleIncrementVisitsForMonthlyGardner}
                        >
                          +
                        </button>
                      </div>
                      </div>

 */}

                        <select
                          id="visit-select"
                          value={
                            SelectedNumberOfSlotsObjectForMonthlyGardner
                              ? `${SelectedNumberOfSlotsObjectForMonthlyGardner.visit}-${SelectedNumberOfSlotsObjectForMonthlyGardner.hours}-${SelectedNumberOfSlotsObjectForMonthlyGardner.price}`
                              : ""
                          }
                          onChange={(e) => {
                            const [visit, hours, price] =
                              e.target.value.split("-");
                            const selectedOption =
                              OptionsForNumberOFSlotsForMonthlyGardnerArray.find(
                                (option) =>
                                  option.visit === parseInt(visit, 10) &&
                                  option.hours === parseInt(hours, 10) &&
                                  option.price === price
                              );
                            if (selectedOption) {
                              setSelectedNumberOfSlotsObjectForMonthlyGardner({
                                visit: selectedOption.visit,
                                hours: selectedOption.hours,
                                price: selectedOption.price,
                              });
                            }
                          }}
                          style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "14px",
                            cursor: "pointer",
                            appearance: "none",
                            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666" width="18px" height="18px"><path d="M7 10l5 5 5-5z"/></svg>')`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "calc(100% - 10px) center",
                            backgroundColor: "#fff",
                          }}
                        >
                          {OptionsForNumberOFSlotsForMonthlyGardnerArray.map(
                            (option, index) => {
                              const hours = Math.floor(option.hours / 60);
                              const minutes = option.hours % 60;
                              return (
                                <option
                                  key={index}
                                  value={`${option.visit}-${option.hours}-${option.price}`}
                                >
                                  {`${option.visit} Visit${
                                    option.visit > 1 ? "s" : ""
                                  } - ${
                                    hours
                                      ? `${hours} hr${hours > 1 ? "s" : ""}`
                                      : ""
                                  } ${
                                    minutes
                                      ? `${minutes} min${
                                          minutes > 1 ? "s" : ""
                                        }`
                                      : ""
                                  } per visit`}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>
                    </div>

                    {MonthlySubscriptionStartDate &&
                      MonthlySubscriptionEndsDate &&
                      selectedVisitDates.map((visit, index) => (
                        <div
                          key={index}
                          className="booking-form-group flex-fill"
                        >
                          <label className="booking-form-label">
                            Select Visit Date {index + 1}
                          </label>
                          <div className="date-scroll-container">
                            {/* {getUpcomingDatesToVisits(
                         new Date(MonthlySubscriptionStartDate),
                          new Date(MonthlySubscriptionEndsDate)
                       ).map((date, i) => {
                         const isSelected =
                           visit.date &&
                           new Date(visit.date).toDateString() === date.toDateString();
                         return (
                           <div
                             key={i}
                             className={`date-item ${isSelected ? "selected" : ""}`}
                             onClick={() => {
                               const updatedDates = [...selectedVisitDates];
                               updatedDates[index].date = date.toISOString().split("T")[0];
                               setSelectedVisitDates(updatedDates);
                             }}
                             role="button"
                             tabIndex={0}
                             onKeyPress={(e) => {
                               if (e.key === "Enter" || e.key === " ") {
                                 const updatedDates = [...selectedVisitDates];
                                 updatedDates[index].date = date.toISOString().split("T")[0];
                                 setSelectedVisitDates(updatedDates);
                               }
                             }}
                           >
                             <span className="day">{format(date, "EEE")}</span>
                             <span className="date">{format(date, "dd")}</span>
                             <span className="month">{format(date, "MMM")}</span>
                           </div>
                         );
                       })} */}

                            {getUpcomingDatesToVisits(
                              new Date(MonthlySubscriptionStartDate),
                              new Date(MonthlySubscriptionEndsDate)
                            ).map((date, i) => {
                              const isSelected =
                                visit.date &&
                                new Date(visit.date).toDateString() ===
                                  date.toDateString();

                              return (
                                <div
                                  key={i}
                                  className={`date-item ${
                                    isSelected ? "selected" : ""
                                  }`}
                                  onClick={() => {
                                    const updatedDates = selectedVisitDates.map(
                                      (visitItem, visitIndex) =>
                                        visitIndex === index
                                          ? {
                                              ...visitItem,
                                              date: date
                                                .toISOString()
                                                .split("T")[0],
                                            }
                                          : visitItem
                                    );
                                    setSelectedVisitDates(updatedDates);
                                  }}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      const updatedDates =
                                        selectedVisitDates.map(
                                          (visitItem, visitIndex) =>
                                            visitIndex === index
                                              ? {
                                                  ...visitItem,
                                                  date: date
                                                    .toISOString()
                                                    .split("T")[0],
                                                }
                                              : visitItem
                                        );
                                      setSelectedVisitDates(updatedDates);
                                    }
                                  }}
                                >
                                  <span className="day">
                                    {format(date, "EEE")}
                                  </span>
                                  <span className="date">
                                    {format(date, "dd")}
                                  </span>
                                  <span className="month">
                                    {format(date, "MMM")}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* <div className="cooking-time-container pt-3">
                     <span className="people-counter-label">
                       Average Time per Slot: </span>{" "}
                       <span className="cooking-time-value">
                       {(() => {
                         const totalMinutes = visit.hours;
                         const hours = Math.floor(totalMinutes / 60);
                         const minutes = Math.floor(totalMinutes % 60);
                         return `${hours} hours ${minutes} minutes`;
                       })()}
                       </span>
                     </div> */}
                        </div>
                      ))}
                  </>
                )}

                <div
                  className="booking-form-group"
                  style={{ position: "relative" }}
                >
                  {service?.category_id === 1 &&
                    service?.id !== 3 &&
                    (service?.id !== 8 || service?.id !== 9) && (
                      <>
                        <label className="booking-form-label">
                          Select Dishes (Optional)
                        </label>

                        <div
                          ref={dropdownRef}
                          className="dropdown-container"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}
                        >
                          <div
                            className="dropdown-input"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{
                              cursor: "pointer",
                              padding: "8px",
                              fontSize: "16px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            {menu.length > 0
                              ? `Selected: ${dishesOptionsArrayOri
                                  .filter((option) => menu.includes(option.id))
                                  .map((option) => option.name)
                                  .join(", ")}`
                              : "Select a service"}
                            <span>{isDropdownOpen ? "▲" : "▼"}</span>
                          </div>

                          {isDropdownOpen && (
                            <div
                              className="dropdown-options"
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                backgroundColor: "white",
                                width: "100%",
                                maxHeight: "200px",
                                overflowY: "auto",
                                zIndex: 10,
                                padding: "0",
                              }}
                            >
                              {dishesOptionsArrayOri.map((option) => (
                                <div
                                  key={option.id}
                                  className="dropdown-option"
                                  style={{
                                    padding: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    className="menu-checkbox"
                                    id={`service-${option.id}`}
                                    value={option.id}
                                    checked={menu.includes(option.id)}
                                    onChange={() =>
                                      handleCheckboxChange(option.id)
                                    }
                                    style={{
                                      margin: 0,
                                      cursor: "pointer",
                                    }}
                                  />
                                  <label
                                    htmlFor={`service-${option.id}`}
                                    style={{ margin: 0 }}
                                  >
                                    {option.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                  {service?.category_id === 2 && (
                    <>
                      {/* Car Type Dropdown */}
                      <div
                        ref={dropdownRef}
                        style={{
                          marginTop: "15px",
                          marginBottom: "10px",
                          position: "relative",
                        }}
                      >
                        <label className="booking-form-label">
                          Select Cars Type
                        </label>
                        <div
                          className="dropdown-container"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}
                        >
                          <div
                            ref={dropdownRef}
                            className="dropdown-input"
                            onClick={() => {
                              setIsDropdownOpen(!isDropdownOpen);
                              setIsDropdownOpenTra(false);
                            }}
                            style={{
                              cursor: "pointer",
                              padding: "8px",
                              fontSize: "16px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            {selectedCarType
                              ? `Selected: ${selectedCarType}`
                              : "Select a car type"}
                            <span>{isDropdownOpen ? "▲" : "▼"}</span>
                          </div>

                          {isDropdownOpen && (
                            <div
                              className="dropdown-options"
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                backgroundColor: "white",
                                width: "100%",
                                maxHeight: "200px",
                                overflowY: "auto",
                                zIndex: 10,
                              }}
                            >
                              {carOptions.map((option) => (
                                <div
                                  key={option.id}
                                  className="dropdown-option"
                                  style={{
                                    padding: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <input
                                    type="radio"
                                    className="menu-checkbox"
                                    id={`service-${option.name}`}
                                    value={option.id}
                                    checked={selectedCarType === option.name}
                                    onChange={() =>
                                      handleCheckboxChangeForDriver(option.name)
                                    }
                                    style={{
                                      margin: 0,
                                      cursor: "pointer",
                                    }}
                                  />
                                  <label
                                    htmlFor={`service-${option.id}`}
                                    style={{ margin: 0 }}
                                  >
                                    {option.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Transmission Type Dropdown */}
                      <div
                        style={{
                          marginTop: "15px",
                          marginBottom: "10px",
                          position: "relative",
                        }}
                      >
                        <label className="booking-form-label">
                          Select Transmission Type
                        </label>
                        <div
                          className="dropdown-container-tra"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}
                        >
                          <div
                            className="dropdown-input-tra"
                            onClick={() => {
                              setIsDropdownOpenTra(!isDropdownOpenTra);
                              setIsDropdownOpen(false);
                            }}
                            style={{
                              cursor: "pointer",
                              padding: "8px",
                              fontSize: "16px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            {selectedCarTransmissionType
                              ? `Selected: ${selectedCarTransmissionType}`
                              : "Select a transmission type"}
                            <span>{isDropdownOpenTra ? "▲" : "▼"}</span>
                          </div>

                          {isDropdownOpenTra && (
                            <div
                              className="dropdown-options-tra"
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                backgroundColor: "white",
                                width: "100%",
                                maxHeight: "200px",
                                overflowY: "auto",
                                zIndex: 10,
                                textAlign: "left", // Ensure text starts from the left
                              }}
                            >
                              {carTransmissionOptions.map((option) => (
                                <div
                                  key={option.id}
                                  className="dropdown-option-tra"
                                  style={{
                                    padding: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    justifyContent: "flex-start", // Align items to the left
                                  }}
                                >
                                  <input
                                    type="radio"
                                    className="menu-checkbox-tra"
                                    id={`tra-service-${option.name}`}
                                    value={option.id}
                                    checked={
                                      selectedCarTransmissionType ===
                                      option.name
                                    }
                                    onChange={() =>
                                      handleCheckboxChangeForDriverCarTransmission(
                                        option.name
                                      )
                                    }
                                    style={{
                                      margin: 0,
                                      cursor: "pointer",
                                      width: "4%",
                                    }}
                                  />
                                  <label
                                    htmlFor={`tra-service-${option.id}`}
                                    style={{ margin: 0 }}
                                  >
                                    {option.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {service?.id === 3 && (
                    <>
                      <div className="menu-form">
                        <label className="booking-form-label">
                          Select Menu Items
                        </label>

                        <table
                          style={{ width: "100%", borderCollapse: "collapse" }}
                        >
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedMenuItemsForChefForParty.map(
                              (item, index) => (
                                <tr key={index}>
                                  <td>{item.name}</td>
                                  {/* <td>₹ {item.price}</td> */}
                                  <td>₹ {parseInt(item.price, 10)}</td>

                                  <td>
                                    <input
                                      type="number"
                                      value={item.quantity}
                                      min={0}
                                      max={4}
                                      onChange={(e) =>
                                        handleQuantityChangeForMenuItemsForChefForParty(
                                          index,
                                          parseInt(e.target.value) || 0
                                        )
                                      }
                                      style={{
                                        width: "50px",
                                        padding: "5px",
                                        border: "1px solid #ddd",
                                      }}
                                    />
                                  </td>
                                  <td>
                                    ₹{" "}
                                    {calculateTotalForMenuItemForChefForParty(
                                      item.price,
                                      item.quantity
                                    )}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>

                        <div>
                          {/* <h3>Total Quantity: {calculateTotalQuantityForChefForParty()}</h3>
        <h3>Total Price: ₹ {calculateTotalPriceForMenuForChefForParty()}</h3> */}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="booking-form-group">
                <label className="booking-form-label">
                  Special Requests / Instructions (Optional)
                </label>
                <input
                  className="booking-textarea"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Enter Your Special Request"
                />
              </div>

              <div>
                {/* <div className="additional-details">
              <h3>Additional Details</h3>
              <div className="details-item">
                <span className="mb-1">🌙 Night Surcharge Policy</span>
                <span className="mb-1">
  ⏰ Timing : {convertTo12HourFormat(basicDataByGet?.sub_category?.service_start_time)} to {convertTo12HourFormat(basicDataByGet?.sub_category?.service_end_time)}
</span>

<span className="mb-1">


</span>

              </div>
            </div> */}
                <div className="additional-details">
                  <h3>Additional Details</h3>
                  <div className="details-item">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: showMoreAdditionalDetails
                          ? basicDataByGet?.sub_category?.booking_details || ""
                          : limitTextByWords(
                              basicDataByGet?.sub_category?.booking_details ||
                                "",
                              wordLimit
                            ),
                      }}
                    />
                    <div>
                      <a
                        onClick={() => toggleVisibility("additional")}
                        className="view-more-btn"
                      >
                        {showMoreAdditionalDetails ? "View Less" : "View More"}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="cancellation-policy">
                  <h3>Cancellation Policy</h3>
                  <div className="cancellation-policy-div">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: showMoreBookingSummary
                          ? basicDataByGet?.sub_category?.cancellation_policy ||
                            ""
                          : limitTextByWords(
                              basicDataByGet?.sub_category
                                ?.cancellation_policy || "",
                              wordLimit
                            ),
                      }}
                    />
                    {/* <br/> */}
                    <div>
                      <a
                        onClick={() => toggleVisibility("cancellation")}
                        className="view-more-btn"
                      >
                        {showMoreCancellationPolicy ? "View Less" : "View More"}
                      </a>
                    </div>

                    {/* <br/> */}
                    <a
                      href="/cancellation-policy"
                      className="read-policy-button"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      READ CANCELLATION POLICY
                      <IoIosArrowForward className="arrow_for_cancellation" />
                    </a>
                  </div>
                </div>
              </div>

              {/*               

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #ddd",
                        fontWeight: "bold",
                      }}
                    >
                      Night Charge
                    </td>
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                    >
                      ₹{" "}
                      {basicDataByGet?.sub_category?.night_charge ||
                        "Not Available"}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #ddd",
                        fontWeight: "bold",
                      }}
                    >
                      Night Charge Starts From
                    </td>
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                    >
                      {convertTo12HourFormat(
                        basicDataByGet?.sub_category?.night_charge_start_time
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #ddd",
                        fontWeight: "bold",
                      }}
                    >
                      Night Charge Ends At
                    </td>
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                    >
                      {convertTo12HourFormat(
                        basicDataByGet?.sub_category?.night_charge_end_time
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #ddd",
                        fontWeight: "bold",
                      }}
                    >
                      Cancellation Facility will be Available Before
                    </td>
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                    >
                      {formatTime(
                        basicDataByGet?.sub_category?.cancellation_time_before
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #ddd",
                        fontWeight: "bold",
                      }}
                    >
                      Free Cancellation will be Available Before
                    </td>
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                    >
                      {formatTime(
                        basicDataByGet?.sub_category
                          ?.free_cancellation_time_before
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              
              
              */}

              {/* {service?.category_id === 2 && (
<div className="d-flex align-items-center gap-2 details-item " style={{marginTop:"20px", flexDirection:"row"}}>
  <input
    type="checkbox"
    // className="form-check-input"
    id="secureFeeCheckbox"
    checked={isSecureFeeChecked}
    onChange={() => setIsSecureFeeChecked(!isSecureFeeChecked)}
    style={{ width: "18px", height: "18px", cursor: "pointer" }}
  />
  <label
    className="form-check-label fw-bold"
    htmlFor="secureFeeCheckbox"
    style={{ fontSize: "16px", cursor: "pointer" }}
  >
    Secure Fees :  ₹ {service?.secure_fee}
  </label>
</div>
 )} */}

              <div className="payable-amount-section">
                <p className="payable-amount">
                  ₹ {basePrice} <br />
                  Base Amount
                </p>

                <button
                  type="submit"
                  className="continue-button"
                  // onClick={nextStep}
                  onClick={validateFieldsStepOne}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="location-container">
            {loading && <Loader />}

            <div className="location-content">
              <div className="add-location-header">
                <button className="back-button" onClick={prevStep}>
                  ←
                </button>
                <MapPin size={20} />

                <h2 className="header-title">Select Booking Location</h2>
              </div>

              {service?.category_id !== 2 && (
                <>
                  <Button
                    onClick={() => setIsAddingAddress(true)}
                    className="btn btn-primary nav-buttons"
                    style={{
                      display: "block", // Makes the button a block element
                      marginLeft: "auto", // Centers the button horizontally
                      marginRight: "auto", // Centers the button horizontally
                      textAlign: "center", // Optional: Ensures the text inside the button is centered
                    }}
                  >
                    + Add New Address
                  </Button>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <hr
                      style={{
                        flexGrow: 1,
                        border: "0",
                        borderTop: "1px solid #000",
                      }}
                    />
                    <span style={{ padding: "0 10px" }}>OR</span>
                    <hr
                      style={{
                        flexGrow: 1,
                        border: "0",
                        borderTop: "1px solid #000",
                      }}
                    />
                  </div>
                </>
              )}

              <div
                style={{
                  overflowY: "auto",
                  maxHeight: "450px",
                }}
                className="address-section mt-0"
              >
                {(service?.category_id === 1 || service?.category_id === 3) && (
                  <>
                    {" "}
                    <span>Select Address :</span>
                    {addresses.map((address, index) => (
                      <div
                        key={address.address_id}
                        className="mb-3"
                        style={{
                          border: "2px solid #D8D8D8",
                          padding: "5px",
                          borderRadius: "5px",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          {/* Radio button for selecting address */}
                          <input
                            type="radio"
                            name="address"
                            id={`address-${address.address_id}`}
                            checked={
                              selectedLocation?.address_id ===
                              address?.address_id
                            }
                            onChange={() => setSelectedLocation(address)}
                            className="me-2"
                            style={{ cursor: "pointer", width: "auto" }}
                          />
                          <p className="flex-fill mb-0 address-p">
                            <span className="serial-number me-2">
                              {index + 1}.
                            </span>
                            <>
                              {address.street_address_line2
                                ? address.street_address_line2 + ", "
                                : ""}
                              {address.formatted_address
                                ? address.formatted_address + ", "
                                : ""}
                              {address.landmark ? address.landmark + ", " : ""}
                              {address.city ? address.city + ", " : ""}
                              {address.district ? address.district + ", " : ""}
                              {address.state ? address.state + ", " : ""}
                              {address.postal_code
                                ? address.postal_code + ", "
                                : ""}
                              {address.country ? address.country : ""}
                            </>
                            <br />
                          </p>

                          <Dropdown className="custom-dropdown-container">
                            <Dropdown.Toggle
                              as="span"
                              id="dropdown-custom-components"
                              className="custom-dropdown-toggle"
                              bsPrefix="custom-toggle" // Disables Bootstrap’s caret icon
                            >
                              <BsThreeDotsVertical
                                size={18}
                                style={{ cursor: "pointer" }}
                              />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="custom-dropdown-menu-booking">
                              <Dropdown.Item
                                className="custom-dropdown-item-booking"
                                onClick={() => {
                                  setAddressToEdit(address?.address_id);
                                  fetchDefaultAddress(address?.address_id);
                                  setIsEditingAddress(true);
                                }}
                              >
                                <span>Edit</span>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                <>
                  {service?.category_id === 2 && (
                    <>
                      <DriverBookingMap
                        onSelectPoints={handleSelectedPoints}
                        DriverCoordinates={DriverCoordinates}
                        service={service}
                      />

                      {/* <span>Select Address From:</span>
        {addresses.map((address, index) => (
          <div
            key={address.address_id}
            className="mb-3"
            style={{
              border: "2px solid #D8D8D8",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            <div className="d-flex align-items-center">
              <input
                type="radio"
                name="address-from"
                id={`address-from-${address.address_id}`}
                checked={
                  selectedLocationFromForDriver?.address_id ===
                  address?.address_id
                }
                onChange={() => {
                  setSelectedLocationFromForDriver(address);
                  if (
                    selectedLocationToForDriver?.address_id ===
                    address?.address_id
                  ) {
                    setErrorMessage("From and To addresses cannot be the same.");
                  } else {
                    setErrorMessage(""); 
                  }
                }}
                className="me-2"
                style={{ cursor: "pointer", width: "auto" }}
              />
              <p className="flex-fill mb-0 address-p">
                <span className="serial-number me-2">{index + 1}.</span>
                {address.landmark && `${address.landmark}, `}
                {address.street_address_line2 &&
                  `${address.street_address_line2}, `}
                {address.city && `${address.city}, `}
                {address.state && `${address.state}, `}
                {address.postal_code && `${address.postal_code}, `}
                {address.country && `${address.country}`}
                <br />
              </p>
              <Dropdown className="custom-dropdown-container">
                <Dropdown.Toggle
                  as="span"
                  id="dropdown-custom-components"
                  className="custom-dropdown-toggle"
                  bsPrefix="custom-toggle"
                >
                  <BsThreeDotsVertical
                    size={18}
                    style={{ cursor: "pointer" }}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu className="custom-dropdown-menu-booking">
                  <Dropdown.Item
                    className="custom-dropdown-item-booking"
                    onClick={() => {
                      setAddressToEdit(address?.address_id);
                      fetchDefaultAddress(address?.address_id);
                      setIsEditingAddress(true);
                    }}
                  >
                    Edit
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        ))}

        <hr />

        <span>Select Address To:</span>
        {addresses.map((address, index) => (
          <div
            key={address.address_id}
            className="mb-3"
            style={{
              border: "2px solid #D8D8D8",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            <div className="d-flex align-items-center">
              <input
                type="radio"
                name="address-to"
                id={`address-to-${address.address_id}`}
                checked={
                  selectedLocationToForDriver?.address_id ===
                  address?.address_id
                }
                onChange={() => {
                  setSelectedLocationToForDriver(address);
                  if (
                    selectedLocationFromForDriver?.address_id ===
                    address?.address_id
                  ) {
                    setErrorMessage("From and To addresses cannot be the same.");
                  } else {
                    setErrorMessage("");
                  }
                }}
                className="me-2"
                style={{ cursor: "pointer", width: "auto" }}
              />
              <p className="flex-fill mb-0 address-p">
                <span className="serial-number me-2">{index + 1}.</span>
                {address.landmark && `${address.landmark}, `}
                {address.street_address_line2 &&
                  `${address.street_address_line2}, `}
                {address.city && `${address.city}, `}
                {address.state && `${address.state}, `}
                {address.postal_code && `${address.postal_code}, `}
                {address.country && `${address.country}`}
                <br />
              </p>
              <Dropdown className="custom-dropdown-container">
                <Dropdown.Toggle
                  as="span"
                  id="dropdown-custom-components"
                  className="custom-dropdown-toggle"
                  bsPrefix="custom-toggle"
                >
                  <BsThreeDotsVertical
                    size={18}
                    style={{ cursor: "pointer" }}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu className="custom-dropdown-menu-booking">
                  <Dropdown.Item
                    className="custom-dropdown-item-booking"
                    onClick={() => {
                      setAddressToEdit(address?.address_id);
                      fetchDefaultAddress(address?.address_id);
                      setIsEditingAddress(true);
                    }}
                  >
                    Edit
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        ))}

        {errorMessage && (
          <div className="text-danger mb-3">
            <strong>{errorMessage}</strong>
          </div>
        )} */}

                      <></>
                    </>
                  )}
                </>

                <div className="container mt-3 mb-3">
                  {/* <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}
                  >
                    <LocationModal
                      show={isAddingAddress}
                      onHide={() => {
                        setIsAddingAddress(false);
                        fetchProfile();
                      }}
                      latitude=""
                      longitude=""
                      city=""
                      district=""
                      state=""
                      country=""
                      postalCode=""
                      formattedAddress=""
                      landmark=""
                      streetAddressLine2=""
                      addressToEditId={null}
                    />
                  </LoadScript> */}

                  <LocationModal
                    show={isAddingAddress}
                    onHide={() => {
                      setIsAddingAddress(false);
                      fetchProfile();
                    }}
                    latitude=""
                    longitude=""
                    city=""
                    district=""
                    state=""
                    country=""
                    postalCode=""
                    formattedAddress=""
                    landmark=""
                    streetAddressLine2=""
                    addressToEditId={null}
                  />
                </div>

                <div>
                  {/* <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}
                  >
                 
                      <LocationModal
                        show={isEditingAddress}
                        onHide={() => {
                          setIsEditingAddress(false);
                          fetchProfile();
                        }}
                        latitude={Number(locationData.latitude)}
                        longitude={Number(locationData.longitude)}
                        city={locationData.city}
                        district={locationData.district}
                        state={locationData.state}
                        country={locationData.country}
                        postalCode={locationData.postalCode}
                        formattedAddress={locationData.formattedAddress}
                        landmark={locationData.landmark}
                        streetAddressLine2={locationData.streetAddressLine2}
                        addressToEditId={addressToEdit}
                      />
                
                  </LoadScript> */}

                  <LocationModal
                    show={isEditingAddress}
                    onHide={() => {
                      setIsEditingAddress(false);
                      fetchProfile();
                    }}
                    latitude={Number(locationData.latitude)}
                    longitude={Number(locationData.longitude)}
                    city={locationData.city}
                    district={locationData.district}
                    state={locationData.state}
                    country={locationData.country}
                    postalCode={locationData.postalCode}
                    formattedAddress={locationData.formattedAddress}
                    landmark={locationData.landmark}
                    streetAddressLine2={locationData.streetAddressLine2}
                    addressToEditId={addressToEdit}
                  />
                </div>
              </div>

              {/* This button now sets the step to 5 */}
              <button
                className="confirm-address-button"
                // onClick={() => {
                //   setStep(5);
                //   window.scrollTo({ top: 0, behavior: "smooth" });
                //   FunctionDataForPricesApplied();
                // }}

                onClick={handleConfirmAddress}
              >
                Confirm Address
              </button>

              {/* <button
  className={`confirm-address-button ${
    selectedLocationFromForDriver?.address_id ===
    selectedLocationToForDriver?.address_id
      ? "disabled"
      : ""
  }`}
  onClick={() => {
    if (
      selectedLocationFromForDriver?.address_id ===
      selectedLocationToForDriver?.address_id
    ) {
      setMessage("From and To addresses cannot be the same."); // Show error message
    } else {
      handleConfirmAddress(); // Proceed with normal behavior
    }
  }}
>
  Confirm Address
</button> */}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="add-location-container">
            {loading && <Loader />}
            <div className="add-location-content">
              <div className="add-location-header">
                <button className="back-button" onClick={prevStep}>
                  ←
                </button>
                <h2 className="header-title">Confirm Booking Location</h2>
              </div>

              <div className="search-container">
                <input
                  ref={searchBoxRef}
                  type="text"
                  placeholder="Search your location"
                  className="search-input"
                />
              </div>

              <div className="map-container" ref={mapRef}></div>

              <div className="location-selection">
                <h3 className="selection-title">Selected Location</h3>
                <div className="address-card">
                  <div className="address-marker">📍</div>
                  <div className="address-text">{selectedLocation.address}</div>
                </div>
                <button className="add-address-button" onClick={nextStep}>
                  Confirm and Add Address
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="address-step-container">
            {loading && <Loader />}
            <div className="address-step-content">
              <div className="address-step-header">
                <button className="address-back-button" onClick={prevStep}>
                  ←
                </button>
                <h2 className="address-header-title">
                  Confirm Booking Location
                </h2>
              </div>

              <div className="map-preview-container">
                <div className="search-bar-container">
                  <input
                    type="text"
                    placeholder="Search your location"
                    className="search-bar-input"
                  />
                  <button className="search-bar-button">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="booking-booking-form">
            {loading && <Loader />}
            <div className="booking-summary-header">
              <button
                onClick={() => setStep(2)}
                className="booking-summary-back-button"
              >
                <ChevronLeft size={24} />
              </button>
              <h2>Booking Summary</h2>
            </div>

            <div style={{ padding: "1rem" }}>
              <h3 className="booking-summary-label">Booking Details</h3>
              <div className="booking-summary-details">
                <div className="booking-detail-card">
                  <div>
                    <strong>Booking For :</strong>
                  </div>
                  <div>{BookingForGuestName}</div>
                </div>

                {(service?.category_id === 1 || service?.category_id === 3) && (
                  <>
                    <div className="booking-detail-card">
                      <div>
                        <strong>Address : </strong>
                      </div>
                      <div>
                        <p className="flex-fill mb-0 address-p">
                          {DataForPricesAppliedGet?.visit_address}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {service?.category_id === 2 && (
                  <>
                    <div className="booking-detail-card">
                      <div>
                        <strong>Address From:</strong>
                      </div>
                      <div>
                        <p className="flex-fill mb-0 address-p">
                          {DataForPricesAppliedGet?.address_from}
                        </p>
                      </div>
                    </div>

                    <div className="booking-detail-card">
                      <div>
                        <strong>Address To:</strong>
                      </div>
                      <div>
                        <p className="flex-fill mb-0 address-p">
                          {DataForPricesAppliedGet?.address_to}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {service.id !== 9 && (
                  <>
                    <div className="booking-detail-card">
                      <div>
                        <strong>
                          {(service.category_id === 2 ||
                            service.category_id === 3) &&
                          service.id !== 9
                            ? "Number of Hours :"
                            : "Number of People :"}
                        </strong>
                      </div>
                      <div>
                        {service.category_id === 3
                          ? SelectedNumberOfHoursObjectForGardner?.hours
                          : service.category_id === 2
                          ? SelectedNumberOfHoursObjectForDriver?.hours
                          : DataForPricesAppliedGet?.people_count}
                      </div>
                    </div>
                  </>
                )}

                {service.id === 9 && (
                  <>
                    <div className="booking-detail-card">
                      <div>
                        <strong>Number of Visits :</strong>
                      </div>
                      <div>
                        {DataForPricesAppliedGet?.gardener_monthly_subscription &&
                          (() => {
                            const subscriptionData = JSON.parse(
                              DataForPricesAppliedGet.gardener_monthly_subscription
                            );
                            const visitCount = subscriptionData?.visit;
                            const totalMinutes = subscriptionData?.hours;
                            const hours = Math.floor(totalMinutes / 60);
                            const minutes = totalMinutes % 60;

                            const formattedTime = [
                              hours ? `${hours} hr${hours > 1 ? "s" : ""}` : "",
                              minutes
                                ? `${minutes} min${minutes > 1 ? "s" : ""}`
                                : "",
                            ]
                              .filter(Boolean)
                              .join(" ");

                            return (
                              <>
                                {visitCount}{" "}
                                {visitCount > 1 ? "visits" : "visit"} lasting{" "}
                                {formattedTime} per visit
                              </>
                            );
                          })()}
                      </div>
                    </div>

                    <div className="booking-detail-card">
                      <div>
                        <strong>{service.id === 9 && "Visiting Dates"}</strong>
                      </div>
                      <div>
                        {DataForPricesAppliedGet?.gardener_visiting_slots
                          ? JSON.parse(
                              DataForPricesAppliedGet?.gardener_visiting_slots
                            )?.map((slot, index) => (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {slot.date
                                  ? format(new Date(slot.date), "dd MMM yyyy")
                                  : null}
                                {/* <div style={{ marginLeft: '10px' }}>:({slot.hours} hours approx)</div> */}
                              </div>
                            ))
                          : null}
                      </div>
                    </div>

                    <div className="booking-detail-card">
                      {DataForPricesAppliedGet?.visit_time !== "00:00:00" && (
                        <>
                          <div>
                            <strong>Time :</strong>{" "}
                            <div>
                              {DataForPricesAppliedGet?.visit_time && (
                                <div>
                                  {convertToAmPm(
                                    DataForPricesAppliedGet.visit_time
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}

                <div className="booking-detail-card">
                  {service.id !== 9 && (
                    <>
                      <div>
                        <strong>Date:</strong>
                        <div>
                          {DataForPricesAppliedGet?.visit_date
                            ? new Date(
                                DataForPricesAppliedGet.visit_date
                              ).toLocaleDateString("en-GB")
                            : "N/A"}
                        </div>
                      </div>

                      <div>
                        <strong>Time:</strong>
                        <div>
                          {DataForPricesAppliedGet?.visit_time
                            ? (() => {
                                const [hours, minutes] =
                                  DataForPricesAppliedGet.visit_time.split(":");
                                const hour = parseInt(hours, 10);
                                const period = hour >= 12 ? "PM" : "AM";
                                const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
                                return `${formattedHour}:${minutes} ${period}`;
                              })()
                            : "N/A"}
                        </div>
                      </div>
                    </>
                  )}

                  <div></div>
                </div>

                {DataForPricesAppliedGet?.category_id === 1 && (
                  <div className="booking-detail-card">
                    <div>
                      <strong>Dishes :</strong>
                    </div>
                    <div>
                      {DataForPricesAppliedGet?.sub_category_id === 3
                        ? // ✅ If sub_category_id is 3, parse menu data
                          (() => {
                            try {
                              const menuArray = JSON.parse(
                                DataForPricesAppliedGet.menu || "[]"
                              );
                              return menuArray.length > 0
                                ? menuArray.map((item, index) => (
                                    <span key={index}>
                                      {item.name} - {item.quantity}
                                      {index !== menuArray.length - 1 && ", "}
                                      <br />
                                    </span>
                                  ))
                                : "None";
                            } catch (error) {
                              console.error("Error parsing menu:", error);
                              return "Invalid menu data";
                            }
                          })()
                        : // ✅ Otherwise, show dishes with commas
                        Array.isArray(DataForPricesAppliedGet?.dishes) &&
                          DataForPricesAppliedGet.dishes.length > 0
                        ? DataForPricesAppliedGet.dishes.map((dish, index) => (
                            <span key={index}>
                              {dish}
                              {index !==
                                DataForPricesAppliedGet.dishes.length - 1 &&
                                ", "}
                            </span>
                          ))
                        : "None"}
                    </div>
                  </div>
                )}

                {DataForPricesAppliedGet?.category_id === 2 && (
                  <>
                    <div className="booking-detail-card">
                      <div>
                        <strong>Car Type :</strong>
                      </div>
                      <div>{DataForPricesAppliedGet.car_type || "None"}</div>
                    </div>

                    <div className="booking-detail-card">
                      <div>
                        <strong>Transmission Type :</strong>
                      </div>
                      <div>
                        {DataForPricesAppliedGet.transmission_type || "None"}
                      </div>
                    </div>
                  </>
                )}

                <div className="booking-detail-card">
                  <div>
                    <strong>Special Requests / Instructions:</strong>
                  </div>{" "}
                  <div>{specialRequests || "None"}</div>
                </div>

                <div className="additional-details">
                  <h3>Additional Details</h3>
                  <div className="details-item">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: showMoreBookingSummary
                          ? basicDataByGet?.sub_category?.booking_summary || ""
                          : limitTextByWords(
                              basicDataByGet?.sub_category?.booking_summary ||
                                "",
                              wordLimit
                            ),
                      }}
                    />

                    <div>
                      <a
                        onClick={() => toggleVisibility("booking")}
                        className="view-more-btn"
                      >
                        {showMoreBookingSummary ? "View Less" : "View More"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* offer and code */}
              <div className="booking-summary-offers">
                <h3 className="booking-summary-label">Offers</h3>

                <div>
                  {/* Menu Toggle Button */}
                  <button
                    className="menu-toggle-button"
                    onClick={handleCouponsVisibility}
                    style={{
                      padding: "10px 10px",
                      backgroundColor: isCouponsVisible ? "#FF5722" : "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      textAlign: "center",
                      margin: "0 auto",
                    }}
                  >
                    {isCouponsVisible ? "Hide Coupons" : "See All Coupons"}
                    {isCouponsVisible ? (
                      <ChevronDown size={16} style={{ marginLeft: "8px" }} />
                    ) : (
                      <ChevronRight size={16} style={{ marginLeft: "8px" }} />
                    )}
                  </button>

                  {/* Dropdown Options (Coupons) */}
                  {isCouponsVisible && (
                    <div
                      className="coupon-dropdown"
                      style={{
                        marginTop: "10px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        padding: "10px",
                        maxHeight: "300px",
                        overflowY: "auto",
                      }}
                    >
                      {!DataForPricesAppliedGet?.discount ||
                      DataForPricesAppliedGet.discount.length === 0 ? (
                        // Message displayed if no coupons are available
                        <p
                          style={{
                            textAlign: "center",
                            color: "#FF5722",
                            fontWeight: "bold",
                          }}
                        >
                          No coupons available.
                        </p>
                      ) : (
                        // Render coupons if available
                        DataForPricesAppliedGet?.discount?.map((coupon) => (
                          <div
                            key={coupon.voucher_id}
                            className="offers-card"
                            style={{
                              borderBottom: "1px solid #ddd",
                              padding: "10px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <strong>
                                {coupon.discount_type === "fixed"
                                  ? "Fixed Discount"
                                  : "Percentage Discount"}
                                :
                              </strong>{" "}
                              {coupon.discount_type === "fixed" ? (
                                <>₹ {coupon.discount_value}</>
                              ) : (
                                <>{coupon.discount_value} %</>
                              )}
                              <p className="mb-0 ml-2 text-sm">
                                Minimum Order: ₹ {coupon.minimum_order_amount}
                              </p>
                              <p className="mb-0 ml-2 text-sm">
                                Voucher Code: {coupon.voucher_code}
                              </p>
                            </div>

                            <div>
                              <input
                                type="radio"
                                id={`coupon-${coupon.voucher_id}`}
                                name="coupon"
                                checked={selectedCoupon === coupon.voucher_id}
                                onChange={() =>
                                  handleRadioChange(coupon.voucher_id)
                                }
                                style={{
                                  marginRight: "8px",
                                  cursor: "pointer",
                                }}
                              />
                            </div>
                          </div>
                        ))
                      )}

                      {selectedCoupon && (
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            gap: "10px",
                          }}
                        >
                          {/* Remove Coupon Button */}
                          <button
                            onClick={() => {
                              handleRemoveCoupen();
                              setSelectedCoupon(null);
                              setIsCouponsVisible(true);
                            }}
                            style={{
                              width: "50%",
                              backgroundColor: "#F44336",
                              color: "#FFFFFF",
                              border: "none",
                              padding: "15px",
                              borderRadius: "5px",
                              cursor: "pointer",
                              transition: "background-color 0.3s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#B71C1C")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "#F44336")
                            }
                          >
                            Remove Coupon
                          </button>

                          {/* Apply Coupon Button */}
                          <button
                            className="offer-apply-button"
                            style={{
                              width: "50%",
                              backgroundColor: "#4CAF50",
                              color: "#fff",
                              border: "none",
                              padding: "15px",
                              borderRadius: "5px",
                              cursor: "pointer",
                              transition: "background-color 0.3s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#388E3C")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "#4CAF50")
                            }
                            disabled={!selectedCoupon}
                            onClick={handleApplyCoupen}
                          >
                            Check Coupon Validation
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <h3 className="booking-summary-label mt-3">Charges Breakdown</h3>
              <div className="fare-breakdown-section">
                <div className="fare-breakdown-card">
                  {/* {service.category_id === 1 && (
                  <>
                    <div className="fare-breakdown-div">
                      <div className="fare-breakdown-title">
                        Service Charges:
                      </div>
                      <div>
                        {(() => {
                          const numberOfPeople = JSON.parse(
                            DataForPricesAppliedGet?.number_of_people || "{}"
                          );
                          const { people_count, price } = numberOfPeople;
                          return `For ${people_count} person = ₹ ${price}`;
                        })()}
                      </div>
                    </div>
                  </>
                )} */}

                  {/* {service.id === 8 && (
                  <>
                    <div className="fare-breakdown-div">
                      <div className="fare-breakdown-title">
                        Service Charges:
                      </div>
                      <div>
                        {(() => {
                          const numberOfHours = JSON.parse(
                            DataForPricesAppliedGet?.gardener_time_duration ||
                              "{}"
                          );
                          const { hours, price } = numberOfHours;
                          return `For ${hours} hours = ₹ ${price}`;
                        })()}
                      </div>
                    </div>
                  </>
                )} */}

                  {/* {service.category_id === 1 && (
                  <>
                    <div className="fare-breakdown-div">
                      <div className="fare-breakdown-title">
                        Charges for dishes/menu items:
                      </div>
                      <div>+₹ {DataForPricesAppliedGet?.menu_amount}</div>
                    </div>
                  </>
                )} */}

                  <div className="fare-breakdown-div">
                    <div className="fare-breakdown-title">Amount :</div>
                    <div>₹ {DataForPricesAppliedGet?.actual_price}</div>
                  </div>

                  <div className="fare-breakdown-div">
                    <div className="fare-breakdown-title">Taxes and Fees :</div>
                    <div>+₹ {DataForPricesAppliedGet?.all_taxes}</div>
                  </div>

                  {service?.category_id === 2 && (
                    <>
                      {/* 
                <div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">Secure Fee :</div>
                  <div>+₹ {DataForPricesAppliedGet?.secure_fee}</div>
                </div> 
                */}
                    </>
                  )}

                  {/* <div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">Platform Fee:</div>
                  <div>+₹ {DataForPricesAppliedGet?.platform_fee}</div>
                </div> */}

                  {DataForPricesAppliedGet?.night_charge > 0 && (
                    <>
                      <div className="fare-breakdown-div">
                        <div className="fare-breakdown-title">
                          Night Charges :
                        </div>
                        <div>+₹ {DataForPricesAppliedGet?.night_charge}</div>
                      </div>
                    </>
                  )}

                  <div className="fare-breakdown-div">
                    <div className="fare-breakdown-title">Discount :</div>
                    <div> -₹ {DataForPricesAppliedGet?.discount_amount}</div>
                  </div>
                  {dataAfterUsePoint?.data?.use_points_amount > 0 && (
                    <>
                      <div className="fare-breakdown-div">
                        <div className="fare-breakdown-title">
                          Points Used :
                        </div>
                        <div>
                          -₹ {dataAfterUsePoint?.data?.use_points_amount}
                        </div>
                      </div>
                    </>
                  )}

                  {/* <div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">Price After Discount:</div>
                  <div>₹ {DataForPricesAppliedGet?.price}</div>
                </div> */}

                  <div className="fare-breakdown-div mt-1">
                    <div className="fare-breakdown-title">
                      <h5>Grand Total:</h5>
                    </div>
                    <div>
                      <h5>₹ {DataForPricesAppliedGet?.billing_amount}</h5>
                    </div>
                  </div>
                  <div className="fare-saving-message-div">
                    <p className="fare-saving-message text-center">
                      Hurray! You saved ₹{" "}
                      {DataForPricesAppliedGet?.discount_amount} on the final
                      bill
                    </p>

                    {selectedCouponObject?.voucher_code && (
                      <p
                        style={{ color: "blue" }}
                        className="fare-saving-message text-center"
                      >
                        Activated Coupon Code :{" "}
                        <span style={{ fontWeight: "bold", color: "blue" }}>
                          {selectedCouponObject?.voucher_code}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="booking-summary-footer ">
                <div className="estimated-fare">
                  <div>
                    <h4>Estimated Fare</h4>
                  </div>
                  <div>
                    <p>
                      {" "}
                      <h4>₹{DataForPricesAppliedGet?.billing_amount} </h4>
                    </p>
                  </div>
                </div>

                <button className="checkout-button" onClick={nextStep}>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="payment-section-container">
            {loading && <Loader />}
            <div className="payment-section-main-div">
              <div className="payment-section-header">
                <button
                  className="payment-back-button"
                  onClick={prevStep}
                  aria-label="Go back"
                >
                  ←
                </button>
                <h2 className="payment-title">
                  Bill Total: ₹ {DataForPricesAppliedGet?.billing_amount}
                </h2>
              </div>

              <div className="payment-section-body">
              <div className="payment-option-button reward-points-option">
  <div className="payment-option">
    <div className="payment-icon">
      <img src="/coin.png" alt="Reward Icon" />
    </div>
    <div className="payment-details">
  <h3>Use Reward Points</h3>
  <p>
    Available Balance: {DataForPricesAppliedGet?.wallet_balance} Coins 
    <span style={{ fontSize: "14px", color: "#666" }}> (10 Coins = ₹1)</span>
  </p>
  {/* <p>
    Equivalent Cash: ₹ {(DataForPricesAppliedGet?.wallet_balance / 10).toFixed(2)}
  </p> */}
  <p>
    Points Used: {DataForPricesAppliedGet?.use_points_amount * 10} Coins
  </p>
  <p>
    Discount Applied: ₹ {DataForPricesAppliedGet?.use_points_amount}
  </p>
</div>

    <label className="switch">
      <input
        type="checkbox"
        id="secureFeeCheckbox"
        checked={isUsePoints}
        onChange={toggleUsePoints}
      />
      <span className="slider round"></span>
    </label>
  </div>
</div>

                <button
                  className="payment-option-button"
                  onClick={(event) => {
                    handlePayment("online");
                    setCallRazorPay(true);
                    // event.target.disabled = true;
                    setMakeDisable(true);
                  }}
                  // disabled={makeDisable}
                >
                  <div className="payment-option">
                    <div className="payment-icon">
                      <img src="/atm-card.png" alt="Card Icon" />
                    </div>
                    <div className="payment-details">
                      <h3>Pay using UPI, Cards</h3>
                      <p>Experience cashless bookings</p>
                    </div>
                    <div className="payment-arrow">→</div>
                  </div>
                </button>

                {service.id !== 9 && (
                  <>
                    <button
                      className="payment-option-button"
                      onClick={(event) => {
                        handlePayment("cod");
                        setCallRazorPay(false);
                        // event.target.disabled = true;
                        setMakeDisable(true);
                      }}
                      // disabled={makeDisable}
                    >
                      <div className="payment-option">
                        <div className="payment-icon">
                          <img src="/money.png" alt="Cash Icon" />
                        </div>
                        <div className="payment-details">
                          <h3>Pay after booking</h3>
                          <p>Book now, pay later</p>
                        </div>
                        <div className="payment-arrow">→</div>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {callRazorPay && BookingData && (
          <RazorpayPayment
            BookingData={BookingData}
            callRazorPay={callRazorPay}
            handleConfirmBooking={nextStep}
          />
        )}

        {step === 7 && (
          <div className="success-container">
            {loading && <Loader />}
            <div className="success-content">
              <div className="checkmark-circle">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>

              <h2 className="success-title">Booking Successful!</h2>

              <p
                className="success-message"
                style={{
                  // marginBottom: "200px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Your booking is currently awaiting confirmation from the service
                provider. We'll update you as soon as it's accepted!
              </p>

              <button
                className="btn back-home-btn"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
        <MessageModal
          show={show}
          handleClose={handleClose}
          handleShow={handleShow}
          message={message}
        />

        <div className="booking-illustration-section">
          <h2 className="booking-main-title">
            {basicDataByGet?.sub_category?.sub_category_name}
          </h2>
          <img
            src={basicDataByGet?.sub_category?.category_image}
            alt="illustration"
            className="booking-illustration"
          />
        </div>
      </div>
    </>
  );
};

export default BookingSection;
