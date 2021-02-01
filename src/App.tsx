import React from "react";
import { firebase } from "./firebase";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { Index } from "./routes/Index";
import { SessionIndex } from "./routes/Session/Index";
import { SessionNew } from "./routes/Session/New";
import { Container } from "./styled/Container";
import styled from "styled-components";
import logo from "./logo.png";
import { Card } from "./styled/Card";
import GoogleButton from "react-google-button";

type Props = {
  initialUserValue: firebase.User | null;
};

function App(props: Props) {
  const { user, actions } = useAuth({ initialValue: props.initialUserValue });

  if (!user) {
    return (
      <>
        <Container>
          <Logo src={logo} alt="TIME UNDER TENSION" />
          <Card>
            <CardTitle>Sign in</CardTitle>
            <p>
              Accounts are required to use Time Under Tension. All of your
              sessions and ticks are scoped to your email.
            </p>
            <GoogleButton onClick={actions.signIn} />
          </Card>
        </Container>
      </>
    );
  }

  return (
    <>
      <Router>
        <Switch>
          <Route path="/session/new">
            <SessionNew />
          </Route>
          <Route path="/session/:id">
            <SessionIndex />
          </Route>
          <Route path="/" exact>
            <Index />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

const Logo = styled.img`
  display: block;
  max-width: 300px;
  margin: 1em auto;
`;

const CardTitle = styled.h1`
  margin: 0;
  margin-bottom: 1em;
  font-weight: 900;
  font-size: 1.5em;
`;

export default App;
