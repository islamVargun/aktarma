from flask import Flask, request, jsonify, render_template, send_file
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
from io import BytesIO
from datetime import datetime
import os

app = Flask(__name__)

# Veritabanı Ayarları
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///aktarma.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Veritabanı Tablosunun Tasarımı
class Rapor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tarih = db.Column(db.String(20))
    sefer = db.Column(db.String(100))
    kisa_bolge = db.Column(db.String(50))
    slot = db.Column(db.String(10))
    saat = db.Column(db.String(10))
    irsaliye = db.Column(db.String(20), unique=True, nullable=False)
    tam_muhur = db.Column(db.String(20))
    miktar = db.Column(db.Integer)
    plaka = db.Column(db.String(20))
    sofor = db.Column(db.String(100))
    firma = db.Column(db.String(50))
    talep = db.Column(db.String(50))

with app.app_context():
    db.create_all()

# --- API YOLLARI ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/veriler', methods=['GET'])
def verileri_getir():
    tum_kayitlar = Rapor.query.order_by(Rapor.id.desc()).all()
    liste = []
    for k in tum_kayitlar:
        liste.append({
            "id": k.id, "tarih": k.tarih, "sefer": k.sefer, "kisaBolge": k.kisa_bolge,
            "slot": k.slot, "saat": k.saat, "irsaliye": k.irsaliye, "tamMuhur": k.tam_muhur,
            "miktar": k.miktar, "plaka": k.plaka, "sofor": k.sofor, "firma": k.firma, "talep": k.talep
        })
    return jsonify(liste)

@app.route('/api/kaydet', methods=['POST'])
def kaydet():
    veri = request.json
    mevcut = Rapor.query.filter_by(irsaliye=veri['irsaliye']).first()
    if mevcut:
        return jsonify({"durum": "hata", "mesaj": f"Bu İrsaliye No ({veri['irsaliye']}) zaten kayıtlı!"}), 400

    yeni_kayit = Rapor(
        tarih=veri['tarih'], sefer=veri['sefer'], kisa_bolge=veri['kisaBolge'],
        slot=veri['slot'], saat=veri['saat'], irsaliye=veri['irsaliye'],
        tam_muhur=veri['tamMuhur'], miktar=veri['miktar'], plaka=veri['plaka'],
        sofor=veri['sofor'], firma=veri['firma'], talep=veri['talep']
    )
    db.session.add(yeni_kayit)
    db.session.commit()
    return jsonify({"durum": "basarili"})

@app.route('/api/guncelle/<int:id>', methods=['PUT'])
def guncelle(id):
    veri = request.json
    kayit = Rapor.query.get_or_404(id)
    if kayit.irsaliye != veri['irsaliye']:
        baska_kayit = Rapor.query.filter_by(irsaliye=veri['irsaliye']).first()
        if baska_kayit:
            return jsonify({"durum": "hata", "mesaj": "Bu İrsaliye No başka bir kayıtta var!"}), 400

    kayit.tarih = veri['tarih']
    kayit.sefer = veri['sefer']
    kayit.kisa_bolge = veri['kisaBolge']
    kayit.slot = veri['slot']
    kayit.saat = veri['saat']
    kayit.irsaliye = veri['irsaliye']
    kayit.tam_muhur = veri['tamMuhur']
    kayit.miktar = veri['miktar']
    kayit.plaka = veri['plaka']
    kayit.sofor = veri['sofor']
    kayit.firma = veri['firma']
    kayit.talep = veri['talep']
    db.session.commit()
    return jsonify({"durum": "basarili"})

@app.route('/api/sil/<int:id>', methods=['DELETE'])
def sil(id):
    kayit = Rapor.query.get_or_404(id)
    db.session.delete(kayit)
    db.session.commit()
    return jsonify({"durum": "basarili"})

@app.route('/api/sifirla', methods=['DELETE'])
def sifirla():
    try:
        db.session.query(Rapor).delete()
        db.session.commit()
        return jsonify({"durum": "basarili"})
    except:
        db.session.rollback()
        return jsonify({"durum": "hata"}), 500

# === İŞTE YENİ EKLENEN KUSURSUZ EXCEL İNDİRME API'Sİ ===
@app.route('/api/excel_indir', methods=['GET'])
def excel_indir():
    tum_kayitlar = Rapor.query.order_by(Rapor.id.desc()).all()
    
    # Verileri Pandas'ın anlayacağı sözlük listesine çeviriyoruz
    veri_listesi = []
    for k in tum_kayitlar:
        veri_listesi.append({
            "TARİH": k.tarih,
            "BÖLGE (SEFER ADI)": k.sefer,
            "RAMPA ÇIKIŞ SAATİ": k.saat,
            "İRSALİYE NO": k.irsaliye,
            "MÜHÜR": k.tam_muhur,
            "MİKTAR": k.miktar,
            "ARAÇ PLAKA": k.plaka,
            "ŞOFÖR": k.sofor,
            "FİRMA": k.firma,
            "TALEP": k.talep
        })
        
    df = pd.DataFrame(veri_listesi)
    
    # Excel'i bilgisayara değil, doğrudan RAM'e (belleğe) yazıyoruz
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Aktarma_Raporu')
        
    output.seek(0)
    
    zaman = datetime.now().strftime("%Y-%m-%d")
    dosya_adi = f"Aktarma_Raporu_{zaman}.xlsx"
    
    # Dosyayı "resmi bir indirme" olarak tarayıcıya yolluyoruz
    return send_file(output, download_name=dosya_adi, as_attachment=True)

if __name__ == '__main__':
    # Port bilgisini Render otomatik atar, o yüzden os.environ kullanmak en sağlıklısıdır
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
