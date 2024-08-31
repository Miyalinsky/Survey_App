<?php
$host = 'localhost';
$dbname = 'survey';  // データベース名
$user = 'root';      // データベースユーザー名
$pass = '';          // データベースパスワード

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("データベースに接続できません: " . $e->getMessage());
}
