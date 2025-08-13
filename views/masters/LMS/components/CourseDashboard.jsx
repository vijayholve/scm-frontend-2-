import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../../../../utils/apiService";
import ModuleList from "./ModuleList";
import AddModuleModal from "./AddModuleModal";

const CourseDashboard = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [openAddModule, setOpenAddModule] = useState(false);

  // Fetch or initialize course and modules for create/edit, using account id if available
  const { accountId } = useParams(); // Expecting accountId in route if needed

  const fetchCourseAndModules = async () => {
    try {
      if (id) {
        // Edit mode: fetch course and modules by course id
        const courseRes = await api.get(`/api/courses/getById/${id}`);
        setCourse(courseRes.data);
        const modulesRes = await api.get(`/api/courses/${id}/modules`);
        setModules(modulesRes.data || []);
      } else {
        // Create mode: initialize empty course, optionally prefill with accountId
        setCourse({
          title: "",
          description: "",
          status: "Draft",
          accountId: accountId || "", // prefill if available
        });
        setModules([]);
      }
    } catch (err) {
      setCourse(null);
      setModules([]);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourseAndModules();
    }
    // eslint-disable-next-line
  }, [id]);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>

      {course && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">Course: {course.name}</Typography>
            <Button variant="contained" onClick={() => setOpenAddModule(true)}>
              Add Module
            </Button>
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {course.description}
          </Typography>
          <ModuleList
            modules={modules}
            courseId={id}
            refreshModules={fetchCourseAndModules}
          />
          <AddModuleModal
            open={openAddModule}
            onClose={() => setOpenAddModule(false)}
            courseId={id}
            onModuleAdded={fetchCourseAndModules}
          />
        </>
      )}
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          // Save handler: implement save logic here
          // For now, just a placeholder alert
          // You may want to call an API to save the course and modules
          alert("Save functionality not implemented yet.");
        }}
        disabled={!course || !course.title}
      >
        Save
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={() => {
          // Reject handler: implement reject logic here
          // For now, just a placeholder alert
          // You may want to reset the form or navigate away
          alert("Reject functionality not implemented yet.");
        }}
      >
        Reject
      </Button>
    </Box>
    </Box>
  );
};

export default CourseDashboard;
