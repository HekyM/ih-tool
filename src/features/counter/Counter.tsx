import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faXmark, faPlus, faGear, faCircle, faCircleXmark, faArrowRight, faCircleExclamation, faRotate,
  faArrowUp, faArrowDown, faCircleChevronRight, faCircleChevronUp,
  faCopy, faPaste, faChevronUp, faChevronDown,
} from '@fortawesome/free-solid-svg-icons'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  addTimer, removeTimer, updateTimer, repeateTimer, moveTimer, timerIndex, reloadTimers,
  addWeekly, removeWeekly, updateWeekly, moveWeekly, weeklyIndex,
  selectCounters,
  WeeklyDays,
  WeeklyOnOff,
  removeTimersStorage,
  copyTimersStorage,
  pasteTimersStorage,
  removeWeekliesStorage,
  copyWeekliesStorage,
  pasteWeekliesStorage,
  Weekly,
  get_event_date,
} from './counterSlice';
import { SpecialEvents } from './events';
import { Icon, ImageSrc } from '../../components/Images';
import { Filter } from '../../components/Filter';
import _ from 'lodash';


const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')

interface TimeDelta {
  positive: boolean;
  days: number; 
  hours: number; 
  minutes: number; 
  seconds: number; 
}

function delta_time(miliseconds: number): TimeDelta {
  var s = Math.abs(miliseconds)

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  s = (s - mins) / 60;
  var hrs = s % 24;
  var days = (s - hrs) / 24

  return {positive: miliseconds >= 0, days: days, hours: hrs, minutes: mins, seconds: secs}
}


function DeltaTimer(props: {delta: TimeDelta}) {
  
  var daysText = props.delta.days !== 0 && props.delta.days + ' days'

  return (
      <span style={{marginLeft: '.5em', marginRight: '.5em'}}>
          {daysText} {zeroPad(props.delta.hours, 2)}:{zeroPad(props.delta.minutes, 2)}:{zeroPad(props.delta.seconds, 2)}
      </span>
  );
}

const tinyImgStyle = {
  display: 'inline-block',
  marginLeft: '.3em',
  marginRight: '.3em',
  marginBottom: '-.35em',
}
const tinyInImgStyle = {
  display: 'inline-block',
  marginLeft: '.1em',
  marginRight: '.1em',
  marginBottom: '-.2em',
}


/*const timeOptions = {
  //weekday: "short" as const,
  hourCycle: 'h23' as const,
  hour: '2-digit' as const,
  minute: '2-digit' as const,
  day: "2-digit" as const,
  month: "short" as const,
  year: "numeric" as const,
};*/

//const months: string[] = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const monthsShort: string[] = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
const daysShort: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function DateTime(t: number) {
  if (t === 0) return ''
  let time = new Date(t)
  //return daysShort[time.getDay()] + '  ' + time.toLocaleString('en-US', timeOptions)
  //return time.toLocaleString('en-US', {'dateStyle': 'medium', 'timeStyle': 'short'});
  return daysShort[time.getDay()] + '  ' + zeroPad(time.getDate(), 2) + "-" + zeroPad(time.getMonth()+1, 2) + "-" + time.getFullYear() + ' ' + zeroPad(time.getHours(), 2) + ':' + zeroPad(time.getMinutes(), 2)
}

const evIcons = ['a-free', 'a-ida', 'a-star', 'a-trial', 'aspen', 'b', 'csg', 'd', 'fw', 'guild', 'm', 'rg', 's-dragon', 's-sl', 'se', 'starland', 'tower', 'va', 'vv', 'w']

function EventTimer() {
  const dispatch = useAppDispatch();
  const counters = useAppSelector(selectCounters);
  const [time, setTime] = useState(Date.now());

  React.useEffect(() => {
      const interval = setInterval(() => setTime(Date.now()), 1000);
      return () => {
          clearInterval(interval);
      };
  }, []);

  const indicatorColor = (delta: TimeDelta) => {
    return !delta.positive
      ? "darkRed" 
      : delta.days === 0 
        ? "#de7e0a" 
        : "green"
  }

  const setModalUpdateIndex = (index: number|null|undefined) => {
    dispatch(timerIndex(index))
  }

  return (
    <>
    <table id='events-timer' className='ihContainer ihDataTable no-footer w-max'>
        <thead>
          <tr className='ihRow'>
            <th>Event</th>
            <th style={{width: '10em'}}>Timer<FontAwesomeIcon icon={faRotate} style={{width: '1em', marginLeft: '1em'}} className='btn-role' title='reload timers' onClick={() => dispatch(reloadTimers())}/></th>
            <th style={{width: '1em'}}>&nbsp;</th>
            <th style={{width: '15em'}}>Time</th>
            <th style={{width: '1.6em'}}><FontAwesomeIcon icon={faPlus} style={{width: '1em'}} className='btn-role' title='add timer' onClick={() => setModalUpdateIndex(null)}/></th>
          </tr>
        </thead>
        <tbody>
        {counters.timers.map((timer,i) => {
          var delta = delta_time(timer.t - time);
          return (
          <tr key={'timer-'+i} className={counters.timerIndex === i? 'selected' : ''}>
            <td style={{textAlign: 'left'}}>
              {timer.t !== 0 ? <FontAwesomeIcon icon={faCircle} style={{color: indicatorColor(delta), marginLeft: '.3em', marginRight: '.3em'}}/> : <FontAwesomeIcon icon={faCircleExclamation} title="missing configuration" style={{marginLeft: '.3em', marginRight: '.3em'}}/>}
              <Icon size="tiny" style={tinyImgStyle} src={ImageSrc.event(timer.i || 'none')}/>
              {timer.dsc}
            </td>
            <td style={{textAlign: 'right'}}>
              {timer.t !== 0 && <DeltaTimer delta={delta}/>}
            </td>
            <td>
              {(timer.type !== 'private' && !delta.positive && !timer.r) && 
                <FontAwesomeIcon icon={faXmark} style={{width: '1em'}} className='btn-role' title='remove timer' onClick={() => dispatch(removeTimer(i))}/>
              }
              {(timer.type !== 'private' && !delta.positive && timer.r !== 0 && timer.rm) && 
                <FontAwesomeIcon icon={faRotate} style={{width: '1em'}} className='btn-role' title='repeat timer' onClick={() => dispatch(repeateTimer(i))}/>
              }
            </td>
            <td style={{textAlign: 'right', paddingRight: '1em'}}>{DateTime(timer.t)}</td>
            <td>
              {timer.type !== 'private' &&
                <FontAwesomeIcon icon={faGear} style={{width: '1em'}} className='btn-role' title='update timer' onClick={() => setModalUpdateIndex(i)}/>
              }
            </td>
          </tr>
        )})}
        </tbody>
    </table>
    </>
  );
}

function calculate_timer(days: number, hours: number, minutes: number, toReset: boolean = false) {
  if (days === 0 && hours === 0 && minutes === 0) {
    return 0
  }

  var reset = new Date();
  reset.setUTCDate(reset.getUTCDate() + days);
  reset.setUTCHours(reset.getUTCHours() + hours)
  reset.setUTCMinutes(reset.getUTCMinutes() + minutes )
  reset.setUTCSeconds(0)
  reset.setMilliseconds(0)

  const lowTrasholdMin = 2;
  const highTrasholdMin = 1440 - lowTrasholdMin;
  const midMin = 720;
  const resetMinutes = reset.getUTCHours()*60 + reset.getUTCMinutes()

  if (toReset || resetMinutes < lowTrasholdMin || resetMinutes > highTrasholdMin) {
    if (resetMinutes > midMin) {
      reset.setUTCDate(reset.getUTCDate() + 1);
    }
    reset.setUTCHours(0)
    reset.setUTCMinutes(0)
  }

  return reset.getTime()
}

function normalize_timer(days: number, hours: number, minutes: number) {
  let m = minutes % 60
  let mh = (minutes - m)/ 60

  hours += mh
  let h = hours % 24
  days = days + (hours - h)/ 24
  
  return [days, h, m]
}

function EventTimerInput(props: {
    daysRef: React.LegacyRef<HTMLInputElement>, 
    hoursRef: React.LegacyRef<HTMLInputElement>, 
    minutesRef: React.LegacyRef<HTMLInputElement>,
    days?: number | undefined,
    hours?: number | undefined,
    minutes?: number | undefined,
  }) {
  return (
    <> 
      <input className='ih-input in-text-input number' aria-label={`add days`}
          placeholder='days'
          type="number" 
          ref={props.daysRef}
          defaultValue={props.days}
      />
      &nbsp; 
      <input className='ih-input in-text-input number' aria-label={`add hours`}
          placeholder='HH'
          type="number" 
          ref={props.hoursRef}
          defaultValue={props.hours}
      />
      :
      <input className='ih-input in-text-input number' aria-label={`add minutes`}
          placeholder='MM'
          type="number" 
          ref={props.minutesRef}
          defaultValue={props.minutes}
      />
    </>
  );
}

function ModalAddUpdateTimer() {
  const dispatch = useAppDispatch();
  const counters = useAppSelector(selectCounters);
  const timer = (counters.timerIndex !== null && counters.timerIndex !== undefined) ? counters.timers[counters.timerIndex] : null
  const [repeatManual, setRepeatManual] = useState(timer?.rm || false)
  const [evIcon, setEvIcon] = useState("")

  const textRef = React.useRef<HTMLInputElement>(null);
  const daysRef = React.useRef<HTMLInputElement>(null);
  const hoursRef = React.useRef<HTMLInputElement>(null);
  const minutesRef = React.useRef<HTMLInputElement>(null);
  const daysRefRepeat = React.useRef<HTMLInputElement>(null);
  const hoursRefRepeat = React.useRef<HTMLInputElement>(null);
  const minutesRefRepeat = React.useRef<HTMLInputElement>(null);

  const hoursRepeat = timer?.r ? Math.trunc(timer.r/3600000) : undefined
  const minutesRepeat = timer?.r ? (timer.r-(hoursRepeat!*3600000))/60000 : undefined

  const onClose = () => {
    dispatch(timerIndex(undefined))
  }

  const repeatManualToggleStyle = {
    display: 'inline-block',
    fontSize: 'small',
    textAlign: 'center' as const,
    borderRadius: '3px',
    border: '2px solid',
    width: '5em',
    marginLeft: '.7em', marginRight: '.7em',
  }

  return (
      <ReactModal
        className='ihContainer ih-modal'
        key={'modal'}
        ariaHideApp={false}
        isOpen={counters.timerIndex !== undefined}
        onRequestClose={() => onClose()}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        style={{
          overlay: {zIndex: 100, backgroundColor: 'rgba(70, 70, 70, 0.5)', },
          content: {width: '20em',}
        }}
        >
        <div>
              <table className='w-max events-dialog'>
                  <thead>
                      <tr>
                          <th colSpan={2}>
                            <h2 style={{float: 'left', margin: '0'}}>Timer</h2>
                            <FontAwesomeIcon icon={faXmark} style={{width: '1em', float: 'right'}} className='btn-role' title='update timer' onClick={() => onClose()}/>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={2}>
                        <Filter items={{undefined: ImageSrc.event('none'), ...Object.fromEntries(evIcons.map(f => [f, ImageSrc.event(f)]))}} 
                              default={timer?.i || 'undefined'} 
                              titles={true}
                              onSelected={(i) => setEvIcon(i)}/>
                      </td>
                    </tr>
                    <tr>
                      <td>Event</td>
                      <td style={{float: 'right'}}>
                        <input className='ih-input in-text-input' aria-label={`add description`} style={{width: '15.43em'}}
                            placeholder='description'
                            ref={textRef}
                            defaultValue={timer?.dsc}
                        />
                      </td>
                    </tr>
                    <tr><td>Timer</td><td style={{float: 'right'}}><EventTimerInput daysRef={daysRef} hoursRef={hoursRef} minutesRef={minutesRef}/></td></tr>
                    <tr><td>Repeat</td><td style={{float: 'right'}}><EventTimerInput daysRef={daysRefRepeat} hoursRef={hoursRefRepeat} minutesRef={minutesRefRepeat} hours={hoursRepeat} minutes={minutesRepeat} /></td></tr>
                    <tr><td>Repeat</td><td style={{float: 'right'}}>
                      <div className='btn-role' onClick={() => setRepeatManual(false)} style={{...repeatManualToggleStyle, backgroundColor: !repeatManual ? '#8eb4db' : 'transparent'}}>Auto</div>
                      <div className='btn-role' onClick={() => setRepeatManual(true)} style={{...repeatManualToggleStyle, backgroundColor: repeatManual ? '#8eb4db' : 'transparent'}}>Manual</div>
                    </td></tr>
                  </tbody>
              </table>
              <div style={{margin: '5px', height: '1.2em'}}>
                  {counters.timerIndex &&
                    <button type="button" className="btn btn-danger" style={{width: '7em'}} 
                            onClick={()=> {
                              dispatch(removeTimer(counters.timerIndex!));
                              onClose();
                            }}>
                        Remove
                    </button>
                  }
                  {counters.timerIndex !== null &&
                    <>
                    <FontAwesomeIcon icon={faArrowUp} style={{width: '1em', float: 'right', marginRight: '.5em', padding: '.27em'}} className='btn btn-role btn-primary' title='move timer up' onClick={() => {
                      dispatch(moveTimer({index: counters.timerIndex!, add: -1}));
                      //onClose();
                    }}/>
                    <FontAwesomeIcon icon={faArrowDown} style={{width: '1em', float: 'right', marginRight: '.5em', padding: '.27em'}} className='btn btn-role btn-primary' title='move timer down' onClick={() => {
                      dispatch(moveTimer({index: counters.timerIndex!, add: +1}));
                      //onClose();
                    }}/>
                    <button type="button" className="btn btn-primary" style={{width: '7em', float: 'right', marginRight: '.5em'}} 
                          onClick={() => {
                            var time = calculate_timer(Number(daysRef.current?.value || 0), Number(hoursRef.current?.value || 0), Number(minutesRef.current?.value || 0))
                            var repeat = Number(daysRefRepeat.current?.value || 0) * 86400000 + Number(hoursRefRepeat.current?.value || 0) * 3600000 + Number(minutesRefRepeat.current?.value || 0)*60000
                            dispatch(updateTimer({
                              index: counters.timerIndex!,
                              timer: {
                                dsc: textRef.current?.value || '',
                                t: time,
                                r: repeat,
                                rm: repeatManual,
                                type: 'custom',
                                i: evIcon,
                              }
                            }));
                            onClose();
                          }}>
                      Update
                    </button>
                    </>
                  }
                  {counters.timerIndex === null &&
                    <button type="button" className="btn btn-primary" style={{width: '7em', float: 'right', marginRight: '.5em'}} 
                          onClick={() => {
                            var time = calculate_timer(Number(daysRef.current?.value || 0), Number(hoursRef.current?.value || 0), Number(minutesRef.current?.value || 0))
                            var repeat = Number(daysRefRepeat.current?.value || 0) * 86400000 + Number(hoursRefRepeat.current?.value || 0) * 3600000 + Number(minutesRefRepeat.current?.value || 0)*60000
                            dispatch(addTimer({
                              dsc: textRef.current?.value || '',
                              t: time,
                              r: repeat,
                              rm: repeatManual,
                              type: 'custom',
                              i: evIcon,
                            }));
                            onClose();
                          }}>
                      Add
                    </button>
                  }
              </div>
          </div>
    </ReactModal>
  )
}

function TimerCalc() {
  const [days, setDays] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const [daysValue, hoursValue, minutesValue] = normalize_timer(days ? Number(days) : 0, hours ? Number(hours) : 0, minutes ? Number(minutes) : 0)
  const time = calculate_timer(daysValue, hoursValue, minutesValue)

  return (
    <div className='ihContainer'>
      <table className='w-max' style={{paddingRight: '2em'}}><tbody><tr>
        <td >
          <input className='ih-input in-text-input number' aria-label={`add days`}
            placeholder='days'
            type="number" 
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
          &nbsp; 
          <input className='ih-input in-text-input number' aria-label={`add hours`}
              placeholder='HH'
              type="number" 
              value={hours}
              onChange={(e) => setHours(e.target.value)}
          />
          :
          <input className='ih-input in-text-input number' aria-label={`add minutes`}
              placeholder='MM'
              type="number" 
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
          />
        </td>
        <td style={{width: '2em'}}><FontAwesomeIcon icon={faArrowRight} style={{width: '1em'}} /></td>
        <td style={{width: '25%'}}><span>{daysValue} days {zeroPad(hoursValue, 2)}:{zeroPad(minutesValue, 2)}:00</span></td>
        <td style={{width: '2em'}}><FontAwesomeIcon icon={faArrowRight} style={{width: '1em'}} /></td>
        <td style={{width: '27%'}}><span>{time !== 0 ? new Date(time).toLocaleString("sv-SE") : new Date().toLocaleString("sv-SE")}</span></td>
      </tr></tbody></table>
    </div>
  );
}

function getToday(now: Date) {
  return (now.getDay() + 6) % 7
} 
function getUTCToday(now: Date) {
  return (now.getUTCDay() + 6) % 7
} 

function WeaklyEvents() {
  const dispatch = useAppDispatch();
  const counters = useAppSelector(selectCounters);

  const _now = new Date()
  const offset = -_now.getTimezoneOffset()// *-1
  //const offset = _now.getTimezoneOffset()// *-1
  const [now, setNow] = useState(_now);

  const colWidth = 55
  const colSpacing = 1
  const colHeight = 30

  const maxWidth = 7 * colWidth
  const maxWidthSpacing = 6 * colSpacing + maxWidth
  const hourWidth = (1/24) * colWidth
  const minuteWidth = (1/1440) * colWidth
  
  const shift = offset/60 * hourWidth 
  const bgStyle = {width: colWidth +'px', height: colHeight + 'px'}
  const bgAStyle = {...bgStyle}
  const bgBStyle = {...bgStyle}
  const bgNoOverflowStyle = {...bgStyle, overflow: 'hidden'}
  //const bgFirstStyle = offset < 0 ? bgNoOverflowStyle : bgStyle
  const bgLastStyle = offset > 0 ? bgNoOverflowStyle : bgStyle
  const barBaseStyle = {
    cursor: 'default',
    width: colWidth +1 +'px', height: colHeight/1.5 -5 + 'px',
    borderBottom: '2px solid #41a2d2', //#8823b3
    backgroundColor: '#41a2d2',
    position: 'relative' as const, zIndex: 5,
    display: 'flex',
  }
  const barStyle = {
    ...barBaseStyle,
    marginLeft: (shift).toFixed(2) + 'px', marginRight: (-shift).toFixed(2) + 'px', 
  }
  const txtStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    fontSize: '0.5em',
    marginTop: '0.3em',
    zIndex: '40',
  }
  
  const nowPos = (now: Date) => {
    var today = getToday(now)
    var nowMinutes = now.getHours() * 60 + now.getMinutes()
    var pos = today * (colWidth + 1) + nowMinutes * minuteWidth 
    //console.log(today, pos, maxWidthSpacing)
    if (pos < 0) pos += maxWidthSpacing
    if (pos > maxWidthSpacing) pos -= maxWidthSpacing
    //console.log('>', pos - posWidth/2)
    return pos
  }

  const eventsCount = counters.weeklies.length
  const posWidth = 20
  const posStyle = {
    width: posWidth + 'px', position: 'relative' as const, zIndex: 10,
    height: eventsCount * colHeight +'px', 
    marginTop: -eventsCount * colHeight + 'px',
    marginBottom: colHeight + 'px',
  }
  const eventResetWidth = 10
  const eventResetStyle = {
    width: posWidth + 'px', position: 'relative' as const, zIndex: 11,
    height: (eventsCount +1) * colHeight +'px', 
    marginTop: -(eventsCount +1) * colHeight + 'px',
    marginBottom: colHeight + 'px',
    marginLeft: (nowPos(get_event_date()) - posWidth/2) + 'px',
  }
  
  const eventColor = (now: Date, data: number[], next: number) => {
    var today = getUTCToday(now)
    if (data[today] === 0) return 'gray'
    if (today > 6) {
      return (next === 0) ? '#de7e0a' : 'green'
    } else {
      return (data[(today+1)%7] === 0) ? '#de7e0a' : 'green'
    }
  }

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => {
        clearInterval(interval);
    };
  }, []);

  const setModalUpdateIndex = (index: number|null|undefined) => {
    dispatch(weeklyIndex(index))
  }

  const eventDaysTitle = (event: Weekly): string|undefined => {
    if(event.d[getUTCToday(now)] === 0 && event.on !== undefined) return event.settings.dsc + ': Start in ' + event.on + ' days'
    if(event.d[getUTCToday(now)] !== 0 && event.off !== undefined) return event.settings.dsc + ': End in ' + event.off + ' days'
    return undefined
  }
  
  //console.log('offset', offset)
 
  return (
    <>
    <table id='weakly-events' className='ihContainer ihTable spaced-table w-max' cellPadding="0">
        <thead>
          <tr className='ihRow'>
            <th></th>
            <th style={{width: 0}}></th>
            <th style={bgAStyle}>Mon</th>
            <th style={bgBStyle}>Tue</th>
            <th style={bgAStyle}>Wed</th>
            <th style={bgBStyle}>Thu</th>
            <th style={bgAStyle}>Fri</th>
            <th style={bgBStyle}>Sat</th>
            <th style={bgAStyle}>Sun</th>
            <th style={{...bgAStyle, color: 'gray'}}>Mon</th>
            <th style={{...bgBStyle, color: 'gray'}}>Tue</th>
            <th style={{...bgAStyle, color: 'gray'}}>Wed</th>
            <th style={{...bgBStyle, color: 'gray'}}>Thu</th>
            <th style={{...bgAStyle, color: 'gray'}}>Fri</th>
            <th style={{...bgBStyle, color: 'gray'}}>Sat</th>
            <th style={{...bgAStyle, color: 'gray'}}>Sun</th>
            <th style={{width: 0}}></th>
            <th style={{width: "1.6em"}}><FontAwesomeIcon icon={faPlus} style={{width: '1em'}} className='btn-role' title='add event' onClick={() => setModalUpdateIndex(null)}/></th>
          </tr>
        </thead>
        <tbody>
          {counters.weeklies.map((event, i) => 
            <tr key={'we-' + i} className={counters.weekliesIndex === i? 'selected' : ''} style={{textAlign: 'left'}}>
              <td style={{textAlign: 'left'}}>
                <div style={{position: 'relative', marginRight: '-2px', zIndex: 41, backgroundColor: '#ecdfbf'}}>
                {(_.has(event.settings, 't') && (event.settings as WeeklyOnOff).t === 0 )
                  ? <FontAwesomeIcon icon={faCircleExclamation} title="missing configuration" style={{marginLeft: '.3em', marginRight: '.3em'}}/>
                  : <FontAwesomeIcon icon={faCircle} style={{color: eventColor(now, event.d, event.next), marginLeft: '.3em', marginRight: '.3em'}} title={eventDaysTitle(event)}/>
                }
                
                <Icon size="tiny" style={tinyImgStyle} title={event.settings.dsc} src={ImageSrc.event(event.settings.i || 'none')}/>
                {/*
                <span>{event.settings.dsc}</span>
                */}
                </div>
              </td>
              <td style={{width: 0}}>{(event.prev !== 0 && shift > 0) && <div className='ev-bar' title={event.settings.dsc} style={{...barStyle, borderColor: event.prev === 1 ? '#41a2d2':'#8823b3', width: shift + 'px', marginLeft: colSpacing +'px', marginRight: -shift +'px'}}>&nbsp;</div>}</td>
              {event.d.map((id, i) => 
                <td key={i} style={i === 13 ? bgLastStyle : bgStyle}>{
                  event.d[i] !== 0 && 
                    <div className='ev-bar' title={event.settings.dsc} style={{...barStyle, zIndex: 40-i, borderColor: event.d[i] === 1 ? '#41a2d2':'#8823b3'}}>
                      {(event.d[i-1] === 0 || i === 0) &&
                        <>
                        <Icon size="xt" style={tinyInImgStyle} src={ImageSrc.event(event.settings.i || 'none')}/>
                        <span style={{...txtStyle}}>{event.settings.dsc}</span>
                        </>
                      }</div>
                  }
                </td>
              )}
              {/*
              <td style={bgStyle}>{event.d[0] !== 0 && <div className='ev-bar' title={event.settings.dsc} style={{...barStyle, borderColor: event.d[0] === 1 ? '#41a2d2':'#8823b3'}}><Icon size="xt" style={tinyInImgStyle} src={ImageSrc.event(event.settings.i || 'none')}/><span style={{...txtStyle}}>{event.settings.dsc}</span></div>}</td>
              <td style={bgStyle}>{event.d[1] !== 0 && <div className='ev-bar' title={event.settings.dsc} style={{...barStyle, borderColor: event.d[1] === 1 ? '#41a2d2':'#8823b3'}}>&nbsp;</div>}</td>
              <td style={bgStyle}>{event.d[2] !== 0 && <div className='ev-bar' title={event.settings.dsc} style={{...barStyle, borderColor: event.d[2] === 1 ? '#41a2d2':'#8823b3'}}>&nbsp;</div>}</td>
              <td style={bgStyle}>{event.d[3] !== 0 && <div className='ev-bar' title={event.settings.dsc} style={{...barStyle, borderColor: event.d[3] === 1 ? '#41a2d2':'#8823b3'}}>&nbsp;</div>}</td>
              <td style={bgStyle}>{event.d[4] !== 0 && <div className='ev-bar' title={event.settings.dsc} style={{...barStyle, borderColor: event.d[4] === 1 ? '#41a2d2':'#8823b3'}}>&nbsp;</div>}</td>
              <td style={bgStyle}>{event.d[5] !== 0 && <div className='ev-bar' title={event.settings.dsc} style={{...barStyle, borderColor: event.d[5] === 1 ? '#41a2d2':'#8823b3'}}>&nbsp;</div>}</td>
              <td style={bgStyle}>{event.d[6] !== 0 && <div className='ev-bar' title={event.settings.dsc} style={{...barStyle, borderColor: event.d[6] === 1 ? '#41a2d2':'#8823b3'}}>&nbsp;</div>}</td>
              <td style={{width: 0}}>{(event.next !== 0 && shift < 0) && <div className='ev-bar' title={event.settings.dsc} style={{...barStyle, borderColor: event.next === 1 ? '#41a2d2':'#8823b3', width: -shift + 'px', marginLeft: shift - colSpacing +'px', marginRight: colSpacing +'px'}}>&nbsp;</div>}</td>
              */}
              <td>
                <div style={{position: 'relative', marginLeft: '-1px', marginRight: '-1px', zIndex: 41, backgroundColor: '#ecdfbf', width: 'fit-content'}}>
                <FontAwesomeIcon icon={faGear} className='btn-role' style={{marginLeft: '.3em', marginRight: '.3em'}} onClick={() => setModalUpdateIndex(i)}/>
                </div>
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
            <tr>
              <td style={{height: '1px'}}>&nbsp;</td>
              <td style={{width: 0}}></td>
              <td style={{height: '1px'}} colSpan={7}>
                <div style={{marginLeft: (nowPos(now) - posWidth/2) + 'px', ...posStyle}}>
                  <div style={{width: '4px', backgroundColor: 'currentColor', height: eventsCount * colHeight + 5 + 'px', marginLeft: 'auto', marginRight: 'auto', marginTop: '-10px', marginBottom: '-10px'}}>&nbsp;</div>
                  <FontAwesomeIcon icon={faCircleChevronUp} style={{width: posWidth + 'px'}} />
                </div>
              </td>
              <td style={{width: 0}}></td>
              <td></td>
            </tr>
            <tr>
              <td style={{height: '1px'}}>&nbsp;</td>
              <td style={{width: 0}}></td>
              <td style={{height: '1px'}} colSpan={7}>
                <div style={eventResetStyle}>
                  <div style={{color: 'DarkRed', width: '3px', backgroundColor: 'currentColor', height: eventsCount * colHeight + 5 + 'px', marginLeft: 'auto', marginRight: 'auto', marginTop: '-10px', marginBottom: '-10px'}}>&nbsp;</div>
                  <FontAwesomeIcon icon={faCircleXmark} style={{width: eventResetWidth + 'px', color: 'DarkRed'}} />
                </div>
              </td>
              <td style={{width: 0}}></td>
              <td></td>
            </tr>
        </tfoot>
    </table>
    </>
  );
}

function SettingsWeeklyDays(props: {
  weekly: WeeklyDays|null,
  callback: (func: () => WeeklyDays) => void,
}) {

  const [day0, setDay0] = useState(props.weekly?.d[0] || 0);
  const [day1, setDay1] = useState(props.weekly?.d[1] || 0);
  const [day2, setDay2] = useState(props.weekly?.d[2] || 0);
  const [day3, setDay3] = useState(props.weekly?.d[3] || 0);
  const [day4, setDay4] = useState(props.weekly?.d[4] || 0);
  const [day5, setDay5] = useState(props.weekly?.d[5] || 0);
  const [day6, setDay6] = useState(props.weekly?.d[6] || 0);

  const textRef = React.useRef<HTMLInputElement>(null);

  const dayStyle = {
    width: '3em',
    margin: '3px',
    fontSize: 'small',
    textAlign: 'center' as const,
    borderRadius: '3px',
    border: '2px solid',
    display: 'inline-block'
  }

  const get = ():WeeklyDays => {
    return {dsc: textRef.current?.value || "--", d:[day0,day1,day2,day3,day4,day5,day6]}
  } 

  props.callback(get)

  return (
    <table className='w-max'>
      <thead>
          <tr>
            <th style={{width: '5em'}}></th>
            <th></th>
          </tr>
        </thead>
      <tbody>
        <tr>
          <td>Event</td>
          <td>
            <input className='ih-input in-text-input' aria-label={`add description`} style={{width: '19.43em', margin: 0}}
                placeholder='description'
                ref={textRef}
                defaultValue={props.weekly?.dsc}
            />
          </td>
        </tr>
        <tr>
          <td>Days</td>
          <td>
            <div className='btn-role' onClick={() => setDay0(day0 ? 0 : 1)} style={{...dayStyle, backgroundColor: day0 ? '#8eb4db' : 'transparent'}}>Mon</div>
            <div className='btn-role' onClick={() => setDay1(day1 ? 0 : 1)} style={{...dayStyle, backgroundColor: day1 ? '#8eb4db' : 'transparent'}}>Tue</div>
            <div className='btn-role' onClick={() => setDay2(day2 ? 0 : 1)} style={{...dayStyle, backgroundColor: day2 ? '#8eb4db' : 'transparent'}}>Wed</div>
            <div className='btn-role' onClick={() => setDay3(day3 ? 0 : 1)} style={{...dayStyle, backgroundColor: day3 ? '#8eb4db' : 'transparent'}}>Thu</div>
            <div className='btn-role' onClick={() => setDay4(day4 ? 0 : 1)} style={{...dayStyle, backgroundColor: day4 ? '#8eb4db' : 'transparent'}}>Fri</div>
            <div className='btn-role' onClick={() => setDay5(day5 ? 0 : 1)} style={{...dayStyle, backgroundColor: day5 ? '#8eb4db' : 'transparent'}}>Sat</div>
            <div className='btn-role' onClick={() => setDay6(day6 ? 0 : 1)} style={{...dayStyle, backgroundColor: day6 ? '#8eb4db' : 'transparent'}}>Sun</div>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

function SettingsWeeklyOnOff(props: {
  weekly: WeeklyOnOff|null,
  callback: (func: () => WeeklyOnOff) => void,
}) {

  const [timerType, setTimerType] = useState('off');

  const textRef = React.useRef<HTMLInputElement>(null);
  const daysRef = React.useRef<HTMLInputElement>(null);
  const hoursRef = React.useRef<HTMLInputElement>(null);
  const minutesRef = React.useRef<HTMLInputElement>(null);
  const onRef = React.useRef<HTMLInputElement>(null);
  const signRef = React.useRef<HTMLInputElement>(null);
  const offRef = React.useRef<HTMLInputElement>(null);

  const onoffStyle = {
    paddingLeft: '.3em', paddingRight: '.3em',
    paddingTop: '.2em', paddingBottom: '.2em',
    borderRadius: '3px',
    marginBottom: '-.2em',
  }

  const get = ():WeeklyOnOff => {
    let time = calculate_timer(Number(daysRef.current?.value || 0), Number(hoursRef.current?.value || 0), Number(minutesRef.current?.value || 0), true)
    if (timerType === 'on') {
      time -= (Number(onRef.current?.value) || 0) * 86400000
    }
    return {
      dsc: textRef.current?.value || "--", 
      t: time, 
      on: Number(onRef.current?.value) || 0, 
      sign: Number(signRef.current?.value) || 0, 
      off: Number(offRef.current?.value) || 0, 
    }
  } 

  props.callback(get)

  return (
    <table className='w-max'>
      <thead>
          <tr>
            <th style={{width: '4.94em'}}></th>
            <th></th>
          </tr>
        </thead>
      <tbody>
        <tr><td>Event</td>
        <td>
          <input className='ih-input in-text-input' aria-label={`add description`} style={{width: '19.43em', margin: 0}}
              placeholder='description'
              ref={textRef}
              defaultValue={props.weekly?.dsc}
          />
        </td></tr>
        <tr><td>Timer</td>
        <td>
          <FontAwesomeIcon className='btn-role' icon={faCircle} style={{backgroundColor: timerType !== 'on'? '#8eb4db': 'transparent', ...onoffStyle}} title='Inactive (Timer to Start)' onClick={() => setTimerType('off')}/>
          <FontAwesomeIcon className='btn-role' icon={faCircle} style={{backgroundColor: timerType === 'on'? '#8eb4db': 'transparent', color: 'green', ...onoffStyle}} title='Active (Timer to End)' onClick={() => setTimerType('on')}/>
          <EventTimerInput daysRef={daysRef} hoursRef={hoursRef} minutesRef={minutesRef}/>
        </td></tr>
        <tr><td>Cycles</td>
          <td>
            <FontAwesomeIcon icon={faCircle} style={{color: 'green', marginLeft: '.3em'}} title='Active'/>
            <input className='ih-input in-text-input' aria-label={`add description`} style={{width: '4em'}}
                  placeholder='days'
                  ref={onRef}
                  defaultValue={props.weekly?.on}
              />

            <FontAwesomeIcon icon={faCircle} style={{color: '#8823b3', marginLeft: '.3em'}} title='Prep (in Active)'/>
            <input className='ih-input in-text-input' aria-label={`add description`} style={{width: '4em'}}
                  placeholder='days'
                  ref={signRef}
                  defaultValue={props.weekly?.sign}
              />

            <FontAwesomeIcon icon={faCircle} style={{marginLeft: '.3em'}} title='Inactive'/>
            <input className='ih-input in-text-input' aria-label={`add description`} style={{width: '4em'}}
                  placeholder='days'
                  ref={offRef}
                  defaultValue={props.weekly?.off}
              />
          </td>
        </tr>
      </tbody>
    </table>
  )
}

function ModalAddUpdateWeekly() {
  const dispatch = useAppDispatch();
  const counters = useAppSelector(selectCounters);
  const weekly = (counters.weekliesIndex !== null && counters.weekliesIndex !== undefined) ? counters.weeklies[counters.weekliesIndex].settings : null

  const [activeTab, setActiveTab] = useState('weeklies');
  const [evIcon, setEvIcon] = useState("")

  interface callbackWeeklyDays {
    current: (() => WeeklyDays)|null;
  }
  const settingsWeeklyDays: callbackWeeklyDays = {current: null}

  interface callbackWeeklyOnOff {
    current: (() => WeeklyOnOff)|null;
  }
  const settingsWeeklyOnOff: callbackWeeklyOnOff = {current: null}

  const tabStyle = {
    width: '47%',
    margin: '3px',
    textAlign: 'center' as const,
    borderRadius: '3px',
    border: '2px solid',
    display: 'inline-block'
  }

  const onClose = () => {
    dispatch(weeklyIndex(undefined))
  }

  return (
      <ReactModal
        className='ihContainer ih-modal'
        key={'modal'}
        ariaHideApp={false}
        isOpen={counters.weekliesIndex !== undefined}
        onRequestClose={() => onClose()}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        style={{
          overlay: {zIndex: 100, backgroundColor: 'rgba(70, 70, 70, 0.5)', },
          content: {width: '24.1em',}
        }}
        >
        <div>
              <table className='w-max'>
                  <thead>
                      <tr>
                          <th>
                            <h2 style={{float: 'left', margin: '0'}}>Weekly</h2>
                            <FontAwesomeIcon icon={faXmark} style={{width: '1em', float: 'right'}} className='btn-role' title='update timer' onClick={() => onClose()}/>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={2}>
                        <Filter items={{undefined: ImageSrc.event('none'), ...Object.fromEntries(evIcons.map(f => [f, ImageSrc.event(f)]))}} 
                              default={weekly?.i || 'undefined'} 
                              titles={true}
                              onSelected={(i) => setEvIcon(i)}/>
                      </td>
                    </tr>
                    {weekly === null &&
                    <tr>
                      <td>
                        <div className='btn-role' onClick={() => setActiveTab('weeklies')} style={{...tabStyle, backgroundColor: activeTab === 'weeklies'? '#8eb4db': 'transparent'}}>weeklies</div>
                        <div className='btn-role' onClick={() => setActiveTab('repeating')} style={{...tabStyle, backgroundColor: activeTab !== 'weeklies'? '#8eb4db': 'transparent'}}>repeating</div>
                      </td>
                    </tr>
                    }
                    {((weekly === null && activeTab === 'weeklies') || (weekly && _.has(weekly, 'd'))) &&
                    <tr>
                      <td>
                        <SettingsWeeklyDays weekly={(weekly && _.has(weekly, 'd')) ? weekly as WeeklyDays : null} callback={(func) => settingsWeeklyDays.current = func}/>
                      </td>
                    </tr>
                    }
                    {((weekly === null && activeTab !== 'weeklies') || (weekly && _.has(weekly, 't')))  &&
                    <tr>
                      <td>
                        <SettingsWeeklyOnOff weekly={(weekly && _.has(weekly, 't')) ? weekly as WeeklyOnOff : null} callback={(func) => settingsWeeklyOnOff.current = func}/>
                      </td>
                    </tr>
                    }
                  </tbody>
              </table>
              <div style={{margin: '5px', height: '1.2em'}}>
                  {weekly !== null &&
                    <button type="button" className="btn btn-danger" style={{width: '9em'}} 
                            onClick={()=> {
                              dispatch(removeWeekly(counters.weekliesIndex!));
                              onClose();
                            }}>
                        Remove
                    </button>
                  }
                  {weekly !== null &&
                    <>
                    <FontAwesomeIcon icon={faArrowUp} style={{width: '1em', float: 'right', marginRight: '.5em', padding: '.27em'}} className='btn btn-role btn-primary' title='move weekly up' onClick={() => {
                      dispatch(moveWeekly({index: counters.weekliesIndex!, add: -1}));
                      //onClose();
                    }}/>
                    <FontAwesomeIcon icon={faArrowDown} style={{width: '1em', float: 'right', marginRight: '.5em', padding: '.27em'}} className='btn btn-role btn-primary' title='move weekly down' onClick={() => {
                      dispatch(moveWeekly({index: counters.weekliesIndex!, add: +1}));
                      //onClose();
                    }}/>
                    <button type="button" className="btn btn-primary" style={{width: '9em', float: 'right', marginRight: '.5em'}} 
                          onClick={() => {
                            if (_.has(weekly, 'd')) {
                              //console.log(props.index, settingsWeeklyDays.current!())
                              dispatch(updateWeekly({index: counters.weekliesIndex!, settings: {...settingsWeeklyDays.current!(), i: evIcon}}));
                            } else {
                              //console.log(props.index, settingsWeeklyOnOff.current!())
                              dispatch(updateWeekly({index: counters.weekliesIndex!, settings: {...settingsWeeklyOnOff.current!(), i: evIcon}}));
                            }
                            onClose();
                          }}>
                      Update
                    </button>
                    </>
                  }
                  {counters.weekliesIndex === null &&
                    <button type="button" className="btn btn-primary" style={{width: '9em', float: 'right', marginRight: '.5em'}} 
                          onClick={() => {
                            if (activeTab === 'weeklies') {
                              //console.log(props.index, settingsWeeklyDays.current!())
                              dispatch(addWeekly({...settingsWeeklyDays.current!(), i: evIcon}));
                            } else {
                              //console.log(props.index, settingsWeeklyOnOff.current!())
                              dispatch(addWeekly({...settingsWeeklyOnOff.current!(), i: evIcon}));
                            }
                            onClose();
                          }}>
                      Add
                    </button>
                  }
              </div>
          </div>
    </ReactModal>
  )
}

function WeeklyEventsTable() {
  /* events
    FF, PO, heroic miracle, gala+session
    WC, Sky lab, Mysterious Chest
    HS (trans)
    imp + shelter + drop 
  */

  return (
    <>
    <table className='ihContainer ihDataTable no-footer w-max' cellPadding="0">
    <tbody>
          <tr>
            <td style={{textAlign: 'left'}}>  
              <Icon title="Prophet Summon" size="tiny" style={tinyImgStyle} src={ImageSrc.resources('po')}/>
              <span>Prophet Summon</span>
            </td>
            <td style={{textAlign: 'left'}}>
              <Icon title="Fantasy Factory" size="tiny" style={tinyImgStyle} src={ImageSrc.resources('ff')}/>
              <span>Fantasy Factory</span>
            </td>
            <td style={{textAlign: 'left'}}> 
              <Icon title="Heroic Miracle" size="tiny" style={tinyImgStyle} src={ImageSrc.shard('any', false, [6])}/>
              <span>Heroic Miracle</span>
            </td>
            <td style={{textAlign: 'left'}}> 
              <Icon title="Awakening Gala" size="tiny" style={tinyImgStyle} src={ImageSrc.resources('csg')}/>
              <span>Awakening Gala</span>
            </td>
          </tr>
          <tr>
            <td style={{textAlign: 'left'}}>
              <Icon title="Wishing Fountain" size="tiny" style={tinyImgStyle} src={ImageSrc.resources('wc')}/>
              <span>Wishing Fountain</span>
            </td>
            <td style={{textAlign: 'left'}}> 
              <Icon title="Sky Labyrinth" size="tiny" style={tinyImgStyle} src={ImageSrc.resources('pickaxe')}/>
              <span>Sky Labyrinth</span>
            </td>
            <td style={{textAlign: 'left'}}> 
              <Icon title="Mysterious Chest" size="tiny" style={tinyImgStyle} src={ImageSrc.resources('gems')}/>
              <span>Mysterious Chest</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td style={{textAlign: 'left'}}>
              <Icon title="Heroic Summon" size="tiny" style={tinyImgStyle} src={ImageSrc.resources('hs')}/>
              <span>Heroic Summon</span>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td style={{textAlign: 'left'}}>
              <Icon title="Imp's Adventure" size="tiny" style={tinyImgStyle} src={ImageSrc.raw("layout/imp-dice")}/>
              <span>Imp's Adventure</span>
            </td>
            <td style={{textAlign: 'left'}}> 
              <Icon title="Shelter Heroes" size="tiny" style={tinyImgStyle} src={ImageSrc.shard('any', false, [4])}/>
              <span>Shelter Heroes</span>
            </td>
            <td style={{textAlign: 'left'}}> 
              <Icon title="Campaign Drop" size="tiny" style={tinyImgStyle} src={ImageSrc.resources('universal-crystal')}/>
              <span>Campaign Drop</span>
            </td>
            <td></td>
          </tr>
        </tbody>
    </table>
    </>
  );
}

function SpecialEventsTable() {
  const days: number[] = Object.entries(SpecialEvents).map(([name, data]) => data.days).filter(i => i !== undefined) as number[]
  const next = Math.min(...days, 999)
  const sorted = Object.entries(SpecialEvents).sort(function([a, av],[b, bv]){return (av.month! - bv.month!)*100+av.day! - bv.day!})
  return (
    <>
    <table id='special-events' className='ihContainer ihDataTable no-footer w-max' cellPadding="0">
    <tbody>
          {sorted.map(([name, data], i) =>
            <tr key={'wes-' + i}>
              <td  style={{width: '2em'}}>
                <span>{data.days === next && <FontAwesomeIcon icon={faCircleChevronRight} style={{width: '1.5em'}}/>}</span>
              </td>
              <td style={{width: '7em', textAlign: 'right'}}>
                <span style={{textAlign: 'right', marginRight: '2em'}}>{data.days} days</span>
              </td>
              <td style={{textAlign: 'left'}}>
                <span>{name}</span>
              </td>
              <td style={{textAlign: 'right'}}>
                <span>{data.day !== undefined && data.day}</span>
              </td>
              <td>
                <span>{data.month !== undefined && monthsShort[data.month]}</span>
              </td>
              <td style={{textAlign: 'left'}}>
                <span>{data.year !== undefined && data.year}</span>
              </td>
              <td>
                <span>{data.dsc}</span>
              </td>
            </tr>
          )}
        </tbody>
    </table>
    </>
  );
}

function CountersSettings() {
  const [isVisible, setIsVisible] = useState(false);

  const removeTimers = () => {
    if (window.confirm('Are You sure?') === true) {
      removeTimersStorage();
      window.location.reload();
    }
  }
  const copyTimers = () => {
    navigator.clipboard.writeText(copyTimersStorage() || ""); 
    alert("Copied");
  }
  async function  pasteTimers() {
    pasteTimersStorage(await navigator.clipboard.readText()); 
    window.location.reload();
  }
  const removeWeeklies = () => {
    if (window.confirm('Are You sure?') === true) {
      removeWeekliesStorage();
      window.location.reload();
    }
  }
  const copyWeeklies = () => {
    navigator.clipboard.writeText(copyWeekliesStorage() || ""); 
    alert("Copied");
  }
  async function pasteWeeklies() {
    pasteWeekliesStorage(await navigator.clipboard.readText()); 
    window.location.reload();
  }
  const iconStyle = {
    padding: '.2em',
    paddingBottom: '0',
  }

  return (
    <div  className='ihContainer' >
      <span  className='btn-role' onClick={() => setIsVisible(!isVisible)}>
        <FontAwesomeIcon icon={faGear} style={{width: '2em'}}/>
        Settings
        <FontAwesomeIcon icon={isVisible ? faChevronUp : faChevronDown} style={{width: '2em'}} />
      </span>
      {isVisible && 
        <div style={{padding: '1em'}}>
          <button type="button" className="btn btn-danger" style={{width: '7em'}} onClick={removeTimers} title="Reset Timers Data">
              <FontAwesomeIcon icon={faXmark} style={iconStyle}/> Timers
          </button>
          <button type="button" className="btn btn-primary" style={{width: '7em'}} onClick={copyTimers} title="Copy Timers Data">
              <FontAwesomeIcon icon={faCopy} style={iconStyle}/> Timers
          </button>
          <button type="button" className="btn btn-primary" style={{width: '7em'}}  onClick={pasteTimers} title="Paste Timers Data">
              <FontAwesomeIcon icon={faPaste} style={iconStyle}/> Timers
          </button>
          <button type="button" className="btn btn-danger" style={{width: '7em'}} onClick={removeWeeklies} title="Reset Weeklies Data">
              <FontAwesomeIcon icon={faXmark} style={iconStyle}/> Weeklies
          </button>
          <button type="button" className="btn btn-primary" style={{width: '7em'}} onClick={copyWeeklies} title="Copy Weeklies Data">
              <FontAwesomeIcon icon={faCopy} style={iconStyle}/> Weeklies
          </button>
          <button type="button" className="btn btn-primary" style={{width: '7em'}}  onClick={pasteWeeklies} title="Paste Weeklies Data">
              <FontAwesomeIcon icon={faPaste} style={iconStyle}/> Weeklies
          </button>
        </div>
      }
    </div>
    );
}

export function Counter() {
  return (
    <div>
      <div className='ihContainer w-max'>
        <div className='ihContainer'>
          <img src={ImageSrc.raw('icon')}  alt='Idle Heroes'          style={{display: 'inline-block', height: '72px', width: 'auto', marginBottom: '45px', marginRight: '45px'}}/>
          <img src={ImageSrc.raw('logo')}  alt='Idle Heroes'          style={{display: 'inline-block', height: '171px', width: 'auto'}}/>
          <img src={ImageSrc.raw('favicon')}  alt='Idle Heroes Tools' style={{display: 'inline-block', height: '72px', width: 'auto', marginBottom: '45px', marginLeft: '45px'}}/>
        </div>
        <TimerCalc/>
        <EventTimer/>
        <WeaklyEvents/>
        <ModalAddUpdateTimer/>
        <ModalAddUpdateWeekly />
        <WeeklyEventsTable />
        <SpecialEventsTable/>
        <CountersSettings/>
      </div>
    </div>
  );
}
