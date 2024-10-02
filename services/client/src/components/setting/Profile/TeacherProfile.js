import React, { useState } from "react";
import "./style/teacherProfile.css";

const TeacherProfile = () => {
    const [image, setImage] = useState("https://www.w3schools.com/howto/img_avatar.png");

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <div className="profile-setting">
                <div className="profile-image-side">

                    <div className="profile-image">
                        <input
                            type="file"
                            id="imageInput"
                            hidden="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <button onClick={() => document.getElementById('imageInput').click()}>
                            <img src={image} alt="profile" />
                        </button>
                    </div>

                    <div className="other-info">
                        <h1>John Doe</h1>
                    </div>

                </div>

                <div className="profile-info-side">
                    <h1>Teacher Name: John Doe</h1>
                    <h2>Teacher ID: 123456</h2>
                </div>

            </div>
        </div>
    );
};

export default TeacherProfile;
