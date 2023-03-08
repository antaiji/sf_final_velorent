import Slider from "../components/Slider";

import "./Home.css";
import background from "../assets/main_bg.jpg";

const Home = () => {
  return (
    <div
      className="home_wrapper"
      style={{
        backgroundImage: `linear-gradient(
          hsla(220, 14%, 96%, 0.98),
          hsla(220, 14%, 96%, 0.90)
      ), url(${background})`,
      }}
    >
      <div className="container">
        <div className="grid">
          <div className="home_section_left">
            <Slider />
          </div>
          <div className="home_section_right">
            <h1 className="home_title">Велорент</h1>
            <p className="home_text">
              Рады приветствовать всех поклонников "двухколесных друзей" на
              нашем сайте!
            </p>
            <p className="home_text">
              Проект "Велорент" это нечто большее, чем обычный сервис
              велопроката! Мы объединяем под своим началом настоящих
              энтузиастов, творческих и увлеченных людей, которые меняют мир и
              себя в нём к лучшему.
            </p>
            <p className="home_text">
              Мы искренне верим и надеемся, что интерес к велосипедами и их
              популярность в нашем городе из года в год будет только расти. Со
              своей стороны мы также постараемся приложить максимум усилий и
              способствовать увеличению числа велолюбителей в нашем регионе!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
