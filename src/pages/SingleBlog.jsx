import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { getAllData, auth, db } from '../config/firebase/firebasefunctions';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from 'react-router-dom';

const Singleblog = () => {
  const [blog, setBlog] = useState(null); // Initialize as null for single blog
  const [error, setError] = useState(null);

  const { blogid } = useParams(); // Extract blogid from the URL parameter

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", blogid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setBlog(docSnap.data());
        } else {
          console.log("No such document!");
          setError("Blog not found");
        }
      } catch (error) {
        console.log("Error fetching document:", error);
        setError("An error occurred while fetching the blog.");
      }
    };

    fetchBlog();
  }, [blogid]); // Add blogid as a dependency to refetch if it changes

  let [like, setLike] = useState(0);
  let navigate = useNavigate();

  function userblog(uid) {
    navigate(`userblog/${uid}`);
  }

  return (
    <>
      <h1 className="text-3xl font-semibold text-center m-8">Single Blog</h1>
      <div className="grid px-20 gap-8">
        {error ? (
          <h2 className="text-xl font-semibold text-center col-span-full">{error}</h2>
        ) : blog ? (
          <div
            key={blog.uid}
            className="bg-white shadow-lg rounded-lg overflow-hidden "
          >
            <div className="flex items-center p-8 cursor-pointer hover:bg-gray-200" onClick={() => userblog(blog.uid)}>
              <img
                src={blog.userinfo.userImage}
                alt={`${blog.userinfo.email}'s profile`}
                className="w-14 h-14 rounded-full border-2 border-gray-300 mr-4 object-cover"
              />
              <div>
                <h2 className="text-xl">{blog.userinfo.userData.firstname}</h2>
                <p className="text-gray-500 text-sm">Posted by: {blog.userinfo.userData.email}</p>
              </div>
            </div>

            <div className='w-full items-center'>
                <img
                    src={blog.blogImage}
                    alt={`${blog.userinfo.email}'s profile`}
                    className="w-[80%] h-[80%]  border-2 border-gray-300 m-auto my-10 object-cover   transition-transform transform hover:scale-105 duration-600"
                  />
                </div>
            <h2 className="text-3xl px-6">{blog.title}</h2>
            <p className="text-gray-600 p-4 mb-4">{blog.description}</p>
            <div className="flex justify-between items-center p-4 border-t">
              <button
                onClick={() => setLike(1 + like)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Like
              </button>
              <span className="text-gray-500">Likes: {blog.likesCount || like}</span>
            </div>
          </div>
        ) : (
          <h2 className="text-xl font-semibold text-center col-span-full">Loading...</h2>
        )}
      </div>
    </>
  );
};

export default Singleblog;
