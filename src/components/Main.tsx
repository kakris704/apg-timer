import React, { useState } from 'react'
import './main.css'
import { BottomNavigation, BottomNavigationAction, Container, IconButton, Paper } from '@mui/material'
import StopWatch from './StopWatch/StopWatch'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import TImer from './Timer/TImer';

const Main = () => {

  const [isSwitch, setIsSwitch] = useState<boolean>(false);

  return (
    <div className='main'>
        <Container maxWidth='xs' sx={{height:'100vh', display:'flex', alignItems:'center'}} disableGutters>
            <Paper elevation={5} sx={{width:'100%',aspectRatio:'8/12', margin:'auto', borderRadius:3, textAlign:'center', position:'relative'}}>
                <IconButton onClick={() => {
                  setIsSwitch(prev => !prev);
                }} sx={{position:'absolute', right:0}}>
                  {isSwitch ? <AvTimerIcon /> : <AccessAlarmIcon />}
                </IconButton>
                {isSwitch ? <TImer /> : <StopWatch />}
            </Paper>
        </Container>
    </div>
  )
}

export default Main