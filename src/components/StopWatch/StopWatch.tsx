import { IconButton, Typography } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import StopIcon from '@mui/icons-material/Stop';
import React, { useEffect, useRef, useState } from 'react'

const StopWatch = () => {

  const [isActive, setIsActive] = useState<boolean>(false); // ストップウォッチの開始フラグ
  const counter = useRef<number>(0); // 経過時間（秒）
  const prevTime = useRef<number|null>(null); // 前フレームの時間（ミリ秒）
  const frameId = useRef<number|null>(null); // animationFrame

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
    if(!isActive) tick();
  }

  // 起動中
  const tick = () => {
    console.log('tick');
    // frame間の経過時間を計算、変数に加算
    const now = Date.now();
    const diff = now - prevTime.current!;
    counter.current = counter.current + diff / 1000;
    prevTime.current = now;

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

  return (
    <div className='stopwatch'>
        <p className='text'>{(hour!==0) ? ((hour<10) ? "0"+hour+":" : hour+":") : ""}{(minute<10) ? "0"+minute : minute}:{(second<10) ? "0"+second.toFixed(2):second.toFixed(2)}</p>
        <IconButton sx={{border: '1px solid gray',margin:'5%'}} onClick={() => {restartOnClick();}}>
          <RestartAltIcon fontSize='large'/>
        </IconButton>
        <IconButton sx={{border: '1px solid gray',margin:'5%'}} onClick={() => {playOnClick();}}>
            {isActive ?  <StopIcon fontSize='large'/> : <PlayArrowIcon fontSize='large'/>
            }
        </IconButton>
    </div>
  )
}

export default StopWatch