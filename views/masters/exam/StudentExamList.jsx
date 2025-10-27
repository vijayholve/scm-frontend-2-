import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-hot-toast';
import api, { userDetails } from 'utils/apiService';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const StudentExamList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('exam');
  const user = useSelector((state) => state.user.user);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [error, setError] = useState(null);

  const fetchExams = useCallback(async () => {
    const { id: studentId, accountId, schoolId, classId, divisionId } = user;

    if (!accountId || !studentId || !schoolId || !classId || !divisionId) {
      setError('User profile details are incomplete. Cannot fetch exams.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        page: paginationModel.page,
        size: paginationModel.pageSize,
        sortBy: 'id',
        sortDir: 'asc',
        schoolId: schoolId,
        classId: classId,
        divisionId: divisionId
      };
      const response = await api.post(`/api/exams/getAllBy/${accountId}`, payload);
      const content = response?.data?.content || response?.data || [];
      setExams(content);
      setRowCount(response?.data?.totalElements || content.length || 0);
    } catch (err) {
      console.error('Failed to load exams:', err);
      toast.error(t('errors.loadExams') || 'Could not load exams.');
      setExams([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, [user, paginationModel.page, paginationModel.pageSize, t]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const columns = [
    { field: 'examName', headerName: t('columns.examName') || 'Exam Name', flex: 1 },
    { field: 'className', headerName: t('columns.class') || 'Class', flex: 1 },
    { field: 'divisionName', headerName: t('columns.division') || 'Division', flex: 1 },
    {
      field: 'actions',
      headerName: t('columns.actions') || 'Actions',
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button variant="contained" color="primary" size="small" onClick={() => navigate(`/masters/exams/student/result/${params.row.id}`)}>
          {t('Actions.ViewResult') || 'View Result'}
        </Button>
      )
    }
  ];

  if (error) {
    return (
      <MainCard title={t('title.availableExams') || 'Available Exams'}>
        <Alert severity="error">{error}</Alert>
      </MainCard>
    );
  }

  return (
    <MainCard title={t('title.availableExams') || 'Available Exams'}>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={exams}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          paginationMode="server"
          rowCount={rowCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </Box>
    </MainCard>
  );
};

export default StudentExamList;
