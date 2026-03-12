import { ImageSrc } from '../../../components/Images';
import { ImgModal } from '../../../components/ImgGalery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'


export function EtherealRealm()  {
    const imgStyle = {
        width: '840px',
        heigth: 'auto',
        borderRadius: '15px',
    }
    const imgStyle2 = {
        ...imgStyle,
        width: '620px',
        display: 'inline-block'
    }
    return (
        <>
        <div className='ihContainer'>
            <ImgModal src={ImageSrc.events('ethereal-realm', 'Resources')} alt='Ethereal Realm Resources' style={imgStyle}/>
            <div className='delimiter-md' />
            <ImgModal src={ImageSrc.events('ethereal-realm', 'Buildings')} alt='Ethereal Realm Buildings' style={imgStyle}/>
            <div className='delimiter-md' />
            <ImgModal src={ImageSrc.events('ethereal-realm', 'Solders')} alt='Ethereal Realm Solders' style={imgStyle}/>
            <div className='delimiter-md' />
            <ImgModal src={ImageSrc.events('ethereal-realm', 'pve')} alt='Ethereal Realm PvE Rewards' style={imgStyle}/>
            <div className='delimiter-md' />
            <ImgModal src={ImageSrc.events('ethereal-realm', 'pvp')} alt='Ethereal Realm PvP Rewards' style={imgStyle}/>
        </div>
        <div className='ihContainer'>
            <a href="https://www.reddit.com/r/IdleHeroes/comments/1ddia01/ethereal_realm_wtf_guide/" 
                target="_blank" rel="noopener noreferrer" style={{fontSize: 'smaller'}}>Reddit <FontAwesomeIcon icon={faUpRightFromSquare} /></a>
        </div>
      </>
    );
};
