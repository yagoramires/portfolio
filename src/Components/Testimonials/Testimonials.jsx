import React, { useContext } from 'react';
import { themeContext } from '../../Context';
import './Testimonials.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/css/pagination';
import 'swiper/css';
import profilePic1 from '../../img/profile1.jpg';
import profilePic2 from '../../img/profile2.jpg';
import profilePic3 from '../../img/profile3.jpg';
import profilePic4 from '../../img/profile4.jpg';

function Testimonials() {
  const clients = [
    {
      img: profilePic1,
      review:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde natus incidunt saepe est. Commodi totam autem et, reprehenderit cum in molestiae hic, quisquam dolorem velit dolor amet, ipsa quo. Dolores. ',
    },
    {
      img: profilePic2,
      review:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde natus incidunt saepe est. Commodi totam autem et, reprehenderit cum in molestiae hic, quisquam dolorem velit dolor amet, ipsa quo. Dolores. ',
    },
    {
      img: profilePic3,
      review:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde natus incidunt saepe est. Commodi totam autem et, reprehenderit cum in molestiae hic, quisquam dolorem velit dolor amet, ipsa quo. Dolores. ',
    },
    {
      img: profilePic4,
      review:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde natus incidunt saepe est. Commodi totam autem et, reprehenderit cum in molestiae hic, quisquam dolorem velit dolor amet, ipsa quo. Dolores. ',
    },
  ];

  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  return (
    <div className='testimonials' id='Testimonials'>
      <div className='t-wrapper'>
        <div className='t-heading'>
          <span>Clientes sempre recebem</span>
          <span> um trabalho excepcional </span>
          <span>de mim...</span>

          <div
            className='blur t-blur1'
            style={{ background: 'var(--purple)' }}
          />
          <div className='blur t-blur2' style={{ background: 'skyblue' }} />
        </div>
        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          pagination={{ clickable: true }}
        >
          {clients.map((client, index) => {
            return (
              <SwiperSlide key={index}>
                <div className='testimonial'>
                  <img src={client.img} alt='' />
                  <span style={{ color: darkMode ? 'white' : '' }}>
                    {client.review}
                  </span>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default Testimonials;
