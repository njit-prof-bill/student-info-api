const { exec } = require('child_process');

exports.handler = async (event, context) => {
    return new Promise((resolve, reject) => {
        exec('python3 functions/submit_student_info.py', (error, stdout, stderr) => {
            if (error) {
                return resolve({
                    statusCode: 500,
                    body: JSON.stringify({ error: stderr })
                });
            }
            resolve({
                statusCode: 200,
                body: stdout
            });
        });
    });
};
