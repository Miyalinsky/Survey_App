import React, { useState } from 'react';
import SurveyForm from './components/SurveyForm';
import ResultsTable from './components/ResultsTable';
import ChartDisplay from './components/ChartDisplay';

function App() {
    const [refresh, setRefresh] = useState(false);

    const handleFormSubmit = () => {
        setRefresh(!refresh);
    };

    return (
        <div>
            <h1>アンケートアプリ</h1>
            <SurveyForm onFormSubmit={handleFormSubmit} />
            <h2>アンケート結果</h2>
            <ResultsTable key={refresh} />
            <h2>年齢分布グラフ</h2>
            <ChartDisplay key={refresh} />
        </div>
    );
}

export default App;
