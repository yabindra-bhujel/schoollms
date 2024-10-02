import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";

const username = getUserInfo().username;

const addArticla = async (ArticlaData) => {
    try{
        const enpoint = `/video_learning/create_article/${username}/`
        const res = await instance.post(enpoint, ArticlaData);
        const data = res.data;
        return data;

    }catch(error){
        throw error
    }

}


const getArticleList = async() =>{
    try{
        const endpoint = `/video_learning/get_article_list/`
        const res = await instance.get(endpoint);
        const data = res.data;
        return data;

    }catch(error){
        throw error


    }
}


const getArticlebyID = async(articleID) =>{
    try{
        const endpoint = `/video_learning/get_article_by_id/${articleID}/`;
        const res = await instance.get(endpoint);
        const data = res.data;
        return data;
    }catch(error){
        throw error
    }
}



export  {addArticla, getArticleList, getArticlebyID};