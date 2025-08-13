import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import api from "../../../../utils/apiService";

/**
 * AddLessonModal component
 * Props:
 *   open: boolean (modal open state)
 *   onClose: function to close modal
 *   moduleId: string or number (module id)
 *   courseId: string or number (course id, optional)
 *   onLessonAdded: function to call after successful lesson add (e.g., refresh)
 */
const AddLessonModal = ({
  open,
  onClose,
  moduleId,
  courseId,
  onLessonAdded,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddLesson = async () => {
    if (!title.trim()) {
      setError("Lesson title is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post(`/api/modules/${moduleId}/lessons`, {
        title,
        description,
      });
      setTitle("");
      setDescription("");
      setError("");
      setLoading(false);
      onClose();
      if (onLessonAdded) onLessonAdded();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to add lesson. Please try again."
      );
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setError("");
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Lesson</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Lesson Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
          {error && (
            <Box sx={{ color: "error.main", fontSize: 14 }}>{error}</Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleAddLesson}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Lesson"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLessonModal;
