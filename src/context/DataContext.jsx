import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [segments, setSegments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                setLoading(true);
                const [catRes, subRes, segRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/subcategories'),
                    api.get('/segments'),
                ]);
                setCategories(catRes.data);
                setSubcategories(subRes.data);
                setSegments(segRes.data);
            } catch (err) {
                console.error("Failed to fetch global business data", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGlobalData();
    }, []);

    return (
        <DataContext.Provider value={{ categories, subcategories, segments, loading, error }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
