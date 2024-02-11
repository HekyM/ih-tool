import { NavLink } from 'react-router-dom';
import { Icon, ImageSrc } from '../../components/Images';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { settings, NumbersStyle, setNumbersStyle } from '../SettingsSlice';

export const sidebarItems = [
    {
        title: 'Home',
        path: '/',
        icon: ImageSrc.layout('clock')
    },
    {
        title: 'Heroes',
        path: '/heroes',
        icon: ImageSrc.layout('heros')
    },
    {
        title: 'Tenants',
        path: '/tenants',
        icon: ImageSrc.layout('tenants')
    },
    {
        title: 'Events',
        path: '/events',
        icon: ImageSrc.layout('events2')
    },
    {
        title: 'Level Up',
        path: '/lvl',
        icon: ImageSrc.layout('lvlup')
    },
    {
        title: 'Daylies',
        path: '/daylies',
        icon: ImageSrc.layout('daylies')
    },
    {
        title: 'Big Events',
        path: '/bigevents',
        icon: ImageSrc.event('m')
    },
    {
        title: 'Others',
        path: '/others',
        icon: ImageSrc.layout('images')
    },
]

export function Menu() {
    const appSettings = useAppSelector(settings);
    const dispatch = useAppDispatch();
    return (
        <div id='menu' className='ihContainer'>
            { sidebarItems.map((item,i) =>
                 <NavLink end className='menuItem' key={i} to={item.path}>
                     <Icon size='sm' src={item.icon} alt={'Go to ' + item.title} /><span className='menuText'>{item.title}</span>
                </NavLink>
            ) }
            <select id="numbersSettings" name="numbers" style={{fontSize: 'smaller', marginBottom: '1em', borderRadius: '5px'}} value={appSettings.numbers} onChange={e => dispatch(setNumbersStyle(e.target.value as NumbersStyle))}>
                <option value="short"># short</option>
                <option value="long"># long</option>
                <option value="plain"># plain</option>
                <option value="longUS"># long-US</option>
            </select>
        </div>
    );
}