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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Blog Post</h1>
      <div className="space-y-8">
        {error ? (
          <div className="bg-red-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-red-600 text-center">{error}</h2>
          </div>
        ) : blog ? (
          <article className="bg-white shadow-xl rounded-2xl overflow-hidden">
            {/* Author Info Section */}
            <div 
              className="flex items-center p-6 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition duration-200" 
              onClick={() => userblog(blog.uid)}
            >
              <img
                src={blog.userinfo.userImage}
                alt={`${blog.userinfo.email}'s profile`}
                className="w-16 h-16 rounded-full border-2 border-gray-300 mr-4 object-cover shadow-md"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{blog.userinfo.userData.firstname}</h2>
                <p className="text-gray-600">{blog.userinfo.userData.email}</p>
              </div>
            </div>

            {/* Blog Image */}
            <div className="relative overflow-hidden">
              <img
                src={blog.blogImage}
                alt="Blog cover"
                className="w-full h-[400px] object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Blog Content */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{blog.title}</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">{blog.description}</p>
              
              {/* Engagement Section */}
              <div className="flex justify-between items-center pt-6 border-t">
                <button
                  onClick={() => setLike(1 + like)}
                  className="flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-200 shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  Like
                </button>
                <span className="text-gray-600 font-medium">
                  {blog.likesCount || like} likes
                </span>
              </div>
            </div>
          </article>
        ) : (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Singleblog;
