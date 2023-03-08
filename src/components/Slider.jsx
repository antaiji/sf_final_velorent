import Carousel from "nuka-carousel";

import "./Slider.css";
import bike_01 from "../assets/01.jpg";
import bike_02 from "../assets/02.jpg";
import bike_03 from "../assets/03.jpg";
import bike_04 from "../assets/04.jpg";

const Slider = () => {
  const slides = [bike_01, bike_02, bike_03, bike_04];

  const params = {
    wrapAround: true,
    slidesToShow: 1,
    autoplay: true,
    withoutControls: true,
    autoplayInterval: 4000,
    adaptiveHeight: false,
    speed: 500,
  };

  return (
    <div className="slider_container">
      <Carousel {...params}>
        {slides.map((slide) => (
          <img className="slider_img" src={slide} key={slide} />
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;
