import React, { useContext } from 'react';
import { themeContext } from '../../Context';
import './Card.css';

function Card({ emoji, heading, detail }) {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  return (
    <div className='card'>
      <img src={emoji} alt='emoji' />
      <span>{heading}</span>
      <span style={{ color: darkMode ? 'white' : '' }}>{detail}</span>
      <button
        className='c-button'
        style={{ background: darkMode ? 'var(--black)' : '' }}
      >
        LEARN MORE
      </button>
    </div>
  );
}

export default Card;
