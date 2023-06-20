import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Card, Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SignUp(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        // Redirect to the landing page
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  const handleFormSwitch = () => {
    if (typeof props.onFormSwitch === "function") {
      props.onFormSwitch("login");
    }
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center">
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit}>
            <div>
              <h2 className="text-center">
                <strong>Create Account</strong>
              </h2>
            </div>
            <Form.Group controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <br></br>
            <div className="justify-content-center">
              <h5>
                <span>
                  By clicking Sign Up, you agree to our Terms, Privacy Policy
                  and Cookies Policy. You may receive SMS Notifications from us
                  and can opt out any time.
                </span>
              </h5>
            </div>
            <Button variant="primary" type="submit">
              <strong>Sign Up</strong>
            </Button>
            <Button variant="primary" onClick={handleFormSwitch}>
              <strong>Already have an account? Log In Here</strong>
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;
