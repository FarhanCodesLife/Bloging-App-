import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { getAllData, auth, db } from './config/firebase/firebasefunctions';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState([]); 


//   useEffect(() => {
//     const fetchBlogs = async () => {
    
      
//       const blogsData = await getAllData("blogs");
//       console.log("Fetched Blogs Data:", blogsData);
//       setBlogs(blogsData);
//             // alert('welcome to my bloging app ')
            
//             const querySnapshot = await getDocs(collection(db, "blogs"));
//             querySnapshot.forEach((doc) => {
//               // doc.data() is never undefined for query doc snapshots
//   console.log(doc.id, " => ", doc.data());
//   error.push({doc:doc.data(),blogid:doc.id})
  
// });
// setError(...error)


// };

// fetchBlogs();
// }, []);



useEffect(() => {
  const fetchBlogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "blogs"));
      const blogsArray = [];  // Temporary array to store blogs
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        blogsArray.push({ ...doc.data(), blogid: doc.id });  // Store blog data
      });
      setBlogs(blogsArray);  // Set blogs state with the new array
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  fetchBlogs();
}, []);  

let [like,setlike]= useState(0)
let navigat = useNavigate()


// console.log(error);


function userblog(blogid) {
  navigat(`single/${blogid}`)
  
}



  return (
    <>
     <h1 className="text-3xl font-semibold text-center m-8 ">User Blogs</h1>
<div className="grid sm:grid-cols-3 px-20    gap-8">
  
  {blogs.length > 0 ? blogs.map((item, index) => (
    
    <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer  "  onClick={()=>userblog(item.blogid)}>

<div className='w-full items-center'>
                <img
                    src={item.blogImage}
                    alt={`${item.userinfo.email}'s profile`}
                    className="w-[100%] h-[100%]  border-2 border-gray-300 m-auto my-10 object-cover p-5  transition-transform transform hover:scale-105 duration-600"
                  />
                </div>
      {/* <div className="flex items-center p-8 hover:link-hover cursor-pointer " onClick={()=>userblog(item.uid)}>
        <img
          src={item.userinfo.userImage}
          alt={`${item.userinfo.email}'s profile`}
          className="w-14 h-14 rounded-full border-2  border-gray-300 mr-4 object-cover"
        />
        <div className='   '>
          <h2 className="text-xl     ">{item.userinfo.userData.firstname}</h2>
          
            <p className="text-gray-500 text-sm  ">Posted by: {item.userinfo.userData.email}</p>
          
        </div>
      </div> */}


      <h2 className="sm:text-2xl px-6">{item.title}</h2>




      <p className="text-gray-600 p-4 mb-4">{item.description}</p>
      <div key={item} className="flex justify-between items-center p-4 border-t">
        <button onClick={()=>setlike(1 + like)} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
          Like
        </button>
          <span className="text-gray-500">Likes: {item.likesCount || like}</span>
      </div>
    </div>
  )) : (
    <h2 className="text-xl font-semibold text-center col-span-full">No blogs found</h2>
  )}
</div>

    </>
  )
}

export default App