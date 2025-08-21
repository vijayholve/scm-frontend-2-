import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { userDetails } from '../../../utils/apiService';
import api from '../../../utils/apiService';
import { useDispatch, useSelector } from 'react-redux';
import { setAllStudents, filterStudents } from '../../../store/userSlice';
import ListGridFilters from '../../../ui-component/ListGridFilters';

const columnsConfig = [
  { field: 'rollno', headerName: 'Roll No', width: 90 },
  { field: 'userName', headerName: 'User Name', width: 150, flex: 1 },
  { field: 'name', headerName: 'Name', width: 150, flex: 1 },
  { field: 'email', headerName: 'Email', width: 110, flex: 1 },
  { field: 'mobile', headerName: 'Mobile', width: 110, flex: 1 },
  { field: 'address', headerName: 'Address', width: 110, flex: 1 },
  { field: 'className', headerName: 'Class', width: 110, flex: 1 },
  { field: 'divisionName', headerName: 'Division', width: 110, flex: 1 }
];

const Students = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accountId = userDetails.getAccountId();
  const [classNames, setClassNames] = useState({});
  const [divisionNames, setDivisionNames] = useState({});
  const [loading, setLoading] = useState(true);

  // Get filtered student data from the Redux store
  const filteredStudents = useSelector((state) => state.user.filteredStudents);
  const allStudents = useSelector((state) => state.user.allStudents);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classResponse, divisionResponse, studentResponse] = await Promise.all([
          api.post(`/api/schoolClasses/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' }),
          api.post(`/api/divisions/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' }),
          api.post(`/api/users/getAll/${accountId}?type=STUDENT`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' })
        ]);
        
        const classMap = {};
        (classResponse.data.content || []).forEach((cls) => {
          classMap[cls.id] = cls.name;
        });
        setClassNames(classMap);
        
        const divisionMap = {};
        (divisionResponse.data.content || []).forEach((div) => {
          divisionMap[div.id] = div.name;
        });
        setDivisionNames(divisionMap);
        
        dispatch(setAllStudents(studentResponse.data.content || []));
        setLoading(false);

      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setLoading(false);
      }
    };

    if (allStudents.length === 0) {
      fetchInitialData();
    } else {
      setLoading(false);
    }
  }, [accountId, dispatch, allStudents.length]);

  const transformStudentData = useCallback((student) => ({
    ...student,
    rollno: student.rollNo || student.id,
    name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.userName,
    className: classNames[student.classId] || 'N/A',
    divisionName: divisionNames[student.divisionId] || 'N/A'
  }), [classNames, divisionNames]);

  const handleFilterChange = useCallback((newFilters) => {
    dispatch(filterStudents(newFilters));
  }, [dispatch]);

  return (
    <MainCard
      title="Students Management"
      secondary={<SecondaryAction icon={<AddIcon />} link="/masters/student/add" />}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <ReusableDataGrid
            data={filteredStudents.map(transformStudentData)}
            fetchUrl={null}
            isPostRequest={false}
            loading={loading}
            onFiltersChange={handleFilterChange}
            columns={columnsConfig}
            editUrl="/masters/student/edit"
            deleteUrl="/api/users/delete"
            addActionUrl="/masters/student/add"
            viewUrl="/masters/students/view"
            entityName="STUDENT"
            searchPlaceholder="Search students by name, email, or roll number..."
            showSearch={true}
            showRefresh={false}
            showFilters={true}
            pageSizeOptions={[5, 10, 25, 50]}
            defaultPageSize={10}
            height={600}
            onRowClick={(params) => {
              navigate(`/masters/students/view/${params.row.id}`);
            }}
            enableFilters={true}
            showSchoolFilter={true}
            showClassFilter={true}
            showDivisionFilter={true}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Students;