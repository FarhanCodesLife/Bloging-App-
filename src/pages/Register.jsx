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
    <>
      <div className='bg-gray-200 h-screen overflow-hidden'>
        <div className='bg-white'>
          <h1 className='px-14 py-5 text-5xl mb-10 font-bold'>Register</h1>
        </div>

        
        {user && <div role="alert" className="alert alert-success">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 shrink-0 stroke-current"
    fill="none"
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>Your Rigisteration has been confirmed!</span>
</div> } 

        <div className='w-full h- flex justify-center mt-20'>
          <div className='w-[20rem] m-auto'>
            <form onSubmit={getUser}>
              <label className="input input-bordered flex items-center gap-2 mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" className="grow" ref={firstnameval } required placeholder="Firstname" />
              </label>

              <label className="input input-bordered flex items-center gap-2 mt-2">
                <svg
                
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input type="email" className="grow" ref={emailval} required placeholder="Email" />
              </label>

              <label className="input input-bordered flex items-center gap-2 mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path fillRule="evenodd" d="M14 6a4 4 0 1 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" />
                </svg>
                <input type="password" className="grow" ref={passwordval} required placeholder="Password" />
              </label>

              <label className="input input-bordered flex items-center gap-2 mt-2">
                <span className="text-gray-600">Upload Image:</span>
                <input type="file" ref={fileInputRef} accept="image/*" required /> {/* File input for image */}
              </label>

              <div className='text-center'>
                <button className='btn mt-4 bg-[#7749F8] border-none text-lg px-6 rounded-2xl' type='submit'>
                  {}
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
