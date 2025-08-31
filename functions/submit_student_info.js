const Airtable = require('airtable');

// Initialize Airtable with your PAT
Airtable.configure({
    apiKey: process.env.AIRTABLE_PAT,  // Use the environment variable for your Airtable PAT
});

// Helper to get base by section
function getBaseBySection(section) {
    if (section === '101') {
        return Airtable.base('app4wyTuhKlDjsGA6');
    } else if (section === '103') {
        return Airtable.base('appCrBgOXJ26txpLe');
    } else {
        return null;
    }
}

exports.handler = async (event) => {

    try {
        // Get section from query or body
        let section;
        let data;
        if (event.httpMethod === 'GET' || event.httpMethod === 'DELETE') {
            section = event.queryStringParameters?.section;
        } else {
            data = JSON.parse(event.body);
            section = data.section;
        }

        if (!section || (section !== '101' && section !== '103')) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    status: 'error',
                    message: 'Section is required and must be either "101" or "103".',
                }),
            };
        }

        const base = getBaseBySection(section);
        if (!base) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    status: 'error',
                    message: 'Invalid section specified.',
                }),
            };
        }
        const table = base('student-info');

        if (event.httpMethod === 'GET') {
            const ucid = event.queryStringParameters?.UCID;
            if (!ucid || ucid.trim() === '') {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        status: 'error',
                        message: 'UCID is required for GET request',
                    }),
                };
            }
            const records = await table.select({
                filterByFormula: `{UCID} = '${ucid.trim()}'`,
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
            const record = records[0].fields;
            return {
                statusCode: 200,
                body: JSON.stringify({
                    status: 'success',
                    data: record,
                }),
            };
        } else if (event.httpMethod === 'POST') {
            const ucid = data.UCID?.trim();
            if (!ucid) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        status: 'error',
                        message: 'UCID is required and cannot be empty or blank for creating a new record.',
                    }),
                };
            }
            const existingRecords = await table.select({
                filterByFormula: `{UCID} = '${ucid}'`,
            }).firstPage();
            if (existingRecords.length > 0) {
                return {
                    statusCode: 409,
                    body: JSON.stringify({
                        status: 'error',
                        message: 'A record with this UCID already exists.',
                    }),
                };
            }
            const record = await table.create({
                'UCID': ucid,
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
            const ucid = data.UCID?.trim();
            if (!ucid) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        status: 'error',
                        message: 'UCID is required and cannot be empty or blank for updating a record.',
                    }),
                };
            }
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
        } else if (event.httpMethod === 'DELETE') {
            const ucid = event.queryStringParameters?.UCID;
            if (!ucid || ucid.trim() === '') {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        status: 'error',
                        message: 'UCID is required for DELETE request',
                    }),
                };
            }
            const records = await table.select({
                filterByFormula: `{UCID} = '${ucid.trim()}'`,
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
            await table.destroy(recordId);
            return {
                statusCode: 200,
                body: JSON.stringify({
                    status: 'success',
                    message: 'Record deleted successfully',
                }),
            };
        } else {
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
