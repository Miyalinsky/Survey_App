import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ResultsTable() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost/Survey_App/backend/api/fetchResults.php');
                console.log('ResultsTable - Fetched Data:', response.data); // データのログを確認
                setResults(response.data);
            } catch (error) {
                console.error('ResultsTable - データ取得エラー:', error);
            }
        }

        fetchData();
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>PSQI score</th>
                </tr>
            </thead>
            <tbody>
                {results.map((result, index) => {
                    const key = result.id;
                    return (
                        <tr key={key}>
                            <td>{result.id}</td>
                            <td>{result.response_time}</td>
                            <td>{result.email}</td>
                            <td>{result.name}</td>
                            <td>{result.age}</td>
                            <td>{result.total_psqi_score}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default ResultsTable;
