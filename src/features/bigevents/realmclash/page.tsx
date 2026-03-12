import { ImageSrc } from '../../../components/Images';
import { ImgModal } from '../../../components/ImgGalery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'


export function EventsRealmClash()  {
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
            <ImgModal src={ImageSrc.events('realm-clash', 'Phases')} alt='Realm Clash Phases' style={imgStyle2}/>
            <div className='delimiter-md' />
            <ImgModal src={ImageSrc.events('realm-clash', 'Boss')} alt='Realm Clash Boss' style={imgStyle}/>
            <div className='delimiter-md' />
            <ImgModal src={ImageSrc.events('realm-clash', 'Map')} alt='Realm Clash Map' style={imgStyle}/>
            <div className='delimiter-md' />
            <ImgModal src={ImageSrc.events('realm-clash', 'Returning')} alt='Realm Clash Returning Rankings' style={imgStyle2}/>
            <ImgModal src={ImageSrc.events('realm-clash', 'Rewards')} alt='Realm Clash Rewards' style={imgStyle2}/>
            <div className='delimiter-md' />
            <ImgModal src={ImageSrc.events('realm-clash', 'Airship')} alt='Realm Clash Airship' style={imgStyle2}/>
        </div>
        <div className='ihContainer'>
            <a href="https://www.reddit.com/r/IdleHeroes/comments/1i5a8sz/ethereal_realm_realm_clash/" 
                target="_blank" rel="noopener noreferrer" style={{fontSize: 'smaller'}}>Reddit <FontAwesomeIcon icon={faUpRightFromSquare} /></a>
        </div>
      </>
    );
};
