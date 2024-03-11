import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import "./style/profile.css";
import { AiFillIdcard, AiTwotoneMail, AiFillPhone} from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";

const Profile = () => {
  const user_data = getUserInfo();
  const user = user_data.username;
  const [userData, setUserData] = useState([]);

  const getUser_data = async () => {
    const endpoint = `/get_user_profile_pic/${user}/`;
    try {
      let response = await instance.get(endpoint);
      const user_data = response.data;
      setUserData(user_data);
    } catch {
      console.log("Errror in facting data");
    }
  };

  useEffect(() => {
    getUser_data();
  }, []);

  return (
    <Layout>
      <div className="user-profile-section">
        <div className="user_image">
          <div className="user-image-container">
            <img src={userData.image} alt="User Image" />
          </div>

          <div className="user-info-p">
            <p>Hello world University</p>
            <p>Faculty of Media and information technology</p>
            <p>
              {userData.first_name} {userData.last_name}
            </p>
          </div>
        </div>

        <div className="user-info">
          <div className="profile-header">
            <h4>Personla Informaction</h4>
          </div>
          <div className="row">
            <div className="row-items">
              <div className="icon">
                <AiFillIdcard />
              </div>
              <div className="info">
                <p>ID</p>
                <h3>{userData.username}</h3>
              </div>
            </div>

            <div className="row-items">
              <div className="icon">
                <BiUserCircle />
              </div>
              <div className="info">
                <p>Full Name</p>
                <h3>
                  {userData.first_name} {userData.last_name}
                </h3>
              </div>
            </div>

            <div className="row-items">
              <div className="icon">
                <AiTwotoneMail />
              </div>
              <div className="info">
                <p>Email</p>
                <h3 className="email">{userData.email}</h3>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="row-items">
              <div className="icon">
                <AiFillPhone />
              </div>
              <div className="info">
                <p>Phone</p>
                <h3>090-989-9977</h3>
              </div>
            </div>

            <div className="row-items">
              <div className="icon">
                <BiUserCircle />
              </div>
              <div className="info">
                <p>Full Name</p>
                <h3>
                  {userData.first_name} {userData.last_name}
                </h3>
              </div>
            </div>

            <div className="row-items">
              <div className="icon">
                <AiTwotoneMail />
              </div>
              <div className="info">
                <p>Email</p>
                <h3 className="email">{userData.email}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Profile;
