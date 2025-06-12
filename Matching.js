
import { fetchUserDataByEmail } from "./backend/controllers/auth.controller.js";

const matching = (user_id, UserName) => {
    
    
}

// New function to get user data and call matching
export const startMatching = async (email) => {
    try {
        // Get user data using email
        const userData = await fetchUserDataByEmail(email);
        
        if (!userData) {
            throw new Error('User not found');
        }
        
        // Extract user_id and username
        const user_id = userData.id;
        const UserName = userData.username;
        
        // Call your matching function with the required parameters
        const result = matching(user_id, UserName);
        
        return result;
        
    } catch (error) {
        console.error('Error in startMatching:', error);
        throw error;
    }
}

startMatching("gamingcyber805@gmail.com");