/* ═══════════════════════════════════════════════════
   AKTARMA PRO — SCRIPT.JS
   CRUD, Modal Edit, Daily Records, 24h Time
   ═══════════════════════════════════════════════════ */

const talepKodlari = { SÖZLEŞMELİ: "K", SPOT: "S", "İKAME(SÖZLEŞMELİ)": "K" };
const firmaKodlari = {
  KEŞİF: "K", DOĞANLAR: "D", TURHANLAR: "T", GOONTECH: "G", ÖZPA: "Ö",
};

const tumSubeler = [
  "ATALAR", "ATAŞEHİR", "BAKKALKÖY", "BEYKOZ", "ÇEKMEKÖY", "DUDULLU",
  "EBEBEK", "GEBZE", "İÇERENKÖY", "İNKILAP", "KADIKÖY", "KARTAL",
  "KAYNARCA", "KÜÇÜKYALI", "MALTEPE", "MANGO", "PENDİK", "SELİMİYE",
  "SULTANBEYLİ", "TAŞDELEN", "TUZLA", "ÜMRANİYE", "ÜSKÜDAR",
  "YENİDOĞAN", "YENİSAHRA",
];
const tumPlakalar = [
  "16FL198", "34GK4636", "34HFD607", "34CRK935", "34KY1514", "34GH5559",
  "35HJ263", "34EOH268", "34DSS064", "34JU5304", "07HRC18", "34NG3321",
  "34BTV486", "78AAT082", "34KR0474", "34NK0811", "16RF150", "34DFH135",
  "45AHV073", "41B3D44", "01AAS278", "34TA8984", "34EFT389", "34GAB144",
  "34BRZ173", "34CLT861", "81ABU206", "34DZR453", "54NVS225", "34PDF190",
  "34LK8572", "44PK864", "17HK965", "34CJS788", "34FIH174", "34JL4846",
  "34MCD666", "06EE730", "78AAT081", "34MMU474", "38ACR104", "34BU8075",
  "34MYC377", "34MJC263", "34DU9784", "25EE454", "10JPY249", "78AV1584",
  "20AEV419", "15ABE160", "34VL9466", "16TAG47", "34LFS110", "32AAC344",
  "10LJB13", "34TGB360", "34EFS110", "34LH1702", "34LNU197", "34GM4707",
  "34JS4205", "27MD294", "41U2396", "42FJM55", "71KE235", "34LR5663",
  "54ES638", "34KB2033", "35KC3726", "35BMD129", "34HCZ318", "34CKE968",
  "16YF180", "34MEG176", "34KFT085", "34EVT123", "34EKR662", "34NB9848",
  "06CNZ791", "34EIM026", "34KM5860", "34FEY536", "34TY8357", "42AOC27",
  "34NL1493",
];
const tumSoforler = [
  "OĞUZHAN UYSAL", "EKREM MERMER", "ÖNDER AKTAŞ", "MURAT TURAN",
  "CEM KURBAN", "YASİN LEYMUN", "HABİB TURAN", "BURAK TURHAN",
  "OKAN IŞIK", "BERKAY DENİZ KARLI", "EROL ÖZ", "EMRE ACET",
  "MEHMET GÖRMÜŞ", "MESUT GÜRDÜL", "BURAK SATILMIŞ", "OLGUN GÖL",
  "YASİN POLAT", "MİRAÇ ÇELİK", "İSMAİL ÇAM", "TURAN KOYUNCUOĞLU",
  "CEMAL KAŞIKÇI", "İSMAİL LEYMUN", "ÜNAL DOĞAN", "TARIK KUZUCU",
  "YILMAZ BEKTAŞ", "ADEM HATİPOĞLU", "OLCAY SIRMA", "BERKER OZAN TAŞTAN",
  "YASİN ÇALIŞKAN", "BURAK DİKER", "BARAN", "ADNAN UZUN",
  "MERT ALIŞ", "MEVLÜT İBAN", "ALİM KUZUCU", "MUHAMMED DEĞİRMENCİ",
  "MUSTAFA ÖZÇÜMÜŞ", "ÖZGÜR TURHAN", "SEDAT ÖZMEN", "HAKAN KARADAĞ",
  "TİMÜÇİN BERBER", "GÜNGÖR TUFAN", "RAMAZAN BOZYEL", "ENES ERSOY",
  "DURAN ÖZ", "YUSUF ÇALIK", "MAHMUT ÖZ", "YILMAZ KARATAŞ",
  "BURAK BERKTAŞ", "İSMAİL TURGUT", "YAKUP ALTUN", "SALİHCAN ŞAMAKAN",
  "ABDULKADİR ŞENGÜL", "İSMAİL TURHAN", "NİHAT ÖZ", "KAZIM PETEK",
  "ÖZGÜR AYDIN", "YUNUS EMRE DÜZGÜN", "ONUR CENGİZ", "SERHAT EROL",
  "MUSTAFA TALUN", "DURAN YAY", "SERKEN ERDOĞAN", "ŞENDOĞAN KIZILTAN",
  "BURAK BULAY", "UĞUR OKUR", "MERTCAN YAMAN", "KAYIL KAYA",
  "EMİR ÇELİK", "ABDURAHİM ÖZALP", "GÜRKAN ÇAKIRBEY", "SERDAR KIVRIM",
  "FURKAN KAYA", "AHMET UÇAR", "FURKAN KARA", "HÜSEYİN ACAR",
  "ALİ KARAKUŞ",
];

let veriler = [];
let duzenlenenId = null;
let aktifFiltre = "bugun"; // "bugun" | "tarih" | "tumu"

// ─── SAYFA YÜKLENME ───
window.onload = function () {
  zamanVeTarihAyarla();
  datalistleriDoldur();
  tarihFiltresiniAyarla();
  bugununKayitlari(); // Varsayılan = bugünün kayıtları
  if (window.lucide) lucide.createIcons();
};

function bugunTarih() {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

function zamanVeTarihAyarla() {
  const simdi = new Date();
  document.getElementById("tarih").value = bugunTarih();
  // 24 saat formatında saat
  const saat = String(simdi.getHours()).padStart(2, "0");
  const dakika = String(simdi.getMinutes()).padStart(2, "0");
  document.getElementById("saat").value = `${saat}:${dakika}`;
}

function tarihFiltresiniAyarla() {
  // Tarih filtresini bugüne ayarla, max 1 ay önce
  const filtre = document.getElementById("tarihFiltre");
  filtre.value = bugunTarih();
  // Min: 1 ay önce
  const birAyOnce = new Date();
  birAyOnce.setMonth(birAyOnce.getMonth() - 1);
  filtre.min = birAyOnce.toISOString().split("T")[0];
  filtre.max = bugunTarih();
}

function datalistleriDoldur() {
  const bolgeDatalist = document.getElementById("bolgeler");
  tumSubeler.forEach((s) => bolgeDatalist.appendChild(new Option(s, s)));
  const plakaDatalist = document.getElementById("plakalar");
  tumPlakalar.forEach((p) => plakaDatalist.appendChild(new Option(p, p)));
  const soforDatalist = document.getElementById("soforler");
  tumSoforler.forEach((s) => soforDatalist.appendChild(new Option(s, s)));
}

function slotFormatla(deger) {
  let num = parseInt(deger || 1);
  return num < 10 ? `Slot0${num}` : `Slot${num}`;
}

function getTmAdi() {
  return (typeof KULLANICI_TM !== 'undefined' && KULLANICI_TM)
    ? KULLANICI_TM.replace(' TM', '') + ' TM'
    : 'Samandıra TM';
}

// ─── TARİH FİLTRE FONKSİYONLARI ───

function butonAktiflik(aktif) {
  document.getElementById("btnBugun").classList.remove("active");
  document.getElementById("btnTumu").classList.remove("active");
  if (aktif) document.getElementById(aktif).classList.add("active");
}

function bugununKayitlari() {
  aktifFiltre = "bugun";
  document.getElementById("tarihFiltre").value = bugunTarih();
  butonAktiflik("btnBugun");
  verileriSunucudanCek(bugunTarih());
}

function tumKayitlar() {
  aktifFiltre = "tumu";
  butonAktiflik("btnTumu");
  verileriSunucudanCek(""); // boş = tüm kayıtlar
}

function tariheGoreFiltrele() {
  aktifFiltre = "tarih";
  butonAktiflik(null);
  const secilen = document.getElementById("tarihFiltre").value;
  verileriSunucudanCek(secilen);
}

// ─── CANLI ÖNIZLEME ───
const formElemanlari = document.querySelectorAll("#formContainer input, #formContainer select");
formElemanlari.forEach((el) => {
  el.addEventListener("input", seferAdiniGuncelle);
  el.addEventListener("change", seferAdiniGuncelle);
  el.addEventListener("input", function () {
    this.classList.remove("hata-border");
    document.getElementById("genelHata").style.display = "none";
  });
});

function seferAdiniGuncelle() {
  let kisaBolge = document.getElementById("bolge").value.trim().toUpperCase();
  const slot = slotFormatla(document.getElementById("slot").value);
  const plaka = document.getElementById("plaka").value.toUpperCase().replace(/\s/g, "");
  const firma = document.getElementById("firma").value;
  const talep = document.getElementById("talep").value;
  const ikameDurumu = document.getElementById("ikame").checked || talep === "İKAME(SÖZLEŞMELİ)";

  if (kisaBolge !== "") {
    let tamSeferAdi = `${getTmAdi()}_${kisaBolge}_${slot}_${talepKodlari[talep] || "X"}_${firmaKodlari[firma] || "X"}_${plaka}`;
    if (ikameDurumu) tamSeferAdi += " IKAME";
    document.getElementById("onizlemeMetni").innerHTML =
      '<i data-lucide="zap" style="width:16px;height:16px;display:inline;vertical-align:-2px;"></i> Oluşacak Sefer Adı: <strong>' + tamSeferAdi + "</strong>";
  } else {
    document.getElementById("onizlemeMetni").innerHTML =
      '<i data-lucide="zap" style="width:16px;height:16px;display:inline;vertical-align:-2px;"></i> Oluşacak Sefer Adı: <em>Bekleniyor...</em>';
  }
  if (window.lucide) lucide.createIcons();
}

// Saat alanı otomatik formatlama (24h HH:MM)
document.getElementById("saat").addEventListener("input", function () {
  let val = this.value.replace(/[^0-9]/g, "");
  if (val.length >= 3) {
    val = val.substring(0, 2) + ":" + val.substring(2, 4);
  }
  this.value = val;
});

document.getElementById("muhur1").addEventListener("input", function () {
  if (this.value.length === 7) document.getElementById("muhur2").focus();
});

document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const modal = document.getElementById("editModal");
    if (modal.classList.contains("active")) {
      modalKaydet();
    } else {
      kaydet();
    }
  }
});

// ─── VERİLERİ ÇEK (tarih filtreli) ───
function verileriSunucudanCek(tarih) {
  let url = "/api/veriler";
  if (tarih) url += "?tarih=" + tarih;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      veriler = data;
      tabloyuCiz();
      ozetiGuncelle();
    })
    .catch((err) => console.error("Veri çekme hatası:", err));
}

// ─── KAYDET (YENİ KAYIT) ───
function kaydet() {
  const zorunluAlanlar = ["tarih", "bolge", "slot", "saat", "irsaliye", "muhur1", "muhur2", "miktar", "plaka", "sofor"];
  let hataVar = false;

  zorunluAlanlar.forEach((id) => {
    const kutu = document.getElementById(id);
    if (!kutu.value.trim()) {
      kutu.classList.add("hata-border");
      hataVar = true;
    }
  });

  const m1 = document.getElementById("muhur1").value;
  const m2 = document.getElementById("muhur2").value;
  if (m1.length < 7 || m2.length < 3) {
    document.getElementById("muhur1").classList.add("hata-border");
    document.getElementById("muhur2").classList.add("hata-border");
    document.getElementById("genelHata").innerHTML = "⚠️ Mühür eksiksiz girilmelidir!";
    hataVar = true;
  }

  const miktar = document.getElementById("miktar").value;
  if (miktar && parseInt(miktar) > 2000) {
    document.getElementById("miktar").classList.add("hata-border");
    document.getElementById("genelHata").innerHTML = "⚠️ Miktar <strong>2000'den</strong> büyük olamaz!";
    hataVar = true;
  }

  if (hataVar) {
    document.getElementById("genelHata").style.display = "block";
    return;
  }

  document.getElementById("genelHata").style.display = "none";

  let kisaBolge = document.getElementById("bolge").value.trim().toUpperCase();
  const slot = slotFormatla(document.getElementById("slot").value);
  const talep = document.getElementById("talep").value;
  const firma = document.getElementById("firma").value;
  const plaka = document.getElementById("plaka").value.toUpperCase().replace(/\s/g, "");
  const ikameDurumu = document.getElementById("ikame").checked || talep === "İKAME(SÖZLEŞMELİ)";

  let tamSeferAdi = `${getTmAdi()}_${kisaBolge}_${slot}_${talepKodlari[talep]}_${firmaKodlari[firma]}_${plaka}`;
  if (ikameDurumu) tamSeferAdi += " IKAME";

  const paket = {
    tarih: document.getElementById("tarih").value,
    sefer: tamSeferAdi,
    kisaBolge: kisaBolge,
    slot: document.getElementById("slot").value,
    saat: document.getElementById("saat").value,
    irsaliye: document.getElementById("irsaliye").value.trim(),
    tamMuhur: m1 + "-" + m2,
    miktar: parseInt(miktar),
    plaka: plaka,
    sofor: document.getElementById("sofor").value.toUpperCase(),
    firma: firma,
    talep: talep,
  };

  fetch("/api/kaydet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paket),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.durum === "hata") {
        document.getElementById("irsaliye").classList.add("hata-border");
        document.getElementById("genelHata").innerHTML = "🚨 DİKKAT: " + data.mesaj;
        document.getElementById("genelHata").style.display = "block";
      } else {
        ekraniSifirla();
        // Aktif filtreye göre yeniden çek
        yenidenYukle();
      }
    })
    .catch((err) => console.error("Bağlantı hatası:", err));
}

function yenidenYukle() {
  if (aktifFiltre === "bugun") bugununKayitlari();
  else if (aktifFiltre === "tumu") tumKayitlar();
  else tariheGoreFiltrele();
}

function ekraniSifirla() {
  document.getElementById("bolge").value = "";
  document.getElementById("slot").value = "1";
  document.getElementById("ikame").checked = false;
  document.getElementById("irsaliye").value = "";
  document.getElementById("muhur1").value = "";
  document.getElementById("muhur2").value = "";
  document.getElementById("miktar").value = "";
  document.getElementById("plaka").value = "";
  document.getElementById("sofor").value = "";
  document.getElementById("firma").selectedIndex = 0;
  document.getElementById("talep").selectedIndex = 0;
  zamanVeTarihAyarla();
  seferAdiniGuncelle();
  document.getElementById("bolge").focus();
}

// ─── TABLO ÇİZİMİ (Lucide Icon Butonları - Yan Yana) ───
function tabloyuCiz() {
  const tbody = document.getElementById("tabloGovdesi");
  tbody.innerHTML = "";

  veriler.forEach((v) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${v.tarih}</td>
      <td class="td-sefer">${v.sefer}</td>
      <td>${v.saat}</td>
      <td>${v.irsaliye}</td>
      <td>${v.tamMuhur}</td>
      <td>${v.miktar}</td>
      <td>${v.plaka}</td>
      <td>${v.sofor}</td>
      <td>${v.firma}</td>
      <td>${v.talep}</td>
      <td>
        <div class="td-actions">
          <button class="btn-action btn-edit" onclick="satirDuzenle(${v.id})" title="Düzenle">
            <i data-lucide="pencil" style="width:14px; height:14px;"></i>
          </button>
          <button class="btn-action btn-delete" onclick="satirSil(${v.id})" title="Sil">
            <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (window.lucide) lucide.createIcons();
}

function ozetiGuncelle() {
  document.getElementById("dash-irsaliye").innerText = veriler.length;
  const toplamMiktar = veriler.reduce((toplam, v) => toplam + v.miktar, 0);
  document.getElementById("dash-miktar").innerText = toplamMiktar.toLocaleString("tr-TR");
}

// ═══════════════════════════════════════════
// MODAL DÜZENLEME SİSTEMİ
// ═══════════════════════════════════════════

function satirDuzenle(id) {
  const veri = veriler.find((v) => v.id === id);
  if (!veri) return;

  duzenlenenId = id;

  document.getElementById("m_tarih").value = veri.tarih;
  document.getElementById("m_bolge").value = veri.kisaBolge;
  document.getElementById("m_slot").value = veri.slot;
  document.getElementById("m_ikame").checked = veri.sefer.includes("IKAME");
  document.getElementById("m_saat").value = veri.saat;
  document.getElementById("m_irsaliye").value = veri.irsaliye;
  document.getElementById("m_muhur1").value = veri.tamMuhur.split("-")[0];
  document.getElementById("m_muhur2").value = veri.tamMuhur.split("-")[1] || "";
  document.getElementById("m_miktar").value = veri.miktar;
  document.getElementById("m_plaka").value = veri.plaka;
  document.getElementById("m_sofor").value = veri.sofor;
  document.getElementById("m_firma").value = veri.firma;
  document.getElementById("m_talep").value = veri.talep;

  document.getElementById("modalHata").style.display = "none";

  document.getElementById("editModal").classList.add("active");
  document.body.style.overflow = "hidden";

  if (window.lucide) lucide.createIcons();
}

function modalKapat() {
  document.getElementById("editModal").classList.remove("active");
  document.body.style.overflow = "";
  duzenlenenId = null;
}

function modalKaydet() {
  if (!duzenlenenId) return;

  const m1 = document.getElementById("m_muhur1").value;
  const m2 = document.getElementById("m_muhur2").value;
  const kisaBolge = document.getElementById("m_bolge").value.trim().toUpperCase();
  const slot = slotFormatla(document.getElementById("m_slot").value);
  const talep = document.getElementById("m_talep").value;
  const firma = document.getElementById("m_firma").value;
  const plaka = document.getElementById("m_plaka").value.toUpperCase().replace(/\s/g, "");
  const ikameDurumu = document.getElementById("m_ikame").checked || talep === "İKAME(SÖZLEŞMELİ)";

  let tamSeferAdi = `${getTmAdi()}_${kisaBolge}_${slot}_${talepKodlari[talep]}_${firmaKodlari[firma]}_${plaka}`;
  if (ikameDurumu) tamSeferAdi += " IKAME";

  const paket = {
    tarih: document.getElementById("m_tarih").value,
    sefer: tamSeferAdi,
    kisaBolge: kisaBolge,
    slot: document.getElementById("m_slot").value,
    saat: document.getElementById("m_saat").value,
    irsaliye: document.getElementById("m_irsaliye").value.trim(),
    tamMuhur: m1 + "-" + m2,
    miktar: parseInt(document.getElementById("m_miktar").value || 0),
    plaka: plaka,
    sofor: document.getElementById("m_sofor").value.toUpperCase(),
    firma: firma,
    talep: talep,
  };

  fetch(`/api/guncelle/${duzenlenenId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paket),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.durum === "hata") {
        document.getElementById("modalHata").innerHTML = "🚨 " + data.mesaj;
        document.getElementById("modalHata").style.display = "block";
      } else {
        modalKapat();
        yenidenYukle();
      }
    })
    .catch((err) => {
      console.error("Bağlantı hatası:", err);
      document.getElementById("modalHata").innerHTML = "❌ Bağlantı hatası!";
      document.getElementById("modalHata").style.display = "block";
    });
}

// Overlay tıklama ile kapat
document.getElementById("editModal").addEventListener("click", function (e) {
  if (e.target === this) modalKapat();
});

// ESC ile kapat
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const modal = document.getElementById("editModal");
    if (modal.classList.contains("active")) modalKapat();
  }
});

// ─── SİL & SIFIRLA ───
function satirSil(id) {
  if (confirm("Bu satırı silmek istediğinize emin misiniz?")) {
    fetch(`/api/sil/${id}`, { method: "DELETE" })
      .then(() => yenidenYukle())
      .catch((err) => console.error(err));
  }
}

function tabloyuSifirla() {
  if (confirm("DİKKAT! Tüm tablo silinecek ve veritabanı sıfırlanacak. Emin misiniz?")) {
    fetch("/api/sifirla", { method: "DELETE" })
      .then(() => yenidenYukle())
      .catch((err) => console.error(err));
  }
}

// ─── EXCEL İNDİR ───
function gercekExcelIndir() {
  if (veriler.length === 0) {
    alert("İndirilecek veri bulunamadı!");
    return;
  }
  window.location.href = "/api/excel_indir";
}

// ═══════════════════════════════════════════
// QR / BARKOD TARAMA SİSTEMİ
// ═══════════════════════════════════════════

let qrScanner = null;
let qrKameraAcik = false;

/**
 * QR verisi JSON parse edip saat ve irsaliye alanlarını doldurur.
 * Beklenen format:
 * {"sevkzamani":"17:32:54", "no":"HJI2026000942741", ...}
 * → saat: 17:32
 * → irsaliye: 942741 (son 6 hane)
 */
function qrVeriIsle(decodedText) {
  const sonucDiv = document.getElementById("qrSonuc");
  const mesajSpan = document.getElementById("qrSonucMesaj");

  try {
    // JSON parse
    let veri;
    try {
      veri = JSON.parse(decodedText);
    } catch (e) {
      // JSON değilse belki düz text olarak arayalım
      throw new Error("QR verisi tanınmadı. JSON formatı bekleniyor.");
    }

    let dolurulanlar = [];

    // sevkzamani → saat alanı (HH:MM)
    if (veri.sevkzamani) {
      const saat = veri.sevkzamani.substring(0, 5); // "17:32:54" → "17:32"
      document.getElementById("saat").value = saat;
      document.getElementById("saat").classList.remove("hata-border");
      dolurulanlar.push(`Saat: ${saat}`);
    }

    // no → irsaliye (son 6 hane)
    if (veri.no) {
      // "HJI2026000942741" → sadece rakamları al, son 6 hane
      const rakamlar = veri.no.replace(/\D/g, "");
      const irsaliye = rakamlar.slice(-6);
      if (irsaliye.length > 0) {
        document.getElementById("irsaliye").value = irsaliye;
        document.getElementById("irsaliye").classList.remove("hata-border");
        dolurulanlar.push(`İrsaliye: ${irsaliye}`);
      }
    }

    if (dolurulanlar.length > 0) {
      sonucDiv.className = "qr-result success";
      sonucDiv.style.display = "flex";
      mesajSpan.textContent = "✅ Otomatik dolduruldu → " + dolurulanlar.join(" | ");
      seferAdiniGuncelle();

      // 5 saniye sonra gizle
      setTimeout(() => {
        sonucDiv.style.display = "none";
      }, 5000);
    } else {
      throw new Error("QR'da sevkzamani veya no alanı bulunamadı.");
    }

  } catch (err) {
    sonucDiv.className = "qr-result error";
    sonucDiv.style.display = "flex";
    mesajSpan.textContent = "❌ " + err.message;

    setTimeout(() => {
      sonucDiv.style.display = "none";
    }, 5000);
  }

  if (window.lucide) lucide.createIcons();
}

// ─── KAMERA İLE TARAMA ───
function qrKameraToggle() {
  const btn = document.getElementById("btnQrKamera");
  const txt = document.getElementById("qrKameraText");
  const container = document.getElementById("qrReader");

  if (qrKameraAcik) {
    // Kamerayı kapat
    if (qrScanner) {
      qrScanner.stop().then(() => {
        qrScanner.clear();
        qrScanner = null;
      }).catch(() => { });
    }
    qrKameraAcik = false;
    btn.classList.remove("active");
    txt.textContent = "Kamera ile Tara";
    container.innerHTML = "";
    if (window.lucide) lucide.createIcons();
    return;
  }

  // Kamerayı aç
  if (typeof Html5Qrcode === "undefined") {
    alert("QR tarama kütüphanesi yüklenemedi. Sayfayı yenileyin.");
    return;
  }

  qrScanner = new Html5Qrcode("qrReader");
  qrScanner.start(
    { facingMode: "environment" }, // Arka kamera
    {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    },
    (decodedText) => {
      // Başarılı okuma → kamerayı durdur ve veriyi işle
      qrScanner.stop().then(() => {
        qrScanner.clear();
        qrScanner = null;
        qrKameraAcik = false;
        btn.classList.remove("active");
        txt.textContent = "Kamera ile Tara";
        container.innerHTML = "";
        if (window.lucide) lucide.createIcons();
      }).catch(() => { });

      qrVeriIsle(decodedText);
    },
    () => { } // Hata callback (tarama devam ederken normal)
  ).then(() => {
    qrKameraAcik = true;
    btn.classList.add("active");
    txt.textContent = "Kamerayı Kapat";
    if (window.lucide) lucide.createIcons();
  }).catch((err) => {
    console.error("Kamera açılamadı:", err);
    alert("Kamera erişimi sağlanamadı! Tarayıcı izinlerini kontrol edin.");
  });
}

// ─── DOSYA İLE QR OKUMA ───
function qrDosyaOku(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (typeof Html5Qrcode === "undefined") {
    alert("QR tarama kütüphanesi yüklenemedi.");
    return;
  }

  const scanner = new Html5Qrcode("qrReader");
  scanner.scanFile(file, true)
    .then((decodedText) => {
      qrVeriIsle(decodedText);
      scanner.clear();
    })
    .catch((err) => {
      const sonucDiv = document.getElementById("qrSonuc");
      const mesajSpan = document.getElementById("qrSonucMesaj");
      sonucDiv.className = "qr-result error";
      sonucDiv.style.display = "flex";
      mesajSpan.textContent = "❌ QR kod okunamadı! Resmi kontrol edin.";
      if (window.lucide) lucide.createIcons();

      setTimeout(() => {
        sonucDiv.style.display = "none";
      }, 5000);
    });

  // Input'u sıfırla (aynı dosya tekrar seçilebilsin)
  event.target.value = "";
}
