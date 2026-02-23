const talepKodlari = { SÖZLEŞMELİ: "K", SPOT: "S", "İKAME(SÖZLEŞMELİ)": "K" };
const firmaKodlari = {
  KEŞİF: "K",
  DOĞANLAR: "D",
  TURHANLAR: "T",
  GOONTECH: "G",
  ÖZPA: "Ö",
};

const tumSubeler = [
  "ATALAR",
  "ATAŞEHİR",
  "BAKKALKÖY",
  "BEYKOZ",
  "ÇEKMEKÖY",
  "DUDULLU",
  "EBEBEK",
  "GEBZE",
  "İÇERENKÖY",
  "İNKILAP",
  "KADIKÖY",
  "KARTAL",
  "KAYNARCA",
  "KÜÇÜKYALI",
  "MALTEPE",
  "MANGO",
  "PENDİK",
  "SELİMİYE",
  "SULTANBEYLİ",
  "TAŞDELEN",
  "TUZLA",
  "ÜMRANİYE",
  "ÜSKÜDAR",
  "YENİDOĞAN",
  "YENİSAHRA",
];
const tumPlakalar = [
  "16FL198",
  "34GK4636",
  "34HFD607",
  "34CRK935",
  "34KY1514",
  "34GH5559",
  "35HJ263",
  "34EOH268",
  "34DSS064",
  "34JU5304",
  "07HRC18",
  "34NG3321",
  "34BTV486",
  "78AAT082",
  "34KR0474",
  "34NK0811",
  "16RF150",
  "34DFH135",
  "45AHV073",
  "41B3D44",
  "01AAS278",
  "34TA8984",
  "34EFT389",
  "34GAB144",
  "34BRZ173",
  "34CLT861",
  "81ABU206",
  "34DZR453",
  "54NVS225",
  "34PDF190",
  "34LK8572",
  "44PK864",
  "17HK965",
  "34CJS788",
  "34FIH174",
  "34JL4846",
  "34MCD666",
  "06EE730",
  "78AAT081",
  "34MMU474",
  "38ACR104",
  "34BU8075",
  "34MYC377",
  "34MJC263",
  "34DU9784",
  "25EE454",
  "10JPY249",
  "78AV1584",
  "20AEV419",
  "15ABE160",
  "34VL9466",
  "16TAG47",
  "34LFS110",
  "32AAC344",
  "10LJB13",
  "34TGB360",
  "34EFS110",
  "34LH1702",
  "34LNU197",
  "34GM4707",
  "34JS4205",
  "27MD294",
  "41U2396",
  "42FJM55",
  "71KE235",
  "34LR5663",
  "54ES638",
  "34KB2033",
  "35KC3726",
  "35BMD129",
  "34HCZ318",
  "34CKE968",
  "16YF180",
  "34MEG176",
  "34KFT085",
  "34EVT123",
  "34EKR662",
  "34NB9848",
  "06CNZ791",
  "34EIM026",
  "34KM5860",
  "34FEY536",
  "34TY8357",
  "42AOC27",
  "34NL1493",
];
const tumSoforler = [
  "OĞUZHAN UYSAL",
  "EKREM MERMER",
  "ÖNDER AKTAŞ",
  "MURAT TURAN",
  "CEM KURBAN",
  "YASİN LEYMUN",
  "HABİB TURAN",
  "BURAK TURHAN",
  "OKAN IŞIK",
  "BERKAY DENİZ KARLI",
  "EROL ÖZ",
  "EMRE ACET",
  "MEHMET GÖRMÜŞ",
  "MESUT GÜRDÜL",
  "BURAK SATILMIŞ",
  "OLGUN GÖL",
  "YASİN POLAT",
  "MİRAÇ ÇELİK",
  "İSMAİL ÇAM",
  "TURAN KOYUNCUOĞLU",
  "CEMAL KAŞIKÇI",
  "İSMAİL LEYMUN",
  "ÜNAL DOĞAN",
  "TARIK KUZUCU",
  "YILMAZ BEKTAŞ",
  "ADEM HATİPOĞLU",
  "OLCAY SIRMA",
  "BERKER OZAN TAŞTAN",
  "YASİN ÇALIŞKAN",
  "BURAK DİKER",
  "BARAN",
  "ADNAN UZUN",
  "MERT ALIŞ",
  "MEVLÜT İBAN",
  "ALİM KUZUCU",
  "MUHAMMED DEĞİRMENCİ",
  "MUSTAFA ÖZÇÜMÜŞ",
  "ÖZGÜR TURHAN",
  "SEDAT ÖZMEN",
  "HAKAN KARADAĞ",
  "TİMÜÇİN BERBER",
  "GÜNGÖR TUFAN",
  "RAMAZAN BOZYEL",
  "ENES ERSOY",
  "DURAN ÖZ",
  "YUSUF ÇALIK",
  "MAHMUT ÖZ",
  "YILMAZ KARATAŞ",
  "BURAK BERKTAŞ",
  "İSMAİL TURGUT",
  "YAKUP ALTUN",
  "SALİHCAN ŞAMAKAN",
  "ABDULKADİR ŞENGÜL",
  "İSMAİL TURHAN",
  "NİHAT ÖZ",
  "KAZIM PETEK",
  "ÖZGÜR AYDIN",
  "YUNUS EMRE DÜZGÜN",
  "ONUR CENGİZ",
  "SERHAT EROL",
  "MUSTAFA TALUN",
  "DURAN YAY",
  "SERKEN ERDOĞAN",
  "ŞENDOĞAN KIZILTAN",
  "BURAK BULAY",
  "UĞUR OKUR",
  "MERTCAN YAMAN",
  "KAYIL KAYA",
  "EMİR ÇELİK",
  "ABDURAHİM ÖZALP",
  "GÜRKAN ÇAKIRBEY",
  "SERDAR KIVRIM",
  "FURKAN KAYA",
  "AHMET UÇAR",
  "FURKAN KARA",
  "HÜSEYİN ACAR",
  "ALİ KARAKUŞ",
];

let veriler = [];
let duzenlenenId = null;

window.onload = function () {
  zamanVeTarihAyarla();
  datalistleriDoldur();
  verileriSunucudanCek();
};

function zamanVeTarihAyarla() {
  const simdi = new Date();
  document.getElementById("tarih").value = simdi.toISOString().split("T")[0];
  document.getElementById("saat").value =
    `${String(simdi.getHours()).padStart(2, "0")}:${String(simdi.getMinutes()).padStart(2, "0")}`;
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

const formElemanlari = document.querySelectorAll("input, select");
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
  const plaka = document
    .getElementById("plaka")
    .value.toUpperCase()
    .replace(/\s/g, "");
  const firma = document.getElementById("firma").value;
  const talep = document.getElementById("talep").value;
  const ikameDurumu =
    document.getElementById("ikame").checked || talep === "İKAME(SÖZLEŞMELİ)";

  if (kisaBolge !== "") {
    let tamSeferAdi = `Samandıra TM_${kisaBolge}_${slot}_${talepKodlari[talep] || "X"}_${firmaKodlari[firma] || "X"}_${plaka}`;
    if (ikameDurumu) tamSeferAdi += " IKAME";
    document.getElementById("onizlemeMetni").innerHTML =
      "⚡ Oluşacak Sefer Adı: <strong>" + tamSeferAdi + "</strong>";
  } else {
    document.getElementById("onizlemeMetni").innerHTML =
      "⚡ Oluşacak Sefer Adı: <em>Bekleniyor...</em>";
  }
}

document.getElementById("muhur1").addEventListener("input", function () {
  if (this.value.length === 7) document.getElementById("muhur2").focus();
});

document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") kaydet();
});

function verileriSunucudanCek() {
  fetch("/api/veriler")
    .then((response) => response.json())
    .then((data) => {
      veriler = data;
      tabloyuCiz();
      ozetiGuncelle();
    })
    .catch((err) => console.error("Veri çekme hatası:", err));
}

function kaydet() {
  const zorunluAlanlar = [
    "tarih",
    "bolge",
    "slot",
    "saat",
    "irsaliye",
    "muhur1",
    "muhur2",
    "miktar",
    "plaka",
    "sofor",
  ];
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
    document.getElementById("genelHata").innerHTML =
      "⚠️ Mühür eksiksiz girilmelidir!";
    hataVar = true;
  }

  const miktar = document.getElementById("miktar").value;
  if (miktar && parseInt(miktar) > 2000) {
    document.getElementById("miktar").classList.add("hata-border");
    document.getElementById("genelHata").innerHTML =
      "⚠️ Miktar <strong>2000'den</strong> büyük olamaz!";
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
  const plaka = document
    .getElementById("plaka")
    .value.toUpperCase()
    .replace(/\s/g, "");
  const ikameDurumu =
    document.getElementById("ikame").checked || talep === "İKAME(SÖZLEŞMELİ)";

  let tamSeferAdi = `Samandıra TM_${kisaBolge}_${slot}_${talepKodlari[talep]}_${firmaKodlari[firma]}_${plaka}`;
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

  let url = "/api/kaydet";
  let method = "POST";

  if (duzenlenenId) {
    url = `/api/guncelle/${duzenlenenId}`;
    method = "PUT";
  }

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paket),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.durum === "hata") {
        document.getElementById("irsaliye").classList.add("hata-border");
        document.getElementById("genelHata").innerHTML =
          "🚨 DİKKAT: " + data.mesaj;
        document.getElementById("genelHata").style.display = "block";
      } else {
        ekraniSifirla();
        verileriSunucudanCek();
        if (duzenlenenId) {
          document.getElementById("kaydetBtn").style.display = "flex";
          document.getElementById("guncelleBtn").style.display = "none";
          duzenlenenId = null;
        }
      }
    })
    .catch((err) => console.error("Bağlantı hatası:", err));
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
  document.getElementById("onizlemeMetni").innerHTML =
    "⚡ Oluşacak Sefer Adı: <em>Bekleniyor...</em>";
  document.getElementById("bolge").focus();
}

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
                <button class="btn-action btn-edit" onclick="satirDuzenle(${v.id})">✏️</button>
                <button class="btn-action btn-delete" onclick="satirSil(${v.id})">❌</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

function ozetiGuncelle() {
  document.getElementById("dash-irsaliye").innerText = veriler.length;
  const toplamMiktar = veriler.reduce((toplam, v) => toplam + v.miktar, 0);
  document.getElementById("dash-miktar").innerText =
    toplamMiktar.toLocaleString("tr-TR");
}

function satirDuzenle(id) {
  const veri = veriler.find((v) => v.id === id);
  if (!veri) return;

  document.getElementById("tarih").value = veri.tarih;
  document.getElementById("bolge").value = veri.kisaBolge;
  document.getElementById("slot").value = veri.slot;
  document.getElementById("ikame").checked = veri.sefer.includes("IKAME");
  document.getElementById("saat").value = veri.saat;
  document.getElementById("irsaliye").value = veri.irsaliye;
  document.getElementById("muhur1").value = veri.tamMuhur.split("-")[0];
  document.getElementById("muhur2").value = veri.tamMuhur.split("-")[1];
  document.getElementById("miktar").value = veri.miktar;
  document.getElementById("plaka").value = veri.plaka;
  document.getElementById("sofor").value = veri.sofor;
  document.getElementById("firma").value = veri.firma;
  document.getElementById("talep").value = veri.talep;

  duzenlenenId = id;
  document.getElementById("kaydetBtn").style.display = "none";
  document.getElementById("guncelleBtn").style.display = "flex";
  seferAdiniGuncelle();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function satirSil(id) {
  if (confirm("Bu satırı silmek istediğinize emin misiniz?")) {
    fetch(`/api/sil/${id}`, { method: "DELETE" })
      .then(() => verileriSunucudanCek())
      .catch((err) => console.error(err));
  }
}

function tabloyuSifirla() {
  if (
    confirm(
      "DİKKAT! Tüm tablo silinecek ve veritabanı sıfırlanacak. Emin misiniz?",
    )
  ) {
    fetch("/api/sifirla", { method: "DELETE" })
      .then(() => verileriSunucudanCek())
      .catch((err) => console.error(err));
  }
}

// === İŞTE BURASI DEĞİŞTİ: GÜVENLİ PYTHON İNDİRME MANTIĞI ===
function gercekExcelIndir() {
  if (veriler.length === 0) {
    alert("İndirilecek veri bulunamadı!");
    return;
  }
  // Tarayıcıdaki sahte üretim yerine sunucudaki gerçek Python dosyasını çağırıyoruz
  window.location.href = "/api/excel_indir";
}
