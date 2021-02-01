import React from "react";
import { firebase } from "../firebase";
import { Session } from "../types";
import { useAuth } from "./useAuth";

export function useSessions(): API {
  const { user } = useAuth();
  const [state, setState] = React.useState<API>({
    status: "idle",
    sessions: undefined,
  });

  React.useEffect(() => {
    setState({ status: "loading", sessions: undefined });
    if (user) {
      fetchData();
    }

    async function fetchData() {
      const db = firebase.firestore();
      const query = await db
        .collection("sessions")
        .orderBy("created_at", "desc")
        .where("user_email", "==", user!.email)
        .get();

      setState({
        status: "resolved",
        sessions: query.docs.map((snapshot) => {
          const data = snapshot.data();
          return {
            id: snapshot.id,
            location: data.location,
            timestamps: {
              started: data.created_at.toDate(),
              completed: data.completed_at?.toDate(),
            },
          };
        }),
      });
    }
  }, [user]);

  return {
    status: state.status,
    sessions: state.sessions,
  };
}

type API = {
  status: Status;
  sessions?: Session[];
};

type Status = "idle" | "loading" | "404" | "resolved";
