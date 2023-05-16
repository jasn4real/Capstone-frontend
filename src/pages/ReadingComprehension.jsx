import React from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import lc from "../storage_";

export default function ReadingComprehension() {
  const handleReadingComprehensionSubmit = (evt) => {
    evt.preventDefault();
    const fileHash =
      "0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef";
    lc.textToComprehension(
      fileHash,
      evt.target.readingcomprehenstion.value,
      (data) => {
        console.log(data);
      }
    );
  };

  return (
    <div className="container rc-text-container">
      <div class="fade-in-text"></div>
      <Form className="text-box" onSubmit={handleReadingComprehensionSubmit}>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="text"
            name="readingcomprehenstion"
            placeholder="Type..."
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
