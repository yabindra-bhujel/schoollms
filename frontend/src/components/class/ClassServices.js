import instance from "../../api/axios";





const getFile = async (subject_code) => {
    try {
      const endpoint = `/course/${subject_code}/`;
      const response = await instance.get(endpoint);

      if (response.data[0] && response.data[0].course_materiales) {
        const file = response.data[0].course_materiales;
        return file;
      }
    } catch(error) {
      throw error
    }
  };

  export { getFile };