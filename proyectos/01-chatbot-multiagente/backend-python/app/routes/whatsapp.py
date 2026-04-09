"""WhatsApp inbound webhook — receives messages from Twilio, routes through orchestrator, responds via TwiML.

Session system:
  - Send #soporte to open a 5-minute support session
  - Any message (text or voice) within 5 min is processed by the orchestrator
  - Without active session → asks to send #soporte
"""

from __future__ import annotations

import logging
import time
import xml.sax.saxutils as saxutils
from typing import Dict, Optional

import requests
from fastapi import APIRouter, Form, Response

from app.agents.orchestrator import process_message
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])

GROQ_WHISPER_URL = "https://api.groq.com/openai/v1/audio/transcriptions"

# In-memory session store: phone → expiry timestamp
# For production, use Redis instead
_sessions: Dict[str, float] = {}
SESSION_DURATION = 300  # 5 minutes


def _is_session_active(phone: str) -> bool:
    """Check if phone has an active support session."""
    expiry = _sessions.get(phone)
    if expiry and time.time() < expiry:
        return True
    # Clean expired
    _sessions.pop(phone, None)
    return False


def _open_session(phone: str) -> float:
    """Open a 5-minute support session. Returns expiry timestamp."""
    expiry = time.time() + SESSION_DURATION
    _sessions[phone] = expiry
    return expiry


def _remaining_minutes(phone: str) -> int:
    """Get remaining session minutes."""
    expiry = _sessions.get(phone, 0)
    remaining = max(0, expiry - time.time())
    return int(remaining // 60) + (1 if remaining % 60 > 0 else 0)


def twiml_response(text: str) -> Response:
    """Return a TwiML XML response. Splits long messages if needed."""
    # TwiML Message limit is ~1600 chars
    safe_text = saxutils.escape(text[:1600])
    xml = f'<?xml version="1.0" encoding="UTF-8"?><Response><Message>{safe_text}</Message></Response>'
    return Response(content=xml, media_type="application/xml")


def download_twilio_media(media_url: str) -> bytes:
    """Download media from Twilio (requires auth, follows redirects)."""
    resp = requests.get(
        media_url,
        auth=(settings.TWILIO_SID, settings.TWILIO_TOKEN),
        timeout=15,
        allow_redirects=True,
    )
    resp.raise_for_status()
    return resp.content


def transcribe_audio(audio_bytes: bytes, language: str = "es") -> str:
    """Transcribe audio using Groq Whisper."""
    if not settings.GROQ_API_KEY:
        return ""
    try:
        import httpx
        resp = httpx.post(
            GROQ_WHISPER_URL,
            headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
            files={"file": ("audio.ogg", audio_bytes, "audio/ogg")},
            data={"model": "whisper-large-v3-turbo", "language": language, "response_format": "text"},
            timeout=30,
        )
        if resp.status_code == 200:
            return resp.text.strip()
        logger.error("Whisper error %d: %s", resp.status_code, resp.text[:200])
    except Exception as e:
        logger.error("Whisper transcription failed: %s", e)
    return ""


@router.post("/webhook")
async def whatsapp_webhook(
    Body: str = Form(""),
    From: str = Form(""),
    NumMedia: str = Form("0"),
    MediaUrl0: Optional[str] = Form(None),
    MediaContentType0: Optional[str] = Form(None),
):
    """Receive WhatsApp messages from Twilio, process, respond via TwiML only."""
    phone = From.replace("whatsapp:", "")
    num_media = int(NumMedia)
    message_text = ""

    logger.info("WhatsApp from %s: body='%s' media=%d", phone, Body[:50], num_media)

    # ── Check for #soporte trigger ────────────────────────────────
    body_lower = Body.strip().lower()
    if body_lower == "#soporte" or body_lower == "#support":
        _open_session(phone)
        return twiml_response(
            "Sesion de soporte abierta por 5 minutos.\n"
            "Envia tu mensaje de texto o nota de voz ahora.\n\n"
            "Support session open for 5 minutes.\n"
            "Send your text message or voice note now."
        )

    # ── Check if session is active ────────────────────────────────
    if not _is_session_active(phone):
        return twiml_response(
            "Envia #soporte para iniciar una sesion de 5 minutos.\n\n"
            "Send #soporte to start a 5-minute session."
        )

    # ── Process message within active session ─────────────────────
    remaining = _remaining_minutes(phone)

    # Case 1: Voice note
    if num_media > 0 and MediaUrl0 and "audio" in (MediaContentType0 or ""):
        try:
            audio_bytes = download_twilio_media(MediaUrl0)
            message_text = transcribe_audio(audio_bytes)
            if not message_text:
                return twiml_response("No se pudo transcribir el audio. Intenta con texto.")
            logger.info("Voice transcribed (%d chars): %s", len(message_text), message_text[:80])
        except Exception as e:
            logger.error("Voice error: %s", e)
            return twiml_response("Error procesando audio. Intenta de nuevo.")

    # Case 2: File/image
    elif num_media > 0 and MediaUrl0:
        return twiml_response(f"Recibi tu archivo. Por ahora solo proceso texto y notas de voz. ({remaining}min restantes)")

    # Case 3: Text
    elif Body.strip():
        message_text = Body.strip()

    # No content
    else:
        return Response(content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>', media_type="application/xml")

    # ── Route through orchestrator ────────────────────────────────
    try:
        result = await process_message(message=message_text, phone=phone)
        response_text = result.get("text", "No pude procesar tu mensaje.")
        logger.info("WhatsApp processed: agent=%s intent=%s", result.get("agent"), result.get("intent"))

        # Append session timer
        response_text += f"\n\n[{remaining}min restantes en tu sesion]"

        return twiml_response(response_text)
    except Exception as e:
        logger.error("Orchestrator error: %s", e)
        return twiml_response("Hubo un error. Intenta de nuevo.")
