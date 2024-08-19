import React from 'react';

const Section = ({ title, date, name, status, comments, subtasks, onClick  }) => (
  <div className="section" onClick={onClick} style={{ cursor: 'pointer' }}>
    <div className="section-header">
      <h3>{title}</h3>
      <p className="date">{date}</p>
    </div>
    <p className="name">{name}</p>
    <p className={`status ${status}`}>{status.toUpperCase()}</p>
    {comments && <p className="comments">{comments}</p>}
    {subtasks && (
      <div className="subtasks">
        {subtasks.map((subtask, index) => (
          <p key={index} className={`subtask ${subtask.status}`}>
            {subtask.text}
          </p>
        ))}
      </div>
    )}
  </div>
);



const Sidebar = ({ setSelectedStep }) => {
  return (
    <aside className="sidebar">
      <Section title="Wstępny plan" date="12.03.2024" name="Daniel" status="done" />
      <Section
        title="Wizja w terenie"
        date="12.03.2024"
        name="Marcin"
        status="todo"
        onClick={() => setSelectedStep('Details')} 
        subtasks={[
          { text: 'Wgranie zdjęć', status: 'done' },
          { text: 'Wskazano do geodety', status: 'done' },
          { text: 'Uwagi - 3/4', status: 'todo' }
        ]}
      />
      <Section title="Przygotowanie trasy" date="12.03.2024" name="Daniel" status="actual" />
      <Section
        title="Przygotowanie porozumień"
        date="12.05.2024"
        status="todo"
        onClick={() => setSelectedStep('PreliminaryPlan')} 
        subtasks={[
          { text: 'Prośba o wypis gruntu', status: 'todo' },
          { text: 'Stworzenie porozumień', status: 'todo' }
        ]}
      />
      <Section
        title="Zebranie porozumień"
        date="12.06.2024"
        status="todo"
        onClick={() => setSelectedStep('Wstępny plan')} 
        subtasks={[
          { text: 'Zaakceptowane wszystkie porozumienia 0/0', status: 'todo' },
          { text: 'Zaakceptowane wody polskie', status: 'todo' }
        ]}
      />
    </aside>
  );
}

export default Sidebar;