"""
app.py - Ana Flask Uygulama Dosyası
Lojistik/Kargo Operasyonları Uygulaması (Excel Aktarma Botu)

Özellikler:
- Flask-Login ile oturum yönetimi
- Kullanıcıya özel veri izolasyonu
- Manuel kayıt ekleme ve Excel dışa aktarma
- PostgreSQL (veya yerel SQLite) desteği
"""

import os
from datetime import datetime
from io import BytesIO

import pandas as pd
from flask import (
    Flask,
    flash,
    jsonify,
    redirect,
    render_template,
    request,
    send_file,
    url_for,
)
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)

from models import Rapor, User, db

# ─────────────────────────────────────────────
# UYGULAMA YAPILANDIRMASI
# ─────────────────────────────────────────────

app = Flask(__name__)

# Gizli anahtar: Session ve flash mesajları için zorunlu
app.config["SECRET_KEY"] = os.environ.get(
    "SECRET_KEY", "gizli-anahtar-degistirin-bunu-uretimde"
)

# Veritabanı bağlantısı: Ortam değişkeninden veya yerel SQLite
uri = os.environ.get("DATABASE_URL", "sqlite:///aktarma.db")
if uri and uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = uri
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Veritabanını uygulamaya bağla
db.init_app(app)

# ─────────────────────────────────────────────
# FLASK-LOGIN AYARLARI
# ─────────────────────────────────────────────

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"  # Giriş yapılmamışsa yönlendirilecek sayfa
login_manager.login_message = "Bu sayfayı görüntülemek için lütfen giriş yapın."
login_manager.login_message_category = "warning"


@login_manager.user_loader
def load_user(user_id):
    """Flask-Login için kullanıcıyı ID ile yükle."""
    return User.query.get(int(user_id))


# ─────────────────────────────────────────────
# SABİT VERİLER
# ─────────────────────────────────────────────

TM_LISTESI = [
    "Samandıra TM",
    "GOP TM",
    "Avrupa TM",
    "Düzce TM",
    "Anadolu TM",
    "İzmir TM",
    "Bursa TM",
    "Antalya TM",
    "Başiskele TM",
    "Afyon TM",
    "Gaziantep TM",
    "Muğla TM",
    "Ankara TM",
    "Adana TM",
    "Erzurum TM",
    "Merzifon TM",
    "Diyarbakir TM",
]

# ─────────────────────────────────────────────
# TABLOARI OLUŞTUR
# ─────────────────────────────────────────────

with app.app_context():
    db.create_all()

# ─────────────────────────────────────────────
# AUTH ROTALARI (Kayıt / Giriş / Çıkış)
# ─────────────────────────────────────────────


@app.route("/register", methods=["GET", "POST"])
def register():
    """Yeni kullanıcı kaydı. TM seçimi zorunludur."""

    # Zaten giriş yapmışsa dashboard'a yönlendir
    if current_user.is_authenticated:
        return redirect(url_for("index"))

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        selected_tm = request.form.get("tm_merkezi", "")

        # Validasyon
        if not email or not password or not selected_tm:
            flash("Lütfen tüm alanları doldurun.", "danger")
            return render_template("register.html", tm_listesi=TM_LISTESI)

        if len(password) < 6:
            flash("Şifre en az 6 karakter olmalıdır.", "danger")
            return render_template("register.html", tm_listesi=TM_LISTESI)

        # Aynı email ile kayıt kontrolü (try-except ile)
        try:
            user_exists = User.query.filter_by(email=email).first()
            if user_exists:
                flash(
                    "Bu e-posta adresi zaten kayıtlı! Lütfen giriş yapın.", "warning"
                )
                return redirect(url_for("login"))

            new_user = User(email=email, preferred_tm=selected_tm)
            new_user.set_password(password)
            db.session.add(new_user)
            db.session.commit()

            flash("Kayıt başarılı! Şimdi giriş yapabilirsiniz.", "success")
            return redirect(url_for("login"))

        except Exception:
            db.session.rollback()
            flash("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.", "danger")
            return render_template("register.html", tm_listesi=TM_LISTESI)

    return render_template("register.html", tm_listesi=TM_LISTESI)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Kullanıcı girişi."""

    # Zaten giriş yapmışsa dashboard'a yönlendir
    if current_user.is_authenticated:
        return redirect(url_for("index"))

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            login_user(user, remember=True)
            flash(f"Hoş geldiniz, {user.email}!", "success")

            # Eğer bir sayfaya yönlendirilmişse oraya git
            next_page = request.args.get("next")
            return redirect(next_page or url_for("index"))
        else:
            flash("Geçersiz e-posta veya şifre!", "danger")

    return render_template("login.html")



@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    """Hesap detayları güncelleme sayfası."""
    if request.method == "POST":
        new_tm = request.form.get("tm_merkezi", "")
        new_password = request.form.get("new_password", "")

        if new_tm and new_tm != current_user.preferred_tm:
            current_user.preferred_tm = new_tm
            flash("Transfer Merkezi başarıyla güncellendi!", "success")

        if new_password:
            if len(new_password) < 6:
                flash("Şifre en az 6 karakter olmalıdır.", "danger")
                return render_template("profile.html", tm_listesi=TM_LISTESI)
            current_user.set_password(new_password)
            flash("Şifreniz başarıyla güncellendi!", "success")

        db.session.commit()
        return redirect(url_for("profile"))

    return render_template("profile.html", tm_listesi=TM_LISTESI)


@app.route("/logout")
@login_required
def logout():
    """Çıkış yap ve login sayfasına yönlendir."""
    logout_user()
    flash("Başarıyla çıkış yaptınız.", "info")
    return redirect(url_for("login"))


# ─────────────────────────────────────────────
# ANA SAYFA (Dashboard)
# ─────────────────────────────────────────────


@app.route("/")
@login_required
def index():
    """
    Dashboard sayfası.
    Kullanıcının TM bilgisini ve otomatik sefer adını oluşturur.
    Sefer Adı Formatı: [TM] - [GG.AA.YYYY] - Sefer 1
    """
    bugun = datetime.now().strftime("%d.%m.%Y")
    sefer_adi = f"{current_user.preferred_tm} - {bugun} - Sefer 1"

    return render_template(
        "index.html",
        user_tm=current_user.preferred_tm,
        sefer_adi=sefer_adi,
    )


# ─────────────────────────────────────────────
# VERİ API ROTALARI (CRUD)
# ─────────────────────────────────────────────


@app.route("/api/veriler", methods=["GET"])
@login_required
def verileri_getir():
    """
    Giriş yapan kullanıcının kayıtlarını JSON olarak döndür.
    ?tarih=YYYY-MM-DD parametresi verilirse o güne ait kayıtları filtreler.
    """
    try:
        tarih_filtre = request.args.get("tarih", "")
        sorgu = Rapor.query.filter_by(user_id=current_user.id)

        if tarih_filtre:
            sorgu = sorgu.filter_by(tarih=tarih_filtre)

        tum_kayitlar = sorgu.order_by(Rapor.id.desc()).all()
        liste = []
        for k in tum_kayitlar:
            liste.append(
                {
                    "id": k.id,
                    "tarih": k.tarih,
                    "sefer": k.sefer,
                    "kisaBolge": k.kisa_bolge,
                    "slot": k.slot,
                    "saat": k.saat,
                    "irsaliye": k.irsaliye,
                    "tamMuhur": k.tam_muhur,
                    "miktar": k.miktar,
                    "plaka": k.plaka,
                    "sofor": k.sofor,
                    "firma": k.firma,
                    "talep": k.talep,
                }
            )
        return jsonify(liste)
    except Exception as e:
        return jsonify({"durum": "hata", "mesaj": str(e)}), 500


@app.route("/api/kaydet", methods=["POST"])
@login_required
def kaydet():
    """Yeni kayıt ekle (giriş yapan kullanıcıya bağlı)."""
    veri = request.json

    # İrsaliye tekrar kontrolü (kullanıcı bazında)
    mevcut = Rapor.query.filter_by(irsaliye=veri["irsaliye"]).first()
    if mevcut:
        return (
            jsonify(
                {
                    "durum": "hata",
                    "mesaj": f"Bu İrsaliye No ({veri['irsaliye']}) zaten kayıtlı!",
                }
            ),
            400,
        )

    yeni_kayit = Rapor(
        user_id=current_user.id,
        tarih=veri["tarih"],
        sefer=veri["sefer"],
        kisa_bolge=veri["kisaBolge"],
        slot=veri["slot"],
        saat=veri["saat"],
        irsaliye=veri["irsaliye"],
        tam_muhur=veri["tamMuhur"],
        miktar=veri["miktar"],
        plaka=veri["plaka"],
        sofor=veri["sofor"],
        firma=veri["firma"],
        talep=veri["talep"],
    )
    db.session.add(yeni_kayit)
    db.session.commit()
    return jsonify({"durum": "basarili"})


@app.route("/api/guncelle/<int:id>", methods=["PUT"])
@login_required
def guncelle(id):
    """Mevcut kaydı güncelle. Sadece kendi kayıtlarını güncelleyebilir."""
    veri = request.json
    kayit = Rapor.query.get_or_404(id)

    # Yetki kontrolü: Sadece kendi kaydını güncelleyebilir
    if kayit.user_id != current_user.id:
        return jsonify({"durum": "hata", "mesaj": "Bu kaydı düzenleme yetkiniz yok!"}), 403

    # İrsaliye değişmişse çakışma kontrolü
    if kayit.irsaliye != veri["irsaliye"]:
        baska_kayit = Rapor.query.filter_by(irsaliye=veri["irsaliye"]).first()
        if baska_kayit:
            return (
                jsonify(
                    {
                        "durum": "hata",
                        "mesaj": "Bu İrsaliye No başka bir kayıtta var!",
                    }
                ),
                400,
            )

    kayit.tarih = veri["tarih"]
    kayit.sefer = veri["sefer"]
    kayit.kisa_bolge = veri["kisaBolge"]
    kayit.slot = veri["slot"]
    kayit.saat = veri["saat"]
    kayit.irsaliye = veri["irsaliye"]
    kayit.tam_muhur = veri["tamMuhur"]
    kayit.miktar = veri["miktar"]
    kayit.plaka = veri["plaka"]
    kayit.sofor = veri["sofor"]
    kayit.firma = veri["firma"]
    kayit.talep = veri["talep"]
    db.session.commit()
    return jsonify({"durum": "basarili"})


@app.route("/api/sil/<int:id>", methods=["DELETE"])
@login_required
def sil(id):
    """Kaydı sil. Sadece kendi kayıtlarını silebilir."""
    kayit = Rapor.query.get_or_404(id)

    # Yetki kontrolü
    if kayit.user_id != current_user.id:
        return jsonify({"durum": "hata", "mesaj": "Bu kaydı silme yetkiniz yok!"}), 403

    db.session.delete(kayit)
    db.session.commit()
    return jsonify({"durum": "basarili"})


@app.route("/api/sifirla", methods=["DELETE"])
@login_required
def sifirla():
    """Kullanıcının TÜM kayıtlarını sil (sadece kendi verilerini)."""
    try:
        Rapor.query.filter_by(user_id=current_user.id).delete()
        db.session.commit()
        return jsonify({"durum": "basarili"})
    except Exception:
        db.session.rollback()
        return jsonify({"durum": "hata"}), 500


# ─────────────────────────────────────────────
# EXCEL DIŞA AKTARMA
# ─────────────────────────────────────────────


@app.route("/api/excel_indir", methods=["GET"])
@login_required
def excel_indir():
    """
    Kullanıcının kayıtlarını Excel dosyası olarak indir.

    İş Akışı:
    1. Veritabanından giriş yapan kullanıcının kayıtlarını çek
    2. Pandas DataFrame'e dönüştür
    3. BytesIO ile bellek üstünde Excel dosyası oluştur (openpyxl engine)
    4. send_file ile kullanıcıya indir

    NOT: Buraya Pandas ile özel formatlama kodlarınızı ekleyebilirsiniz.
    Örneğin:
    - Sütun genişlikleri ayarlama
    - Başlık satırı renklendirme
    - Koşullu biçimlendirme
    - Birden fazla sayfa (sheet)
    """

    # 1) Kullanıcının kayıtlarını DB'den çek
    tum_kayitlar = (
        Rapor.query.filter_by(user_id=current_user.id)
        .order_by(Rapor.id.desc())
        .all()
    )

    # 2) Veri listesini oluştur (Excel sütun başlıkları burada belirlenir)
    veri_listesi = []
    for k in tum_kayitlar:
        veri_listesi.append(
            {
                "TARİH": k.tarih,
                "BÖLGE (SEFER ADI)": k.sefer,
                "RAMPA ÇIKIŞ SAATİ": k.saat,
                "İRSALİYE NO": k.irsaliye,
                "MÜHÜR": k.tam_muhur,
                "MİKTAR": k.miktar,
                "ARAÇ PLAKA": k.plaka,
                "ŞOFÖR": k.sofor,
                "FİRMA": k.firma,
                "TALEP": k.talep,
            }
        )

    # 3) DataFrame oluştur
    df = pd.DataFrame(veri_listesi)

    # ─── PANDAS İLE ÖZEL FORMATLAMA (İskelet) ───
    #
    # Eğer sütun genişliği, renk vs. ayarlamak isterseniz:
    #
    # from openpyxl.styles import Font, PatternFill, Alignment
    #
    # output = BytesIO()
    # with pd.ExcelWriter(output, engine='openpyxl') as writer:
    #     df.to_excel(writer, index=False, sheet_name='Aktarma_Raporu')
    #     workbook = writer.book
    #     worksheet = writer.sheets['Aktarma_Raporu']
    #
    #     # Başlık satırı stil ayarları
    #     header_font = Font(bold=True, color="FFFFFF", size=12)
    #     header_fill = PatternFill(start_color="4F46E5", fill_type="solid")
    #     for col_num, col_name in enumerate(df.columns, 1):
    #         cell = worksheet.cell(row=1, column=col_num)
    #         cell.font = header_font
    #         cell.fill = header_fill
    #         cell.alignment = Alignment(horizontal="center")
    #
    #     # Sütun genişlikleri otomatik ayarla
    #     for col in worksheet.columns:
    #         max_length = max(len(str(cell.value or "")) for cell in col)
    #         adjusted_width = min(max_length + 4, 40)
    #         worksheet.column_dimensions[col[0].column_letter].width = adjusted_width
    #
    # output.seek(0)

    # 4) Basit Excel oluştur
    output = BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Aktarma_Raporu")
    output.seek(0)

    # 5) Dosya adı: TM_Tarih formatında
    zaman = datetime.now().strftime("%Y-%m-%d")
    tm_kisa = current_user.preferred_tm.replace(" ", "_")
    dosya_adi = f"Aktarma_Raporu_{tm_kisa}_{zaman}.xlsx"

    return send_file(output, download_name=dosya_adi, as_attachment=True)


# ─────────────────────────────────────────────
# EXCEL YÜKLEME (Toplu Veri Aktarımı)
# ─────────────────────────────────────────────


@app.route("/api/excel_yukle", methods=["POST"])
@login_required
def excel_yukle():
    """
    Kullanıcının yüklediği Excel dosyasını işle ve DB'ye kaydet.

    İskelet Endpoint - Kullanım:
    1. Frontend'den bir Excel dosyası POST edilir.
    2. Pandas ile okunur ve satır satır Rapor tablosuna yazılır.
    3. Hatalı satırlar atlanır veya raporlanır.

    NOT: Bu endpoint'i kendi Excel formatınıza göre özelleştirin.
    Sütun eşleştirmeleri (mapping) aşağıda belirtilmiştir.
    """
    if "dosya" not in request.files:
        return jsonify({"durum": "hata", "mesaj": "Dosya bulunamadı!"}), 400

    dosya = request.files["dosya"]
    if dosya.filename == "":
        return jsonify({"durum": "hata", "mesaj": "Dosya seçilmedi!"}), 400

    try:
        # Excel dosyasını oku
        df = pd.read_excel(dosya, engine="openpyxl")

        # ─── SÜTUN EŞLEŞTİRME (Mapping) ───
        # Yüklenen Excel'deki sütun isimlerini veritabanı alanlarıyla eşleştirin.
        # Örnek:
        # sutun_eslestirme = {
        #     "TARİH": "tarih",
        #     "BÖLGE (SEFER ADI)": "sefer",
        #     "İRSALİYE NO": "irsaliye",
        #     "MÜHÜR": "tam_muhur",
        #     "MİKTAR": "miktar",
        #     "ARAÇ PLAKA": "plaka",
        #     "ŞOFÖR": "sofor",
        #     "FİRMA": "firma",
        #     "TALEP": "talep",
        # }
        # df = df.rename(columns=sutun_eslestirme)

        eklenen = 0
        atlanan = 0

        for _, satir in df.iterrows():
            irsaliye_no = str(satir.get("irsaliye", "")).strip()
            if not irsaliye_no:
                atlanan += 1
                continue

            # Aynı irsaliye varsa atla
            mevcut = Rapor.query.filter_by(irsaliye=irsaliye_no).first()
            if mevcut:
                atlanan += 1
                continue

            yeni = Rapor(
                user_id=current_user.id,
                tarih=str(satir.get("tarih", "")),
                sefer=str(satir.get("sefer", "")),
                kisa_bolge=str(satir.get("kisa_bolge", "")),
                slot=str(satir.get("slot", "")),
                saat=str(satir.get("saat", "")),
                irsaliye=irsaliye_no,
                tam_muhur=str(satir.get("tam_muhur", "")),
                miktar=int(satir.get("miktar", 0) or 0),
                plaka=str(satir.get("plaka", "")),
                sofor=str(satir.get("sofor", "")),
                firma=str(satir.get("firma", "")),
                talep=str(satir.get("talep", "")),
            )
            db.session.add(yeni)
            eklenen += 1

        db.session.commit()
        return jsonify(
            {
                "durum": "basarili",
                "mesaj": f"{eklenen} kayıt eklendi, {atlanan} kayıt atlandı.",
            }
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"durum": "hata", "mesaj": f"Dosya işlenirken hata: {str(e)}"}), 500


# ─────────────────────────────────────────────
# UYGULAMAYI BAŞLAT
# ─────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
