import { useState } from 'react';
import { ImagesListType } from 'react-spring-lightbox';
import _ from 'lodash';
import { se_boss_hp } from '../../../data/se';
import { BigNumber } from '../../../components/BigNumber'
import { Dropdown } from '../../../components/Dropdown';
import { Icon, ImageSrc } from '../../../components/Images';
import { ImgGalery, ImgModal, ImgModalLink } from '../../../components/ImgGalery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { minmax } from '../../../components/functions';
import { 
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'

const maps: ImagesListType = [];
for (const index of _.range(1, 8, 1)) {
    maps.push({
        src: ImageSrc.events('se', 'map-' + index),
        loading: 'lazy',
        alt: 'Star Expedition Map ' + index,
    })
}

const imgStyle = {
    width: '840px',
    heigth: 'auto',
    borderRadius: '15px',
}
const imgStyleHalf = {
    ...imgStyle,
    width: '400px',
    display: 'inline-block'
}

export function SEBossHP()  {
    const [bossLevel, setBossLevel] = useState(200);
    const [bossHP, setBossHP] = useState(100);

    const handleFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        event.target.select();
    }

    const maxHP = se_boss_hp(bossLevel);
    const currentHP = maxHP*bossHP/100;

    return (
        <table className='w-max'>
            <thead>
                <tr>
                    <th colSpan={2}>SE Boss HP</th>
                </tr>
                <tr className='spacer'>
                    <td style={{width: '50%'}}></td>
                    <td style={{width: '50%'}}></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        HP:
                        <input className='ih-input in-text-input number' step={1} aria-label={`boss HP %`}
                            type="number" 
                            value={bossHP} 
                            onChange={(e) => setBossHP(Number(e.target.value))}
                            onFocusCapture={handleFocus}
                            style={{width: '3em'}}
                        />
                        %
                    </td>
                    <td>
                        X:
                        <input className='ih-input in-text-input number' step={1} aria-label={`boss HP %`}
                            type="number" 
                            value={bossLevel} 
                            onChange={(e) => setBossLevel(minmax(1, Number(e.target.value), 200))}
                            onFocusCapture={handleFocus}
                            style={{width: '3em'}}
                        />
                        &nbsp;
                        <Dropdown autoClose={true} display='inline-block' dropdownWidth={440}
                            trigger={
                                <span><FontAwesomeIcon icon={faChevronDown} style={{width: '1em'}} className='btn-role' title='select hero level'/></span>
                            }>
                            <div style={{padding: '.5em', paddingTop: '.25em'}}>
                                {_.range(200, 0, -1).map((val) => 
                                    <div key={'numpad-'+val} className='btn btn-primary' 
                                        style={{visibility: val === 0 ? 'hidden' : undefined,  display: 'inline-block', padding: '0', width: '9.5%', fontSize: 'smaller'}} 
                                        onClick={() => setBossLevel(val)}>
                                        {val}
                                    </div>
                                )}
                            </div>
                        </Dropdown>
                    </td>
                </tr>
                <tr>
                    <td colSpan={3} style={{textAlign: 'start'}} >
                        <div style={{width: '90%', height: '1em', backgroundColor: '#624438', display: 'inline-block', margin: '0 5%', border: '4px solid #8F5C2A', borderRadius: '30px', overflow: 'hidden'}}>
                            <div style={{width: `${minmax(0, bossHP, 100)}%`, height: '100%', backgroundColor: '#D3433C', display: 'inline-block', margin: 0}}>&nbsp;</div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><span style={{textDecoration: 'underline'}}>Current HP:</span> {currentHP.toExponential(2)}</td>
                    <td><span style={{textDecoration: 'underline'}}>Full HP:</span> {maxHP.toExponential(2)}</td>
                </tr>
                <tr>
                    <td><BigNumber value={currentHP} zero/></td>
                    <td><BigNumber value={maxHP} zero/></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    )
}

export function EventsSE()  {
    const [galeryIsOpen, setGaleryIsOpen] = useState(false);
    const [currentImageIndex, setCurrentIndex] = useState(0);
    return (
        <>
        <div>
            <ImgGalery 
                images={maps} 
                showIndex={currentImageIndex}
                isOpen={galeryIsOpen} onClose={() => setGaleryIsOpen(false)}
            />
            <div className='ihContainer icons-picker horizontal'>
                {maps.map((map, i) => 
                    <Icon
                        key={`se-map-${i}`}
                        src={map.src} title={map.alt}
                        size='preview-l'
                        onClick={() => { setCurrentIndex(i); setGaleryIsOpen(!galeryIsOpen);}} />
                )}
            </div>
        </div>
        <div className='ihContainer'>
            <SEBossHP />
        </div>
        <div className='ihContainer'>
            <ImgModal src={ImageSrc.events('se', 'imprints-wide')} alt='Star Imprints' style={imgStyle}/>
            <ImgModalLink src={ImageSrc.events('se', 'imprints-2')} alt='Star Imprints (2 piece sets)' text='Star Imprints (2 piece sets)'/>
        </div>
        <div className='ihContainer'>
            <ImgModal src={ImageSrc.events('se', 'boss')} alt='Abyss Catastrophe' style={imgStyle}/>
            <div className='line-delimiter'/>
            <ImgModal src={ImageSrc.events('se', 'boss2')} alt='Abyss Catastrophe (difficult)' style={imgStyle}/>
            <ImgModalLink src={ImageSrc.events('se', 'blessing-tldr')} alt='Star Blessing (TLDR)' text='Star Blessing (TLDR)'/>
        </div>
      </>
    );
};
