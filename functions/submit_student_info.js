// functions/submit_student_info.js
exports.handler = async (event) => {
    try {
        // Parse the request body (assumes it's JSON)
        const data = JSON.parse(event.body);

        // Validate the received data
        if (data.first_name && data.github_username && data.discord_username) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    status: "success",
                    data: data
                }),
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    status: "error",
                    message: "Invalid data received"
                }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                status: "error",
                message: "Server error",
                details: error.message,
            }),
        };
    }
};
