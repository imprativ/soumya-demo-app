import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
    // console.log("handleOnSubmit");
  };

  const handleViewlist = (e) => {
    console.log("Items State: ", items);
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems = [...items];
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setItems(newItems);

    console.log("onDragEnd:", items);
  };

  return (
    <Container>
      <Row>
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
            Load CSV File1
          </Button>
        </Col>
        <Col>
          <Button
            variant="primary"
            onClick={(e) => {
              handleViewlist(e);
            }}
          >
            view
          </Button>
        </Col>
      </Row>
      <Row style={{ marginY: "2rem" }}>
        <Col>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {items.map((item, index) => (
                    <Draggable
                      key={item.Id}
                      draggableId={item.Id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {item.Id},{item.Statement},{item.Theory}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
