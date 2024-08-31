import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

function ChartDisplay() {
    const [chartData, setChartData] = useState(null);

    Chart.register(...registerables);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost/Survey_App/backend/api/fetchResults.php');
                const data = response.data;

                // 年齢を10歳ごとのビンに分割してカウント
                const bins = Array(10).fill(0);
                data.forEach(entry => {
                    const age = entry.age;
                    if (age >= 10 && age < 20) bins[0]++;
                    else if (age >= 20 && age < 30) bins[1]++;
                    else if (age >= 30 && age < 40) bins[2]++;
                    else if (age >= 40 && age < 50) bins[3]++;
                    else if (age >= 50 && age < 60) bins[4]++;
                    else if (age >= 60 && age < 70) bins[5]++;
                    else if (age >= 70 && age < 80) bins[6]++;
                    else if (age >= 80 && age < 90) bins[7]++;
                    else if (age >= 90 && age < 100) bins[8]++;
                });

                // 横軸のラベル（ビンの範囲）
                const labels = [
                    '10-19', '20-29', '30-39', '40-49',
                    '50-59', '60-69', '70-79', '80-89', '90-99'
                ];

                // Chart.js用のデータをセット
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Age Distribution',
                            data: bins,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        },
                    ],
                });
            } catch (error) {
                console.error('データ取得エラー:', error);
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            {chartData && <Bar data={chartData} options={{ scales: { x: { beginAtZero: true }, y: { beginAtZero: true } } }} />}
        </div>
    );
}

export default ChartDisplay;
