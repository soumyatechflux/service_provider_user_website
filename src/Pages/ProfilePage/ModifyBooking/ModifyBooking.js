import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import "react-clock/dist/Clock.css";
import { useLocation, useNavigate } from "react-router-dom";
import "react-time-picker/dist/TimePicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Loader/Loader";
import MessageModal from "../../MessageModal/MessageModal";
import RazorpayPayment from "../../ServicesSection/BookingSection/RazorpayPayment";
import "./ModifyBooking.css";
import { addDays, differenceInDays } from "date-fns";

const ModifyBooking = () => {
  const getUpcomingDates = (startDate, numDays) => {
    const dates = [];
    for (let i = 0; i < numDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
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

  const token = sessionStorage.getItem("ServiceProviderUserToken");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = location.state || {};

  const [DefaultDataOfBooking, setDefaultDataOfBooking] = useState({});

  const handleViewMore = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/bookings/${service?.booking_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 && response.data.success === true) {
        setDefaultDataOfBooking(response?.data?.data);
      } else {
        setDefaultDataOfBooking({});
      }
    } catch (error) {
      console.error("Failed to fetch upcoming bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleViewMore();
  }, [service]);

  useEffect(() => {
    setSelectedCarType(DefaultDataOfBooking?.car_type);
    setSelectedCarTransmissionType(DefaultDataOfBooking?.transmission_type);
    setBasePrice(DefaultDataOfBooking?.actual_price);
  }, [DefaultDataOfBooking]);

  useEffect(() => {
    if (DefaultDataOfBooking?.visit_date) {
      const visitDate = new Date(DefaultDataOfBooking.visit_date); // Convert to Date object
      setMonthlySubscriptionStartDate(visitDate);
    }

    // if (DefaultDataOfBooking?.visit_date) {
    //   const visitDate = new Date(DefaultDataOfBooking.visit_date); // Convert to Date object
    //   setMonthlySubscriptionEndsDate(visitDate);
    // }
  }, [DefaultDataOfBooking]);

  // useEffect(() => {
  //   if (DefaultDataOfBooking?.menu) {
  //     const initialMenu = DefaultDataOfBooking?.menu.map((item, index) => ({
  //       ...item,
  //       quantity: index === 0 ? 1 : 0,
  //     }));
  //     setMenuItems(initialMenu);

  //     const initialSelectedItems = DefaultDataOfBooking?.menu.map((item, index) => ({
  //       name: item.name,
  //       price: item.price,
  //       quantity: index === 0 ? 1 : 0,
  //     }));
  //     setSelectedMenuItemsForChefForParty(initialSelectedItems);
  //   }
  // }, [DefaultDataOfBooking]);

  const [dishesOptionsArray, setdishesOptionsArray] = useState([]);

  const [menuItems, setMenuItems] = useState([]);
  const [
    selectedMenuItemsForChefForParty,
    setSelectedMenuItemsForChefForParty,
  ] = useState([]);

  const [menu, setMenu] = useState([]);
  const [SelectedNamesOfDishes, setSelectedNamesOfDishes] = useState([]);

  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [makeDisable, setMakeDisable] = useState(false);

  const [addresses, setAddresses] = useState([]);

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
    if (service.id === 1 || service.id === 2) {
      if (SelectedNamesOfDishes === "" || SelectedNamesOfDishes.length === 0) {
        setMessage("Please fill all required fields.");
        setShow(true);
        handleShow();
        return;
      }
    }

    if (service.category_id === 2) {
      if (
        BookingForGuestName === "" ||
        (service?.category_id === 2 &&
          (selectedCarTransmissionType === "" || selectedCarType === ""))
      ) {
        setMessage("Please fill all required fields.");
        setShow(true);
        handleShow();
        return;
      }
    }

    setLoading(true);

    try {
      const body = {
        booking: {
          voucher_code: "",
          modify: true,
          payment_mode: DefaultDataOfBooking?.payment_mode,
          booking_id: service?.booking_id || "",
          // category_id: service?.category_id || "",
          // sub_category_id: service?.id || "",

          // is_secure_fee:
          //  service?.category_id === 2 ? isSecureFeeChecked : false,

          number_of_people: SelectedObjectOfPeople || {},
          guest_name: BookingForGuestName || "Guest",
          instructions: specialRequests || "",
          dishes:
            service?.id === 1 || service?.id === 2
              ? SelectedNamesOfDishes || []
              : [],
          driver_time_duration:
            service?.category_id === 2
              ? SelectedNumberOfHoursObjectForDriver || {}
              : {},
          transmission_type:
            service?.category_id === 2 ? selectedCarTransmissionType || "" : "",
          car_type: service?.category_id === 2 ? selectedCarType || "" : "",
          gardener_time_duration:
            service?.id === 8
              ? SelectedNumberOfHoursObjectForGardner || {}
              : {},
          gardener_monthly_subscription:
            service?.id === 9
              ? SelectedNumberOfSlotsObjectForMonthlyGardner || {}
              : {},
          gardener_visiting_slots:
            service?.id === 9 ? selectedVisitDates || [] : [],
          menu:
            service?.id === 3
              ? (selectedMenuItemsForChefForParty || [])
                  .filter((item) => item.quantity > 0)
                  .map((item) => ({
                    ...item,
                    price: parseFloat(item.price),
                  }))
              : [],

          ...(service?.id === 9 && selectedTime
            ? { visit_time: selectedTime }
            : {}),
        },
      };

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/update_booking`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success) {
        setDataForPricesAppliedGet(response?.data?.data);
        setStep(2);
      } else {
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

  const [step, setStep] = useState(1);

  const [BookingForGuestName, setBookingForGuestName] = useState(
    DefaultDataOfBooking?.guest_name
  );

  useEffect(() => {
    if (DefaultDataOfBooking) {
      setBookingForGuestName(DefaultDataOfBooking?.guest_name);
      setSpecialRequests(DefaultDataOfBooking?.instructions);
    }
  }, [DefaultDataOfBooking]);

  const [minTime, setMinTime] = useState("");

  useEffect(() => {
    updateMinTime(new Date());
  }, []);

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

  const [people, setPeople] = useState(1);

  // const [SelectedObjectOfPeople, setSelectedObjectOfPeople] = useState({});
  const [SelectedObjectOfPeople, setSelectedObjectOfPeople] = useState(null);

  const [totalPrice, setTotalPrice] = useState();
  const [approxTime, setApproxTime] = useState();
  const [basePrice, setBasePrice] = useState();

  const [specialRequests, setSpecialRequests] = useState();

  // step 3 constants

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

  const nextStep = () => {
    // setStep((prev) => prev + 1);

    setLoading(true);
    setStep((prev) => prev + 1);
    setCallRazorPay(false);
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

  const [callRazorPay, setCallRazorPay] = useState(false);
  const [BookingData, setBookingData] = useState();

  const handlePayment = async (mod) => {
    setLoading(true);

    try {
      const body = {
        booking: {
          payment_mode: mod,
          voucher_code: "",
          modify: true,
          booking_id: service?.booking_id || "",
          // category_id: service?.category_id || "",
          // sub_category_id: service?.id || "",
          // number_of_people: SelectedObjectOfPeople || {},
          // guest_name: BookingForGuestName || "Guest",
          // instructions: specialRequests || "",
          // dishes:
          //   service?.id === 1 || service?.id === 2
          //     ? SelectedNamesOfDishes || []
          //     : [],
          // driver_time_duration:
          //   service?.category_id === 2
          //     ? SelectedNumberOfHoursObjectForDriver || {}
          //     : {},
          // transmission_type: service?.category_id === 2 ? selectedCarTransmissionType || "" : "",
          // car_type: service?.category_id === 2 ? selectedCarType || "" : "",
          // gardener_time_duration:
          //   service?.id === 8
          //     ? SelectedNumberOfHoursObjectForGardner || {}
          //     : {},
          // gardener_monthly_subscription:
          //   service?.id === 9
          //     ? SelectedNumberOfSlotsObjectForMonthlyGardner || {}
          //     : {},
          // gardener_visiting_slots: service?.id === 9 ? selectedVisitDates || [] : [],
          // menu: service?.id === 3
          //   ? (selectedMenuItemsForChefForParty || [])
          //       .filter((item) => item.quantity > 0)
          //       .map((item) => ({
          //         ...item,
          //         price: parseFloat(item.price),
          //       }))
          //   : [],
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
          return;
        }

        if (
          response.data.success === true &&
          response.data.message === "order success" &&
          mod !== "cod" &&
          response?.data?.order
        ) {
          // nextStep(true);
          // return;

          setBookingData(response?.data?.order);
          setCallRazorPay(true);
        } else {
          nextStep(true);
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

  const [
    OptionsForNumberOFHoursForGardnerArray,
    setOptionsForNumberOFHoursForGardnerArray,
  ] = useState([]);
  const [
    SelectedNumberOfHoursObjectForGardner,
    setSelectedNumberOfHoursObjectForGardner,
  ] = useState({ hours: 0, price: 0 });

  // useEffect(() => {
  //   if (basicDataByGet?.gardener_time_durations?.length) {
  //     setOptionsForNumberOFHoursForGardnerArray(
  //       basicDataByGet?.gardener_time_durations
  //     );
  //     // Initialize with the first option's hours and price
  //     const firstOption = basicDataByGet?.gardener_time_durations[0];
  //     setSelectedNumberOfHoursObjectForGardner({
  //       hours: firstOption.hours,
  //       price: firstOption.price,
  //     });
  //   }
  // }, [basicDataByGet]);

  // useEffect(() => {
  //   if (DefaultDataOfBooking?.gardener_time_durations?.length) {
  //     setOptionsForNumberOFHoursForGardnerArray(
  //       DefaultDataOfBooking?.gardener_time_durations
  //     );
  //     // Initialize with the first option's hours and price
  //     const firstOption = DefaultDataOfBooking?.gardener_time_durations[0];
  //     setSelectedNumberOfHoursObjectForGardner({
  //       hours: firstOption.hours,
  //       price: firstOption.price,
  //     });
  //   }
  // }, [DefaultDataOfBooking]);

  useEffect(() => {
    // Check if gardener_time_durations exists in both sources
    if (basicDataByGet?.gardener_time_durations?.length) {
      setOptionsForNumberOFHoursForGardnerArray(
        basicDataByGet?.gardener_time_durations
      );

      // If DefaultDataOfBooking has a gardener_time_duration, parse it and merge with the options
      if (DefaultDataOfBooking?.gardener_time_duration) {
        const parsedDuration = JSON.parse(
          DefaultDataOfBooking?.gardener_time_duration
        );

        // Set the selected number of hours object with the parsed duration
        setSelectedNumberOfHoursObjectForGardner({
          hours: parsedDuration.hours,
          price: parsedDuration.price,
        });
      } else {
        // If no gardener_time_duration is found, initialize with the first option's hours and price
        const firstOption = basicDataByGet?.gardener_time_durations[0];
        setSelectedNumberOfHoursObjectForGardner({
          hours: firstOption.hours,
          price: firstOption.price,
        });
      }
    }
  }, [basicDataByGet, DefaultDataOfBooking]);

  // // Handle decrement
  // const handleDecrementHousForGardner = () => {
  //   const currentIndex = OptionsForNumberOFHoursForGardnerArray.findIndex(
  //     (option) => option.hours === SelectedNumberOfHoursObjectForGardner?.hours
  //   );

  //   if (currentIndex > 0) {
  //     const previousOption =
  //       OptionsForNumberOFHoursForGardnerArray[currentIndex - 1];
  //     setSelectedNumberOfHoursObjectForGardner({
  //       hours: previousOption.hours,
  //       price: previousOption.price,
  //     });
  //   } else {
  //     // Show toast notification for min limit
  //     // toast.error("You have to select at least the minimum number of hours.");
  //     toast.error("You cannot reduce the number of hours below the minimum while modifying.");
  //   }
  // };

  // Handle decrement
  const handleDecrementHousForGardner = () => {
    // Parse the incoming value from DefaultDataOfBooking or a predefined min value (if available)
    const incomingHours =
      JSON.parse(DefaultDataOfBooking?.gardener_time_duration)?.hours || 1; // Default min hours can be 1

    // Get the current index from the available options
    const currentIndex = OptionsForNumberOFHoursForGardnerArray.findIndex(
      (option) => option.hours === SelectedNumberOfHoursObjectForGardner?.hours
    );

    // Check if decrementing is allowed (should not go below incomingHours)
    if (
      currentIndex > 0 &&
      SelectedNumberOfHoursObjectForGardner?.hours > incomingHours
    ) {
      const previousOption =
        OptionsForNumberOFHoursForGardnerArray[currentIndex - 1];
      setSelectedNumberOfHoursObjectForGardner({
        hours: previousOption.hours,
        price: previousOption.price,
      });
    } else {
      // Show a toast notification if decrementing below the incoming hours
      toast.error(
        `You cannot reduce the number of hours below ${incomingHours} hours.`
      );
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

  // useEffect(() => {
  //   if (basicDataByGet?.driver_time_durations?.length) {
  //     setOptionsForNumberOFHoursForDriverArray(
  //       basicDataByGet?.driver_time_durations
  //     );
  //     // Initialize with the first option's hours and price
  //     const firstOption = basicDataByGet?.driver_time_durations[0];
  //     setSelectedNumberOfHoursObjectForDriver({
  //       hours: firstOption.hours,
  //       price: firstOption.price,
  //     });
  //   }
  // }, [basicDataByGet]);

  // useEffect(() => {
  //   if (DefaultDataOfBooking?.driver_time_durations?.length) {
  //     setOptionsForNumberOFHoursForDriverArray(
  //       DefaultDataOfBooking?.driver_time_durations
  //     );
  //     // Initialize with the first option's hours and price
  //     const firstOption = DefaultDataOfBooking?.driver_time_durations[0];
  //     setSelectedNumberOfHoursObjectForDriver({
  //       hours: firstOption.hours,
  //       price: firstOption.price,
  //     });
  //   }
  // }, [DefaultDataOfBooking]);

  useEffect(() => {
    // Check if driver_time_durations exists in basicDataByGet
    if (basicDataByGet?.driver_time_durations?.length) {
      setOptionsForNumberOFHoursForDriverArray(
        basicDataByGet?.driver_time_durations
      );

      // Check if DefaultDataOfBooking has a driver_time_duration and parse it
      if (DefaultDataOfBooking?.driver_time_duration) {
        const parsedDuration = JSON.parse(
          DefaultDataOfBooking?.driver_time_duration
        );

        // Set the selected number of hours object with the parsed duration
        setSelectedNumberOfHoursObjectForDriver({
          hours: parsedDuration.hours,
          price: parsedDuration.price,
        });
      } else {
        // If no driver_time_duration is found in DefaultDataOfBooking, initialize with the first option's hours and price from basicDataByGet
        const firstOption = basicDataByGet?.driver_time_durations[0];
        setSelectedNumberOfHoursObjectForDriver({
          hours: firstOption.hours,
          price: firstOption.price,
        });
      }
    }
  }, [basicDataByGet, DefaultDataOfBooking]);

  // // Handle decrement
  // const handleDecrementHousForDriver = () => {
  //   const currentIndex = OptionsForNumberOFHoursForDriverArray.findIndex(
  //     (option) => option.hours === SelectedNumberOfHoursObjectForDriver?.hours
  //   );

  //   if (currentIndex > 0) {
  //     const previousOption =
  //       OptionsForNumberOFHoursForDriverArray[currentIndex - 1];
  //     setSelectedNumberOfHoursObjectForDriver({
  //       hours: previousOption.hours,
  //       price: previousOption.price,
  //     });
  //   } else {
  //     // toast.error("You have to select at least the minimum number of hours.");
  //     toast.error("You cannot reduce the number of hours below the minimum while modifying.");

  //   }
  // };

  // Handle decrement
  const handleDecrementHousForDriver = () => {
    const currentIndex = OptionsForNumberOFHoursForDriverArray.findIndex(
      (option) => option.hours === SelectedNumberOfHoursObjectForDriver?.hours
    );

    // Get the incoming (minimum) hours value from DefaultDataOfBooking
    const incomingHours = DefaultDataOfBooking?.driver_time_duration
      ? JSON.parse(DefaultDataOfBooking?.driver_time_duration).hours
      : 1; // Default to 1 hour if no incoming value is found

    // Check if the current hours is greater than the minimum incoming hours
    if (
      currentIndex > 0 &&
      SelectedNumberOfHoursObjectForDriver?.hours > incomingHours
    ) {
      const previousOption =
        OptionsForNumberOFHoursForDriverArray[currentIndex - 1];
      setSelectedNumberOfHoursObjectForDriver({
        hours: previousOption.hours,
        price: previousOption.price,
      });
    } else {
      // Prevent reducing below the incoming hours
      toast.error(
        `You cannot reduce the number of hours below the minimum of ${incomingHours} hours.`
      );
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
  ] = useState({ hours: 0, price: 0 });

  // useEffect(() => {
  //   if (basicDataByGet?.gardener_monthly_subscriptions?.length) {
  //     setOptionsForNumberOFSlotsForMonthlyGardnerArray(
  //       basicDataByGet?.gardener_monthly_subscriptions
  //     );
  //     // Initialize with the first option's hours and price
  //     const firstOption = basicDataByGet?.gardener_monthly_subscriptions[0];
  //     setSelectedNumberOfSlotsObjectForMonthlyGardner({
  //       visit: firstOption.visit,
  //       hours: firstOption.hours,
  //       price: firstOption.price,
  //     });
  //   }
  // }, [basicDataByGet]);

  useEffect(() => {
    // Check if both basicDataByGet and DefaultDataOfBooking have subscriptions
    if (basicDataByGet?.gardener_monthly_subscriptions?.length) {
      setOptionsForNumberOFSlotsForMonthlyGardnerArray(
        basicDataByGet?.gardener_monthly_subscriptions
      );

      // If DefaultDataOfBooking has a gardener_monthly_subscription, parse it
      if (DefaultDataOfBooking?.gardener_monthly_subscription) {
        const parsedSubscription = JSON.parse(
          DefaultDataOfBooking?.gardener_monthly_subscription
        );
        setSelectedNumberOfSlotsObjectForMonthlyGardner({
          visit: parsedSubscription.visit,
          hours: parsedSubscription.hours,
          price: parsedSubscription.price,
        });
      } else {
        // Initialize with the first option's values from basicDataByGet
        const firstOption = basicDataByGet?.gardener_monthly_subscriptions[0];
        setSelectedNumberOfSlotsObjectForMonthlyGardner({
          visit: firstOption.visit,
          hours: firstOption.hours,
          price: firstOption.price,
        });
      }
    }
  }, [basicDataByGet, DefaultDataOfBooking]);

  // useEffect(() => {
  //   if (DefaultDataOfBooking?.gardener_monthly_subscriptions?.length) {
  //     setOptionsForNumberOFSlotsForMonthlyGardnerArray(
  //       DefaultDataOfBooking?.gardener_monthly_subscriptions
  //     );
  //     // Initialize with the first option's hours and price
  //     const firstOption = DefaultDataOfBooking?.gardener_monthly_subscriptions[0];
  //     setSelectedNumberOfSlotsObjectForMonthlyGardner({
  //       visit: firstOption.visit,
  //       hours: firstOption.hours,
  //       price: firstOption.price,
  //     });
  //   }
  // }, [DefaultDataOfBooking]);

  // const handleDecrementVisitsForMonthlyGardner = () => {
  //   const currentIndex =
  //     OptionsForNumberOFSlotsForMonthlyGardnerArray.findIndex(
  //       (option) =>
  //         option.visit === SelectedNumberOfSlotsObjectForMonthlyGardner?.visit
  //     );

  //   if (currentIndex > 0) {
  //     const previousOption =
  //       OptionsForNumberOFSlotsForMonthlyGardnerArray[currentIndex - 1];
  //     setSelectedNumberOfSlotsObjectForMonthlyGardner({
  //       visit: previousOption.visit,
  //       hours: previousOption.hours,
  //       price: previousOption.price,
  //     });
  //   } else {
  //     // Show toast notification for min limit
  //     // toast.error("You have to select at least the minimum number of visit.");
  //     toast.error("You cannot reduce the number of hours below the minimum while modifying.");
  //   }
  // };

  const [NumOfVisitsChanged, setNumOfVisitsChanged] = useState(false); // Renamed state

  const handleDecrementVisitsForMonthlyGardner = () => {
    const currentIndex =
      OptionsForNumberOFSlotsForMonthlyGardnerArray.findIndex(
        (option) =>
          option.visit === SelectedNumberOfSlotsObjectForMonthlyGardner?.visit
      );

    // Get the default minimum visit value
    const defaultVisit = JSON.parse(
      DefaultDataOfBooking?.gardener_monthly_subscription || "{}"
    )?.visit;

    if (currentIndex > 0) {
      const previousOption =
        OptionsForNumberOFSlotsForMonthlyGardnerArray[currentIndex - 1];

      // Prevent decrementing below the default visit value
      if (previousOption.visit >= defaultVisit) {
        setSelectedNumberOfSlotsObjectForMonthlyGardner({
          visit: previousOption.visit,
          hours: previousOption.hours,
          price: previousOption.price,
        });

        setNumOfVisitsChanged(true);
      } else {
        toast.error(
          "You cannot reduce the number of visits below the minimum allowed."
        );
        setNumOfVisitsChanged(false);
      }
    } else {
      // Notify user about the minimum visit limit
      toast.error(
        "You cannot reduce the number of visits below the minimum allowed."
      );
      setNumOfVisitsChanged(false);
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
      setNumOfVisitsChanged(true);
    } else {
      toast.error("You've reached the maximum number of visits.");
      setNumOfVisitsChanged(false);
    }
  };

  // const minPeople = basicDataByGet?.no_of_people[0]?.people_count;

  const minPeople = DefaultDataOfBooking?.people_count;

  const maxPeople =
    basicDataByGet?.no_of_people[basicDataByGet?.no_of_people.length - 1]
      ?.people_count;

  useEffect(() => {
    setdishesOptionsArray(basicDataByGet?.dishes);
  }, [basicDataByGet]);

  // useEffect(() => {
  //   if (basicDataByGet?.menu) {
  //     const initialMenu = basicDataByGet?.menu.map((item, index) => ({
  //       ...item,
  //       quantity: index === 0 ? 1 : 0,
  //     }));
  //     setMenuItems(initialMenu);

  //     const initialSelectedItems = basicDataByGet?.menu.map((item, index) => ({
  //       name: item.name,
  //       price: item.price,
  //       quantity: index === 0 ? 1 : 0,
  //     }));
  //     setSelectedMenuItemsForChefForParty(initialSelectedItems);
  //   }
  // }, [basicDataByGet]);

  // useEffect(() => {
  //   if (DefaultDataOfBooking?.menu) {

  //     const initialMenu = DefaultDataOfBooking?.menu.map((item, index) => ({
  //       ...item,
  //       quantity: index === 0 ? 1 : 0,
  //     }));
  //     setMenuItems(initialMenu);

  //     const initialSelectedItems = DefaultDataOfBooking?.menu.map((item, index) => ({
  //       name: item.name,
  //       price: item.price,
  //       quantity: item.quantity,
  //     }));
  //     setSelectedMenuItemsForChefForParty(initialSelectedItems);
  //   }
  // }, [DefaultDataOfBooking]);

  useEffect(() => {
    if (basicDataByGet?.menu) {
      // Create a map of selected menu items for quick lookup by name
      const selectedMenuMap = new Map(
        (DefaultDataOfBooking?.menu || []).map((item) => [
          item.name,
          item.quantity,
        ])
      );

      // Merge both arrays into a single array
      const mergedMenu = basicDataByGet.menu.map((item) => ({
        name: item.name,
        price: parseFloat(item.price), // Ensure price is a number
        quantity: selectedMenuMap.get(item.name) || 0,
            initialQuantity: selectedMenuMap.get(item.name) || 0,
      }));

      // Update the state with the merged array for menu items
      setMenuItems(mergedMenu);

      // Set the merged array in selected menu items for Chef for Party
      setSelectedMenuItemsForChefForParty(mergedMenu);
    }
  }, [basicDataByGet, DefaultDataOfBooking]);

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

  // const handleQuantityChangeForMenuItemsForChefForParty = (index, value) => {
  //   const totalQuantity = calculateTotalQuantityForChefForParty();

  //   // if (
  //   //   totalQuantity + value - selectedMenuItemsForChefForParty[index].quantity >
  //   //   4
  //   // ) {
  //   //   toast.error("Maximum total quantity reached (4).");
  //   //   return;
  //   // }

  //   // Prevent negative quantities for individual items
  //   if (value < 0) value = 0;

  //   // Prevent the total quantity from being less than 1
  //   const newTotalQuantity =
  //     totalQuantity + value - selectedMenuItemsForChefForParty[index].quantity;
  //   if (newTotalQuantity < 1) {
  //     toast.error("You have to select at least 1 menu.");
  //     return; // Prevent further changes if total quantity would become less than 1
  //   }

  //   // Update the selectedMenuItemsForChefForParty state
  //   const updatedSelectedItems = [...selectedMenuItemsForChefForParty];
  //   updatedSelectedItems[index].quantity = value;
  //   setSelectedMenuItemsForChefForParty(updatedSelectedItems);
  // };


  const handleQuantityChangeForMenuItemsForChefForParty = (index, value) => {
  const totalQuantity = calculateTotalQuantityForChefForParty();

  // Prevent negative quantities
  if (value < 0) value = 0;

  const initialQuantity = selectedMenuItemsForChefForParty[index].initialQuantity;

  if (value < initialQuantity) {
    toast.error("You cannot reduce the quantity below the initial selection.");
    console.log("error")
    return;
  }

  const newTotalQuantity = totalQuantity + value - selectedMenuItemsForChefForParty[index].quantity;

  if (newTotalQuantity < 1) {
    toast.error("You have to select at least 1 menu.");
    return;
  }

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
    // console.log("Checkbox Toggled:", id);
    // console.log("Current Menu:", menu);

    if (menu.includes(id)) {
      setMenu((prevMenu) => prevMenu.filter((item) => item !== id));
    } else {
      setMenu((prevMenu) => [...prevMenu, id]);
    }
  };

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

  useEffect(() => {
    if (DefaultDataOfBooking?.dishes && dishesOptionsArrayOri.length > 0) {
      // Map dish names from DefaultDataOfBooking to corresponding IDs
      const defaultSelectedIds = DefaultDataOfBooking.dishes
        .map(
          (dishName) =>
            dishesOptionsArrayOri.find((option) => option.name === dishName)?.id
        )
        .filter((id) => id !== undefined); // Filter out undefined IDs

      // console.log("Default Selected IDs:", defaultSelectedIds);

      // Update the menu state with the default selected IDs
      setMenu(defaultSelectedIds);

      // Set the names of the selected dishes based on the selected IDs
      const selectedDishNames = dishesOptionsArrayOri
        .filter((option) => defaultSelectedIds.includes(option.id))
        .map((option) => option.name);

      setSelectedNamesOfDishes(selectedDishNames);
    }
  }, [DefaultDataOfBooking, dishesOptionsArrayOri]);

  const getDateAfter30Days = (startDate) => {
    if (!startDate) return "Not selected";

    const thirtyDaysLater = new Date(startDate);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    return thirtyDaysLater.toDateString();
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
      // toast.error(`Minimum limit reached: ${minPeople} people`);
      toast.error(
        "Cannot reduce below the minimum number of people for booking."
      );
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const toRad = (degree) => (degree * Math.PI) / 180; // Convert degree to radians

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceInKm = R * c; // Distance in kilometers
    const distanceInMeters = distanceInKm * 1000; // Distance in meters

    return { distanceInKm, distanceInMeters };
  };

  // Calculate the distance if both locations are provided
  let distanceInKm = 0;
  let distanceInMeters = 0;

  if (
    selectedLocationFromForDriver?.latitude &&
    selectedLocationToForDriver?.latitude
  ) {
    const { distanceInKm: km, distanceInMeters: meters } = calculateDistance(
      selectedLocationFromForDriver.latitude,
      selectedLocationFromForDriver.longitude,
      selectedLocationToForDriver.latitude,
      selectedLocationToForDriver.longitude
    );
    distanceInKm = km;
    distanceInMeters = meters;
  }

  useEffect(() => {
    if (Array.isArray(basicDataByGet?.no_of_people) && people !== undefined) {
      const selectedEntry = basicDataByGet.no_of_people.find(
        (item) => Number(item?.people_count) === Number(people)
      );

      if (selectedEntry) {
        setTotalPrice(selectedEntry.base_price);
        setApproxTime(selectedEntry.aprox_time);
      } else {
        // console.log("No matching entry found for people:", people);
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
      initialEndDate.setDate(initialEndDate.getDate() + 43);
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
    // setSelectedDate(delhiDate);
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

    // setSelectedTime("");
  };

  const [selectedVisitDates, setSelectedVisitDates] = useState([]);
  const [isDatesChanged, setIsDatesChanged] = useState(false);

  // useEffect(() => {
  //   // if(NumOfVisitsChanged){
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
  //     // }

  //     // Update the state
  //     setSelectedVisitDates(newVisitDates);
  //   }
  // }
  // }, [
  //   MonthlySubscriptionStartDate,
  //   SelectedNumberOfSlotsObjectForMonthlyGardner,
  //   NumOfVisitsChanged,
  // ]);

  useEffect(() => {
    if (
      SelectedNumberOfSlotsObjectForMonthlyGardner?.visit > 0 &&
      isDatesChanged
    ) {
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
    NumOfVisitsChanged,
    isDatesChanged,
  ]);

  useEffect(() => {
    if (DefaultDataOfBooking?.gardener_visiting_slots) {
      try {
        // Parse and format dates
        const parsedSlots = JSON.parse(
          DefaultDataOfBooking.gardener_visiting_slots
        );
        const formattedSlots = parsedSlots.map((slot) => ({
          ...slot,
          date: slot.date
            ? new Date(slot.date).toISOString().split("T")[0]
            : null,
        }));
        console.log(formattedSlots, "formattedSlotsdsvjnkref");
        setSelectedVisitDates(formattedSlots);
      } catch (error) {
        console.error("Error parsing gardener_visiting_slots:", error);
      }
    }
  }, [DefaultDataOfBooking]);

  const [isTimeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");

  const [filteredTimeOptions, setFilteredTimeOptions] = useState([]);
  const [adjustedStartTime, setAdjustedStartTime] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  });

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

  useEffect(() => {
    updateMinTime(new Date());
  }, []);

  useEffect(() => {
    if (basicDataByGet?.sub_category?.booking_time_before) {
      setAdjustedStartTime(basicDataByGet.sub_category.booking_time_before);
    }
  }, [basicDataByGet]);

  const formatTimeTo12Hour = (time) => {
    const [hours, minutes] = time.split(":").map(Number);

    // Convert hours to 12-hour format
    const adjustedHours = hours % 12 || 12; // If hours is 0 or 12, it should display 12 (AM/PM format)
    const period = hours < 12 ? "AM" : "PM";

    // Return the formatted time
    return `${adjustedHours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  function findExactDateTimeWhenAdjustedTimeEnds(
    currentDate,
    serviceStartTimeInMinutes,
    serviceEndTimeInMinutes,
    unusedAdjustedStartTime
  ) {
    let date = new Date(currentDate); // Start from today
    date.setDate(date.getDate() + 1); // Move to tomorrow

    while (unusedAdjustedStartTime > 0) {
      const availableMinutesInNextDay =
        serviceEndTimeInMinutes - serviceStartTimeInMinutes;
      const actualTimeUsed = Math.min(
        unusedAdjustedStartTime,
        availableMinutesInNextDay
      );

      // Deduct the used minutes from unusedAdjustedStartTime
      unusedAdjustedStartTime -= actualTimeUsed;

      if (unusedAdjustedStartTime === 0) {
        const finalTimeInMinutes = serviceStartTimeInMinutes + actualTimeUsed;
        const finalHours = Math.floor(finalTimeInMinutes / 60);
        const finalMinutes = finalTimeInMinutes % 60;

        return {
          date: date.toISOString().split("T")[0], // Return the final date in YYYY-MM-DD format
          time: `${finalHours.toString().padStart(2, "0")}:${finalMinutes
            .toString()
            .padStart(2, "0")}`, // HH:MM format
        };
      }

      // Move to the next day
      date.setDate(date.getDate() + 1);
    }
  }

  const getCurrentTimeInHHMM = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };
  const currentTime = getCurrentTimeInHHMM();

  // const filterTimeOptions = () => {
  //   if (!selectedDate || timeOptions?.length === 0) return;

  //   const currentDate = new Date();
  //   const today = currentDate.toDateString();

  //   const serviceStartTime =
  //     basicDataByGet?.sub_category?.service_start_time || "00:00";
  //   const serviceEndTime =
  //     basicDataByGet?.sub_category?.service_end_time || "23:59";

  //   const currentTimeInMinutes = timeToMinutes(currentTime);

  //   const serviceStartTimeInMinutes = timeToMinutes(serviceStartTime);
  //   const serviceEndTimeInMinutes = timeToMinutes(serviceEndTime);

  //   let startBoundary = serviceStartTimeInMinutes;

  //   const remainingMinutesUntilServiceEnds = Math.max(
  //     serviceEndTimeInMinutes - currentTimeInMinutes,
  //     0
  //   );
  //   const actualAdjustedStartTimeUsed = Math.min(
  //     adjustedStartTime,
  //     remainingMinutesUntilServiceEnds
  //   );
  //   const availableMinutesToday = Math.max(
  //     serviceEndTimeInMinutes -
  //       (currentTimeInMinutes + actualAdjustedStartTimeUsed),
  //     0
  //   );
  //   const unusedAdjustedStartTime =
  //     adjustedStartTime - actualAdjustedStartTimeUsed;

  //   // If the adjusted start time has been fully used today, calculate the new start boundary
  //   if (unusedAdjustedStartTime === 0) {
  //     const finalTimeInMinutes = currentTimeInMinutes + adjustedStartTime;
  //     const finalHours = Math.floor(finalTimeInMinutes / 60);
  //     const finalMinutes = finalTimeInMinutes % 60;
  //     const finalTime = `${finalHours
  //       .toString()
  //       .padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`;

  //     // If the selected date is today, set the start boundary from where it ended
  //     if (selectedDate.toDateString() === today) {
  //       startBoundary = timeToMinutes(finalTime);
  //     } else {
  //       startBoundary = serviceStartTimeInMinutes; // For future dates, use service start time
  //     }

  //     setFilteredTimeOptions(
  //       timeOptions.filter((time) => {
  //         const timeInMinutes = timeToMinutes(time);
  //         return (
  //           timeInMinutes >= startBoundary &&
  //           timeInMinutes <= serviceEndTimeInMinutes
  //         );
  //       })
  //     );

  //     return; // Exit early since we don't need to call `findExactDateTimeWhenAdjustedTimeEnds`
  //   }

  //   // Now call the function only if unusedAdjustedStartTime is greater than 0
  //   const finalDateTime = findExactDateTimeWhenAdjustedTimeEnds(
  //     currentDate,
  //     serviceStartTimeInMinutes,
  //     serviceEndTimeInMinutes,
  //     unusedAdjustedStartTime
  //   );

  //   if (selectedDate.toDateString() === today && availableMinutesToday === 0) {
  //     setFilteredTimeOptions([]);
  //     return;
  //   }

  //   if (selectedDate < new Date(finalDateTime?.date)) {
  //     setFilteredTimeOptions([]);
  //     return;
  //   }

  //   if (selectedDate.toISOString().split("T")[0] === finalDateTime?.date) {
  //     startBoundary = timeToMinutes(finalDateTime?.time);
  //   } else {
  //     startBoundary = serviceStartTimeInMinutes;
  //   }

  //   const options = timeOptions.filter((time) => {
  //     const timeInMinutes = timeToMinutes(time);
  //     return (
  //       timeInMinutes >= startBoundary &&
  //       timeInMinutes <= serviceEndTimeInMinutes
  //     );
  //   });

  //   setFilteredTimeOptions(options);
  // };

// -------------------radha code-------------------------
  const filterTimeOptions = () => {
  if (!selectedDate || timeOptions?.length === 0) return;

  const currentDate = new Date();
  const today = currentDate.toDateString();

  const serviceStartTime =
    basicDataByGet?.sub_category?.service_start_time || "00:00";
  const serviceEndTime =
    basicDataByGet?.sub_category?.service_end_time || "23:59";

  const currentTimeInMinutes = timeToMinutes(currentTime);
  const serviceStartTimeInMinutes = timeToMinutes(serviceStartTime);
  const serviceEndTimeInMinutes = timeToMinutes(serviceEndTime);

  let startBoundary = serviceStartTimeInMinutes;

  // If the selected date is today, start after current time
  if (selectedDate.toDateString() === today) {
    startBoundary = Math.max(currentTimeInMinutes, serviceStartTimeInMinutes);
  }

  const options = timeOptions.filter((time) => {
    const timeInMinutes = timeToMinutes(time);
    return (
      timeInMinutes >= startBoundary &&
      timeInMinutes <= serviceEndTimeInMinutes
    );
  });

  setFilteredTimeOptions(options);
};

  const timeToMinutes = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  };

  useEffect(() => {
    filterTimeOptions();
  }, [selectedDate, basicDataByGet, adjustedStartTime]);

  // useEffect(() => {
  //   setSelectedTime(DefaultDataOfBooking?.visit_time);

  // }, [DefaultDataOfBooking]);

  useEffect(() => {
    if (DefaultDataOfBooking?.visit_time) {
      const formattedTime = DefaultDataOfBooking.visit_time.slice(0, 5); // Extracts only HH:mm
      setSelectedTime(formattedTime);
    }
  }, [DefaultDataOfBooking]);

  useEffect(() => {
    if (!DefaultDataOfBooking?.visit_date) return;

    // Convert visit_date to a Date object
    const visitDate = new Date(DefaultDataOfBooking.visit_date);

    setSelectedDate(visitDate);
  }, [DefaultDataOfBooking]);

  const convertToAmPm = (time) => {
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours, 10);
    const amPm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 hour to 12 for AM/PM format

    return `${hour}:${minutes} ${amPm}`;
  };

  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
  // });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY, // Your API key
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
                onClick={() => navigate("/my-profile")}
              >
                ←
              </button>
              <h1 className="booking-form-title">Modify Booking :</h1>
            </div>

            <form
              style={{ padding: "1rem" }}
              onSubmit={(e) => {
                e.preventDefault();
                // FunctionDataForPricesApplied();
              }}
            >
              <div className="booking-form-group">
                <label className="booking-form-label" htmlFor="guestName">
                  Guest Name
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
                    <div className="booking-form-group flex-fill">
                      <label
                        className="booking-form-label"
                        htmlFor="date-input"
                        style={{ margin: 0 }}
                      >
                        Visit Date :
                      </label>
                      <div className="previous_time_selected">
                        <span>
                          {DefaultDataOfBooking?.booking_date_time
                            ? DefaultDataOfBooking.booking_date_time
                                .split(", ")
                                .slice(0, 2)
                                .join(", ")
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="booking-form-group flex-fill">
                      <label
                        className="booking-form-label"
                        htmlFor="date-input"
                        style={{ margin: 0 }}
                      >
                        Visit Time:
                      </label>
                      <div className="previous_time_selected1">
                        <div className="previous_time_selected_child">
                          <div>Visit Time</div>
                          <div>
                            {" "}
                            {DefaultDataOfBooking?.booking_date_time
                              ? DefaultDataOfBooking.booking_date_time
                                  .split(", ")
                                  .pop() // Extract last part (Time)
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {service?.id === 9 && (
                <>
                  <div>
                    {/* <div className="booking-form-group flex-fill">
                      <label
                        className="booking-form-label"
                        htmlFor="date-input"
                      >
                        Monthly Package Start Date
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={MonthlySubscriptionStartDate}
                          onChange={handleStartDateChange}
                          minDate={new Date()}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </div> */}

                    <div className="booking-form-group flex-fill">
                      <label
                        className="booking-form-label"
                        htmlFor="date-input"
                        style={{ margin: 0 }}
                      >
                        Your Subscription Starts From:
                      </label>
                      <div className="previous_time_selected">
                        <span>
                          {MonthlySubscriptionStartDate
                            ? MonthlySubscriptionStartDate.toDateString()
                            : "Not selected"}
                        </span>
                      </div>
                    </div>

                    <div className="booking-form-group flex-fill">
                      <label
                        className="booking-form-label"
                        htmlFor="date-input"
                        style={{ margin: 0 }}
                      >
                        Your Subscription Ends At:
                      </label>
                      <div className="previous_time_selected">
                        <span>
                          {/* {MonthlySubscriptionEndsDate
                          ? MonthlySubscriptionEndsDate.toDateString()
                          : "Not calculated"} */}

                          {MonthlySubscriptionStartDate ? (
                            <div>
                              {/* Start Date: {MonthlySubscriptionStartDate.toDateString()} <br /> */}
                              {getDateAfter30Days(MonthlySubscriptionStartDate)}
                            </div>
                          ) : (
                            "Not selected"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                {service?.category_id === 1 && (
                  <>
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
                            Estimated Time{" "}
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
                    {service?.id === 6 && (
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
                          DefaultDataOfBooking &&
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
                      </div> */}

                        {/* 
<select
  id="visit-select"
  value={
    SelectedNumberOfSlotsObjectForMonthlyGardner
      ? `${SelectedNumberOfSlotsObjectForMonthlyGardner.visit}-${SelectedNumberOfSlotsObjectForMonthlyGardner.hours}-${SelectedNumberOfSlotsObjectForMonthlyGardner.price}`
      : ""
  }
  onChange={(e) => {
    const [visit, hours, price] = e.target.value.split("-");
    const selectedOption = OptionsForNumberOFSlotsForMonthlyGardnerArray.find(
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
  {OptionsForNumberOFSlotsForMonthlyGardnerArray.map((option, index) => {
    const hours = Math.floor(option.hours / 60);
    const minutes = option.hours % 60;
    return (
      <option
        key={index}
        value={`${option.visit}-${option.hours}-${option.price}`}
      >
        {`${option.visit} Visit${option.visit > 1 ? "s" : ""} - ${
          hours ? `${hours} hr${hours > 1 ? "s" : ""}` : ""
        } ${minutes ? `${minutes} min${minutes > 1 ? "s" : ""}` : ""} per visit`}
      </option>
    );
  })}
</select> */}

                        {/* <select
  id="visit-select"
  value={
    SelectedNumberOfSlotsObjectForMonthlyGardner
      ? `${SelectedNumberOfSlotsObjectForMonthlyGardner.visit}-${SelectedNumberOfSlotsObjectForMonthlyGardner.hours}-${SelectedNumberOfSlotsObjectForMonthlyGardner.price}`
      : ""
  }
  onChange={(e) => {
    const [visit, hours, price] = e.target.value.split("-");
    const selectedOption = OptionsForNumberOFSlotsForMonthlyGardnerArray.find(
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
  {OptionsForNumberOFSlotsForMonthlyGardnerArray.map((option, index) => {
    const hours = Math.floor(option.hours / 60);
    const minutes = option.hours % 60;

    // Find index of the selected option
    const selectedIndex = OptionsForNumberOFSlotsForMonthlyGardnerArray.findIndex(
      (opt) =>
        opt.visit === SelectedNumberOfSlotsObjectForMonthlyGardner?.visit &&
        opt.hours === SelectedNumberOfSlotsObjectForMonthlyGardner?.hours &&
        opt.price === SelectedNumberOfSlotsObjectForMonthlyGardner?.price
    );

    const isDisabled = index < selectedIndex;

    return (
      <option
        key={index}
        value={`${option.visit}-${option.hours}-${option.price}`}
        disabled={isDisabled} // Disable options before the selected one
        style={{
          color: isDisabled ? "red" : "black", // Apply red color to disabled options
        }}
      >
        {`${option.visit} Visit${option.visit > 1 ? "s" : ""} - ${
          hours ? `${hours} hr${hours > 1 ? "s" : ""}` : ""
        } ${minutes ? `${minutes} min${minutes > 1 ? "s" : ""}` : ""} per visit`}
      </option>
    );
  })}
</select> */}

                        <div
                          style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "14px",
                            backgroundColor: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span style={{ flexGrow: 1 }}>
                            {SelectedNumberOfSlotsObjectForMonthlyGardner
                              ? `${
                                  SelectedNumberOfSlotsObjectForMonthlyGardner.visit
                                } Visit${
                                  SelectedNumberOfSlotsObjectForMonthlyGardner.visit >
                                  1
                                    ? "s"
                                    : ""
                                } - ${Math.floor(
                                  SelectedNumberOfSlotsObjectForMonthlyGardner.hours /
                                    60
                                )} hr${
                                  SelectedNumberOfSlotsObjectForMonthlyGardner.hours >
                                  60
                                    ? "s"
                                    : ""
                                } ${
                                  SelectedNumberOfSlotsObjectForMonthlyGardner.hours %
                                  60
                                    ? `${
                                        SelectedNumberOfSlotsObjectForMonthlyGardner.hours %
                                        60
                                      } min${
                                        SelectedNumberOfSlotsObjectForMonthlyGardner.hours %
                                          60 >
                                        1
                                          ? "s"
                                          : ""
                                      }`
                                    : ""
                                } per visit`
                              : "Select a Slot"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {MonthlySubscriptionStartDate &&
                      MonthlySubscriptionEndsDate &&
                      selectedVisitDates.map((visit, index) => {
                        // Find the latest selected date from previous visits (exclude the current index)
                        const latestSelectedDate =
                          index > 0
                            ? selectedVisitDates
                                .slice(0, index) // Consider only previous visit dates
                                .map((v) => new Date(v.date))
                                .sort((a, b) => b - a)[0]
                            : null; // No restriction for the first visit

                        // Collect all selected dates to disable them everywhere
                        const selectedDatesSet = new Set(
                          selectedVisitDates.map((v) =>
                            new Date(v.date).toDateString()
                          )
                        );
                        console.log(
                          selectedVisitDates,
                          "selectedVisitDateskjnskdjvhk"
                        );
                        console.log(
                          selectedDatesSet,
                          "selectedDatesSetscdcsbhj"
                        );
                        return (
                          <div
                            key={index}
                            className="booking-form-group flex-fill"
                          >
                            <label className="booking-form-label">
                              Select Visit Date {index + 1}
                            </label>
                            <div className="date-scroll-container">
                              {getUpcomingDatesToVisits(
                                new Date(MonthlySubscriptionStartDate),
                                new Date(MonthlySubscriptionEndsDate)
                              ).map((date, i) => {
                                const dateString = date.toDateString();
                                const isSelected =
                                  visit.date &&
                                  new Date(visit.date).toDateString() ===
                                    dateString;

                                // Disable the date if:
                                // - It is already selected anywhere
                                // - It is before the latest selected date for visits > 0
                                const isDisabled =
                                  (selectedDatesSet.has(dateString) &&
                                    !isSelected) ||
                                  (latestSelectedDate &&
                                    date < latestSelectedDate);
                                return (
                                  <div
                                    key={i}
                                    className={`date-item ${
                                      isSelected ? "selected" : ""
                                    } ${isDisabled ? "disabled" : ""}`}
                                    onClick={() => {
                                      if (isDisabled) return; // Prevent selecting disabled dates
                                      setIsDatesChanged(true);
                                      const updatedDates = [
                                        ...selectedVisitDates,
                                      ];
                                      let nextDate = new Date(date);

                                      // Validate that the selected date is within the range
                                      if (
                                        nextDate >
                                        new Date(MonthlySubscriptionEndsDate)
                                      ) {
                                        return; // Stop if the first selection itself is out of range
                                      }

                                      // Update the selected visit date
                                      updatedDates[index] = {
                                        ...updatedDates[index],
                                        date: date.toISOString().split("T")[0],
                                      };

                                      // Auto-update subsequent visits
                                      for (
                                        let i = index + 1;
                                        i < updatedDates.length;
                                        i++
                                      ) {
                                        do {
                                          nextDate.setDate(
                                            nextDate.getDate() + 3
                                          ); // Increment by 3 days
                                        } while (
                                          selectedDatesSet.has(
                                            nextDate.toDateString()
                                          )
                                        ); // Skip disabled dates

                                        // Stop if the next date is out of range
                                        if (
                                          nextDate >
                                          new Date(MonthlySubscriptionEndsDate)
                                        ) {
                                          break;
                                        }

                                        updatedDates[i] = {
                                          ...updatedDates[i],
                                          date: nextDate
                                            .toISOString()
                                            .split("T")[0],
                                        };

                                        // Add the new date to the set
                                        selectedDatesSet.add(
                                          nextDate.toDateString()
                                        );
                                      }

                                      setSelectedVisitDates(updatedDates);
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (
                                        (e.key === "Enter" || e.key === " ") &&
                                        !isDisabled
                                      ) {
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
                                    style={{
                                      opacity: isDisabled ? 0.5 : 1,
                                      pointerEvents: isDisabled
                                        ? "none"
                                        : "auto",
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
                          </div>
                        );
                      })}
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
                          Select Dishes
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
                                    checked={menu.includes(option.id)} // Properly compare IDs
                                    onChange={() =>
                                      handleCheckboxChange(option.id)
                                    } // Toggle selection
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
                                    {/* <input
                                      type="number"
                                      value={item?.quantity}
                                      min={0}
                                      max={4}

                                      // onChange={(e) =>
                                      //   handleQuantityChangeForMenuItemsForChefForParty(
                                      //     index,
                                      //     parseInt(e.target.value) || 0
                                      //   )
                                      // }

                                      onChange={(e) => {
                                        // Check if the new quantity is less than the initial quantity
                                        const newQuantity =
                                          parseInt(e.target.value) || 0;

                                        if (newQuantity < item?.quantity) {
                                          // Show toast notification if quantity is being reduced
                                          toast.error(
                                            "You cannot reduce the quantity below the initial selection."
                                          );
                                          return; // Prevent the change
                                        }

                                        // Otherwise, update the quantity
                                        handleQuantityChangeForMenuItemsForChefForParty(
                                          index,
                                          newQuantity
                                        );
                                      }}
                                      style={{
                                        width: "50px",
                                        padding: "5px",
                                        border: "1px solid #ddd",
                                      }}
                                    /> */}


{/* <input
  type="number"
  value={item?.quantity}
  // min={item?.initialQuantity}
  max={4}
  onKeyDown={(e) => e.preventDefault()} // Prevent typing
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
/> */}

{/* --------------2nd code------------------- */}





<div style={{ position: 'relative', display: 'inline-block' }}>
    <input
      type="text"
      value={item?.quantity}
      // min={item?.initialQuantity}
      max={4}
      onKeyDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }} // Prevent typing
      onKeyPress={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }} // Additional prevention
      onKeyUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }} // Prevent key up events
      onInput={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // Reset to original value if somehow changed
        e.target.value = item?.quantity || 0;
        return false;
      }} // Prevent input changes
      onPaste={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }} // Prevent paste
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }} // Prevent drag-drop
      onFocus={(e) => {
        // Blur immediately to prevent virtual keyboard on problematic devices
        e.target.blur();
      }}
      onTouchStart={(e) => {
        // Prevent touch typing on mobile
        e.preventDefault();
      }}
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
        paddingRight: "20px", // Make room for custom arrows
        // Try to show native arrows first
        WebkitAppearance: "auto",
        MozAppearance: "spinner-textfield",
        appearance: "auto",
        // Additional mobile prevention
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
      inputMode="none" // Prevent mobile keyboard
      autoComplete="off"
      readOnly={false} // Keep as false to allow arrows to work
      tabIndex={-1} // Remove from tab order
      // Additional attributes for Vivo and other Android devices
      data-prevent-typing="true"
    />
    
    {/* Custom arrows as fallback for problematic devices */}
    <div style={{
      position: 'absolute',
      right: '2px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      fontSize: '10px',
      lineHeight: '1',
      pointerEvents: 'auto'
    }}>
      <button
        type="button"
        onClick={() => {
          const newValue = Math.min(item?.quantity + 1, 4);
          handleQuantityChangeForMenuItemsForChefForParty(index, newValue);
        }}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: '1px 2px',
          fontSize: '8px'
        }}
      >
        ▲
      </button>
      <button
        type="button"
        onClick={() => {
          const newValue = Math.max(item?.quantity - 1, 0);
          handleQuantityChangeForMenuItemsForChefForParty(index, newValue);
        }}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: '1px 2px',
          fontSize: '8px'
        }}
      >
        ▼
      </button>
    </div>
  </div>

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
                  Special Requests / Instructions
                </label>
                <input
                  className="booking-textarea"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Enter Your Special Request"
                />
              </div>

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
    Secure Fees {service?.secure_fee}
  </label>
</div>
 )} */}

              <div className="payable-amount-section">
                <p className="payable-amount">
                  ₹ {basePrice} <br />
                  Base Amount
                </p>

                <button
                  // type="submit"
                  className="continue-button"
                  // onClick={nextStep}
                  onClick={(e) => {
                    e.preventDefault();
                    FunctionDataForPricesApplied();
                  }}
                  // onClick={validateFieldsStepOne}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="booking-booking-form">
            {loading && <Loader />}
            <div className="booking-summary-header">
              <button
                onClick={() => setStep(1)}
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
                  </>
                )}

                <div className="booking-detail-card">
                  {service.id !== 9 && (
                    <div>
                      <strong>Date :</strong>{" "}
                      <div>
                        {new Date(
                          DataForPricesAppliedGet?.visit_date
                        ).toLocaleDateString("en-GB")}
                      </div>
                    </div>
                  )}

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

                  <div></div>
                </div>
                <div className="booking-detail-card">
                  <div>
                    <strong>Special Requests / Instructions:</strong>
                  </div>{" "}
                  <div>{specialRequests || "None"}</div>
                </div>
              </div>

              <h3 className="booking-summary-label">Charges Breakdown</h3>
              <div className="fare-breakdown-section">
                <div className="fare-breakdown-card">
                  {service.category_id === 1 && (
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
                  )}

                  {service.id === 8 && (
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
                  )}

                  {service.category_id === 1 && (
                    <>
                      <div className="fare-breakdown-div">
                        <div className="fare-breakdown-title">
                          Charges for dishes/menu items:
                        </div>
                        <div>+₹ {DataForPricesAppliedGet?.menu_amount}</div>
                      </div>
                    </>
                  )}

                  <div className="fare-breakdown-div">
                    <div className="fare-breakdown-title">Base Price :</div>
                    <div>₹ {DataForPricesAppliedGet?.actual_price}</div>
                  </div>
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
                  {/* <div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">Sub-Total :</div>
                  <div> ₹ {DataForPricesAppliedGet?.sub_total_amount}</div>
                </div> */}

                  <div className="fare-breakdown-div">
                    <div className="fare-breakdown-title">Discount :</div>
                    <div> -₹ {DataForPricesAppliedGet?.discount_amount}</div>
                  </div>

                  <div className="fare-breakdown-div">
                    <div className="fare-breakdown-title">Reward Points :</div>
                    <div> -₹ {DataForPricesAppliedGet?.use_points_amount}</div>
                  </div>

                  <div className="fare-breakdown-div">
                    <div className="fare-breakdown-title">Total Amount :</div>
                    <div>₹ {DataForPricesAppliedGet?.total_amount}</div>
                  </div>

                  <div className="fare-breakdown-div">
                    <div className="fare-breakdown-title">Taxes and Fees :</div>
                    <div>+₹ {DataForPricesAppliedGet?.all_taxes}</div>
                  </div>
                  {service.category_id === 2 && (
                    <>
                      {/* <div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">Secure Fee :</div>
                  <div>+₹ {DataForPricesAppliedGet?.secure_fee}</div>
                </div> */}
                    </>
                  )}

                  {/* <div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">Platform Fee:</div>
                  <div>+₹ {DataForPricesAppliedGet?.platform_fee}</div>
                </div> */}

                  {/* <div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">Price After Discount :</div>
                  <div>₹ {DataForPricesAppliedGet?.price}</div>
                </div> */}

                  <hr />

                  <div className="fare-breakdown-div mt-1">
                    <div className="fare-breakdown-title">
                      <h5>Total Amount :</h5>
                    </div>
                    <div>
                      <h5>₹ {DataForPricesAppliedGet?.new_total}</h5>
                    </div>
                  </div>

                  <div className="fare-breakdown-div mt-1">
                    <div className="fare-breakdown-title">
                      <h5>Previous Amount: </h5>
                    </div>
                    <div>
                      <h5>-₹ {DataForPricesAppliedGet?.collected_amount}</h5>
                    </div>
                  </div>

                  <div className="fare-breakdown-div mt-1">
                    <div className="fare-breakdown-title">
                      <h5>Extra/Final Amount To Be Paid :</h5>
                    </div>
                    <div>
                      <h5>₹ {DataForPricesAppliedGet?.billing_amount}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="booking-summary-footer ">
              <div className="estimated-fare">
                <div>
                  <h4>Estimated Extra Fare</h4>
                </div>
                <div>
                  <p>
                    {" "}
                    <h4>₹{DataForPricesAppliedGet?.billing_amount} </h4>
                  </p>
                </div>
              </div>

              <button
                className="checkout-button"
                // onClick={() => {
                //   if (DataForPricesAppliedGet?.billing_amount == 0) {
                //     // setStep(4);
                //     setStep(3);

                //   } else {
                //     nextStep(3); // Proceed normally otherwise
                //   }
                // }}
                onClick={nextStep}
              >
                Checkout
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
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

                {DefaultDataOfBooking?.payment_mode === "cod" &&
                  service.id !== 9 && (
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

        {step === 4 && (
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
                Your booking has been successfully modified. We will notify you
                once it is confirmed by the service provider!
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

export default ModifyBooking;
