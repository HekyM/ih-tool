import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCircleChevronLeft, faCircle,
  faToggleOn, faToggleOff,
} from '@fortawesome/free-solid-svg-icons'
import { Icon, ImageSrc } from '../../../components/Images';
import { BigNumber } from '../../../components/BigNumber'
import { destiny, temple } from '../../../data/lvl';

const accumulate = (arr: number[]) => arr.map((sum => value => sum += value)(0));

export function Destiny() {
    const [selected, setSelected] = useState<number|null>(null);
    const [numbers, setNumbers] = useState<'long'|'short'>('long');

    const sums = selected === null 
        ? {aurora: [], cot: [], spiritvein: [], stellar: []}
        : {
            aurora: accumulate(Array(selected+1).fill(0).concat(destiny.map((data) => data.aurora).slice(selected+1))),
            cot: accumulate(Array(selected+1).fill(0).concat(destiny.map((data) => data.cot).slice(selected+1))),
            spiritvein: accumulate(Array(selected+1).fill(0).concat(destiny.map((data) => data.spiritvein).slice(selected+1))),
            stellar: accumulate(Array(selected+1).fill(0).concat(destiny.map((data) => data.stellar).slice(selected+1))),
        }

    let destiny_data = selected === null
        ? destiny
        : Object.values(destiny).map((item, i) => ({dsc: item.dsc, name: item.name, aurora: sums.aurora[i], cot: sums.cot[i], spiritvein: sums.spiritvein[i], stellar: sums.stellar[i]}));

    return (
        <>
        <table className='ihContainer ihDataTable no-footer w-max'>
            <thead>
                <tr>
                    <td colSpan={2}>
                        {numbers === 'long'
                        ? <FontAwesomeIcon className='btn-role' icon={faToggleOff} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setNumbers('short')} title='toggle numbers format'/>
                        : <FontAwesomeIcon className='btn-role' icon={faToggleOn} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setNumbers('long')} title='toggle numbers format'/>
                        } 
                    </td>
                    <td></td>
                    <td colSpan={5} style={{borderBottom: '3px solid #bd916e'}}>{selected === null ? '#' : '\u03A3'}</td>
                    <td></td> 
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colSpan={2}><div className='dataIconCell'><Icon size='sm' src={ImageSrc.resources('Aurora Gem Shard')} title={'Aurora Gem Shards'}/></div></td>
                    <td><div className='dataIconCell'><Icon size='sm' src={ImageSrc.resources('Crystal of Transcendence')} title={'Crystals of Transcendence'}/></div></td>
                    <td><div className='dataIconCell'><Icon size='sm' src={ImageSrc.resources('spiritvein shard')} title={'Spiritvein Shards'}/></div></td>
                    <td><div className='dataIconCell'><Icon size='sm' src={ImageSrc.resources('stellar')} title={'Stellar Shards'}/></div></td>

                    <td>
                        {-1 === selected
                        ? <FontAwesomeIcon className='btn-role' icon={faCircleChevronLeft} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(null)}/>
                        : <FontAwesomeIcon className='btn-role' icon={faCircle} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(-1)}/>
                        }
                    </td>
                </tr>
                <tr>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td></td>
                    <td style={{width: '5.5em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '7em'}}></td>
                    <td style={{width: '6em'}}></td>
                    <td style={{width: '7em'}}></td>

                    <td style={{width: '4em'}}></td>
                </tr>
            </thead>
            <tbody>
                {destiny_data.map((data, i) => 
                    <tr key={'tree-'+i}>
                        <td style={{textAlign: 'left'}}>{data.dsc}</td>
                        <td style={{textAlign: 'left'}}>{data.name}</td>
                        <td></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.aurora*5000} mode={numbers} style={{borderRight: '2px solid', paddingRight: '.5em'}}/></td>
                        <td style={{textAlign: 'right'}}>{data.aurora !== 0 && <span className='big-number' style={{paddingRight: '.5em'}}>{data.aurora}</span>}</td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.cot} mode={numbers} style={{paddingRight: '.5em'}}/></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.spiritvein} mode={numbers} style={{paddingRight: '.5em'}}/></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.stellar} mode={numbers} style={{paddingRight: '.5em'}}/></td>

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
        <table className='ihContainer ihDataTable no-footer w-max'>
            <thead>
                <tr>
                    <td colSpan={2}>Temple</td>
                    <td></td>
                    <td colSpan={6} style={{borderBottom: '3px solid #bd916e'}}>Capacity</td>
                    <td></td>
                    <td colSpan={6} style={{borderBottom: '3px solid #bd916e'}}>Requirements</td>
                    <td></td>
                </tr>
                <tr style={{textAlign: 'right'}}>
                    <td>lvl</td>
                    <td>D+</td>
                    <td></td>

                    <td>D1</td>
                    <td>D2</td>
                    <td>D3</td>
                    <td>D4</td>
                    <td>D5</td>
                    <td>D6</td>
                    <td></td>

                    <td>D1</td>
                    <td>D2</td>
                    <td>D3</td>
                    <td>D4</td>
                    <td>D5</td>
                    <td>D6</td>
                    <td></td>
                </tr>
                <tr>
                    <td style={{width: '1em'}}></td>
                    <td style={{width: '3em'}}></td>
                    <td></td>

                    <td style={{width: '2.5em'}}></td>
                    <td style={{width: '2.5em'}}></td>
                    <td style={{width: '2.5em'}}></td>
                    <td style={{width: '2.5em'}}></td>
                    <td style={{width: '2.5em'}}></td>
                    <td style={{width: '2.5em'}}></td>
                    <td></td>

                    <td style={{width: '2.5em'}}></td>
                    <td style={{width: '2.5em'}}></td>
                    <td style={{width: '2.5em'}}></td>
                    <td style={{width: '2.5em'}}></td>
                    <td style={{width: '2.5em'}}></td>
                    <td style={{width: '2.5em'}}></td>
                    <td></td>
                </tr>
            </thead>
            <tbody style={{textAlign: 'right'}}>
                {temple.map((data, i) => 
                    <tr key={'temple-'+i}>
                        <td>{data.lvl}</td>
                        <td>+{data.bonus}</td>
                        <td></td>
                        {data.capacity.map((destiny_lvl, j) =>
                            <td key={'temple-cap-'+i+'-'+j}>{destiny_lvl !== 0 && destiny_lvl}</td> 
                        )}
                        <td></td>
                        {data.require.map((destiny_lvl, j) =>
                            <td key={'temple-cap-'+i+'-'+j}>{destiny_lvl !== 0 && destiny_lvl}</td> 
                        )}
                        <td></td>
                    </tr>
                )}
            </tbody>
        </table>
        </>
    )
}