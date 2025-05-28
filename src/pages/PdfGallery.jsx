import React, { useRef, useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase/firebasefunctions';

const PdfGallery = () => {
  const titleRef = useRef(null);
  const fileInputRef = useRef(null);
  const [pdfs, setPdfs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPDFs = async () => {
      const storage = getStorage();
      const snapshot = await getDocs(collection(db, 'pdfGallery'));

      const filteredPDFs = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const fileRef = ref(storage, data.storagePath);

        try {
          await getDownloadURL(fileRef);
          filteredPDFs.push({ id: docSnap.id, ...data });
        } catch (err) {
          console.warn(`File missing in storage, deleting Firestore doc: ${data.title}`);
          await deleteDoc(doc(db, 'pdfGallery', docSnap.id));
        }
      }

      // Latest uploaded PDFs first
      filteredPDFs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPdfs(filteredPDFs);
    };

    fetchPDFs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = titleRef.current.value.trim();
    const pdfFile = fileInputRef.current.files[0];

    if (!title || !pdfFile) {
      alert("Title aur PDF dono zaroori hain");
      return;
    }

    try {
      const storage = getStorage();

      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const formattedTime = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
      const fileName = `${title}-${formattedDate}_${formattedTime}.pdf`;

      const storageRef = ref(storage, `pdfFiles/${fileName}`);
      await uploadBytes(storageRef, pdfFile);
      const pdfUrl = await getDownloadURL(storageRef);

      const pdfDoc = {
        title,
        pdfUrl,
        storagePath: `pdfFiles/${fileName}`,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "pdfGallery"), pdfDoc);

      // New PDF ko top per add karein
      setPdfs((prev) => [{ ...pdfDoc, id: docRef.id }, ...prev]);

      titleRef.current.value = '';
      fileInputRef.current.value = '';

      alert("PDF successfully uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("PDF upload mein koi masla aaya.");
    }
  };

  const handleDelete = async (id, storagePath) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, storagePath);

      await deleteObject(storageRef);
      await deleteDoc(doc(db, 'pdfGallery', id));

      setPdfs((prev) => prev.filter((pdf) => pdf.id !== id));
      alert('PDF deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete mein masla aaya.');
    }
  };

  // Search ke liye filter karna
  const filteredPdfs = pdfs.filter((pdf) =>
    pdf.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-900">📄 Upload & Manage PDFs</h1>

      {/* Search input */}
      <div className="mb-8 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search PDFs by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mb-10">
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            ref={titleRef}
            placeholder="Enter PDF title"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Select PDF</label>
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            className="w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-300"
        >
          Upload PDF
        </button>
      </form>

      {/* PDF List */}
      {filteredPdfs.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No PDFs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPdfs.map(({ id, title, pdfUrl, createdAt, storagePath }) => (
            <div key={id} className="bg-white rounded-lg shadow-lg p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-indigo-800 mb-3">{title}</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Uploaded on: {new Date(createdAt).toLocaleDateString()} {new Date(createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-medium hover:underline"
                  title="View PDF"
                >
                  📄 View PDF
                </a>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
                      handleDelete(id, storagePath);
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition"
                  title="Delete PDF"
                >
                  Delete ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PdfGallery;
