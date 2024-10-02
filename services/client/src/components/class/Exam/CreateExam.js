import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./style/createExam.css";
import DatePicker from "react-datepicker";
import ReactQuill from "react-quill";
import Questions from "./Questions";
import ExamPreview from "./ExamPreview";
import instance from "../../../api/axios";
import getUserInfo from "../../../api/user/userdata";
import { useTranslation } from "react-i18next";


const CreateExam = (props) => {
  const userdata = getUserInfo();
  const user_id = userdata.username;
  const params = useParams();
  const subject_code = params.subject_code;
  const [currentStep, setCurrentStep] = useState(1);
  const { t } = useTranslation(); 

  const toolbarOptions = {
    toolbar: [
      [{ header: [1, 2, 3] }],
      ["bold", "italic", "underline", "removeFormat"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["image"],

        
    ],
  };



  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "",
      answerType: "",
    },
  ]);


  const [examdataform, setExamdataform] = useState({
    examTitle: "",
    examDescription: "",
    examStartDate: "",
    examEndDate: "",
    examTime: "",
    examMaxScore: "",
    questions: questions,
    teacher: user_id,
    subject_code: subject_code,
    
    
  });



  const CreteExam = async () =>{
    const endpoint = `/exam/create/`;
    try{
      const response = await instance.post(endpoint, examdataform);
      console.log(response)
    }catch(e){
      console.log(e)
    }
  }


  // final exam data


// Function to update examdataform with new questions
const updateExamdataform = (newQuestions) => {
    setExamdataform((prevExamdataform) => ({
      ...prevExamdataform,
      questions: newQuestions,
    }));
  };

  useEffect(() => {
    updateExamdataform(questions);
  }, [questions]);
  









  const handleDateChange = (name, data) => {
    setExamdataform((prevData) => ({
      ...prevData,
      [name]: data,
    }));
  };

  const handleChange = (e, name) => {
    const newValue = e.target ? e.target.value : e;
    setExamdataform((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const isVallidForm = () => {
    return (
      examdataform.examTitle !== "" &&
      examdataform.examDescription !== "" &&
      examdataform.examStartDate !== "" &&
      examdataform.examEndDate !== "" &&
      examdataform.examTime !== "" &&
      examdataform.examMaxScore !== ""
    );
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const steps = [
    t("createExam.createExam"),
    t("createExam.createQuestion"),
    t("createExam.finish")
  ];
  

  return (
    <div>
      <div className="create-exam-header">
      {steps.map((stepTitle, index) => (
          <h3 key={index} className={currentStep === index + 1 ? 'active-step' : ''}>
            {stepTitle}
          </h3>
        ))}
      </div>

      <div className="create-exam-body">
        <form>
          {currentStep === 1 && (
            <>
              <div className="exam-title">
                <label>{t("createExam.examTitle")}</label>
                <input
                  value={examdataform.examTitle}
                  onChange={(e) => handleChange(e, "examTitle")}
                  type="text"
                  placeholder={t("createExam.placholder")}
                />
              </div>
              <div className="sort-form">
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label>{t("createExam.examStartDate")}</label>
                      <DatePicker
                        selected={examdataform.examStartDate}
                        onChange={(date) =>
                          handleDateChange("examStartDate", date)
                        }
                        placeholderText={t("createExam.examStartDate")}
                        showTimeSelect
                        dateFormat="yyyy-MM-dd HH:mm:ss"
                        required
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <label>{t("createExam.examEndDate")}</label>
                      <DatePicker
                        selected={examdataform.examEndDate}
                        onChange={(date) =>
                          handleDateChange("examEndDate", date)
                        }
                        placeholderText={t("createExam.examEndDate")}
                        showTimeSelect
                        dateFormat="yyyy-MM-dd HH:mm:ss"
                        required
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <label>{t("createExam.examTime")}</label>
                      <input
                        type="text"
                        value={examdataform.examTime}
                        onChange={(e) => handleChange(e, "examTime")}
                        placeholder={t("createExam.examTime")}
                        required
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <label>{t("createExam.examMaxScore")}</label>
                      <input
                        value={examdataform.examMaxScore}
                        onChange={(e) => handleChange(e, "examMaxScore")}
                        type="number"
                        placeholder={t("createExam.examMaxScore")}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div  className="exam-description">
                <label>{t("createExam.examDescription")}</label>
                <ReactQuill 

                  theme="snow"
                  value={examdataform.examDescription}
                  onChange={(value) => handleChange(value, "examDescription")}
                  modules={{
                    toolbar: toolbarOptions.toolbar,
                  }}
                />
              </div>
            </>
          )}

          {currentStep === 2 &&(
            <>
             <Questions 
             questions={questions} 
             setQuestions={setQuestions} />
            </>
          )}

            {currentStep === 3 && (
            <>
            <ExamPreview/>
            </>
            )}
          
        </form>
      </div>

      <div className="create-exam-footer">
  {currentStep === 3 ? (
    <>
     <button onClick={props.closeExamModel} className="cancel-exam-button">
     {t("createExam.cancel")}
   </button>
   <button onClick={() => setCurrentStep(currentStep - 1)} className="back-exam-button">
     {t("createExam.back")}

        </button>
    <button onClick={CreteExam}  className="submit-exam-button">
     {t("createExam.submit")}

    </button>

    
   </>

  ) : (
    <>
      <button onClick={props.closeExamModel} className="cancel-exam-button">
      {t("createExam.cancel")}

      </button>
      {(currentStep === 2 || currentStep === 3) && (
        <button onClick={() => setCurrentStep(currentStep - 1)} className="back-exam-button">
               {t("createExam.back")}

        </button>
      )}
      {isVallidForm() && (
        <button onClick={handleNextStep} className="create-exam-button">
               {t("createExam.next")}

        </button>
      )}
    </>
  )}
</div>

    </div>
  );
};

export default CreateExam;
