"""
models.py - Veritabanı Modelleri
Flask-SQLAlchemy + Flask-Login entegrasyonu.
Tüm tablolar burada tanımlıdır.
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(UserMixin, db.Model):
    """Kullanıcı tablosu – kimlik doğrulama ve TM bilgisi."""

    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    preferred_tm = db.Column(db.String(50), nullable=False)

    # İlişki: Bir kullanıcının birden fazla rapor kaydı olabilir
    records = db.relationship("Rapor", backref="user", lazy=True)

    def set_password(self, password):
        """Şifreyi hash'leyerek kaydet."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Girilen şifreyi hash ile karşılaştır."""
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.email}>"


class Rapor(db.Model):
    """
    Operasyon kayıtları tablosu.
    Her kayıt bir kullanıcıya bağlıdır (user_id FK).
    """

    __tablename__ = "rapor"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    eklenme_tarihi = db.Column(db.DateTime, default=datetime.utcnow)

    # --- Operasyon Verileri ---
    tarih = db.Column(db.String(20))
    sefer = db.Column(db.String(200))
    kisa_bolge = db.Column(db.String(50))
    slot = db.Column(db.String(20))
    saat = db.Column(db.String(20))
    irsaliye = db.Column(db.String(50), unique=True, nullable=False)
    tam_muhur = db.Column(db.String(50))
    miktar = db.Column(db.Integer)
    plaka = db.Column(db.String(50))
    sofor = db.Column(db.String(100))
    firma = db.Column(db.String(50))
    talep = db.Column(db.String(50))

    def __repr__(self):
        return f"<Rapor {self.irsaliye}>"
