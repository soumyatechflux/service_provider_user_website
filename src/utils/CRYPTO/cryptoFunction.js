import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = "this-is-my-secret-key-for-token-of-service-provider-user-website";


// Encrypt data using the encryption key
export const encryptData = (text) => {
  const ciphertext = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY);
  return ciphertext.toString();
};



// Decrypt data using the encryption key
export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};
