import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Heading, Text, View, Flex, ProgressCircle } from '@adobe/react-spectrum';
import { useAppContext } from '../context/AppContext';

const SearchResults = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentProvider, getToken } = useAppContext();

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const token = await getToken();
                // In a real application, you would make an API call here
                // For now, we'll just simulate a delay and return mock results
                await new Promise(resolve => setTimeout(resolve, 1000));
                setResults([
                    { id: 1, title: `Result 1 for "${query}"`, snippet: 'This is a sample result' },
                    { id: 2, title: `Result 2 for "${query}"`, snippet: 'Another sample result' },
                    { id: 3, title: `Result 3 for "${query}"`, snippet: 'Yet another sample result' },
                ]);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query, currentProvider, getToken]);

    if (loading) {
        return <ProgressCircle aria-label="Loading search results" isIndeterminate />;
    }

    return (
        <View>
            <Heading level={1}>Search Results for "{query}"</Heading>
            <Flex direction="column" gap="size-200">
                {results.map(result => (
                    <View key={result.id} backgroundColor="gray-100" padding="size-100">
                        <Heading level={3}>{result.title}</Heading>
                        <Text>{result.snippet}</Text>
                    </View>
                ))}
            </Flex>
        </View>
    );
};

export default SearchResults;