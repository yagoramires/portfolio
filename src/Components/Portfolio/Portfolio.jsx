import React, { useContext } from 'react';
import { themeContext } from '../../Context';
import './Portfolio.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Sidebar from '../../img/sidebar.png';
import Ecommerce from '../../img/ecommerce.png';
import HOC from '../../img/hoc.png';
import MusicApp from '../../img/musicapp.png';

function Portfolio() {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  return (
    <div className='portfolio' id='Portfolio'>
      <span style={{ color: darkMode ? 'white' : '' }}>Projetos Recentes</span>
      <span>Portfólio</span>

      <Swiper slidesPerView={3} grabCursor={true} className='portfolio-slider'>
        <SwiperSlide>
          <img src={Sidebar} alt='' />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Ecommerce} alt='' />
        </SwiperSlide>
        <SwiperSlide>
          <img src={HOC} alt='' />
        </SwiperSlide>
        <SwiperSlide>
          <img src={MusicApp} alt='' />
        </SwiperSlide>
        <SwiperSlide>
          <img src={MusicApp} alt='' />
        </SwiperSlide>
        <SwiperSlide>
          <img src={MusicApp} alt='' />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Portfolio;
