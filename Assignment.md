### Assignment: Calling a RESTful API to Submit Your Information
This assignment is due on Friday, September 13th. I **strongly suggest** that you use our normal class
period Monday from 6pm to 9pm to complete this assignment; that is more than enough time to finish to simple task.

**! Important ** You will be using this code in another assignment. Keep it in a safe place!

#### Objective:
In this assignment, you will research and implement a program or script that sends your information to a RESTful API. The purpose of this exercise is to evaluate your ability to research and apply technical concepts—specifically, how to interact with RESTful APIs.

#### What You’ll Need to Do:
You will write a program or script in **any programming language of your choice** that:
1. Collects the following information:
    - **UCID** (Your university ID)
    - **First Name**
    - **Last Name**
    - **GitHub Username**
    - **Discord Username**
    - **Favorite Cartoon**
    - **Favorite Programming Language**
    - **Your favorite Movie, Game, or Book**
    - **Section** (Your class section: must be either `101` or `103`)

2. Sends this information to the provided API endpoint using an HTTP POST request. **You must include your section number in your submission. Requests without a valid section will be rejected.**

#### Brief Introduction to RESTful APIs:
A **RESTful API** allows communication between systems over the web using standard HTTP methods. In this assignment, you'll use the **POST** method to send your information to a web server, which will store it in a database.

- **POST** requests are used to send data to a server. In this case, the data will be your student information, and the server will store it.

### HTTP Request Format:
To call a RESTful API using a **POST** request, you need to:
- Specify the **URL** of the API.
- Provide the data in the **body** of the request, typically in JSON format.
- Set appropriate **headers**, such as `Content-Type`, to specify the format of the data being sent.

### API Endpoint:

You will send a **POST** request to the following API endpoint:

```
https://student-info-api.netlify.app/.netlify/functions/submit_student_info
```

**Important:** You must include your section number (`101` or `103`) in your submission. Requests without a valid section will be rejected.

The data should be structured in **JSON** format as follows:

```json
{
    "UCID": "12345678",
    "first_name": "John",
    "last_name": "Doe",
    "github_username": "johndoe",
    "discord_username": "johndoe#1234",
    "favorite_cartoon": "SpongeBob SquarePants",
    "favorite_language": "Rust",
    "movie_or_game_or_book": "The Lord of the Rings",
    "section": "101"
}
```

For **GET** or **DELETE** requests, you must include the section as a query parameter:

```
https://student-info-api.netlify.app/.netlify/functions/submit_student_info?UCID=12345678&section=101
```

### Example: Calling a RESTful API in Rust

Here’s an example in **Rust** that demonstrates how to send a POST request to a RESTful API. I used Rust
specifically to discourage you from simply copying the sample code.

**Code Example (with section):**

```rust
use reqwest::Client;
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    // API endpoint
    let url = "https://student-info-api.netlify.app/.netlify/functions/submit_student_info";

    // Data to be sent in JSON format
    let data = json!({
        "UCID": "12345678",
        "first_name": "John",
        "last_name": "Doe",
        "github_username": "johndoe",
        "discord_username": "johndoe#1234",
        "favorite_cartoon": "SpongeBob SquarePants",
        "favorite_language": "Rust",
        "movie_or_game_or_book": "The Lord of the Rings",
        "section": "101"
    });

    // Create a client and send the POST request
    let client = Client::new();
    let response = client.post(url)
        .json(&data)
        .send()
        .await?;

    // Print the status and response
    println!("Status: {}", response.status());
    let body = response.text().await?;
    println!("Body: {}", body);

    Ok(())
}
```


### Important Considerations:
- **Section is required**: Your request will be rejected if you do not include a valid section (`101` or `103`).
- **Error Handling**: Ensure that your program handles errors, such as incorrect data formats or failed requests.
- **Testing**: Test your program to ensure it successfully sends the correct data to the API and receives a response.

### Submission:
You will submit your code along with the response you receive from the API. The response should confirm that your information was successfully added to the system.

Good luck! If you have any questions, feel free to reach out.
