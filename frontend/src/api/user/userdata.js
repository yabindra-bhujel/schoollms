import jwtDecode from "jwt-decode";

// const getUserInfo = () => {
//   const userData = JSON.parse(localStorage.getItem("userData"));
//   const accessToken = userData.access;
//   const decoded = jwtDecode(accessToken);

//   return {
//     username: decoded.username,
//     user_id: decoded.user_id,
//   };
// };

// export default getUserInfo;
// // Usage
// // const userInfo = getUserInfo();
// // const username = userInfo.username;
// // const user_id = userInfo.user_id;


const getUserInfo = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (userData) {
    const accessToken = userData.access;
    const decoded = jwtDecode(accessToken);

    return {
      username: decoded.username,
      user_id: decoded.user_id,
      isTeacher: userData.isTeacher,
      isStudent: userData.isStudent,

    }
  } else {
    // Handle the case when userData is null
    return {
      username: null,
      user_id: null,
    };
  }
};
export default getUserInfo;
