from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

app = FastAPI()


@app.post("/student-info")
async def submit_student_info(request: Request):
    data = await request.json()
    if "name" in data and "github" in data and "discord" in data:
        # Here you would normally save the data to a database or file
        # For now, just return the received data
        return JSONResponse(
            content={"status": "success", "data": data}, status_code=200
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid data received")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
