import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Countdown from "../Countdown";
import LoadingState from "../LoadingState";

const ExploreItems = () => {
  const [authors, setAuthors] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);

  async function getAuthors() {
    const { data } = await axios.get(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore`
    );
      setAuthors(data);
      setLoading(false);
  }

  useEffect(() => {
    getAuthors();
  }, []);

  const getSortedAuthors = () => {
    let sorted = [...authors];
    if (sortOption === "price_low_to_high") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price_high_to_low") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === "likes_high_to_low") {
      sorted.sort((a, b) => b.likes - a.likes);
    }
    return sorted;
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setVisibleCount(8);
  };

  const sortedAuthors = getSortedAuthors();

  return (
    <>
      <div>
        <select
          id="filter-items"
          defaultValue=""
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      <LoadingState loading={loading} visibleItems={new Array(8).fill(null)}>
        {sortedAuthors.slice(0, visibleCount).map((author, index) => (
          <div
            key={index}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
            style={{ display: "block", backgroundSize: "cover" }}
          >
            <div className="nft__item">
              <div className="author_list_pp">
                <Link
                  to={`/author/${author.authorId}`}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                >
                  <img className="lazy" src={author.authorImage} alt="" />
                  <i className="fa fa-check"></i>
                </Link>
              </div>
              <Countdown expiryDate={author.expiryDate} />
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
                <Link to={`/item-details/${author.nftId}`}>
                  <img
                    src={author.nftImage}
                    className="lazy nft__item_preview"
                    alt=""
                  />
                </Link>
              </div>
              <div className="nft__item_info">
                <Link to="/item-details">
                  <h4>{author.title}</h4>
                </Link>
                <div className="nft__item_price">{author.price} ETH</div>
                <div className="nft__item_like">
                  <i className="fa fa-heart"></i>
                  <span>{author.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {visibleCount < sortedAuthors.length && (
          <div className="col-md-12 text-center">
            <button onClick={handleLoadMore} className="btn-main lead">
              Load more
            </button>
          </div>
        )}
      </LoadingState>
    </>
  );
};

export default ExploreItems;
