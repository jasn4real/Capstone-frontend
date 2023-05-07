import { Container } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function navbar() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand
            href="/"
            className="navbar-brand mb-0 h1"
            style={{ fontSize: "1.4rem" }}
          >
            <img
              className="d-inline-block "
              src={process.env.PUBLIC_URL + "/caplogo.png"}
              width="40"
              height="40"
              alt=""
            />
            <div className="logo-text">BINARY MIND</div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link to="/library" className="nav-link">
                Library
              </Link>
              <Link to="/login" className="nav-link">
                Your Account
              </Link>
              <Link to="/about" className="nav-link">
                About The Developers
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default navbar;
