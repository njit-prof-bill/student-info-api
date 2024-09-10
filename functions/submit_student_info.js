const Airtable = require('airtable');

// Initialize Airtable with your PAT
Airtable.configure({
    apiKey: process.env.AIRTABLE_PAT,  // Use the environment variable for your Airtable PAT
});

// Set the base ID and table name
const base = Airtable.base('app4wyTuhKlDjsGA6');  // Replace with your Airtable Base ID
const table = base('student-info');  // Replace with your Airtable table name

exports.handler = async (event) => {
    try {
        // Parse the request body if it's not a GET or DELETE request
        let data;
        if (event.httpMethod !== 'GET' && event.httpMethod !== 'DELETE') {
            data = JSON.parse(event.body);
        }

        // Handle GET request to retrieve a student's information by UCID
        if (event.httpMethod === 'GET') {
            // Extract UCID from query parameters
            const ucid = event.queryStringParameters?.UCID;

            if (!ucid) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        status: 'error',
                        message: 'UCID is required for GET request',
                    }),
                };
            }

            // Find the student by UCID
            const records = await table.select({
                filterByFormula: `{UCID} = '${ucid}'`,
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

            // Return the student's information
            const record = records[0].fields;

            return {
                statusCode: 200,
                body: JSON.stringify({
                    status: 'success',
                    data: record,
                }),
            };

            // Handle POST request to create a new record
        } else if (event.httpMethod === 'POST') {
            // Check if a record with the same UCID already exists
            const existingRecords = await table.select({
                filterByFormula: `{UCID} = '${data.UCID}'`,
            }).firstPage();

            if (existingRecords.length > 0) {
                return {
                    statusCode: 409,  // Conflict
                    body: JSON.stringify({
                        status: 'error',
                        message: 'A record with this UCID already exists.',
                    }),
                };
            }

            // Create a new record
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

            // Handle PUT request to update an existing record
        } else if (event.httpMethod === 'PUT') {
            const records = await table.select({
                filterByFormula: `{UCID} = '${data.UCID}'`,
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

            const recordId = records[0].id;

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

            // Handle DELETE request to remove a student record by UCID
        } else if (event.httpMethod === 'DELETE') {
            // Extract UCID from query parameters
            const ucid = event.queryStringParameters?.UCID;

            if (!ucid) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        status: 'error',
                        message: 'UCID is required for DELETE request',
                    }),
                };
            }

            // Find the student by UCID
            const records = await table.select({
                filterByFormula: `{UCID} = '${ucid}'`,
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

            // Delete the student's record
            const recordId = records[0].id;
            await table.destroy(recordId);

            return {
                statusCode: 200,
                body: JSON.stringify({
                    status: 'success',
                    message: 'Record deleted successfully',
                }),
            };

        } else {
            // If the method is not GET, POST, PUT, or DELETE, return a method not allowed error
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
