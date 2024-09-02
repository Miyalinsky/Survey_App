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

    $bedtimeHour = (int)$data['bedtimeHour'];
    $bedtimeMinute = (int)$data['bedtimeMinute'];
    $sleepDelayMinutes = (int)$data['sleepDelayMinutes'];
    $wakeTimeHour = (int)$data['wakeTimeHour'];
    $wakeTimeMinute = (int)$data['wakeTimeMinute'];
    $sleepDurationHour = (int)$data['sleepDurationHour'];
    $sleepDurationMinute = (int)$data['sleepDurationMinute'];
    $difficulty_sleeping_30min = sanitizeInput($data['difficulty_sleeping_30min']);
    $waking_up_night_early = sanitizeInput($data['waking_up_night_early']);
    $toilet_wake_up = sanitizeInput($data['toilet_wake_up']);
    $breath_difficulty = sanitizeInput($data['breath_difficulty']);
    $cough_snore = sanitizeInput($data['cough_snore']);
    $feeling_cold = sanitizeInput($data['feeling_cold']);
    $feeling_hot = sanitizeInput($data['feeling_hot']);
    $bad_dream = sanitizeInput($data['bad_dream']);
    $pain = sanitizeInput($data['pain']);
    $other_reason = sanitizeInput($data['other_reason']);
    $other_reason_difficulty = sanitizeInput($data['other_reason_difficulty']);
    $sleep_quality = sanitizeInput($data['sleep_quality']);
    $medication_use = sanitizeInput($data['medication_use']);
    $daytime_sleepiness = sanitizeInput($data['daytime_sleepiness']);
    $motivation_issue = sanitizeInput($data['motivation_issue']);

    // PSQI Component 1: Subjective Sleep Quality
    $sleep_quality_score = 0;
    if ($sleep_quality == 'very_good') {
        $sleep_quality_score = 0;
    } elseif ($sleep_quality == 'good') {
        $sleep_quality_score = 1;
    } elseif ($sleep_quality == 'bad') {
        $sleep_quality_score = 2;
    } elseif ($sleep_quality == 'very_bad') {
        $sleep_quality_score = 3;
    }

    // PSQI Component 2: Sleep Latency
    $sleep_latency_score = 0;
    if ($sleepDelayMinutes <= 15) {
        $sleep_latency_score = 0;
    } elseif ($sleepDelayMinutes <= 30) {
        $sleep_latency_score = 1;
    } elseif ($sleepDelayMinutes <= 60) {
        $sleep_latency_score = 2;
    } else {
        $sleep_latency_score = 3;
    }

    // PSQI Component 3: Sleep Duration
    $sleep_duration_score = 0;
    $total_sleep_minutes = ($sleepDurationHour * 60) + $sleepDurationMinute;
    if ($total_sleep_minutes >= 420) { // 7 hours or more
        $sleep_duration_score = 0;
    } elseif ($total_sleep_minutes >= 360) { // 6 to 7 hours
        $sleep_duration_score = 1;
    } elseif ($total_sleep_minutes >= 300) { // 5 to 6 hours
        $sleep_duration_score = 2;
    } else { // Less than 5 hours
        $sleep_duration_score = 3;
    }

    // PSQI Component 4: Habitual Sleep Efficiency
    $time_in_bed = (($wakeTimeHour * 60 + $wakeTimeMinute) - ($bedtimeHour * 60 + $bedtimeMinute)) % 1440; // minutes in bed
    if ($time_in_bed <= 0) {
        $time_in_bed += 1440; // Adjust for negative values due to wraparound midnight
    }
    $sleep_efficiency = ($total_sleep_minutes / $time_in_bed) * 100;

    $sleep_efficiency_score = 0;
    if ($sleep_efficiency >= 85) {
        $sleep_efficiency_score = 0;
    } elseif ($sleep_efficiency >= 75) {
        $sleep_efficiency_score = 1;
    } elseif ($sleep_efficiency >= 65) {
        $sleep_efficiency_score = 2;
    } else {
        $sleep_efficiency_score = 3;
    }

    // PSQI Component 5: Sleep Disturbances
    $sleep_disturbance_score = 0;
    $sleep_disturbances = [
        $difficulty_sleeping_30min,
        $waking_up_night_early,
        $toilet_wake_up,
        $breath_difficulty,
        $cough_snore,
        $feeling_cold,
        $feeling_hot,
        $bad_dream,
        $pain,
        $other_reason_difficulty
    ];

    foreach ($sleep_disturbances as $disturbance) {
        if ($disturbance === '3_or_more_times_per_week') {
            $sleep_disturbance_score += 3;
        } elseif ($disturbance === '1_to_2_times_per_week') {
            $sleep_disturbance_score += 2;
        } elseif ($disturbance === 'less_than_once_per_week') {
            $sleep_disturbance_score += 1;
        }
    }
    $sleep_disturbance_score = min($sleep_disturbance_score, 3); // Max score of 3

    // PSQI Component 6: Use of Sleeping Medication
    $medication_use_score = 0;
    if ($medication_use == 'none') {
        $medication_use_score = 0;
    } elseif ($medication_use == 'less_than_once_per_week') {
        $medication_use_score = 1;
    } elseif ($medication_use == '1_to_2_times_per_week') {
        $medication_use_score = 2;
    } elseif ($medication_use == '3_or_more_times_per_week') {
        $medication_use_score = 3;
    }

    // PSQI Component 7: Daytime Dysfunction
    $daytime_dysfunction_score = 0;
    if ($daytime_sleepiness === '3_or_more_times_per_week' || $motivation_issue === 'very_big_problems') {
        $daytime_dysfunction_score = 3;
    } elseif ($daytime_sleepiness === '1_to_2_times_per_week' || $motivation_issue === 'some_problems') {
        $daytime_dysfunction_score = 2;
    } elseif ($daytime_sleepiness === 'less_than_once_per_week' || $motivation_issue === 'few_problems') {
        $daytime_dysfunction_score = 1;
    } else {
        $daytime_dysfunction_score = 0;
    }

    // Calculate total PSQI score
    $total_psqi_score = $sleep_quality_score + $sleep_latency_score + $sleep_duration_score +
    $sleep_efficiency_score + $sleep_disturbance_score + $medication_use_score + $daytime_dysfunction_score;

    if (validateEmail($email) && !empty($name) && $age > 0) {
        $stmt = $pdo->prepare("INSERT INTO survey_responses (email, name, age, bedtimeHour, bedtimeMinute, sleepDelayMinutes, wakeTimeHour, wakeTimeMinute, sleepDurationHour, sleepDurationMinute, difficulty_sleeping_30min, waking_up_night_early, toilet_wake_up, breath_difficulty, cough_snore, feeling_cold, feeling_hot, bad_dream, pain, other_reason, other_reason_difficulty, sleep_quality, medication_use, daytime_sleepiness, motivation_issue, total_psqi_score) VALUES (:email, :name, :age, :bedtimeHour, :bedtimeMinute, :sleepDelayMinutes, :wakeTimeHour, :wakeTimeMinute, :sleepDurationHour, :sleepDurationMinute, :difficulty_sleeping_30min, :waking_up_night_early, :toilet_wake_up, :breath_difficulty, :cough_snore, :feeling_cold, :feeling_hot, :bad_dream, :pain, :other_reason, :other_reason_difficulty, :sleep_quality, :medication_use, :daytime_sleepiness, :motivation_issue, :total_psqi_score)");
        
        // パラメータをバインド
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':age', $age);
        $stmt->bindParam(':bedtimeHour', $bedtimeHour);
        $stmt->bindParam(':bedtimeMinute', $bedtimeMinute);
        $stmt->bindParam(':sleepDelayMinutes', $sleepDelayMinutes);
        $stmt->bindParam(':wakeTimeHour', $wakeTimeHour);
        $stmt->bindParam(':wakeTimeMinute', $wakeTimeMinute);
        $stmt->bindParam(':sleepDurationHour', $sleepDurationHour);
        $stmt->bindParam(':sleepDurationMinute', $sleepDurationMinute);
        $stmt->bindParam(':difficulty_sleeping_30min', $difficulty_sleeping_30min);
        $stmt->bindParam(':waking_up_night_early', $waking_up_night_early);
        $stmt->bindParam(':toilet_wake_up', $toilet_wake_up);
        $stmt->bindParam(':breath_difficulty', $breath_difficulty);
        $stmt->bindParam(':cough_snore', $cough_snore);
        $stmt->bindParam(':feeling_cold', $feeling_cold);
        $stmt->bindParam(':feeling_hot', $feeling_hot);
        $stmt->bindParam(':bad_dream', $bad_dream);
        $stmt->bindParam(':pain', $pain);
        $stmt->bindParam(':other_reason', $other_reason);
        $stmt->bindParam(':other_reason_difficulty', $other_reason_difficulty);
        $stmt->bindParam(':sleep_quality', $sleep_quality);
        $stmt->bindParam(':medication_use', $medication_use);
        $stmt->bindParam(':daytime_sleepiness', $daytime_sleepiness);
        $stmt->bindParam(':motivation_issue', $motivation_issue);
        $stmt->bindParam(':total_psqi_score', $total_psqi_score);
        
        $stmt->execute();

        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
