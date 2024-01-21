// @ts-nocheck
import React, { useState } from 'react';

const ClassDetailsModal = ({ classInfo, onClose, onDelete }) => {
    if (!classInfo) return null;

    const handleDelete = () => {
      onDelete(classInfo);
      onClose();
    };
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          {/* モーダルの内容 */}
          <h2>{classInfo.name}</h2>
          <p>教員名: {classInfo.teacher}</p>
          <p>教室: {classInfo.campus} {classInfo.building} {classInfo.room_id}</p>
          <p>{classInfo.year}年度 {classInfo.season} {classInfo.type}</p>
          <p>単位数: {classInfo.credits}</p>
          <p><a href={classInfo.url}>シラバス</a></p>
          <button onClick={handleDelete}>授業を取り消す</button>　
          <button onClick={onClose}>閉じる</button>
        </div>
      </div>
    );
  };
  
  export default ClassDetailsModal;