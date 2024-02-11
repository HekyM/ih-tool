import React, { useState } from 'react';
import { sum } from 'lodash';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCircleChevronLeft, faCircle,
} from '@fortawesome/free-solid-svg-icons'
import { Dropdown } from '../../../components/Dropdown';
import { Icon, ImageSrc } from '../../../components/Images';
import { BigNumber } from '../../../components/BigNumber'
import { imprintsFull, imprintsNodes, imprintsTotal } from '../../../data/lvl';

const accumulate = (arr: number[]) => arr.map((sum => value => sum += value)(0));

const ability = {
    'V1': 'P1',
    'V2': 'P2',
    'V3': 'P3',
    'V4': 'A',
}

export function Imprints() {
    const [selected, setSelected] = useState(-1);
    const [nodesHP, setNodesHP] = useState(0);
    const [nodesAttack, setNodesAttack] = useState(0);
    const [nodesAttackHP, setNodesAttackHP] = useState(0);

    interface  NodesSelected {
        [details: string] : {value: number, set: (value: number) => void, max: number, sum: number };
    }
    const nodesSelected: NodesSelected = {
        "HP":           {value: nodesHP, set: setNodesHP, max: 30, sum: sum(_.get(imprintsFull, `V${selected+2}.HP`, [0]).slice(nodesHP))},
        "Attack":       {value: nodesAttack, set: setNodesAttack, max: 30, sum: sum(_.get(imprintsFull, `V${selected+2}.Attack`, [0]).slice(nodesAttack))},
        "Attack HP":    {value: nodesAttackHP, set: setNodesAttackHP, max: 10, sum: sum(_.get(imprintsFull, `V${selected+2}.Attack HP`, [0]).slice(nodesAttackHP))},
        "Speed":        {value: nodesAttackHP, set: setNodesAttackHP, max: 10, sum: sum(_.get(imprintsFull, `V${selected+2}.Speed`, [0]).slice(nodesAttackHP))},
    }
    const num = (key: string, value: number, setValue: (value: number) => void) => {
        return (
            <div key={key+'-'+value} className='btn btn-primary' style={{display: 'inline-block', padding: '0', width: '18%', fontSize: 'smaller'}} onClick={() => setValue(value)}>
                {value}
            </div>
        )
    }
    const nodes_sum = Object.values(imprintsTotal)[selected+1] - sum(Object.values(nodesSelected).map((node) => node.sum))
    const sums = Array(selected+1).fill(0).concat(accumulate(Object.values(imprintsTotal).slice(selected+1))).map((value) => value === 0 ? 0 : value - nodes_sum)

    const onSelected = (value: number) => {
        setSelected(value);
        setNodesHP(0);
        setNodesAttack(0);
        setNodesAttackHP(0);
    }

    return (
        <>
        <table className='ihContainer ihDataTable no-footer w-max'>
                
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th colSpan={2} style={{borderBottom: '3px solid #bd916e'}}>#</th>
                    <th></th>
                    <th colSpan={2} style={{borderBottom: '3px solid #bd916e'}}>&Sigma;</th>
                    <th></th>
                </tr>
                <tr className='spacer'>
                    <td style={{width: '5em'}}></td>
                    <td style={{width: '6em'}}></td>
                    <td></td>
                    <td style={{width: '8em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td></td>
                    <td style={{width: '8em'}}></td>
                    <td style={{width: '10em'}}></td>
                    <td style={{width: '.1em'}}></td>
                </tr>
            </thead>
            <tbody>
                {Object.entries(imprintsNodes).map(([lvl, data], i) => 
                    <React.Fragment key={'imprints-f-'+i}>
                    {Object.entries(data).map(([node, value], j) => 
                        <tr key={'imprints-'+i+'-'+j}>
                            <td><Icon size='tiny' src={ImageSrc.layout('imprints-'+node.replace(' ', '-'))} title={node}/></td>
                            <td style={{textAlign: 'left'}}>{node}</td>
                            <td></td>
                            <td style={{textAlign: 'right'}}><BigNumber value={value} /></td>
                            <td></td>
                            <td></td>
                            <td style={{textAlign: 'right'}}>{i === selected+1 && <BigNumber value={nodesSelected[node].sum} />}</td>
                            <td>{i === selected+1 && 
                                
                                <Dropdown key={'nodesSelected-'+node} autoClose={true}
                                    trigger={
                                        <span>{nodesSelected[node].value}/{nodesSelected[node].max}</span>
                                    }>
                                    <div style={{padding: '.5em'}}>
                                        <div style={{fontSize: 'smaller', marginLeft: '.6em', marginRight: '.6em'}}>
                                            {node} Node
                                        </div>
                                        <div className='btn btn-primary' style={{fontSize: 'smaller'}} onClick={() => nodesSelected[node].set(0)}>
                                            {0}
                                        </div>
                                        {_.range(1, nodesSelected[node].max+1, 1).map((value) => 
                                            num('numpad-'+i+'-'+j, value, nodesSelected[node].set))
                                        }
                                    </div>
                                </Dropdown>
                            }
                            </td>
                            <td></td>
                        </tr>
                    )}
                    <tr key={'imprints-'+i} style={{fontSize: 'larger'}} className='highlighted'>
                        <td><Icon size='md' src={ImageSrc.layout('stars-'+lvl)} title={lvl}/></td>
                        <td style={{textAlign: 'left'}}>{_.get(ability, lvl)}</td>
                        <td></td>
                        <td style={{textAlign: 'right'}}><span style={{paddingRight: '.5em'}}>&Sigma;</span><BigNumber value={_.get(imprintsTotal, lvl)} /></td>
                        <td><Icon size='sm' src={ImageSrc.hero('shards/any-puppet', 10)} style={{marginRight: '0'}}/></td>
                        <td></td>
                        <td style={{textAlign: 'right'}}><BigNumber value={sums[i]} /></td>
                        <td>
                            {i === selected
                            ? <FontAwesomeIcon className='btn-role' icon={faCircleChevronLeft} style={{width: '1.5em'}} onClick={() => onSelected(-1)}/>
                            : <FontAwesomeIcon className='btn-role' icon={faCircle} style={{width: '1.5em'}} onClick={() => onSelected(i)}/>
                            }
                            
                        </td>
                        <td></td>
                    </tr>
                    </React.Fragment>
                )}
            </tbody>
        </table>
        </>
    )
}
