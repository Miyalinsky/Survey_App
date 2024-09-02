import React, { useState } from 'react';
import axios from 'axios';

function SurveyForm() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        age: '',
        bedtimeHour: '',
        bedtimeMinute: '',
        sleepDelayMinutes: '',
        wakeTimeHour: '',
        wakeTimeMinute: '',
        sleepDurationHour: '',
        sleepDurationMinute: '',
        difficulty_sleeping_30min: '',
        waking_up_night_early: '',
        toilet_wake_up: '',
        breath_difficulty: '',
        cough_snore: '',
        feeling_cold: '',
        feeling_hot: '',
        bad_dream: '',
        pain: '',
        other_reason: '',
        other_reason_difficulty: '',
        sleep_quality: '',
        medication_use: '',
        daytime_sleepiness: '',
        motivation_issue: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const completeFormData = {
            ...formData,
            bedtimeHour: parseInt(formData.bedtimeHour, 10),
            bedtimeMinute: parseInt(formData.bedtimeMinute, 10),
            sleepDelayMinutes: parseInt(formData.sleepDelayMinutes, 10),
            wakeTimeHour: parseInt(formData.wakeTimeHour, 10),
            wakeTimeMinute: parseInt(formData.wakeTimeMinute, 10),
            sleepDurationHour: parseInt(formData.sleepDurationHour, 10),
            sleepDurationMinute: parseInt(formData.sleepDurationMinute, 10),
            difficulty_sleeping_30min: formData.difficulty_sleeping_30min,
            waking_up_night_early: formData.waking_up_night_early,
            toilet_wake_up: formData.toilet_wake_up,
            breath_difficulty: formData.breath_difficulty,
            cough_snore: formData.cough_snore,
            feeling_cold: formData.feeling_cold,
            feeling_hot: formData.feeling_hot,
            bad_dream: formData.bad_dream,
            pain: formData.pain,
            other_reason: formData.other_reason,
            other_reason_difficulty: formData.other_reason_difficulty,
            sleep_quality: formData.sleep_quality,
            medication_use: formData.medication_use,
            daytime_sleepiness: formData.daytime_sleepiness,
            motivation_issue: formData.motivation_issue,
        };

        try {
            const response = await axios.post('http://localhost/Survey_App/backend/api/submitSurvey.php', completeFormData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('送信成功:', response.data);
        } catch (error) {
            console.error('送信エラー:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Age:</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required />
            </div>

            <h3>過去1ヶ月間における、あなたの通常の睡眠の習慣についておたずねします。過去1ヶ月間について大部分の日の昼と夜を考えて、以下の質問項目にできる限り正確にお答えください。</h3>

            <div>
                <label>問1. 過去1ヶ月間において、通常何時ごろ寝床につきましたか？</label>
                <select name="bedtimeHour" value={formData.bedtimeHour} onChange={handleChange}>
                    {[...Array(24).keys()].map((hour) => (
                        <option key={hour} value={hour}>{hour}時</option>
                    ))}
                </select>
                <select name="bedtimeMinute" value={formData.bedtimeMinute} onChange={handleChange}>
                    {[...Array(60).keys()].map((minute) => (
                        <option key={minute} value={minute}>{minute}分</option>
                    ))}
                </select>
            </div>

            <div>
                <label>問2. 過去1ヶ月間において、寝床についてから眠るまでにどれくらい時間を要しましたか？</label>
                <input
                    type="number"
                    name="sleepDelayMinutes"
                    value={formData.sleepDelayMinutes}
                    onChange={handleChange}
                    placeholder="分"
                />
            </div>

            <div>
                <label>問3. 過去1ヶ月間において、通常何時ごろ起床しましたか？</label>
                <select name="wakeTimeHour" value={formData.wakeTimeHour} onChange={handleChange}>
                    {[...Array(24).keys()].map((hour) => (
                        <option key={hour} value={hour}>{hour}時</option>
                    ))}
                </select>
                <select name="wakeTimeMinute" value={formData.wakeTimeMinute} onChange={handleChange}>
                    {[...Array(60).keys()].map((minute) => (
                        <option key={minute} value={minute}>{minute}分</option>
                    ))}
                </select>
            </div>

            <div>
                <label>問4. 過去1ヶ月間において、実際の睡眠時間は何時間くらいでしたか？</label>
                <select name="sleepDurationHour" value={formData.sleepDurationHour} onChange={handleChange}>
                    {[...Array(24).keys()].map((hour) => (
                        <option key={hour} value={hour}>{hour}時</option>
                    ))}
                </select>
                <select name="sleepDurationMinute" value={formData.sleepDurationMinute} onChange={handleChange}>
                    {[...Array(60).keys()].map((minute) => (
                        <option key={minute} value={minute}>{minute}分</option>
                    ))}
                </select>
            </div>

            <h4>過去1ヶ月間において、どれくらいの頻度で、以下の理由のために睡眠が困難でしたか？最もあてはまるものを1つ選んでください。</h4>

            <div>
                <label>問5-a. 寝床についてから30分以内に眠ることができなかったから。</label>
                <div>
                    <label>
                        <input type="radio" name="difficulty_sleeping_30min" value="none" onChange={handleChange} required />
                        なし
                    </label>
                    <label>
                        <input type="radio" name="difficulty_sleeping_30min" value="less_than_once_per_week" onChange={handleChange} />
                        1週間に1回未満
                    </label>
                    <label>
                        <input type="radio" name="difficulty_sleeping_30min" value="1_to_2_times_per_week" onChange={handleChange} />
                        1週間に1-2回
                    </label>
                    <label>
                        <input type="radio" name="difficulty_sleeping_30min" value="3_or_more_times_per_week" onChange={handleChange} />
                        1週間に3回以上
                    </label>
                </div>
            </div>

            <div>
                <label>問5-b. 夜間または早朝に目が覚めたから。</label>
                <div>
                    <label>
                        <input type="radio" name="waking_up_night_early" value="none" onChange={handleChange} required />
                        なし
                    </label>
                    <label>
                        <input type="radio" name="waking_up_night_early" value="less_than_once_per_week" onChange={handleChange} />
                        1週間に1回未満
                    </label>
                    <label>
                        <input type="radio" name="waking_up_night_early" value="1_to_2_times_per_week" onChange={handleChange} />
                        1週間に1-2回
                    </label>
                    <label>
                        <input type="radio" name="waking_up_night_early" value="3_or_more_times_per_week" onChange={handleChange} />
                        1週間に3回以上
                    </label>
                </div>
            </div>

            <div>
                <label>問5-c. トイレに起きたから。</label>
                <div>
                    <label>
                        <input type="radio" name="toilet_wake_up" value="none" onChange={handleChange} required />
                        なし
                    </label>
                    <label>
                        <input type="radio" name="toilet_wake_up" value="less_than_once_per_week" onChange={handleChange} />
                        1週間に1回未満
                    </label>
                    <label>
                        <input type="radio" name="toilet_wake_up" value="1_to_2_times_per_week" onChange={handleChange} />
                        1週間に1-2回
                    </label>
                    <label>
                        <input type="radio" name="toilet_wake_up" value="3_or_more_times_per_week" onChange={handleChange} />
                        1週間に3回以上
                    </label>
                </div>
            </div>

            <div>
                <label>問5-d. 息苦しかったから。</label>
                <div>
                    <label>
                        <input type="radio" name="breath_difficulty" value="none" onChange={handleChange} required />
                        なし
                    </label>
                    <label>
                        <input type="radio" name="breath_difficulty" value="less_than_once_per_week" onChange={handleChange} />
                        1週間に1回未満
                    </label>
                    <label>
                        <input type="radio" name="breath_difficulty" value="1_to_2_times_per_week" onChange={handleChange} />
                        1週間に1-2回
                    </label>
                    <label>
                        <input type="radio" name="breath_difficulty" value="3_or_more_times_per_week" onChange={handleChange} />
                        1週間に3回以上
                    </label>
                </div>
            </div>

            <div>
                <label>問5-e. 咳きが出たり大きないびきをかいたから。</label>
                <div>
                    <label>
                        <input type="radio" name="cough_snore" value="none" onChange={handleChange} required />
                        なし
                    </label>
                    <label>
                        <input type="radio" name="cough_snore" value="less_than_once_per_week" onChange={handleChange} />
                        1週間に1回未満
                    </label>
                    <label>
                        <input type="radio" name="cough_snore" value="1_to_2_times_per_week" onChange={handleChange} />
                        1週間に1-2回
                    </label>
                    <label>
                        <input type="radio" name="cough_snore" value="3_or_more_times_per_week" onChange={handleChange} />
                        1週間に3回以上
                    </label>
                </div>
            </div>

            <div>
                <label>問5-f. ひどく寒く感じたから。</label>
                <div>
                    <label>
                        <input type="radio" name="feeling_cold" value="none" onChange={handleChange} required />
                        なし
                    </label>
                    <label>
                        <input type="radio" name="feeling_cold" value="less_than_once_per_week" onChange={handleChange} />
                        1週間に1回未満
                    </label>
                    <label>
                        <input type="radio" name="feeling_cold" value="1_to_2_times_per_week" onChange={handleChange} />
                        1週間に1-2回
                    </label>
                    <label>
                        <input type="radio" name="feeling_cold" value="3_or_more_times_per_week" onChange={handleChange} />
                        1週間に3回以上
                    </label>
                </div>
            </div>

            <div>
                <label>問5-g. ひどく暑く感じたから。</label>
                <div>
                    <label>
                        <input type="radio" name="feeling_hot" value="none" onChange={handleChange} required />
                        なし
                    </label>
                    <label>
                        <input type="radio" name="feeling_hot" value="less_than_once_per_week" onChange={handleChange} />
                        1週間に1回未満
                    </label>
                    <label>
                        <input type="radio" name="feeling_hot" value="1_to_2_times_per_week" onChange={handleChange} />
                        1週間に1-2回
                    </label>
                    <label>
                        <input type="radio" name="feeling_hot" value="3_or_more_times_per_week" onChange={handleChange} />
                        1週間に3回以上
                    </label>
                </div>
            </div>

            <div>
                <label>問5-h. 悪い夢をみたから。</label>
                <div>
                    <label>
                        <input type="radio" name="bad_dream" value="none" onChange={handleChange} required />
                        なし
                    </label>
                    <label>
                        <input type="radio" name="bad_dream" value="less_than_once_per_week" onChange={handleChange} />
                        1週間に1回未満
                    </label>
                    <label>
                        <input type="radio" name="bad_dream" value="1_to_2_times_per_week" onChange={handleChange} />
                        1週間に1-2回
                    </label>
                    <label>
                        <input type="radio" name="bad_dream" value="3_or_more_times_per_week" onChange={handleChange} />
                        1週間に3回以上
                    </label>
                </div>
            </div>

            <div>
                <label>問5-i. 痛みがあったから。</label>
                <div>
                    <label>
                        <input type="radio" name="pain" value="none" onChange={handleChange} required />
                        なし
                    </label>
                    <label>
                        <input type="radio" name="pain" value="less_than_once_per_week" onChange={handleChange} />
                        1週間に1回未満
                    </label>
                    <label>
                        <input type="radio" name="pain" value="1_to_2_times_per_week" onChange={handleChange} />
                        1週間に1-2回
                    </label>
                    <label>
                        <input type="radio" name="pain" value="3_or_more_times_per_week" onChange={handleChange} />
                        1週間に3回以上
                    </label>
                </div>
            </div>

            <div>
                <label>問5-j. 上記以外の理由があれば次の空欄に記載してください。</label>
                <input
                    type="text"
                    name="other_reason"
                    value={formData.other_reason}
                    onChange={handleChange}
                    placeholder="自由記述"
                />
            </div>

            <div>
                <label>問5-k. 問5-jについて、そういったことのために、過去1ヶ月間において、どれくらいの頻度で、睡眠が困難でしたか？</label>
                <div>
                    <label>
                        <input type="radio" name="other_reason_difficulty" value="none" onChange={handleChange} required />
                        なし
                    </label>
                    <label>
                        <input type="radio" name="other_reason_difficulty" value="less_than_once_per_week" onChange={handleChange} />
                        1週間に1回未満
                    </label>
                    <label>
                        <input type="radio" name="other_reason_difficulty" value="1_to_2_times_per_week" onChange={handleChange} />
                        1週間に1-2回
                    </label>
                    <label>
                        <input type="radio" name="other_reason_difficulty" value="3_or_more_times_per_week" onChange={handleChange} />
                        1週間に3回以上
                    </label>
                </div>
            </div>

            <br />

            <div>
                <label>問6. 過去1ヶ月間において、ご自分の睡眠の質を全体として、どのように評価しますか？</label>
                <div>
                    <label>
                        <input type="radio" name="sleep_quality" value="very_good" onChange={handleChange} required />
                        非常に良い
                    </label>
                    <label>
                        <input type="radio" name="sleep_quality" value="good" onChange={handleChange} />
                        かなりよい
                    </label>
                    <label>
                        <input type="radio" name="sleep_quality" value="bad" onChange={handleChange} />
                        かなり悪い
                    </label>
                    <label>
                        <input type="radio" name="sleep_quality" value="very_bad" onChange={handleChange} />
                        非常に悪い
                    </label>
                </div>
            </div>

            <div>
                <label>問7. 過去1ヶ月間において、どのくらいの頻度で、眠るために薬を服用しましたか（医師から処方された薬あるいは薬屋で買った薬）？</label>
                <div>
                    <label>
                        <input type="radio" name="medication_use" value="none" onChange={handleChange} required />
                        なし
                    </label>
                    <label>
                        <input type="radio" name="medication_use" value="less_than_once_per_week" onChange={handleChange} />
                        1週間に1回未満
                    </label>
                    <label>
                        <input type="radio" name="medication_use" value="1_to_2_times_per_week" onChange={handleChange} />
                        1週間に1-2回
                    </label>
                    <label>
                        <input type="radio" name="medication_use" value="3_or_more_times_per_week" onChange={handleChange} />
                        1週間に3回以上
                    </label>
                </div>
            </div>

            <div>
                <label>問8. 過去1ヶ月間において、どれくらいの頻度で、車の運転や食事中、その他の社会活動中に、眠くて起きていられなくなりましたか？</label>
                <div>
                    <label>
                        <input type="radio" name="daytime_sleepiness" value="none" onChange={handleChange} required />
                        なし
                    </label>
                    <label>
                        <input type="radio" name="daytime_sleepiness" value="less_than_once_per_week" onChange={handleChange} />
                        1週間に1回未満
                    </label>
                    <label>
                        <input type="radio" name="daytime_sleepiness" value="1_to_2_times_per_week" onChange={handleChange} />
                        1週間に1-2回
                    </label>
                    <label>
                        <input type="radio" name="daytime_sleepiness" value="3_or_more_times_per_week" onChange={handleChange} />
                        1週間に3回以上
                    </label>
                </div>
            </div>

            <div>
                <label>問9. 過去1ヶ月間において、物事をやり遂げるために必要な意欲を持続するのに、どのくらい問題がありましたか？</label>
                <div>
                    <label>
                        <input type="radio" name="motivation_issue" value="none" onChange={handleChange} required />
                        全く問題なし
                    </label>
                    <label>
                        <input type="radio" name="motivation_issue" value="few_problems" onChange={handleChange} />
                        ほんのわずかだけ問題があった
                    </label>
                    <label>
                        <input type="radio" name="motivation_issue" value="some_problems" onChange={handleChange} />
                        いくらか問題があった
                    </label>
                    <label>
                        <input type="radio" name="motivation_issue" value="very_big_problems" onChange={handleChange} />
                        非常に大きな問題があった
                    </label>
                </div>
            </div>

            <button type="submit">送信</button>
        </form>
    );
}

export default SurveyForm;
