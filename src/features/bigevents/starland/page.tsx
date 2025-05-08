import { useState } from 'react';
import { ImagesListType } from 'react-spring-lightbox';
import _ from 'lodash';


import { Icon, ImageSrc } from '../../../components/Images';
import { ImgGalery } from '../../../components/ImgGalery';

const maps: ImagesListType = [];
for (const index of _.range(1, 5, 1)) {
    maps.push({
        src: ImageSrc.events('starland', 'amulets-' + index),
        loading: 'lazy',
        alt: 'Starland Amulets',
    })
}

/*const imgStyle = {
    width: '840px',
    heigth: 'auto',
    borderRadius: '15px',
}*/

export function EventsStarland()  {
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
                        size='preview-full'
                        onClick={() => { setCurrentIndex(i); setGaleryIsOpen(!galeryIsOpen);}} />
                )}
            </div>
        </div>
      </>
    );
};
