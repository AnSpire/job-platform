"""user firstname and lastname nullable

Revision ID: 504b2c62d627
Revises: 56c98796109d
Create Date: 2025-10-28 16:42:20.290506

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '504b2c62d627'
down_revision: Union[str, Sequence[str], None] = '56c98796109d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
