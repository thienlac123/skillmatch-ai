"""create applications

Revision ID: 9a3b7c1d5e2f
Revises: 8f2c7d1a4b6e
Create Date: 2026-08-23
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "9a3b7c1d5e2f"
down_revision: Union[str, Sequence[str], None] = "8f2c7d1a4b6e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "applications",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("job_id", sa.UUID(), nullable=False),
        sa.Column("freelancer_id", sa.UUID(), nullable=False),
        sa.Column("cover_letter", sa.Text(), nullable=False),
        sa.Column("proposed_budget", sa.Float(), nullable=True),
        sa.Column("delivery_days", sa.Integer(), nullable=True),
        sa.Column("match_score", sa.Float(), nullable=True),
        sa.Column("status", sa.Enum("PENDING", "ACCEPTED", "REJECTED", name="applicationstatus"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["freelancer_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("job_id", "freelancer_id"),
    )


def downgrade() -> None:
    op.drop_table("applications")
    sa.Enum(name="applicationstatus").drop(op.get_bind(), checkfirst=True)
