import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCircleChevronLeft, faCircle,
} from '@fortawesome/free-solid-svg-icons'
import { Icon, ImageSrc } from '../../../components/Images';
import { BigNumber } from '../../../components/BigNumber'
import { levelup } from '../../../data/lvl';

const accumulate = (arr: number[]) => arr.map((sum => value => sum += value)(0));

export function LevelUp() {
    const [selected, setSelected] = useState<number|null>(null);

    //const levelup: {lvl: number, stone: number, spirit: number, gold: number}[] = Object.values(leveling).map((data) => { return {lvl: data.lvl, stone: _.get(data, 'stone') | 0, spirit:  _.get(data, 'spirit') | 0, gold:  _.get(data, 'gold') | 0}})
    //console.log(levelup)

    const sums = selected === null 
        ? {stone: [], gold: [], spirit: [], x: []}
        : {
            stone: accumulate(Array(selected+1).fill(0).concat(levelup.map((data) => data.stone).slice(selected+1))),
            gold: accumulate(Array(selected+1).fill(0).concat(levelup.map((data) => data.gold).slice(selected+1))),
            spirit: accumulate(Array(selected+1).fill(0).concat(levelup.map((data) => data.spirit).slice(selected+1))),
            x: accumulate(Array(selected+1).fill(0).concat(levelup.map((data) => data.x || 0).slice(selected+1))),
        }

    let levelup_data = selected === null
        ? levelup
        : Object.values(levelup).map((item, i) => ({lvl: item.lvl, stone: sums.stone[i], gold: sums.gold[i], spirit: sums.spirit[i], x: sums.x[i] || undefined}));

    return (
        <table className='ihContainer ihDataTable no-footer w-max'>
            <thead className='multi-row'>
                <tr>
                    <th></th>
                    <th></th>
                    <th colSpan={4} style={{borderBottom: '3px solid #bd916e'}}>{selected === null ? '#' : '\u03A3'}</th>

                    <th style={{width: '5em'}}>
                        {-1 === selected
                        ? <FontAwesomeIcon className='btn-role' icon={faCircleChevronLeft} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(null)}/>
                        : <FontAwesomeIcon className='btn-role' icon={faCircle} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(-1)}/>
                        }
                    </th>
                </tr>
                <tr className='spacer'>
                    <td style={{width: '4em'}}></td>
                    <td></td>
                    <td style={{width: '5em'}}></td>
                    <td style={{width: '5em'}}></td>
                    <td style={{width: '9em'}}></td>
                    <td style={{width: '9em'}}></td>

                    <td style={{width: '5em'}}></td>
                </tr>
                <tr>
                    <th></th>
                    <th></th>
                    <th><div className='dataIconCell'><Icon size='sm' src={ImageSrc.resources('x-stone')}  title={'X-Stone'}/></div></th>
                    <th><div className='dataIconCell'><Icon size='sm' src={ImageSrc.resources('stone')} title={'Hero Promotion Stone'}/></div></th>
                    <th><div className='dataIconCell'><Icon size='sm' src={ImageSrc.resources('gold')}  title={'Gold'}/></div></th>
                    <th><div className='dataIconCell'><Icon size='sm' src={ImageSrc.resources('spirit')}  title={'Spirit'}/></div></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {levelup_data.map((data, i) => 
                    <tr key={'tree-'+i}>
                        <td style={{textAlign: 'left'}}>{data.lvl}</td>
                        <td></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.x || 0}/></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.stone}/></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.gold}/></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.spirit}/></td>

                        <td>
                            {i === selected
                            ? <FontAwesomeIcon className='btn-role' icon={faCircleChevronLeft} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(null)}/>
                            : <FontAwesomeIcon className='btn-role' icon={faCircle} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(i)}/>
                            }
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
