import React, { useEffect, useRef, useState } from 'react';
import { auth, db, getData, sendData } from '../config/firebase/firebasefunctions';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State variables for user info and blogs
  const [userinfo, setUserinfo] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state for user data

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User UID:", user.uid);
        await fetchBlogs(user.uid); // Fetch blogs data
        await fetchUserData(user.uid); // Fetch user data
        setLoading(false); // Stop loading once data is fetched
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [navigate]); // Dependency array

  // Fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      // Create a Firestore query
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("Number of documents:", querySnapshot.size);
        const userDoc = querySnapshot.docs[0].data();
        console.log("User Data:", userDoc);
        setUserinfo(userDoc); // Set the userinfo state
      } else {
        console.log("No user data found for the given UID");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch blogs for the authenticated user
  const fetchBlogs = async (uid) => {
    try {
      const blogsData = await getData("blogs", uid);
      setBlogs(blogsData || []);
      console.log("Blogs Data:", blogsData);
    } catch (error) {
      console.error("Error fetching blogs data:", error);
    }
  };

  // Submit blog data to Firestore
  const sendDatatoFirestore = async (event) => {
    event.preventDefault();
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;

    if (!title || !description) {
      alert('Both title and description are required');
      return;
    }

    if (!userinfo) {
      alert('User information is not loaded yet. Please wait.');
      return;
    }

    try {
      const newBlog = {
        title,
        description,
        uid: auth.currentUser.uid,
        userinfo: userinfo,
      };

      const response = await sendData(newBlog, 'blogs');
      setBlogs([...blogs, newBlog]);

      titleRef.current.value = '';
      descriptionRef.current.value = '';

      console.log("Blog successfully added:", response);
    } catch (error) {
      console.error('Error adding blog:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Dashboard</h1>

      {/* Blog Form */}
      <form onSubmit={sendDatatoFirestore} className="bg-white shadow-md rounded-lg p-8 mb-10">
        <div className="mb-5">
          <input 
            type="text" 
            placeholder="Enter blog title" 
            ref={titleRef} 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-5">
          <textarea 
            cols="25" 
            rows="5" 
            placeholder="Enter blog description" 
            ref={descriptionRef} 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition duration-300"
        >
          Add Blog
        </button>
      </form>

      {/* User Blogs */}
      <h1 className="text-3xl font-semibold text-center mb-8">User Blogs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Show a loading spinner while fetching user data */}
        {userinfo === null ? (
          <span className="loading loading-dots loading-lg"></span>
        ) : (
          <>
            {blogs.length > 0 ? blogs.map((item, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 duration-300">
                <div className="flex items-center p-4">
                  <img
                    src={item.userinfo.userImage}
                    alt={`${item.userinfo.email}'s profile`}
                    className="w-14 h-14 rounded-full border-2 border-gray-300 mr-4 object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    {item.userinfo && (
                      <p className="text-gray-500 text-sm">Posted by: {item.userinfo.userData.email}</p>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 p-4 mb-4">{item.description}</p>
                <div className="flex justify-between items-center p-4 border-t">
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
                    Like
                  </button>
                  <span className="text-gray-500">Likes: {item.likesCount || 0}</span>
                </div>
              </div>
            )) : (
              <h2 className="text-xl font-semibold text-center col-span-full">No blogs found</h2>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
