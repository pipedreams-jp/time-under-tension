import React from "react";
import { firebase } from "../firebase";
import { Tick } from "../types";
import { useAuth } from "./useAuth";

type Props = {
  sessionId: string;
  refresh?: boolean;
};

export function useTicks(props: Props): API {
  const { user } = useAuth();
  const [state, setState] = React.useState<Pick<API, "status" | "ticks">>({
    status: "idle",
    ticks: undefined,
  });

  React.useEffect(() => {
    setState({ status: "loading", ticks: undefined });

    if (user) {
      fetchData();
    }

    async function fetchData() {
      const db = firebase.firestore();
      let query = db
        .collection("ticks")
        .where("user_email", "==", user?.email)
        .where("session_id", "==", props.sessionId);
      const result = await query.get();

      setState({
        status: "resolved",
        ticks: result.docs.map((snapshot) => {
          const data = snapshot.data();

          return {
            id: snapshot.id,
            user_email: data.user_email,
            session_id: data.session_id,
            style: data.style,
            name: data.name,
            environment: data.environment,
            RPE: data.RPE,
            bodyweight: data.bodyweight,
            performance: data.performance,
            attempts: data.attempts,
            type: data.type,
            grade: data.grade,
            grade_modifier: data.grade_modifier,
            holds: data.holds,
            features: data.features,
            created_at: data.created_at.toDate() as Date,
          };
        }),
      });
    }
  }, [user, props.sessionId, props.refresh]);

  return {
    status: state.status,
    ticks: state.ticks,
  };
}

type API = {
  status: Status;
  ticks?: Tick[];
};

type Status = "idle" | "loading" | "resolved";
