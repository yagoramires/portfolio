import React, { useRef, useState, useContext } from 'react';
import { themeContext } from '../../Context';
import emailjs from '@emailjs/browser';
import './Contact.css';

function Contact() {
  const form = useRef();

  const [done, setDone] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_r2j7j39',
        'template_01dwxye',
        form.current,
        'tzz2xnGBz8rIMJyyu',
      )
      .then(
        (result) => {
          console.log(result.text);
          setDone(true);
        },
        (error) => {
          console.log(error.text);
        },
      );
  };
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  return (
    <div className='contact-form'>
      <div className='c-left'>
        <div className='awesome'>
          <span style={{ color: darkMode ? 'white' : '' }}>
            Solicite um orçamento
          </span>
          <span>Me contate..</span>
          <div className='blur c-blur1' style={{ background: '#ABF1FF94' }} />
        </div>
      </div>

      <div className='c-right'>
        <form ref={form} onSubmit={sendEmail}>
          <input
            type='text'
            placeholder='Nome'
            name='user_name'
            className='user'
          />
          <input
            type='text'
            placeholder='E-mail'
            name='user_email'
            className='user'
          />
          <textarea
            type='text'
            placeholder='Mensagem'
            name='message'
            className='user'
          />
          <input type='submit' value='Enviar' className='button' />
          <span className='done' style={{ color: darkMode ? 'white' : '' }}>
            {done && 'Obrigado por entrar em contato!'}
          </span>
          <div
            className='blur c-blur2'
            style={{ background: 'var(--purple)' }}
          />
        </form>
      </div>
    </div>
  );
}

export default Contact;
