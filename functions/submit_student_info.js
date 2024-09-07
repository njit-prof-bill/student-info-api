const Airtable = require('airtable');

// Initialize Airtable with your PAT
Airtable.configure({
    apiKey: process.env.AIRTABLE_PAT,  // Use the environment variable for your Airtable PAT
});

// Set the base ID and table name
const base = Airtable.base('app4wyTuhKlDjsGA6');  // Replace 'your_base_id' with your Airtable Base ID
const table = base('student-info');  // Replace 'Student Info' with the correct table name

exports.handler = async (event) => {
    try {
        // Parse the request body
        const data = JSON.parse(event.body);

        // Validate the required fields
        if (!data.UCID || !data.first_name || !data.last_name || !data.github_username || !data.discord_username || !data.favorite_cartoon || !data.favorite_language || !data.movie_or_game_or_book) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    status: 'error',
                    message: 'Missing required fields',
                }),
            };
        }

        if (event.httpMethod === 'POST') {
            // Handle creating a new record
            const record = await table.create({
                'UCID': data.UCID,
                'first_name': data.first_name,
                'last_name': data.last_name,
                'github_username': data.github_username,
                'discord_username': data.discord_username,
                'favorite_cartoon': data.favorite_cartoon,
                'favorite_language': data.favorite_language,
                'movie_or_game_or_book': data.movie_or_game_or_book,
            });

            return {
                statusCode: 200,
                body: JSON.stringify({
                    status: 'success',
                    message: 'Record created successfully',
                    recordId: record.id,
                }),
            };

        } else if (event.httpMethod === 'PUT') {
            // Handle updating an existing record
            const records = await table.select({
                filterByFormula: `{UCID} = '${data.UCID}'`,  // Search for the UCID in the Airtable base
            }).firstPage();

            if (records.length === 0) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        status: 'error',
                        message: 'No record found with the provided UCID',
                    }),
                };
            }

            // Get the record ID of the found student
            const recordId = records[0].id;

            // Update the student's information in Airtable
            const updatedRecord = await table.update(recordId, {
                'first_name': data.first_name,
                'last_name': data.last_name,
                'github_username': data.github_username,
                'discord_username': data.discord_username,
                'favorite_cartoon': data.favorite_cartoon,
                'favorite_language': data.favorite_language,
                'movie_or_game_or_book': data.movie_or_game_or_book,
            });

            return {
                statusCode: 200,
                body: JSON.stringify({
                    status: 'success',
                    message: 'Record updated successfully',
                    recordId: updatedRecord.id,
                }),
            };

        } else {
            // If the method is neither POST nor PUT, return a method not allowed error
            return {
                statusCode: 405,
                body: JSON.stringify({
                    status: 'error',
                    message: 'Method not allowed',
                }),
            };
        }

    } catch (error) {
        console.error('Error processing request:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                status: 'error',
                message: 'Internal server error',
                details: error.message,
            }),
        };
    }
};
