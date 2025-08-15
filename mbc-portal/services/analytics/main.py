from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="MBC Analytics Service", version="1.0.0")

class FeeFeatures(BaseModel):
	student_id: str
	amount_due: float
	past_due_count: int
	attendance_rate: float
	cgpa: float

class PaperText(BaseModel):
	title: str
	abstract: str
	keywords: Optional[List[str]] = None

@app.get("/health")
async def health():
	return {"status": "ok", "service": "analytics"}

@app.get("/analytics/student/{student_id}")
async def student_performance(student_id: str):
	# stub demo analytics
	return {
		"studentId": student_id,
		"cgpa": 8.21,
		"attendanceRate": 0.91,
		"riskScore": 0.18,
		"recommendations": [
			"Focus on Algorithms course",
			"Attend remedial sessions for DBMS"
		]
	}

@app.post("/analytics/fee/predict")
async def fee_predict(features: FeeFeatures):
	# mock model: higher attendance and cgpa reduces default probability
	base = 0.5
	risk = base + 0.0005 * features.amount_due + 0.05 * features.past_due_count - 0.2 * features.attendance_rate - 0.1 * (features.cgpa / 10.0)
	risk = max(0.0, min(1.0, risk))
	return {"studentId": features.student_id, "defaultProbability": risk}

@app.post("/analytics/paper/categorize")
async def paper_categorize(paper: PaperText):
	text = (paper.title + " " + paper.abstract).lower()
	if any(k in text for k in ["neural", "deep", "cnn", "transformer"]):
		label = "AI/ML"
	elif any(k in text for k in ["network", "routing", "iot", "wireless"]):
		label = "Networks"
	elif any(k in text for k in ["database", "query", "sql", "nosql"]):
		label = "Databases"
	else:
		label = "General CS"
	return {"category": label, "keywords": paper.keywords or []}