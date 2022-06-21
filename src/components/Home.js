import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CSVLink } from "react-csv";

const fileReader = new FileReader();

const Home = () => {
  const [file, setFile] = useState();
  const [items, setItems] = useState([]);

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((i) => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });
    console.log("array", array);
    setItems(array);
  };

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };
      fileReader.readAsText(file);
    }
    console.log("handleOnSubmit", items);
  };

  const handleViewlist = (e) => {
    console.log("File Name", file.name);
    console.log("Items State: ", items);
  };

  const handleHideItem = (e, listIdx, idx) => {
    console.log("HIDE index", listIdx, idx);
    let newItems = [...items];
    let theoryArr = newItems[listIdx].Theory.split(". ");
    theoryArr.push(theoryArr.splice(idx, 1)[0]);
    newItems[listIdx].Theory =
      theoryArr.map((str) => str.replaceAll(".", "")).join(". ") + ".";
    setItems(newItems);
  };

  const onDragEnd = (result, index) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems = [...items];
    let theoryArr = newItems[index].Theory.split(". ");
    const [removed] = theoryArr.splice(result.source.index, 1);
    theoryArr.splice(result.destination.index, 0, removed);
    newItems[index].Theory =
      theoryArr.map((str) => str.replaceAll(".", "")).join(". ") + ".";
    setItems(newItems);

    // console.log("onDragEnd:", items);
  };

  return (
    <Container style={{ marginBottom: "5rem" }}>
      <Row className="align-items-center">
        <Col>
          <Form.Group controlId="formFileSm" className="mb-3">
            <Form.Label>Choose CSV file..</Form.Label>
            <Form.Control
              type="file"
              size="sm"
              accept=".csv"
              onChange={handleOnChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Button
            variant="primary"
            onClick={(e) => {
              handleOnSubmit(e);
            }}
          >
            Import CSV File
          </Button>
        </Col>
        <Col>
          <Button
            variant="info"
            onClick={(e) => {
              handleViewlist(e);
            }}
          >
            View in Console Log
          </Button>
        </Col>
        <Col>
          {file && (
            <CSVLink
              data={items}
              filename={file.name}
              enclosingCharacter={``}
              className="btn btn-success"
              target="_blank"
            >
              Download Updated CSV
            </CSVLink>
          )}
        </Col>
      </Row>
      <Row style={{ marginTop: "2rem" }}>
        <Col>
          {items.map((item, idx) => (
            <Card style={{ marginBottom: "1rem" }} key={idx}>
              <Card.Header>{item.Id}</Card.Header>
              <Card.Body>
                <Card.Title>Statement: {item.Statement}</Card.Title>
                <Card.Text>
                  Theory:
                  <DragDropContext
                    onDragEnd={(result) => {
                      onDragEnd(result, idx);
                    }}
                  >
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {item.Theory.split(". ").map((text, index) => (
                            <Draggable
                              key={`draggable_${item.Id}_${index}`}
                              draggableId={`draggable_${item.Id}_${index}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getListItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  {text}
                                  <Button
                                    variant="outline-dark"
                                    size="sm"
                                    onClick={(e) => {
                                      handleHideItem(e, idx, index);
                                    }}
                                    style={{ marginLeft: "3rem" }}
                                  >
                                    X
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

const getListItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  margin: "5px",
  padding: "5px",
  border: "1px solid black",
  background: isDragging ? "lightgreen" : "white",
  ...draggableStyle,
});

export default Home;
