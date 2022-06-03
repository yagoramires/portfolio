/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import './Intro.css';
import FloatingDiv from '../FloatingDiv/FloatingDiv';
import Github from '../../img/github.png';
import Linkedin from '../../img/linkedin.png';
import Instagram from '../../img/instagram.png';
import Vector1 from '../../img/Vector1.png';
import Vector2 from '../../img/Vector2.png';
import boy from '../../img/boy.png';
import thumbup from '../../img/thumbup.png';
import Crown from '../../img/crown.png';
import glassesimoji from '../../img/glassesimoji.png';

function Intro() {
  return (
    <div className='intro'>
      <div className='i-left'>
        <div className='i-name'>
          <span>Hi! I Am</span>
          <span>Yago Ramires</span>
          <span>
            Frontend Developer with high level of experience in web designing
            and development, producting the Quality work
          </span>
        </div>

        <button className='button i-button'>Hire me</button>

        <div className='i-icons'>
          <a href='https://github.com/yagoramires' target='_blank'>
            <img src={Github} alt='github' />
          </a>
          <a href='https://www.linkedin.com/in/yagoramires/' target='_blank'>
            <img src={Linkedin} alt='linkedin' />
          </a>
          <a href='https://www.instagram.com/yago.rmdr/' target='_blank'>
            <img src={Instagram} alt='instagram' />
          </a>
        </div>
      </div>
      <div className='i-right'>
        <img src={Vector1} alt='vector' />
        <img src={Vector2} alt='vector' />
        <img src={boy} alt='boy' />
        <img src={glassesimoji} alt='instagram' />
        <div style={{ top: '-4%', left: '48%' }}>
          <FloatingDiv image={Crown} txt1='Web' txt2='Developer' />
        </div>
        <div style={{ top: '21.3rem', left: '3%' }}>
          <FloatingDiv image={thumbup} txt1='Front-End' txt2='Developer' />
        </div>
      </div>
    </div>
  );
}

export default Intro;
