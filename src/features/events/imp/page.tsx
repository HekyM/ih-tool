import React, { useState, useLayoutEffect, useRef } from 'react';
import { Icon, ImageSrc } from '../../../components/Images';
import { Filter } from '../../../components/Filter';
import { ModalNumpad } from '../../../components/Numpad';
import ImageMapper from 'react-img-mapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import ReactModal from 'react-modal';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import {
    input, impInput
} from './slice';



function ImpInput(props: {
    id: string, title: string, src: string,
    top: number, left: number, 
    initial: number, min: number, max: number, strict: boolean,
    onClick?: (value: number) => void;
    //onChanged: (value: number) => void;
}) {
    const style = {
        img: {width: '56px', left: `${props.left + 2}px`, top: `${props.top}px`, zIndex: "20", cursor: 'pointer'},
        input: {width: '56px', left: `${props.left}px`, top: `${props.top + 64}px`, zIndex: "20"},
        minus: {left: `${props.left}px`, top: `${props.top + 100}px`, zIndex: "20", cursor: 'pointer'},
        plus: {left: `${props.left + 34}px`, top: `${props.top + 100}px`, zIndex: "20", cursor: 'pointer'},
    }

    const value = useAppSelector(impInput(props.id));
    const dispatch = useAppDispatch();

    const setValue = (val: number) => {
        dispatch(input({id: props.id, value: val}))
    }

    const imgClick = () => {
        if (props.onClick) 
            props.onClick(value)
        else 
            plus(true) || setValue(props.min)
    }
    const minus = (): boolean => {
        if (value > props.min) {
            setValue(value-1)
            return true
        }
        return false
    }
    const plus = (strict: boolean = props.strict): boolean => {
        if (!strict || value < props.max) {
            setValue(value+1)
            return true
        }
        return false
    }
    const edit = (val: number) => {
        if (props.strict) {
            if (val > props.max) setValue(props.max)
            else if (val < props.min) setValue(props.min)
            else setValue(val)
        } else {
            setValue(val)
        }
    }

    return (
        <div>
            <img 
                className="imp-center clickable imp-circle floating-overlay" 
                src={props.src}
                onClick={() => imgClick()} 
                style={style.img}
                alt={props.title}
            />
            <input className="imp-input floating-overlay" id={props.id} title={props.title} type="number" value={value} style={style.input} onChange={(e) => edit(Number(e.target.value))}/>
            <img className="imp-plus-minus imp-center floating-overlay" 
                src={ImageSrc.layout('imp-minus')}
                onClick={() => minus()} 
                style={style.minus}
                alt='minus'/>
            <img className="imp-plus-minus imp-center floating-overlay"
                src={ImageSrc.layout('imp-plus')}
                onClick={() => plus()} 
                style={style.plus}
                alt='plus'/>
        </div>
    )

}


function Map(props: {onStart: () => void}) {

    const [modalDiceIsOpen, setModalDiceIsOpen] = useState(false);
    const [modalStartIsOpen, setModalStarsIsOpen] = useState(false);

    const impPos = useAppSelector(impInput('startPos'));
    const impTarot = useAppSelector(impInput('activeTarot'));
    const dispatch = useAppDispatch();

    const inputsTop = 220
    const map = [
        { shape:"rect", id:"imp-pos-00", coords:[0,0,100,100]    , title:"Start"},
        { shape:"rect", id:"imp-pos-01", coords:[0,100,100,200]  , title:"Spirit Workshop 1"},
        { shape:"rect", id:"imp-pos-02", coords:[100,100,200,200], title:"Promotion Stone Workshop 1"},
        { shape:"rect", id:"imp-pos-03", coords:[200,100,300,200], title:"Magic Dust Workshop 1"},
        { shape:"rect", id:"imp-pos-04", coords:[200,0,300,100]  , title:"Starry Mushroom 1"},
        { shape:"rect", id:"imp-pos-05", coords:[300,0,400,100]  , title:"Wishing Hut"},
        { shape:"rect", id:"imp-pos-06", coords:[400,0,500,100]  , title:"3-Star Hero Workshop"},
        { shape:"rect", id:"imp-pos-07", coords:[400,100,500,200], title:"Spirit Workshop 2"},
        { shape:"rect", id:"imp-pos-08", coords:[500,100,600,200], title:"Monster Soul Workshop"},
        { shape:"rect", id:"imp-pos-09", coords:[600,100,700,200], title:"Magic Dust Workshop 2"},
        { shape:"rect", id:"imp-pos-10", coords:[600,200,700,300], title:"Fortune Hut"},
        { shape:"rect", id:"imp-pos-11", coords:[600,300,700,400], title:"Starry Mushroom 2"},
        { shape:"rect", id:"imp-pos-12", coords:[600,400,700,500], title:"Promotion Stone Workshop 2"},
        { shape:"rect", id:"imp-pos-13", coords:[500,400,600,500], title:"5-Star Hero Workshop"},
        { shape:"rect", id:"imp-pos-14", coords:[400,400,500,500], title:"Spirit Workshop 3"},
        { shape:"rect", id:"imp-pos-15", coords:[300,400,400,500], title:"Karma Hut"},
        { shape:"rect", id:"imp-pos-16", coords:[200,400,300,500], title:"Magic Dust Workshop 3"},
        { shape:"rect", id:"imp-pos-17", coords:[100,400,200,500], title:"4-Star Hero Workshop"},
        { shape:"rect", id:"imp-pos-18", coords:[0,400,100,500]  , title:"Starry Mushroom 3"},
        { shape:"rect", id:"imp-pos-19", coords:[0,300,100,400]  , title:"Chaos Stone Workshop"},
        { shape:"rect", id:"imp-pos-20", coords:[0,200,100,300]  , title:"Lucky Hut"},
    ]
    const setPos = (area: any, index: number, event: any): void => {
        dispatch(input({id: 'startPos', value: index}))
        
    }

    return (
        <div id='imp-map' className='ihContainer'>
            <div className="relative-container centered" style={{width: '700px'}}>
                <ImageMapper src={ImageSrc.layout('imp-map')} map={{name:"impmap", areas:map}} onClick={setPos} width={700} height={500}/>

                <img alt='Imp Map' className="floating-overlay" id="imp-minimap" src={ImageSrc.layout("imp-minimap")} width="500px" height="200px" style={{left: "100px", top: "200px", zIndex: "10"}}/>
                <img alt='Imp Position' className="floating-overlay" id="imp-pos" src={ImageSrc.layout("imp-pos-rect-big")} width="100px"
                     style={{left: `${map[impPos].coords[0]}px`, top: `${map[impPos].coords[1]}px`, zIndex: "20"}}/>
                
                <ImpInput id='mushroom1' title="1. Starry Mushroom" src={ImageSrc.layout('mushroom1')} initial={1} min={1} max={3} strict={true} left={112} top={inputsTop}/>
                <ImpInput id='mushroom2' title="2. Starry Mushroom" src={ImageSrc.layout('mushroom2')} initial={1} min={1} max={3} strict={true} left={181} top={inputsTop}/>
                <ImpInput id='mushroom3' title="3. Starry Mushroom" src={ImageSrc.layout('mushroom3')} initial={1} min={1} max={3} strict={true} left={251} top={inputsTop}/>
                <ImpInput id='stars' title="Starting Stars" src={ImageSrc.layout('imp-star')} initial={0} min={0} max={9999} strict={false} left={388} top={inputsTop} onClick={() => setModalStarsIsOpen(true)}/>
                <ImpInput id='ordinary' title="Ordinary Dice" src={ImageSrc.layout('dice-ordinary')} initial={78} min={0} max={999} strict={false} left={458} top={inputsTop} onClick={() => setModalDiceIsOpen(true)}/>
                <ImpInput id='lucky' title="Lucky Dice" src={ImageSrc.layout('dice-lucky')} initial={0} min={0} max={1} left={528} strict={false} top={inputsTop}/>
                
                <div className="floating-overlay" style={{left: "140px", top: `${inputsTop+135}px`, zIndex: "20"}}>
                    <span>Position </span>
                    <input className="imp-input" type="number" id="startPos" value={impPos} title="Starting Position" style={{display: 'inline-block', width: '1.5em'}}
                           onChange={(e) => dispatch(input({id: 'startPos', value: Number(e.target.value)}))} />
                    <span>: {map[impPos].title}</span>
                </div>

                <img alt='Imp Position Index' className="floating-overlay" id="imp-pos" src={ImageSrc.layout("imp-hut")} style={{left: `325px`, top: `${inputsTop-7}px`, zIndex: "20", width: '56px'}}/>
                <div className="floating-overlay imp-tarot" style={{left: `320px`, top: `${inputsTop+64}px`, zIndex: "20"}}>
                    <Filter items={{
                            None: ImageSrc.layout("imp-none"),
                            DoubleNextRoll: ImageSrc.layout("imp-2d"),
                            RollTwice: ImageSrc.layout("imp-dd"),
                            DoubleStars: ImageSrc.layout("imp-2s"),
                            MoveBackwards: ImageSrc.layout("imp-back"),
                        }} 
                        default='None' 
                        onSelected={(i) => dispatch(input({id: 'activeTarot', value: i}))}/>
                </div>
                <select id="activeTarot" className="imp-select select-right select-noarrow floating-overlay" value={impTarot} onChange={(e) => dispatch(input({id: 'activeTarot', value: e.target.value}))} title="Active Tarot" 
                    	style={{display: 'none', width: '56px', left: '323px', top: '237px', zIndex: "20"}}>
                    <option value="None">&#9940; None</option>
                    <option value="DoubleNextRoll">&#127808; Double Next Roll</option>
                    <option value="RollTwice">&#127808; Roll Two Dice on Next Roll</option>
                    <option value="DoubleStars">&#127808; Get Double Stars on Next Starry Mushroom</option>
                    <option value="MoveBackwards">&#128148; Move Backwards on Next Roll</option>
                </select>

                <button className="btn btn-primary floating-overlay" title='Run 100k Simulations'
                    onClick={() => props.onStart()} 
                    style={{left: '305px', top: '105px', zIndex: "20", width: '90px', height: '90px', fontSize: '2.5em', textAlign: 'center', paddingLeft: "10px", cursor: 'pointer'}} 
                >
                    <FontAwesomeIcon icon={faPlay} />
                </button>
            </div>
            
            <ModalDiceCalculator isOpen={modalDiceIsOpen} setIsOpen={setModalDiceIsOpen} onChange={(val) => dispatch(input({id: 'ordinary', value: val}))} />
            <ModalNumpad title='Starting stars' isOpen={modalStartIsOpen} setIsOpen={setModalStarsIsOpen} onChange={(val) => dispatch(input({id: 'stars', value: val}))} />
        </div>
    );
}


function ModalDiceCalculator(props: {
    isOpen: boolean,
    setIsOpen: (value: boolean) => void,
    onChange: (value: number) => void,
}) {
    const [daily, setDaily] = useState(true);
    const [dailyValue, setDailyValue] = useState(7);
    const [shelter, setShelter] = useState(true);
    const [shelterValue, setShelterValue] = useState({
        shadow: true,
        fortress: true,
        abyss: true,
        forest: true,
    });
    const [gems, setGems] = useState(true);
    const [gemsValue, setGemsValue] = useState(30);
    const [extra, setExtra] = useState(false);
    const [extraValue, setExtraValue] = useState(35);

    const clickFaction = (faction: 'shadow' | 'fortress' | 'abyss' | 'forest') => {
        let newVal = {...shelterValue}
        newVal[faction] = !newVal[faction]
        setShelterValue(newVal)
    }

    const factionClass = (faction: 'shadow' | 'fortress' | 'abyss' | 'forest') => {
        if (shelterValue[faction]) return 'checked'
        else return 'unchecked'
    }

    const calcValue = () => {
        let value = 0
        if (daily) value += dailyValue * 4
        if (gems) value += gemsValue
        if (extra) value += extraValue
        if (shelter) {
            Object.values(shelterValue).forEach(i => {
                if (i) value += 5
            });
        }
        return value
    }

    return (
        <ReactModal
          className='ihContainer ih-modal'
          key={'modal'}
          ariaHideApp={false}
          isOpen={props.isOpen}
          onRequestClose={() => props.setIsOpen(false)}
          shouldCloseOnOverlayClick={true}
          shouldCloseOnEsc={true}
          style={{
            overlay: {zIndex: 100, backgroundColor: 'rgba(70, 70, 70, 0.5)', },
            content: {width: '27em',}
          }}
          >
          <div>
                <table className='ihTable w-max'>
                    <thead>
                        <tr className='ihRow'>
                            <th colSpan={4}><h2 style={{float: 'left', margin: '0'}}>Dice Calculator</h2></th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr className='ihRow'>
                        <td>Daily Reward</td>
                        <td><input type="checkbox" className="hero-checkbox diceCalcInput" checked={daily} onChange={(e) => setDaily(e.target.checked)} /></td>
                        <td><Icon size='sm' src={ImageSrc.layout('imp-dice-4')} /></td>
                        <td>
                            <select className="imp-select imp-input" value={dailyValue} onChange={(e) => setDailyValue(Number(e.target.value))} style={{width: '12.5em', padding: '3px'}}>
                                <option value="7">7 days - 168 hours</option>
                                <option value="6">6 days - 144 hours</option>
                                <option value="5">5 days - 120 hours</option>
                                <option value="5">4 days - 96 hours</option>
                                <option value="3">3 days - 72 hours</option>
                                <option value="2">2 days - 48 hours</option>
                                <option value="1">1 days - 24 hours</option>
                                <option value="0">0 days - 0 hours</option>
                            </select>
                        </td>
                    </tr>
                    <tr className='ihRow'>
                        <td>Shelter Missions</td>
                        <td><input type="checkbox" className="hero-checkbox" checked={shelter} onChange={(e) => setShelter(e.target.checked)} /></td>
                        <td><Icon size='sm' src={ImageSrc.layout('imp-dice-5')} /></td>
                        <td>
                            <div style={{margin: '0'}}>
                                <Icon size='sm' className={`circle ${factionClass('shadow')}`} src={ImageSrc.class('shadow')} onClick={() => clickFaction('shadow')} style={{float: 'left'}}/>
                                <Icon size='sm' className={`circle ${factionClass('fortress')}`} src={ImageSrc.class('fortress')} onClick={() => clickFaction('fortress')} style={{float: 'left'}}/>
                                <Icon size='sm' className={`circle ${factionClass('abyss')}`} src={ImageSrc.class('abyss')} onClick={() => clickFaction('abyss')} style={{float: 'left'}}/>
                                <Icon size='sm' className={`circle ${factionClass('forest')}`} src={ImageSrc.class('forest')} onClick={() => clickFaction('forest')} style={{float: 'left'}}/>
                            </div>
                        </td>
                    </tr>
                    <tr className='ihRow'>
                        <td>By With Gems</td>
                        <td><input type="checkbox" className="hero-checkbox" checked={gems} onChange={(e) => setGems(e.target.checked)} /></td>
                        <td><Icon size='sm' src={ImageSrc.layout('imp-dice-1')} /></td>
                        <td>
                            <input type="number" className="imp-input" value={gemsValue} onChange={(e) => setGemsValue(Number(e.target.value))} style={{width: '3em'}} />
                            <span style={{fontSize: 'large', display: 'inline-block', margin: '8px'}}> / 30</span>
                        </td>
                    </tr>
                    <tr className='ihRow'>
                        <td>Extra</td>
                        <td><input type="checkbox" className="hero-checkbox" checked={extra} onChange={(e) => setExtra(e.target.checked)}/></td>
                        <td><Icon size='sm' src={ImageSrc.layout('imp-dice')} /></td>
                        <td><input type="number" className="imp-input" value={extraValue} onChange={(e) => setExtraValue(Number(e.target.value))} style={{width: '6em'}} /></td>
                    </tr>
                    </tbody>
                </table>
                <div style={{margin: '5px', height: '1.2em'}}>
                    <button type="button" className="btn btn-secondary" style={{width: '8em'}} 
                            onClick={()=> props.setIsOpen(false)}>
                        Close
                    </button>
                    <button type="button" className="btn btn-primary" style={{width: '8em', float: 'right'}} 
                            onClick={() => {props.onChange(calcValue()); props.setIsOpen(false)}}>
                        Set ({calcValue()})
                    </button>
                </div>
            </div>
      </ReactModal>
    )
}

const resetImp = () => {
    for (let i = 9; i > 0; i--) {
        let v = document.getElementById('bin' + i + '-value')
        if (v) {
            v.innerHTML = '---&nbsp;';
            v.title = '';
        }

        let b = document.getElementById('bin' + i);
        if (b) {
            b.innerHTML = '&nbsp;';
            b.style.width = '1%';
        }

        let b2t = document.getElementById('b2t' + i)
        b2t!.style.width = '0'

        let ch = document.getElementById('chance' + (i -1))
        if (ch) {
            ch.innerHTML = '---&nbsp;';
            ch.title = '';
        }
    }
    let as = document.getElementById('avgStars');
    if (as) as.innerHTML = '';

    let s = document.getElementById('strategy');
    if (s) s.innerHTML = 'Simulator\'s Next Move:';
}

function Result() {
    const chart = {
        '1': { milestone: 0,  val: 0, total: 100.0, title: ''},
        '2': { milestone: 80, val: 0.001, total: 100.0, title: "10 Heroic Scrolls"},
        '3': { milestone: 110, val: 0.027, total: 99.999, title: "Elite 5-star Shards"},
        '4': { milestone: 140, val: 1.832, total: 99.972, title: "Limited Skin Chest"},
        '5': { milestone: 170, val: 16.238, total: 98.140, title: "6-Star Puppet Chest"},
        '6': { milestone: 200, val: 47.512, total: 81.902, title: "5-Star Hero Chest"},
        '7': { milestone: 230, val: 30.112, total: 34.390, title: "Material Chest"},
        '8': { milestone: 260, val: 4.258, total: 4.278, title: "L/D 5-Star Hero Chest"},
        '9': { milestone: 300, val: 0.020, total: 0.020, title: "9-Star Puppet Chest"},
    }

    const roundImpPercent = () => {
        let s = document.getElementById('avgStars');
        if (!s || s.innerHTML === '') {
            return
        }

        for (let i = 9; i > 0; i--) {
            let b = document.getElementById('bin' + i);
            let num = 0.0;
            if (b && b.innerHTML !== '&nbsp;') {
                let bv = document.getElementById('bin' + i + '-value');
                if (bv) {
                    num = parseFloat(b.innerHTML)
                    bv.innerHTML = num.toFixed(1) + '%';
                    bv.title = num.toString();
                }
                b.innerHTML = '&nbsp;';
            } else {
                return
            }
            let ch = document.getElementById('chance' + (i - 1))
            let total = 100.0;
            if (ch) {
                if (i !== 1)
                    total = parseFloat(ch.innerHTML)
                ch.innerHTML = Math.round(total) + '%';
                ch.title = total.toString();
            }
            let bin = document.getElementById('bin' + i)
            let b2t = document.getElementById('b2t' + i)
            bin!.style.width = num.toString() + '%'
            b2t!.style.width = (total - num).toString() + '%'

        }
    }

    const avsStarsRef = useRef<HTMLSpanElement>(null)

    /*useLayoutEffect(() => {
        let refValue: HTMLSpanElement | null = null;
        if (avsStarsRef.current) {
            avsStarsRef.current.addEventListener('DOMSubtreeModified', roundImpPercent)
            roundImpPercent()
            refValue = avsStarsRef.current;
        }
        return () => refValue?.removeEventListener('DOMSubtreeModified', roundImpPercent);
    }, [avsStarsRef])*/

    var timer: number = 0
    useLayoutEffect(() => {
        let observer: MutationObserver | null = null;
        if (avsStarsRef.current) {
            observer = new MutationObserver(mutationList => {
                for (const mutation of mutationList) {
                    if (mutation.type === "childList") {
                        if ((mutation.target as HTMLSpanElement).innerHTML === '') {
                            //timer = Date.now()
                            //console.log('simulation start', timer)
                        } else {
                            //let now = Date.now()
                            //console.log('simulation done', now, now-timer)
                            roundImpPercent();
                        }
                    }
                }
            });
            observer.observe(avsStarsRef.current, {
                childList: true,
            });
            roundImpPercent();
        }
        return () => { observer?.disconnect(); };
    }, [avsStarsRef, timer]);
      
    return (
        <table id="imp-chart" className='ihContainer w-max'>
            <tbody>
            {Object.keys(chart).map((strid: string) => {
                let id = strid as keyof typeof chart;
                let idch = Number(id) - 1;
                //let width = Math.max(chart[id].val - .5, .5)
                //let width2Total = Math.max(chart[id].total - chart[id].val - .5, .5)
                let width =chart[id].val
                let width2Total = chart[id].total - chart[id].val
                return (
                <tr key={id}>
                    <td className='stars'>
                        {chart[id].milestone !== 0 ? <Icon size='xsm' src={ImageSrc.layout(`imp-s-${chart[id].milestone}`)} title={`${chart[id].milestone} stars`}/> : null}
                    </td>
                    <td className='value'>
                        <span className="bar-value" id={`bin${id}-value`} title=''></span>
                    </td>
                    
                    <td style={{textAlign: 'start'}}>
                        <div id={"bin"+id} style={{width: `${width}%`, backgroundColor: '#66ccff', display: 'inline-block', margin: 0}}>{width}%&nbsp;</div>
                        <div id={"b2t"+id} style={{width: `${width2Total}%`, backgroundColor: 'lightGray', display: 'inline-block', marginRight: 'auto'}}>&nbsp;</div>
                    </td>
                    <td className='total'>
                        {chart[id].total ?<span id={"chance"+idch} title=''>{chart[id].total}</span> : null}
                    </td>
                    <td className='reward'>
                        {chart[id].milestone !== 0 ? <Icon size='sm' src={ImageSrc.layout(`imp-r-${chart[id].milestone}`)} title={chart[id].title} /> : null}
                    </td>
                </tr>
            )})}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={5} className="total">Average Stars: <span id="avgStars" ref={avsStarsRef}>216</span></td>
                </tr>
                <tr hidden>
                    <td colSpan={5} className="total" id="strategy">Simulator's Next Move: ...</td>
                </tr>
            </tfoot>
        </table>
    )
}

function Footer() {
    return (
        <div className="section" style={{display: "none"}}>
            <div className="row alt1">
                <div className="column">10 Heroic Scrolls:<input type="text" id="reward1" value="1250" readOnly={true}></input></div>
                <div className="column">Expected Value: <span id="value1">0</span></div>
            </div>
            <div className="row">
                <div className="column">Elite 5-star Shards:<input type="text" id="reward2" value="2500" readOnly={true}></input></div>
                <div className="column">Expected Value: <span id="value2">0</span></div>
            </div>
            <div className="row alt1">
                <div className="column">Limited Skin Chest:<input type="text" id="reward3" value="3750" readOnly={true}></input></div>
                <div className="column">Expected Value: <span id="value3">0</span></div>
            </div>
            <div className="row">
                <div className="column">6-Star Puppet Chest:<input type="text" id="reward4" value="1800" readOnly={true}></input></div>
                <div className="column">Expected Value: <span id="value4">0</span></div>
            </div>
            <div className="row alt1">
                <div className="column">5-Star Hero Chest:<input type="text" id="reward5"value="7500" readOnly={true}></input></div>
                <div className="column">Expected Value: <span id="value5">0</span></div>
            </div>
            <div className="row">
                <div className="column">Material Chest:<input type="text" id="reward6" value="1000" readOnly={true}></input></div>
                <div className="column">Expected Value: <span id="value6">0</span></div>
            </div>
            <div className="row alt1">
                <div className="column">L/D 5-Star Hero Chest:<input type="text" id="reward7" value="10000" readOnly={true}></input></div>
                <div className="column">Expected Value: <span id="value7">0</span></div>
            </div>
            <div className="row">
                <div className="column">9-Star Puppet Chest:<input type="text" id="reward8" value="8400" readOnly={true}></input></div>
                <div className="column">Expected Value: <span id="value8">0</span></div>
            </div>
        </div>
    )
}

export function Imp() {

    const run = () => {
        resetImp()
        window.runImpSim();
    }

    useLayoutEffect(() => {
        window.init();
    }, [])

    return (
        <div>
            <Map onStart={run}/>
            <Result/>
            <Footer/>
            <div className='ihContainer'>
                <a href="https://vincitego.github.io/imp/imp.html" 
                   target="_blank" rel="noopener noreferrer" style={{fontSize: 'smaller'}}>u/VincitEgo Imp's Adventure Simulator <FontAwesomeIcon icon={faUpRightFromSquare} /></a>
            </div>
        </div>
    )

}