import React,  {useState} from "react";
import "./style/addartical.css";
import { Editor } from "@tinymce/tinymce-react";
import { useTranslation } from "react-i18next";
import { addArticla } from "./LearningSectionService";


const CreateNewArtical = ({ closeNewArticlaAdd }) => {
    const { t }  = useTranslation();
    // State to manage input values
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Function to handle input changes
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (content) => {
        setDescription(content);
    };

    // Function to check if the "Add" button should be enabled
    const isAddButtonEnabled = () => {
        return title.trim() !== "" && description.trim() !== "";
    };


    const handleSubmit = () => {
        const articlaData = {
          title,
          description,
        };
      
        // Assuming addArticla returns a promise
        addArticla(articlaData)
          .then((res) => {
            // Handle the response if needed
            console.log("Article added successfully:", res);
          })
          .catch((error) => {
            // Handle any errors that occurred during the addition of the article
            console.error("Error adding article:", error);
          })
          .finally(() => {
            // This block will run regardless of success or failure
            closeNewArticlaAdd();
          });
      };
      

  return (
    <div>
      <div className="new-artical">
        <h1>{t("addNewArticla")}</h1>
        <div className="artical-title">
          <input 
          type="text"
           placeholder={t("articleTitle")}
           value={title}
            onChange={handleTitleChange}
            />

        </div>
        <div className="artical-description">
        <Editor
            apiKey="ta715ooieynuw6st65jxyp080hlk7oa9kow01hu6q9rhg13i"
            init={{
              height: "500px",
              resize: false,
              menubar: false,
              branding: false,
              directionality: "ltr",
              plugins: "link image lists",
              toolbar: "undo redo | formatselect | bold italic underline | link image | bullist numlist",
            }}
            onEditorChange={handleDescriptionChange}
          />
        </div>

        <div className="footer-btn">
          <button className="cancel-btn" onClick={closeNewArticlaAdd}>
            {t("articla_cancel")}
          </button>
          <button 
          onClick={handleSubmit}
          disabled={!isAddButtonEnabled()}
          className="add-btn">
            {t("article_add")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewArtical;
