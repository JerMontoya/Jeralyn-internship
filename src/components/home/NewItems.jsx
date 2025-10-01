import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./HotCollections.css";

const NewItems = () => {
  const [newItems, setNewItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const fullArray = [1, 2, 3, 4];
  const [visibleItems, setVisibleItems] = useState(fullArray);
  const [now, setNow] = useState(Date.now());

  async function getNewItems() {
    setLoading(true);
    const { data } = await axios.get(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems`
    );
    setNewItems(data);
    setLoading(false);
  }

  useEffect(() => {
    getNewItems();
  }, []);

  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;

      if (width >= 1200) setVisibleItems(fullArray.slice(0, 4));
      else if (width >= 768) setVisibleItems(fullArray.slice(0, 3));
      else if (width >= 480) setVisibleItems(fullArray.slice(0, 2));
      else setVisibleItems(fullArray.slice(0, 1));
    };
    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);

    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (expiryDate) => {
    const diff = expiryDate - now;
    if (diff <= 0) return "Expired";
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section id="section-items" className="no-bottom">
      {loading ? (
        <div className="skeleton__loading">
          <div className="skeleton-title"></div>
          <div className="small-border bg-color-2"></div>
          <div className="skeleton-tiles">
            {visibleItems.map((item, i) => (
              <div className="skeleton__tile" key={i}>
                <div className="skeleton__tile-img"></div>
                <div className="skeleton__tile-author"></div>
                <div className="skeleton__tile-name"></div>
                <div className="skeleton__tile-code"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          {
            <Slider {...settings}>
              {newItems.map((newItem, index) => {
                const diff = newItem.expiryDate - now;
                return (
                  <div className="carousel-wrapper">
                    <div className="px-2" key={index}>
                      <div className="nft__item">
                        <div className="author_list_pp">
                          <Link
                            to={`/author/${newItem.authorId}`}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Creator: Monica Lucas"
                          >
                            <img
                              className="lazy"
                              src={newItem.authorImage}
                              alt=""
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>

                        {diff > 0 && (
                          <div className="de_countdown">
                            {formatTime(newItem.expiryDate)}
                          </div>
                        )}

                        <div className="nft__item_wrap">
                          <div className="nft__item_extra">
                            <div className="nft__item_buttons">
                              <button>Buy Now</button>
                              <div className="nft__item_share">
                                <h4>Share</h4>
                                <a href="" target="_blank" rel="noreferrer">
                                  <i className="fa fa-facebook fa-lg"></i>
                                </a>
                                <a href="" target="_blank" rel="noreferrer">
                                  <i className="fa fa-twitter fa-lg"></i>
                                </a>
                                <a href="">
                                  <i className="fa fa-envelope fa-lg"></i>
                                </a>
                              </div>
                            </div>
                          </div>

                          <Link to={`/item-details/${newItem.nftId}`}>
                            <img
                              src={newItem.nftImage}
                              className="lazy nft__item_preview"
                              alt=""
                            />
                          </Link>
                        </div>
                        <div className="nft__item_info">
                          <Link to={`/item-details/${newItem.nftId}`}>
                            <h4>{newItem.title}</h4>
                          </Link>
                          <div className="nft__item_price">
                            {newItem.price} ETH
                          </div>
                          <div className="nft__item_like">
                            <i className="fa fa-heart"></i>
                            <span>{newItem.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          }
          <style>{`.slick-prev:before,
          .slick-next:before {
          color: black;    
          font-size: 40px;
          opacity: 1;     
          } .slick-prev, .slick-next {
          width: 48px;
          height: 48px;
          z-index: 5; 
          border-radius: 50%;
          display: flex !important;
          align-items: center;
          justify-content: center;
          opacity: 1 !important; 
        }`}</style>
        </div>
      )}
    </section>
  );
};

export default NewItems;
