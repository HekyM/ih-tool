import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from 'lodash';
import { 
  faCircleChevronLeft, faCircle, faLock,
} from '@fortawesome/free-solid-svg-icons'
import { Icon, ImageSrc } from '../../../components/Images';
import { BigNumber } from '../../../components/BigNumber'
import { star_soul, star_souls, destiny_trail } from '../../../data/lvl';

const accumulate = (arr: number[]) => arr.map((sum => value => sum += value)(0));

function Soul() {
    const [selected, setSelected] = useState<number|null>(null);

    const sums = selected === null
        ? {soul: [], essence: [], soul2: [], essence2: []}
        : {
            soul: accumulate(Array(selected+1).fill(0).concat(star_soul.map((data) => data.soul).slice(selected+1))),
            soul2: accumulate(Array(selected+1).fill(0).concat(star_soul.map((data) => data.soul2 || 0).slice(selected+1))),
            essence: accumulate(Array(selected+1).fill(0).concat(star_soul.map((data) => data.essence).slice(selected+1))),
            essence2: accumulate(Array(selected+1).fill(0).concat(star_soul.map((data) => data.essence2 || 0).slice(selected+1))),
        }

    let star_soul_data = selected === null
        ? star_soul
        : Object.values(star_soul).map((item, i) => ({
            stars: item.stars, 
            lvl: item.lvl, 
            lock: item.lock, 
            soul: sums.soul[i], 
            soul2: sums.soul2[i], 
            essence: sums.essence[i], 
            essence2: sums.essence2[i], 
            speed: item.speed, 
            atk: item.atk, 
            hp: item.hp, 
            skill: item.skill, 
            skill_lvl: item.skill_lvl, 
            assist_skill: item.assist_skill, 
        }));

    const starUp = (i: number) => {
        if (i === 0) return true
        return star_soul_data[i].stars !== star_soul_data[i-1].stars
    };

    const numberColor = (i: number, attr: string) => {
        if (i === 0) return 'inherite'
        if (_.get(star_soul_data[i], attr) === _.get(star_soul_data[i-1], attr))
            return 'gray'
        return 
    }

    return (
        <>
        <table className='ihContainer ihDataTable no-footer w-max'>
            <thead className='multi-row'>
                <tr>
                    <th colSpan={3} style={{color: '#bd916e'}}>Star Soul</th>
                    <th colSpan={4} style={{borderBottom: '3px solid #bd916e'}}>{selected === null ? '#' : '\u03A3'}</th>
                    <th></th> 
                    <th colSpan={7} style={{borderBottom: '3px solid #bd916e'}}>Stats & Skills</th>
                    <th></th> 
                </tr>
                <tr className='spacer'>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '6em'}}></td>
                    <td style={{width: '6em'}}></td>
                    <td></td>
                    <td style={{width: '4em'}}></td>
                    <td style={{width: '4em'}}></td>
                    <td style={{width: '4em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '2.5em'}}></td>
                    <td style={{width: '4em'}}></td>

                    <td style={{width: '4em'}}></td>
                </tr>
                <tr>
                    <th>☆</th>
                    <th>lvl</th>
                    <th><div title='Required Destiny Trail level'><FontAwesomeIcon icon={faLock} style={{width: '1.5em', fontSize: 'larger'}}/></div></th>
                    <th colSpan={2}><div><Icon size='sm' src={ImageSrc.resources('Star Soul', 'souls')} title={'Star Soul'}/></div></th>
                    <th colSpan={2}><div><Icon size='sm' src={ImageSrc.resources('Star Soul Essence', 'souls')} title={'Star Soul Essence'}/></div></th>
                    <th></th>
                    <th style={{textAlign: 'right'}}>Speed</th>
                    <th style={{textAlign: 'right'}}>Atk%</th>
                    <th style={{textAlign: 'right'}}>HP%</th>
                    <th></th>
                    <th colSpan={2}>Skill</th>
                    <th title='Ethereal Realm Assist Skill'>Assist</th>
                    <th>
                        {-1 === selected
                        ? <FontAwesomeIcon className='btn-role' icon={faCircleChevronLeft} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(null)}/>
                        : <FontAwesomeIcon className='btn-role' icon={faCircle} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(-1)}/>
                        }
                    </th>
                </tr>
            </thead>
            <tbody>
                {star_soul_data.map((data, i) => 
                    <React.Fragment key={'soul-lvl-'+i}>
                    {(i !== 0 && starUp(i)) && <tr className='spacerRow'><td colSpan={16}/></tr>}
                    <tr>
                        {starUp(i) && <td rowSpan={4} style={{borderBottom: 'none'}}>{data.stars}</td>}
                        <td>{data.lvl}</td>
                        <td style={{color: "darkRed"}}>{data.lock}</td>
                        <td style={{textAlign: 'right', color: numberColor(i, 'soul')}}><BigNumber value={data.soul || 0}/></td>
                        <td style={{textAlign: 'right', color: numberColor(i, 'soul2')}}><BigNumber value={data.soul2 || 0}/></td>
                        <td style={{textAlign: 'right', color: numberColor(i, 'essence')}}><BigNumber value={data.essence || 0}/></td>
                        <td style={{textAlign: 'right', color: numberColor(i, 'essence2')}}><BigNumber value={data.essence2 || 0}/></td>
                        <td></td>
                        <td style={{textAlign: 'right', color: numberColor(i, 'speed')}}>{data.speed !== 0 && data.speed}</td>
                        <td style={{textAlign: 'right', color: numberColor(i, 'atk')}}>{data.atk !== 0 && data.atk}</td>
                        <td style={{textAlign: 'right', color: numberColor(i, 'hp')}}>{data.hp !== 0 && data.hp}</td>
                        <td></td>
                        <td>{data.skill && data.skill}</td>
                        <td>{
                            !data.skill_lvl ? undefined : data.skill_lvl === 1 ? '⦿⦾' : '⦿⦿'
                        }</td>
                        <td>{data.assist_skill && '#' + data.assist_skill}</td>

                        <td>
                            {i === selected
                            ? <FontAwesomeIcon className='btn-role' icon={faCircleChevronLeft} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(null)}/>
                            : <FontAwesomeIcon className='btn-role' icon={faCircle} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(i)}/>
                            }
                        </td>
                    </tr>
                    
                    </React.Fragment>
                )}
            </tbody>
        </table>
        </>
    )
}

function DestinyTrail() {
    const [selected, setSelected] = useState<number|null>(null);

    const sums = selected === null
        ? {material: [], material2: []}
        : {
            material: accumulate(Array(selected+1).fill(0).concat(destiny_trail.map((data) => data.material).slice(selected+1))),
            material2: accumulate(Array(selected+1).fill(0).concat(destiny_trail.map((data) => data.material2 || 0).slice(selected+1))),
        }

    let destiny_trail_data = selected === null
        ? destiny_trail
        : Object.values(destiny_trail).map((item, i) => ({
            stars: item.stars, 
            lvl: item.lvl, 
            sub_lvl: item.sub_lvl, 
            lock: item.lock, 
            material: sums.material[i], 
            material2: sums.material2[i], 
        }));

    const starUp = (i: number) => {
        if (i === 0) return true
        return destiny_trail[i].stars !== destiny_trail[i-1].stars
    };

    return (
        <>
        <table className='ihContainer ihDataTable no-footer w-max'>
            <thead className='multi-row'>
                <tr>
                    <th colSpan={4} style={{color: '#bd916e'}}>Destiny Trail</th>
                    <th></th>
                    <th colSpan={2} style={{borderBottom: '3px solid #bd916e'}}>{selected === null ? '#' : '\u03A3'}</th>
                    <th></th> 
                </tr>
                <tr className='spacer'>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td></td>
                    <td style={{width: '8em'}}></td>
                    <td style={{width: '8em'}}></td>

                    <td style={{width: '4em'}}></td>
                </tr>
                <tr>
                    <th>☆</th>
                    <th colSpan={2}>lvl</th>
                    <th><div title='Required Star Soul level'><FontAwesomeIcon icon={faLock} style={{width: '1.5em', fontSize: 'larger'}}/></div></th>
                    <th></th>
                    <th colSpan={2}><div><Icon size='sm' src={ImageSrc.resources('Destiny Trail', 'souls')} title={'Destiny Trail'}/></div></th>
                    <th>
                        {-1 === selected
                        ? <FontAwesomeIcon className='btn-role' icon={faCircleChevronLeft} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(null)}/>
                        : <FontAwesomeIcon className='btn-role' icon={faCircle} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(-1)}/>
                        }
                    </th>
                </tr>
            </thead>
            <tbody>
                {destiny_trail_data.map((data, i) => 
                    <React.Fragment key={'trail-lvl-'+i}>
                    {(i !== 0 && starUp(i)) && <tr className='spacerRow'><td colSpan={8}/></tr>}
                    <tr>
                        {starUp(i) && <td rowSpan={6} style={{borderBottom: 'none'}}>{data.stars}</td>}
                        <td>{data.lvl}</td>
                        <td>{data.sub_lvl}</td>
                        <td style={{color: "darkRed"}}>{data.lock}</td>
                        <td></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.material || 0}/></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.material2 || 0}/></td>

                        <td>
                            {i === selected
                            ? <FontAwesomeIcon className='btn-role' icon={faCircleChevronLeft} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(null)}/>
                            : <FontAwesomeIcon className='btn-role' icon={faCircle} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(i)}/>
                            }
                        </td>
                    </tr>
                    
                    </React.Fragment>
                )}
            </tbody>
        </table>
        </>
    )
}

function Souls() {
    return (
        <>
        <table className='ihContainer ihDataTable no-footer w-max'>
            <thead className='multi-row'>
                <tr>
                    <th></th>
                    <th colSpan={4} style={{borderBottom: '3px solid #bd916e'}}>Star Soul</th>
                    <th></th>
                    <th colSpan={2} style={{borderBottom: '3px solid #bd916e'}}>lv.24</th>
                    <th></th>
                    <th colSpan={2} style={{borderBottom: '3px solid #bd916e'}}>lv.32</th>
                    <th></th>
                    <th></th>
                </tr>
                <tr className='spacer'>
                    <td ></td>
                    <td style={{width: '15em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '.5em'}}></td>
                    <td style={{width: '4em'}}></td>
                    <td style={{width: '5em'}}></td>
                    <td style={{width: '.5em'}}></td>
                    <td style={{width: '4em'}}></td>
                    <td style={{width: '5em'}}></td>

                    <td style={{width: '4em'}}></td>
                    <td ></td>
                </tr>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th><div><Icon size='sm' src={ImageSrc.resources('Star Soul', 'souls')} title={'Star Soul'}/></div></th>
                    <th><div><Icon size='sm' src={ImageSrc.resources('Star Soul Essence', 'souls')} title={'Star Soul Essence'}/></div></th>
                    <th><div><Icon size='sm' src={ImageSrc.resources('Destiny Trail', 'souls')} title={'Destiny Trail'}/></div></th>
                    <th></th>
                    <th>Atk</th>
                    <th>HP</th>
                    <th></th>
                    <th>Atk</th>
                    <th>HP</th>
                    <th>lv.25+</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(star_souls).map(([soul, data]) => (
                    <tr key={soul}>
                        <td></td>
                        <td style={{textAlign: 'left'}}>{soul} • {_.get(data, 'name')}</td>
                        <td><div><Icon size='md' src={ImageSrc.resources(`${soul} Star Soul`, 'souls')} title={`${soul} • ${_.get(data, 'name')}`}/></div></td>
                        <td><div><Icon size='md' src={ImageSrc.resources(`${soul} Star Soul Essence`, 'souls')} title={`${soul} Star Soul Essence`}/></div></td>
                        <td><div><Icon size='md' src={ImageSrc.resources(`${soul} Destiny Trail`, 'souls')} title={`${soul} Destiny Trail`}/></div></td>
                        <td></td>
                        <td style={{textAlign: 'right'}}><BigNumber format="short" value={_.get(data, 'atk')}/></td>
                        <td style={{textAlign: 'right'}}><BigNumber format="short" value={_.get(data, 'hp')}/></td>
                        <td></td>
                        <td style={{textAlign: 'right'}}><BigNumber format="short" value={_.get(data, 'atk2')}/></td>
                        <td style={{textAlign: 'right'}}><BigNumber format="short" value={_.get(data, 'hp2')}/></td>

                        <td>{_.get(data, 'other') && <div><Icon size='md' src={ImageSrc.resources(`${_.get(data, 'other')} Star Soul`, 'souls')} title={`${_.get(data, 'other')} • ${_.get(data, 'name')}`}/></div>}</td>
                        <td></td>
                    </tr>
                ))}
            </tbody>
        </table>
        </>
    )
}

export function StarSouls() {
    return (
        <>
        <Soul />
        <DestinyTrail />
        <Souls />
        </>
    )
}
