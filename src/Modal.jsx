// @ts-nocheck
// Modal.js
import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

const Modal = ({ show, classes, onSelect, onClose, setFilter, filter }) => {
  // const [filter, setFilter] = useState(''); // フィルタリング用のテキストの状態 親コンポーネントで管理する
  const inputRef = useRef(null);

  useEffect(() => {
    // モーダルが表示されたときにinput要素にフォーカスを当てる
    if (show) {
      inputRef.current.focus();
    }
  }, [show]);

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
        <TextField
          type="text"
          className="search-input"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="授業を検索"
          InputProps={{
            startAdornment: ( // 虫眼鏡アイコンを追加
              <SearchIcon />
            ),
          }}
          inputRef={inputRef} // input要素にrefを設定
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