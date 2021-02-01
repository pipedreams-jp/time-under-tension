import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSessions } from "../../hooks/useSessions";
import { formatDate } from "../../lib/timestamps";
import { Card } from "../../styled/Card";
import { Container } from "../../styled/Container";

export function Index() {
  const { sessions, status } = useSessions();
  const { user, actions } = useAuth();

  if (status === "idle") {
    return null;
  }

  if (status === "loading" || !sessions) {
    return <p>loading…</p>;
  }

  async function signOut() {
    if (user) {
      await actions.signOut();
    }
  }

  return (
    <Container>
      <button onClick={signOut}>Sign Out lol</button>
      <h1>Latest Sessions</h1>
      {sessions.find(
        (session) => session.timestamps.completed === undefined
      ) ? (
        <p>You must complete your latest session to start a new one.</p>
      ) : (
        <div style={{ margin: "50px" }}>
          <Link to="/session/new">New Session</Link>
        </div>
      )}
      {sessions.map((document) => (
        <Card key={document.id} style={{ marginBottom: "1em" }}>
          <Link to={`/session/${document.id}`}>{document.location}</Link>
          <br />
          {document.timestamps.completed ? (
            <>
              {formatDate(document.timestamps.started)}&mdash;
              {formatDate(document.timestamps.completed)}
            </>
          ) : (
            "In progress"
          )}
        </Card>
      ))}
    </Container>
  );
}
