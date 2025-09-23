import PropTypes from 'prop-types';
import { useState, forwardRef, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ListSubheader from '@mui/material/ListSubheader';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// third-party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
import Transitions from 'ui-component/extended/Transitions';
import api, { userDetails } from 'utils/apiService';

// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons-react';

const HeaderAvatar = forwardRef(({ children, ...others }, ref) => {
  const theme = useTheme();

  return (
    <Avatar
      ref={ref}
      variant="rounded"
      sx={{
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        bgcolor: 'secondary.light',
        color: 'secondary.dark',
        '&:hover': {
          bgcolor: 'secondary.dark',
          color: 'secondary.light'
        }
      }}
      {...others}
    >
      {children}
    </Avatar>
  );
});

HeaderAvatar.propTypes = {
  children: PropTypes.node
};

// ==============================|| SEARCH INPUT - MOBILE||============================== //

const MobileSearch = ({ value, setValue, popupState, filteredResults, showAll, setShowAll, loading }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    let finalPath = '';
    // The provided API response has a generic type 'user'. We will have to determine the actual type from somewhere else, or assume based on the search context.
    // For now, let's assume if the item's name contains "teacher", it's a teacher, otherwise, it's a student.
    // A more robust solution would involve the API returning the actual user type.
    if (item.name.toLowerCase().includes('teacher')) {
      finalPath = `/masters/teachers/view/${item.id}`;
    } else {
      finalPath = `/masters/students/view/${item.id}`;
    }
    navigate(finalPath);
    popupState.close();
    setValue('');
    setShowAll(false);
  };

  const resultsToShow = showAll ? filteredResults : filteredResults.slice(0, 5);

  return (
    <Box sx={{ position: 'relative' }}>
      <OutlinedInput
        id="input-search-header"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setShowAll(false);
        }}
        placeholder="Search anything..."
        startAdornment={
          <InputAdornment position="start">
            <IconSearch stroke={1.5} size="16px" />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <HeaderAvatar>
              <IconAdjustmentsHorizontal stroke={1.5} size="20px" />
            </HeaderAvatar>
            <Box sx={{ ml: 2 }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  bgcolor: 'orange.light',
                  color: 'orange.dark',
                  '&:hover': {
                    bgcolor: 'orange.dark',
                    color: 'orange.light'
                  }
                }}
                {...bindToggle(popupState)}
              >
                <IconX stroke={1.5} size="20px" />
              </Avatar>
            </Box>
          </InputAdornment>
        }
        aria-describedby="search-helper-text"
        inputProps={{ 'aria-label': 'weight', sx: { bgcolor: 'transparent', pl: 0.5 } }}
        sx={{ width: '100%', ml: 0.5, px: 2, bgcolor: 'background.paper' }}
      />
      {value && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1,  
            [theme.breakpoints.down('sm')]: {
              position: 'fixed',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0 ,
              zIndex: 1,
            },
            mt: 1,
            boxShadow: theme.shadows[4],
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : filteredResults.length > 0 ? (
                <ListSubheader component="div" id="nested-list-subheader">
                  Search Results
                </ListSubheader>
              ) : (
                <Box sx={{ p: 2 }}>
                  <Typography>No results found.</Typography>
                </Box>
              )
            }
          >
            {!loading &&
              resultsToShow.map((item) => (
                <ListItemButton key={item.id} onClick={() => handleItemClick(item)}>
                  <ListItemText primary={item.name.split(':')[0]} secondary={`Type: ${item.type}`} />
                </ListItemButton>
              ))}
            {!loading && filteredResults.length > 5 && !showAll && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                <Button onClick={() => setShowAll(true)}>Show more ({filteredResults.length - 5})</Button>
              </Box>
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

MobileSearch.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
  popupState: PropTypes.object,
  filteredResults: PropTypes.array,
  showAll: PropTypes.bool,
  setShowAll: PropTypes.func,
  loading: PropTypes.bool
};

// ==============================|| SEARCH INPUT ||============================== //

const SearchSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showAllResults, setShowAllResults] = useState(false);
  const anchorRef = useRef(null);

  const accountId = userDetails.getAccountId();

  useEffect(() => {
    const fetchResults = async () => {
      if (value.length > 1) {
        setLoading(true);
        try {
          const payload = {
            page: 0,
            size: 100,
            sortBy: 'id',
            sortDir: 'asc',
            search: value,
            accountId: accountId,
            fromDate: '2025-08-25T14:10:10.860Z',
            toDate: '2025-08-25T14:10:10.860Z'
          };
          const response = await api.post(`/api/users/search?type=teacher`, payload);
          setSearchResults(response?.data?.items || []);
        } catch (error) {
          console.error('Failed to fetch search results:', error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [value, accountId]);

  const handleItemClick = (item) => {
    let finalPath = '';
    // The provided API response has a generic type 'user'. We will have to determine the actual type from somewhere else, or assume based on the search context.
    // For now, let's assume if the item's name contains "teacher", it's a teacher, otherwise, it's a student.
    // A more robust solution would involve the API returning the actual user type.
    if (item.name.toLowerCase().includes('teacher')) {
      finalPath = `/masters/teachers/view/${item.id}`;
    } else {
      finalPath = `/masters/students/view/${item.id}`;
    }
    navigate(finalPath);
    setValue('');
    setShowAllResults(false);
  };

  const resultsToShow = showAllResults ? searchResults : searchResults.slice(0, 5);

  return (
    <>
      {/* Mobile Search */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <HeaderAvatar {...bindToggle(popupState)}>
                  <IconSearch stroke={1.5} size="19.2px" />
                </HeaderAvatar>
              </Box>
              <Popper
                {...bindPopper(popupState)}
                transition
                sx={{ zIndex: 1100, width: '99%', top: '-55px !important', px: { xs: 1.25, sm: 1.5 } }}
              >
                {({ TransitionProps }) => (
                  <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                    <Card sx={{ bgcolor: 'background.default', border: 0, boxShadow: 'none' }}>
                      <Box sx={{ p: 2 }}>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item xs>
                            <MobileSearch
                              value={value}
                              setValue={setValue}
                              popupState={popupState}
                              filteredResults={searchResults}
                              showAll={showAllResults}
                              setShowAll={setShowAllResults}
                              loading={loading}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Card>
                  </Transitions>
                )}
              </Popper>
            </>
          )}
        </PopupState>
      </Box>

      {/* Desktop Search */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Box sx={{ position: 'relative' }}>
          <OutlinedInput
            id="input-search-header"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setShowAllResults(false);
            }}
            placeholder="Search anything..."
            startAdornment={
              <InputAdornment position="start">
                <IconSearch stroke={1.5} size="16px" />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <HeaderAvatar>
                  <IconAdjustmentsHorizontal stroke={1.5} size="20px" />
                </HeaderAvatar>
              </InputAdornment>
            }
            aria-describedby="search-helper-text"
            inputProps={{ 'aria-label': 'weight', sx: { bgcolor: 'transparent', pl: 0.5 } }}
            sx={{ width: { md: 250, lg: 434 }, ml: 2, px: 2 }}
            ref={anchorRef}
          />
          <Popper
            open={Boolean(value)}
            anchorEl={anchorRef.current}
            transition
            disablePortal
            placement="bottom-start"
            sx={{ zIndex: 1100, mt: 1, width: { md: 250, lg: 434 } }}
          >
            {({ TransitionProps }) => (
              <Transitions type="grow" {...TransitionProps}>
                <Paper
                  sx={{
                    boxShadow: theme.shadows[4],
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}
                >
                  <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                          <CircularProgress size={24} />
                        </Box>
                      ) : searchResults.length > 0 ? (
                        <ListSubheader component="div" id="nested-list-subheader">
                          Search Results
                        </ListSubheader>
                      ) : (
                        <Box sx={{ p: 2 }}>
                          <Typography>No results found.</Typography>
                        </Box>
                      )
                    }
                  >
                    {!loading &&
                      resultsToShow.map((item) => (
                        <ListItemButton key={item.id} onClick={() => handleItemClick(item)}>
                          <ListItemText primary={item.name.split(':')[0]} secondary={`Type: ${item.type}`} />
                        </ListItemButton>
                      ))}
                    {!loading && searchResults.length > 5 && !showAllResults && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                        <Button onClick={() => setShowAllResults(true)}>Show more ({searchResults.length - 5})</Button>
                      </Box>
                    )}
                  </List>
                </Paper>
              </Transitions>
            )}
          </Popper>
        </Box>
      </Box>
    </>
  );
};

export default SearchSection;
