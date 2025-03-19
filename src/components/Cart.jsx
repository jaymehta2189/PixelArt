import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaShoppingCart, FaTimes, FaTrash, FaExclamationCircle } from 'react-icons/fa';

const Cart = ({ isOpen, onClose, userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isOpen || !userId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:8090/api/v1/users/${userId}/cart`);
        console.log(response.data.length);
        setCartItems(response.data);
      } catch (error) {
        setError('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [isOpen, userId]);

  const removeFromCart = async (paintingId) => {
    try {
      await axios.delete(`http://localhost:8090/api/v1/users/${userId}/remove/cart/${paintingId}`);
      setCartItems(cartItems.filter(item => item.id !== paintingId));
    } catch (error) {
      setError('Failed to remove item from cart');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.prices), 0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
                <div className="flex items-center">
                  <FaShoppingCart className="text-2xl mr-2" />
                  <h2 className="text-xl font-semibold">Your Cart</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-purple-700 rounded-full transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded">
                    <div className="flex items-center">
                      <FaExclamationCircle className="text-red-400 mr-2" />
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent" />
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <FaShoppingCart className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-600">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-lg shadow p-4 flex items-center"
                      >
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-gray-600">By {item.artistName}</p>
                          <p className="text-purple-600 font-semibold">
                            ${parseFloat(item.prices).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-purple-600">
                      ${calculateTotal().toLocaleString()}
                    </span>
                  </div>
                  <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;