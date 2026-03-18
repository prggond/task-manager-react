import React, { useEffect, useState } from 'react';
import { fetchProjects } from '../services/api';
import { Link } from 'react-router-dom';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetchProjects();
        setProjects(res.data || []);
      } catch(err){
        console.error(err);
        alert('Error loading projects');
      }
    };
    loadProjects();
  }, []);

  return (
    <div style={{maxWidth:'600px', margin:'20px auto'}}>
      <h2>Projects</h2>
      <ul style={{listStyle:'none', padding:0}}>
        {projects.map(p => (
          <li key={p.id} style={{border:'1px solid #ccc', padding:'10px', margin:'5px 0'}}>
            <Link to={`/projects/${p.id}`}>{p.name || 'Project ' + p.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;