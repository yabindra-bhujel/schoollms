import React from "react";
import Layout from "../../layout/Layout";
import "./style/examinfo.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const TakeExamPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const exam_id = params.id


  const handleStartExam = () =>{

    const userAggred = document.getElementById("agree").checked;

    if (userAggred){
      navigate(`/exam/student/${exam_id}`);

    }else{
      alert("You must agree to the terms and conditions")
    }
  }

  const examInfoItems = t("examInfo", { returnObjects: true });

  return (
    <>
      <Layout>
        <div className="take-exam-container">
          <div className="exam-info-body">
            <ul>
              <h1>{t("examInfo header")}</h1>

              {examInfoItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
              <div className="exam-info-fotter">
                <div className="agree">
                <form>
              <input type="checkbox" id="agree" name="agree" value="Bike"/>
  <label for="agree"> {t("agree")}</label><br/>
              </form>
                </div>
              <button
              onClick={handleStartExam}
               className="start-exam-btn">{t("start button")}</button>


              </div>
             
             
            </ul>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default TakeExamPage;
