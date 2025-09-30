import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./HotCollections.css";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const sliderRef = useRef(null);
  const [sliderReady, setSliderReady] = useState(false);

  async function getCollections() {
    setLoading(true);
    const { data } = await axios.get(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections`
    );
    setTimeout(() => {
      setCollections(data);
      setLoading(false);
    }, 2000);
  }

  useEffect(() => {
    getCollections();
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setSliderReady(true), 50);
    return () => clearTimeout(timeout);
  }, []);

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
    <section id="section-collections" className="no-bottom">
      {loading ? (
        <div className="skeleton__loading">
          <div className="skeleton-title"></div>
          <div className="skeleton-tiles">
            {new Array(4).fill(0).map((_, index) => (
              <div className="skeleton__tile" key={index}>
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
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="carousel-wrapper">
            {sliderReady && <Slider ref={sliderRef} {...settings}>
              {collections.map((collection, index) => (
                <div className="px-2" key={index}>
                  <div style={{ width: "100%" }}>
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Link to="/item-details">
                          <img
                            src={collection.nftImage}
                            className="lazy img-fluid"
                            alt=""
                          />
                        </Link>
                      </div>
                      <div className="nft_coll_pp">
                        <Link to="/author">
                          <img
                            className="lazy pp-coll"
                            src={collection.authorImage}
                            alt=""
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>
                      <div className="nft_coll_info">
                        <Link to="/explore">
                          <h4>{collection.title}</h4>
                        </Link>
                        <span>ERC-{collection.code}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>}
          </div>
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

export default HotCollections;
