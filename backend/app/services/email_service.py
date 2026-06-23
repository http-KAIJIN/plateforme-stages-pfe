from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from app.core.config import get_settings


async def send_email(to_email: str, subject: str, body: str) -> None:
    settings = get_settings()
    if not settings.MAIL_USERNAME or not settings.MAIL_PASSWORD:
        return

    config = ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_STARTTLS=settings.MAIL_STARTTLS,
        MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
    )
    message = MessageSchema(subject=subject, recipients=[to_email], body=body, subtype=MessageType.plain)
    await FastMail(config).send_message(message)
