import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import api, { userDetails } from '../../../utils/apiService';
import BackButton from 'layout/MainLayout/Button/BackButton';
import { toast } from 'react-hot-toast';

const defaultActions = ["add", "edit", "view", "delete"];

const RoleEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [role, setRole] = useState({
    id: null,
    name: "",
    permissions: [],
    schoolId: null,
    schoolName: ""
  });
  const [entities, setEntities] = useState([]);
  const [schools, setSchools] = useState([]);
  const accountId = userDetails.getAccountId();
  
  // Fetch entities, schools, and role data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entitiesRes, schoolsRes] = await Promise.all([
          api.get(`api/features/getAllByAccountId/${accountId}`),
          api.get(`api/schoolBranches/getAllBy/${accountId}`)
        ]);

        setEntities(entitiesRes.data || []);
        setSchools(schoolsRes.data || []);

        if (id) {
          const roleRes = await api.get(`api/roles/getById?id=${id}`);
          setRole(roleRes.data);
        }
      } catch (err) {
        toast.error("Failed to fetch initial data.");
        console.error(err);
      }
    };
    fetchData();
  }, [id, accountId]);

  // Handle role name change
  const handleNameChange = (e) => {
    setRole({ ...role, name: e.target.value });
  };

  // Handle permission change
  const handlePermissionChange = (entityName, action) => (e) => {
    setRole((prevRole) => {
      const permissions = [...prevRole.permissions];
      let permIdx = permissions.findIndex((p) => p.entityName === entityName);
      if (permIdx === -1) {
        permissions.push({
          id: null,
          name: entities.find((ent) => ent.name === entityName)?.name || "",
          entityName: entityName,
          actions: {
            id: null,
            add: false,
            edit: false,
            view: false,
            delete: false
          },
          accountId: accountId
        });
        permIdx = permissions.length - 1;
      }
      permissions[permIdx] = {
        ...permissions[permIdx],
        actions: {
          ...permissions[permIdx].actions,
          [action]: e.target.checked
        }
      };
      return { ...prevRole, permissions };
    });
  };

  // Get checked state for a permission
  const isChecked = (entityName, action) => {
    const perm = role.permissions.find((p) => p.entityName === entityName);
    return perm?.actions?.[action] || false;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...role, accountId: accountId };
    try {
      if (id) {
        await api.put("api/roles/update", payload);
        toast.success("Role updated successfully!");
      } else {
        await api.post("api/roles/save", payload);
        toast.success("Role created successfully!");
      }
      navigate("/masters/roles");
    } catch (err) {
      toast.error("Failed to save role.");
      console.error(err);
    }
  };

  return (
    <MainCard title={role.id ? "Edit Role" : "Create Role"}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Role Name"
              value={role.name}
              onChange={handleNameChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              options={schools}
              getOptionLabel={(option) => option.name}
              value={schools.find(s => s.id === role.schoolId) || null}
              onChange={(event, newValue) => {
                setRole({ ...role, schoolId: newValue?.id, schoolName: newValue?.name });
              }}
              renderInput={(params) => <TextField {...params} label="School" />}
            />
          </Grid>
        </Grid>
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Configure Permissions
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Entity</TableCell>
                  {defaultActions.map((action) => (
                    <TableCell key={action} align="center" sx={{ textTransform: "capitalize" }}>
                      {action}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {entities.map((entity) => (
                  <TableRow key={entity.id}>
                    <TableCell>{entity.name}</TableCell>
                    {defaultActions.map((action) => (
                      <TableCell align="center" key={action}>
                        <Checkbox
                          checked={isChecked(entity.name, action)}
                          onChange={handlePermissionChange(entity.name, action)}
                          color="primary"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box mt={3} display="flex" gap={2}>
          <Button type="submit" variant="contained" color="primary">
            {role.id ? "Update" : "Create"}
          </Button>
          <Grid container spacing={gridSpacing}>
            <BackButton BackUrl={"/masters/roles"}/> 
          </Grid>
        </Box>
      </form>
    </MainCard>
  );
};
export default RoleEdit;