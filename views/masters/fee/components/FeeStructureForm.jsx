import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import api, { userDetails } from 'utils/apiService';

const defaultForm = {
  feeTitle: '',
  year: '',
  amount: '',
  dueDate: '',
  schoolId: '',
  schoolName: '',
  classId: '',
  className: '',
  divisionId: '',
  divisionName: '',
  discount: '',
  lateFinePerDay: '',
  installmentEnabled: false,
  installments: 1,
  feeType: 'TUITION',
};

const FeeStructureForm = ({ open, onClose, onSaved, feeStructureId = null }) => {
  const accountId = userDetails.getAccountId();
  const [form, setForm] = useState(defaultForm);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(false);

  const academicYearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2000; year <= currentYear; year += 1) {
      years.push({ value: year, label: `${year}-${year + 1}` });
    }
    return years;
  }, []);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const payload = { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' };
        const [s, c] = await Promise.all([
          api.post(`/api/schoolBranches/getAll/${accountId}`, payload),
          api.post(`/api/schoolClasses/getAll/${accountId}`, payload),
        ]);
        setSchools(s.data.content || []);
        setClasses(c.data.content || []);
      } catch (e) {
        setSchools([]);
        setClasses([]);
      }
    };
    if (open) fetchMasters();
  }, [open, accountId]);

  useEffect(() => {
    const fetchDivisions = async () => {
      if (!form.classId) {
        setDivisions([]);
        return;
      }
      try {
        const payload = { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc', classId: form.classId, schoolId: form.schoolId };
        const d = await api.post(`/api/divisions/getAll/${accountId}`, payload);
        setDivisions(d.data.content || []);
      } catch (e) {
        setDivisions([]);
      }
    };
    fetchDivisions();
  }, [form.classId, form.schoolId, accountId]);

  useEffect(() => {
    const loadForEdit = async () => {
      if (!open || !feeStructureId) return;
      try {
        const res = await api.get(`/api/fee-structure/${feeStructureId}`);
        const fs = res.data || {};
        setForm({
          feeTitle: fs.feeTitle || '',
          year: fs.year || '',
          amount: fs.amount || '',
          dueDate: fs.dueDate ? fs.dueDate.substring(0, 10) : '',
          schoolId: fs.schoolId || '',
          schoolName: fs.schoolName || '',
          classId: fs.classId || '',
          className: fs.className || '',
          divisionId: fs.divisionId || '',
          divisionName: fs.divisionName || '',
          discount: fs.discount || '',
          lateFinePerDay: fs.lateFinePerDay || '',
          installmentEnabled: !!fs.installmentEnabled,
          installments: fs.installments || 1,
          feeType: fs.feeType || 'TUITION',
        });
      } catch (e) {
        // ignore
      }
    };
    loadForEdit();
  }, [open, feeStructureId]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        ...form,
        accountId,
        schoolName: schools.find((s) => s.id === form.schoolId)?.name || form.schoolName,
        className: classes.find((c) => c.id === form.classId)?.name || form.className,
        divisionName: divisions.find((d) => d.id === form.divisionId)?.name || form.divisionName,
        id: feeStructureId || undefined,
      };
      await api.post('/api/fee-structure/create', payload);
      onSaved && onSaved();
      onClose();
      setForm(defaultForm);
    } catch (e) {
      // optionally toast
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(defaultForm);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {feeStructureId ? 'Edit Fee Structure' : 'Add New Fee Structure'}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fee Title"
              value={form.feeTitle}
              onChange={(e) => setForm({ ...form, feeTitle: e.target.value })}
              placeholder="Term 1 Tuition Fee"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Academic Year"
              value={form.year || ''}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            >
              {academicYearOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Amount"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="12000"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Due Date"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              required
              label="School"
              value={form.schoolId}
              onChange={(e) => setForm({ ...form, schoolId: e.target.value })}
            >
              {schools.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              required
              label="Class"
              value={form.classId}
              onChange={(e) => setForm({ ...form, classId: e.target.value })}
            >
              {classes.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Division"
              value={form.divisionId}
              onChange={(e) => setForm({ ...form, divisionId: e.target.value })}
            >
              {divisions.map((d) => (
                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Discount (Optional)"
              type="number"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              placeholder="1000"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Late Fee After Due (per day)"
              type="number"
              value={form.lateFinePerDay}
              onChange={(e) => setForm({ ...form, lateFinePerDay: e.target.value })}
              placeholder="100"
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading || !form.feeTitle || !form.amount || !form.dueDate || !form.year}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default FeeStructureForm;


