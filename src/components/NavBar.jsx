import { Container } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../NavBar.css";

function navbar() {
  return (
    <>
      <Navbar fluid="true" bg="dark" variant="dark" expand="lg" sticky="top">
        <Container fluid>
          <Navbar.Brand
            href="/"
            className="navbar-brand mb-0 h1 mx-auto pl-4"
            style={{ fontSize: "2rem" }}
          >
            <img
              className="d-inline-block "
              src={process.env.PUBLIC_URL + "/Caplogo2.png"}
              width="100"
              height="100"
              alt=""
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="ml-auto h2">
              <Link to="/login" className="nav-link pill-link">
                Your Account
              </Link>
              <Link to="/about" className="nav-link pill-link">
                About
              </Link>
              <Link to="/search" className="nav-link pill-link">
                Search
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default navbar;
