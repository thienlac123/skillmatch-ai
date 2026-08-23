from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.conversation import Conversation, Message
from app.models.application import Application, ApplicationStatus
from app.models.job import Job
from app.models.user import User
from app.schemas.conversation import ConversationCreate, ConversationResponse, MessageCreate, MessageResponse

router = APIRouter(prefix="/conversations", tags=["Conversations"])


def get_member(db: Session, conversation_id: UUID, user_id: UUID):
    return db.query(Conversation).filter(
        Conversation.id == conversation_id,
        (Conversation.client_id == user_id) | (Conversation.freelancer_id == user_id),
    ).first()


@router.post("", response_model=ConversationResponse)
def create_conversation(data: ConversationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == data.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if current_user.role == "client":
        if job.client_id != current_user.id:
            raise HTTPException(status_code=403, detail="You do not own this job")
        application = db.query(Application).filter(
            Application.job_id == data.job_id,
            Application.freelancer_id == data.freelancer_id,
            Application.status == ApplicationStatus.ACCEPTED,
        ).first()
    else:
        if data.freelancer_id != current_user.id:
            raise HTTPException(status_code=403, detail="You can only start your own conversation")
        application = db.query(Application).filter(
            Application.job_id == data.job_id,
            Application.freelancer_id == current_user.id,
            Application.status == ApplicationStatus.ACCEPTED,
        ).first()
    if not application:
        raise HTTPException(status_code=403, detail="A conversation is available after the proposal is accepted")
    conversation = db.query(Conversation).filter(
        Conversation.job_id == data.job_id,
        Conversation.client_id == job.client_id,
        Conversation.freelancer_id == data.freelancer_id,
    ).first()
    if conversation:
        return conversation
    conversation = Conversation(job_id=data.job_id, client_id=job.client_id, freelancer_id=data.freelancer_id)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


@router.get("", response_model=list[ConversationResponse])
def list_conversations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Conversation).filter(
        (Conversation.client_id == current_user.id) | (Conversation.freelancer_id == current_user.id),
    ).order_by(Conversation.created_at.desc()).all()


@router.get("/{conversation_id}/messages", response_model=list[MessageResponse])
def list_messages(conversation_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not get_member(db, conversation_id, current_user.id):
        raise HTTPException(status_code=404, detail="Conversation not found")
    return db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at.asc()).all()


@router.post("/{conversation_id}/messages", response_model=MessageResponse)
def send_message(conversation_id: UUID, data: MessageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not get_member(db, conversation_id, current_user.id):
        raise HTTPException(status_code=404, detail="Conversation not found")
    message = Message(conversation_id=conversation_id, sender_id=current_user.id, content=data.content.strip())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message
