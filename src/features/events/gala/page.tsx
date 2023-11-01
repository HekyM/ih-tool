import { useState } from 'react';
import { Chart } from "react-google-charts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'

import { galaGoogleData } from '../../../data/gala';


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
        title: "CSG",
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
};

function GalaPointsChart(props: {points: number, data: any[][]}) {

    return (
        <div className="fixed-height-chart">
        <Chart
            chartType="LineChart"
            width="100%"
            height="100%"
            data={props.data}
            options={{...galaChartConfig, title: `${props.points} / ${props.points - 13} +  B-stone`}}
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
            <label htmlFor="gala-points-select">Points:</label>
            <select id='gala-points-select' name='Points' value={showPoints} onChange={(e) => setShowPoints(Number(e.target.value))}>
                <option value={150}>150</option>
                <option value={200}>200</option>
                <option value={300}>300</option>
            </select>
            <GalaPointsChart points={showPoints} data={galaGoogleData[showPoints]} />
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