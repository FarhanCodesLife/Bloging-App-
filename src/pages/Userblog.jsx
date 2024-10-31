import { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import { auth, getData } from '../config/firebase/firebasefunctions';
import { onAuthStateChanged } from 'firebase/auth';

const UserBlog = () => {
  const [blogs, setBlogs] = useState(null);
  
  const { uid } = useParams(); // Extract uid from the URL parameter

  let navigate = useNavigate()

useEffect(()=>{
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User UID:", user.uid);
    } else {
      navigate('/login');
    }
  });
  const fetchBlogs = async (uid) => {
    try {
      const blogsData = await getData("blogs", uid);
      setBlogs(blogsData || []);
      console.log("Blogs Data:", blogsData);
    } catch (error) {
      console.error("Error fetching blogs data:", error);
    }
  };
  fetchBlogs(uid)

},[])

  return (
    <div className='container mx-auto p-6 bg-gray-50 min-h-screen'>
      <div className="max-w-5xl mx-auto space-y-8">
        {blogs == null ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-dots loading-lg text-blue-600"></span>
          </div>
        ) : (
          <>
            {blogs.length > 0 && (
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl shadow-md p-8 transform hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-6">
                  <img
                    src={blogs[0].userinfo.userImage}
                    alt={`${blogs[0].userinfo.userData.firstname}'s profile`}
                    className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">{blogs[0].userinfo.userData.firstname}</h2>
                    <p className="text-gray-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {blogs[0].userinfo.userData.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {blogs.length > 0 ? blogs.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:shadow-xl transition-all">
                <div className="flex items-center p-6 border-b">
                  <img
                    src={item.userinfo.userImage}
                    alt={`${item.userinfo.email}'s profile`}
                    className="w-16 h-16 rounded-full border-2 border-gray-200 mr-4 object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{item.userinfo.userData.firstname}</h2>
                    <p className="text-gray-500 text-sm">{item.userinfo.userData.email}</p>
                  </div>
                </div>

                <div className="relative group">
                  <img
                    src={item.blogImage}
                    alt="Blog cover"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                </div>

                <div className="p-6 space-y-4">
                  <h2 className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors">{item.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <button className="flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Like
                    </button>
                    <span className="text-gray-500 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      {item.likesCount || 0} Likes
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-gray-800">No blogs found</h2>
                <p className="text-gray-600 mt-2">This user hasn't posted any blogs yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserBlog;
