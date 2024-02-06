// TextFieldComponent.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

function TextFieldComponent({ onTextChange }) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
    onTextChange(event.target.value);
  };

  return (
    <TextField
            label="集中授業などその他の授業や時間割についてのコメント（任意）"
            multiline
            rows={4} // 初期表示時の行数を4行に設定
            value={value}
            onChange={handleChange}
            placeholder="ここには個別の授業のクチコミを入力しないでください。授業のクチコミは是非石池に投稿してください。"
            variant="outlined" // スタイルバリアント
            fullWidth // コンテナの幅いっぱいに広がるように設定
            InputLabelProps={{
              shrink: true, // ラベルを常に縮小表示
            }}
            sx={{ mt: 2,}} // マージンを設定
          />
  );
}

export default TextFieldComponent;
