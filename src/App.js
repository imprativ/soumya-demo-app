import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import "./App.css";

import TopNavBar from "./components/TopNavBar";
import Home from "./components/Home";

function App() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <TopNavBar />
        </Col>
      </Row>
      <Row>
        <Col>
          <Home />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
