<?php
// 必要最小限のCORS設定
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// POSTリクエストの処理
include '../includes/db.php';
include '../includes/functions.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $email = sanitizeInput($data['email']);
    $name = sanitizeInput($data['name']);
    $age = (int)$data['age'];

    if (validateEmail($email) && !empty($name) && $age > 0) {
        $stmt = $pdo->prepare("INSERT INTO survey_responses (email, name, age) VALUES (?, ?, ?)");
        $stmt->execute([$email, $name, $age]);

        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
