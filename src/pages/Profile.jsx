import React, { useEffect, useState, useCallback } from 'react';
import { auth, db } from '../config/firebase/firebasefunctions';
import { onAuthStateChanged, updatePassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Profile = () => {
  const navigate = useNavigate();
  const [userinfo, setUserinfo] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUserData = useCallback(async (uid) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        setUserinfo(userDoc);
      } else {
        console.error("No user data found for UID");
        navigate('/login');
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserData(user.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault(); // Prevent form submission
    
    if (newPassword.length < 6) {
      alert('Password should be at least 6 characters long.');
      return;
    }

    setIsUpdating(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      await updatePassword(user, newPassword);
      alert('Password updated successfully.');
      setNewPassword('');
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert('Please log out and log in again to update your password.');
        navigate('/login');
      } else {
        alert('Failed to update password. ' + error.message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (!userinfo) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h2 className="text-xl font-semibold text-center">Loading user data...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
      <div className="flex items-center mb-4">
        <img
          src={userinfo.userImage || '/default-profile.png'}
          alt={`${userinfo.firstname || 'User'}'s profile`}
          className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4 object-cover"
          onError={(e) => {
            e.target.src = '/default-profile.png';
          }}
        />
        <div>
          <h2 className="text-xl font-semibold">{userinfo.firstname || 'User'}</h2>
          <p className="text-gray-600">{userinfo.email || 'No email provided'}</p>
        </div>
      </div>
      
      <form onSubmit={handlePasswordUpdate} className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Update Password</h3>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          disabled={isUpdating}
          minLength={6}
        />
        <button
          type="submit"
          className={`bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200 ${
            isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
