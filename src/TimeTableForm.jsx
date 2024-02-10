import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // モーダルコンポーネントのインポート
import ClassDetailsModal from './ClassDetailsModal'; // モーダルコンポーネントのインポート
import TextFieldComponent from './TextFieldComponent';
import './TimeTable.css';
import './Modal.css';
import './ClassDetailsModal.css';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';


const TimeTableForm = () => {
  const [textFieldValue, setTextFieldValue] = useState('');
  // TextFieldComponentが変更されたときに呼び出される関数
  const handleTextChange = (value) => {
    setTextFieldValue(value);
  };

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
    // 曜日のリスト
    const days = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日'];

    const dayMapping = {
        '月曜日': 1,
        '火曜日': 2,
        '水曜日': 3,
        '木曜日': 4,
        '金曜日': 5
    };
      
    const periodMapping = {
      '1時間目': 1,
      '2時間目': 2,
      '3時間目': 3,
      '4時間目': 4,
      '5時間目': 5,
      '6時間目': 6
    };

    const timeSlots = {
      '1時間目': '',
      '2時間目': '',
      '3時間目': '',
      '4時間目': '',
      '5時間目': '',
      '6時間目': ''
    };

    // 特定の曜日と時間帯に対応する授業を検索する関数
    const renderSchedule = (day, period, term) => {
      if (!Array.isArray(schedule)) {
        return '';
      }

      const classInfo = schedule.find(c => c.day === day && c.period === period && c.season === term);
      if (!classInfo) {
        return '';
      }

      const handleClassInfoClick = (e) => {
        e.stopPropagation(); // イベントの伝播を停止
        handleCellClick(day, period, classInfo);
      };
    
      return (
        <div onClick={handleClassInfoClick}>
          <div className="class-name-timetable">{classInfo.name}</div>
          {/*<div className="class-room">{classInfo.building} {classInfo.room_id}</div>*/}
        </div>
      );
    };
      
    const [schedule, setSchedule] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

    const showClassDetails = (classInfo) => {
      setSelectedClass(classInfo);
    };

    const closeClassDetails = () => {
      setSelectedClass(null);
    };

    const handleCellClick = async (day, period, classInfo, term) => {
        if (classInfo) {
          // 授業の詳細情報を表示するロジック
          showClassDetails(classInfo);
        } else {
          const dayNumber = dayMapping[day];
          const periodNumber = periodMapping[period];
        
          const classesForDayAndPeriod = await fetchClassesForDayAndPeriod(dayNumber, periodNumber);
          console.log("classesForDayAndPeriod: ", classesForDayAndPeriod);
          setCurrentClasses(classesForDayAndPeriod.filter(c => c.season === term));
          setModalShow(true);
        }
      };

    const fetchClassesForDayAndPeriod = async (dayNumber, periodNumber) => {
        try {
          const response = await fetch(`https://api.ayutaso.com/classes/${dayNumber}/${periodNumber}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return await response.json();
        } catch (error) {
          console.error('Error fetching classes:', error);
          return [];
        }
      };

    /*useEffect(() => {
        const loadAndSetSchedule = async () => {
          const loadedSchedule = await loadClasses();
          loadedSchedule.onsuccess = () => {
            setSchedule(loadedSchedule.result);
          }
        };
      
        loadAndSetSchedule();
      }, []);*/

      const deleteClass = async (classId) => {
        // スケジュールからも削除
        setSchedule(schedule => schedule.filter(c => c.lecture_id !== classId));
        
      };

    const [modalShow, setModalShow] = useState(false);
    const [filter, setFilter] = useState(''); // 授業のフィルタリング用のテキストの状態
    const [currentClasses, setCurrentClasses] = useState([]);
      
    const handleClassSelect = async (classInfo) => {
        // モーダルを閉じる
        setModalShow(false);
        setFilter(''); // フィルターをリセット
      
        // classInfo の内容を確認（デバッグ用）
        console.log("Selected Class: ", classInfo);
      
        // day と period を曜日と時間帯の文字列に変換
        const dayString = Object.keys(dayMapping).find(key => dayMapping[key] === classInfo.day);
        const periodString = Object.keys(periodMapping).find(key => periodMapping[key] === classInfo.period);
      
        // 更新する授業情報を作成
        const updatedClassInfo = {
          ...classInfo,
          day: dayString,
          period: periodString
        };

        console.log("updatedClassInfo: ", updatedClassInfo);
      
        try {
      
          // 現在のスケジュールに更新された授業を追加して、UIを更新
          setSchedule(prevSchedule => {
            // prevSchedule が配列であることを確認
            if (Array.isArray(prevSchedule)) {
              return [...prevSchedule, updatedClassInfo];
            } else {
              // prevSchedule が配列でない場合、新しい配列を返す
              console.log("elseだよ", prevSchedule);
              return [updatedClassInfo];
            }
          });

          console.log("schedule1: ", schedule);
        } catch (error) {
          console.error("Error saving class ", error);
        }
      };
      const handleAlertOpen = (message) => {
        setAlertMessage(message);
        setAlertOpen(true);
      };

      const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setAlertOpen(false);
      };

      // ダイアログ関連
      const [openDialog, setOpenDialog] = useState(false);

      const handleDialogOpen = () => {
        setOpenDialog(true);
      };
      const handleDialogClose = () => {
        window.location.href = 'https://ishiike.herokuapp.com/review-list/';
      };

      const sendSchedule = async () => {
        // 学部学科とscheduleを結合して送信
        const department = selectedGakka.label;
        const classes = schedule;
        const free_msg = textFieldValue;
        const data = {department, classes, free_msg};
        console.log("data: ", data);
        try {
          const response = await fetch('https://ishiike.herokuapp.com/timetable/schedules/create/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          } else {
            handleDialogOpen();
            setSchedule(schedule => []);
          }
        } catch (error) {
          console.error('Error sending schedule:', error);
          handleAlertOpen('エラーが発生しました。');
        }
      };

    const gakubu = [
        { label: '人文社会学部', id: 1 },
        { label: '法学部', id: 2 },
        { label: '経済経営学部', id: 3 },
        { label: '理学部', id: 4 },
        { label: '都市環境学部', id: 5 },
        { label: 'システムデザイン学部', id: 6 },
        { label: '健康福祉学部', id: 7 },
    ];
    const gakkaMap = {
        1: [
          { label: '人間社会学科', id: 1 },
          { label: '人文学科', id: 2 },
        ],
        2: [
            { label: '法律学コース', id: 3 },
            { label: '政治学コース', id: 4 },
        ],
        3: [
            { label: '経済学コース', id: 5 },
            { label: '経営学コース', id: 6 },
        ],
        4: [
            { label: '数理科学科', id: 7 },
            { label: '物理学科', id: 8 },
            { label: '化学科', id: 9 },
            { label: '生命科学科', id: 10 },
        ],
        5: [
            { label: '地理環境学科', id: 11 },
            { label: '都市基盤環境学科', id: 12 },
            { label: '建築学科', id: 13 },
            { label: '環境応用化学科', id: 14 },
            { label: '観光科学科', id: 15 },
            { label: '都市政策科学科', id: 16 },
        ],
        6: [
            { label: '情報科学科', id: 17 },
            { label: '電子情報工学科', id: 18 },
            { label: '機械システム工学科', id: 19 },
            { label: '航空宇宙システム工学科', id: 20 },
            { label: 'インダストリアルアート学科', id: 21 },
        ],
        7: [
            { label: '看護学科', id: 22 },
            { label: '理学療法学科', id: 23 },
            { label: '作業療法学科', id: 24 },
            { label: '放射線学科', id: 25 },
        ],
        // 他の学部に対応する学科もここにマッピングする
      };

      const [selectedGakubu, setSelectedGakubu] = useState(null);
      const [gakkaOptions, setGakkaOptions] = useState([]);
      const [selectedGakka, setSelectedGakka] = useState(null);
    
      const handleGakubuChange = (event, value) => {
        setSelectedGakubu(value);
        setGakkaOptions(value ? gakkaMap[value.id] : []);
      };
      const handleGakkaChange = (event, value) => {
        setSelectedGakka(value);
      };

  return (
    <>
    <Container>
        <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }} // ビューポートの高さに合わせる
    >
        <Typography variant='h4' component='h1' my={2}>
            時間割投稿フォーム
        </Typography>
        <Typography variant='body1' component='p' my={2}>
            このフォームは1年の時間割を投稿し、新入生に履修登録の参考にしてもらうためのものです。
            投稿は匿名で行われ、新入生向けサイトに掲載されます。ご協力をお願いします。
        </Typography>
        <Typography variant='body1' component='p' my={2}>
            あなたの学部・学科を選択してください
        </Typography>

         <Autocomplete
        disablePortal
        id="gakubu-autocomplete"
        options={gakubu}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="学部" />}
        onChange={handleGakubuChange}
      />
      <br></br>
        <Autocomplete
        disablePortal
        id="gakka-autocomplete"
        options={gakkaOptions}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="学科" />}
        disabled={!selectedGakubu}
        onChange={handleGakkaChange}
      />
        <div className="TimeTable">
        
        <ClassDetailsModal
            classInfo={selectedClass}
            onClose={closeClassDetails}
            onDelete={deleteClass}
        />
        <Modal
            show={modalShow}
            classes={currentClasses}
            onSelect={handleClassSelect}
            onClose={() => setModalShow(false)}
            setFilter={setFilter}
            filter={filter}
        />
        <Typography variant='body1' component='p' my={2}>
            1年前期の時間割を入力してください
        </Typography>
        <table>
            <thead>
            <tr>
                <th>時間\曜日</th>
                {days.map(day => <th key={day}>{day}</th>)}
            </tr>
            </thead>
            <tbody>
            {Object.entries(timeSlots).map(([period, time]) => (
                <tr key={period}>
                    <td>{`${period} ${time}`}</td>
                {days.map(day => (
                    <td key={day} onClick={() => handleCellClick(day, period, undefined, "前期")}>
                    {renderSchedule(day, period, "前期")}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        <div className="TimeTable">
        
        <ClassDetailsModal
            classInfo={selectedClass}
            onClose={closeClassDetails}
            onDelete={deleteClass}
        />
        <Modal
            show={modalShow}
            classes={currentClasses}
            onSelect={handleClassSelect}
            onClose={() => setModalShow(false)}
            setFilter={setFilter}
            filter={filter}
        />
        <Typography variant='body1' component='p' my={2}>
            1年後期の時間割を入力してください
        </Typography>
        <table>
            <thead>
            <tr>
                <th>時間\曜日</th>
                {days.map(day => <th key={day}>{day}</th>)}
            </tr>
            </thead>
            <tbody>
            {Object.entries(timeSlots).map(([period, time]) => (
                <tr key={period}>
                    <td>{`${period} ${time}`}</td>
                {days.map(day => (
                    <td key={day} onClick={() => handleCellClick(day, period, undefined, "後期")}>
                    {renderSchedule(day, period, "後期")}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        <TextFieldComponent onTextChange={handleTextChange}/>
        <Button
          variant="contained"
          size="large" // ボタンのサイズを大きく設定
          onClick={sendSchedule}
          sx={{
            m: 2, // すべての方向にマージンを適用
          }}
        >
          送信
        </Button>
        </Box>
    </Container>
  <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 2 // padding top and bottom
      }}
    >
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"送信完了"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            時間割を送信しました！Thank you!<br />
            もしよければ、授業のクチコミも<Link href="https://ishiike.herokuapp.com/create-review/" target="_blank" rel="noopener noreferrer">こちら</Link>に投稿してください!<br />
            先輩が投稿した授業のクチコミは<Link href="https://ishiike.herokuapp.com/review-list/" target="_blank" rel="noopener noreferrer">こちら</Link>から見ることが出来ます!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
        Copyright © Ishiike 2022 - 2024 / @f_tmu_ 新入生向けwiki 
        </Typography>
      </Container>
    </Box>
    </>
  );
};

export default TimeTableForm;