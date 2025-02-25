import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function Archive() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchQuery = new URLSearchParams(location.search).get("query");
    


    const [results, setResults] = useState<{ id: string; companyName: string; email: string; websiteUrl: string; phoneNumber: string; whatIs: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {

          try {
            const querySnapshot = await getDocs(collection(db, "entries"));
            const data = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as { id: string; companyName: string; email: string; websiteUrl: string; phoneNumber: string; whatIs: string }[];
    
            if (searchQuery) {
              const filteredData = data.filter((entry) =>
                entry.companyName.toLowerCase().includes(searchQuery.toLowerCase())
              );
              setResults(filteredData);
            } else {
              setResults(data);
            }
            window.scrollTo({top: 0, behavior: "smooth"});
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, [searchQuery]);

      const handleDelete = async (id: string) => {
        try {
          await deleteDoc(doc(db, "entries", id));
          setResults(results.filter((entry) => entry.id !== id));
        } catch (error) {
          console.error("Error deleting entry:", error);
        }
      };

      return (
<div className="min-h-screen p-4 sm:p-8 bg-gray-50">
  <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-4xl mx-auto mb-6">
    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
      Results for: {searchQuery}
    </h1>
    <div className="flex space-x-2 sm:space-x-4">
      <button
        onClick={() => navigate("/frontpage")}
        className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-md shadow-md hover:bg-blue-400 transition text-sm sm:text-base"
      >
        Back to Search
      </button>
      <button
        onClick={() => navigate("/addpage")}
        className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-md shadow-md hover:bg-green-500 transition text-sm sm:text-base"
      >
        Add New
      </button>
    </div>
  </div>

  <div className="max-w-5xl mx-auto">
    <div className="bg-white shadow-lg rounded-lg p-6">
      {results.length === 0 ? (
        <p className="text-gray-600 text-lg text-center">No results found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-auto">
            <thead className="bg-blue-100 text-gray-800 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-left w-10">#</th>
                <th className="py-3 px-4 text-left">Company Name</th>
                <th className="py-3 px-4 text-left hidden sm:table-cell">Email</th>
                <th className="py-3 px-4 text-left">Website</th>
                <th className="py-3 px-4 text-left hidden sm:table-cell">Phone</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 text-sm sm:text-base">
                  <td className="py-3 px-4 w-10">{index + 1}</td>
                  <td className="py-3 px-4 font-semibold">{item.companyName}</td>
                  <td className="py-3 px-4 hidden sm:table-cell">{item.email}</td>
                  <td className="py-3 px-4 text-blue-600 underline break-words">{item.websiteUrl}</td>
                  <td className="py-3 px-4 hidden sm:table-cell w-auto whitespace-nowrap">{item.phoneNumber}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs whitespace-nowrap w-auto font-medium px-2.5 py-1 rounded-full bg-gray-200 text-gray-900">
                      {item.whatIs}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md shadow-md hover:bg-red-500 transition text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
</div>
      )}