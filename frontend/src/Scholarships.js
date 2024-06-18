import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Scholarships = () => {
    const [scholarships, setScholarships] = useState([]);
    const [searchParams, setSearchParams] = useState({
        country: '',
        field_of_study: '',
        degree_level: ''
    });
    const [scholarshipId, setScholarshipId] = useState('');
    const [scholarship, setScholarship] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/scholarships');
                setScholarships(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/scholarships/search', {
                params: searchParams
            });
            setScholarships(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({
            ...searchParams,
            [name]: value
        });
    };

    const handleSearchById = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/scholarships/${scholarshipId}`);
            setScholarship(response.data);
            setScholarships([]); // Clear the list of scholarships
        } catch (err) {
            console.error(err);
            setScholarship(null);
        }
    };

    return (
        <div>
            <h1>Scholarships</h1>
            <div>
                <h2>Search by Criteria</h2>
                <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={searchParams.country}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="field_of_study"
                    placeholder="Field of Study"
                    value={searchParams.field_of_study}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="degree_level"
                    placeholder="Degree Level"
                    value={searchParams.degree_level}
                    onChange={handleInputChange}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div>
                <h2>Search by ID</h2>
                <input
                    type="text"
                    placeholder="Scholarship ID"
                    value={scholarshipId}
                    onChange={(e) => setScholarshipId(e.target.value)}
                />
                <button onClick={handleSearchById}>Search</button>
            </div>
            {scholarship ? (
                <div>
                    <h2>{scholarship.name}</h2>
                    <p>{scholarship.description}</p>
                    <p>Eligibility: {scholarship.eligibility}</p>
                    <p>Country: {scholarship.country}</p>
                    <p>Field of Study: {scholarship.field_of_study}</p>
                    <p>Degree Level: {scholarship.degree_level}</p>
                    <p>Application Deadline: {scholarship.application_deadline}</p>
                    <a href={scholarship.link} target="_blank" rel="noopener noreferrer">Apply Here</a>
                </div>
            ) : (
                <ul>
                    {scholarships.map(scholarship => (
                        <li key={scholarship.scholarship_id}>
                            <h2>{scholarship.name}</h2>
                            <p>{scholarship.description}</p>
                            <p>Eligibility: {scholarship.eligibility}</p>
                            <p>Country: {scholarship.country}</p>
                            <p>Field of Study: {scholarship.field_of_study}</p>
                            <p>Degree Level: {scholarship.degree_level}</p>
                            <p>Application Deadline: {scholarship.application_deadline}</p>
                            <a href={scholarship.link} target="_blank" rel="noopener noreferrer">Apply Here</a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Scholarships;