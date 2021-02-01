import React from "react";
import { Redirect, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { bodyweightState } from "../../../../atoms/bodyweight";
import { ticktypeState } from "../../../../atoms/ticktype";
import {
  Grade,
  GradeModifier,
  Performance,
  RPE,
  Tick,
  TickType,
} from "../../../../types";
import * as grades from "../../../../lib/grades";
import { BoulderRangeInput } from "./BoulderRangeInput";
import { RouteRangeInput } from "./RouteRangeInput";
import { environmentState } from "../../../../atoms/environment";
import { RPERangeInput } from "./RPERangeInput";
import { TagsInput } from "./TagsInput";
import { firebase } from "../../../../firebase";
import { useAuth } from "../../../../hooks/useAuth";

export function SessionTickNew() {
  const { id: sessionID } = useParams<MatchParams>();
  const sessionURL = `/session/${sessionID}`;
  const bodyweight = useRecoilValue(bodyweightState);
  const [tickType, setTickType] = useRecoilState(ticktypeState);
  const environment = useRecoilValue(environmentState);
  const { user } = useAuth();

  const [
    redirectToCurrentSession,
    setRedirectToCurrentSession,
  ] = React.useState(false);

  const [grade, setGrade] = React.useState<Grade>(0);
  const [gradeModifier, setGradeModifier] = React.useState<GradeModifier>();
  const [rpe, setRPE] = React.useState<RPE>(1);
  const [performance, setPerformance] = React.useState<Performance>("redpoint");
  const [attempts, setAttempts] = React.useState(1);
  const [routeFeatures, setRouteFeatures] = React.useState<string[]>([]);
  const [routeStyles, setRouteStyles] = React.useState<string[]>([]);
  const [routeHolds, setRouteHolds] = React.useState<string[]>([]);

  async function handleOnSubmit(event: React.FormEvent) {
    event.preventDefault();

    const db = firebase.firestore();
    await db.collection("ticks").add({
      user_email: user?.email,
      session_id: sessionID,
      type: tickType,
      environment,
      grade,
      grade_modifier: gradeModifier ?? "",
      performance,
      attempts,

      bodyweight,
      RPE: rpe,

      style: routeStyles,
      features: routeFeatures,
      holds: routeHolds,

      created_at: new Date(),
    } as Omit<Tick, "id">);

    setRedirectToCurrentSession(true);
  }

  function handleChangeTickType(type: TickType) {
    return () => {
      setTickType(type);

      const switchingGradeTypes =
        // if the current tickType is boulder, and we're going to sport or trad
        (tickType === "boulder" && (type === "sport" || type === "trad")) ||
        // if the current tickType is sport or trad, and we're going to boulder
        ((tickType === "sport" || tickType === "trad") && type === "boulder");

      if (switchingGradeTypes) {
        setGrade(0);
      }
    };
  }

  if (redirectToCurrentSession) {
    return (
      <Redirect
        to={{
          pathname: sessionURL,
          state: {
            refetchTicks: true,
          },
        }}
      />
    );
  }

  return (
    <>
      <Link to={sessionURL}>Back</Link>
      <form onSubmit={handleOnSubmit}>
        <div>
          <button
            type="button"
            onClick={handleChangeTickType("boulder")}
            style={ButtonStyles(tickType === "boulder")}
            disabled={tickType === "boulder"}
          >
            Boulder
          </button>
          <button
            type="button"
            onClick={handleChangeTickType("sport")}
            style={ButtonStyles(tickType === "sport")}
            disabled={tickType === "sport"}
          >
            Sport
          </button>
          {environment === "outdoors" && (
            <button
              type="button"
              onClick={handleChangeTickType("trad")}
              style={ButtonStyles(tickType === "trad")}
              disabled={tickType === "trad"}
            >
              Trad
            </button>
          )}
        </div>

        <div>
          <h4>Grade: {grades.toLabel(tickType, grade)}</h4>
          <div>
            {tickType === "boulder" ? (
              <BoulderRangeInput value={grade} onChange={setGrade} />
            ) : (
              <RouteRangeInput value={grade} onChange={setGrade} />
            )}
          </div>
          <div style={{ marginTop: "16px" }}>
            <button
              type="button"
              onClick={() => {
                setGradeModifier("soft");
              }}
              style={ButtonStyles(gradeModifier === "soft")}
              disabled={gradeModifier === "soft"}
            >
              Soft
            </button>
            <button
              type="button"
              onClick={() => {
                setGradeModifier(undefined);
              }}
              style={ButtonStyles(gradeModifier === undefined)}
              disabled={gradeModifier === undefined}
            >
              n / a
            </button>
            <button
              type="button"
              onClick={() => {
                setGradeModifier("hard");
              }}
              style={ButtonStyles(gradeModifier === "hard")}
              disabled={gradeModifier === "hard"}
            >
              Hard
            </button>
          </div>
        </div>

        <div>
          <h4>Performance:</h4>
          <button
            type="button"
            onClick={() => {
              setPerformance("flash");
              setAttempts(1);
            }}
            style={ButtonStyles(performance === "flash")}
            disabled={performance === "flash"}
          >
            Flash
          </button>
          {tickType !== "boulder" && (
            <button
              type="button"
              onClick={() => setPerformance("onsight")}
              style={ButtonStyles(performance === "onsight")}
              disabled={performance === "onsight"}
            >
              Onsight
            </button>
          )}
          <button
            type="button"
            onClick={() => setPerformance("redpoint")}
            style={ButtonStyles(performance === "redpoint")}
            disabled={performance === "redpoint"}
          >
            Redpoint
          </button>
          {performance === "redpoint" && (
            <>
              <button
                type="button"
                onClick={() => setAttempts((attempts) => attempts - 1)}
                disabled={attempts === 1}
              >
                -
              </button>
              {attempts}
              <button
                type="button"
                onClick={() => setAttempts((attempts) => attempts + 1)}
              >
                +
              </button>
            </>
          )}
        </div>

        <div>
          <h4>RPE: {rpe}</h4>
          <RPERangeInput value={rpe} onChange={setRPE} />
        </div>

        <div>
          <h4>Route Features (overhung, steep arete, roof, etc.):</h4>
          <TagsInput
            items={routeFeatures}
            onAddItem={(newItem) =>
              setRouteFeatures((current) => [...current, newItem])
            }
          />
        </div>

        <div>
          <h4>Route Style (continous, technical, powerful, etc.):</h4>
          <TagsInput
            items={routeStyles}
            onAddItem={(newItem) =>
              setRouteStyles((current) => [...current, newItem])
            }
          />
        </div>

        <div>
          <h4>Route Hold Types (crimps, slopers, gastons, etc.):</h4>
          <TagsInput
            items={routeHolds}
            onAddItem={(newItem) =>
              setRouteHolds((current) => [...current, newItem])
            }
          />
        </div>

        <button type="submit">Add Tick</button>
      </form>
    </>
  );
}

const ButtonStyles = (active: boolean): React.CSSProperties => ({
  border: active ? "5px solid blue" : undefined,
});

/*
  type: TickType;

  style: string[];
  holds: string[];

  created_at: Date;
  */

type MatchParams = { id: string };
