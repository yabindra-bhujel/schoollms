import React, { useState, useEffect} from "react";

import Layout from "../navigations/Layout";
import { getArticlebyID } from "./LearningSectionService";
import { useParams } from "react-router-dom";
import "./style/article.css";




const ArticlePage = () =>{
    const [article, setArticle] = useState({});
  const { id } = useParams();


    const fetchArticle = async () => {
        try {
          const article = await getArticlebyID(id);
          setArticle(article);
        } catch (error) {
          console.error('Error fetching article:', error);
        }
      };


    useEffect(() =>{
        fetchArticle()
    },[])







    return(
        <Layout>
            <div className="article">
                <div className="article-title">
                    <h1>{article.title}</h1>
                </div>
                {/* in here i want to shwo html file  */}
                
                <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
                
            </div>
        </Layout>
    )
}

export default ArticlePage;