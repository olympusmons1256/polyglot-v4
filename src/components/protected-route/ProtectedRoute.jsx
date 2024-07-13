import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../utils/api';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        // Handle error
      }
    };

    fetchUserProfile();
  }, []);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <div>
        <p>Username: {userProfile.username}</p>
        <p>Email: {userProfile.email}</p>
        {/* Add more profile details as needed */}
      </div>
    </div>
  );
};

export default UserProfile;