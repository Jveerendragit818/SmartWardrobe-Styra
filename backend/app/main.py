from fastapi import FastAPI

app = FastAPI(title="SmartWardrobe API")


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "SmartWardrobe API is running",
    }
