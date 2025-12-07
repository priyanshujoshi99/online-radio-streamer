import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AkashvaniIframe from './components/AkashvaniIframe';
import RadioPlayer from './components/RadioPlayer';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<RadioPlayer />} />
          <Route path="/akashvani" element={<AkashvaniIframe />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
