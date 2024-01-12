import Layout from "../../navigations/Layout";
import "./style/exam.css";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import instance from "../../../api/axios";

import ShortQuestion from "./shortquestion";
import LongQuestion from "./LongQestion";
import ExamSubmitConformaction from "./FinalSubmitPage";
import CountdownTimer from "./Timer";


const Exma = () => {
  const { t } = useTranslation();
  const params = useParams();
  const exam_id = params.id;
  const [examlist, setExamlist] = useState();
  const [shortquestion, setShortquestion] = useState([]);
  const [longquestion, setLongquestion] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
 const [duration, setDuration] = useState()

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  useEffect(() => {
    getExmaDetails();
  }, []);

  const getExmaDetails = async () => {
    try {
      const endpoint = `/exam/details/${exam_id}/`;
      const response = await instance.get(endpoint);
      if (response.data) {
        const examdata = response.data;
        setExamlist(examdata);
        setDuration(examdata.duration)


        const shortquestion = examdata.short_answer_questions;
        const longquestion = examdata.long_answer_questions;
        setShortquestion(shortquestion);
        setLongquestion(longquestion);
      } else {
        console.log("No exam found in the response.");
      }
    } catch {
      console.log("error");
    }
  };

  return (
    <>
      <Layout>
        <div className="main-exam-continer">
          <div className="exam-details-header">
            <div className="title">
              <p>{examlist?.title}</p>
            </div>

            <div className="right-side">
            <div className="progress">
              
            </div>
            <div className="timer">
              <CountdownTimer duration={duration} />
              </div>



            </div>
            

              
          
          </div>
          <section className="main-exam">
            <div className="question-answer-section">
                <div className="short">
                    {currentStep === 1 &&(
                        <ShortQuestion question={shortquestion} />
                    )}
                    {currentStep === 2 &&(
                        <LongQuestion question={longquestion} />
                    )}
                    {currentStep === 3 &&(
                        <ExamSubmitConformaction />
                    )}
                </div>
             
               

                
            
            </div>
            <div className="timer-chat">
             
              <div className="chat">
                <h1>Chat</h1>
              </div>
            </div>
          </section>

          {/* fotter button */}
          <div className="fotter-button">
            {(currentStep === 2 || currentStep === 3) &&(
                <button
                onClick={() => setCurrentStep(currentStep - 1)}
    
                >Back</button>
            )}
           
            
            {( currentStep ===1  || currentStep === 2) &&(
                <button
                onClick={handleNextStep}
             >Next</button>

            )}
            {currentStep === 3 &&(
                <button
             >Submit</button>
            )}
            
          </div>
        </div>
      </Layout>
    </>
  );
};
export default Exma;
