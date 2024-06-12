import React, { Component } from "react";
import axios from "axios";

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: "",
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }
  //what is componentDidMount? it is a lifecycle method that is called after the component has been rendered
  //when should i use componentDidMount? you should use componentDidMount when you want to fetch data from an API or perform some action after the component has been rendered

  async fetchValues() {
    const values = await axios.get("/api/values/current");
    this.setState({ values: values.data });
  }
  async fetchIndexes() {
    const seenIndexes = await axios.get("/api/values/all");
    this.setState({
      seenIndexes: seenIndexes.data,
    });
  }

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).join(", ");
  }
  //what is controlled input in react? it is an input element whose value is controlled by react
  renderCalculatedValues() {
    return Object.keys(this.state.values).map((key) => (
      <div key={key}>
        For index {key} I calculated {this.state.values[key]}
      </div>
    ));
  }

  submitHandler = async (event) => {
    event.preventDefault();
    await axios.post("/api/values", {
      index: this.state.index,
    });
    this.setState({ index: "" });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>
        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}
        <h3>Calculated Values:</h3>
        {this.renderCalculatedValues()}
      </div>
    );
  }
}

export default Fib;
