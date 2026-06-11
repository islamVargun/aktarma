/* ═══════════════════════════════════════════
   SPOT RAPORU — spot.js
   ═══════════════════════════════════════════ */

let spotVeriler = [];
let spotAktifFiltre = "bugun";

window.onload = function () {
  spotTarihFiltresiniAyarla();
  spotBugun();
  if (window.lucide) lucide.createIcons();
};

function spotBugunTarih() {
  return new Date().toISOString().split("T")[0];
}

function spotTarihFiltresiniAyarla() {
  const filtre = document.getElementById("spotTarihFiltre");
  filtre.value = spotBugunTarih();
  const birAyOnce = new Date();
  birAyOnce.setMonth(birAyOnce.getMonth() - 1);
  filtre.min = birAyOnce.toISOString().split("T")[0];
  filtre.max = spotBugunTarih();
}

function spotButonAktiflik(aktif) {
  document.getElementById("btnSpotBugun").classList.remove("active");
  document.getElementById("btnSpotTumu").classList.remove("active");
  if (aktif) document.getElementById(aktif).classList.add("active");
}

function spotBugun() {
  spotAktifFiltre = "bugun";
  document.getElementById("spotTarihFiltre").value = spotBugunTarih();
  spotButonAktiflik("btnSpotBugun");
  spotVerileriCek(spotBugunTarih());
}

function spotTumu() {
  spotAktifFiltre = "tumu";
  spotButonAktiflik("btnSpotTumu");
  spotVerileriCek("");
}

function spotTariheGore() {
  spotAktifFiltre = "tarih";
  spotButonAktiflik(null);
  const secilen = document.getElementById("spotTarihFiltre").value;
  spotVerileriCek(secilen);
}

function spotVerileriCek(tarih) {
  let url = "/api/spot_veriler";
  if (tarih) url += "?tarih=" + tarih;

  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      spotVeriler = data;
      spotTabloCiz();
      spotOzetGuncelle();
    })
    .catch((err) => console.error("Spot veri hatası:", err));
}

function formatNavlun(val) {
  return "₺ " + Number(val).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function spotTabloCiz() {
  const tbody = document.getElementById("spotTabloGovdesi");
  tbody.innerHTML = "";

  spotVeriler.forEach((v) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${v.bolge}</td>
      <td>${v.tarih}</td>
      <td>${v.gorev}</td>
      <td>${v.cikis}</td>
      <td>${v.ugrama}</td>
      <td><strong>${v.varis}</strong></td>
      <td>${v.plaka}</td>
      <td><span class="badge-${v.aracTipi === 'KAMYONET' ? 'kamyonet' : 'panelvan'}">${v.aracTipi}</span></td>
      <td class="td-money">${formatNavlun(v.navlun)}</td>
      <td>${v.seferTipi}</td>
      <td>₺ 0</td>
      <td>${v.ekMaliyetNedeni}</td>
      <td class="td-money">${formatNavlun(v.toplam)}</td>
      <td>${v.tedarikciFirma}</td>
      <td class="td-irsaliye">${v.irsaliye}</td>
    `;
    tbody.appendChild(tr);
  });

  if (window.lucide) lucide.createIcons();
}

function spotOzetGuncelle() {
  document.getElementById("spot-kayit").innerText = spotVeriler.length;
  const toplamNavlun = spotVeriler.reduce((t, v) => t + v.navlun, 0);
  document.getElementById("spot-navlun").innerText = formatNavlun(toplamNavlun);
}

function spotExcelIndir() {
  if (spotVeriler.length === 0) {
    alert("İndirilecek spot verisi bulunamadı!");
    return;
  }
  let url = "/api/spot_excel";
  if (spotAktifFiltre === "bugun") {
    url += "?tarih=" + spotBugunTarih();
  } else if (spotAktifFiltre === "tarih") {
    url += "?tarih=" + document.getElementById("spotTarihFiltre").value;
  }
  window.location.href = url;
}
