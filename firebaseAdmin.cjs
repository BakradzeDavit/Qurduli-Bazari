const admin = require('firebase-admin');

// Example: get a single user by UID
async function getUserInfo(uid) {
  try {
    const userRecord = await admin.auth().getUser(uid);
    console.log('User info:', userRecord.toJSON());
    return userRecord.toJSON();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}
