import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import "../LogIn.css";
import { PersonFill } from "react-bootstrap-icons";

function LogIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        // Redirect to the landing page
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("Email:", email);
    console.log("Password:", password);
  };

  const handleFormSwitch = () => {
    if (typeof props.onFormSwitch === "function") {
      props.onFormSwitch("signup");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Container>
      <Row className="justify-content-md-center align-items-center">
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit}>
            <div className="imgcontainer">
              <PersonFill className="avatar" size={60} />
            </div>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                <b>Email Adress</b>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>
                <b>Password</b>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button onClick={handleFormSwitch}>
              Don't have an account? Sign Up Here
            </Button>
            <Form.Group controlId="remember">
              <Form.Check
                type="checkbox"
                defaultChecked
                label="Remember me"
                name="remember"
              />
            </Form.Group>
            <br></br>
            <div style={{ backgroundColor: "#f1f1f1" }}>
              <Button
                variant="primary"
                className="cancelbtn"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <span className="psw">
                Forgot <a href="#">password?</a>
              </span>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LogIn;
