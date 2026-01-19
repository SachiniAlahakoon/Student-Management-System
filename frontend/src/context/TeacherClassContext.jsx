import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const TeacherClassContext = createContext(null);

export const TeacherClassProvider = ({ children }) => {
  const [classes, setClasses] = useState([]);
  const [activeClassId, setActiveClassId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/teacher/classes",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setClasses(res.data);

        // Select first class automatically
        if (res.data.length > 0) {
          setActiveClassId(res.data[0].class_id);
        }
      } catch (err) {
        console.error("Failed to load classes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <TeacherClassContext.Provider
      value={{ classes, activeClassId, setActiveClassId, loading }}
    >
      {children}
    </TeacherClassContext.Provider>
  );
};

export const useTeacherClass = () => useContext(TeacherClassContext);
