import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Typography, CircularProgress, List, ListItemButton, ListItemText } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import api from 'utils/apiService';

const SearchResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        if (query) {
            setLoading(true);
            api.get(`api/search?q=${query}`).then(response => {
                setResults(response.data);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [query]);

    return (
        <MainCard title={`Search Results for "${query}"`}>
            {loading ? (
                <Grid container justifyContent="center">
                    <CircularProgress />
                </Grid>
            ) : (
                <List>
                    {results.length > 0 ? (
                        results.map(result => (
                            <ListItemButton key={result.id} component="a" href={result.url}>
                                <ListItemText primary={result.title} secondary={result.description} />
                            </ListItemButton>
                        ))
                    ) : (
                        <Typography>No results found.</Typography>
                    )}
                </List>
            )}
        </MainCard>
    );
};

export default SearchResults;