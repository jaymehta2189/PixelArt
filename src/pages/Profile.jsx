
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, ShoppingBag, Package, Calendar, Edit, AlertCircle } from 'lucide-react';

function Profile() {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserDetails(parsedUser);
      setFormData({
        name: parsedUser.name,
        email: parsedUser.email,
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const updatedUser = { ...userDetails, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserDetails(updatedUser);
      setEditing(false);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    }
  };

  if (!userDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-lg"
          >
            <div className="flex items-center">
              <AlertCircle className="text-red-400 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <User className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{userDetails.name}</h1>
                <p className="capitalize">{userDetails.role}</p>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="ml-auto bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div> */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: userDetails.name,
                        email: userDetails.email,
                      });
                    }}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Email:</span> {userDetails.email}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Role:</span> {userDetails.role}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Activity Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-purple-800 font-medium">Purchased Items</h4>
                        <ShoppingBag className="text-purple-600 h-5 w-5" />
                      </div>
                      {userDetails.purchased_Item.length > 0 ? (
                        <ul className="space-y-2">
                          {userDetails.purchased_Item.map((item, index) => (
                            <li key={index} className="text-gray-700">{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No items purchased yet</p>
                      )}
                    </div>

                    <div className="bg-purple-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-purple-800 font-medium">Sold Items</h4>
                        <Package className="text-purple-600 h-5 w-5" />
                      </div>
                      {userDetails.sold_Item.length > 0 ? (
                        <ul className="space-y-2">
                          {userDetails.sold_Item.map((item, index) => (
                            <li key={index} className="text-gray-700">{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No items sold yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;