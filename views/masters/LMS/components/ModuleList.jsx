import React from "react";
import { Box, Typography, Paper, Grid, IconButton, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import LessonList from "./LessonList";

/**
 * ModuleList component
 * Props:
 *   modules: array of module objects
 *   courseId: string or number (course id)
 *   refreshModules: function to refresh modules list
 */
const ModuleList = ({ modules = [], courseId, refreshModules }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Modules
      </Typography>
      {modules.length === 0 ? (
        <Typography color="text.secondary">No modules found for this course.</Typography>
      ) : (
        <Grid container spacing={2}>
          {modules.map((module) => (
            <Grid item xs={12} key={module.id}>
              <Paper sx={{ p: 2, mb: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="subtitle1">{module.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {module.description}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      color="primary"
                      // onClick={() => handleEditModule(module)} // Implement edit logic if needed
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    {/* You can add more actions here, e.g., delete */}
                  </Box>
                </Box>
                {/* List lessons for this module */}
                <LessonList
                  lessons={module.lessons || []}
                  moduleId={module.id}
                  courseId={courseId}
                  refreshModules={refreshModules}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ModuleList;
