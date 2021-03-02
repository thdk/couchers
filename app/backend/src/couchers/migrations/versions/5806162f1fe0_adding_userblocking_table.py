"""Adding UserBlocking Table

Revision ID: 5806162f1fe0
Revises: 17362f602f12
Create Date: 2021-03-01 03:59:43.795435

"""
import geoalchemy2
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "5806162f1fe0"
down_revision = "17362f602f12"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "user_blocking",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column("blocking_user", sa.BigInteger(), nullable=False),
        sa.Column("blocked_user", sa.BigInteger(), nullable=False),
        sa.Column("blocked", sa.Boolean(), nullable=False),
        sa.Column("time_blocked", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["blocked_user"], ["users.id"], name=op.f("fk_user_blocking_blocked_user_users")),
        sa.ForeignKeyConstraint(["blocking_user"], ["users.id"], name=op.f("fk_user_blocking_blocking_user_users")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_user_blocking")),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("user_blocking")
    # ### end Alembic commands ###