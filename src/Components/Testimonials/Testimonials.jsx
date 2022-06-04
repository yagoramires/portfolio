import React from 'react';
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

  return (
    <div className='testimonials'>
      <div className='t-wrapper'>
        <div className='t-heading'>
          <span>Clients always get</span>
          <span> Exceptional Work </span>
          <span>from me...</span>

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
                  <span>{client.review}</span>
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
