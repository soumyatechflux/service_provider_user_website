import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";
import UpcomingTab from "./UpcomingTab/UpcomingTab";
import PreviousTab from "./PreviousTab/PreviousTab";
import './BookingTabs.css'

const BookingTabs = () => {
  return (
    <div className="container nav-container">
      <Tabs
        defaultActiveKey="upcoming"
        transition={false}
        id="custom-tabs"
        className="custom-tabs"
      >
        <Tab eventKey="upcoming" title="Upcoming Bookings">
          <UpcomingTab/>
        </Tab>
        <Tab eventKey="previous" title="Previous Bookings">
          <PreviousTab/>
        </Tab>
      </Tabs>
    </div>
  );
};

export default BookingTabs;
