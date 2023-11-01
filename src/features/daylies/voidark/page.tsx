import { useState } from 'react';
import { ImagesListType } from 'react-spring-lightbox';
import _ from 'lodash';


import { Icon, ImageSrc } from '../../../components/Images';
import { ImgGalery, ImgModal } from '../../../components/ImgGalery';

const images: ImagesListType = [];
for (const index of _.range(1, 16, 1)) {
    images.push({
        src: ImageSrc.raw(`void/eggs-detail/egg-map-os${index}`),
        loading: 'lazy',
        alt: 'Egg location',
    })
}

const imgStyle = {
    width: '840px',
    heigth: 'auto',
    borderRadius: '5px',
}

export function Eggs()  {
    const [galeryIsOpen, setGaleryIsOpen] = useState(false);
    const [currentImageIndex, setCurrentIndex] = useState(0);
    return (
        <>
        <div>
            <ImgGalery 
                images={images} 
                showIndex={currentImageIndex}
                isOpen={galeryIsOpen} onClose={() => setGaleryIsOpen(false)}
            />
            <div className='ihContainer icons-picker horizontal'>
                {images.map((egg, i) => 
                    <Icon
                        key={`egg-map-${i}`}
                        src={ImageSrc.raw(`void/eggs/egg-map-os${i+1}`)} title={egg.alt}
                        size='preview'
                        onClick={() => { setCurrentIndex(i); setGaleryIsOpen(!galeryIsOpen);}} />
                )}
            </div>
        </div>
        <div className='ihContainer'>
            <ImgModal src={ImageSrc.raw('others/void-ark-expedition')} alt='Void Ark Expedition' style={imgStyle}/>
        </div>
      </>
    );
};
