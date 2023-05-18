import React, { useState} from 'react';
import { ListGroup, Button, Form } from 'react-bootstrap';
import lc from "../storage_";

function QueryHistory() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState("");
    const [queryHistory, setQueryHistory] = useState([]);

    const getAllFiles = () => {
      let allFiles = lc.getAllFiles();
      allFiles = allFiles.map((el) =>
        lc.getFileDetail(el, ["metaData", "textToImage"])
      );
      console.log(allFiles);
    };

    const handleQuerySubmit = () => {
      getAllFiles();
      setResult("");
      const newQueryHistoryItem = { query: query, response: result };
      setQueryHistory((prevHistory) => [...prevHistory, newQueryHistoryItem]);
      setQuery("");
    };

  return (
    <div>
      <div className="query-history">
        <h3>Query History</h3>
        <ListGroup>
          {queryHistory.map((item, index) => (
            <ListGroup.Item key={index}>
              <strong>Query:</strong> {item.query}
              <br />
              <strong>Response:</strong> {item.response}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <Form onSubmit={handleQuerySubmit}>
        <Form.Group>
          <Form.Label>Enter query:</Form.Label>
          <Form.Control
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
      <div>
        <h3>Query Result</h3>
        <p>{result}</p>
      </div>
    </div>
  );
}

export default QueryHistory;
