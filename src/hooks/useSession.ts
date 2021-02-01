import React from "react";
import { firebase } from "../firebase";
import { Session } from "../types";

export function useSession(id: string): API {
  const [state, setState] = React.useState<API>({
    status: "idle",
    session: undefined,
  });

  React.useEffect(() => {
    setState({ status: "loading", session: undefined });
    fetchData();

    async function fetchData() {
      const db = firebase.firestore();
      const snapshot = await db.collection("sessions").doc(id).get();

      if (snapshot.exists) {
        const data = snapshot.data()!;

        setState({
          status: "resolved",
          session: {
            id: snapshot.id,
            location: data.location,
            timestamps: {
              started: data.created_at.toDate(),
              completed: data.completed_at?.toDate(),
            },
          },
        });
      } else {
        setState({ status: "404", session: undefined });
      }
    }
  }, [id]);

  return {
    status: state.status,
    session: state.session,
  };
}

type API = {
  status: Status;
  session?: Session;
};

type Status = "idle" | "loading" | "404" | "resolved";
