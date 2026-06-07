import asyncio
import csv
import io
import os
import re
import secrets
import string
from datetime import datetime, timezone

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator

load_dotenv()

NEXTCLOUD_URL          = os.getenv("NEXTCLOUD_URL", "").rstrip("/")
NEXTCLOUD_USER         = os.getenv("NEXTCLOUD_USER", "")
NEXTCLOUD_APP_PASSWORD = os.getenv("NEXTCLOUD_APP_PASSWORD", "")
GITHUB_TOKEN           = os.getenv("GITHUB_TOKEN", "")
GITHUB_REPO            = os.getenv("GITHUB_REPO", "")

VALID_INTENTS = {"recruit", "collab", "research", "press", "curious"}
CSV_COLUMNS   = ["timestamp", "ticket_id", "identity", "designation", "clearance_intent", "justification"]
CSV_PATH      = f"{NEXTCLOUD_URL}/remote.php/dav/files/{NEXTCLOUD_USER}/database/access-requests.csv"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://dheiryabhatt.com"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class SubmitRequest(BaseModel):
    identity: str
    designation: str = ""
    clearance_intent: str
    justification: str = ""

    @field_validator("identity")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", v.strip()):
            raise ValueError("Invalid email address")
        return v.strip()

    @field_validator("clearance_intent")
    @classmethod
    def validate_intent(cls, v: str) -> str:
        if v not in VALID_INTENTS:
            raise ValueError(f"clearance_intent must be one of {VALID_INTENTS}")
        return v

    @field_validator("justification")
    @classmethod
    def cap_justification(cls, v: str) -> str:
        return v[:180]


def _make_ticket_id() -> str:
    alphabet = string.digits + "ABCDEF"
    seg = lambda: "".join(secrets.choice(alphabet) for _ in range(4))
    return f"REQ-{seg()}-{seg()}"


async def _write_nextcloud(client: httpx.AsyncClient, row: dict, timestamp: str) -> None:
    auth = (NEXTCLOUD_USER, NEXTCLOUD_APP_PASSWORD)

    get_resp = await client.get(CSV_PATH, auth=auth)

    buf = io.StringIO()
    writer = csv.writer(buf, lineterminator="\n")

    if get_resp.status_code == 200:
        existing = get_resp.text.rstrip("\n")
        buf.write(existing)
        buf.write("\n")
    else:
        writer.writerow(CSV_COLUMNS)

    writer.writerow([
        timestamp,
        row["ticket_id"],
        row["identity"],
        row["designation"],
        row["clearance_intent"],
        row["justification"],
    ])

    put_resp = await client.put(
        CSV_PATH,
        content=buf.getvalue().encode("utf-8"),
        auth=auth,
        headers={"Content-Type": "text/csv; charset=utf-8"},
    )
    put_resp.raise_for_status()


async def _create_github_issue(client: httpx.AsyncClient, row: dict, timestamp: str) -> None:
    body = (
        f"**Identity:** {row['identity']}\n"
        f"**Designation:** {row['designation'] or '—'}\n"
        f"**Clearance Intent:** {row['clearance_intent']}\n"
        f"**Justification:** {row['justification'] or '—'}\n"
        f"**Ticket:** {row['ticket_id']}\n"
        f"**Submitted:** {timestamp} UTC"
    )
    title = f"[REQUEST] {row['designation'] or row['identity']} — {row['clearance_intent']} — {row['ticket_id']}"

    resp = await client.post(
        f"https://api.github.com/repos/{GITHUB_REPO}/issues",
        json={
            "title": title,
            "body": body,
            "labels": ["access-request", row["clearance_intent"]],
        },
        headers={
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json",
        },
    )
    resp.raise_for_status()


@app.post("/api/submit")
async def submit(req: SubmitRequest):
    ticket_id = _make_ticket_id()
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    row = {
        "ticket_id":       ticket_id,
        "identity":        req.identity,
        "designation":     req.designation or req.identity,
        "clearance_intent": req.clearance_intent,
        "justification":   req.justification,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            await asyncio.gather(
                _write_nextcloud(client, row, timestamp),
                _create_github_issue(client, row, timestamp),
            )
        except Exception as exc:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": str(exc)},
            )

    return {"status": "ok", "ticket_id": ticket_id}
