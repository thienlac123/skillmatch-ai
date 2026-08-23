"""add cv filename to freelancer profiles

Revision ID: 8f2c7d1a4b6e
Revises: 0c924b07724e
Create Date: 2026-08-23

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "8f2c7d1a4b6e"
down_revision: Union[str, Sequence[str], None] = "0c924b07724e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "freelancer_profiles",
        sa.Column("cv_filename", sa.Text(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("freelancer_profiles", "cv_filename")
