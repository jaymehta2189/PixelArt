// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import axios from 'axios';

// const Home = ({ user }) => {
//   const [paintings, setPaintings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPaintings = async () => {
//       try {
//         // Replace with your actual API endpoint
//         const response = await axios.get('/api/paintings');
//         setPaintings(response.data);
//       } catch (error) {
//         console.error('Error fetching paintings:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPaintings();
//   }, []);

//   // Placeholder paintings data for demonstration
//   const placeholderPaintings = [
//     {
//       id: 1,
//       title: "Starry Night",
//       artist: "Vincent van Gogh",
//       price: 1000000,
//       image: "https://example.com/starry-night.jpg"
//     },
//     {
//       id: 2,
//       title: "The Persistence of Memory",
//       artist: "Salvador Dalí",
//       price: 800000,
//       image: "https://example.com/persistence-of-memory.jpg"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="text-center"
//           >
//             <h1 className="text-4xl md:text-6xl font-bold mb-6">
//               Discover Unique Art Pieces
//             </h1>
//             <p className="text-xl md:text-2xl mb-8">
//               Connect with talented artists and find your next masterpiece
//             </p>
//             <button className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
//               Start Exploring
//             </button>
//           </motion.div>
//         </div>
//       </div>

//       {/* Featured Paintings */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Artworks</h2>
        
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto"></div>
//           </div>
//         ) : placeholderPaintings.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {placeholderPaintings.map((painting) => (
//               <motion.div
//                 key={painting.id}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.3 }}
//                 className="bg-white rounded-lg shadow-lg overflow-hidden"
//               >
//                 <img
//                   src={painting.image}
//                   alt={painting.title}
//                   className="w-full h-64 object-cover"
//                 />
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                     {painting.title}
//                   </h3>
//                   <p className="text-gray-600 mb-4">By {painting.artist}</p>
//                   <div className="flex justify-between items-center">
//                     <span className="text-purple-600 font-semibold">
//                       ${painting.price.toLocaleString()}
//                     </span>
//                     <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <p className="text-gray-600 text-lg">No paintings available at the moment.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPalette, FaShoppingCart, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseStatus, setPurchaseStatus] = useState({ id: null, loading: false, success: false });

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:8090/api/v1/painting/');
        // Get only available paintings and limit to 6 for featured section
        const availablePaintings = response.data
          .filter(painting => !painting.isBuy)
          .slice(0, 6);
        setPaintings(availablePaintings);
      } catch (error) {
        setError('Failed to load paintings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaintings();
  }, []);

  const handlePurchase = async (paintingId) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setPurchaseStatus({ id: paintingId, loading: true, success: false });
    try {
      await axios.post(`/api/v1/painting/${paintingId}/buy`, {
        buyerId: user.id
      });
      setPurchaseStatus({ id: paintingId, loading: false, success: true });
      // Remove the purchased painting from the list after a short delay
      setTimeout(() => {
        setPaintings(paintings.filter(p => p.id !== paintingId));
        setPurchaseStatus({ id: null, loading: false, success: false });
      }, 2000);
    } catch (error) {
      setError('Failed to purchase the painting. Please try again.');
      setPurchaseStatus({ id: null, loading: false, success: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Unique Art Pieces
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Connect with talented artists and find your next masterpiece
            </p>
            <button 
              onClick={() => navigate('/explore')}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Exploring
            </button>
          </motion.div>
        </div>
      </div>

      {/* Featured Paintings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Featured Artworks</h2>
          <button
            onClick={() => navigate('/explore')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            View All →
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-lg"
          >
            <div className="flex items-center">
              <FaExclamationCircle className="text-red-400 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        ) : paintings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paintings.map((painting) => (
              <motion.div
                key={painting.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative pb-[66.67%]">
                  <img
                    src={painting.url}
                    alt={painting.name}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {painting.name}
                  </h3>
                  <div className="flex items-center mb-4 text-gray-600">
                    <FaPalette className="mr-2" />
                    <p>By {painting.artistName}</p>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {painting.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600 font-semibold text-lg">
                      ${parseFloat(painting.prices).toLocaleString()}
                    </span>
                    {purchaseStatus.id === painting.id ? (
                      purchaseStatus.success ? (
                        <div className="flex items-center text-green-600">
                          <FaCheckCircle className="mr-2" />
                          <span>Purchased!</span>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg opacity-75"
                        >
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          <span>Processing...</span>
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handlePurchase(painting.id)}
                        className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <FaShoppingCart />
                        <span>Buy Now</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaExclamationCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No paintings available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;