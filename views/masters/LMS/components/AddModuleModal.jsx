import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from "@mui/material";
import api from "../../../../utils/apiService";

/**
 * AddModuleModal component
 * Props:
 *   open: boolean (whether modal is open)
 *   onClose: function to close the modal
 *   courseId: string or number (course id)
 *   onModuleAdded: function to call after successful module add (e.g., to refresh modules)
 */
const AddModuleModal = ({ open, onClose, courseId, onModuleAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddModule = async () => {
    if (!title.trim()) {
      setError("Module title is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post(`/api/courses/${courseId}/modules`, {
        title,
        description,
      });
      setTitle("");
      setDescription("");
      if (onModuleAdded) onModuleAdded();
      onClose();
    } catch (err) {
      setError("Failed to add module. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Module</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Module Title"
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
          onClick={handleAddModule}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Module"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddModuleModal;
