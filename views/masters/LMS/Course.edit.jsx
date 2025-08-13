import React, { useEffect, useState } from "react";
import { Box, Button, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Paper, Grid, List, ListItem, ListItemText, Checkbox, Modal, Backdrop, Fade, Collapse } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";// or however user/accountId is accessed
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/apiService";
import { useSelector } from "react-redux";
import { use } from "react";
import { Autocomplete } from "@mui/material";
import { gridSpacing } from "store/constant";


// Modal for adding/editing a lesson
const LessonModal = ({ open, onClose, onSave, initialData }) => {
  const [lesson, setLesson] = useState(initialData || { title: "", content: "" });

  useEffect(() => {
    setLesson(initialData || { title: "", content: "" });
  }, [initialData, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Edit Lesson" : "Add Lesson"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Lesson Title"
          value={lesson.title}
          onChange={e => setLesson({ ...lesson, title: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Content"
          value={lesson.content}
          onChange={e => setLesson({ ...lesson, content: e.target.value })}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
      {/* Lesson Type Dropdown */}
      <TextField
        select
        label="Lesson Type"
        value={lesson.type || ""}
        onChange={e => {
          const type = e.target.value;
          // Reset fields not relevant to the new type
          let resetFields = {};
          if (type === "document") {
            resetFields = { documentId: null, link: "", testId: null };
          } else if (type === "video") {
            resetFields = { link: "", documentId: null, testId: null };
          } else if (type === "text") {
            resetFields = {  link: "", documentId: null, testId: null };
          } else if (type === "test") {
            resetFields = { testId: null, documentId: null, link: "" };
          }
          setLesson({ ...lesson, type, ...resetFields });
        }}
        fullWidth
        margin="normal"
      >
        <MenuItem value="">Select Type</MenuItem>
        <MenuItem value="document">Document</MenuItem>
        <MenuItem value="video">Video</MenuItem>
        <MenuItem value="text">Text</MenuItem>
        <MenuItem value="test">Test</MenuItem>
      </TextField>

      {/* Show textbox for link/content for document or text */}
      {(lesson.type === "document" || lesson.type === "text" || lesson.type === "video") && (
        <>
          {/* For document and text, show textbox for link or content */}
          {(lesson.type === "document" || lesson.type === "video") && (
            <TextField
              label="Link"
              value={lesson.link || ""}
              onChange={e => setLesson({ ...lesson, link: e.target.value })}
              fullWidth
              margin="normal"
            />
          )}
        </>
      )}

      {/* For document, show autocomplete for document selection */}
      {lesson.type === "document" && (
        <Autocomplete
          options={window.documentList || []}
          getOptionLabel={option => option.name || ""}
          value={
            (window.documentList || []).find(doc => doc.id === lesson.documentId) || null
          }
          onChange={(event, value) => setLesson({ ...lesson, documentId: value ? value.id : null })}
          renderInput={params => (
            <TextField {...params} label="Select Document" margin="normal" fullWidth />
          )}
        />
      )}

      {/* For test, show test selection dropdown */}
      {lesson.type === "test" && (
        <Autocomplete
          options={window.testList || []}
          getOptionLabel={option => option.name || ""}
          value={
            (window.testList || []).find(test => test.id === lesson.testId) || null
          }
          onChange={(event, value) => setLesson({ ...lesson, testId: value ? value.id : null })}
          renderInput={params => (
            <TextField {...params} label="Select Test" margin="normal" fullWidth />
          )}
        />
      )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button
          onClick={() => {
            if (lesson.title.trim()) onSave(lesson);
          }}
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Modal for adding/editing a module (with lessons)
const ModuleModal = ({ open, onClose, onSave, initialData }) => {
  const [module, setModule] = useState(
    initialData || { title: "", description: "", lessons: [] }
  );
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLessonIdx, setEditingLessonIdx] = useState(null);

  useEffect(() => {
    setModule(initialData || { title: "", description: "", lessons: [] });
  }, [initialData, open]);

  const handleSaveLesson = (lesson) => {
    let lessons = [...module.lessons];
    if (editingLessonIdx !== null) {
      lessons[editingLessonIdx] = lesson;
    } else {
      lessons.push(lesson);
    }
    setModule({ ...module, lessons });
    setLessonModalOpen(false);
    setEditingLessonIdx(null);
  };

  const handleEditLesson = (idx) => {
    setEditingLessonIdx(idx);
    setLessonModalOpen(true);
  };

  const handleDeleteLesson = (idx) => {
    let lessons = [...module.lessons];
    lessons.splice(idx, 1);
    setModule({ ...module, lessons });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{initialData ? "Edit Module" : "Add Module"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Module Title"
            value={module.title}
            onChange={e => setModule({ ...module, title: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={module.description}
            onChange={e => setModule({ ...module, description: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Lessons</Typography>
            <List dense>
              {module.lessons.map((lesson, idx) => (
                <ListItem
                  key={idx}
                  secondaryAction={
                    <>
                      <IconButton onClick={() => handleEditLesson(idx)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteLesson(idx)} size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={lesson.title}
                    secondary={lesson.content && lesson.content.length > 40 ? lesson.content.slice(0, 40) + "..." : lesson.content}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              startIcon={<AddIcon />}
              onClick={() => { setEditingLessonIdx(null); setLessonModalOpen(true); }}
              sx={{ mt: 1 }}
              size="small"
              variant="outlined"
            >
              Add Lesson
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button
            onClick={() => {
              if (module.title.trim()) onSave(module);
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <LessonModal
        open={lessonModalOpen}
        onClose={() => { setLessonModalOpen(false); setEditingLessonIdx(null); }}
        onSave={handleSaveLesson}
        initialData={editingLessonIdx !== null ? module.lessons[editingLessonIdx] : null}
      />
    </>
  );
};

const CourseEdit = () => {
  const { id } = useParams(); // id is course id (for edit), undefined for create
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: "",
    description: "",
    status: "Draft",
    modules: [],
    schoolId: "",
    classId: "",
    divisionId: ""
  });
  const [loading, setLoading] = useState(false);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModuleIdx, setEditingModuleIdx] = useState(null);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useSelector(state => state.user);

  useEffect(() => {
    setCourse(prev => ({ ...prev, accountId: user?.user?.accountId }));
  }, [user]);

  console.log("user ===>", user);

  useEffect(() => {
    // Fetch schools on mount
    api.post(`api/schoolBranches/getAll/${user?.user?.accountId}`, {
      page: 0,
      size: 100,
      sortBy: "id",
      sortDir: "asc"
    }).then(res => setSchools(res.data.content || []));

    api.post(`/api/schoolClasses/getAll/${user?.user?.accountId}`, {
      page: 0,
      size: 100,
      sortBy: "id",
      sortDir: "asc"
    }).then(res => setClasses(res.data.content || []));

    api.post(`/api/divisions/getAll/${user?.user?.accountId}`, {
      page: 0,
      size: 100,
      sortBy: "id",
      sortDir: "asc"
    }).then(res => setDivisions(res.data.content || []));
  }, []);

  // Fetch course for edit
  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/api/lms/courses/${user?.user?.accountId}/${id}`)
        .then(res => {
          const c = res.data || {};
          setCourse({
            id: c.id || null,
            title: c.title || "",
            description: c.description || "",
            status: c.status || "Draft",
            schoolId: c.schoolId || "",
            classId: c.classId || "",
            divisionId: c.divisionId || "",
            modules: c.modules || [],
            accountId: c.accountId || user?.user?.accountId,
            schoolName: c.schoolName || "",
            className: c.className || "",
            divisionName: c.divisionName || ""
          });
        })
        .catch(() => setCourse({
          title: "",
          description: "",
          status: "Draft",
          modules: []
        }))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Module handlers
  const handleSaveModule = (module) => {
    let modules = [...course.modules];
    if (editingModuleIdx !== null) {
      modules[editingModuleIdx] = module;
    } else {
      modules.push(module);
    }
    setCourse({ ...course, modules });
    setModuleModalOpen(false);
    setEditingModuleIdx(null);
  };

  const handleEditModule = (idx) => {
    setEditingModuleIdx(idx);
    setModuleModalOpen(true);
  };

  const handleDeleteModule = (idx) => {
    let modules = [...course.modules];
    modules.splice(idx, 1);
    setCourse({ ...course, modules });
  };

  // Save course (create or update)
  const handleSaveCourse = async () => {
    setLoading(true);
    try {
      if (id) {
        // Update
        await api.put(`/api/lms/course/update/${id}`, course);
        // Optionally update modules/lessons via separate endpoints if needed
      } else {
        // Create
        const res = await api.post("/api/lms/course/save", course);
        // Optionally redirect to edit page for new course
        if (res.data && res.data.id) {
          navigate(`/masters/lms/course/${res.data.id}`);
        }
      }
      alert("Course saved successfully!");
    } catch (err) {
      alert("Failed to save course.");
    }
    setLoading(false);
  };

  // --- Add imports at the top of the file if not already present:




  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {id ? "Edit Course" : "Create Course"}
      </Typography>
      <Grid container spacing={gridSpacing}>
        {/* School Selection */}

        <Grid item xs={3}>
          <Autocomplete
            disablePortal
            options={schools}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => setCourse({ ...course, schoolId: value?.id, schoolName: value?.name })}
            renderInput={(params) => <TextField {...params} label="School" />}
            value={schools.find((st) => st.id === course.schoolId) || null}
          />
        </Grid>
        {/* Class Selection */}
        <Grid item xs={3}>
          <Autocomplete
            disablePortal
            options={classes}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => setCourse({ ...course, classId: value?.id, className: value?.name })}
            renderInput={(params) => <TextField {...params} label="Class" />}
            value={classes.find((st) => st.id === course.classId) || null}
          />
        </Grid>
        {/* Division Selection */}
        <Grid item xs={3}>
          <Autocomplete
            disablePortal
            options={divisions}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => setCourse({ ...course, divisionId: value?.id, divisionName: value?.name })}
            renderInput={(params) => <TextField {...params} label="Division" />}
            value={divisions.find((st) => st.id === course.divisionId) || null}
          />
        </Grid>
        {/* Status Selection */}
        <Grid item xs={3}>
          <TextField
            select
            label="Status"
            value={course.status}
            onChange={e => setCourse({ ...course, status: e.target.value })}
            fullWidth
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DRAFT">Draft</option>
          </TextField>
        </Grid>

        <Grid item xs={12}>


          <TextField
            label="Course Title"
            value={course.title}
            onChange={e => setCourse({ ...course, title: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={course.description}
            onChange={e => setCourse({ ...course, description: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h6">Modules</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => { setEditingModuleIdx(null); setModuleModalOpen(true); }}
              variant="contained"
              size="small"
            >
              Add Module
            </Button>
          </Box>
        </Box>
        {/* Removed global Collapse; collapse/expand will be handled per module below */}
          <Grid container spacing={2}>
            {course.modules && course.modules.length > 0 ? (
              course.modules.map((module, idx) => (
                <Grid item xs={12} md={12} key={idx}>
                  <Paper sx={{ p: 2, mb: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                      <Box>
                        <Typography variant="subtitle1">{module.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{module.description}</Typography>
                      </Box>
                      <Box>
                        <IconButton onClick={() => handleEditModule(idx)} size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteModule(idx)} size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2">Lessons:</Typography>
                      <List dense>
                        {module.lessons && module.lessons.length > 0 ? (
                          module.lessons.map((lesson, lidx) => (
                            <ListItem key={lidx}>
                              <ListItemText
                                primary={lesson.title}
                                secondary={lesson.content && lesson.content.length > 40 ? lesson.content.slice(0, 40) + "..." : lesson.content}
                              />
                              <ListItemText
                                primary={lesson.type}
                              />
                              <ListItemText
                                primary={lesson.link}
                              />
                              <ListItemText
                                primary={lesson.documentId}
                              />
                              <ListItemText
                                primary={lesson.testId}
                              />
                              <Checkbox
                                edge="start"
                                checked={!!lesson.status}
                                onChange={e => {
                                  // Update the status field of the lesson (completed or not)
                                  const updatedModules = [...course.modules];
                                  updatedModules[idx].lessons = updatedModules[idx].lessons.map((l, i) =>
                                    i === lidx ? { ...l, status: e.target.checked } : l
                                  );
                                  setCourse({ ...course, modules: updatedModules });
                                }}
                                inputProps={{ 'aria-label': 'Mark lesson as completed' }}
                                sx={{ mr: 1 }}
                              />
                              <IconButton onClick={() => handleDeleteLesson(idx)} size="small" color="error">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </ListItem>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemText primary="No lessons added." />
                          </ListItem>
                        )}
                      </List>
                    </Box>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography color="text.secondary">No modules added yet.</Typography>
              </Grid>
            )}
          </Grid>
        
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveCourse}
          disabled={loading || !course.title}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => navigate("/masters/lms")}
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>
      {/* Full Screen Modal */}
      <Modal
        open={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isFullScreen}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflow: 'auto'
          }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
              <Typography variant="h4">Course Modules - Full Screen View</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  size="large"
                  title={isCollapsed ? "Expand" : "Collapse"}
                >
                  {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                </IconButton>
                <IconButton 
                  onClick={() => setIsFullScreen(false)}
                  size="large"
                  title="Exit Full Screen"
                >
                  <FullscreenExitIcon />
                </IconButton>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => { setEditingModuleIdx(null); setModuleModalOpen(true); }}
                  variant="contained"
                  size="large"
                >
                  Add Module
                </Button>
              </Box>
            </Box>
            
            <Collapse in={!isCollapsed}>
              <Grid container spacing={3}>
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module, idx) => (
                    <Grid item xs={12} lg={6} xl={4} key={idx}>
                      <Paper sx={{ p: 3, mb: 2, height: 'fit-content' }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                          <Box>
                            <Typography variant="h6">{module.title}</Typography>
                            <Typography variant="body1" color="text.secondary">{module.description}</Typography>
                          </Box>
                          <Box>
                            <IconButton onClick={() => handleEditModule(idx)} size="medium">
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteModule(idx)} size="medium" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="h6" sx={{ mb: 1 }}>Lessons:</Typography>
                          <List>
                            {module.lessons && module.lessons.length > 0 ? (
                              module.lessons.map((lesson, lidx) => (
                                <ListItem key={lidx} sx={{ px: 0 }}>
                                  <ListItemText
                                    primary={<Typography variant="subtitle1">{lesson.title}</Typography>}
                                    secondary={<Typography variant="body2">{lesson.content}</Typography>}
                                  />
                                  <Checkbox
                                    edge="end"
                                    checked={!!lesson.status}
                                    onChange={e => {
                                      const updatedModules = [...course.modules];
                                      updatedModules[idx].lessons = updatedModules[idx].lessons.map((l, i) =>
                                        i === lidx ? { ...l, status: e.target.checked } : l
                                      );
                                      setCourse({ ...course, modules: updatedModules });
                                    }}
                                    inputProps={{ 'aria-label': 'Mark lesson as completed' }}
                                    sx={{ mr: 1 }}
                                  />
                                  <IconButton onClick={() => handleDeleteLesson(idx)} size="medium" color="error">
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItem>
                              ))
                            ) : (
                              <ListItem sx={{ px: 0 }}>
                                <ListItemText primary={<Typography color="text.secondary">No lessons added.</Typography>} />
                              </ListItem>
                            )}
                          </List>
                        </Box>
                      </Paper>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="h6" color="text.secondary">No modules added yet.</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Click "Add Module" to get started.
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Collapse>
          </Box>
        </Fade>
      </Modal>

      <ModuleModal
        open={moduleModalOpen}
        onClose={() => { setModuleModalOpen(false); setEditingModuleIdx(null); }}
        onSave={handleSaveModule}
        initialData={editingModuleIdx !== null ? course.modules[editingModuleIdx] : null}
      />
    </Box>
  );
};

export default CourseEdit;
