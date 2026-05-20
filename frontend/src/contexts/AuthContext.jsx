import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase.js";
import { authUser, getCurrentUser, logoutUser } from "../api/auth.js";
import { clearAuthStorage, setAuthTokens } from "../api/tokenStore.js";
import { setAuthExpiredHandler } from "../api/client.js";
import {
  loginWithEmail,
  loginWithGoogle,
  signupWithEmail,
} from "../services/firebaseAuth.js";
import { AuthContext } from "./authContext.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const pendingAuthRef = useRef(false);

  const setSession = useCallback((nextUser, nextToken) => {
    setUser(nextUser || null);

    if (nextToken) {
      setAuthTokens({ accessToken: nextToken });
      setAccessToken(nextToken);
    } else {
      setAccessToken(null);
    }
  }, []);

  const clearSession = useCallback(async () => {
    clearAuthStorage();
    setAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
    if (auth.currentUser) {
      try {
        await signOut(auth);
      } catch {
        // ignore firebase signout errors
      }
    }
  }, []);

  const syncBackendSession = useCallback(
    async (currentFirebaseUser) => {
      if (!currentFirebaseUser || pendingAuthRef.current) return;

      pendingAuthRef.current = true;
      setStatus("loading");
      setError(null);

      try {
        const firebaseToken = await currentFirebaseUser.getIdToken();
        const response = await authUser(firebaseToken);
        const authData = response.data?.data;
        const nextUser = authData?.user || null;
        const nextAccessToken = authData?.accessToken || null;

        setSession(nextUser, nextAccessToken);
        setStatus(nextUser ? "authenticated" : "unauthenticated");
      } catch (syncError) {
        const statusCode = syncError?.response?.status;
        const isUnauthorized = statusCode === 401 || statusCode === 403;

        setError(syncError);

        if (isUnauthorized) {
          clearAuthStorage();
          setAccessToken(null);
          setUser(null);
          setStatus("unauthenticated");
          try {
            await signOut(auth);
          } catch {
            // ignore firebase signout errors
          }
        } else {
          setStatus((prevStatus) =>
            prevStatus === "authenticated"
              ? "authenticated"
              : "unauthenticated",
          );
        }
      } finally {
        pendingAuthRef.current = false;
      }
    },
    [setSession],
  );

  useEffect(() => {
    let unsubscribe = () => {};

    const bootstrap = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch {
        // ignore persistence setup errors
      }

      unsubscribe = onAuthStateChanged(auth, async (nextFirebaseUser) => {
        setFirebaseUser(nextFirebaseUser || null);

        if (!nextFirebaseUser) {
          clearAuthStorage();
          setAccessToken(null);
          setUser(null);
          setStatus("unauthenticated");
          return;
        }

        await syncBackendSession(nextFirebaseUser);
      });
    };

    void bootstrap();

    return () => {
      unsubscribe();
    };
  }, [syncBackendSession]);

  useEffect(() => {
    const handleAuthExpired = () => {
      void clearSession();
    };

    setAuthExpiredHandler(handleAuthExpired);

    return () => {
      setAuthExpiredHandler(() => {});
    };
  }, [clearSession]);

  const handleLoginWithEmail = useCallback(async (email, password) => {
    setStatus("authenticating");
    setError(null);
    try {
      await loginWithEmail(email, password);
    } catch (loginError) {
      setStatus("unauthenticated");
      setError(loginError);
      throw loginError;
    }
  }, []);

  const handleSignupWithEmail = useCallback(async (email, password) => {
    setStatus("authenticating");
    setError(null);
    try {
      await signupWithEmail(email, password);
    } catch (signupError) {
      setStatus("unauthenticated");
      setError(signupError);
      throw signupError;
    }
  }, []);

  const handleLoginWithGoogle = useCallback(async () => {
    setStatus("authenticating");
    setError(null);
    try {
      await loginWithGoogle();
    } catch (googleError) {
      setStatus("unauthenticated");
      setError(googleError);
      throw googleError;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const response = await getCurrentUser();
    const nextUser = response.data?.data?.user;

    if (nextUser) {
      setUser(nextUser);
    }

    return nextUser;
  }, []);

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser || null);
  }, []);

  const logout = useCallback(async () => {
    setStatus("loading");
    try {
      await logoutUser();
      await signOut(auth);
    } catch {
      // ignore network failures during logout
    } finally {
      await clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      firebaseUser,
      accessToken,
      status,
      error,
      isLoading: status === "loading" || status === "authenticating",
      isAuthenticated: status === "authenticated" && Boolean(user),
      loginWithEmail: handleLoginWithEmail,
      signupWithEmail: handleSignupWithEmail,
      loginWithGoogle: handleLoginWithGoogle,
      refreshUser,
      updateUser,
      clearSession,
      logout,
    }),
    [
      accessToken,
      clearSession,
      error,
      firebaseUser,
      handleLoginWithEmail,
      handleLoginWithGoogle,
      handleSignupWithEmail,
      logout,
      refreshUser,
      status,
      updateUser,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
