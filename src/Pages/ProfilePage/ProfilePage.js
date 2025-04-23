import React from 'react'
import ProfileDetails from './ProfileDetails/ProfileDetails'
import BookingTabs from './BookingTabs/BookingTabs'
import ModifyBooking from './ModifyBooking/ModifyBooking'

const ProfilePage = () => {
  return (
    <div>
        <ProfileDetails/>
        <BookingTabs/>
        {/* <ModifyBooking/> */}
    </div>
  )
}

export default ProfilePage