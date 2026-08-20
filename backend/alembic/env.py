from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
from app.models import (
    User,
    FreelancerProfile,
    Skill,
    FreelancerSkill,
    Job,
)


# 1. Import Base và Settings từ ứng dụng
from app.core.database import Base
from app.core.config import settings

# Đọc cấu hình logging từ alembic.ini
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 2. Gán metadata của SQLAlchemy models cho Alembic nhận diện
target_metadata = Base.metadata

# 3. Ghi đè URL kết nối database từ file config/.env
config.set_main_option(
    "sqlalchemy.url",
    settings.DATABASE_URL,
)


def run_migrations_offline() -> None:
    """Chạy migration ở chế độ offline."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Chạy migration ở chế độ online (kết nối trực tiếp tới DB)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()