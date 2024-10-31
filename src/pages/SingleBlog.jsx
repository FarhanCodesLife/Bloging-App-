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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Blog Image */}
      {blog && (
        <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full sm:w-[90%] md:w-[80%] lg:w-[1000px] mx-auto rounded-none sm:rounded-lg overflow-hidden my-2 sm:my-4 md:my-8">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img
            src={blog.blogImage}
            alt="Blog cover"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-20 bg-gradient-to-t from-black/80 to-transparent">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 font-serif leading-tight">
                {blog?.title}
              </h1>
              {/* Author Info in Hero */}
              <div className="flex items-center gap-2 sm:gap-4">
                <img
                  src={blog?.userinfo.userImage}
                  alt={`${blog?.userinfo.email}'s profile`}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white object-cover"
                />
                <div>
                  <h2 className="text-white font-medium text-sm sm:text-base">{blog?.userinfo.userData.firstname}</h2>
                  <p className="text-gray-200 text-xs sm:text-sm">{blog?.userinfo.userData.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {error ? (
            <div className="bg-red-50 p-4 sm:p-6 rounded-xl border border-red-200">
              <h2 className="text-lg sm:text-xl font-semibold text-red-600 text-center">{error}</h2>
            </div>
          ) : blog ? (
            <article className="bg-white rounded-lg sm:rounded-2xl overflow-hidden">
              {/* Blog Content */}
              <div className="p-4 sm:p-8 md:p-12">
                {/* Reading Time & Date */}
                <div className="flex items-center gap-2 sm:gap-4 text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6 md:mb-8">
                  <span className="flex items-center gap-1 sm:gap-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    5 min read
                  </span>
                  <span>•</span>
                  <span>Published {new Date().toLocaleDateString()}</span>
                </div>

                {/* Blog Description */}
                <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {blog.description}
                  </p>
                </div>
                
                {/* Engagement Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 sm:mt-10 md:mt-12 pt-4 sm:pt-6 md:pt-8 border-t border-gray-100 gap-4 sm:gap-0">
                  <div className="flex items-center gap-4 sm:gap-8">
                    <button
                      onClick={() => setLike(1 + like)}
                      className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm sm:text-base font-medium">{blog.likesCount || like} likes</span>
                    </button>
                    <button className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="text-sm sm:text-base font-medium">Share</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => userblog(blog.uid)}
                    className="text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium transition-colors duration-200"
                  >
                    More from this author →
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Singleblog;
