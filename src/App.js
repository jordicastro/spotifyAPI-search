// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // css file used for components to access
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'; // react-boostrap is the library
// react STATES:
import { useState, useEffect } from 'react';

const CLIENT_ID = "77ba5951d10e4ffa8e56b44740331234";
const CLIENT_SECRET = "c62ea880a65947d6bc04c2d0b8c7928d";
// { } : specific components from libraries
// Container: focus center items
// InputGroup: text input, image, for search: mb-3 (margin bottom 3), input group size = large
// FormControl: text input
// Button: button, onButtonClick
// Row: sort the containers neatly mx-2 : margins, row : bootstrap row class, row-cols-4 : 4 columns/row 
// Card: each container has a card: album src image and name

function App() {
  // searchInput is the value (const), setSearchInput changes the value of searchInput, useState is initial val, despite it being a const.
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  // react syntax: run only once 
  useEffect( () => {
    // API ACCESS TOKEN ----------------------
    let authParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParams)
      .then(result => result.json())
      .then(data => {
        setAccessToken(data.access_token);
        console.log('access token is ' + data.access_token);
      })
      .catch( error => {
        	console.error('Error', error)
      });
  }, [])

  // SEARCH --------------------
  async function search()
  {
    console.log('Searching for ' + searchInput);

    // GET using search to get artist_ID

    let searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + accessToken
      }
    }
    console.log('fetching artist...');

    let artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParams)
      .then(result => result.json())
      .then(data => {
        console.log(data);
        return(data.artists.items[0].id);
      })
      .catch( error => {
        console.error('Error', error)
      });

    console.log('Artist ID is ' + artistID);

    // GET using artist_ID to get all albums from artist
    console.log('fetching albums...');

    let fetchedAlbums = await fetch ('https://api.spotify.com/v1/artists/' + artistID + '/albums?include_groups=album&market=US&limit=50', searchParams)
      .then(result => result.json())
      .then(data => {
        console.log(data);
        setAlbums(data.items);
        return data.items;
      })
      .catch( error => {
        console.error('Error', error)
      });


    // display albums in card rows
  } 
console.log(albums);
  // the first container contains the inputGroup (text and button): the form control is the text input, with 'search for artist' as the placeholder. onChange detects change in the input text and updates the searchInput variable. Next the button, labeled 'search', onClick event activates js code
  // the second container uses cards to display API call neatly
  return (
    <div className="App">
      <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl
            placeholder="Search For Artist"
            type="input"
            onKeyPress={event => {
              if (event.key === "Enter")
              {
                console.log("Pressed enter")
                search();
              }
            }}
            //text changes: change input to event.target.value = formcontrol.value = text
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={event => {
            console.log('clicked button');
            search();
            } }>
            Search
          </Button>
        </InputGroup>
      </Container>
      
      <Container>
        <Row className='mx-2 row row-cols-4'>
          {albums.map( (album, i) => {
            return (
              <Card>
              <Card.Img src={album.images[0].url} />
              <Card.Body>
                <Card.Title>{album.name}</Card.Title>
              </Card.Body>
              </Card>
            )
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
