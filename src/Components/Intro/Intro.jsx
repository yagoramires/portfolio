/* eslint-disable react/jsx-no-target-blank */
import React, { useContext } from 'react';
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
import { themeContext } from '../../Context';
import { motion } from 'framer-motion';

function Intro() {
  const transition = { duration: 2, type: 'spring' };

  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  return (
    <div className='intro' id='Navbar'>
      <div className='i-left'>
        <div className='i-name'>
          <span style={{ color: darkMode ? 'white' : '' }}>Olá! Eu sou</span>
          <span>Yago Ramires</span>
          <span style={{ color: darkMode ? 'white' : '' }}>
            Desenvolvedor Front-End procurando uma oportunidade de atuar em
            <br />
            uma boa empresa, para demonstrar minha capacidade e adquirir cada
            <br />
            vez mais conhecimentos na área.
          </span>
        </div>

        <button className='button i-button'>Me contrate</button>

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
        <motion.img
          initial={{ left: '-36%' }}
          whileInView={{ left: '-24%' }}
          transition={transition}
          src={glassesimoji}
          alt='instagram'
        />
        <motion.div
          initial={{ top: '-4%', left: '74%' }}
          whileInView={{ left: '68%' }}
          transition={transition}
          style={{ top: '-4%', left: '48%' }}
          className='floating-div'
        >
          <FloatingDiv image={Crown} txt1='Web' txt2='Developer' />
        </motion.div>
        <motion.div
          initial={{ top: '21.3rem', left: '9rem' }}
          whileInView={{ left: '3%' }}
          transition={transition}
          style={{
            top: '21.3rem',
            left: '3%',
          }}
          className='floating-div'
        >
          <FloatingDiv image={thumbup} txt1='Front-End' txt2='Developer' />
        </motion.div>

        <div className='blur' style={{ background: 'rgb(238 210 255)' }}></div>
        <div
          className='blur'
          style={{
            background: '#C1F5FF',
            height: '11rem',
            width: '21rem',
            top: '18rem',
            left: '-9rem',
          }}
        />
      </div>
    </div>
  );
}

export default Intro;
