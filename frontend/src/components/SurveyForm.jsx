import React, { useState } from 'react';
import axios from 'axios';

function SurveyForm() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        age: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost/Survey_App/backend/api/submitSurvey.php', formData, {
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
            <button type="submit">送信</button>
        </form>
    );
}

export default SurveyForm;
