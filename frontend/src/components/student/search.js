import React, { useState, useEffect } from "react";
import "./style/search.css";
import { GrFormAdd } from "react-icons/gr";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";

const Search = ({ query }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchQueryChange = () => {
    setSearchQuery(searchQuery);
    query(searchQuery);
    // Clear the searchQuery by setting it to an empty string
    setSearchQuery("");
  };



  return (
    <div className="container_for_search">
      <div className="search-container">
        <p>Find your student.</p>
        <div className="search_bar">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" onClick={handleSearchQueryChange}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
