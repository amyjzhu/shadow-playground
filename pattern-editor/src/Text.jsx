import React, { Component } from "react";

export default class Text extends Component {
  constructor() {
    super();
    this.state = {
      pattern: "",
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.rows !== this.props.rows || prevProps.colours !== this.props.colours) {
        let newState = { stitchPattern: this.props.rows, colourPattern: this.props.colours };
        this.setState({ pattern: JSON.stringify(newState) });
    }

    if (prevProps.colours !== this.props.colours) {
        this.setState({ colours: JSON.stringify(this.props.colours) });
    }
    }

  handlePatternChange = (event) => {
    let parsed = JSON.parse(event.target.value);
    this.props.handleLoadStitchPattern(parsed.stitchPattern);
    this.props.handleLoadColorPattern(parsed.colourPattern);
  }


  render() {
    return (
      <div>
        <label>Pattern bitmap: </label><br/>
        <input type="textarea" 
          value={this.state.pattern}
          onChange={this.handlePatternChange}
        />
      </div>
    );
  }
}
