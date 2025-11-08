import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import StopIcon from '@mui/icons-material/Stop';
import React, { useEffect, useRef, useState } from 'react'
import useSound from 'use-sound';
// @ts-ignore
import Sound from '../../alarm.mp3';

const TImer = () => {
  const [isActive, setIsActive] = useState<boolean>(false); // タイマーの開始/停止
  const [isSetTime, setIsSetTime] = useState<boolean>(false);
  const counter = useRef<number>(0); // 経過時間（秒）
  const prevTime = useRef<number|null>(null); // 前フレームの時間（ミリ秒）
  const frameId = useRef<number|null>(null); // animationFrame

  const [timerMinute, setTimerMinute] = useState<string>('0');
  const [timerSecond, setTimerSecond] = useState<string>('0');
  const [isStartAlarm, setStartAlarm] = useState<boolean>(false);

  const [play, {stop, pause}] = useSound(Sound);

  // 表示用
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(0);
  const [hour, setHour] = useState(0);

  // フラグ更新時
  useEffect(() => {
    console.log(isActive);
    if(isActive) {
      frameId.current = requestAnimationFrame(tick);
    } else {
      if(frameId.current) cancelAnimationFrame(frameId.current);
    }
    return () => {
      if(frameId.current) cancelAnimationFrame(frameId.current);
    }
  },[isActive]);

  // スタートボタン
  const playOnClick = () => {
    setIsActive(prev => !prev);
    prevTime.current = Date.now();
  }

  // リセットボタン
  const restartOnClick = () => {
    counter.current = 0;
    prevTime.current = Date.now();
    setIsSetTime(false);
    if(!isActive) tick();
    setStartAlarm(false);
  }

  // 起動中
  const tick = () => {
    console.log('tick');
    // frame間の経過時間を計算、変数に加算
    const now = Date.now();
    const diff = now - prevTime.current!;
    counter.current = counter.current - diff / 1000;
    prevTime.current = now;

    if(counter.current <= 0) {
        counter.current = 0;
        setIsActive(false);
        startAlarm();
    }

    // 秒・分・時に変換
    setSecond(counter.current % 60);
    const intSeconds = Math.floor(counter.current);
    const Minutes = Math.floor(intSeconds / 60);
    const Hours = Math.floor(Minutes / 60);
    setMinute(Minutes % 60);
    setHour(Hours);

    // ループ
    if(isActive) {
      frameId.current = requestAnimationFrame(tick);
    }
  }

  const startAlarm = () => {
    console.log("ALARM");
    setStartAlarm(true);
    if(isActive) play();
  }

  const handleTimerStart = () => {
    setIsSetTime(true);
    setIsActive(true);
    counter.current = Number(timerMinute) * 60 + Number(timerSecond);
    prevTime.current = Date.now();
    console.log('start');
  }

  const handleSelectOnChange = () => {
  }

  return (
    <div className='stopwatch'>
        {isStartAlarm ? 
        <p className='text alarm'>00:00.00</p> : 
        <p className='text'>{(hour!==0) ? ((hour<10) ? "0"+hour+":" : hour+":") : ""}{(minute<10) ? "0"+minute : minute}:{(second<10) ? "0"+second.toFixed(2):second.toFixed(2)}</p>}
        {isSetTime ? <>
        <IconButton sx={{border: '1px solid gray',margin:'5%'}} onClick={() => {restartOnClick();}}>
          <RestartAltIcon fontSize='large'/>
        </IconButton>
         {!isStartAlarm ? <IconButton sx={{border: '1px solid gray',margin:'5%'}} onClick={() => {playOnClick();}}>
            {isActive ?  <StopIcon fontSize='large'/> : <PlayArrowIcon fontSize='large'/>
            }
        </IconButton> : <></> }</> :
        <>
            <div className='set-timer'>
            <FormControl size="small" sx={{m:3}}>
            <InputLabel id="timer-minute-setter">分</InputLabel>
            <Select
                id="timer-minute-setter"
                value={timerMinute}
                onChange={(event:SelectChangeEvent) => {
                    setTimerMinute(event.target.value as string);
                    handleSelectOnChange();
                }}
                label="分"
            >
                {
                    // 0~59まで生成
                    Array(60).fill(0).map((val, i) => {
                        return (
                            <MenuItem value={i}>{i}</MenuItem>
                        );
                    })
                }
            </Select>
            </ FormControl>
            <FormControl size="small" sx={{m:3}}>
            <InputLabel id="timer-second-setter">秒</InputLabel>
            <Select
                id="timer-second-setter"
                value={timerSecond}
                onChange={(event:SelectChangeEvent) => {
                    setTimerSecond(event.target.value as string);
                    handleSelectOnChange();
                }}
                label="秒"
            >
                {
                    // 0~59まで生成
                    Array(60).fill(0).map((val, i) => {
                        return (
                            <MenuItem value={i}>{i}</MenuItem>
                        );
                    })
                }
            </Select>
            </FormControl>
            </div>
            <IconButton  sx={{border:'1px solid gray'}} onClick={handleTimerStart}>
                <PlayArrowIcon fontSize='large'></PlayArrowIcon>
            </IconButton>
        </>
        }
        {isStartAlarm ? <div className='AlarmOverlay'></div>:<></>}
    </div>
  )
}

export default TImer