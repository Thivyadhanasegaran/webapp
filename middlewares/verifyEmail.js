// // Middleware function for email verification
// async function verifyEmail(req, res, next) {
//     const { token } = req.query;
  
//     // Check if token is valid and not expired
//     // Validate the token and check if it's within the expiration time
//   if (tokenIsValid(token)) {
//     // Update the database to mark the user as verified
//     try {
//       const connection = await getConnectionFromPool(pool);
//       await updateUserVerificationStatus(connection, token);
//       releaseConnectionToPool(connection);
//       res.send('Email verified successfully!');
//     } catch (error) {
//       console.error('Error updating user verification status:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   } else {
//     res.status(400).send('Invalid or expired token');
//   }
// };
  
//   // Function to validate the verification token and check if it's expired
//   function tokenIsValid(token) {
//     // Implement your token validation and expiration logic here
//     // For demonstration purposes, let's assume all tokens are valid for 2 minutes
//     const tokenExpiryTime = getTokenExpiryTime(token);
//     const currentTime = moment();
//     return tokenExpiryTime.isAfter(currentTime);
//   }
  
//   // Function to get the expiry time of the token
//   function getTokenExpiryTime(token) {
//     // Implement your logic to retrieve token expiry time from the token or database
//     // For demonstration purposes, let's assume the token contains expiry time
//     // You may need to adjust this logic based on how you generate and store tokens
//     const expiryTime = moment(token.split('-')[1], 'X'); // Assuming token format is timestamp-token
//     return expiryTime;
//   }
  
//   // Simulated database update function
//   async function updateUserVerificationStatus(token) {
//     // Implement your logic to update user verification status in the database
//     // For demonstration purposes, let's assume we have a function that updates the database
//     // with the verified status based on the token
//     console.log(`Updating verification status for token: ${token}`);
//     // Your database update logic goes here
//   }
  