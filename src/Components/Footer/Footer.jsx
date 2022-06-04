/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import './Footer.css';
import Wave from '../../img/wave.png';

import Insta from '@iconscout/react-unicons/icons/uil-instagram';
import Linkedin from '@iconscout/react-unicons/icons/uil-linkedin';
import Github from '@iconscout/react-unicons/icons/uil-github';

function Footer() {
  return (
    <div className='footer'>
      <img src={Wave} alt='' style={{ width: '100%' }} />
      <div className='f-content'>
        <span>yago.ramiresx@gmail.com</span>
        <div className='f-icons'>
          <a href='https://www.instagram.com/yago.rmdr/' target='_blank'>
            <Insta color='white' size='3rem' />
          </a>
          <a href='https://www.linkedin.com/in/yagoramires/' target='_blank'>
            <Linkedin color='white' size='3rem' />
          </a>
          <a href='https://github.com/yagoramires' target='_blank'>
            <Github color='white' size='3rem' />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
