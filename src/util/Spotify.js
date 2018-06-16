const clientId = '46a31f5a21ed4bbba785af82c0c9b401';
const redirectURI = 'http://lotjammming.surge.sh' ;
let userAccessToken = '';


const Spotify = {
  getAccessToken() {
    if (userAccessToken){
      return userAccessToken;
    }
    let accessToken = window.location.href.match(/access_token=([^&]*)/);
    let expiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if (accessToken && expiresIn) {
      userAccessToken = accessToken[1];
      const expirationTime = Number(expiresIn[1]) * 1000;
      window.setTimeout(() => {
        userAccessToken = '';
      }, expirationTime);
      window.history.pushState('Access Token', null, '/');
      return userAccessToken;
    }
    else {
      window.location.href = (`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`);
    }
  },

  search(term) {
    const accessToken = this.getAccessToken();
    const endpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;
    return fetch(endpoint,
      {
        headers: {Authorization: `Bearer ${accessToken}`}
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        console.log(jsonResponse);
        if (!jsonResponse.tracks) {
          return [];
        }
          return jsonResponse.tracks.items.map(newTrack => (
            {
            id: newTrack.id,
            name: newTrack.name,
            artist: newTrack.artists[0].name,
            album: newTrack.album.name,
            uri: newTrack.uri
          }));
      });
  },

  savePlaylist(playlistName, trackURIs) {
    if(!playlistName || !trackURIs) {
      return;
    }
    let accessToken = this.getAccessToken();
    let headers = {Authorization: `Bearer ${accessToken}`};
    return fetch('https://api.spotify.com/v1/me', {headers: headers})
    .then(response => response.json())
    .then(jsonResponse => jsonResponse.id)
    .then(userId => fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {headers: headers, body: JSON.stringify({name : playlistName}), method:'POST'})
      .then(response => response.json())
      .then(jsonResponse => {
        const playlistId = jsonResponse.id;
        const addSong = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
        fetch(addSong, {headers: headers, body: JSON.stringify({uris : trackURIs}), method:'POST'});
      })
    );
  }
}

export default Spotify;
