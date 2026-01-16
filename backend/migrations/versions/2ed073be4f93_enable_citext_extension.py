"""enable citext extension

Revision ID: 2ed073be4f93
Revises: f49459358af0
Create Date: 2026-01-16 14:39:24.907944

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
# LAST MIGRATION

# revision identifiers, used by Alembic.
revision: str = '2ed073be4f93'
down_revision: Union[str, Sequence[str], None] = 'f49459358af0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("CREATE EXTENSION IF NOT EXISTS citext")

def downgrade():
    op.execute("DROP EXTENSION IF EXISTS citext")
