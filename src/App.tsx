import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';
import Navbar from './components/navbar/Navbar';
import Map from './components/map/Map';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div id="root">
      <Navbar />
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="3d" element={<div>hello</div>} />
      </Routes>
    </div>
  );
}

export default App;
