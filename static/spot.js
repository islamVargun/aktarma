/* ═══════════════════════════════════════════
   SPOT RAPORU — spot.js (Client-Side Parser)
   ═══════════════════════════════════════════ */

const KAMYONET_PLAKALAR = [
    "34CRK935", "15ABE160", "01AAS278", "34MLR009", "34ETN296",
    "35BMD129", "34MTC263", "34HS3526", "34MYC377", "34TA8984",
    "34MCD666", "34MEG176", "34JC9704", "34KJ5964"
];

let parsedSpotData = [];

window.onload = function () {
    const inputArea = document.getElementById("spot-input");
    if (inputArea) {
        inputArea.addEventListener("input", processSpotData);
    }
    if (window.lucide) lucide.createIcons();
};

function formatNavlun(val) {
    return "₺ " + Number(val).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getTodayFormatted() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    return dd + "." + mm;
}

function processSpotData() {
    const rawData = document.getElementById("spot-input").value;
    const lines = rawData.split("\n");
    parsedSpotData = [];

    const todayStr = getTodayFormatted();
    const currentTM = (typeof KULLANICI_TM !== 'undefined' && KULLANICI_TM) ? KULLANICI_TM : "SAMANDIRA TM";

    for (let line of lines) {
        if (!line.trim()) continue;
        const cols = line.split("\t");

        // "SPOT" kelimesi var mı kontrol et
        let isSpot = false;
        for (let col of cols) {
            if (col.trim().toUpperCase() === "SPOT") {
                isSpot = true;
                break;
            }
        }

        if (!isSpot) continue;

        // Sütun indeksleri (Excel'deki tahmini sıralamaya göre)
        // 0: Sefer Adı, 1: İrsaliye, 4: Plaka, 6: Firma
        let sefer = cols[0] ? cols[0].trim() : "";
        let irsaliye_raw = cols[1] ? cols[1].trim() : "";
        let plaka = cols.length > 4 ? cols[4].trim() : "";
        let firma = cols.length > 6 ? cols[6].trim() : "";

        if (firma === "-") firma = "";

        // Varış bul
        let varis = "";
        let sefer_parts = sefer.split("_");
        if (sefer_parts.length >= 2) {
            let p2 = sefer_parts[1].trim();
            if (p2.includes("(")) {
                varis = p2.split("(")[0].trim().toUpperCase();
            } else {
                varis = p2.toUpperCase();
            }
        }

        // Araç tipi
        let aracTipi = "PANELVAN";
        let plaka_clean = plaka.replace(/\s+/g, "").toUpperCase();
        if (KAMYONET_PLAKALAR.includes(plaka_clean)) {
            aracTipi = "KAMYONET";
        }

        // Navlun
        let navlun = 0;
        let varisCheck = varis.toUpperCase();
        if (varisCheck.includes("EBEBEK")) {
            navlun = 3750;
        } else if (varisCheck.includes("MANGO") || varisCheck.includes("GEBZE")) {
            navlun = (aracTipi === "KAMYONET") ? 3450 : 3200;
        } else {
            navlun = (aracTipi === "KAMYONET") ? 2750 : 2500;
        }

        // İrsaliye formati
        let irsaliye_clean = irsaliye_raw.replace(/\D/g, "");
        if (irsaliye_clean.length >= 7) {
            irsaliye_clean = irsaliye_clean.substring(irsaliye_clean.length - 7);
        }
        let formatted_irsaliye = irsaliye_clean ? "HJI202600" + irsaliye_clean : "";

        parsedSpotData.push({
            bolge: "İSTANBUL ANADOLU",
            tarih: todayStr,
            gorev: "RİNG",
            cikis: currentTM,
            ugrama: "YOK",
            varis: varis,
            plaka: plaka_clean,
            aracTipi: aracTipi,
            navlun: navlun,
            seferTipi: "SEFERLİK",
            ekMaliyet: 0,
            ekMaliyetNedeni: "YOK",
            toplam: navlun,
            firma: firma,
            irsaliye: formatted_irsaliye
        });
    }

    renderTable();
}

function renderTable() {
    const tbody = document.getElementById("spotTabloGovdesi");
    const countSpan = document.getElementById("spot-kayit-sayisi");
    const navlunSpan = document.getElementById("spot-toplam-navlun");
    const copyBtn = document.getElementById("btn-kopyala");
    const excelBtn = document.getElementById("btn-excel");

    tbody.innerHTML = "";

    if (parsedSpotData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="15" style="color: var(--text-secondary); padding: 50px;">Girilen metinde "SPOT" kaydı bulunamadı.</td></tr>`;
        countSpan.innerText = "0";
        navlunSpan.innerText = "₺0,00";
        copyBtn.style.display = "none";
        excelBtn.style.display = "none";
        return;
    }

    let totalNavlun = 0;
    let copyTextStr = "BÖLGE\tTARİH\tGÖREV\tÇIKIŞ\tUĞRAMA\tVARIŞ\tPLAKA\tARAÇ TİPİ\tNAVLUN\tSEFER TİPİ\tEK MALİYET\tEK MALİYET NEDENİ\tTOPLAM\tTEDARİKÇİ FİRMA\tİRSALİYE\n";

    parsedSpotData.forEach((v) => {
        totalNavlun += v.navlun;
        const navlunFormatted = formatNavlun(v.navlun);

        // Kopyalama için TSV formatında satır
        copyTextStr += `${v.bolge}\t${v.tarih}\t${v.gorev}\t${v.cikis}\t${v.ugrama}\t${v.varis}\t${v.plaka}\t${v.aracTipi}\t${navlunFormatted}\t${v.seferTipi}\t₺ 0,00\t${v.ekMaliyetNedeni}\t${navlunFormatted}\t${v.firma}\t${v.irsaliye}\n`;

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
            <td class="td-money">${navlunFormatted}</td>
            <td>${v.seferTipi}</td>
            <td>₺ 0,00</td>
            <td>${v.ekMaliyetNedeni}</td>
            <td class="td-money">${navlunFormatted}</td>
            <td>${v.firma}</td>
            <td class="td-irsaliye">${v.irsaliye}</td>
        `;
        tbody.appendChild(tr);
    });

    countSpan.innerText = parsedSpotData.length;
    navlunSpan.innerText = formatNavlun(totalNavlun);

    document.getElementById("hidden-copy-area").value = copyTextStr;

    copyBtn.style.display = "inline-flex";
    excelBtn.style.display = "inline-flex";

    if (window.lucide) lucide.createIcons();
}

function copyTableText() {
    const copyArea = document.getElementById("hidden-copy-area");
    copyArea.select();
    document.execCommand("copy");

    const btn = document.getElementById("btn-kopyala");
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="check" style="width:14px; height:14px;"></i> Kopyalandı!`;
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        if (window.lucide) lucide.createIcons();
    }, 2000);
}

function downloadExcel() {
    if (parsedSpotData.length === 0) return;

    const btn = document.getElementById("btn-excel");
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="loader" style="width:14px; height:14px;"></i> Hazırlanıyor...`;
    if (window.lucide) lucide.createIcons();

    fetch("/api/spot_excel_generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedSpotData),
    })
        .then(response => {
            if (!response.ok) throw new Error("Excel üretilemedi");
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;

            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();

            a.download = `Spot_Rapor_${dd}.${mm}.${yyyy}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(err => {
            alert("Hata oluştu: " + err);
        })
        .finally(() => {
            btn.innerHTML = originalHTML;
            if (window.lucide) lucide.createIcons();
        });
}
