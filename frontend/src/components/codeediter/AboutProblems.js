import React, { useState, useEffect } from "react";
import { Collapse, Divider } from "antd";
import instance from "../../api/axios";
import Layout from "../navigations/Layout";
import Editor from "@monaco-editor/react";
import getUserInfo from "../../api/user/userdata";
import "./style/code.css";
import { VscRunAll } from "react-icons/vsc"


const Problem = () => {
  const [problems, setProblems] = useState(null); // Initialize as null
  const [problem_id, setProblem__id] = useState("")
  
  const get_first_problem = async () => {
    try {
      const res = await instance.get("/editer/get_all_problems");

      // Get the first problem from the response (assuming the API returns an array)
      if (res.data && res.data.length > 0) {
        const firstProblem = res.data[0];
        setProblems(firstProblem); // Set the first problem
        setProblem__id(firstProblem.id); // Set the problem ID

      } else {
        setProblems(null); // No data available
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    get_first_problem();
  }, []);

  const user = getUserInfo();
  const user_id = user.user_id;
  const [code, setCode] = useState("# Write your Python code here");
  const [codeOutput, setCodeOutput] = useState("");
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState("")
  const [message, setMessage] = useState("")




  const handleCodeChange = (newValue) => {
    // Update the code in state when changes occur
    setCode(newValue);
  };

  const runCode = async () => {
    setCodeOutput("");
    setError("");

    try {
      const endpoint = "/editer/";
      const data = {
        code: code,
        user: user_id,
        problem_id: problem_id,
      };

      const response = await instance.post(endpoint, data);
      console.log("Response:", response);
      const output = response.data.output;
      const outputError = response.data.error;
      const outputAnswer = response.data.answer;
      const outputMessage = response.data.message;
      setError(outputError);
      setCodeOutput(output);
      setAnswer(outputAnswer)
      setMessage(outputMessage)

      // Handle the response data here
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const ClearOutput = () =>{
    setCodeOutput("");
    setError("");
    setAnswer("")
    setMessage("")
  }

  // Render based on whether 'problems' is null or has data
  return (
    <Layout>
      <>
      <div className="editer-hedaer">
            <h1>Unleash Your Python Magic</h1>
            <p>Coding Space: Where Python Dreams Take Shape</p>
        </div>
        <div className="problem-container">
          {problems ? ( // Check if 'problems' is not null
            <div className="problem">
              <div className="problem-description">
                <h1>{problems.title}</h1>
                <p>{problems.description}</p>
              </div>

              <div className="hint">
                <Divider orientation="left">Hint</Divider>
                <Collapse
                  size="large"
                  items={[
                    {
                      key: "1",
                      label: "Hint for Solve...",
                      children: (
                        <div className="answer-hint">{problems.hint}</div>
                      ),
                    },
                  ]}
                />
              </div>

              <div className="expect-answer">
                <p>{problems.excepted_answere_descriotion}</p>
                <strong>{problems.exacty_answer}</strong>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
          <div className="code-editer">
            <Editor
              width="100%" // By default, it fully fits with its parent
              height="500px" // Set the height of the editor
              language="python" // Set the language mode
              theme="vs-dark" // Choose a theme
              value={code} // Use the code from state as the initial value
              onChange={handleCodeChange}
              options={{
                minimap: {
                  enabled: false,
                },
                suggest: {
                  // Enable basic suggestions like keywords and symbols
                  basic: true,

                  // Enable more advanced suggestions like methods and properties
                  advanced: true,
                },

                fontSize: "15px",
                folding: true,
                autoIndent: true,
                wordWrap: "on",
                letterSpacing: 2,
                fontFamily: "monospace",
              }}
            />
            <div className="devider">
              <button onClick={runCode}>
                <VscRunAll className="runner" />
              </button>
              <button onClick={ClearOutput}>
                Clear
              </button>
            </div>
            <div 
            
            className="code-out">
              <pre>{codeOutput}</pre>
              <pre>{answer}</pre>
              <pre>{message}</pre>
              <pre>{error}</pre>
              <p>{"> |"}</p>
            </div>
          </div>
        </div>

        <div className="editer-fotter">
           <button className="next-btn">

            Next
           </button>

           <button className="pre-btn">
                Previous
           </button>
        </div>
      </>
    </Layout>
  );
};

export default Problem;
