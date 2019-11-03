require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')

// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));





// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });





// the routes go here:

app.get('/', (req, res, next) => {
    res.render('index');
});

// app.get('/artists', (req, res, next) => {
//     res.render('artists');
//     console.log("hola");
// });

app.get('/artists', (req, res, next) => {


    console.log(req.query.artist)


    spotifyApi
        .searchArtists(

            String(req.query.artist)


        )
        .then(data => {
            console.log("The received data from the API: ", data.body);

            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

            res.render('artists', { artists: data.body.artists.items });




        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });



})

app.get('/albums/:artistId', (req, res) => {
    console.log(req.params.artistId)

    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log('Artist albums', data.body.items);
            res.render('albums', { albums: data.body.items })
        })
        .catch(err => {
            console.error("The error while searching albums occurred: ", err);
        })
});




app.get('/tracks/:albumId', (req, res) => {
    console.log(req.params.albumId)

    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(data => {
            console.log('Album tracks', data.body.items);
            const tracks = data.body.items
            res.render('tracks', { tracks })
                // res.render('tracks', { tracks: data.body.items })
        })
        .catch(err => {
            console.error("The error while searching tracks occurred: ", err);
        })
});





app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));