# student-info-api
Gather information about my students

### Step-by-Step Guide to Set Up a Central Server on Netlify

1. **Install Netlify CLI:**
   - First, install the Netlify CLI to deploy and manage functions from your local machine.
   ```bash
   npm install -g netlify-cli
   ```
   - Log in to your Netlify account via the CLI:
   ```bash
   netlify login
   ```

2. **Set Up Your Project:**
   - Create a new directory for your project:
   ```bash
   mkdir student-info-api
   cd student-info-api
   ```
   - Initialize a new Netlify site:
   ```bash
   netlify init
   ```

3. **Set Up Netlify Functions:**
   - Create a `netlify.toml` file in the root directory of your project. This file will configure your Netlify site and functions.

   ```toml
   [build]
     functions = "functions"

   [functions]
     node_bundler = "esbuild" 
   ```

   - Create a directory named `functions` for your Netlify functions:
   ```bash
   mkdir functions
   ```

4. **Create the Python Function:**
   - Netlify natively supports JavaScript (Node.js) for functions, but you can run Python using an HTTP server within a function. Here's how you can create a Python function to handle your API requests:
   - Install the `python-dotenv` package if you want to manage environment variables easily within Python.

   - Create a Python script inside the `functions` directory named `submit_student_info.py`:

   ```python
   from flask import Flask, request, jsonify

   app = Flask(__name__)

   @app.route('/student-info', methods=['POST'])
   def submit_student_info():
       data = request.get_json()
       if 'name' in data and 'github' in data and 'discord' in data:
           # Here you would normally save the data to a database or file
           # For now, just return the received data
           return jsonify({
               "status": "success",
               "data": data
           }), 200
       else:
           return jsonify({
               "status": "error",
               "message": "Invalid data received"
           }), 400

   if __name__ == "__main__":
       app.run(host='0.0.0.0', port=8000)
   ```

   - This script sets up a basic Flask app that listens for POST requests to `/student-info` and expects a JSON payload.

5. **Create a Wrapper JavaScript File:**
   - Since Netlify functions use Node.js, create a JavaScript file to start the Python script. In the `functions` directory, create a file named `student-info.js`:

   ```javascript
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
   ```

   - This script uses Node.js to execute the Python script. 

6. **Deploy to Netlify:**
   - Now, deploy your function to Netlify:
   ```bash
   netlify deploy
   ```
   - You'll be prompted to select a site to deploy to. Choose your existing Netlify site or create a new one.
   - When asked, choose **`Functions`** folder as the directory for Netlify Functions.
   - Select **`Manual Deploy`** or **`Production Deploy`** as needed.

7. **Test Your API Endpoint:**
   - After deploying, Netlify will give you a URL for your deployed function, typically something like `https://<your-site-name>.netlify.app/.netlify/functions/student-info`.
   - You can now test the endpoint using `curl`, Postman, or any HTTP client by sending a POST request with the required JSON data.
