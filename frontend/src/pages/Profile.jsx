import React from 'react'
import { CgProfile } from "react-icons/cg";

const Profile = ({userData, switching, setSwitching, handleLogout}) => {
  return (
    <div className="dashboard-2">
    <h3>Dashboard</h3>
    <button
      onClick={() => setSwitching(!switching)}
      className="profileBtn mt-2"
      title="Account"
    >
      <CgProfile size={30} />
    </button>
    {switching && (
      <div className="bg-slate-600 rounded m-2 p-2">
        <p className="text-white">
          <strong>Username:</strong> {userData.username}
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-500 rounded p-2 cursor-pointer m-2 text-white"
        >
          Logout
        </button>
      </div>
    )}
  </div>
  )
}

export default Profile