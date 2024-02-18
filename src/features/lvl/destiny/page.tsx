import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCircleChevronLeft, faCircle,
} from '@fortawesome/free-solid-svg-icons'
import { Icon, ImageSrc } from '../../../components/Images';
import { BigNumber } from '../../../components/BigNumber'
import { destiny, temple } from '../../../data/lvl';

const accumulate = (arr: number[]) => arr.map((sum => value => sum += value)(0));

export function Destiny() {
    const [selected, setSelected] = useState<number|null>(null);

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
            <thead className='multi-row'>
                <tr>
                    <th colSpan={2}>
                    </th>
                    <th></th>
                    <th colSpan={5} style={{borderBottom: '3px solid #bd916e'}}>{selected === null ? '#' : '\u03A3'}</th>
                    <th></th> 
                </tr>
                <tr className='spacer'>
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
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th className='dataIconCell' colSpan={2}><div><Icon size='sm' src={ImageSrc.resources('Aurora Gem Shard')} title={'Aurora Gem Shards'}/></div></th>
                    <th className='dataIconCell'><div><Icon size='sm' src={ImageSrc.resources('Crystal of Transcendence')} title={'Crystals of Transcendence'}/></div></th>
                    <th className='dataIconCell'><div><Icon size='sm' src={ImageSrc.resources('spiritvein shard')} title={'Spiritvein Shards'}/></div></th>
                    <th className='dataIconCell'><div><Icon size='sm' src={ImageSrc.resources('stellar')} title={'Stellar Shards'}/></div></th>

                    <th>
                        {-1 === selected
                        ? <FontAwesomeIcon className='btn-role' icon={faCircleChevronLeft} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(null)}/>
                        : <FontAwesomeIcon className='btn-role' icon={faCircle} style={{width: '1.5em', fontSize: 'larger'}} onClick={() => setSelected(-1)}/>
                        }
                    </th>
                </tr>
            </thead>
            <tbody>
                {destiny_data.map((data, i) => 
                    <tr key={'tree-'+i}>
                        <td style={{textAlign: 'left'}}>{data.dsc}</td>
                        <td style={{textAlign: 'left'}}>{data.name}</td>
                        <td></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.aurora*5000}/></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.aurora}/></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.cot}/></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.spiritvein}/></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.stellar}/></td>

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
            <thead className='multi-row'>
                <tr>
                    <th colSpan={2}>Temple</th>
                    <th></th>
                    <th colSpan={6} style={{borderBottom: '3px solid #bd916e'}}>Capacity</th>
                    <th></th>
                    <th colSpan={6} style={{borderBottom: '3px solid #bd916e'}}>Requirements</th>
                    <th></th>
                </tr>
                <tr className='spacer'>
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
                <tr style={{textAlign: 'right'}}>
                    <th>lvl</th>
                    <th>D+</th>
                    <th></th>

                    <th>D1</th>
                    <th>D2</th>
                    <th>D3</th>
                    <th>D4</th>
                    <th>D5</th>
                    <th>D6</th>
                    <th></th>

                    <th>D1</th>
                    <th>D2</th>
                    <th>D3</th>
                    <th>D4</th>
                    <th>D5</th>
                    <th>D6</th>
                    <th></th>
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