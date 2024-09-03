import React, { useEffect, useState } from 'react';
import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import axios from 'axios';

function Histogram3D() {
    const [ageData, setAgeData] = useState([]);
    const [psqiData, setPsqiData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost/Survey_App/backend/api/fetchResults.php');
                const data = response.data;

                const ages = data.map(item => item.age);
                const psqiScores = data.map(item => item.total_psqi_score);

                setAgeData(ages);
                setPsqiData(psqiScores);
            } catch (error) {
                console.error('データ取得エラー:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const canvas = document.getElementById('renderCanvas');
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);

        scene.clearColor = new BABYLON.Color4(0.9, 0.9, 0.9, 1);

        const camera = new BABYLON.ArcRotateCamera('camera1', -Math.PI / 2, Math.PI / 3, 100, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), scene);

        const createAxes = (scene) => {
            const xAxis = BABYLON.MeshBuilder.CreateLines("xAxis", {
                points: [
                    new BABYLON.Vector3(0, 0, 0),
                    new BABYLON.Vector3(100, 0, 0)
                ]
            }, scene);
            xAxis.color = BABYLON.Color3.Red();

            const yAxis = BABYLON.MeshBuilder.CreateLines("yAxis", {
                points: [
                    new BABYLON.Vector3(0, 0, 0),
                    new BABYLON.Vector3(0, 30, 0)
                ]
            }, scene);
            yAxis.color = BABYLON.Color3.Green();

            const zAxis = BABYLON.MeshBuilder.CreateLines("zAxis", {
                points: [
                    new BABYLON.Vector3(0, 0, 0),
                    new BABYLON.Vector3(0, 0, 50) // PSQI軸をスケール調整後の範囲に対応
                ]
            }, scene);
            zAxis.color = BABYLON.Color3.Blue();

            const createAxisLabels = (axisName, positions, labels, axisColor) => {
                positions.forEach((pos, index) => {
                    const label = new GUI.TextBlock();
                    label.text = labels[index];
                    label.color = axisColor.toHexString();
                    label.fontSize = 1000;

                    const plane = BABYLON.MeshBuilder.CreatePlane(`${axisName}-label-${index}`, { size: 2 }, scene);
                    plane.position = pos;
                    plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

                    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane);
                    advancedTexture.addControl(label);
                });
            };

            const xLabels = Array.from({ length: 21 }, (_, i) => (i * 5).toString());
            const xPositions = Array.from({ length: 21 }, (_, i) => new BABYLON.Vector3(i * 5, -1, 0));
            createAxisLabels("xAxis", xPositions, xLabels, BABYLON.Color3.Red());

            const yLabels = Array.from({ length: 7 }, (_, i) => (i * 5).toString());
            const yPositions = Array.from({ length: 7 }, (_, i) => new BABYLON.Vector3(-1, i * 5, 0));
            createAxisLabels("yAxis", yPositions, yLabels, BABYLON.Color3.Green());

            // PSQI軸のラベルをスケールに応じて修正（21段階を50まで引き伸ばしたスケールに対応）
            const zLabels = Array.from({ length: 12 }, (_, i) => (i * 2).toString());
            const zPositions = Array.from({ length: 12 }, (_, i) => new BABYLON.Vector3(0, -1, i * 4.2));
            createAxisLabels("zAxis", zPositions, zLabels, BABYLON.Color3.Blue());
        };

        createAxes(scene);

        const createHistogram = (ageData, psqiData) => {
            const ageBinSize = 5;  // 年齢のヒストグラムのボックスのサイズ
            const psqiBinSize = 1; // PSQIのヒストグラムのボックスのサイズ
            const zAxisScale = 2.38; // z軸のスケール調整（21/50 = 0.42 の逆数）

            const bins = {};

            ageData.forEach((age, index) => {
                const psqi = psqiData[index];
                const ageBin = Math.floor(age / ageBinSize) * ageBinSize;
                const psqiBin = Math.floor(psqi / psqiBinSize) * psqiBinSize;

                const key = `${ageBin}-${psqiBin}`;
                if (!bins[key]) {
                    bins[key] = 0;
                }
                bins[key]++;
            });

            for (const [key, count] of Object.entries(bins)) {
                const [ageBin, psqiBin] = key.split('-').map(Number);
                const height = count;

                const box = BABYLON.MeshBuilder.CreateBox(`box-${key}`, { height: height, width: ageBinSize, depth: psqiBinSize * zAxisScale }, scene);
                box.position.x = ageBin + ageBinSize / 2;
                box.position.y = height / 2;
                box.position.z = (psqiBin * zAxisScale) + (psqiBinSize * zAxisScale / 2);

                const material = new BABYLON.StandardMaterial(`mat-${key}`, scene);
                material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1);
                box.material = material;
            }
        };

        if (ageData.length > 0 && psqiData.length > 0) {
            createHistogram(ageData, psqiData);
        }

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });

        return () => {
            engine.dispose();
        };
    }, [ageData, psqiData]);

    return (
        <canvas id="renderCanvas" style={{ width: '100%', height: '500px' }}></canvas>
    );
}

export default Histogram3D;
