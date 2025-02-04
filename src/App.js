import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSeminar, setEditingSeminar] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/seminars')
      .then(response => response.json())
      .then(data => {
        setSeminars(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const deleteSeminar = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот семинар?')) {
      fetch(`http://localhost:5000/seminars/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setSeminars(seminars.filter(seminar => seminar.id !== id));
        })
        .catch(err => setError(err));
    }
  };

  const editSeminar = (seminar) => {
    setEditingSeminar(seminar);
  };

  const saveSeminar = (updatedSeminar) => {
    fetch(`http://localhost:5000/seminars/${updatedSeminar.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedSeminar),
    })
      .then(() => {
        setSeminars(seminars.map(seminar => seminar.id === updatedSeminar.id ? updatedSeminar : seminar));
        setEditingSeminar(null);
      })
      .catch(err => setError(err));
  };

  if (loading) return <div className="text-center text-lg">Загрузка...</div>;
  if (error) return <div className="text-center text-red-500">Ошибка: {error.message}</div>;

  return (
    <div className="container">
      <h1 className="title">Семинары</h1>
      <ul className="seminar-list">
        {seminars.map(seminar => (
          <li key={seminar.id} className="seminar-item">
            <img src={seminar.photo} alt={seminar.title} className="seminar-image" />
            <h2 className="seminar-title">{seminar.title}</h2>
            <p className="seminar-description">{seminar.description}</p>
            <p className="seminar-date"><strong>Дата:</strong> {seminar.date}</p>
            <p className="seminar-time"><strong>Время:</strong> {seminar.time}</p>
            <div className="mt-4">
              <button onClick={() => editSeminar(seminar)} className="button button-edit">Редактировать</button>
              <button onClick={() => deleteSeminar(seminar.id)} className="button button-delete">Удалить</button>
            </div>
          </li>
        ))}
      </ul>
      {editingSeminar && (
        <Modal seminar={editingSeminar} onSave={saveSeminar} onClose={() => setEditingSeminar(null)} />
      )}
    </div>
  );
};

const Modal = ({ seminar, onSave, onClose }) => {
  const [title, setTitle] = useState(seminar.title);
  const [description, setDescription] = useState(seminar.description);
  const [date, setDate] = useState(seminar.date);
  const [time, setTime] = useState(seminar.time);
  const [photo, setPhoto] = useState(seminar.photo);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...seminar, title, description, date, time, photo });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="modal-title">Редактировать семинар</h2>
        <form onSubmit={handleSubmit}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название" className="modal-input" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание" className="modal-input" />
          <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Дата" className="modal-input" />
          <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Время" className="modal-input" />
          <input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="Ссылка на фото" className="modal-input" />
          <div className="flex justify-between mt-4">
            <button type="submit" className="modal-button modal-button-save">Сохранить</button>
            <button type="button" onClick={onClose} className="modal-button modal-button-close">Закрыть</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;