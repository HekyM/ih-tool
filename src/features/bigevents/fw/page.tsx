import { useState } from 'react';
import { ImagesListType } from 'react-spring-lightbox';
import _ from 'lodash';


import { Icon, ImageSrc } from '../../../components/Images';
import { ImgGalery } from '../../../components/ImgGalery';

const maps: ImagesListType = [];
const bosses = ['Warrior', 'Mage', 'Assassin', 'Ranger', 'Priest']
for (const boss of bosses) {
    maps.push({
        src: ImageSrc.events('fw', 'boss-' + boss),
        loading: 'lazy',
        alt: boss + ' Elite Boss',
    })
}

export function EventsFW()  {
    const [galeryIsOpen, setGaleryIsOpen] = useState(false);
    const [currentImageIndex, setCurrentIndex] = useState(0);
    const imgStyle = {
        width: '160px',
        heigth: 'auto',
        borderRadius: '15px',
    }
    return (
        <>
        <div>
            <div className='ihContainer'>
                <div>Danger Level</div>
                <Icon
                    src={ImageSrc.events('fw', 'danger')}
                    style={{height: 'auto', width: '850px'}} />
                <ImgGalery 
                    images={maps} 
                    showIndex={currentImageIndex}
                    isOpen={galeryIsOpen} onClose={() => setGaleryIsOpen(false)}
                />
            </div>
            <div className='ihContainer icons-picker horizontal'>
                <div>Elite Bosses</div>
                {maps.map((map, i) => 
                    <Icon
                        key={`fw-boss-${i}`}
                        src={map.src} title={map.alt}
                        size='preview-l'
                        style={{...imgStyle}}
                        onClick={() => { setCurrentIndex(i); setGaleryIsOpen(!galeryIsOpen);}} />
                )}
            </div>
        </div>
      </>
    );
};
