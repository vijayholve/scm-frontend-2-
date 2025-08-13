import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api, { userDetails } from "../../../utils/apiService";
import MainCard from "ui-component/cards/MainCard";
import BackButton from "layout/MainLayout/Button/BackButton";
import { toast } from "react-hot-toast";

const examTypes = ["Midterm", "Final", "Quiz", "Practical", "Oral", "Internal", "Other"];

const EditExam = () => {
  const navigate = useNavigate();
  const { id: examId } = useParams();
  const [exam, setExam] = useState({
    examName: "",
    subject: "",
    examDate: "",
    examType: "",
    totalMarks: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (examId) {
      setLoading(true);
      api.get(`/api/exams/${examId}`)
        .then(response => {
          const data = response.data;
          // Format date for the input field
          data.examDate = new Date(data.examDate).toISOString().split('T')[0];
          setExam(data);
          setLoading(false);
        })
        .catch(err => {
          toast.error("Failed to fetch exam details.");
          console.error(err);
          setLoading(false);
        });
    }
  }, [examId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExam(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
        ...exam,
        accountId: userDetails.getAccountId(),
        createdBy: userDetails.getUser()?.userName,
        modifiedBy: userDetails.getUser()?.userName,
        totalMarks: Number(exam.totalMarks)
    };

    const apiCall = examId 
        ? api.put(`/api/exams/update/${examId}`, payload) 
        : api.post("/api/exams/create", payload);

    apiCall
      .then(() => {
        toast.success(`Exam ${examId ? 'updated' : 'created'} successfully!`);
        navigate("/masters/exams");
      })
      .catch(err => {
        toast.error(`Failed to ${examId ? 'update' : 'create'} exam.`);
        console.error(err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <MainCard title={examId ? "Edit Exam" : "Create Exam"}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Exam Name"
              name="examName"
              value={exam.examName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Subject"
              name="subject"
              value={exam.subject}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Exam Date"
              name="examDate"
              type="date"
              value={exam.examDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              select
              label="Exam Type"
              name="examType"
              value={exam.examType}
              onChange={handleChange}
            >
              {examTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Total Marks"
              name="totalMarks"
              type="number"
              value={exam.totalMarks}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <BackButton BackUrl="/masters/exams" />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Saving...' : 'Save Exam'}
            </Button>
        </Box>
      </form>
    </MainCard>
  );
};

export default EditExam;