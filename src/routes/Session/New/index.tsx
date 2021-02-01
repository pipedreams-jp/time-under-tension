import React from "react";
import { firebase } from "../../../firebase";
import { useRecoilState } from "recoil";
import { bodyweightState } from "../../../atoms/bodyweight";
import { Redirect } from "react-router";
import { environmentState } from "../../../atoms/environment";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export function SessionNew() {
  const { user } = useAuth();
  const [location, setLocation] = React.useState("");
  const [recoilBodyweight, setRecoilBodyweight] = useRecoilState(
    bodyweightState
  );
  const [bodyweight, setBodyweight] = React.useState(
    recoilBodyweight?.toString() ?? ""
  );
  const [environment, setEnvironment] = useRecoilState(environmentState);

  const [
    redirectToCurrentSession,
    setRedirectToCurrentSession,
  ] = React.useState<string>();

  async function createSession(event: React.FormEvent) {
    event.preventDefault();

    setRecoilBodyweight(parseFloat(bodyweight));

    const db = firebase.firestore();
    const ref = await db.collection("sessions").add({
      location,
      user_email: user?.email,
      created_at: new Date(),
    });

    setRedirectToCurrentSession(ref.id);
  }

  if (redirectToCurrentSession) {
    return <Redirect to={`/session/${redirectToCurrentSession}`} />;
  }

  return (
    <React.Fragment>
      <Link to="/">Home</Link>
      <h1>New Session</h1>
      <form onSubmit={createSession}>
        <div>
          <button
            type="button"
            onClick={() => setEnvironment("outdoors")}
            style={ButtonStyles(environment === "outdoors")}
            disabled={environment === "outdoors"}
          >
            Outdoors
          </button>
          <button
            type="button"
            onClick={() => setEnvironment("gym")}
            style={ButtonStyles(environment === "gym")}
            disabled={environment === "gym"}
          >
            Gym
          </button>
        </div>
        <label>
          Location:{" "}
          <input
            type="text"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Latest bodyweight:{" "}
          <input
            type="tel"
            name="bodyweight"
            value={bodyweight}
            onChange={(e) => setBodyweight(e.target.value)}
            required
          />
        </label>
        <button type="submit">Start Session</button>
      </form>
    </React.Fragment>
  );
}

const ButtonStyles = (active: boolean): React.CSSProperties => ({
  border: active ? "5px solid blue" : undefined,
});
