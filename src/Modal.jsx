// @ts-nocheck
// Modal.js
import React, { useState } from 'react';

const Modal = ({ show, classes, onSelect, onClose, setFilter, filter }) => {
  // const [filter, setFilter] = useState(''); // フィルタリング用のテキストの状態

  // フィルタリングされたクラスのリスト
  const filteredClasses = classes.filter(c => c.name.includes(filter));

  if (!show) {
    return null;
  }

  // モーダルを閉じるためのカスタム関数
  const handleClose = () => {
    setFilter(''); // フィルターをリセット
    onClose(); // 親コンポーネントから渡されたonClose関数を呼び出す
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <span className="close" onClick={handleClose}>&times;</span>
        <input
          type="text"
          className="search-input"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="授業を検索"
        />
        <ul className="modal-list">
          {filteredClasses.map(c => (
            <li key={c.id} onClick={() => onSelect(c)}>
              <div className="class-name">{c.name}</div>
              <div className="class-details">
                教員: {c.teacher} / 教室: {c.building} {c.room_id}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Modal;