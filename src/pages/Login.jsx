import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState,  useEffect } from 'react';
import { loginUser,auth } from '../config/firebase/firebasefunctions'; // Make sure this function handles login properly
import { onAuthStateChanged } from 'firebase/auth';

const Login = () => {

  let navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user.uid);
        
        navigate('/Dashboard')

   }
    });
  }, []);

  
  let [user, setUser] = useState(null);
  let emailval = useRef(null);
  let passwordval = useRef(null);

  function getUser(event) {
    event.preventDefault();
    const userData = {
      email: emailval.current.value,
      password: passwordval.current.value,
    };
    setUser(userData);
    console.log(userData);

    loginUser(userData)
      .then(() => {
        // Navigate to a different page after successful login
        navigate('/dashboard'); // Update this route to whatever fits your app
      })
      .catch((error) => {
        // Handle errors (display a message, etc.)
        console.error("Login failed", error);
        alert("Login failed! Please check your credentials.");
      });
  }

  return (
    <>
      <div className='bg-gray-200'>
        <div className='bg-white'>
          <h1 className='px-14 py-5 text-5xl mb-10 font-bold'>LogIn</h1>
        </div>

        <div className='w-full h-screen flex justify-center mt-24'>
          <form onSubmit={getUser}>
            <div className='w-[20rem] m-auto'>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input type="text" className="grow" ref={emailval} required placeholder="Email" />
              </label>

              <label className="input input-bordered flex items-center gap-2 mt-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 1 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  />
                </svg>
                <input type="password" className="grow" ref={passwordval} required placeholder='Password' />
              </label>

              <div className='text-center'>
                <button className='btn mt-4 bg-[#7749F8] border-none text-lg px-6 rounded-2xl' type='submit'>
                  Login
                </button>
                <div className='mt-5 text-cyan-500'>
                  <h1>
                    <Link to='/register'>Not A User!
                    </Link>
                  </h1>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
