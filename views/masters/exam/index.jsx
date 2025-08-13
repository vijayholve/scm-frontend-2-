import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Button,
  IconButton
} from "@mui/material";
import { styled } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { toast } from 'react-hot-toast';

const ActionWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 6px'
});

// --- Dummy Data ---
const dummyExams = [
    { id: 1, examName: "Mid-Term Exam", academicYear: "2025", examType: "MIDTERM", maxMarksOverall: 175, startDate: "2025-10-20T09:00:00.000Z" },
    { id: 2, examName: "Final Practical Exam", academicYear: "2025", examType: "PRACTICAL", maxMarksOverall: 100, startDate: "2025-11-15T10:00:00.000Z" },
    { id: 3, examName: "History Quiz 1", academicYear: "2025", examType: "QUIZ", maxMarksOverall: 25, startDate: "2025-09-05T11:00:00.000Z" }
];

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // Using dummy data
    setExams(dummyExams);
    setLoading(false);
  }, []);

  const handleOnClickDelete = (id) => {
      if (window.confirm('Are you sure you want to delete this exam?')) {
          toast.success(`(Dummy) Deleted exam with ID: ${id}`);
          setExams(prevExams => prevExams.filter(exam => exam.id !== id));
      }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'examName', headerName: 'Exam Name', flex: 1 },
    { field: 'academicYear', headerName: 'Year', width: 100 },
    { field: 'examType', headerName: 'Exam Type', flex: 1 },
    { field: 'maxMarksOverall', headerName: 'Total Marks', width: 130 },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 180,
      valueFormatter: (params) => {
        if (!params || !params.value) return 'N/A';
        return new Date(params.value).toLocaleString();
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      sortable: false,
      renderCell: (params) => (
        <ActionWrapper>
          <IconButton color="secondary" onClick={() => navigate(`/masters/exam/view/${params.row.id}`)}>
            <VisibilityIcon />
          </IconButton>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/masters/exam/edit/${params.row.id}`)}
            startIcon={<EditOutlinedIcon />}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleOnClickDelete(params.row.id)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </ActionWrapper>
      )
    }
  ];

  return (
    <MainCard title="Manage Exams" secondary={<SecondaryAction icon={<AddIcon />} link="/masters/exam/add" />}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={exams}
              columns={columns}
              loading={loading}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Exams;