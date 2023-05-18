import React from "react";
import RecentsContainer from "../components/RecentsContainer";
import QueryHistory from "../components/QueryHistory";
import { Container, Row, Col } from "react-bootstrap";

function Home() {
  return (
    <Container fluid>
      <Row>
        <Col sm={4} md={3} lg={2}>
          <QueryHistory />
        </Col>
        <Col sm={8} md={9} lg={10}>
          <RecentsContainer />
        </Col>
      </Row>
    </Container>
  );
}
export default Home;
