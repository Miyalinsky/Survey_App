import React, { useState } from 'react';
import SurveyForm from './components/SurveyForm';
import ResultsTable from './components/ResultsTable';
import ChartDisplay from './components/ChartDisplay';
import Histogram3D from './components/Histogram3D';

function App() {
    const [refresh, setRefresh] = useState(false);

    const handleFormSubmit = () => {
        setRefresh(!refresh);
    };

    return (
        <div>
            <h1>ピッツバーグ睡眠質問票（PSQI）</h1>
            <SurveyForm onFormSubmit={handleFormSubmit} />
            <h2>結果テーブル</h2>
            <ResultsTable key={refresh} />
            <h2>結果ヒストグラム</h2>
            <ChartDisplay key={refresh} />
            <h2>3Dヒストグラム</h2>
            <Histogram3D key={refresh} />
        </div>
    );
}

export default App;
