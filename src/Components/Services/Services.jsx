import React, { useContext } from 'react';
import { themeContext } from '../../Context';
import './Services.css';
import HeartEmoji from '../../img/heartemoji.png';
import Glasses from '../../img/glasses.png';
import Humble from '../../img/humble.png';
import Card from '../Card/Card';
import CV from './cv.pdf';
import { motion } from 'framer-motion';

function Services() {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  const transition = { duration: 2, type: 'spring' };

  return (
    <div className='services' id='Services'>
      <div className='awesome'>
        <span style={{ color: darkMode ? 'white' : '' }}>Meus incríveis</span>
        <span>Serviços</span>
        <span style={{ color: darkMode ? 'white' : '' }}>
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
        <motion.div
          initial={{ left: '-36%' }}
          whileInView={{ left: '14rem' }}
          transition={transition}
          style={{ left: '14rem' }}
        >
          <Card
            emoji={HeartEmoji}
            heading={'Front End'}
            detail={'HTML, CSS, JavaScript'}
          />
        </motion.div>

        <motion.div
          initial={{ left: '24rem' }}
          whileInView={{ top: '12rem', left: '-4rem' }}
          transition={transition}
          style={{ top: '12rem', left: '-4rem' }}
        >
          <Card
            emoji={Glasses}
            heading={'Frameworks'}
            detail={'React, TypeScript'}
          />
        </motion.div>
        <motion.div
          initial={{ left: '-12rem' }}
          whileInView={{ top: '19rem', left: '12rem' }}
          transition={transition}
          style={{ top: '19rem', left: '12rem' }}
        >
          <Card
            emoji={Humble}
            heading={'Design'}
            detail={'Modern UI and UX development'}
          />
        </motion.div>
        <div className='blur s-blur2' style={{ background: 'var(--purple)' }} />
      </div>
    </div>
  );
}

export default Services;
