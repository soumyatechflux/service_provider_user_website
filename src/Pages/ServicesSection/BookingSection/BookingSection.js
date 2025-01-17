import React, { useEffect, useRef, useState } from "react";
import "./BookingSection.css";
import { ChevronLeft, Loader, MapPin, Voicemail } from "lucide-react";
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


const BookingSection = () => {
  const token = sessionStorage.getItem("ServiceProviderUserToken");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = location.state || {}; // Handle case where no state is passed
  const [dishesOptionsArray, setdishesOptionsArray] = useState([]);


  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItemsForChefForParty, setSelectedMenuItemsForChefForParty] = useState([]);


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
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/booking_data/${service?.id}`
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
    
    const voucherCode = selectedCouponObject ? selectedCouponObject.voucher_code : null;

    try {
      const body = {
        booking: {
          category_id: service?.category_id || "",
          sub_category_id: service?.id || "",

          visit_date: (service?.id === 9 ) ? MonthlySubscriptionStartDate : selectedDate,

          visit_time: selectedTime,
          visit_address_id: selectedLocation?.address_id || "",
          address_from: service?.category_id === 2 ? selectedLocationFromForDriver?.address_id : "",
          address_to: service?.category_id === 2 ? selectedLocationToForDriver?.address_id : "",
          car_type: "",
          transmission_type: "",
          no_of_hours_booked: "",

          number_of_people: SelectedObjectOfPeople || {},
          guest_name: BookingForGuestName || "Guest",
          instructions: specialRequests || "",
          payment_mode: "",
          dishes: (service?.id === 1 || service?.id === 2) ? SelectedNamesOfDishes : [],


          gardener_time_duration: (service?.id === 8 ) ? SelectedNumberOfHoursObjectForGardner : {},

          gardener_monthly_subscription: (service?.id === 9 ) ? SelectedNumberOfSlotsObjectForMonthlyGardner : {},
          gardener_visiting_slots: (service?.id === 9 ) ? selectedVisitDates : [],
          
         voucher_code: voucherCode ? voucherCode : "",

          // menu: service?.id === 3 ? selectedMenuItemsForChefForParty : [],
          menu: service?.id === 3 
          ? selectedMenuItemsForChefForParty
              .filter(item => item.quantity > 0)
              .map(item => ({
                ...item, 
                price: parseFloat(item.price) 
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
  
      if (response.data.success) {
        setDataForPricesAppliedGet(response?.data?.data);
        setStep(5); 
        // window.scrollTo({ top: 0, behavior: "smooth" }); 
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









  const [selectedDate, setSelectedDate] = useState(new Date());




  const [selectedTime, setSelectedTime] = useState("");
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
    const minutes = String(Math.floor(delhiTime.getMinutes() / 15) * 15).padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const updateMinTime = (date) => {
    const isToday = date.toDateString() === new Date().toDateString();
    setMinTime(isToday ? getCurrentTimeInDelhi() : "00:00");
  };
  


  const handleDateChange = (newDate) => {
    const delhiDate = new Date(
      newDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
  
    setSelectedDate(delhiDate);
  
    const isToday = delhiDate.toDateString() === new Date().toDateString();
  
    if (isToday) {
      updateMinTime(new Date()); // Update minTime to current time for today
    } else {
      setMinTime("00:00"); // Reset minTime for future dates
    }
  
    setSelectedTime(""); // Clear the time selection
  };




  // Generate 15-minute intervals for the entire day
  const generateTimeIntervals = () => {
    const intervals = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        intervals.push(time);
      }
    }
    return intervals;
  };
  
  const timeOptions = generateTimeIntervals();
  
  const getCurrentTimeInHHMM = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  
  const filterTimeOptions = () => {
    const currentDate = new Date();
    const today = currentDate.toDateString();
    const currentTime = getCurrentTimeInHHMM();
  
    // Extract service start and end times
    const serviceStartTime = basicDataByGet?.sub_category?.service_start_time || "00:00:00";
    const serviceEndTime = basicDataByGet?.sub_category?.service_end_time || "23:59:59";
  
    // Convert service times to HH:MM format
    const startTime = serviceStartTime.slice(0, 5); // "00:00:00" -> "00:00"
    const endTime = serviceEndTime.slice(0, 5); // "19:30:00" -> "19:30"
  
    // Filter time options
    return timeOptions.filter((time) => {
      const isWithinServiceHours = time >= startTime && time <= endTime;
  
      if (selectedDate.toDateString() === today) {
        return time >= currentTime && isWithinServiceHours;
      }
  
      return isWithinServiceHours;
    });
  };
  
  
  const filteredTimeOptions = filterTimeOptions();



  const convertTo12HourFormat = (time) => {
    if (!time) return "Not Available";
    const [hours, minutes] = time.split(":");
    const hourInt = parseInt(hours, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const formattedHour = hourInt % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${formattedHour}:${minutes} ${ampm}`;
  };






  const [people, setPeople] = useState(1);







  // const [SelectedObjectOfPeople, setSelectedObjectOfPeople] = useState({});
  const [SelectedObjectOfPeople, setSelectedObjectOfPeople] = useState(null);


  const [totalPrice, setTotalPrice] = useState();
  const [approxTime, setApproxTime] = useState();
  const [basePrice, setBasePrice] = useState(totalPrice);



  const [specialRequests, setSpecialRequests] = useState();



  // step 3 constants

  const [selectedLocation, setSelectedLocation] = useState({
  });

  const [selectedLocationFromForDriver, setSelectedLocationFromForDriver] = useState({
  });  
  const [selectedLocationToForDriver, setSelectedLocationToForDriver] = useState({
  });

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      setSelectedLocation(addresses[0]);
      setSelectedLocationFromForDriver(addresses[0]);
      setSelectedLocationToForDriver(addresses[0]);

    }
  }, [addresses]);


  
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);



  const handleSubmitForm = (e) => {
    e.preventDefault();
    setStep(2); // Move to Step 2
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // const handleCheckboxChange = (id) => {
  //   if (menu.includes(id)) {
  //     setMenu(menu.filter((item) => item !== id));
  //   } else {
  //     setMenu([...menu, id]);
  //   }
  // };

  const handleCheckboxChangeForDriver = (id) => {
    // If the item is already selected, do nothing
    if (menu.includes(id)) {
      return;
    }
  
    // Otherwise, set the selected item to the new id and close the dropdown
    setMenu([id]); // This ensures only one item is selected
    setIsDropdownOpen(false); // Close the dropdown after selection
  };
  
  const validateFieldsStepOne = (e) => {
    e.preventDefault();
  
    if (service.id !== 9) {
      if (BookingForGuestName === "" || selectedDate === "" || selectedTime === "" || people <= 0) {
        setMessage("Please fill all required fields.");
        setShow(true);
        handleShow();
        return;
      }
    }
  
    nextStep();
  };
  




  const [callRazorPay, setCallRazorPay] = useState(false);
  const [BookingData, setBookingData] = useState();

  const handlePayment = async (mod) => {

    setLoading(true);

    try {
      const body = {
        booking: {
          booking_id: DataForPricesAppliedGet ? DataForPricesAppliedGet.booking_id : "",
          payment_mode: mod
        }
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

        if (response?.data?.order) {
          setBookingData(response?.data?.order);
          setCallRazorPay(true);
        } else {
          setBookingData();
          setCallRazorPay(false);
        }

        if (mod === "cod") {
          // toast.info("Please confirm your booking to proceed.");

          nextStep(true);

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











  const handleConfirmAddress = () => {


 FunctionDataForPricesApplied();

   // setStep(5); 
  // window.scrollTo({ top: 0, behavior: "smooth" }); 

  }





  const [OptionsForNumberOFHoursForGardnerArray, setOptionsForNumberOFHoursForGardnerArray] = useState([]);
  const [SelectedNumberOfHoursObjectForGardner, setSelectedNumberOfHoursObjectForGardner] = useState({ hours: 0, price: 0 });
  
  useEffect(() => {
    if (basicDataByGet?.gardener_time_durations?.length) {
      setOptionsForNumberOFHoursForGardnerArray(basicDataByGet?.gardener_time_durations);
      // Initialize with the first option's hours and price
      const firstOption = basicDataByGet?.gardener_time_durations[0];
      setSelectedNumberOfHoursObjectForGardner({ hours: firstOption.hours, price: firstOption.price });
    }
  }, [basicDataByGet]);
  
  // Handle decrement
  const handleDecrementHousForGardner = () => {
    const currentIndex = OptionsForNumberOFHoursForGardnerArray.findIndex(
      (option) => option.hours === SelectedNumberOfHoursObjectForGardner?.hours
    );
  
    if (currentIndex > 0) {
      const previousOption = OptionsForNumberOFHoursForGardnerArray[currentIndex - 1];
      setSelectedNumberOfHoursObjectForGardner({ hours: previousOption.hours, price: previousOption.price });
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
      const nextOption = OptionsForNumberOFHoursForGardnerArray[currentIndex + 1];
      setSelectedNumberOfHoursObjectForGardner({ hours: nextOption.hours, price: nextOption.price });
    } else {
      // Show toast notification for max limit
      toast.error("You've reached the maximum number of hours.");
    }
  };












  const [OptionsForNumberOFSlotsForMonthlyGardnerArray, setOptionsForNumberOFSlotsForMonthlyGardnerArray] = useState([]);
  const [SelectedNumberOfSlotsObjectForMonthlyGardner, setSelectedNumberOfSlotsObjectForMonthlyGardner] = useState({ hours: 0, price: 0 });
  
  useEffect(() => {
    if (basicDataByGet?.gardener_monthly_subscriptions?.length) {
      setOptionsForNumberOFSlotsForMonthlyGardnerArray(basicDataByGet?.gardener_monthly_subscriptions);
      // Initialize with the first option's hours and price
      const firstOption = basicDataByGet?.gardener_monthly_subscriptions[0];
      setSelectedNumberOfSlotsObjectForMonthlyGardner({ visit: firstOption.visit, hours: firstOption.hours, price: firstOption.price });
    }
  }, [basicDataByGet]);
  
  const handleDecrementVisitsForMonthlyGardner = () => {
    const currentIndex = OptionsForNumberOFSlotsForMonthlyGardnerArray.findIndex(
      (option) => option.visit === SelectedNumberOfSlotsObjectForMonthlyGardner?.visit
    );
  
    if (currentIndex > 0) {
      const previousOption = OptionsForNumberOFSlotsForMonthlyGardnerArray[currentIndex - 1];
      setSelectedNumberOfSlotsObjectForMonthlyGardner({ visit: previousOption.visit, hours: previousOption.hours, price: previousOption.price });
    } else {
      // Show toast notification for min limit
      toast.error("You have to select at least the minimum number of visit.");
    }
  };
  
  const handleIncrementVisitsForMonthlyGardner = () => {
    const currentIndex = OptionsForNumberOFSlotsForMonthlyGardnerArray.findIndex(
      (option) => option.visit === SelectedNumberOfSlotsObjectForMonthlyGardner?.visit
    );
  
    if (currentIndex < OptionsForNumberOFSlotsForMonthlyGardnerArray.length - 1) {
      const nextOption = OptionsForNumberOFSlotsForMonthlyGardnerArray[currentIndex + 1];
      setSelectedNumberOfSlotsObjectForMonthlyGardner({ visit: nextOption.visit,  hours: nextOption.hours, price: nextOption.price });
    } else {
      // Show toast notification for max limit
      toast.error("You've reached the maximum number of visits.");
    }
  };









  
  const minPeople = basicDataByGet?.no_of_people[0]?.people_count; 
  const maxPeople = basicDataByGet?.no_of_people[basicDataByGet?.no_of_people.length - 1]?.people_count; 
  


  const htmlToText = (htmlString) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;
    return tempElement.textContent || tempElement.innerText;
  };
  
  const cancellationPolicy = htmlToText(basicDataByGet?.sub_category?.cancellation_policy);

  const additionalDetails =  htmlToText(basicDataByGet?.sub_category?.booking_details);

  const bookingSummery =  htmlToText(basicDataByGet?.sub_category?.booking_summary);






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
          price:  item.price,
          quantity: index === 0 ? 1 : 0, // Set 1 for the first item, 0 for others
        }));
        setSelectedMenuItemsForChefForParty(initialSelectedItems);
      }
    }, [basicDataByGet]);
  
    // Calculate the total quantity of all selected items
    const calculateTotalQuantityForChefForParty = () => {
      return selectedMenuItemsForChefForParty.reduce((total, item) => total + item.quantity, 0);
    };
  
    const calculateTotalPriceForMenuForChefForParty = () => {
      return selectedMenuItemsForChefForParty.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    };

  
    const handleQuantityChangeForMenuItemsForChefForParty = (index, value) => {
      const totalQuantity = calculateTotalQuantityForChefForParty();
    
      // Check if the total quantity exceeds the maximum allowed (4)
      if (totalQuantity + value - selectedMenuItemsForChefForParty[index].quantity > 4) {
        toast.error("Maximum total quantity reached (4).");
        return; // Prevent further changes if total quantity exceeds 4
      }
    
      // Prevent negative quantities for individual items
      if (value < 0) value = 0;
    
      // Prevent the total quantity from being less than 1
      const newTotalQuantity = totalQuantity + value - selectedMenuItemsForChefForParty[index].quantity;
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
    const calculateTotalForMenuItemForChefForParty = (price, quantity) => price * quantity;





  


  const dishesOptionsArrayOri = basicDataByGet?.dishes.map((dish) => ({
    id: dish?.dish_id,
    name: dish?.dish_name || "Unnamed Dish",
  }));

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
      setBasePrice(parseFloat(totalPrice) + parseFloat(calculateTotalPriceForMenuForChefForParty()));
    } else {
      if(service?.id === 8 || service?.id !== 9) {
         setBasePrice(SelectedNumberOfHoursObjectForGardner?.price);
        }      else if(service?.id !== 8 || service?.id === 9) {
          setBasePrice(SelectedNumberOfSlotsObjectForMonthlyGardner?.price);
         } 
      else {
        setBasePrice(totalPrice); 
      }

    }
  }, [totalPrice, service,people,selectedMenuItemsForChefForParty,SelectedNumberOfHoursObjectForGardner,SelectedNumberOfSlotsObjectForMonthlyGardner]);




  const [MonthlySubscriptionStartDate, setMonthlySubscriptionStartDate] = useState(new Date());
  const [MonthlySubscriptionEndsDate, setMonthlySubscriptionEndsDate] = useState(() => {
    const initialEndDate = new Date();
    initialEndDate.setDate(initialEndDate.getDate() + 30);
    return initialEndDate;
  });

  const handleStartDateChange = (newDate) => {
    setMonthlySubscriptionStartDate(newDate);

    if (newDate) {
      const calculatedEndDate = new Date(newDate);
      calculatedEndDate.setDate(calculatedEndDate.getDate() + 30);
      setMonthlySubscriptionEndsDate(calculatedEndDate);
    }
  };


  const [selectedVisitDates, setSelectedVisitDates] = useState([]);

  useEffect(() => {
    if (SelectedNumberOfSlotsObjectForMonthlyGardner?.visit > 0) {
      // Calculate the hours per visit
      const hoursPerVisit = SelectedNumberOfSlotsObjectForMonthlyGardner.hours / SelectedNumberOfSlotsObjectForMonthlyGardner.visit;
  
      // Initialize the selected dates array
      const newVisitDates = [];
  
      // Calculate the date for each visit
      let currentDate = new Date(MonthlySubscriptionStartDate);
      for (let i = 0; i < SelectedNumberOfSlotsObjectForMonthlyGardner.visit; i++) {
        newVisitDates.push({
          date: currentDate.toISOString().split('T')[0], // Format date to YYYY-MM-DD
          hours: hoursPerVisit
        });
  
        // Increment the date by 7 days for each visit (adjust as needed)
        currentDate.setDate(currentDate.getDate() + 3); // You can change the interval as needed
      }
  
      // Update the state
      setSelectedVisitDates(newVisitDates);
    }
  }, [SelectedNumberOfSlotsObjectForMonthlyGardner, MonthlySubscriptionStartDate]);

  







  const handleApplyCoupen = async () => {
    // setIsCouponsVisible(false);
    setLoading(true);

    const selectedCouponObject = DataForPricesAppliedGet?.discount?.find(
      (coupon) => coupon.voucher_id === selectedCoupon
    );
    
    const voucherCode = selectedCouponObject ? selectedCouponObject.voucher_code : null;


    try {
      const body = {
   
          booking_id: DataForPricesAppliedGet ? DataForPricesAppliedGet.booking_id : "",
          voucher_code: voucherCode ? voucherCode : "",
        
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
        toast.success(response?.data?.message || "Coupen id Valid.");
        setIsCouponsVisible(false);

      } else {
        toast.error(response?.data?.message || "Coupen id In-Valid at this time.");
      }

    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
  
    }
  };















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




            <form>
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

     











{ (service?.id !== 9)&& (
<>

              <div>
      {/* Date Picker */}
      <div className="booking-form-group flex-fill">
        <label className="booking-form-label" htmlFor="date-input">
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
      </div>

      {/* Time Picker */}
      <div className="booking-form-group">
    <label className="booking-form-label" htmlFor="time-select">
      Select Time of Visit
    </label>
    <div className="booking-time-dropdown-wrapper">
      <select
        id="time-select"
        className="booking-time-dropdown"
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
      >
        <option value="" disabled>
          Select a time
        </option>
        {filteredTimeOptions.map((time) => (
      <option key={time} value={time}>
        {time}
      </option>
    ))}
      </select>
    </div>
  </div>

    </div>

</>
)}
















{ (service?.id === 9)&& (
<>

             <div>
      {/* Date Picker */}
      <div className="booking-form-group flex-fill">
        <label className="booking-form-label" htmlFor="date-input">
        Monthly Subscription Start Date
        </label>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={MonthlySubscriptionStartDate}
            onChange={handleStartDateChange}
            minDate={new Date()}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>

      <div className="booking-cooking-time">
  Your Subscription Starts From:{" "}
  {/* <br /> */}
  <strong>
    {MonthlySubscriptionStartDate
      ? MonthlySubscriptionStartDate.toDateString()
      : "Not selected"}
  </strong>
  <br />
  Your Subscription Ends At:{" "}
  {/* <br /> */}
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


              {(service?.category_id === 1)  &&  (
               
               <>

                <div className="booking-form-group">
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
                </div>

</>
)}


                
















{(service?.category_id === 3 && service?.id === 8) && (
               
               <>
 <div className="booking-form-group">
    <label className="booking-form-label">Number of Hours</label>
    <div className="booking-counter-container">
      <button
        type="button"
        className="booking-counter-button"
        onClick={handleDecrementHousForGardner}
      >
        -
      </button>
      <span className="booking-counter-value">{SelectedNumberOfHoursObjectForGardner?.hours}</span>
      <button
        type="button"
        className="booking-counter-button"
        onClick={handleIncrementHousForGardner}
      >
        +
      </button>
    </div>
  </div>

</>
)}


                









{(service?.category_id === 3 && service?.id === 9) && (
               
               <>
 <div style={{marginTop:"20px"}} className="booking-form-group">
    <label className="booking-form-label">Number of Visiting Slots</label>
    <div className="booking-counter-container">
      <button
        type="button"
        className="booking-counter-button"
        onClick={handleDecrementVisitsForMonthlyGardner}
      >
        -
      </button>
      <span className="booking-counter-value">{SelectedNumberOfSlotsObjectForMonthlyGardner?.visit}</span>
      <button
        type="button"
        className="booking-counter-button"
        onClick={handleIncrementVisitsForMonthlyGardner}
      >
        +
      </button>
    </div>
  </div>




  {selectedVisitDates.map((visit, index) => (
    <div key={index} className="booking-form-group flex-fill">
      <label className="booking-form-label" htmlFor={`visit-date-${index}`}>
        Select Visit Date {index + 1}
      </label>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          value={visit.date ? new Date(visit.date) : null}
          onChange={(newDate) => {
            const updatedDates = [...selectedVisitDates];
            updatedDates[index].date = newDate.toISOString().split('T')[0];
            setSelectedVisitDates(updatedDates);
          }}
          minDate={new Date(MonthlySubscriptionStartDate)}
          maxDate={new Date(MonthlySubscriptionEndsDate)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <div>
  Average Time per Slot:{" "}
  {(() => {
    const totalMinutes = visit.hours; // Assuming 'visit.hours' is in minutes
    const hours = Math.floor(totalMinutes / 60); // Get the hours part
    const minutes = Math.floor(totalMinutes % 60); // Get the remaining minutes and round down
    return `${hours} hours ${minutes} minutes`; // Display only complete hours and minutes
  })()}
</div>


    </div>
  ))}


</>
)}
























                <div
                  className="booking-form-group"
                  style={{ position: "relative" }}
                >
               

               
               
                  {(service?.category_id === 1 ) && (service?.id !== 3) && (service?.id !== 8 || service?.id !== 9)&& (
        <>
           <label className="booking-form-label">
                    Select Dishes (Optional)
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
                onChange={() => handleCheckboxChange(option.id)}
                style={{
                  margin: 0,
                  cursor: "pointer",
                }}
              />
              <label htmlFor={`service-${option.id}`} style={{ margin: 0 }}>
                {option.name}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
        </>
      )}








        
               
               
{(service?.category_id === 2)&& (service?.id !== 3)   && (service?.id !== 8)&&(
               
               <>
            
               
                  <label className="booking-form-label">
                    Select Cars (Optional)
                  </label>

            <div
  className="dropdown-container"
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "4px", // Reduce gap between elements
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
      width: "100%", // Full width for better alignment
    }}
  >
    {menu.length > 0
      ? `Selected: ${dishesOptionsArray
          .filter((option) => menu.includes(option.id))
          .map((option) => option.name)
          .join(", ")}`
      : "Select a service"}
    <span>{isDropdownOpen ? "▲" : "▼"}</span>
  </div>

  {/* Dropdown options list */}
  {isDropdownOpen && (
    <div
      className="dropdown-options"
      style={{
        position: "absolute",
        top: "100%", // Place the dropdown directly below the input
        left: 0,
        right: 0,
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "white",
        width: "100%", // Match the width of the input
        maxHeight: "200px",
        overflowY: "auto",
        zIndex: 10,
        padding: "0", // Remove padding to reduce space
      }}
    >
      {dishesOptionsArray.map((option) => (
        <div
          key={option.id}
          className="dropdown-option"
          style={{
            padding: "8px",
            display: "flex", // Align checkbox and label on the same line
            alignItems: "center", // Center the checkbox and text vertically
            gap: "8px", // Add space between checkbox and text
          }}
        >
          <input
            type="checkbox"
            className="menu-checkbox"
            id={`service-${option.id}`}
            value={option.id}
            checked={menu.includes(option.id)}
            onChange={() => handleCheckboxChangeForDriver(option.id)}
            style={{
              margin: 0, // Remove any margin around the checkbox
              cursor: "pointer",
            }}
          />
          <label htmlFor={`service-${option.id}`} style={{ margin: 0 }}>
            {option.name}{" "}
          </label>
        </div>
      ))}
    </div>
  )}
</div>

                  </>

)}


































{(service?.id === 3)  &&  (
  <>
   <div className="menu-form">
      <label className="booking-form-label">Select Menu Items</label>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {selectedMenuItemsForChefForParty.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>₹ {item.price}</td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  min={0}
                  max={4}
                  onChange={(e) =>
                    handleQuantityChangeForMenuItemsForChefForParty(index, parseInt(e.target.value) || 0)
                  }
                  style={{
                    width: "50px",
                    padding: "5px",
                    border: "1px solid #ddd",
                  }}
                />
              </td>
              <td>₹ {calculateTotalForMenuItemForChefForParty(item.price, item.quantity)}</td>
            </tr>
          ))}
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
                <div className="additional-details">
                  <h3>Additional Details</h3>
                  <div className="details-item">
                  {additionalDetails}
                  </div>
                </div>

                <div className="additional-details">
                  <h3>Booking Summary</h3>
                  <div className="details-item">
                  {bookingSummery}
                  </div>
                </div>
                
                <div className="cancellation-policy">
                  <h3>Cancellation Policy</h3>
                  <div className="cancellation-policy-div">
                    <p>
                      {cancellationPolicy}

                      </p>
                    <Link
                      to = "/cancellation-policy"
                      className="read-policy-button"
                      
                    >
                      READ CANCELLATION POLICY<IoIosArrowForward className="arrow_for_cancellation"/>
                    </Link>
                  </div>
                </div>
              </div>









<table style={{ width: "100%", borderCollapse: "collapse" }}>
  <tbody>
    <tr>
      <td style={{ padding: "8px", borderBottom: "1px solid #ddd", fontWeight: "bold" }}>
        Night Charge
      </td>
      <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
        ₹ {basicDataByGet?.sub_category?.night_charge || "Not Available"}
      </td>
    </tr>
    <tr>
      <td style={{ padding: "8px", borderBottom: "1px solid #ddd", fontWeight: "bold" }}>
        Night Charge Starts From
      </td>
      <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
        {convertTo12HourFormat(basicDataByGet?.sub_category?.night_charge_start_time)}
      </td>
    </tr>
    <tr>
      <td style={{ padding: "8px", borderBottom: "1px solid #ddd", fontWeight: "bold" }}>
        Night Charge Ends At
      </td>
      <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
        {convertTo12HourFormat(basicDataByGet?.sub_category?.night_charge_end_time)}
      </td>
    </tr>

    <tr>
      <td style={{ padding: "8px", borderBottom: "1px solid #ddd", fontWeight: "bold" }}>
     Cancellation Facility will be Available Before
      </td>
      <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
        {formatTime(basicDataByGet?.sub_category?.cancellation_time_before)}
      </td>
    </tr>



    <tr>
      <td style={{ padding: "8px", borderBottom: "1px solid #ddd", fontWeight: "bold" }}>
     Free Cancellation will be Available Before
      </td>
      <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
      {formatTime(basicDataByGet?.sub_category?.free_cancellation_time_before)}
      </td>
    </tr>


  </tbody>
</table>









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





<div 
style={{
  overflowY: "auto", 
  maxHeight: "450px",
}} 
className="address-section mt-0">
     



{(service?.category_id === 1 || service?.category_id === 3 )&& (
  <>
       {addresses.map((address, index) => (
  <div key={address.address_id} className="mb-3" style={{border:"2px solid #D8D8D8", padding:"5px", borderRadius:"5px"}}>
    <div className="d-flex align-items-center">
      {/* Radio button for selecting address */}
      <input
        type="radio"
        name="address"
        id={`address-${address.address_id}`}
        checked={selectedLocation?.address_id === address?.address_id} 
        onChange={() => setSelectedLocation(address)} 
        className="me-2"
        style={{cursor:"pointer", width:"auto"}}
      />
      <p className="flex-fill mb-0 address-p">
        <span className="serial-number me-2">{index + 1}.</span>
        {address.house}, {address.street_address}{" "}
        {address.street_address_line2}, {address.landmark},{" "}
        {address.city} - {address.state} {address.postal_code}{" "}
        {address.country}
      </p>


      


      <Dropdown className="custom-dropdown-container">
        <Dropdown.Toggle
          as="span"
          id="dropdown-custom-components"
           className="custom-dropdown-toggle"
          bsPrefix="custom-toggle" // Disables Bootstrap’s caret icon
        >
          <BsThreeDotsVertical size={18} style={{ cursor: "pointer" }} />
        </Dropdown.Toggle>
        <Dropdown.Menu className="custom-dropdown-menu-booking">
          
          <Dropdown.Item
          className="custom-dropdown-item-booking"
            onClick={() => {
              setAddressToEdit(address?.address_id);
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
      {(service?.category_id === 2) && (
        <>
          <span>Select Address From:</span>
          {addresses.map((address, index) => (
            <div
              key={address.address_id}
              className="mb-3"
              style={{ border: "2px solid #D8D8D8", padding: "5px", borderRadius: "5px" }}
            >
              <div className="d-flex align-items-center">
                {/* Radio button for selecting address */}
                <input
                  type="radio"
                  name="address-from"
                  id={`address-from-${address.address_id}`}
                  checked={selectedLocationFromForDriver?.address_id === address?.address_id}
                  onChange={() => setSelectedLocationFromForDriver(address)}
                  className="me-2"
                  style={{ cursor: "pointer", width: "auto" }}
                />
                <p className="flex-fill mb-0 address-p">
                  <span className="serial-number me-2">{index + 1}.</span>
                  {address.house}, {address.street_address} {address.street_address_line2}, {address.landmark}, {address.city} - {address.state} {address.postal_code} {address.country}
                </p>
                <Dropdown className="custom-dropdown-container">
                  <Dropdown.Toggle
                    as="span"
                    id="dropdown-custom-components"
                     className="custom-dropdown-toggle"
                    bsPrefix="custom-toggle"
                  >
                    <BsThreeDotsVertical size={18} style={{ cursor: "pointer" }} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="custom-dropdown-menu-booking">
                    <Dropdown.Item
                    className="custom-dropdown-item-booking"
                      onClick={() => {
                        setAddressToEdit(address?.address_id);
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
        </>
      )}

      <hr />

      {(service?.category_id === 2) && (
        <>
          <span>Select Address To:</span>
          {addresses.map((address, index) => (
            <div
              key={address.address_id}
              className="mb-3"
              style={{ border: "2px solid #D8D8D8", padding: "5px", borderRadius: "5px" }}
            >
              <div className="d-flex align-items-center">
                {/* Radio button for selecting address */}
                <input
                  type="radio"
                  name="address-to"
                  id={`address-to-${address.address_id}`}
                  checked={selectedLocationToForDriver?.address_id === address?.address_id}
                  onChange={() => setSelectedLocationToForDriver(address)}
                  className="me-2"
                  style={{ cursor: "pointer", width: "auto" }}
                />
                <p className="flex-fill mb-0 address-p">
                  <span className="serial-number me-2">{index + 1}.</span>
                  {address.house}, {address.street_address} {address.street_address_line2}, {address.landmark}, {address.city} - {address.state} {address.postal_code} {address.country}
                </p>
                <Dropdown className="custom-dropdown-container">
                  <Dropdown.Toggle
                    as="span"
                    id="dropdown-custom-components"
                    className="custom-dropdown-toggle"
                    bsPrefix="custom-toggle"
                  >
                    <BsThreeDotsVertical size={18} style={{ cursor: "pointer" }} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="custom-dropdown-menu-booking">
                    <Dropdown.Item
                    className="custom-dropdown-item-booking"
                      onClick={() => {
                        setAddressToEdit(address?.address_id);
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
        </>
      )}
    </>































































          <a className="add-address" onClick={() => setIsAddingAddress(true)}>
            + Add New Address
          </a>

          {/* Modal for Adding New Address */}
          <Modal show={isAddingAddress} onHide={cancelAddAddress} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add New Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddAddressForm
                fetchProfile={fetchProfile}
                cancelAddAddress={cancelAddAddress}
              />
            </Modal.Body>
          </Modal>

          {/* Modal for Editing Address */}
          <Modal show={isEditingAddress} onHide={() => setIsEditingAddress(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Edit Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EditAddressForm
                addressId={addressToEdit}
                closeModal={() => setIsEditingAddress(false)}
                refreshAddresses={fetchProfile} // A function to refresh the address list
              />
            </Modal.Body>
          </Modal>

         
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
        {selectedLocation.house}, {selectedLocation.street_selectedLocation}{" "}
        {selectedLocation.street_selectedLocation_line2}, {selectedLocation.landmark},{" "}
        {selectedLocation.city} - {selectedLocation.state} {selectedLocation.postal_code}{" "}
        {selectedLocation.country}
      </p>
                  </div>
              </div>
              </>

)}





{(service?.category_id === 2) && (

<>

              <div className="booking-detail-card">
                <div>
                  <strong>Address From:</strong>
                </div>
                <div>
                <p className="flex-fill mb-0 address-p">
      {selectedLocationFromForDriver?.house}, {selectedLocationFromForDriver?.street_address}{" "}
      {selectedLocationFromForDriver?.street_address_line2}, {selectedLocationFromForDriver?.landmark}, {" "}
      {selectedLocationFromForDriver?.city} - {selectedLocationFromForDriver?.state} {selectedLocationFromForDriver?.postal_code}{" "}
      {selectedLocationFromForDriver?.country}
    </p>
                  </div>
              </div>








              <div className="booking-detail-card">
                <div>
                  <strong>Address To:</strong>
                </div>
                <div>
                <p className="flex-fill mb-0 address-p">
                {selectedLocationToForDriver?.house}, {selectedLocationToForDriver?.street_address}{" "}
      {selectedLocationToForDriver?.street_address_line2}, {selectedLocationToForDriver?.landmark}, {" "}
      {selectedLocationToForDriver?.city} - {selectedLocationToForDriver?.state} {selectedLocationToForDriver?.postal_code}{" "}
      {selectedLocationToForDriver?.country}
    </p>
                  </div>
              </div>

              </>

)}





































<div className="booking-detail-card">
  <div>
    <strong>{service.id === 8 ? 'Number of Hours :' : 'Number of People :'}</strong>
  </div>
  <div>
    {service.id === 8 
      ? SelectedNumberOfHoursObjectForGardner?.hours 
      : people}
  </div>
</div>

          
              <div className="booking-detail-card">
                <div>
                  <strong>Date :</strong>{" "}

                  <div>{new Date(DataForPricesAppliedGet?.visit_date).toLocaleDateString('en-GB')}</div>

                </div>


                {DataForPricesAppliedGet?.visit_time !== "00:00:00" && (
  <>
    <div>
      <strong>Time :</strong>{" "}
      <div>{new Date(`1970-01-01T${DataForPricesAppliedGet?.visit_time}Z`).toLocaleTimeString('en-GB')}</div>
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

            <div className="booking-summary-offers">
              <h3 className="booking-summary-label">Offers</h3>





              <div>
      {/* Menu Toggle Button */}
      <button
  className="menu-toggle-button"
  onClick={handleCouponsVisibility}
  style={{
    padding: "10px 20px",
    backgroundColor: isCouponsVisible ? "#FF5722" : "#4CAF50", // Change background color based on visibility
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Center content horizontally
    width: "100%",
    textAlign: "center",
    margin: "0 auto", // Center the button horizontally within its container
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
          {DataForPricesAppliedGet?.discount?.map((coupon) => (
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
  {/* Displaying discount type and value */}
  <strong>
    {coupon.discount_type === "fixed"
      ? "Fixed Discount"
      : "Percentage Discount"}:
  </strong>{" "}
  {/* Conditionally display rupee or percentage */}
  {coupon.discount_type === "fixed" ? (
    <>
      ₹ {coupon.discount_value}{" "}
      {/* <FaRupeeSign size={16} style={{ verticalAlign: "middle", marginLeft: "5px" }} /> */}
    </>
  ) : (
    <>
      {coupon.discount_value} %{" "}
      {/* <FaPercent size={16} style={{ verticalAlign: "middle", marginLeft: "5px" }} /> */}
    </>
  )}
  <p className="mb-0 ml-2 text-sm">
    Minimum Order: ₹ {coupon.minimum_order_amount}
  </p>

  <p className="mb-0 ml-2 text-sm">
  Voucher Code:  {coupon.voucher_code}
  </p>

</div>


              <div>
                {/* Radio button for selecting coupon */}
                <input
                  type="radio"
                  id={`coupon-${coupon.voucher_id}`}
                  name="coupon"
                  checked={selectedCoupon === coupon.voucher_id} // Check if this coupon is selected
                  onChange={() => handleRadioChange(coupon.voucher_id)} // Handle radio button change
                  style={{ marginRight: "8px" , cursor:"pointer"}}
                />
           
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Button */}
      <div>
        <button
          className="offer-apply-button"
          style={{
            padding: "10px 20px",
            backgroundColor: selectedCoupon ? "#4CAF50" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: selectedCoupon ? "pointer" : "not-allowed",
            marginTop: "20px",
            marginBottom: "20px",
            width: "100%",
          }}
          disabled={!selectedCoupon}
          onClick={handleApplyCoupen}
        >
          Apply
        </button>
      </div>
    </div>











            </div>

            <h3 className="booking-summary-label">Fare Breakdown</h3>
            <div className="fare-breakdown-section">
              <div className="fare-breakdown-card">

                {/* <div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">Base Amount:</div>
                  <div> ₹ {basePrice} </div>
                </div> */}



{service.category_id === 1 && (
  <>
<div className="fare-breakdown-div">
  <div className="fare-breakdown-title">Service Charges:</div>
  <div>
    {(() => {
      const numberOfPeople = JSON.parse(DataForPricesAppliedGet?.number_of_people || "{}");
      const { people_count, price } = numberOfPeople;
      return `For ${people_count} person = ₹ ${ price}`;
    })()}
  </div>
</div>
</>
)}




{service.id === 8 && (
  <>
<div className="fare-breakdown-div">
  <div className="fare-breakdown-title">Service Charges:</div>
  <div>
    {(() => {
      const numberOfHours = JSON.parse(DataForPricesAppliedGet?.gardener_time_duration || "{}");
      const { hours, price } = numberOfHours;
      return `For ${hours} hours = ₹ ${ price}`;
    })()}
  </div>
</div>
</>
)}


{service.category_id === 1 && (
  <>
<div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">Charges for dishes/menu items:</div>
                  <div>+₹ {DataForPricesAppliedGet?.menu_amount}</div>
                </div>
                </>
              )}



          
                <div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">GST:</div>
                  <div>+₹ {DataForPricesAppliedGet?.gst_amount}</div>
                </div>


                <div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">Secure Fee:</div>
                  <div>+₹ {DataForPricesAppliedGet?.secure_fee}</div>
                </div>


                <div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">Platform Fee:</div>
                  <div>+₹ {DataForPricesAppliedGet?.platform_fee}</div>
                </div>


                <div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">Night Charges:</div>
                  <div>+₹ {DataForPricesAppliedGet?.night_charge}</div>
                </div>





<div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">Total Base Price:</div>
                  <div>+₹ {DataForPricesAppliedGet?.price}</div>
                </div>


<div className="fare-breakdown-div">
                  <div className="fare-breakdown-title">Discount:</div>
                  <div> -₹ {DataForPricesAppliedGet?.discount_amount}</div>
                </div>



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
                    Hurray! You saved ₹ {DataForPricesAppliedGet?.discount_amount} on the final bill
                  </p>
                </div>
              </div>
            </div>
{/* 
            <div className="additional-details">
              <h3>Additional Details</h3>
              <div className="details-item">
                <span className="mb-1">🌙 Night Surcharge Policy</span>
                <span className="mb-1">
                  ⏰ Timing: {additionalDetails.surchargeTiming}
                </span>
                <span className="mb-1">
                  💵 Surcharge: {additionalDetails.surchargeRate}
                </span>
              </div>
            </div>
            
            */}

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
        <h2 className="payment-title">Bill Total: ₹ {DataForPricesAppliedGet?.billing_amount}</h2>
      </div>

      <div className="payment-section-body">
        <button 
          className="payment-option-button"
          onClick={(event) => {
            handlePayment("online");
            setCallRazorPay(true);
            event.target.disabled = true;
            setMakeDisable(true);
          }}
          disabled={makeDisable}
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

        <button 
          className="payment-option-button"
          onClick={(event) => {
            handlePayment("cod");
            setCallRazorPay(false);
            event.target.disabled = true;
            setMakeDisable(true);
          }}
          disabled={makeDisable}
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

              <p className="success-message" style={{marginBottom:"200px", textAlign:"center" ,fontWeight:"bold"}}>
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
   
          <h2 className="booking-main-title">{basicDataByGet?.sub_category?.sub_category_name}</h2>
          <img
            src={basicDataByGet?.sub_category?.image}
            alt="Chef illustration"
            className="booking-illustration"
          />
            <h4 style={{marginTop:"10px"}}
            
             >
          Description : 
          <br />
          {basicDataByGet?.sub_category?.description}</h4>
        </div>
      </div>
    </>
  );

};

export default BookingSection;