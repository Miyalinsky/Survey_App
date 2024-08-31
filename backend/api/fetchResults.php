<?php
// 必要最小限のCORS設定
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// データベース接続と結果取得処理
include '../includes/db.php';

header("Content-Type: application/json");

$stmt = $pdo->query("SELECT * FROM survey_responses");
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($results);
