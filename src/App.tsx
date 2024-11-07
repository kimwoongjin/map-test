import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';
import Navbar from './components/navbar/Navbar';
import Map from './components/map/Map';

function App() {
  return (
    <div id="root">
      <Navbar />
      <Map />
    </div>
  );
}

export default App;
