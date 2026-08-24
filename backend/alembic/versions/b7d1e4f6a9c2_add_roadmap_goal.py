"""add roadmap goal

Revision ID: b7d1e4f6a9c2
Revises: a4c8e2f6b1d0
Create Date: 2026-08-23
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "b7d1e4f6a9c2"
down_revision: Union[str, Sequence[str], None] = "a4c8e2f6b1d0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "roadmaps",
        sa.Column(
            "goal",
            sa.Text(),
            nullable=False,
            server_default="Close the identified skill gaps for this job",
        ),
    )
    op.alter_column("roadmaps", "goal", server_default=None)


def downgrade() -> None:
    op.drop_column("roadmaps", "goal")
