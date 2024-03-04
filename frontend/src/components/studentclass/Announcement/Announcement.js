import React, { useEffect, useState } from "react";
import instance from "../../../api/axios";
import styled from "styled-components";
import AnnouncementList from "./AnnouncementList";
import {useParams } from "react-router-dom";


const AnnouncementWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgb(226, 222, 222);
  border-radius: 10px;
`;

const AnnouncementListWrapper = styled.div`
  background: rgb(199, 214, 217);
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
`;

const Announcement = () =>{
    const params = useParams();
    const subject_code = params.id;
  const [announcements, setAnnouncements] = useState([])




  useEffect(() =>{
    getAnnouncementData();
  },[]) 
    

      const getAnnouncementData = async() =>{
        const endpoint = `course/get_announcement_by_subject_student/${subject_code}`;
        try{
          const response = await instance.get(endpoint);
          setAnnouncements(response.data);
        }catch(error){
          console.log(error);
        }
      }
    
  


    return(
        <>
        <AnnouncementWrapper>
        <div className="title">
          <h1>Announcement List</h1>
        </div>
      </AnnouncementWrapper>

        <AnnouncementListWrapper>
        <AnnouncementList announcements={announcements} />
        </AnnouncementListWrapper>
       </>

    )
}

export default Announcement;