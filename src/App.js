import React, { Component } from "react";
import "@progress/kendo-theme-default/dist/all.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import categories from "./categories.json";
import products from "./products.json";
import availableDates from "./availableDates.json";
import { process } from "@progress/kendo-data-query";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Calendar } from "@progress/kendo-react-dateinputs";
import {
  CalendarCell,
  CalendarWeekCell,
  CalendarHeaderTitle,
  CalendarNavigationItem,
} from "@progress/kendo-react-dateinputs";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { classNames } from "@progress/kendo-react-common";
import { Window } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Error } from "@progress/kendo-react-labels";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Container, Row, Col } from "react-bootstrap";
import Moment from "react-moment";
import "moment-timezone";

const emailRegex = new RegExp(/\S+@\S+\.\S+/);
const emailValidator = (value) =>
  emailRegex.test(value) ? "" : "Please enter a valid email.";
const EmailInput = (fieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <Input {...others} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

class CustomCell extends React.Component {
  title = "Unavailable";
  handleClick = (showTitle) => {
    if (!showTitle) {
      this.props.onClick(this.props.value);
    }
  };

  render() {
    let showTitle = false;
    let style = {
      cursor: "pointer",
      opacity: this.props.isWeekend ? 0.6 : 1,
    };

    //style.opacity = this.props.children === 14 ? 0.6 : 1;

    const someDate = new Date(this.props.value).toDateString();
    var d = new Date(2020, 9, 20).toDateString();
    var found = false;
    for (var i = 0; i < availableDates.length; i++) {
      if (
        new Date(availableDates[i].AvailableDate).toDateString() === someDate
      ) {
        found = true;
      }
    }

    if (!found) {
      style.opacity = 0.6;

      showTitle = true;
    }

    if (this.props.isWeekend || !this.props.isInRange) {
      showTitle = true;
      style.opacity = 0.6;
    }

    const className = classNames({
      "k-state-selected": this.props.isSelected,
      "k-state-focused": this.props.isFocused,
    });

    return (
      <td
        onClick={() => this.handleClick(showTitle)}
        className={className}
        style={style}
      >
        <span className='k-link' title={showTitle && this.title}>
          {this.props.children}
        </span>
      </td>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownlistCategory: null,
      value: null,
    };
  }
  handleDropDownChange = (e) => {
    this.setState({
      dropdownlistCategory: e.target.value.CategoryID,
    });
  };
  handleChange = (event) => {
    const dayOfWeek = event.value.getDay();

    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      this.setState({ value: event.value });
    }
  };
  render() {
    const handleSubmit = (dataItem) => alert(JSON.stringify(dataItem, null, 2));

    return (
      <div className='App'>
        <h1>BSH Scheduler</h1>
        <Container>
          <Row>
            <Col>
              <Form
                onSubmit={handleSubmit}
                render={(formRenderProps) => (
                  <FormElement style={{ maxWidth: 650 }}>
                    <fieldset className={"k-form-fieldset"}>
                      <legend className={"k-form-legend"}>
                        Please fill in the fields:
                      </legend>
                      <div className='mb-3'>
                        <Field
                          name={"firstName"}
                          component={Input}
                          label={"First name"}
                        />
                      </div>

                      <div className='mb-3'>
                        <Field
                          name={"lastName"}
                          component={Input}
                          label={"Last name"}
                        />
                      </div>

                      <div className='mb-3'>
                        <Field
                          name={"email"}
                          type={"email"}
                          component={EmailInput}
                          label={"Email"}
                          validator={emailValidator}
                        />
                      </div>
                    </fieldset>
                    <div className='k-form-buttons'>
                      <button
                        type={"submit"}
                        className='k-button'
                        disabled={!formRenderProps.allowSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </FormElement>
                )}
              />
            </Col>
            <Col>
              <Row>
                <p>
                  <DropDownList
                    style={{ width: "100%" }}
                    data={categories}
                    dataItemKey='CategoryID'
                    textField='CategoryName'
                    defaultItem={{
                      CategoryID: 1,
                      CategoryName:
                        "BSH Experience & Design Center - Irvine, CA (USA)",
                    }}
                    onChange={this.handleDropDownChange}
                  />
                  &nbsp;
                  <strong>{this.state.dropdownlistCategory}</strong>
                </p>
              </Row>
              <Row>
                <Tooltip anchorElement='target' position='top'>
                  <Calendar
                    min={new Date()}
                    max={new Date(2020, 11, 20)}
                    cell={CustomCell}
                    value={this.state.value}
                    onChange={this.handleChange}
                  />
                </Tooltip>
              </Row>
            </Col>
            <Col>
              <Row> </Row>
              <Row style={{ paddingTop: "15px" }}>
                <Button style={{ width: "100%" }}>8:45 AM</Button>
              </Row>
              <Row style={{ paddingTop: "15px" }}>
                <Button style={{ width: "100%" }}>8:45 AM</Button>
              </Row>
              <Row style={{ paddingTop: "15px" }}>
                <Button style={{ width: "100%" }}>8:45 AM</Button>
              </Row>
              <Row style={{ paddingTop: "15px" }}>
                <Button style={{ width: "100%" }}>8:45 AM</Button>
              </Row>

              <Row style={{ paddingTop: "15px" }}>
                <Button style={{ width: "100%" }}>Book Appointment</Button>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
