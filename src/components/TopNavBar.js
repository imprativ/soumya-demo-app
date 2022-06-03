import React from "react";
import { Navbar, Container } from "react-bootstrap";

const TopNavBar = () => {
  return (
    <Navbar>
      <Container fluid>
        <Navbar.Brand>Soumya App</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>Signed in as: Soumya Sanyal</Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavBar;
