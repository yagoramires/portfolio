/* eslint-disable react/jsx-no-target-blank */
import React, { useContext } from 'react';
import { themeContext } from '../../Context';
import './Footer.css';
import Wave from '../../img/wave.png';

import Insta from '@iconscout/react-unicons/icons/uil-instagram';
import Linkedin from '@iconscout/react-unicons/icons/uil-linkedin';
import Github from '@iconscout/react-unicons/icons/uil-github';

function Footer() {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  return (
    <div className='footer'>
      <img src={Wave} alt='' style={{ width: '100%' }} />
      <div
        className='f-content'
        style={{ color: darkMode ? 'var(--black)' : '' }}
      >
        <span>yago.ramiresx@gmail.com</span>
        <div className='f-icons'>
          <a href='https://www.instagram.com/yago.rmdr/' target='_blank'>
            <Insta color={darkMode ? 'var(--black)' : 'white'} size='3rem' />
          </a>
          <a href='https://www.linkedin.com/in/yagoramires/' target='_blank'>
            <Linkedin color={darkMode ? 'var(--black)' : 'white'} size='3rem' />
          </a>
          <a href='https://github.com/yagoramires' target='_blank'>
            <Github color={darkMode ? 'var(--black)' : 'white'} size='3rem' />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
