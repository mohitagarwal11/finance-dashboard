import admin from "firebase-admin";
const loadServiceAccount = () => {
  const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!jsonEnv) {
    throw new Error(
      "Firebase service account is missing. Set FIREBASE_SERVICE_ACCOUNT_JSON."
    );
  }

  return JSON.parse(jsonEnv);
};

if (!admin.apps.length) {
  const serviceAccount = loadServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
