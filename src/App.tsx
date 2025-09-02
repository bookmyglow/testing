import { Routes, Route } from 'react-router-dom';
import ConfirmEmail from './pages/ConfirmEmail';

export default function App() {
  return (
    <Routes>
      <Route path="/confirm" element={<ConfirmEmail />} />
      <Route path="*" element={<div>Home</div>} />
    </Routes>
  );
}

