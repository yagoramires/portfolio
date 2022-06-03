import React from 'react';
import './Services.css';
import HeartEmoji from '../../img/heartemoji.png';
import Glasses from '../../img/glasses.png';
import Humble from '../../img/humble.png';
import Card from '../Card/Card';
import CV from './cv.pdf';

function Services() {
  return (
    <div className='services'>
      <div className='awesome'>
        <span>My Awesome</span>
        <span>Services</span>
        <span>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam{' '}
          <br />
          tenetur laudantium cumque similique?
        </span>
        <a href={CV} download>
          <button className='button s-button'>Download CV</button>
        </a>
        <div className='blur s-blur1' style={{ background: '#ABF1FF94' }} />
      </div>
      <div className='cards'>
        <div style={{ left: '14rem' }}>
          <Card
            emoji={HeartEmoji}
            heading={'Design'}
            detail={'Figma, Sketch, Photoshop, Adobe'}
          />
        </div>

        <div style={{ top: '12rem', left: '-4rem' }}>
          <Card
            emoji={Glasses}
            heading={'Developer'}
            detail={'Html, CSS, JavaScript, React'}
          />
        </div>
        <div style={{ top: '19rem', left: '12rem' }}>
          <Card
            emoji={Humble}
            heading={'UI/UX'}
            detail={'Modern UI and UX development'}
          />
        </div>
        <div className='blur s-blur2' style={{ background: 'var(--purple)' }} />
      </div>
    </div>
  );
}

export default Services;
