import { useState } from 'react';
import { ImageSrc } from '../../../components/Images';
import { ImgGalery } from '../../../components/ImgGalery';
import { ImagesListType } from 'react-spring-lightbox';
import _ from 'lodash';

import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { FFtoggle, FFratio, selectFFRewards } from './slice';

const images: ImagesListType = [];
for (const index of _.range(1, 6, 1)) {
    images.push({
        src: ImageSrc.raw(`events/jigsaw-${index}`),
        loading: 'lazy',
        alt: 'Jigsaw Puzzle Solution',
    })
}

export function EventsFF() {
    const state = useAppSelector(selectFFRewards);
    const dispatch = useAppDispatch();

    const [galeryIsOpen, setGaleryIsOpen] = useState(false);

    const imgW = 600;
    const imgH = 708;
    const tableMarginL = imgW*0.105;
    const tableMarginR = imgW*0.1;
    const tableMarginT = imgH*0.16;
    const tableMarginB = imgH*0.11;

    const containerSize = {
        height: `${imgH}px`,
    };
    const wrapperSize = {
        marginLeft: `calc((100% - ${imgW}px)/2)`,
    };
    const imgSize = {
        width: `${imgW}px`,
        height: `${imgH}px`,
    };
    const tableRect = {
        width: `${imgW-tableMarginL-tableMarginR}px`,
        height: `${imgH-tableMarginT-tableMarginB}px`,
        marginLeft: `${tableMarginL}px`,
        marginRight: `${tableMarginR}px`,
        marginTop: `${tableMarginT}px`,
        marginBottom: `${tableMarginB}px`,
        //backgroundColor: 'rgba(0, 1, 0, 0.7)',
        borderSpacing: '7px',
    };
    const tdBase = {
        borderRadius: '10px',
        cursor: 'pointer',
    }
    const tdOff = {
        ...tdBase,
        //border: '7px solid gray',
        backgroundColor: 'rgba(0, 1, 0, 0.3)',
    }
    const tdOn = {
        ...tdBase,
        //border: '7px solid green',
    }

    const infoStyle = {
        border: '2px solid gray',
        width: `${imgW*0.6}px`,
        height: `1.1em`,
        left: `${imgW*0.18}px`,
        top: `${imgH*0.085}px`,
    };

    const itemsX = Array(7).fill(0);
    const itemsY = Array(3).fill(0);

    const costs = {
        '0-0': 10, '0-1': 10, '0-2': 10,
        '1-0': 40, '1-1': 30, '1-2': 40,
        '2-0': 55, '2-1': 45, '2-2': 60,
        '3-0': 260, '3-1': 245, '3-2': 100,
        '4-0': 600, '4-1': 800, '4-2': 200,
        '5-0': 400, '5-1': 400, '5-2': 400,
        '6-0': 360, '6-1': 360, '6-2': 4,
    }

    var stars = 0;
    for (const [key, cost] of Object.entries(costs)) {
        if (state.items[key]) stars += cost;
    }

    var currency = Math.floor(stars / state.ratio);

    return (
        <div>
        <div className='ihContainer' style={containerSize}>
            <div className='relative-container' style={wrapperSize}>
                <img className='floating-overlay' src={ImageSrc.layout('FF')} alt={`Go to item.title`} style={imgSize} />
                <table className='floating-overlay' style={tableRect}>
                    <tbody>
                    {itemsX.map((_, x) => 
                        <tr key={x}>
                        {itemsY.map((_, y) => 
                            <td key={y} style={state.items[`${x}-${y}`] ? tdOn : tdOff} onClick={() => dispatch(FFtoggle(`${x}-${y}`))}></td>
                        )}
                        </tr>
                    )}
                    </tbody>
                </table>
                <div className='floating-overlay ihContainer' style={infoStyle}>
                    <div style={{width: '50%', display: 'inline-block', textAlign: 'right'}}>
                        Used {stars} ★
                    </div>
                    <div style={{width: '50%', display: 'inline-block', textAlign: 'left'}}>
                        &nbsp;/&nbsp;
                        <input className='ih-input number' aria-label={`Star count to get currency`}
                            type="number" 
                            value={state.ratio} 
                            onChange={(e) => dispatch(FFratio(Number(e.target.value)))}
                            style={{width: '2em', fontSize: '.9em'}}
                        />
                        &nbsp;=&nbsp; {currency}
                    </div>
                </div>
            </div>
        </div>
        <div className='ihContainer'>
            <ImgGalery images={images} showIndex={0} isOpen={galeryIsOpen} onClose={() => setGaleryIsOpen(false)}/>
            <span className='btn-role' onClick={() => setGaleryIsOpen(!galeryIsOpen)}>
                Jigsaw Puzzle Solutions (214-234)
            </span>
            
        </div>
        </div>
    );
}

