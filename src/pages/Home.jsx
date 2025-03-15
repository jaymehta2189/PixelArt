import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Home = ({ user }) => {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get('/api/paintings');
        setPaintings(response.data);
      } catch (error) {
        console.error('Error fetching paintings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaintings();
  }, []);

  // Placeholder paintings data for demonstration
  const placeholderPaintings = [
    {
      id: 1,
      title: "Starry Night",
      artist: "Vincent van Gogh",
      price: 1000000,
      image: "https://example.com/starry-night.jpg"
    },
    {
      id: 2,
      title: "The Persistence of Memory",
      artist: "Salvador Dalí",
      price: 800000,
      image: "https://example.com/persistence-of-memory.jpg"
    }
  ];

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
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Exploring
            </button>
          </motion.div>
        </div>
      </div>

      {/* Featured Paintings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Artworks</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          </div>
        ) : placeholderPaintings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {placeholderPaintings.map((painting) => (
              <motion.div
                key={painting.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={painting.image}
                  alt={painting.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {painting.title}
                  </h3>
                  <p className="text-gray-600 mb-4">By {painting.artist}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600 font-semibold">
                      ${painting.price.toLocaleString()}
                    </span>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No paintings available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;