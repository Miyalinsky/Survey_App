import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ChartDisplay() {
    const [ageData, setAgeData] = useState([]);
    const [psqiData, setPsqiData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost/Survey_App/backend/api/fetchResults.php');
                const data = response.data;

                // 年齢データの収集
                const ages = data.map(item => item.age);
                setAgeData(ages);

                // PSQIスコアデータの収集
                const psqiScores = data.map(item => item.total_psqi_score);
                setPsqiData(psqiScores);

            } catch (error) {
                console.error('データ取得エラー:', error);
            }
        };

        fetchData();
    }, []);

    const createHistogram = (data, label, color, binSize, min, max) => {
        // ヒストグラムのビン（区間）を設定
        const bins = Array.from({ length: Math.ceil((max - min + 1) / binSize) }, (_, i) => min + i * binSize);
        const counts = new Array(bins.length).fill(0);

        data.forEach(value => {
            if (value >= min && value <= max) {
                const binIndex = Math.floor((value - min) / binSize);
                counts[binIndex]++;
            }
        });

        return {
            labels: bins,
            datasets: [
                {
                    label: label,
                    data: counts,
                    backgroundColor: color,
                },
            ],
        };
    };

    const ageHistogramData = createHistogram(ageData, 'Age Distribution', 'rgba(75, 192, 192, 0.6)', 1, 0, 100);
    const psqiHistogramData = createHistogram(psqiData, 'PSQI Score Distribution', 'rgba(153, 102, 255, 0.6)', 1, 0, 21);

    return (
        <div>
            <h2>回答者年齢</h2>
            <Bar
                data={ageHistogramData}
                options={{
                    scales: {
                        x: {
                            beginAtZero: true,
                            min: 0,
                            max: 100
                        },
                        y: { beginAtZero: true }
                    }
                }}
            />
            <h2>回答者PSQIスコア</h2>
            <Bar
                data={psqiHistogramData}
                options={{
                    scales: {
                        x: {
                            beginAtZero: true,
                            min: 0,
                            max: 21
                        },
                        y: { beginAtZero: true }
                    }
                }}
            />
        </div>
    );
}

export default ChartDisplay;
