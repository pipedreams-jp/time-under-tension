import React from "react";
import { firebase } from "../firebase";

type Props = {
  initialValue?: firebase.User | null;
};

export function useAuth(options?: Props) {
  const auth = firebase.auth();
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  googleProvider.addScope("https://www.googleapis.com/auth/userinfo.email");

  const [user, setUser] = React.useState<firebase.User | null>(
    options?.initialValue ?? null
  );

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => void unsubscribe();
  }, [auth]);

  return {
    user,
    actions: {
      signIn: () =>
        auth
          .signInWithRedirect(googleProvider)
          .then(auth.getRedirectResult)
          .then((credential) => setUser(credential.user)),
      signOut: () => auth.signOut(),
    },
  };
}
