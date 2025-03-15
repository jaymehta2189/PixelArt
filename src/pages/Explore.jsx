import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaSearch, FaExclamationCircle } from 'react-icons/fa';

const Explore = () => {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        setLoading(true);
        setError(null);
        // Replace with your actual API endpoint
        const response = await axios.get('/api/paintings/explore');
        setPaintings(response.data);
      } catch (error) {
        setError('Failed to load paintings. Please try again later.');
        // Using placeholder data when API fails
        setPaintings([
          {
            id: 1,
            title: "Mountain Landscape",
            artist: "Sarah Johnson",
            price: 2500,
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          },
          {
            id: 2,
            title: "Abstract Dreams",
            artist: "Michael Chen",
            price: 3200,
            image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaintings();
  }, []);

  const filteredPaintings = paintings.filter(painting => {
    const matchesSearch = painting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         painting.artist.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (priceFilter === 'all') return matchesSearch;
    if (priceFilter === 'under1000') return matchesSearch && painting.price < 1000;
    if (priceFilter === 'under5000') return matchesSearch && painting.price < 5000;
    return matchesSearch && painting.price >= 5000;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="relative flex-1 mb-4 md:mb-0">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search paintings or artists..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="under1000">Under $1,000</option>
              <option value="under5000">Under $5,000</option>
              <option value="over5000">$5,000 & Above</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
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

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        ) : (
          /* Paintings Grid */
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPaintings.map((painting, index) => (
                <motion.div
                  key={painting.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative pb-[66.67%]">
                    <img
                      src={painting.image}
                      alt={painting.title}
                      className="absolute h-full w-full object-cover"
                    />
                  </div>
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
          </AnimatePresence>
        )}

        {/* No Results Message */}
        {!loading && filteredPaintings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 text-lg">No paintings found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Explore;