import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { AuthContext } from '../../../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({});
  const [bankDetails, setBankDetails] = useState([]);
  const [formData, setFormData] = useState({ bankName: '', accountNumber: '', IFSCCode: '', branchName: '', accountHolderName: '', });
  const [addressData, setAddressData] = useState([]);
  const [addressFormData, setAddressFormData] = useState({ addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: '', phone: '', addressType: '', set_default: false });
  const [sellerId, setSellerId] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [storeFormData, setStoreFormData] = useState({
    storeName: '',
    storeDescription: '',
  });
  const apiBaseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const sellerResponse = await axios.get(`${apiBaseURL}/sellerdetail/user/${user.userId}`);
        const sellerId = sellerResponse.data.sellerId;
        setSellerId(sellerId);
        fetchStoreData(sellerId);
        console.log(sellerId)
      } catch (error) {
        console.error('Error fetching seller details:', error);
      }
    };

    const fetchStoreData = async (sellerId) => {
      try {
        const storeResponse = await axios.get(`${apiBaseURL}/stores/${sellerId}`);
        setStoreData(storeResponse.data);
        console.log(storeResponse.data);
      } catch (error) {
        console.error('Error fetching store data', error);
      }
    };
    fetchSellerDetails();
  }, [user.userId]);

  const handleAddStore = async () => {
    try {
      console.log('Data being sent in the store request:', {
        sellerId: sellerId,
        ...storeFormData,
      });

      await axios.post(`${apiBaseURL}/stores`, {
        sellerId: sellerId,
        ...storeFormData,
      });

      const response = await axios.get(`${apiBaseURL}/stores/${sellerId}`);
      setStoreData(response.data);

      setStoreFormData({
        storeName: '',
        storeDescription: ''
      });
    } catch (error) {
      console.error('Error adding store', error);
    }
  };

  const handleUpdateStore = async (storeId) => {
    try {
      await axios.put(`${apiBaseURL}/stores/${sellerId}/${storeId}`, storeFormData);
      const response = await axios.get(`${apiBaseURL}/stores/${sellerId}`);
      setStoreData(response.data);

      setStoreFormData({
        storeName: '',
        storeDescription: ''
      });
    } catch (error) {
      console.error('Error updating store', error);
    }
  };

  const handleDeleteStore = async (storeId) => {
    try {
      await axios.delete(`${apiBaseURL}/stores/${sellerId}/${storeId}`);
      const response = await axios.get(`${apiBaseURL}/stores/${sellerId}`);
      setStoreData(response.data);
    } catch (error) {
      console.error('Error deleting store', error);
    }
  };

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const sellerResponse = await axios.get(`${apiBaseURL}/sellerdetail/user/${user.userId}`);
        const sellerId = sellerResponse.data.sellerId;
        setSellerId(sellerId);
        fetchBankDetails(sellerId);
        console.log(sellerId)
      } catch (error) {
        console.error('Error fetching seller details:', error);
      }
    };

    const fetchBankDetails = async (sellerId) => {
      try {
        const bankDetailsResponse = await axios.get(`${apiBaseURL}/seller/bank-details/${sellerId}`);
        setBankDetails(bankDetailsResponse.data);
        console.log(bankDetailsResponse.data)
      } catch (error) {
        console.error('Error fetching bank details', error);
      }
    };
    fetchSellerDetails();
  }, [user.userId]);

  const handleAddBankDetails = async () => {
    try {
      console.log('Data being sent in the request:', {
        sellerId: sellerId,
        ...formData,
      });
      await axios.post(`${apiBaseURL}/seller/bank-details`, {
        sellerId: sellerId,
        ...formData,
      });
      const response = await axios.get(`${apiBaseURL}/seller/bank-details/${sellerId}`);
      console.log('Response data:', response.data);
      setBankDetails(response.data.bankDetails);
      setFormData({
        bankName: '',
        accountNumber: '',
        IFSCCode: '',
        branchName: '',
        accountHolderName: '',
      });

    } catch (error) {
      console.error('Error adding bank details', error);
    }
  };

  const handleUpdateBankDetails = async (bankDetailId) => {
    try {
      await axios.put(`${apiBaseURL}/seller/bank-details/${bankDetailId}`, formData);

      // Refresh bank details after updating
      const response = await axios.get(`${apiBaseURL}/seller/bank-details/${sellerId}`);
      setBankDetails(response.data.bankDetails);

      // Clear the form data
      setFormData({
        bankName: '',
        accountNumber: '',
        IFSCCode: '',
        branchName: '',
        accountHolderName: '',
      });
    } catch (error) {
      console.error('Error updating bank details', error);
    }
  };

  const handleDeleteBankDetails = async (bankDetailId) => {
    try {
      await axios.delete(`${apiBaseURL}/seller/bank-details/${bankDetailId}`);

      // Refresh bank details after deleting
      const response = await axios.get(`${apiBaseURL}/seller/bank-details/${sellerId}`);
      setBankDetails(response.data.bankDetails);
    } catch (error) {
      console.error('Error deleting bank details', error);
    }
  };

  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const addressResponse = await axios.get(`${apiBaseURL}/users/${user.userId}/addresses`);
        setAddressData(addressResponse.data);
        console.log(addressResponse.data)
      } catch (error) {
        console.error('Error fetching address data', error);
      }
    };

    fetchAddressData();
  }, [user.userId]);

  const handleAddAddress = async () => {
    try {
      console.log('Data being sent in the address request:', {
        userId: user.userId,
        ...addressFormData,
      });

      await axios.post(`${apiBaseURL}/users/address`, {
        userId: user.userId,
        ...addressFormData
      });

      const response = await axios.get(`${apiBaseURL}/users/${user.userId}/addresses`);
      setAddressData(response.data);
      setAddressFormData({
        addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: '', phone: '', addressType: '', set_default: false,
      });
    } catch (error) {
      console.error('Error adding address', error);
    }
  };

  const handleUpdateAddress = async (addressId) => {
    try {
      await axios.put(`${apiBaseURL}/users/addresses/${addressId}`, addressFormData);

      const response = await axios.get(`${apiBaseURL}/users/${user.userId}/addresses`);
      setAddressData(response.data);

      setAddressFormData({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: '',
        addressType: '',
        set_default: false,
      });
    } catch (error) {
      console.error('Error updating address', error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(`${apiBaseURL}/users/addresses/${addressId}`);

      const response = await axios.get(`${apiBaseURL}/users/${user.userId}/addresses`);
      setAddressData(response.data);
    } catch (error) {
      console.error('Error deleting address', error);
    }
  };

  useEffect(() => {
    if (user && user.userId) {
      fetchUserData(user.userId);
    }
  }, [user]);

  const fetchUserData = async (userId) => {
    try {
      const config = {
        headers: {},
      };
      const response = await axios.get(`${apiBaseURL}/users/${user.userId}`, config);
      const userData = response.data;

      // Set the received user data in the state
      setProfileData(userData);

      // Log the received user data for debugging
      console.log('Received User Data:', userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (user && user.userId) {
      fetchUserData(user.userId);
    }
  }, [user]);


  return (
    <div>
      <Navbar />
      <div className="profile-container mx-auto max-w-8xl p-8">
        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>

        {/* Seller Details Section */}
        <div className="bg-white rounded-lg shadow-md mb-8">
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Seller Details</h2>
    <div className="grid grid-cols-2 gap-y-4">
      <div>
        <p className="text-gray-700 text-lg font-bold mb-2">Email:</p>
        <p className="text-gray-900 text-lg font-semibold">{profileData.email}</p>
      </div>
      <div>
        <p className="text-gray-700 text-lg font-bold mb-2">Name:</p>
        <p className="text-gray-900 text-lg font-bold">{`${user.firstName} ${user.lastName}`}</p>
      </div>
      {profileData.phone && ( // Check if phone number is available
        <div>
          <p className="text-gray-700 text-lg  mb-2">Phone:</p>
          <p className="text-gray-900 text-lg">{profileData.phone}</p>
        </div>
      )}
      {profileData.address && ( // Check if address is available
        <div>
          <p className="text-gray-700 text-lg mb-2">Address:</p>
          <p className="text-gray-900 text-lg">{profileData.address}</p>
        </div>
      )}
    </div>
  </div>
</div>

      
        {/* Seller Store Section */}
        <div className="flex flex-col md:flex-row bg-white rounded-lg p-6 shadow-lg mb-8">
          {/* Left Sidebar: List of Stores */}
          {Array.isArray(storeData) && storeData.length > 0 ? (
            <ul className="md:w-1/2">
              {storeData.map((store) => (
                <li key={store.storeId} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">{store.storeName}</h2>
                      <p className="text-gray-600 mb-4">{store.storeDescription}</p>
                    </div>
                    {/* ... other details */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleUpdateStore(store.storeId)}
                        className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 focus:outline-none"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStore(store.storeId)}
                        className="ml-2 bg-red-500 mr-8 text-white px-2 py-1 rounded-md hover:bg-red-600 focus:outline-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="md:w-1/2">No Store available.</p>
          )}

          {/* Right Section: Form for adding/updating store */}
          <div className="flex-grow bg-white rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Add New Store</h2>

            {/* Form for adding/updating store */}
            <form>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                    Store Name:
                  </label>
                  <input
                    type="text"
                    id="storeName"
                    value={storeFormData.storeName}
                    onChange={(e) => setStoreFormData({ ...storeFormData, storeName: e.target.value })}
                    className="p-2 border rounded-md w-full"
                    placeholder="Enter Store Name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700">
                    Store Description:
                  </label>
                  <textarea
                    id="storeDescription"
                    value={storeFormData.storeDescription}
                    onChange={(e) => setStoreFormData({ ...storeFormData, storeDescription: e.target.value })}
                    className="p-2 border rounded-md w-full"
                    placeholder="Enter Store Description"
                    required
                  />
                </div>
              </div>

              <div className="mt-2">
                {Object.values(storeFormData).some((value) => value === '') && (
                  <p className="text-red-500">Please fill in all required fields.</p>
                )}
                <button
                  type="button"
                  onClick={handleAddStore}
                  className={`bg-blue-500 text-white h-10 w-full rounded-md hover:bg-blue-600 focus:outline-none ${Object.values(storeFormData).some((value) => value === '') ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                  disabled={Object.values(storeFormData).some((value) => value === '')}
                >
                  Add Store
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Seller Address Section */}
        <div className="flex flex-col md:flex-row bg-white rounded-lg p-6 shadow-lg mb-8">
          {/* List of existing addresses */}
          {Array.isArray(storeData) ? (
            <ul className="md:w-1/2">
              {addressData.map((address) => (
                <li key={address.addressId} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      {/* Display address details */}
                      <p className="text-gray-800">
                        {address.addressLine1}, {address.addressLine2}<br />
                        {address.city}, {address.state}, {address.country}<br />
                        {address.postalCode}<br />
                        Phone: {address.phone}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => handleUpdateAddress(address.addressId)}
                        className="text-white px-2 py-1 mr-8 bg-blue-500 rounded-md hover:underline mb-2"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(address.addressId)}
                        className="text-white px-2 py-1 mr-8 bg-red-600 rounded-md hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="md:w-1/2">No Address available.</p>
          )}


          {/* Form for adding a new address */}
          <form className="md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Add New Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                  Address Line 1:
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  value={addressFormData.addressLine1}
                  onChange={(e) => setAddressFormData({ ...addressFormData, addressLine1: e.target.value })}
                  className="p-2 border rounded-md w-full"
                  placeholder="Enter Address Line 1"
                  required
                />
              </div>

              <div>
                <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
                  Address Line 2:
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  value={addressFormData.addressLine2}
                  onChange={(e) => setAddressFormData({ ...addressFormData, addressLine2: e.target.value })}
                  className="p-2 border rounded-md w-full"
                  placeholder="Enter Address Line 2"
                  required
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City:
                </label>
                <input
                  type="text"
                  id="city"
                  value={addressFormData.city}
                  onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                  className="p-2 border rounded-md w-full"
                  placeholder="Enter City"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State:
                </label>
                <input
                  type="text"
                  id="state"
                  value={addressFormData.state}
                  onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                  className="p-2 border rounded-md w-full"
                  placeholder="Enter State"
                  required
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code:
                </label>
                <input
                  type="text"
                  id="postalCode"
                  value={addressFormData.postalCode}
                  onChange={(e) => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                  className="p-2 border rounded-md w-full"
                  placeholder="Enter Postal Code"
                  required
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country:
                </label>
                <input
                  type="text"
                  id="country"
                  value={addressFormData.country}
                  onChange={(e) => setAddressFormData({ ...addressFormData, country: e.target.value })}
                  className="p-2 border rounded-md w-full"
                  placeholder="Enter Country"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone:
                </label>
                <input
                  type="text"
                  id="phone"
                  value={addressFormData.phone}
                  onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                  className="p-2 border rounded-md w-full"
                  placeholder="Enter Phone"
                  required
                />
              </div>

              <div>
                <label htmlFor="addressType" className="block text-sm font-medium text-gray-700">
                  Address Type:
                </label>
                <select
                  id="addressType"
                  value={addressFormData.addressType}
                  onChange={(e) => setAddressFormData({ ...addressFormData, addressType: e.target.value })}
                  className="p-2 border rounded-md w-full"
                  required
                >
                  <option value="">Select Address Type</option>
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                  <option value="billing">Billing</option>
                  <option value="shipping">Shipping</option>
                </select>
              </div>

            </div>
            <div className='mt-4 bg-gray-100 flex items-center justify-center'>
              <label htmlFor="set_default" className="block text-l font-medium text-gray-700">
                Set Default:
              </label>
              <input
                type="checkbox"
                id="set_default"
                checked={addressFormData.set_default}
                onChange={(e) => setAddressFormData({ ...addressFormData, set_default: e.target.checked })}
                className="ml-2 p-2 border rounded-md h-4 w-10"
              />
            </div>

            <div className="mt-2">
              {Object.values(addressFormData).some(value => value === '') && (
                <p className="text-red-500">Please fill in all required fields.</p>
              )}
              <button
                type="button"
                onClick={handleAddAddress}
                className={`bg-blue-500 text-white h-10 w-full rounded-md hover:bg-blue-600 focus:outline-none ${Object.values(addressFormData).some(value => value === '') ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                disabled={Object.values(addressFormData).some(value => value === '')}
              >
                Add Address
              </button>
            </div>
          </form>
        </div>

        {/* Seller Bank details Section */}
        <div className="flex bg-white rounded-lg p-6 shadow-lg">
          {/* List of existing bank details */}
          {Array.isArray(storeData) ? (
            <ul className="md:w-1/2 pr-4">
              {bankDetails.map((bankDetail) => (
                <li key={bankDetail.bankDetailId} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      {/* Display bank details */}
                      <p className="text-gray-800">
                        {bankDetail.bankName}<br />
                        Account: {bankDetail.accountNumber}<br />
                        IFSC: {bankDetail.IFSCCode}<br />
                        Branch: {bankDetail.branchName}<br />
                        Account Holder: {bankDetail.accountHolderName}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => handleUpdateBankDetails(bankDetail.bankDetailId)}
                        className="text-white px-2 py-1 mr-4 bg-blue-500 rounded-md hover:underline mb-2"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBankDetails(bankDetail.bankDetailId)}
                        className="text-white px-2 py-1 mr-4 bg-red-600 rounded-md hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="md:w-1/2">No Bank Details available.</p>
          )}

          {/* Form for adding/updating bank details */}
          <form className="mb-4 w-1/2 p-2">
            <h2 className="text-xl font-bold mb-4">Add New Bank Account</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                  Bank Name:
                </label>
                <input
                  type="text"
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="p-2 border rounded-md w-full"
                  placeholder="Enter Bank Name"
                  required  // Add this line to make the field required
                />
              </div>

              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                  Account Number:
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="p-2 border rounded-md w-full"
                  placeholder="Enter Account Number"
                  required
                />
              </div>

              <div>
                <label htmlFor="IFSCCode" className="block text-sm font-medium text-gray-700">
                  IFSC Code:
                </label>
                <input
                  type="text"
                  id="IFSCCode"
                  value={formData.IFSCCode}
                  onChange={(e) => setFormData({ ...formData, IFSCCode: e.target.value })}
                  className="p-2 border rounded-md w-full"
                  placeholder="Enter IFSC Code"
                  required
                />
              </div>

              <div>
                <label htmlFor="branchName" className="block text-sm font-medium text-gray-700">
                  Branch Name:
                </label>
                <input
                  type="text"
                  id="branchName"
                  value={formData.branchName}
                  onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                  className="p-2 border rounded-md w-full"
                  placeholder="Enter Branch Name"
                  required
                />
              </div>

              <div>
                <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
                  Account Holder Name:
                </label>
                <input
                  type="text"
                  id="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                  className="p-2 border rounded-md w-full"
                  placeholder="Enter Account Holder Name"
                  required
                />
              </div>
            </div>

            <div className="mt-2">
              {Object.values(formData).some(value => value === '') && (
                <p className="text-red-500">Please fill in all required fields.</p>
              )}
              <button
                type="button"
                onClick={handleAddBankDetails}
                className={`bg-blue-500 text-white h-10 w-full rounded-md hover:bg-blue-600 focus:outline-none ${Object.values(formData).some(value => value === '') ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                disabled={Object.values(formData).some(value => value === '')}
              >
                Add Bank Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;


// <div className="mb-4 p-4 shadow-lg">
//           <img
//             src="placeholder_image_url"
//             className="rounded-full w-24 h-24 object-cover"
//           />
//         </div>