// import React, { useEffect, useState } from 'react';
// import { fetchProjectTasks, createTask, updateTask } from '../services/api';
// import { useParams } from 'react-router-dom';

// const ProjectDetails = () => {
//   const { id } = useParams();
//   const [tasks, setTasks] = useState([]);
//   const [title, setTitle] = useState('');
//   const [priority, setPriority] = useState('low');

//   const role = localStorage.getItem('role');
//   const userId = parseInt(localStorage.getItem('user_id'));

//   const loadTasks = async () => {
//     try {
//       const res = await fetchProjectTasks(id);
//       let data = res.data || [];

//       console.log('Fetched tasks from API:', data);

//       // User: only own tasks
//       if(role !== 'admin'){
//         data = data.filter(t => parseInt(t.user_id) === userId);
//       }

//       console.log('Filtered tasks for this user:', data);
//       setTasks(data);
//     } catch(err){
//       console.error(err);
//       alert('Error loading tasks');
//     }
//   };

//   useEffect(() => { loadTasks(); }, []);

//   // Admin: Create Task
//   const handleCreateTask = async (e) => {
//     e.preventDefault();
//     try {
//       await createTask({
//         project_id: id,
//         user_id: userId, // Admin can assign, here just assigning self
//         title,
//         priority,
//         due_date: new Date().toISOString().split('T')[0]
//       });
//       setTitle('');
//       setPriority('low');
//       loadTasks();
//     } catch(err){
//       console.error(err);
//       alert('Error creating task');
//     }
//   };

//   // Update task status
//   const handleStatusChange = async (taskId, status) => {
//     try {
//       await updateTask(taskId, { status });
//       loadTasks();
//     } catch(err){
//       console.error(err);
//       alert('Error updating task');
//     }
//   };

//   return (
//     <div style={{maxWidth:'600px', margin:'20px auto'}}>
//       <h2>Project Tasks</h2>

//       {/* Admin only: Create Task */}
//       {role === 'admin' && (
//         <form onSubmit={handleCreateTask} style={{marginBottom:'20px', display:'flex', gap:'10px'}}>
//           <input type="text" placeholder="Task Title" value={title} onChange={e=>setTitle(e.target.value)} required />
//           <select value={priority} onChange={e=>setPriority(e.target.value)}>
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//           </select>
//           <button type="submit">Add Task</button>
//         </form>
//       )}

//       <ul style={{listStyle:'none', padding:0}}>
//         {tasks.map(t => (
//           <li key={t.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #ccc', padding:'5px', margin:'5px 0'}}>
//             <span>{t.title} - {t.status} - {t.priority}</span>

//             {/* Update buttons */}
//             {t.status !== 'DONE' && (role === 'admin' || t.user_id === userId) && (
//               <span>
//                 <button onClick={()=>handleStatusChange(t.id,'IN_PROGRESS')} style={{marginRight:'5px'}}>Start</button>
//                 <button onClick={()=>handleStatusChange(t.id,'DONE')}>Done</button>
//               </span>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ProjectDetails;
import React, { useEffect, useState } from 'react';
import { fetchProjectTasks, createTask, updateTask, fetchUsers } from '../services/api';
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('low');
  const [dueDate, setDueDate] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [users, setUsers] = useState([]);

  const role = localStorage.getItem('role');
  const userId = parseInt(localStorage.getItem('user_id'));

  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      let data = res.data?.data || res.data || [];
      if (!Array.isArray(data)) data = [];
      setUsers(data);
    } catch(err){
      console.error(err);
    }
  };

  const loadTasks = async () => {
    try {
      const res = await fetchProjectTasks(id);
      console.log('API Response:', res.data);

      let data = res.data?.data || res.data || [];
      if (!Array.isArray(data)) data = [];

      // ✅ user_id — database column
      if(role !== 'admin'){
        data = data.filter(t => parseInt(t.user_id) === userId);
      }

      setTasks(data);
    } catch(err){
      console.error(err);
      alert('Error loading tasks');
    }
  };

  useEffect(() => {
    loadTasks();
    if(role === 'admin') loadUsers();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask(id, {
        assigned_to: parseInt(assignTo), // backend user_id mein save karega
        title,
        priority,
        due_date: dueDate,
      });
      setTitle('');
      setPriority('low');
      setDueDate('');
      setAssignTo('');
      loadTasks();
    } catch(err){
      console.error(err);
      alert('Error creating task');
    }
  };

  const handleStatusChange = async (taskId, currentStatus, newStatus) => {
    // ✅ IN_PROGRESS — database value
    if(currentStatus === 'OVERDUE' && newStatus === 'IN_PROGRESS'){
      alert('Overdue task ko IN_PROGRESS mein nahi le ja sakte!');
      return;
    }
    if(currentStatus === 'OVERDUE' && newStatus === 'DONE' && role !== 'admin'){
      alert('Sirf Admin overdue task close kar sakta hai!');
      return;
    }
    try {
      await updateTask(taskId, { status: newStatus });
      loadTasks();
    } catch(err){
      console.error(err);
      alert('Error updating task');
    }
  };

  return (
    <div style={{maxWidth:'600px', margin:'20px auto'}}>
      <h2>Project Tasks</h2>

      {role === 'admin' && (
        <form onSubmit={handleCreateTask} style={{marginBottom:'20px', display:'flex', gap:'10px', flexWrap:'wrap'}}>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={e=>setTitle(e.target.value)}
            required
          />
          <select value={priority} onChange={e=>setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={e=>setDueDate(e.target.value)}
            required
          />
          <select value={assignTo} onChange={e=>setAssignTo(e.target.value)} required>
            <option value="">-- Assign To --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>ID:{u.id} — {u.name}</option>
            ))}
          </select>
          <button type="submit">Add Task</button>
        </form>
      )}

      <ul style={{listStyle:'none', padding:0}}>
        {tasks.length === 0 && <p style={{color:'#888'}}>Koi task nahi mila.</p>}

        {tasks.map(t => (
          <li key={t.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #ccc', padding:'8px', margin:'5px 0', borderRadius:'4px', background: t.status === 'OVERDUE' ? '#fff5f5' : '#fff'}}>

            <span>
              <strong>{t.title}</strong>
              <br/>
              <small style={{color:'#666'}}>
                {t.status} — {t.priority} — Due: {t.due_date}
              </small>
            </span>

            {t.status !== 'DONE' && (role === 'admin' || parseInt(t.user_id) === userId) && (
              <span>
                {/* ✅ PENDING — database value */}
                {t.status === 'PENDING' && (
                  <button
                    onClick={()=>handleStatusChange(t.id, t.status, 'IN_PROGRESS')}
                    style={{marginRight:'5px'}}
                  >
                    Start
                  </button>
                )}

                {/* ✅ IN_PROGRESS — database value */}
                {t.status === 'IN_PROGRESS' && (
                  <button onClick={()=>handleStatusChange(t.id, t.status, 'DONE')}>
                    Done
                  </button>
                )}

                {t.status === 'OVERDUE' && role === 'admin' && (
                  <button
                    onClick={()=>handleStatusChange(t.id, t.status, 'DONE')}
                    style={{background:'red', color:'#fff', border:'none', padding:'3px 8px', cursor:'pointer', borderRadius:'4px'}}
                  >
                    Close
                  </button>
                )}

                {t.status === 'OVERDUE' && role !== 'admin' && (
                  <small style={{color:'red'}}>Only Admin can close</small>
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDetails;