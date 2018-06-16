import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props){
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.state = {
      searchResults : [],
      playlistName : 'New playlist',
      playlistTracks : []
    };
  }

  addTrack(track){
    const tracks = this.state.playlistTracks;
    const comparison = tracks.find(newTrack => newTrack.id === track.id);
    if(!comparison) {
      tracks.push(track);
      this.setState({playlistTracks: tracks});
    }
  }

  removeTrack(track){
    const tracks = this.state.playlistTracks;
    const comparison = tracks.filter(delTrack => delTrack.id !== track.id);
    this.setState({playlistTracks: comparison});
  }

  updatePlaylistName(name) {
    this.setState({playlistName : name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(aTrack => aTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({playlistName: 'New Playlist', playlistTracks : [] })
    });
  }

  search(term) {
    Spotify.search(term).then(tracks => {
      this.setState({searchResults : tracks});
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
            <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
            searchResults={this.state.searchResults}
            onAdd={this.addTrack} />
            <Playlist
            playlistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
