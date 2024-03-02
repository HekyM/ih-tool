import { useState } from 'react';
import { ImagesListType } from 'react-spring-lightbox';
import _ from 'lodash';


import { Icon, ImageSrc } from '../../../components/Images';
import { ImgGalery, ImgModal, ImgModalLink } from '../../../components/ImgGalery';

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
