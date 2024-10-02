import React, { useState, useEffect } from "react";
import "./style/search.css";
import { GrFormAdd } from "react-icons/gr";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import CreateModel from "./Createnew";
import Modal from "react-modal";
import { FaPython } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CreateNewArtical from "./CreateNewArtical";

Modal.setAppElement("#root");

const Search = ({ query }) => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchQueryChange = () => {
    setSearchQuery(searchQuery);
    query(searchQuery);
    setSearchQuery("");
  };

  const [isNewVideoAddOpen, setIsNewVideoAddOpen] = useState(false);
  const [isNewArticlaAddOpen, setIsNewArticlaAddOpen] = useState(false);

  const openNewVideoAdd = () => {
    setIsNewVideoAddOpen(true);
  };

  const closeNewVideoAdd = () => {
    setIsNewVideoAddOpen(false);
  };


  const openNewArticalAdd = () => {
    setIsNewArticlaAddOpen(true);
  };

  const closeNewArticlaAdd = () => {
    setIsNewArticlaAddOpen(false);
  };

  useEffect(() => {
    const body = document.body;
    
    if (isNewVideoAddOpen || isNewArticlaAddOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    return () => {
      body.style.overflow = "auto";
    };
  }, [isNewVideoAddOpen, isNewArticlaAddOpen]);





  return (
    <div className="container_for_search">
      <div className="search-container">
        <p>{t("millionsCollection")}</p>
        <div className="search_bar">
          <input
            type="text"
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" onClick={handleSearchQueryChange}>
            {t("search")}
          </button>
        </div>

        <div className="filter">
          <div className="filter-button">
            <button>
              <GrFormAdd />
              {t("addFilter")}
            </button>



            {/* pop up model */}

            <Modal
              className="artical-model"
              isOpen={isNewArticlaAddOpen}
              onRequestClose={closeNewArticlaAdd}
              contentLabel="Example Modal"
              shouldCloseOnOverlayClick={false}
            >
              <div className="artical-modal-content">
                <CreateNewArtical closeNewArticlaAdd={closeNewArticlaAdd} />
              </div>

            </Modal>

            <Modal
              className="model"
              isOpen={isNewVideoAddOpen}
              onRequestClose={closeNewVideoAdd}
              contentLabel="Example Modal"
              shouldCloseOnOverlayClick={false}
            >
              <div className="modal-content">
                <CreateModel closeNewVideoAdd={closeNewVideoAdd} />
              </div>
            </Modal>

            <button onClick={openNewVideoAdd}>
              <GrFormAdd />
              {t("addNewCollection")}
            </button>

            <button onClick={openNewArticalAdd}>
              <GrFormAdd />
              {t("addNewArticla")}
            </button>

            <Link className="button" to="/codeediter">
              <FaPython />
              {t("learnPython")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
