// assets/js/peta.js
(function () {
  function initMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    // reset loading text
    const loadingEl = mapEl.querySelector('.map-loading');
    if (loadingEl) loadingEl.remove();

    // Setup map
    const map = L.map('map', { fullscreenControl: true }).setView([-4.5, 119.5], 7);
    map.attributionControl.setPrefix('');

    // Basemaps
    const basemaps = {
      "OSM": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "🗺️ <strong>Wilayah Aksara Lontara</strong> © sipakalebbi.id"
      }),
      "Satelit": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "🗺️ <strong>Wilayah Aksara Lontara</strong> © sipakalebbi.id"
      })
    };

    basemaps["Satelit"].addTo(map);

    const layerLontara = L.layerGroup();

    // Warna wilayah (salin dari file lama)
    const warnaWilayah = {
      "Bantaeng": "#e6194b",
      "Barru": "#3cb44b",
      "Bone": "#ffe119",
      "Bulukumba": "#4363d8",
      "Enrekang": "#f58231",
      "Gowa": "#911eb4",
      "Jeneponto": "#46f0f0",
      "Kepulauan Selayar": "#f032e6",
      "Luwu": "#bcf60c",
      "Luwu Timur": "#fabebe",
      "Luwu Utara": "#008080",
      "Maros": "#e6beff",
      "Pangkajene dan Kepulauan": "#9a6324",
      "Parepare": "#808000",
      "Pinrang": "#ffd700",
      "Sidenreng Rappang": "#000075",
      "Sinjai": "#ff7f50",
      "Soppeng": "#00ced1",
      "Takalar": "#ff1493",
      "Tana Toraja": "#7fffd4",
      "Toraja Utara": "#da70d6",
      "Wajo": "#ff4500",
      "Palopo": "#20b2aa",
      "Makassar": "#b22222"
    };

    // Data singkat (salin/padatkan dari yang lama)
    const adatLontara = {
      "Bone": { untuk: "Aksara digunakan untuk menulis adat (ade’), silsilah, dan hukum", sejarah: "Sekitar tahun 1300–1400 M, Lokasi awal munculnya bentuk aksara Bugis tertua, Ditemukan naskah silsilah tua di wilayah sungai Walannae–Cenrana", tahun: "Abad ke-14", daerah: "Walannae–Cenrana (soppeng - bone)" },
      "Wajo": { untuk: "Menulis aturan federasi Tellumpoccoe", sejarah: "Sekitar 1500–1550 M, Penyebaran oleh elite adat (arung) dalam sistem pemerintahan kolektif", tahun: "Abad ke-15 hingga 16", daerah: "Wajo" },
      "Soppeng": { untuk: "Digunakan sebagai alat tulis silsilah kerajaan", sejarah: "Bersamaan dengan Bone dan Wajo, Sekitar Abad ke 15-16, Menjadi bagian dari penguatan identitas Bugis melalui naskah tulis", tahun: "Abad ke-15", daerah: "Soppeng" },
      "Gowa": { untuk: "Digunakan di istana Raja Gowa IX: Karaeng Tumapa’risi’ Kallonna", sejarah: "Sekitar 1510–1546 M, Daeng Pamatte menyusun Lontara Makassar menjadi 19 huruf", tahun: "Abad ke-16", daerah: "Gowa" },
      "Luwu": { untuk: "Kitab hukum dan teks epik seperti Sureq I La Galigo", sejarah: "Salah satu kerajaan tertua di Sulawesi", tahun: "Abad ke-16", daerah: "Luwu" },
      "Barru": { untuk: "Aksara digunakan dalam kontrak dagang", sejarah: "Terlibat dalam pelayaran dan perdagangan antar pulau", tahun: "Abad ke-16 hingga 17", daerah: "Wilayah Bugis pesisir (barru, sinjai, bulukumba)" }
    };

    const cleanName = raw => (raw || "").replace(/^Kabupaten\s+/i, "").replace(/^Kota\s+/i, "").trim();

    // Load GeoJSON (path relatif ke index.html)
    fetch("sulsel.json")
      .then(res => {
        if (!res.ok) throw new Error('Gagal ambil GeoJSON');
        return res.json();
      })
      .then(data => {
        const wilayahSet = new Set();

        const geojsonLontara = L.geoJSON(data, {
          style: feature => {
            const provRaw = feature.properties.province || "";
            const prov = cleanName(provRaw);
            wilayahSet.add(prov);
            return {
              color: "#fff",
              weight: 1,
              fillColor: warnaWilayah[prov] || "#bbb",
              fillOpacity: 0.6
            };
          },
          onEachFeature: (feature, layer) => {
            const prov = cleanName(feature.properties.province || "");
            const info = adatLontara[prov];

            let content = "";
            if (info) {
              content = `
                <h2 style="color:#2F6E4C; margin-bottom:6px;">${prov}</h2>
                <p><strong>Tahun:</strong> ${info.tahun}</p>
                <p><strong>Sejarah Singkat:</strong> ${info.sejarah}</p>
                <p><strong>Daerah Persebaran:</strong> ${info.daerah}</p>
                <p><strong>Digunakan Untuk:</strong> ${info.untuk}</p>
              `;
            } else {
              content = `<div class="popup-no-close"><strong>${prov}</strong></div>`;
            }

            layer.bindPopup(content);

            layer.on("click", e => {
              map.fitBounds(layer.getBounds(), { padding: [20, 20] });
              setTimeout(() => layer.openPopup(e.latlng), 300);
            });

            layer.on("mouseover", () => layer.setStyle({ fillOpacity: 0.9 }));
            layer.on("mouseout", () => layer.setStyle({ fillOpacity: 0.6 }));
          }
        }).addTo(layerLontara);

        layerLontara.addTo(map);
        if (geojsonLontara.getBounds && !geojsonLontara.getBounds().isEmpty) {
          map.fitBounds(geojsonLontara.getBounds(), { padding: [20, 20] });
        }

        // Legend
        const legend = L.control({ position: "bottomright" });
        legend.onAdd = () => {
          const div = L.DomUtil.create("div", "info legend");
          let html = `
            <div style="
              background: var(--background-color, #fff);
              padding: 6px 10px;
              border-radius: 6px;
              box-shadow: 0 0 5px rgba(0,0,0,0.15);
              font-size: 10px;
              max-height: 90px;
              overflow-y: auto;
              max-width: 200px;
              margin: 6px;
              color: var(--default-color, #222);
              -webkit-overflow-scrolling: touch;
              word-wrap: break-word;
              white-space: normal;
            ">
              <strong style="font-size: 11px; color: var(--heading-color, #2F6E4C);">Keterangan Wilayah:</strong>
              <div style="margin-top: 4px;">
                ${Object.keys(warnaWilayah).map(w => `
                  <div style="margin:2px 0;">
                    <i style="background:${warnaWilayah[w] || '#bbb'}; width:9px; height:9px; display:inline-block; margin-right:6px; border-radius:10px;"></i>${w}
                  </div>`).join("")}
              </div>
            </div>
          `;
          div.innerHTML = html;
          return div;
        };
        legend.addTo(map);

        // Prevent legend intercept scroll on mobile
        setTimeout(() => {
          const legendElement = document.querySelector('.info.legend');
          if (legendElement) {
            L.DomEvent.disableScrollPropagation(legendElement);
            L.DomEvent.disableClickPropagation(legendElement);
          }
        }, 500);

      })
      .catch(err => {
        console.error("Gagal memuat GeoJSON:", err);
        const mapEl = document.getElementById('map');
        if (mapEl) mapEl.innerHTML = '<div style="padding:20px;">Gagal memuat peta. Pastikan file <code>sulsel.json</code> tersedia.</div>';
      });

    // Popup close-button logic
    map.on("popupopen", function (e) {
      const popup = e.popup;
      const container = popup._container;
      if (!container) return;
      const content = popup.getContent ? popup.getContent() : '';
      const closeBtn = container.querySelector(".leaflet-popup-close-button");
      if (content && content.includes("popup-no-close")) {
        if (closeBtn) closeBtn.style.display = "none";
      } else {
        if (closeBtn) closeBtn.style.display = "";
      }
    });

    L.control.layers(basemaps, { "Wilayah Aksara Lontara": layerLontara }).addTo(map);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }
})();
