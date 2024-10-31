import React, { useRef, useState } from 'react';
import { auth, db } from '../config/firebase/firebasefunctions'; // Assuming these are correctly set up for Firebase authentication
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const firstnameval = useRef(null);
  const emailval = useRef(null);
  const passwordval = useRef(null);
  const fileInputRef = useRef(null); // Reference for the file input
  const [userImageURL, setUserImageURL] = useState(''); // State for storing uploaded image URL

  function getUser(event) {
    event.preventDefault();
    const userData = {
      firstname: firstnameval.current.value,
      email: emailval.current.value,
      password: passwordval.current.value,
    };
    setUser(userData);

    createUserWithEmailAndPassword(auth, emailval.current.value, passwordval.current.value)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.uid);

        async function addData() {
          try {
            // Upload user image to Firebase Storage
            const storage = getStorage();
            const imageFile = fileInputRef.current.files[0]; // Get the selected file
            const storageRef = ref(storage, `userImages/${user.uid}`); // Create a reference to the image

            // Upload the file
            await uploadBytes(storageRef, imageFile);
            // Get the download URL of the uploaded image
            const imageUrl = await getDownloadURL(storageRef);
            console.log("Image uploaded and accessible at:", imageUrl);
            setUserImageURL(imageUrl); // Save the image URL to state

            // Add user data to Firestore
            const docRef = await addDoc(collection(db, "users"), {
              userData: userData,
              userImage: imageUrl, // Store the image URL in Firestore
              uid: user.uid,
            });
            console.log("Document written with ID: ", docRef.id);
           {imageUrl && navigate("/login") } 
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }

        addData();
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        alert(errorMessage)
      });

  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Account</h1>
        
        {user && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Registration successful!</span>
          </div>
        )}

        <form onSubmit={getUser} className="space-y-4">
          <div className="space-y-6">
            <label className="block">
              <span className="text-gray-700 text-sm font-semibold mb-2">First Name</span>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ref={firstnameval}
                required
                placeholder="Enter your first name"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 text-sm font-semibold mb-2">Email</span>
              <input
                type="email"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ref={emailval}
                required
                placeholder="Enter your email"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 text-sm font-semibold mb-2">Password</span>
              <input
                type="password"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ref={passwordval}
                required
                placeholder="Create a password"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 text-sm font-semibold mb-2">Profile Picture</span>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
