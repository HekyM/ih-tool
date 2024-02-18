import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCircleChevronLeft, faCircle,
} from '@fortawesome/free-solid-svg-icons'
import { Icon, ImageSrc } from '../../../components/Images';
import { BigNumber } from '../../../components/BigNumber'
import { tree } from '../../../data/lvl';

const accumulate = (arr: number[]) => arr.map((sum => value => sum += value)(0));

export function Tree() {
    const [selected, setSelected] = useState<number|null>(null);

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
                
            <thead className='multi-row'>
                <tr>
                    <th colSpan={2}>
                    </th>
                    <th></th>
                    <th></th>
                    <th colSpan={2} style={{borderBottom: '3px solid #bd916e'}}>{selected === null ? '#' : '\u03A3'}</th>

                    <th></th>
                </tr>
                <tr className='spacer'>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '3em'}}></td>
                    <td style={{width: '12em'}}></td>
                    <td></td>
                    <td style={{width: '7em'}}></td>
                    <td style={{width: '7em'}}></td>

                    <td style={{width: '4em'}}></td>
                </tr>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th className='dataIconCell'><div><Icon size='sm' src={ImageSrc.resources('Spiritual Essence')}  title={'Spiritual Essence'}/></div></th>
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
                {tree_data.map((data, i) => 
                    <tr key={'tree-'+i}>
                        <td style={{textAlign: 'left'}}>{data.dsc}</td> 
                        <td style={{textAlign: 'right'}}>{data.lvl}</td>
                        <td style={{textAlign: 'left', paddingLeft: '1em'}}>{data.unlock}</td>
                        <td></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={data.esence}/></td>
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
    )
}