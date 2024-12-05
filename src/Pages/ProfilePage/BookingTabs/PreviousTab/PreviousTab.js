import React, { useEffect, useState } from "react";
import { Star, Clock, User, Trophy, ChefHat } from "lucide-react";
import "./PreviousTab.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../../Loader/Loader";

function PreviousTab() {
  const [openBookingIndex, setOpenBookingIndex] = useState(null);
  const [previousBookings, setPreviousBookings] = useState([]);
  const [bookingsIdWise,setBookingIdwise]= useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("ServiceProviderUserToken")

  const navigate = useNavigate();

  const handleModifyButton = () => {
    navigate('/my-profile');
  }

  const handleViewMore= async(id)=>{
    try {
      setLoading(true);
      // const response = await getUpCommingBookingsAPI();
      const response = await axios.get(`${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/bookings/${id}`,
        
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Upcomming Booking response",response)
      console.log(response.status)
      if(response.status===200 && response.data.success===true){
        console.log("response.data.data",response.data.data)
        setBookingIdwise(response.data.data || []); // Assuming the response contains a `bookings` field
      }
      
    } catch (error) {
      // toast.error("Failed to fetch upcomming bookings.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // const bookingData = [
  //   {
  //     serviceType: "Cook for one meal",
  //     provider: {
  //       name: "Khushi K",
  //       role: "Cook",
  //       rating: 4.5,
  //       experience: "12+ Yrs Exp.",
  //       avatar: "K",
  //     },
  //     booking: {
  //       date: "22nd Nov, Tuesday",
  //       time: "07:30 PM",
  //       address: "123 Connaught Place, Rajiv Chowk, New Delhi, Delhi, 110001",
  //       people: 2,
  //       menu: "Paneer Butter Masala, Jeera Rice, Roti",
  //       specialRequests: "Please avoid spicy food.",
  //     },
  //     billing: {
  //       total: 699,
  //       discount: 100,
  //       gst: 50,
  //       grandTotal: 749,
  //       paymentMode: "Paytm UPI",
  //     },
  //     status: {
  //       message: "Provider has reached your location",
  //       time: "Today, 10:30 AM",
  //       amount: 250,
  //     },
  //   },
    
  // ];
  useEffect(() => {
    const fetchUpcommingBookings = async () => {
      try {
        setLoading(true);
        // const response = await getUpCommingBookingsAPI();
        const response = await axios.get(`${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/previous_bookings`,
          
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        console.log("Previous Booking response",response)
        console.log(response.status)
        if(response.status===200 && response.data.success===true){
          console.log("response.data.data",response.data.data)
          setPreviousBookings(response.data.data || []); // Assuming the response contains a `bookings` field
        }
        
      } catch (error) {
        // toast.error("Failed to fetch upcomming bookings.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcommingBookings();
  }, []);

  if (loading) {
    return <Loader/>;
  }
  
  return (
    <div className="booking-container">
      {previousBookings.map((booking, index) => (
        <div key={index} className="booking-item">
          {openBookingIndex === index ? (
            // Detailed View
            <div className="booking-details mt-3">
            <div className="column1">
              <div className="details-header">
                <h2 className="details-head"> {(bookingsIdWise?.visit_date)}</h2>
               
                <div className="service-image image-flex">
                  <img src="./../ServicesSection/CookingSection/chef-cooking-2.jpg" />
                  <h3 className="heading-text">{bookingsIdWise?.sub_category?.sub_category_name}</h3>
                </div>
              </div>
              <div className="provider-section">
                <h3 className="heading-text">Service Provider</h3>
                <div className="provider-info">
                  <div className="provider-avatar">
                   <img 
                    src={bookingsIdWise?.partner?.image || bookingsIdWise?.partner?.name?.charAt(0)}
                    //  alt="image"
                     style={{height:"60px", width:"70px",borderRadius:"50%"}}
                   />
                  </div>
                  <div className="provider-details">
                    <h4 className="provider-name">{bookingsIdWise?.partner?.name}</h4>
                    <p className="provider-role">{bookingsIdWise?.category?.category_name}</p>
                  </div>
                </div>
                <div className="rating-profile mt-2">
                  <div>
                    <Star className="star-icon mr-1" />
                    <span>
                      <span style={{ fontWeight: "bold" }}>
                        {bookingsIdWise?.partner?.rating} out of 5
                      </span>{" "}
                      Rating
                    </span>
                  </div>
                  <div>
                    <Trophy className="clock-icon mr-1" />
                    <span className="">{bookingsIdWise?.partner?.years_of_experience}</span>
                  </div>
                </div>
              </div>
              {/* <div className="details-actions">
              <button className="btn-cancel" onClick={() => handleCancelClick(index)}>Cancel</button>
                <button className="btn-modify-upcoming">Modify</button>
              </div> */}
            </div>
            <div className="column2">
              <h3 className="heading-text mb-4">Booking Details</h3>
              <div className="booking-info">
                <div className="info-group">
                  <h4 className="booking-subtitle">Booking For</h4>
                  <p className="booking-info-text">
                    {bookingsIdWise?.category?.category_name} - {bookingsIdWise?.sub_category?.sub_category_name}
                  </p>
                </div>
                <div className="info-group">
                  <h4 className="booking-subtitle">Address</h4>
                  <p className="booking-info-text">{bookingsIdWise?.address_from}</p>
                </div>
                <div className="info-group">
                  <h4 className="booking-subtitle">Number of People</h4>
                  <p className="booking-info-text">{bookingsIdWise?.number_of_people}</p>
                </div>
                <div className="info-group">
                  <h4 className="booking-subtitle">Menu and Dishes</h4>
                  <p className="booking-info-text">{bookingsIdWise?.instructions}</p>
                </div>
                <div className="info-group">
                  <h4 className="booking-subtitle">Date & Time</h4>
                  <p className="booking-info-text">{`${(bookingsIdWise?.visit_date)}, ${bookingsIdWise?.visit_time}`}</p>
                </div>
                <div className="info-group">
                  <h4 className="booking-subtitle">Special Requests / Instructions</h4>
                  <p className="booking-info-text">{bookingsIdWise?.instructions}</p>
                </div>
              </div>
            </div>
            <div className="column3">
              <h3 className="heading-text mb-4">Billing Details</h3>
              <div className="billing-info">
                <div className="billing-row">
                  <span className="billing-subtitle">Total</span>
                  <span className="billing-subtitle">₹{bookingsIdWise?.price}</span>
                </div>
                <div className="billing-row discount">
                  <span className="billing-subtitle">Discount</span>
                  <span className="billing-subtitle">-₹{bookingsIdWise?.discount}</span>
                </div>
                <div className="billing-row">
                  <span className="billing-subtitle">GST</span>
                  <span className="billing-subtitle">₹{bookingsIdWise?.gst_amount}</span>
                </div>
                <div className="billing-row total">
                  <span className="billing-subtitle text-bold">Grand Total</span>
                  <span className="final-amount">
                    ₹{bookingsIdWise?.billing_amount}
                  </span>
                </div>
                <div className="payment-mode">
                  <span className="billing-subtitle">Payment mode</span>
                  <span className="billing-subtitle">{bookingsIdWise?.payment_mode}</span>
                </div>
              </div>
            </div>
            <button
              className="btn-view-less"
              onClick={() => setOpenBookingIndex(null)}
            >
              View less
            </button>
          </div>
          ) : (
            // Summary View
            <div className="booking-summary mt-3 mb-3">
            <div className="summary-header">
              <div className="service-info">
                <ChefHat className="user-icon" />
                <h2 className="profile-heading">{booking?.sub_category_name}</h2>
              </div>
              <div className="status-message">
                <span className="status-dot"></span>
                {booking?.booking_status}
              </div>
            </div>
 
            <div className="summary-content">
              <div className="time-provider">
                <p>{booking?.visit_time}</p>
                <p>Service Provider - {booking?.partner_name}</p>
              </div>
 
              <div className="amount">₹{booking?.billing_amount}</div>
            </div>
 
            <div className="summary-actions">
                 {/* <button className="btn-modify" onClick={handleModifyButton}>Modify</button> */}
                 <button
                   className="btn-view-details"
                   onClick={() => {
                     handleViewMore(booking?.booking_id);
                     setOpenBookingIndex(index);
                   }}
                 >
                   View details
                 </button>
               </div>
          </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PreviousTab;

























// import React, { useState } from "react";
// import { Star, Clock, User, Trophy, ChefHat } from "lucide-react";
// import "./PreviousTab.css";
// import { useNavigate } from "react-router-dom";

// function PreviousTab() {
//   const [openBookingIndex, setOpenBookingIndex] = useState(null);

//   const navigate = useNavigate();

//   const handleModifyButton = () => {
//     navigate('/my-profile');
//   }
//   const bookingData = [
//     {
//       serviceType: "Cook for one meal",
//       provider: {
//         name: "Khushi K",
//         role: "Cook",
//         rating: 4.5,
//         experience: "12+ Yrs Exp.",
//         avatar: "K",
//       },
//       booking: {
//         date: "22nd Nov, Tuesday",
//         time: "07:30 PM",
//         address: "123 Connaught Place, Rajiv Chowk, New Delhi, Delhi, 110001",
//         people: 2,
//         menu: "Paneer Butter Masala, Jeera Rice, Roti",
//         specialRequests: "Please avoid spicy food.",
//       },
//       billing: {
//         total: 699,
//         discount: 100,
//         gst: 50,
//         grandTotal: 749,
//         paymentMode: "Paytm UPI",
//       },
//       status: {
//         message: "Provider has reached your location",
//         time: "Today, 10:30 AM",
//         amount: 250,
//       },
//     },
    
//   ];

//   return (
//     <div className="booking-container">
//       {bookingData.map((booking, index) => (
//         <div key={index} className="booking-item">
//           {openBookingIndex === index ? (
//             // Detailed View
//             <div className="booking-details mt-3">
//               <div className="column1">
//                 <div className="details-header">
//                   <h2 className="details-head">{booking.booking.date}</h2>
//                   <div className="service-image image-flex">
//                     <img src="././ServicesSection/chef-cooking-5.jpg" />
//                     <h3 className="heading-text">{booking.serviceType}</h3>
//                   </div>
//                 </div>
//                 <div className="provider-section">
//                   <h3 className="heading-text">Service Provider</h3>
//                   <div className="provider-info">
//                     <div className="provider-avatar">{booking.provider.avatar}</div>
//                     <div className="provider-details">
//                       <h4 className="provider-name">{booking.provider.name}</h4>
//                       <p className="provider-role">{booking.provider.role}</p>
//                     </div>
//                   </div>
//                   <div className="rating">
//                     <div>
//                       <Star className="star-icon" />
//                       <span>
//                         <span style={{ fontWeight: "bold" }}>
//                           {booking.provider.rating} out of 5
//                         </span>{" "}
//                         Rating
//                       </span>
//                     </div>
//                     <div>
//                       <Trophy className="clock-icon" />
//                       <span className="">{booking.provider.experience}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="details-actions">
//                   <button className="btn-cancel">Cancel</button>
//                   <button className="btn-modify-upcoming">Modify</button>
//                 </div>
//               </div>
//               <div className="column2">
//                 <h3 className="heading-text mb-4">Booking Details</h3>
//                 <div className="booking-info">
//                   <div className="info-group">
//                     <h4 className="booking-subtitle">Booking For</h4>
//                     <p className="booking-info-text">
//                       Cook - {booking.serviceType}
//                     </p>
//                   </div>
//                   <div className="info-group">
//                     <h4 className="booking-subtitle">Address</h4>
//                     <p className="booking-info-text">{booking.booking.address}</p>
//                   </div>
//                   <div className="info-group">
//                     <h4 className="booking-subtitle">Number of People</h4>
//                     <p className="booking-info-text">{booking.booking.people}</p>
//                   </div>
//                   <div className="info-group">
//                     <h4 className="booking-subtitle">Menu and Dishes</h4>
//                     <p className="booking-info-text">{booking.booking.menu}</p>
//                   </div>
//                   <div className="info-group">
//                     <h4 className="booking-subtitle">Date & Time</h4>
//                     <p className="booking-info-text">{`${booking.booking.date}, ${booking.booking.time}`}</p>
//                   </div>
//                   <div className="info-group">
//                     <h4 className="booking-subtitle">Special Requests / Instructions</h4>
//                     <p className="booking-info-text">{booking.booking.specialRequests}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="column3">
//                 <h3 className="heading-text mb-4">Billing Details</h3>
//                 <div className="billing-info">
//                   <div className="billing-row">
//                     <span className="billing-subtitle">Total</span>
//                     <span className="billing-subtitle">₹{booking.billing.total}</span>
//                   </div>
//                   <div className="billing-row discount">
//                     <span className="billing-subtitle">Discount</span>
//                     <span className="billing-subtitle">-₹{booking.billing.discount}</span>
//                   </div>
//                   <div className="billing-row">
//                     <span className="billing-subtitle">GST</span>
//                     <span className="billing-subtitle">₹{booking.billing.gst}</span>
//                   </div>
//                   <div className="billing-row total">
//                     <span className="billing-subtitle text-bold">Grand Total</span>
//                     <span className="final-amount">
//                       ₹{booking.billing.grandTotal}
//                     </span>
//                   </div>
//                   <div className="payment-mode">
//                     <span className="billing-subtitle">Payment mode</span>
//                     <span className="billing-subtitle">{booking.billing.paymentMode}</span>
//                   </div>
//                 </div>
//               </div>
//               <button
//                 className="btn-view-less"
//                 onClick={() => setOpenBookingIndex(null)}
//               >
//                 View less
//               </button>
//             </div>
//           ) : (
//             // Summary View
//             <div className="booking-summary mt-3 mb-3">
//               <div className="summary-header">
//                 <div className="service-info">
//                   <ChefHat className="user-icon" />
//                   <h2 className="profile-heading">{booking.serviceType}</h2>
//                 </div>
//                 <div className="status-message">
//                   <span className="status-dot"></span>
//                   {booking.status.message}
//                 </div>
//               </div>

//               <div className="summary-content">
//                 <div className="time-provider">
//                   <p>{booking.status.time}</p>
//                   <p>Service Provider - {booking.provider.name}</p>
//                 </div>

//                 <div className="amount">₹{booking.status.amount}</div>
//               </div>

//               <div className="summary-actions">
//                 <button className="btn-modify" onClick={handleModifyButton}>Modify</button>
//                 <button
//                   className="btn-view-details"
//                   onClick={() => setOpenBookingIndex(index)}
//                 >
//                   View details
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default PreviousTab;
