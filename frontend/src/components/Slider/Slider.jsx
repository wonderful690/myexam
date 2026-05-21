import { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Slider.css';
import slider1 from "../../assets/slider1.jpg";
import slider2 from "../../assets/slider2.jpg";
import slider3 from "../../assets/slider3.jpg";
import slider4 from "../../assets/slider4.jpg";


const slides = [
  {
    id: 1,
    image: slider1,
    title: 'Конференц-залы',
    subtitle: 'Просторные аудитории для мероприятий'
  },
  {
    id: 2,
    image: slider2,
    title: 'Коворкинги',
    subtitle: 'Современные пространства для команд'
  },
  {
    id: 3,
    image: slider3,
    title: 'Кинозалы',
    subtitle: 'Профессиональное оборудование'
  },
  {
    id: 4,
    image: slider4,
    title: 'Конференции.РФ',
    subtitle: 'Организуйте событие мечты'
  }
];

export default function Slider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="slider">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slider-slide ${index === current ? 'active' : ''}`}
        >
          <img src={slide.image} alt={slide.title} className="slider-image" />
          <div className="slider-overlay" />
          <div className={`slider-caption ${index === current ? 'visible' : ''}`}>
            <h3 className="slider-title">{slide.title}</h3>
            <p className="slider-subtitle">{slide.subtitle}</p>
          </div>
        </div>
      ))}

      <button className="slider-btn slider-btn-prev" onClick={prev}>
        <FiChevronLeft size={22} />
      </button>
      <button className="slider-btn slider-btn-next" onClick={next}>
        <FiChevronRight size={22} />
      </button>

      <div className="slider-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`slider-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}