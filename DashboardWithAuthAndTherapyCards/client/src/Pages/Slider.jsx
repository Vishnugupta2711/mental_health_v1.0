import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

const sliderItems = [
  { imageLink: "/images/1.png", text: "Learn More" },
  { imageLink: "/images/2.png", text: "Get Help" },
  { imageLink: "/images/3.png", text: "Track Changes" },
  { imageLink: "/images/4.png", text: "Stay Balanced" },
  { imageLink: "/images/5.png", text: "Stay Connected" },
  { imageLink: "/images/6.png", text: "Boost Focus" },
  { imageLink: "/images/7.png", text: "Healthy Habits" },
  { imageLink: "/images/8.png", text: "Stay Positive" },
  { imageLink: "/images/9.png", text: "Feel Better" },
  { imageLink: "/images/10.png", text: "Find Passion" },
  { imageLink: "/images/11.png", text: "Seek Support" },
  { imageLink: "/images/12.png", text: "Get Help" },
  { imageLink: "/images/13.png", text: "Get Advice" },
];

const Slider = () => {
  return (
    <div className="relative bg-transparent max-md:mt-16  md:mt-[5.5rem] px-5 sm:px-8">
      <div className="w-full max-w-7xl  mx-auto">
        <Carousel
          className="rounded-2xl overflow-hidden relative shadow-2xl"
          autoPlay
          interval={2000}
          infiniteLoop
          emulateTouch
          swipeable
          showThumbs={false} // Hides upcoming images
          showStatus={false} // Hides status like 1/5
          showIndicators={true} // Keeps the dots for indication
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 md:p-3 bg-white/30 hover:bg-white/60 backdrop-blur-lg text-white rounded-full transition-all ease-in-out duration-300 shadow-md flex justify-center items-center"
              >
                <ArrowBigLeft size={20} />
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 md:p-3 bg-white/30 hover:bg-white/60 backdrop-blur-lg text-white rounded-full transition-all ease-in-out duration-300 shadow-md flex justify-center items-center"
              >
                <ArrowBigRight size={20} />
              </button>
            )
          }
          renderIndicator={(clickHandler, isSelected, index, label) => {
            const dotClass = isSelected
              ? "w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-600"
              : "w-2 h-2 bg-white opacity-70 hover:opacity-100 transition-all duration-300";
            return (
              <li
                className={`inline-block mx-1 rounded-full ${dotClass}`}
                onClick={clickHandler}
                role="button"
                key={index}
                title={label}
              />
            );
          }}
        >
          {sliderItems.map((item, index) => (
            <div key={index} className="relative group">
              {/* Parallax background */}
              <div
                className="absolute inset-0 bg-fixed bg-cover bg-center -z-10"
                style={{
                  backgroundImage: `url(${item.imageLink})`,
                  transform: "scale(1.1)", // Create depth effect by making background slightly larger
                  filter: "blur(3px)",
                }}
              ></div>
              <img
                src={item.imageLink}
                alt={item.text}
                className="relative w-full h-80 object-cover  rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 border-4 rounded-xl border-transparent group-hover:border-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col text-white text-center p-6">
                <h2 className="text-3xl sm:text-5xl font-bold mb-4 drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-floating">
                  {item.text}
                </h2>
                <button className="mt-4 px-6 py-2 text-lg bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 hover:bg-gradient-to-l rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-floating">
                  Explore More
                </button>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Slider;
