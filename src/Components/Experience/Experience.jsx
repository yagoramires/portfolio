import React, { useContext } from 'react';
import { themeContext } from '../../Context';
import './Experience.css';

function Experience() {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  return (
    <div className='experience' id='Experience'>
      <div className='achievement'>
        <div
          className='circle'
          style={{ color: darkMode ? 'var(--black)' : '' }}
        >
          6
        </div>
        <span>meses de</span>
        <span>Experiência</span>
      </div>
      <div className='achievement'>
        <div
          className='circle'
          style={{ color: darkMode ? 'var(--black)' : '' }}
        >
          7
        </div>
        <span>projetos</span>
        <span>Completos</span>
      </div>
      <div className='achievement'>
        <div
          className='circle'
          style={{ color: darkMode ? 'var(--black)' : '' }}
        >
          1
        </div>
        <span>contrato</span>
        <span>Empresarial</span>
      </div>
    </div>
  );
}

export default Experience;
