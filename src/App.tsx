import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Akashvani } from './features/akashvani/Akashvani';
import { Player } from './features/player/Player';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Player />} />
        <Route path="/akashvani" element={<Akashvani />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
