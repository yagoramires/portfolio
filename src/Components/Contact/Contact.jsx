import React, { useRef, useState } from 'react';
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

  return (
    <div className='contact-form'>
      <div className='c-left'>
        <div className='awesome'>
          <span>Get in Touch</span>
          <span>Contact Me</span>
          <div className='blur c-blur1' style={{ background: '#ABF1FF94' }} />
        </div>
      </div>

      <div className='c-right'>
        <form ref={form} onSubmit={sendEmail}>
          <input
            type='text'
            placeholder='Name'
            name='user_name'
            className='user'
          />
          <input
            type='text'
            placeholder='Email'
            name='user_email'
            className='user'
          />
          <textarea
            type='text'
            placeholder='Message'
            name='message'
            className='user'
          />
          <input type='submit' value='Send' className='button' />
          <span className='done'>{done && 'Thanks for contacting me!'}</span>
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
