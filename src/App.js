import React from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import "./App.css";
import Weather from "./components/weather";
import Movie from "./components/Movies";
import { Row } from "react-bootstrap";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      City: "",
      entry: "",
      lat: "",
      long: "",
      inspect: false,
      weathInfo: [],
      weathError: false,
      movieData:[],
    };
  }
  New = async (event) => {
    event.preventDefault();
    const City = event.target.City.value;
    const Link = `https://eu1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_KEY}&q=${City}&format=json`;
    try {
      const Reply = await axios.get(Link);
      this.setState({
        City: Reply.data[0].display_name,
        long: Reply.data[0].lon,
        lat: Reply.data[0].lat,
        entry: City,
      });
    } catch {
      this.setState({
        inspect: true,
      });
    }
    console.log(this.state.lat);
    console.log(this.state.long);
    this.getWeatherData();
    this.getMovieData();
  };
  getWeatherData = async () => {
    const url = `https://reem-lab07-server.herokuapp.com/weather?city_name=${this.state.entry}`;
    console.log(url);
    const WearherRes = await axios.get(url);
    console.log(WearherRes);
    try {
      console.log(WearherRes);

      this.setState({
        weathInfo: WearherRes.data,
      });
      console.log(this.state.weathInfo);
    } catch {
      this.setState({
        weathError: true,
      });
      console.log("err");
    }
  };
  getMovieData = async () => {

    const url = `https://reem-lab07-server.herokuapp.com/movie?city_name=${this.state.entry}`;
    const movieres = await axios.get(url);
    try {
        this.setState({
          movieData: movieres.data,
        })
        console.log(this.state.movieData);
      } catch {
        this.setState({
          weathError: true,
        });
        console.log("err");

  }
}

  render() {
    return (
      <>
        <Form onSubmit={this.New}>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label className="city">City</Form.Label>
            <Form.Control
              className="input"
              name="City"
              type="text"
              placeholder="Enter a City"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Explore!
          </Button>
        </Form>
        {this.state.inspect ? <p>Status Code: 400, 404, 500</p> : <p></p>}
        <p>
          City : {this.state.City}, lat:{this.state.lat}, long:
          {this.state.long}
        </p>
        {/* <p>
          the weather : {newArr}
        </p> */}
        <Image
          src={`https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_KEY}&center=${this.state.lat},${this.state.long}&zoom=1-19`}
          // let Link2 =`${process.env.REACT_APP_SERVER_URL}/weather?city_name=${this.state.City}`;
        />
        <Weather
          weatherData={this.state.weathInfo}
          weatherErr={this.state.weathError}
        />
        <Row className="justify-content-between" className="row">
          {this.state.movieData.map((item) => {
            return (
              <Movie
                title={item.title}
                overview={item.overview}
                average_votes={item.average_votes}
                total_votes={item.total_votes}
                image_url={item.image_url}
                popularity={item.popularity}
                released_on={item.released_on}
              />
            );
          })}
        </Row>
      </>
    );
  }
}

export default App;
