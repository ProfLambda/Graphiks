// --- Helpers ---
const EXCLUDED_AXES = new Set(["ref"]);
const EXCLUDED_CONTAINS = ["nombre de réponse"];
const NAME_COL_CANDIDATES = ["nom", "classe"];
const META_SHOW = ["section", "classe", "nombre de réponses"];
const SCALE_MAX = 3;

let intitulesMap = {};

function parseCSV(text, delimiter = ";") {
	text = text.replace(/\r\n?|\n/g, "\n").trim();
	const lines = text.split("\n");
	if (!lines.length) return { headers: [], rows: [] };
	const headers = lines[0].split(delimiter).map((h) => h.trim());
	const rows = lines
		.slice(1)
		.map((line) => line.split(delimiter).map((v) => v.trim()));
	return { headers, rows };
}

function detectNameCol(headers) {
	const lower = headers.map((h) => h.toLowerCase());
	for (const target of NAME_COL_CANDIDATES) {
		const idx = lower.indexOf(target);
		if (idx !== -1) return headers[idx];
	}
	return headers[0];
}

function isExcludedAxis(colName) {
	const lc = colName.toLowerCase();
	if (EXCLUDED_AXES.has(lc)) return true;
	return EXCLUDED_CONTAINS.some((kw) => lc.includes(kw));
}

function toNumber(fr) {
	if (fr === "" || fr == null) return NaN;
	const s = fr.replace(/\s/g, "").replace(",", ".");
	const n = Number(s);
	return isNaN(n) ? NaN : n;
}

function prepareData(headers, rows) {
	const nameCol = detectNameCol(headers);
	const numericCandidates = headers.filter(
		(h) => h !== nameCol && !isExcludedAxis(h)
	);
	const numericCols = numericCandidates.filter((h) =>
		rows.some((r) => !isNaN(toNumber(r[headers.indexOf(h)])))
	);
	const metaCols = headers.filter((h) => META_SHOW.includes(h.toLowerCase()));
	const records = rows.map((r) => {
		const rec = { name: r[headers.indexOf(nameCol)] || "" };
		rec.scores = numericCols.map((h) => {
			const v = r[headers.indexOf(h)];
			const n = toNumber(v);
			return isNaN(n) ? 0 : n;
		});
		metaCols.forEach((m) => (rec[m] = r[headers.indexOf(m)]));
		return rec;
	});
	return { labels: numericCols, records };
}

function colorForIndex(i) {
	const base = [
		"rgba(75, 192, 192, 0.4)",
		"rgba(153, 102, 255, 0.4)",
		"rgba(255, 159, 64, 0.4)",
		"rgba(54, 162, 235, 0.4)",
		"rgba(255, 99, 132, 0.4)",
		"rgba(255, 205, 86, 0.4)",
		"rgba(201, 203, 207, 0.4)",
	];
	return base[i % base.length];
}
function borderForIndex(i) {
	const base = [
		"rgb(75, 192, 192)",
		"rgb(153, 102, 255)",
		"rgb(255, 159, 64)",
		"rgb(54, 162, 235)",
		"rgb(255, 99, 132)",
		"rgb(255, 205, 86)",
		"rgb(201, 203, 207)",
	];
	return base[i % base.length];
}

// Case-insensitive getter on record keys
function val(rec, keyLower) {
	for (const k in rec) if (k.toLowerCase() === keyLower) return rec[k];
	return undefined;
}

// --- Initialisation de Chart.js ---
// Enregistrer le plugin `datalabels` globalement pour tous les graphiques
// Cela suppose que `Chart` et `ChartDataLabels` sont disponibles globalement
// via les balises <script> dans `index.html`.
try {
	Chart.register(ChartDataLabels);
} catch (e) {
	console.error(
		"ChartDataLabels n'a pas pu être enregistré. Assurez-vous que le plugin est bien chargé.",
		e
	);
}
function render(data) {
	const { labels, records } = data;
	const grid = document.getElementById("grid");
	grid.innerHTML = "";
	records.forEach((rec, idx) => {
		const card = document.createElement("div");
		card.className = "card";
		const title = document.createElement("h3");
		title.textContent = rec.name || "(Nom manquant)";
		card.appendChild(title);

		// --- Ligne sous le nom : Classe (+ nombre de personnes) ---
		const sub = document.createElement("div");
		sub.className = "subline";
		const classe = val(rec, "classe");
		const nbp = val(rec, "nombre de réponses");
		if (classe) {
			sub.textContent = "" + classe + (nbp ? " (" + nbp + " rép.)" : "");
		}
		card.appendChild(sub);

		const canvas = document.createElement("canvas");
		canvas.id = "chart_" + idx;
		card.appendChild(canvas);

		grid.appendChild(card);

		const ctx = canvas.getContext("2d");
		new Chart(ctx, {
			type: "radar",
			data: {
				labels,
				datasets: [
					{
						label: rec.name,
						data: rec.scores,
						backgroundColor: colorForIndex(idx),
						borderColor: borderForIndex(idx),
						borderWidth: 2,
						pointRadius: 3,
						pointHoverRadius: 5,
						pointBackgroundColor: borderForIndex(idx),
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					r: {
						suggestedMin: 0,
						suggestedMax: 3,
						ticks: { stepSize: 1 },
					},
				},
				plugins: {
					legend: { display: false },
					tooltip: {
						position: "nearest",
						callbacks: {
							label: (ctx) => {
								const label = labels[ctx.dataIndex];
								const intitule = intitulesMap[label];
								const value = ctx.raw;
								return `${intitule}: ${value}`;
							},
						},
					},
					datalabels: {
						backgroundColor: function (context) {
							return context.dataset.borderColor;
						},
						color: "white",
						borderRadius: 4,
						font: {
							weight: "bold",
						},
						padding: 4,
						formatter: function (value) {
							return value.toFixed(1);
						},
					},
					// datalabels: {
					// 	anchor: "end",
					// 	align: "top",
					// 	offset: 8,
					// 	backgroundColor: "rgba(255, 255, 255, 0.8)",
					// 	borderColor: "rgba(0, 0, 0, 0.1)",
					// 	borderWidth: 1,
					// 	borderRadius: 4,
					// 	color: "black",
					// 	font: {
					// 		size: 10,
					// 		weight: "bold",
					// 	},
					// 	formatter: (value) => value.toFixed(1),
					// },
				},
			},
		});
	});
}

async function loadAndRender() {
	try {
		const [notesText, intitulesText] = await Promise.all([
			fetch("graphiks_csv_example.csv").then((res) => res.text()),
			fetch("graphiks_intitules.csv").then((res) => res.text()),
		]);

		const { rows: intitulesRows } = parseCSV(intitulesText);
		intitulesMap = Object.fromEntries(intitulesRows);

		const { headers, rows } = parseCSV(notesText);
		const data = prepareData(headers, rows);
		render(data);
	} catch (error) {
		console.error("Erreur lors du chargement des données CSV", error);
		const grid = document.getElementById("grid");
		grid.innerHTML =
			"Impossible de charger les données. Vérifiez la console pour plus de détails.";
	}
}

function loadCSVAndRender(text) {
	const { headers, rows } = parseCSV(text);
	const data = prepareData(headers, rows);
	render(data);
}

// --- Drag & Drop & Click to upload ---
const drop = document.getElementById("drop");
const fileInput = document.getElementById("file");

drop.addEventListener("click", () => fileInput.click());
drop.addEventListener("dragover", (e) => {
	e.preventDefault();
	drop.classList.add("dragover");
});
drop.addEventListener("dragleave", () => drop.classList.remove("dragover"));
drop.addEventListener("drop", (e) => {
	e.preventDefault();
	drop.classList.remove("dragover");
	const file = e.dataTransfer.files[0];
	if (file) readFile(file);
});
fileInput.addEventListener("change", () => {
	const file = fileInput.files[0];
	if (file) readFile(file);
});

function readFile(file) {
	const reader = new FileReader();
	reader.onload = (e) => {
		const text = e.target.result;
		loadCSVAndRender(text);
	};
	reader.readAsText(file, "utf-8");
}

// Initial render
loadAndRender();
