import api from '@/api';
import { useAuth } from '@/modules/common/contexts/AuthContext';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Define the types for user data
interface UserData {
  _id: string;
  name: string;
}

// Define the custom hook
const useUserFetch = () => {
  // State variables
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      try {
        // Simulating API call
        const response = await api.users.findAll(user?.name || '');
        setUserData(response.data.users);
      } catch (error) {
        toast.error('Error fetching users');
      } finally {
        setLoadingUser(false);
      }
    };

    // Call the fetch function when component mounts
    fetchUserData();

    return () => {};
  }, []); // Empty dependency array to run only once when component mounts

  return { userData, loadingUser };
};
export default useUserFetch;
