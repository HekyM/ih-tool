import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCircleChevronLeft, faCircle,
  faToggleOn, faToggleOff,
} from '@fortawesome/free-solid-svg-icons'
import { Icon, ImageSrc } from '../../../components/Images';
import { BigNumber } from '../../../components/BigNumber'
import { tree } from '../../../data/lvl';

const accumulate = (arr: number[]) => arr.map((sum => value => sum += value)(0));

export function Tree() {
    const [selected, setSelected] = useState<number|null>(null);
    const [numbers, setNumbers] = useState<'long'|'short'>('long');

    const sums = selected === null 
        ? {stellar: [], esence: []}
        : {
            stellar: accumulate(Array(selected+1).fill(0).concat(tree.map((data) => data.stellar).slice(selected+1))),
            esence: accumulate(Array(selected+1).fill(0).concat(tree.map((data) => data.esence).slice(selected+1))),
        }

    let tree_data = selected === null
        ? tree
        : Object.values(tree).map((item, i) => ({dsc: item.dsc, lvl: item.lvl, unlock: item.unlock, stellar: sums.stellar[i], esence: sums.esence[i]}));

    return (
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
                    <td></td>
                    <td colSpan={2} style={{borderBottom: '3px solid #bd916e'}}>{selected === null ? '#' : '\u03A3'}</td>

                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td><div className='dataIconCell'><Icon size='sm' src={ImageSrc.resources('Spiritual Essence')}  title={'Spiritual Essence'}/></div></td>
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
                    <td style={{width: '3em'}}></td>
                    <td style={{width: '12em'}}></td>
                    <td></td>
                    <td style={{width: '7em'}}></td>
                    <td style={{width: '7em'}}></td>

                    <td style={{width: '4em'}}></td>
                </tr>
            </thead>
            <tbody>
                {tree_data.map((data, i) => 
                    <tr key={'tree-'+i}>
                        <td style={{textAlign: 'left'}}>{data.dsc}</td> 
                        <td style={{textAlign: 'right'}}>{data.lvl}</td>
                        <td style={{textAlign: 'left', paddingLeft: '1em'}}>{data.unlock}</td>
                        <td></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.esence} mode={numbers} style={{paddingRight: '.5em'}}/></td>
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
    )
}