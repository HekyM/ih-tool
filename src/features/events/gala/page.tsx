import React, { useState } from 'react';
import { Chart } from "react-google-charts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { Icon, ImageSrc } from '../../../components/Images';
import { sum } from 'lodash';

import { galaGoogleData, gataCartViewWindow } from '../../../data/gala';

const awakensTiers = ['E-', 'E', 'E+', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'S'];
const awakensPercent = {
    'SG': [4.3, 19.8, 28.8, 20, 9.2, 4.8, 4.4, 4.3, 2.13, 1.62, 0.55, 0.0745, 0.015, 0.0065, 0.0025, 0.0015],
    //'..': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'B-': [0, 0, 0, 0, 0, 0, 0, 0, 0, 90.10575, 8, 1.5, 0.3, 0.065, 0.025, 0.00425],
    'B' : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 92.0295, 7, 0.7, 0.15, 0.1, 0.0205],
    'B+': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 95.485, 3.5, 0.75, 0.2, 0.065],
    'A-': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97.053, 2.5, 0.3, 0.147],
    'A' : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 98.005, 1.5, 0.495],
    'A+': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99.01, 0.99],
    //S: 99.61, 0.3, 0.09
};

const floadNumner = (key: string, value: number) => {
    if (value === 0) return <React.Fragment key={key}><td></td><td></td></React.Fragment>
    var numarray=value.toString().split('.')
    return <React.Fragment key={key}><td className='cellL'>{numarray[0]}</td><td className='cellR'>.{numarray[1] || 0}</td></React.Fragment>
}

export function Awakens() {
    const sumsGK = Object.fromEntries(Object
        .entries(awakensPercent)
        .map(([k, o]) => [k, sum(Object.values(o).slice(12))])
    );

    return (
        <table className='ihDataTable no-footer w-max'>    
            <thead>
                <tr>
                    <th>%</th>
                    {awakensTiers.slice(9).map((tier, i) => 
                        <th colSpan={2} key={'tier-'+tier}><Icon size='sm' src={ImageSrc.events('awakens', 'tier-'+tier)}  title={tier+' Awakening'}/></th>
                    )}
                    <th title='Total change for Giant Killer (A|S-tier)'>GK</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(awakensPercent).map(([stone, data], i) =>
                    <tr key={'stone-'+stone}>
                        <td><Icon size='sm' src={ImageSrc.events('awakens', 'stone-'+stone)}  title={stone+' Stone'}/></td>
                        {data.slice(9).map((value, i) => 
                            floadNumner('p-'+i, value)
                        )}
                        <td>{ Math.round(sumsGK[stone]* 1000)/1000}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}


const galaChartConfig = {
    title: "CSG requirements",
    titleTextStyle: {
        fontSize: '20',
    },
    curveType: "function",
    legend: { position: "bottom" },
    backgroundColor: '#ecdfbf',
    colors:['#d2a00b','#9900ff', '#2cd32c'],
    tooltip: {showColorCode: true},
    /*explorer: {
        maxZoomIn: 0.1,
        maxZoomOut: 1,
        keepInBounds: true,
    },*/
    vAxis: {
        minValue: 0,
        maxValue: 100,
        viewWindow: {min: 0, max: 100},
        title: "RNG [%]",
        gridlineColor: 'gray',
    },
    hAxis: {
        title: "CSG [#] (retire up to ...)",
        gridlineColor: 'gray',
    },
    series: {
        0: {lineWidth: 4},
        1: {lineWidth: 4},
        2: {lineWidth: 4},
        3: {lineWidth: 2, lineDashStyle: [10, 2]},
        4: {lineWidth: 2, lineDashStyle: [10, 2]},
        5: {lineWidth: 2, lineDashStyle: [10, 2]},
    },
    chartArea:{left:55,width:"90%"},
};

function GalaPointsChart(props: {points: number, data: any[][], with_b_stone: boolean}) {
    let title = props.points.toString()
    if (props.with_b_stone) 
        title = `${props.points} / ${props.points - 13} +  B-stone`

    return (
        <div className="fixed-height-chart">
        <Chart
            chartType="LineChart"
            width="100%"
            height="100%"
            data={props.data}
            options={{...galaChartConfig, title: title}}
        />
        </div>  
    )
}

//|events|awaken|B stone|ticket|artefact|B/B+|A-|subs|core|
//|:-|:-|:-|:-|:-|:-|:-|:-|:-|
//|3x200|95|3|3|3|\+1(92/7%)|5.16%|135||
//|2x300|97|2|2|2||4.28%|90 - 270|0 - 100|
export function EventsGala() {
    const [showPoints, setShowPoints] = useState(300);

    return (
        <div>
        <div className='ihContainer'>
            <div>
                <span>Target Points:</span>
                {Object.keys(gataCartViewWindow).map((points) => 
                    <button className={'btn btn-toggle'+(Number(points)===showPoints? " active" : "")} key={'gala-'+points}
                    style={{margin: ".2em", width: "2.5em"}} 
                    onClick={()=>setShowPoints(Number(points))}>
                        {points}
                    </button>
                )}
            </div>
            <GalaPointsChart points={showPoints} data={galaGoogleData[showPoints]} with_b_stone={showPoints != 60 && showPoints != 600}/>
        </div>
        <div className='ihContainer'>
            <Awakens/>
        </div>
        <div className='ihContainer'>
            <b>200 vs 300 points in Gala events</b>

            <table className='ihContainer ihDataTable no-footer w-max'>
                <thead>
                    <tr><td>events</td><td>awakens</td><td>B stone</td><td>ticket</td><td>artefact</td><td>A- ++</td><td>subs</td><td>core</td></tr>
                </thead>
                <tbody>
                    <tr><td>3x200</td><td>95</td><td>3</td><td>3</td><td>3</td><td>5.16%</td><td>135</td><td></td></tr>
                    <tr><td>2x300</td><td>97</td><td>2</td><td>2</td><td>2</td><td>4.28%</td><td>90 - 270</td><td>0 - 100</td></tr>
                </tbody>
            </table>
        </div>
        <div className='ihContainer'>
            <a href="https://www.reddit.com/r/IdleHeroes/comments/xqb2j5/soulawakening_gala_20_average_starry_gems_needed/?utm_source=share&utm_medium=web2x&context=3" 
               target="_blank" rel="noopener noreferrer" style={{fontSize: 'smaller'}}>u/Aequitaaa Soul-Awakening Gala 2.0 <FontAwesomeIcon icon={faUpRightFromSquare} /></a>
        </div>
        </div>
    );
}