import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { getAllData, auth, db } from './config/firebase/firebasefunctions';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogsArray = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          blogid: doc.id
        }));
        setBlogs(blogsArray);
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);  

  const handleLike = async (blogId, currentLikes) => {
    try {
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog.blogid === blogId 
            ? { ...blog, likesCount: (blog.likesCount || 0) + 1 }
            : blog
        )
      );
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <h1 className="text-4xl font-bold text-center py-8 text-gray-800">
          Featured Blogs
        </h1>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((item) => (
              <article 
                key={item.blogid} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                onClick={() => navigate(`single/${item.blogid}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.blogImage}
                    alt={item.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(item.blogid, item.likesCount);
                      }}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span>{item.likesCount || 0}</span>
                    </button>
                    <span className="text-sm text-gray-500">
                      {/* Add timestamp here if available */}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {blogs.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl text-gray-600">No blogs found</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App