import React from "react";
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router";
import { useSession } from "../../../hooks/useSession";
import { firebase } from "../../../firebase";
import { useTicks } from "../../../hooks/useTicks";
import { formatDate, formatTime } from "../../../lib/timestamps";
import { Link } from "react-router-dom";
import { SessionTickNew } from "../Tick/New";
import { compareDesc } from "date-fns";
import { Container } from "../../../styled/Container";
import { Card } from "../../../styled/Card";
import { toLabel } from "../../../lib/grades";
import styled from "styled-components";
import { Grade, TickType } from "../../../types";
import {
  SliderHandle,
  SliderInput,
  SliderRange,
  SliderTrack,
} from "@reach/slider";

export function SessionIndex() {
  const {
    params: { id },
    path,
    url,
  } = useRouteMatch<MatchParams>();
  const { state } = useLocation<{ refetchTicks?: boolean }>();

  const { session, status: sessionStatus } = useSession(id);
  const { ticks /*, status: ticksStatus */ } = useTicks({
    sessionId: id,
    refresh: state?.refetchTicks,
  });
  const [redirectToHome, setRedirectToHome] = React.useState(false);

  if (sessionStatus === "idle") {
    return null;
  }

  if (sessionStatus === "loading") {
    return <p>loading…</p>;
  }

  if (sessionStatus === "404" || !session) {
    return <p>404</p>;
  }

  async function handleCompleteSession() {
    const db = firebase.firestore();
    await db.collection("sessions").doc(id).set(
      {
        completed_at: new Date(),
      },
      { merge: true }
    );

    setRedirectToHome(true);
  }

  async function handleDeleteSession() {
    const db = firebase.firestore();
    await db.collection("sessions").doc(id).delete();

    setRedirectToHome(true);
  }

  if (redirectToHome) {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route path={`${path}/tick/new`}>
        <SessionTickNew />
      </Route>
      <Route path={path} exact>
        <Container>
          <Link to="/">Home</Link>
          <h1>
            {session.location} {formatDate(session.timestamps.started)}
          </h1>

          {session.timestamps.completed ? (
            <React.Fragment>
              <p>Started: {formatTime(session.timestamps.started)}</p>
              <p>Completed: {formatTime(session.timestamps.completed)}</p>
            </React.Fragment>
          ) : (
            <p>Started: {formatTime(session.timestamps.started)}</p>
          )}

          {session.timestamps.completed === undefined && (
            <button onClick={handleCompleteSession}>Complete Session</button>
          )}

          <div>
            <Link to={`${url}/tick/new`}>Add Tick</Link>
          </div>

          {ticks?.length &&
            ticks
              .sort((a, b) => compareDesc(a.created_at, b.created_at))
              .map((tick) => (
                <Card key={tick.id} style={{ marginBottom: "1em" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div>
                      <GradeBubble type={tick.type} grade={tick.grade} />
                    </div>
                    <div style={{ width: "100%", marginLeft: "1em" }}>
                      <FireSlider
                        min={0}
                        max={10}
                        value={tick.RPE}
                        disabled={true}
                      >
                        <SliderTrack>
                          <FireRange />
                          <FireHandle />
                        </SliderTrack>
                      </FireSlider>
                    </div>
                  </div>
                </Card>
              ))}

          <button type="button" onClick={handleDeleteSession}>
            Delete Session
          </button>
        </Container>
      </Route>
    </Switch>
  );
}

type MatchParams = { id: string };

function GradeBubble(props: { type: TickType; grade: Grade }) {
  const labelledGrade = toLabel(props.type, props.grade);

  if (props.type === "sport") {
    const splitGrade = labelledGrade.split(".")[1];
    const matches = splitGrade.match(/(?<number>\d+)(?<letter>\w+)/);
    const label = matches?.groups ? (
      <>
        {matches.groups.number}
        <span style={{ fontSize: ".8em" }}>{matches.groups.letter}</span>{" "}
      </>
    ) : (
      splitGrade
    );

    return <GradeViz type={props.type}>{label}</GradeViz>;
  }

  return <GradeViz type={props.type}>{labelledGrade}</GradeViz>;
}

const GradeViz = styled.div`
  display: inline-flex;
  width: 2.5em;
  height: 2.5em;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${(props: { type: TickType }) =>
    props.type === "boulder" ? "#795548" : "#3f51b5"};
  color: white;
  font-family: "Roboto Mono", monospace;
`;

const FireSlider = styled(SliderInput)`
  &[data-disabled] {
    opacity: 1;
  }
`;

const FireRange = styled(SliderRange)`
  background: linear-gradient(90deg, #ff9800, #ffeb3b);
`;

const FireHandle = styled(SliderHandle)`
  background: none;
  &:after {
    content: "🔥";
  }
`;
