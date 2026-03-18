import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
      </Routes>
    </Router>
  );
}

export default App;