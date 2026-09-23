// Concept of Digital Twin: page logic, content panels and the two live physics labs.
// Plain JavaScript, no libraries. Everything runs in the browser.
'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

/* ----------------------------------------------------------------- video chapters */
(() => {
  const v = $('#vid'), btns = $$('#chapters button');
  btns.forEach(b => b.addEventListener('click', () => { v.currentTime = parseFloat(b.dataset.t); v.play().catch(() => {}); }));
  v.addEventListener('timeupdate', () => {
    let on = 0; btns.forEach((b, i) => { if (v.currentTime >= parseFloat(b.dataset.t) - 0.05) on = i; });
    btns.forEach((b, i) => b.classList.toggle('on', i === on && v.currentTime > 0));
  });
})();

/* ----------------------------------------------------------------- section nav highlight */
(() => {
  const links = $$('.nav a.l'), map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { links.forEach(l => l.classList.remove('on')); const a = map.get(e.target.id); if (a) a.classList.add('on'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]').forEach(s => io.observe(s));
})();

/* ----------------------------------------------------------------- 1. three parts */
const PARTS = {
  phys: `<h3>The physical object</h3><p>The real thing in the real world: a wind turbine, a bridge, a pump, a production line, even a city district or a human heart. It is always a <b>specific</b> instance with its own serial number, location and history. Two identical turbines leave the factory; after ten years in different winds they are no longer identical, and each needs its own twin.</p><p class="muted small">In the lab below, the physical object is a 40 m bridge whose true stiffness the model cannot see directly.</p>`,
  conn: `<h3>The connection</h3><p>The part most often forgotten, and the part that makes a twin a twin. It runs in <b>two directions</b>:</p><ul><li><b class="cyan">Object → model:</b> sensor data, inspection results, maintenance records and operating settings keep the model up to date.</li><li><b class="green">Model → object:</b> predictions, alarms, set-points and decisions change how the object is run or serviced.</li></ul><p>Without the connection there are two separate things, a machine and a model, that slowly drift apart.</p>`,
  virt: `<h3>The virtual model</h3><p>Not only a 3D shape. A useful virtual model combines:</p><ul><li><b>Geometry and structure</b>: CAD, bill of materials, as-built dimensions.</li><li><b>Behaviour</b>: physics equations (structural, thermal, fluid, electrical) and/or data-driven models learned from measurements.</li><li><b>State and history</b>: current condition, past loads, repairs, and the uncertainty in all of these.</li></ul><p>The model is only as good as its fit to <i>this</i> object, which is why it must be recalibrated with data over time.</p>`
};
(() => {
  const show = k => { $$('.part').forEach(p => p.classList.toggle('on', p.dataset.part === k)); $('#partDetail').innerHTML = PARTS[k]; };
  $$('.part').forEach(p => p.addEventListener('click', () => show(p.dataset.part)));
  show('phys');
})();

/* ----------------------------------------------------------------- 2. technology stack */
const LAYERS = [
  ['7', 'Decisions & actuation', 'the loop closes', '#46d69b', 'Where the twin changes the real world.', ['Control set-points sent to the machine (pitch, speed, temperature)', 'Work orders and maintenance schedules', 'Operator dashboards, alarms and recommendations', 'Fully automatic action only where it is safe and certified'], 'A turbine twin detects that the nacelle is misaligned with the wind and sends a yaw correction.'],
  ['6', 'Visualisation', 'people see the state', '#b18cff', 'Makes the twin understandable to people who must act on it.', ['3D models, colour maps of stress or temperature', 'Augmented reality overlays for field technicians', 'KPI dashboards linked to business value'], 'A technician points a tablet at a gearbox and sees its predicted bearing temperature over the next week.'],
  ['5', 'Models & analytics', 'physics + data', '#3ad0f0', 'The "brain" of the twin: models that explain and predict.', ['Physics-based models: finite elements, CFD, multibody dynamics', 'Reduced-order models (ROM) that run in real time', 'Machine learning, anomaly detection, remaining useful life', 'Hybrid models such as physics-informed neural networks (PINNs)', 'State estimation and calibration: Kalman filters, Bayesian updating'], 'A reduced-order model of blade loads runs 1000 times faster than the full simulation, so it can run on every new data point.'],
  ['4', 'Data platform', 'store, align, govern', '#ffb84d', 'Keeps all data about the object together, in context and over time.', ['Time-series databases and data lakes', 'Asset identity: which data belongs to which serial number', 'The digital thread: design, build and service records linked together', 'Data quality, security and access rights'], 'Ten years of 10-minute SCADA records, every inspection photo and every part replacement, all linked to one turbine ID.'],
  ['3', 'Connectivity', 'move data reliably', '#7fb3f0', 'Moves data from the object to the platform and decisions back.', ['Industrial protocols: OPC UA, MQTT', 'Networks: fibre, 4G/5G, satellite for remote sites', 'Latency and bandwidth decide what can be done centrally'], 'An offshore wind farm sends summaries over a fibre link in the export cable and streams high-rate data only when needed.'],
  ['2', 'Edge computing', 'process near the source', '#9aa9bb', 'Processes raw data close to the machine before sending it on.', ['Filtering, compression and feature extraction (e.g. vibration spectra)', 'Fast local control and safety functions', 'Keeps working when the connection drops'], 'A vibration sensor samples at 25 kHz; the edge unit sends only the bearing fault frequencies every 10 minutes.'],
  ['1', 'Sensing', 'measure the object', '#c9d3de', 'The twin\'s senses. What is not measured cannot be tracked.', ['IoT sensors: strain, vibration, temperature, pressure, current', 'Control-system data (SCADA, PLC)', 'Inspections, drones, lidar and camera images', 'Manual records: repairs, part changes'], 'Strain gauges on a bridge girder; accelerometers in a turbine nacelle; the wind sensor on the roof.']
];
(() => {
  const box = $('#layers');
  box.innerHTML = LAYERS.map((l, i) => `<button class="layer" data-i="${i}"><i style="background:${l[3]}22;color:${l[3]}">${l[0]}</i><span>${l[1]}<small>${l[2]}</small></span></button>`).join('');
  const show = i => {
    const [n, name, , col, what, items, ex] = LAYERS[i];
    $$('.layer').forEach(b => b.classList.toggle('on', +b.dataset.i === i));
    $('#layerDetail').innerHTML = `<div class="kicker" style="color:${col}">Layer ${n}</div><h3>${name}</h3><p>${what}</p><ul>${items.map(x => `<li>${x}</li>`).join('')}</ul><p class="note small"><b>Example.</b> ${ex}</p>`;
  };
  $$('.layer').forEach(b => b.addEventListener('click', () => show(+b.dataset.i)));
  show(2);
})();

/* ----------------------------------------------------------------- 3. model / shadow / twin */
const MST = {
  model: { fwd: 'manual', back: 'manual', title: 'Digital model', col: '#93a2b4', text: 'Data moves between object and model only <b>by hand</b>: an engineer exports measurements, types them into the model, reads the result and decides what to do. A change in the object does not change the model, and the model does not change the object. <br><span class="muted">Examples: a CAD model, a design-stage finite element model, a spreadsheet updated monthly. A Phase 0 prototype model sits here in the strict classification.</span>' },
  shadow: { fwd: 'auto', back: 'manual', title: 'Digital shadow', col: '#ffb84d', text: 'Data flows <b>automatically from object to model</b>, so the model follows the object as it changes. But any action still goes back through a person. <br><span class="muted">Examples: condition-monitoring dashboards, most "digital twins" in industry today, process monitoring tools that mirror a production line.</span>' },
  twin: { fwd: 'auto', back: 'auto', title: 'Digital twin', col: '#3ad0f0', text: 'Data flows <b>automatically in both directions</b>. The model follows the object, and the model\'s conclusions flow back and act on the object: set-points, control changes, schedules. A person may still approve the action, but the loop is designed in. <br><span class="muted">Examples: a turbine controller retuned by its twin, a bridge load limit set from calibrated stiffness (see the live lab).</span>' }
};
(() => {
  const svg = $('#mstSvg');
  let k = 'model', t0 = performance.now();
  const turb = (x, col, wire) => {
    const f = wire ? 'none' : col;
    let g = `<g transform="translate(${x} 222)"><path d="M-5 0 L5 0 L3 -120 L-3 -120 Z" fill="${f}" stroke="${col}" stroke-width="1.5"/>`;
    for (let i = 0; i < 3; i++) g += `<path d="M0 -3 C 6 -18, 4 -55, 1 -72 L-1 -72 C -3 -50, -5 -18, 0 -3 Z" fill="${f}" stroke="${col}" stroke-width="1.5" transform="translate(0 -124) rotate(${i * 120 + ((performance.now() / 20) % 360)})"/>`;
    return g + `<circle cy="-124" r="5" fill="${wire ? '#121c2a' : f}" stroke="${col}" stroke-width="1.5"/></g>`;
  };
  const arrowL = (x1, x2, y, col, dash) => { const d = x2 > x1 ? 1 : -1; return `<line x1="${x1}" y1="${y}" x2="${x2 - d * 8}" y2="${y}" stroke="${col}" stroke-width="3" ${dash ? 'stroke-dasharray="9 8"' : ''}/><path d="M${x2} ${y} l${-d * 14} -7 v14 z" fill="${col}"/>`; };
  function draw() {
    const m = MST[k], ph = ((performance.now() - t0) / 1600) % 1;
    let s = turb(150, '#c9d3de', false) + turb(750, '#3ad0f0', true);
    s += `<text x="150" y="252" fill="#93a2b4" font-size="15" text-anchor="middle">physical object</text><text x="750" y="252" fill="#3ad0f0" font-size="15" text-anchor="middle">virtual model</text>`;
    const fA = m.fwd === 'auto', bA = m.back === 'auto';
    s += arrowL(250, 650, 95, fA ? '#3ad0f0' : '#6b7a8c', !fA) + arrowL(650, 250, 165, bA ? '#46d69b' : '#6b7a8c', !bA);
    s += `<text x="450" y="80" fill="${fA ? '#3ad0f0' : '#93a2b4'}" font-size="16" text-anchor="middle" font-weight="700">${fA ? 'sensor data, automatic' : 'data copied by hand'}</text>`;
    s += `<text x="450" y="195" fill="${bA ? '#46d69b' : '#93a2b4'}" font-size="16" text-anchor="middle" font-weight="700">${bA ? 'decisions, automatic' : 'decisions by a person'}</text>`;
    if (fA) s += `<circle cx="${250 + 400 * ph}" cy="95" r="7" fill="#7ff3ff"/>`;
    else s += `<g transform="translate(${250 + 400 * ((ph * 0.35) % 1)} 95)"><rect x="-10" y="-13" width="20" height="26" rx="3" fill="#93a2b4"/></g>`;
    if (bA) s += `<circle cx="${650 - 400 * ph}" cy="165" r="7" fill="#9ff0c8"/>`;
    s += `<text x="450" y="238" fill="${m.col}" font-size="22" text-anchor="middle" font-weight="800">${m.title}</text>`;
    svg.innerHTML = s;
    requestAnimationFrame(draw);
  }
  const show = kk => { k = kk; $$('#mstSeg button').forEach(b => b.classList.toggle('on', b.dataset.k === k)); $('#mstText').innerHTML = `<h3 style="color:${MST[k].col}">${MST[k].title}</h3><p>${MST[k].text}</p>`; };
  $$('#mstSeg button').forEach(b => b.addEventListener('click', () => show(b.dataset.k)));
  show('model'); requestAnimationFrame(draw);
})();

/* ----------------------------------------------------------------- 7. lifecycle */
const PHASES = [
  { n: 0, name: 'Design', form: 'Digital Twin Prototype (DTP)', c: '#b18cff', short: 'physics before hardware',
    what: 'The twin is born before the object. It holds the design and the analyses that prove the design works: geometry, materials, loads and the equations that link them.',
    data: ['Laws of physics and material constants', 'CAD geometry and requirements', 'Standards and design load cases (e.g. IEC 61400-1 for wind turbines)', 'Test data from earlier products'],
    methods: ['Finite element and CFD analysis', 'Multibody dynamics, control design', 'What-if studies and design optimisation', 'Virtual testing and virtual commissioning'],
    value: ['Fewer physical prototypes', 'Problems found when changes are cheap', 'Faster certification'],
    ex: 'Engineers load a virtual 126 m rotor with a 50-year gust, turbulence and a grid fault at the same moment, and resize the blade root long before a mould is made.' },
  { n: 1, name: 'Build', form: 'Digital thread', c: '#ffb84d', short: 'as-designed becomes as-built',
    what: 'The design data drive manufacturing and installation. Every part gets an identity, and what was actually built is recorded against what was designed. Deviations update the model.',
    data: ['Bills of materials and work instructions', 'Quality measurements per part and serial number', 'Supplier and batch records', 'Installation and commissioning results'],
    methods: ['Digital thread linking design, production and service data', 'Virtual commissioning of control software', 'Model update from as-built measurements'],
    value: ['Traceability of every part', 'The twin starts life matching the real object', 'Less rework on site'],
    ex: 'Each blade is weighed and its fibre layup scanned. A blade 40 kg heavier at the tip is recorded, and the twin rebalances the rotor model before the turbine ever turns.' },
  { n: 2, name: 'Operate', form: 'Digital Twin Instance (DTI)', c: '#3ad0f0', short: 'one unit, live data',
    what: 'The object is running and the connection is live. Sensor data flow into the twin, which compares what it measures with what physics expects. The gap, the residual, reveals faults and wear. Decisions flow back.',
    data: ['Sensors and control-system data (SCADA)', 'Weather and operating context', 'Inspections and maintenance records'],
    methods: ['Edge computing, 5G and cloud platforms', 'State estimation, Kalman filtering, calibration', 'Anomaly detection and remaining-useful-life prediction', 'Reduced-order models running in real time'],
    value: ['Predictive instead of reactive maintenance', 'Higher output and availability', 'Longer safe life'],
    ex: 'The main-bearing temperature of turbine 0427 runs 4 °C above what the twin expects for today\'s wind. Vibration confirms early wear; the repair is booked for next week\'s calm spell.' },
  { n: 3, name: 'Fleet', form: 'Digital Twin Aggregate (DTA)', c: '#46d69b', short: 'learning across many',
    what: 'Many instance twins are pooled. Patterns that are invisible in one unit become clear across hundreds: which designs fail, in which conditions, and why.',
    data: ['All instance twins of a product family', 'Failure and repair statistics', 'Site and climate data'],
    methods: ['Fleet analytics and machine learning', 'Reliability statistics (e.g. Weibull analysis)', 'Benchmarking units against each other', 'Spare-parts and service planning'],
    value: ['Better decisions for every unit, including new ones', 'Evidence for design changes', 'Lower cost of ownership across the fleet'],
    ex: 'Across 200 turbines, one bearing type wears 30 % faster, but only in turbines that stand in the wake of a neighbour. The fleet twin changes the control strategy for all of them.' },
  { n: 4, name: 'Retire', form: 'End of life and feedback', c: '#c9d3de', short: 'lessons shape the next design',
    what: 'The object reaches the end of its life. The twin supports the decision to extend, repower or decommission, and guides reuse and recycling. Its history becomes knowledge for the next prototype twin: the loop closes back to Phase 0.',
    data: ['Full life history of loads and damage', 'Material and component passports', 'Decommissioning and recycling records'],
    methods: ['Remaining-life assessment for life extension', 'Circular-economy planning: reuse, remanufacture, recycle', 'Feeding measured loads back into design standards'],
    value: ['Safe life extension instead of early scrapping', 'Better recycling of materials such as blade composites', 'The next design starts from real data, not assumptions'],
    ex: 'After 25 years, the twin shows the tower has used only 70 % of its fatigue life. The turbine gets five more years, and the measured loads make the next tower design lighter.' }
];
(() => {
  $('#timeline').innerHTML = PHASES.map(p => `<button class="ph" data-n="${p.n}" style="--c:${p.c}"><span class="dot">${p.n}</span><span class="pn">Phase ${p.n}</span><span class="pt">${p.name}</span><span class="ps">${p.short}</span></button>`).join('');
  const li = a => `<ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const show = n => {
    const p = PHASES[n];
    $$('.ph').forEach(b => b.classList.toggle('on', +b.dataset.n === n));
    const d = $('#phaseDetail'); d.style.setProperty('--c', p.c);
    d.innerHTML = `<div class="kicker" style="color:${p.c}">Phase ${p.n} · ${p.name}</div><h3>${p.form}</h3><p>${p.what}</p>
      <div class="cols"><div><h4>Data it uses</h4>${li(p.data)}</div><div><h4>Methods and technology</h4>${li(p.methods)}</div><div><h4>Value created</h4>${li(p.value)}</div></div>
      <div class="ex"><b style="color:${p.c}">Wind turbine example.</b> ${p.ex}</div>`;
  };
  $$('.ph').forEach(b => b.addEventListener('click', () => show(+b.dataset.n)));
  show(0);
})();

/* ----------------------------------------------------------------- 8. maturity */
const LADDER = [
  ['1', 'Descriptive', 'What is happening now?', 'The twin mirrors the current state: positions, temperatures, loads, shown in context on the 3D model. Needs sensing, connectivity and a data platform.', 'A live 3D view of a turbine showing power, rotor speed and nacelle temperature.'],
  ['2', 'Diagnostic', 'Why did it happen?', 'The twin compares measurements with what its models expect and explains deviations. This is where physics models become essential: they tell you what "normal" should look like.', 'Power is 6 % below the physics-based power curve; the twin traces it to an 8° yaw misalignment.'],
  ['3', 'Predictive', 'What will happen next?', 'The twin projects the state forward in time: wear, remaining useful life, next week\'s output. Needs calibrated models and an honest statement of uncertainty.', 'The main bearing will reach its alarm limit in 25 ± 6 days at the current wear rate.'],
  ['4', 'Prescriptive', 'What should we do?', 'The twin compares possible actions by simulating them and recommends the best one against cost, risk and output.', 'Replace the bearing on day 18, in the lowest-wind window of the forecast, to lose the least energy.'],
  ['5', 'Autonomous', 'Act on its own, within limits', 'The twin acts directly on the object inside a safe, certified envelope, with people supervising. Few systems are here today, and for good reasons: safety, liability and trust.', 'The twin retunes the pitch controller in a wake sector to cut tower fatigue, and logs every change for review.']
];
(() => {
  $('#ladder').innerHTML = LADDER.map((l, i) => `<button class="rung" data-i="${i}"><span class="lv">${l[0]}</span><span><b>${l[1]}</b><span class="q">${l[2]}</span></span></button>`).join('');
  const show = i => { const l = LADDER[i]; $$('.rung').forEach(b => b.classList.toggle('on', +b.dataset.i === i)); $('#ladderDetail').innerHTML = `<div class="kicker">Level ${l[0]}</div><h3>${l[1]}: ${l[2].toLowerCase()}</h3><p>${l[3]}</p><p class="note small"><b>Example.</b> ${l[4]}</p>`; };
  $$('.rung').forEach(b => b.addEventListener('click', () => show(+b.dataset.i)));
  show(1);
})();

/* ----------------------------------------------------------------- 9. misconceptions */
const MYTHS = [
  ['"A detailed 3D model is a digital twin."', 'A 3D model shows shape. A twin also needs behaviour (how the object responds to loads, heat, wear), a link to one real object, and data that keep it current. A beautiful model with no connection is a digital model.'],
  ['"A dashboard of sensor data is a digital twin."', 'A dashboard shows measurements but has no model of what the values <i>should</i> be, and nothing flows back. It is useful monitoring, and at best part of a digital shadow.'],
  ['"A twin must be a perfect replica."', 'No model is perfect. A good twin is <b>fit for its purpose</b>: as simple as possible for the decisions it supports, with its uncertainty stated. A bridge twin for load limits needs stiffness, not the colour of the paint.'],
  ['"A digital twin needs artificial intelligence."', 'Many strong twins are purely physics-based. AI helps where physics is unknown or too slow, and hybrid models combine both. What every twin needs is a model, data and a connection, not necessarily machine learning.'],
  ['"A twin is just a simulation that runs for longer."', 'Running longer is not the difference. A twin has an identity (this object), a memory (its history), and a connection that keeps it calibrated and lets it act. A simulation has none of these by default.'],
  ['"Digital twins are only for big, expensive machines."', 'They started in aerospace, but the idea now spans factories, buildings, supply chains, power grids, cities and healthcare. The question is always whether better decisions pay for the sensors, models and people.']
];
(() => {
  $('#mythList').innerHTML = MYTHS.map(m => `<button class="myth"><div class="m">${m[0]}</div><div class="a">${m[1]}</div></button>`).join('');
  $$('.myth').forEach(b => b.addEventListener('click', () => b.classList.toggle('open')));
})();

/* ----------------------------------------------------------------- 10. quiz */
const QUIZ = [
  ['Which three parts make up a digital twin in Grieves and Vickers (2017)?', ['Sensors, cloud and AI', 'Physical object, virtual model and the connection between them', 'CAD model, simulation and dashboard', 'Design, build and operate'], 1, 'The three parts are the physical object, the virtual model and the connection. Sensors, cloud and AI are technologies that can implement the connection and the model.'],
  ['A factory model is updated automatically every minute from machine data, but engineers change machine settings by hand after reading reports. What is it, strictly?', ['Digital model', 'Digital shadow', 'Digital twin', 'Simulation'], 1, 'Automatic flow from object to model, manual flow back: a digital shadow (Kritzinger et al., 2018).'],
  ['What most clearly separates a digital twin from a one-off simulation?', ['It uses more advanced mathematics', 'It always uses artificial intelligence', 'It persists, is tied to one identified object and is kept calibrated with that object\'s data', 'It has a 3D visualisation'], 2, 'The mathematics can be identical. Identity, persistence, memory and the connection are what make it a twin.'],
  ['Why can a physics-based model answer what-if questions before any prototype exists?', ['It copies results from similar machines', 'It solves the equations of physics, with constants of nature and the design\'s geometry, stepping through time', 'It uses random numbers to guess outcomes', 'It cannot; a prototype is always needed first'], 1, 'Laws and constants hold for every object, so the solver can compute behaviour in changing conditions from the design alone.'],
  ['In the lifecycle, which form of twin learns from many units of the same product?', ['Digital Twin Prototype (DTP)', 'Digital Twin Instance (DTI)', 'Digital Twin Aggregate (DTA)', 'Digital thread'], 2, 'The aggregate twin pools many instance twins to find patterns across the fleet.'],
  ['In the live lab, what revealed the hidden corrosion?', ['A camera image of rust', 'The residual: the gap between measured deflection and the physics prediction', 'The truck driver\'s report', 'A change in the weather'], 1, 'The twin knew what the deflection should be for each known truck weight. When measurements drifted away from the prediction, the residual rose and raised the alarm.']
];
(() => {
  let answered = 0, right = 0;
  $('#quiz').innerHTML = QUIZ.map((q, i) => `<div class="q card" data-i="${i}"><p>${i + 1}. ${q[0]}</p><div class="opts">${q[1].map((o, j) => `<button class="opt" data-j="${j}">${o}</button>`).join('')}</div><div class="fb"></div></div>`).join('');
  $$('.quiz .q').forEach(box => {
    const q = QUIZ[+box.dataset.i];
    box.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => {
      const j = +b.dataset.j, ok = j === q[2];
      box.querySelectorAll('.opt').forEach((x, k) => { x.disabled = true; if (k === q[2]) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      const fb = box.querySelector('.fb'); fb.innerHTML = (ok ? '<b class="green">Correct.</b> ' : '<b class="red">Not quite.</b> ') + q[3]; fb.classList.add('show');
      answered++; if (ok) right++;
      $('#score').textContent = answered === QUIZ.length ? `Score: ${right} of ${QUIZ.length}. ${right === QUIZ.length ? 'Excellent.' : 'Scroll up to revisit the sections you missed.'}` : `${answered} of ${QUIZ.length} answered`;
    }));
  });
})();

/* ----------------------------------------------------------------- 11. glossary */
const GLOSS = [
  ['Digital twin', 'A virtual model of one specific physical object, connected to it by two-way data flow throughout its life.'],
  ['Digital shadow', 'A model that receives data automatically from the object, while actions return only through people.'],
  ['Digital model', 'A model with no automatic data exchange with a physical object.'],
  ['Digital Twin Prototype (DTP)', 'The designs, analyses and processes that describe a product before it is made.'],
  ['Digital Twin Instance (DTI)', 'The twin of one manufactured unit, linked to it for its whole life.'],
  ['Digital Twin Aggregate (DTA)', 'The combination of many instance twins, used to learn across a fleet.'],
  ['Digital thread', 'The linked record of data about a product across design, production, service and end of life.'],
  ['Physics-based model', 'A model built from laws of nature (conservation of mass, momentum, energy) and material properties.'],
  ['Data-driven model', 'A model learned from measurements, such as a regression or neural network.'],
  ['Hybrid model', 'A model combining physics and data, for example a physics model with a learned correction term.'],
  ['PINN', 'Physics-informed neural network: a neural network trained to fit data while also satisfying the governing equations.'],
  ['Reduced-order model (ROM)', 'A simplified version of a detailed model that keeps the dominant behaviour and runs far faster.'],
  ['Residual', 'The difference between what is measured and what the model predicts. Growing residuals signal faults or model error.'],
  ['Calibration', 'Adjusting model parameters so predictions match measurements from the specific object.'],
  ['State estimation', 'Combining a model and noisy measurements to estimate quantities that are not measured directly (e.g. with a Kalman filter).'],
  ['Virtual commissioning', 'Testing control software against a model of the machine or plant before the real one is started.'],
  ['Solver', 'The numerical method that turns equations into numbers, step by step in space and time.'],
  ['Greenfield / brownfield', 'A twin built with a new asset from the start, versus a twin added to an asset that already exists.']
];
$('#gloss').innerHTML = GLOSS.map(g => `<div><dt>${g[0]}</dt><dd>${g[1]}</dd></div>`).join('');

/* ================================================================= LIVE LABS */
const G = 9.81, I_SEC = 0.05, A_SEC = 0.8, DECK = 12000;
const MATS = { steel: { name: 'steel', E: 210e9, rho: 7850 }, alu: { name: 'aluminium', E: 70e9, rho: 2700 }, conc: { name: 'concrete', E: 35e9, rho: 2400 } };
const stiff = (E, L) => 48 * E * I_SEC / (L * L * L);          // simply supported beam, midspan load
const mass = (rho, L) => 0.5 * L * (rho * A_SEC + DECK);           // modal mass of first bending mode
// one RK4 step for m x'' + c x' + k x = F
function rk4(s, m, c, k, F, dt) {
  const f = (x, v) => [v, (F - c * v - k * x) / m];
  const [a1, b1] = f(s.x, s.v), [a2, b2] = f(s.x + a1 * dt / 2, s.v + b1 * dt / 2), [a3, b3] = f(s.x + a2 * dt / 2, s.v + b2 * dt / 2), [a4, b4] = f(s.x + a3 * dt, s.v + b3 * dt);
  s.x += dt / 6 * (a1 + 2 * a2 + 2 * a3 + a4); s.v += dt / 6 * (b1 + 2 * b2 + 2 * b3 + b4);
}
function fitCanvas(cv, h) {
  const dpr = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth || 600;
  cv.style.height = h + 'px'; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); return { ctx, w, h };
}
function drawBridge(ctx, w, h, defl, exag, opt = {}) {
  // deck from x0 to x1, supports at both ends, deflected shape = defl * sin(pi u)
  const x0 = 40, x1 = w - 40, yd = opt.y || h * 0.5;
  const shape = d => { const p = []; for (let i = 0; i <= 60; i++) { const u = i / 60; p.push([x0 + (x1 - x0) * u, yd + exag * d * Math.sin(Math.PI * u)]); } return p; };
  const line = (p, col, lw, dash) => { ctx.beginPath(); p.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]); };
  // ground and supports
  ctx.fillStyle = '#1a2940'; ctx.fillRect(0, yd + 40, x0 + 18, h - yd - 40); ctx.fillRect(x1 - 18, yd + 40, w - x1 + 18, h - yd - 40);
  ctx.fillStyle = 'rgba(58,120,200,.16)'; ctx.fillRect(x0 + 18, h - 16, x1 - x0 - 36, 16);
  ctx.fillStyle = '#5d6f86';
  [x0, x1].forEach(x => { ctx.beginPath(); ctx.moveTo(x, yd + 6); ctx.lineTo(x - 16, yd + 40); ctx.lineTo(x + 16, yd + 40); ctx.closePath(); ctx.fill(); });
  // undeformed reference
  line([[x0, yd], [x1, yd]], 'rgba(147,162,180,.35)', 1, [4, 5]);
  const p = shape(defl);
  // girder body
  ctx.beginPath(); p.forEach(([x, y], i) => i ? ctx.lineTo(x, y - 8) : ctx.moveTo(x, y - 8)); for (let i = p.length - 1; i >= 0; i--) ctx.lineTo(p[i][0], p[i][1] + 8); ctx.closePath();
  ctx.fillStyle = opt.fill || 'rgba(58,208,240,.18)'; ctx.fill(); line(p.map(([x, y]) => [x, y - 8]), opt.col || '#3ad0f0', 2.5); line(p.map(([x, y]) => [x, y + 8]), opt.col || '#3ad0f0', 1.5);
  if (opt.rust) { ctx.fillStyle = 'rgba(200,110,60,.75)'; [[.18, 3], [.33, -2], [.47, 4], [.61, -3], [.78, 2], [.55, 1], [.27, -4]].forEach(([u, dy]) => { const yy = yd + exag * defl * Math.sin(Math.PI * u) + dy; ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * u, yy, 4, 0, 7); ctx.fill(); }); }
  if (opt.twin != null) line(shape(opt.twin).map(([x, y]) => [x, y - 8]), '#3ad0f0', 2, [7, 6]);
  return { x0, x1, yd, yAt: u => yd + exag * defl * Math.sin(Math.PI * u) };
}
function drawTruck(ctx, x, yTop, tonnes, col) {
  const w = 34 + tonnes * 0.18, hh = 18 + tonnes * 0.05;
  ctx.fillStyle = col; ctx.fillRect(x - w / 2, yTop - hh - 8, w, hh);
  ctx.fillRect(x + w / 2 - 2, yTop - hh + 2, 14, hh - 10);
  ctx.fillStyle = '#0b1220'; [x - w / 2 + 8, x + w / 2 - 6, x + w / 2 + 6].forEach(xx => { ctx.beginPath(); ctx.arc(xx, yTop - 6, 5, 0, 7); ctx.fill(); });
  ctx.fillStyle = '#0b1220'; ctx.font = '700 12px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(`${Math.round(tonnes)} t`, x, yTop - 12 - hh / 2 + 4);
}
function axes(ctx, w, h, pad, yMax, tSpan, t0, yLabel) {
  ctx.strokeStyle = '#22324a'; ctx.lineWidth = 1; ctx.fillStyle = '#93a2b4'; ctx.font = '12px Inter, sans-serif'; ctx.textAlign = 'right';
  const step = yMax > 600 ? 200 : yMax > 300 ? 100 : yMax > 120 ? 50 : 20;
  for (let v = 0; v <= yMax; v += step) { const y = pad.t + (h - pad.t - pad.b) * (1 - v / yMax); ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke(); ctx.fillText(v, pad.l - 6, y + 4); }
  ctx.textAlign = 'center';
  for (let s = Math.ceil(t0 / 5) * 5; s <= t0 + tSpan; s += 5) { const x = pad.l + (w - pad.l - pad.r) * (s - t0) / tSpan; ctx.fillText(s + ' s', x, h - pad.b + 16); }
  ctx.save(); ctx.translate(12, pad.t + (h - pad.t - pad.b) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(yLabel, 0, 0); ctx.restore();
}
const fmtMM = x => `${Math.round(x * 1000)} mm`;

/* ----------------------------------------------------------------- Lab A: design-stage twin */
(() => {
  const el = { mat: $('#mat'), span: $('#span'), load: $('#load'), damp: $('#damp'), arrive: $('#arrive') };
  const cvB = $('#aBridge'), cvP = $('#aPlot');
  let st = null, running = false, hist = [], loads = [], peak = 0, yMax = 200, doubled = false, visible = true;
  const P = () => { const m = MATS[el.mat.value], L = +el.span.value; const k = stiff(m.E, L), M = mass(m.rho, L), z = +el.damp.value; return { m, L, k, M, z, c: 2 * z * Math.sqrt(k * M), F: +el.load.value * 1000 * G, lim: L / 300 }; };
  const Fat = t => loads.reduce((s, l) => s + l.F * (l.ramp ? clamp((t - l.t0) / 2, 0, 1) : (t >= l.t0 ? 1 : 0)), 0);
  function labels() {
    const p = P(); $('#vMat').textContent = p.m.name; $('#vSpan').textContent = p.L + ' m'; $('#vLoad').textContent = el.load.value + ' t'; $('#vDamp').textContent = (+el.damp.value).toFixed(2);
    $('#aF').textContent = (Math.sqrt(p.k / p.M) / (2 * Math.PI)).toFixed(2) + ' Hz'; $('#aS').textContent = fmtMM(p.F / p.k);
  }
  function reset() { st = { x: 0, v: 0, t: 0 }; running = false; hist = []; loads = []; peak = 0; doubled = false; const p = P(); yMax = Math.max(p.lim * 1000 * 1.3, p.F / p.k * 1000 * 1.4); $('#aDouble').disabled = true; $('#aRun').disabled = false; $('#aPk').textContent = '–'; $('#aPkBox').className = 'ro'; $('#aT').textContent = 't = 0.0 s'; labels(); }
  Object.values(el).forEach(e => e.addEventListener('input', () => { reset(); }));
  $('#aRun').addEventListener('click', () => { reset(); loads.push({ t0: 0.5, F: P().F, ramp: el.arrive.value === 'ramp' }); running = true; $('#aRun').disabled = true; $('#aDouble').disabled = false; });
  $('#aDouble').addEventListener('click', () => { if (!running || doubled) return; loads.push({ t0: st.t, F: P().F, ramp: el.arrive.value === 'ramp' }); doubled = true; $('#aDouble').disabled = true; });
  $('#aReset').addEventListener('click', reset);
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(cvP);
  let last = performance.now();
  function frame(now) {
    const dtw = Math.min(0.05, (now - last) / 1000); last = now;
    const p = P();
    if (running && visible) {
      const n = Math.round(dtw / 0.005);
      for (let i = 0; i < n; i++) { rk4(st, p.M, p.c, p.k, Fat(st.t), 0.005); st.t += 0.005; if (i % 4 === 0) hist.push([st.t, st.x]); }
      peak = Math.max(peak, st.x);
      if (st.t >= 20) { running = false; $('#aDouble').disabled = true; $('#aRun').disabled = false; }
      $('#aT').textContent = `t = ${st.t.toFixed(1)} s`;
      $('#aPk').textContent = fmtMM(peak); $('#aPkBox').className = 'ro ' + (peak > p.lim ? 'bad' : 'ok');
    }
    yMax = Math.max(yMax, peak * 1000 * 1.15);
    // bridge
    const B = fitCanvas(cvB, 210), exag = 45 / p.lim, ctx = B.ctx;
    const g = drawBridge(ctx, B.w, B.h, st.x, exag, { y: 105 });
    const F = Fat(st.t);
    if (F > 0) { let off = 0; loads.forEach(l => { const f = l.ramp ? clamp((st.t - l.t0) / 2, 0, 1) : (st.t >= l.t0 ? 1 : 0); if (f <= 0) return; const tx = l.ramp ? g.x0 + (B.w / 2 - g.x0) * f + off : B.w / 2 + off; drawTruck(ctx, tx, g.yAt(clamp((tx - g.x0) / (g.x1 - g.x0), 0, 1)) - 8 - (l.ramp ? 0 : 0), +el.load.value, off ? '#ff6b5b' : '#ffb84d'); off += 58; }); }
    ctx.fillStyle = '#93a2b4'; ctx.font = '12px Inter, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(`${p.L} m ${p.m.name} girder · deflection drawn ×${Math.round(exag)}`, 12, 20);
    ctx.textAlign = 'right'; ctx.fillStyle = st.x > p.lim ? '#ff6b5b' : '#3ad0f0'; ctx.font = '700 15px Inter, sans-serif'; ctx.fillText(`x = ${fmtMM(st.x)}`, B.w - 12, 22);
    // plot
    const Q = fitCanvas(cvP, 230), c2 = Q.ctx, pad = { l: 46, r: 12, t: 14, b: 26 };
    axes(c2, Q.w, Q.h, pad, yMax, 20, 0, 'deflection (mm)');
    const X = t => pad.l + (Q.w - pad.l - pad.r) * t / 20, Y = v => pad.t + (Q.h - pad.t - pad.b) * (1 - v * 1000 / yMax);
    c2.strokeStyle = '#ff6b5b'; c2.setLineDash([6, 5]); c2.beginPath(); c2.moveTo(pad.l, Y(p.lim)); c2.lineTo(Q.w - pad.r, Y(p.lim)); c2.stroke(); c2.setLineDash([]);
    c2.fillStyle = '#ff6b5b'; c2.textAlign = 'right'; c2.font = '12px Inter, sans-serif'; c2.fillText(`limit L/300 = ${fmtMM(p.lim)}`, Q.w - pad.r - 4, Y(p.lim) - 6);
    c2.strokeStyle = 'rgba(147,162,180,.6)'; c2.setLineDash([3, 4]); c2.beginPath(); c2.moveTo(pad.l, Y(p.F / p.k)); c2.lineTo(Q.w - pad.r, Y(p.F / p.k)); c2.stroke(); c2.setLineDash([]);
    c2.fillStyle = '#93a2b4'; c2.textAlign = 'left'; c2.fillText('static deflection F/k', pad.l + 6, Y(p.F / p.k) - 6);
    if (hist.length > 1) { c2.strokeStyle = '#3ad0f0'; c2.lineWidth = 2.5; c2.beginPath(); hist.forEach(([t, x], i) => i ? c2.lineTo(X(t), Y(x)) : c2.moveTo(X(t), Y(x))); c2.stroke(); c2.lineWidth = 1; }
    if (!running && !hist.length) { c2.fillStyle = '#93a2b4'; c2.textAlign = 'center'; c2.font = '15px Inter, sans-serif'; c2.fillText('Press "Apply load" to start the solver', Q.w / 2, Q.h / 2); }
    requestAnimationFrame(frame);
  }
  reset(); requestAnimationFrame(frame);
})();

/* ----------------------------------------------------------------- Lab B: model -> shadow -> twin */
(() => {
  const L = 40, E = 210e9, K0 = stiff(E, L), M = mass(7850, L), Z = 0.04, C0 = k => 2 * Z * Math.sqrt(k * M), LIM = L / 300, SIG = 0.002, CYC = 10;
  const cvB = $('#bBridge'), cvP = $('#bPlot');
  let S;
  const rnd = (() => { let s = 7; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();
  const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  function reset() {
    S = { t: 0, phys: { x: 0, v: 0 }, twin: { x: 0, v: 0 }, kTrue: K0, kTwin: K0, connected: false, damaged: false, calibrated: false, acted: false, limitT: null,
      trucks: [], meas: [], pred: [], cycles: [], alarm: false, stage: 0, lastPeak: 0, curPeak: 0, visible: true };
    S.trucks[0] = newTruck(0);
    setStatus(); steps(0);
    ['bDamage', 'bCal', 'bAct'].forEach(id => $('#' + id).disabled = true); $('#bConnect').disabled = false;
    $('#bLog').innerHTML = '<div class="muted">Event log. The model is running with its design stiffness and no data.</div>';
    $('#bK').textContent = (K0 / 1e6).toFixed(2) + ' MN/m'; $('#bRes').textContent = '–'; $('#bResBox').className = 'ro'; $('#bPk').textContent = '–'; $('#bPkBox').className = 'ro';
  }
  function newTruck(i) { const t = Math.round(40 + rnd() * 50); const rer = S && S.limitT != null && t > S.limitT; return { i, tonnes: t, rerouted: rer }; }
  const log = (m, cls = '') => { const d = document.createElement('div'); d.innerHTML = `<span class="muted">t = ${S.t.toFixed(0)} s</span> · <span class="${cls}">${m}</span>`; $('#bLog').prepend(d); };
  function setStatus() { const s = $('#bStatus'); if (S.acted) { s.textContent = 'Digital twin: two-way'; s.style.color = '#3ad0f0'; } else if (S.connected) { s.textContent = 'Digital shadow: one-way'; s.style.color = '#ffb84d'; } else { s.textContent = 'Digital model: no data'; s.style.color = '#93a2b4'; } }
  function steps(n) { $$('#bSteps li').forEach((li, i) => { li.className = i < n ? 'done' : i === n ? 'now' : ''; }); }
  // load profile within a cycle: truck drives on (1.0 to 2.5 s), stays, drives off (6.5 to 8.0 s)
  const shape = tc => clamp((tc - 1) / 1.5, 0, 1) * (1 - clamp((tc - 6.5) / 1.5, 0, 1));
  const Fnow = t => { const i = Math.floor(t / CYC), tr = S.trucks[i]; if (!tr || tr.rerouted) return 0; return tr.tonnes * 1000 * G * shape(t - i * CYC); };

  $('#bConnect').addEventListener('click', () => { S.connected = true; $('#bConnect').disabled = true; $('#bDamage').disabled = false; setStatus(); steps(1); log('Sensors connected. Deflection (20 Hz) and truck weights now stream into the model.', 'amber'); });
  $('#bDamage').addEventListener('click', () => { S.damaged = true; S.kTrue = 0.8 * K0; S.tDamage = S.t; $('#bDamage').disabled = true; steps(2); log('Hidden change in the real bridge: corrosion. Nobody tells the model.', 'red'); });
  $('#bCal').addEventListener('click', () => {
    const good = S.cycles.filter(c => c.start > (S.tDamage || 0) && !c.rerouted).slice(-2);
    if (!good.length) return;
    const Fsum = good.reduce((s, c) => s + c.F, 0), xsum = good.reduce((s, c) => s + c.xMean, 0);
    const kEst = Fsum / xsum, loss = 1 - kEst / K0;
    S.kTwin = kEst; S.twin.x = S.meas.length ? S.meas[S.meas.length - 1][1] : S.twin.x; S.calibrated = true;
    $('#bCal').disabled = true; $('#bAct').disabled = false; steps(3);
    $('#bK').textContent = (kEst / 1e6).toFixed(2) + ' MN/m';
    log(`Recalibrated from ${good.length} truck crossing${good.length > 1 ? 's' : ''}: k = ΣF / Σx = ${(kEst / 1e6).toFixed(2)} MN/m, a ${(loss * 100).toFixed(0)} % stiffness loss. Inspection flagged.`, 'cyan');
  });
  $('#bAct').addEventListener('click', () => {
    const lim = Math.floor(S.kTwin * LIM / (1.1 * G * 1000) / 5) * 5;
    S.limitT = lim; S.acted = true; $('#bAct').disabled = true; setStatus(); steps(4);
    S.trucks.forEach(tr => { if (tr.i * CYC > S.t) tr.rerouted = tr.tonnes > lim; });
    log(`Decision sent to the bridge: load limit ${lim} t posted (deflection limit L/300 with a 10 % dynamic margin). Heavier trucks are rerouted.`, 'green');
  });
  $('#bReset').addEventListener('click', reset);
  new IntersectionObserver(es => { S.visible = es[0].isIntersecting; }).observe(cvP);

  let last = performance.now(), sampleAcc = 0;
  function frame(now) {
    const dtw = Math.min(0.05, (now - last) / 1000); last = now;
    if (S.visible) {
      const n = Math.round(dtw / 0.005);
      for (let i = 0; i < n; i++) {
        const cyc = Math.floor(S.t / CYC);
        if (!S.trucks[cyc + 1]) S.trucks[cyc + 1] = newTruck(cyc + 1);
        const F = Fnow(S.t);
        rk4(S.phys, M, C0(S.kTrue), S.kTrue, F, 0.005);
        rk4(S.twin, M, C0(S.kTwin), S.kTwin, F, 0.005);
        S.t += 0.005; sampleAcc += 0.005;
        S.curPeak = Math.max(S.curPeak, S.phys.x);
        if (sampleAcc >= 0.05) {
          sampleAcc -= 0.05;
          S.pred.push([S.t, S.twin.x]);
          if (S.connected) S.meas.push([S.t, S.phys.x + SIG * gauss(), F]);
        }
        const nc = Math.floor(S.t / CYC);
        if (nc !== cyc) { // a crossing finished: store the plateau mean (4.0 to 6.5 s) for calibration
          const t0 = cyc * CYC, tr = S.trucks[cyc];
          const plate = S.meas.filter(m => m[0] >= t0 + 4 && m[0] <= t0 + 6.5);
          if (plate.length) S.cycles.push({ start: t0, F: tr.tonnes * 1000 * G, xMean: plate.reduce((s, m) => s + m[1], 0) / plate.length, rerouted: tr.rerouted });
          S.lastPeak = S.curPeak; S.curPeak = 0;
          if (S.connected && !tr.rerouted) { $('#bPk').textContent = fmtMM(S.lastPeak); $('#bPkBox').className = 'ro ' + (S.lastPeak > LIM ? 'bad' : 'ok'); if (S.lastPeak > LIM) log(`A ${tr.tonnes} t truck deflected the bridge ${fmtMM(S.lastPeak)}, above the ${fmtMM(LIM)} limit.`, 'red'); }
          if (S.damaged && !S.calibrated && S.cycles.some(c => c.start > S.tDamage)) $('#bCal').disabled = false;
        }
      }
      const cut = S.t - 22; S.pred = S.pred.filter(p => p[0] > cut); S.meas = S.meas.filter(p => p[0] > cut - 20);
      // residual over the last 10 s
      if (S.connected) {
        const recent = S.meas.filter(m => m[0] > S.t - 10); let sum = 0, cnt = 0;
        recent.forEach(m => { const p = S.pred.find(q => Math.abs(q[0] - m[0]) < 0.026); if (p) { sum += (m[1] - p[1]) ** 2; cnt++; } });
        const rms = cnt ? Math.sqrt(sum / cnt) : 0; $('#bRes').textContent = (rms * 1000).toFixed(1) + ' mm';
        const al = rms > 3 * SIG; $('#bResBox').className = 'ro ' + (al ? 'bad' : 'ok');
        if (al && !S.alarm) { S.alarm = true; log('Residual alarm: measured deflection no longer matches the physics. Something in the bridge has changed.', 'red'); }
        if (!al && S.alarm && S.calibrated) { S.alarm = false; log('Residual back within sensor noise. The twin matches this bridge again.', 'green'); }
      }
    }
    const cyc = Math.floor(S.t / CYC), tr = S.trucks[cyc], tc = S.t - cyc * CYC;
    $('#bTruck').textContent = tr ? (tr.rerouted ? `${tr.tonnes} t rerouted` : shape(tc) > 0 ? `${tr.tonnes} t` : 'none') : '–';
    // bridge drawing
    const B = fitCanvas(cvB, 190), ctx = B.ctx, exag = 40 / LIM;
    const g = drawBridge(ctx, B.w, B.h, S.phys.x, exag, { y: 100, col: '#c9d3de', fill: 'rgba(201,211,222,.14)', rust: S.damaged, twin: S.connected ? S.twin.x : null });
    if (tr && !tr.rerouted) {
      let tx = null;
      if (tc >= 1 && tc < 2.5) tx = g.x0 + (B.w / 2 - g.x0) * clamp((tc - 1) / 1.5, 0, 1); else if (tc >= 2.5 && tc < 6.5) tx = B.w / 2; else if (tc >= 6.5 && tc < 8) tx = B.w / 2 + (g.x1 - B.w / 2) * clamp((tc - 6.5) / 1.5, 0, 1);
      if (tx != null) drawTruck(ctx, tx, g.yAt(clamp((tx - g.x0) / (g.x1 - g.x0), 0, 1)) - 8, tr.tonnes, '#ffb84d');
    }
    if (tr && tr.rerouted && tc < 8) { ctx.fillStyle = '#ffb84d'; ctx.font = '700 13px Inter, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(`${tr.tonnes} t truck rerouted`, 14, B.h - 12); }
    if (S.limitT != null) { const sx = 20, sy = 34; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sx + 22, sy + 22, 22, 0, 7); ctx.fill(); ctx.strokeStyle = '#ff3b30'; ctx.lineWidth = 5; ctx.stroke(); ctx.lineWidth = 1; ctx.fillStyle = '#111'; ctx.font = '800 14px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(`${S.limitT} t`, sx + 22, sy + 27); }
    ctx.fillStyle = '#93a2b4'; ctx.font = '12px Inter, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(S.connected ? 'solid: real bridge · dashed cyan: twin prediction' : 'real bridge (the model cannot see it yet)', B.w - 12, 20);
    // plot
    const Q = fitCanvas(cvP, 250), c2 = Q.ctx, pad = { l: 46, r: 12, t: 14, b: 26 }, span = 20, t0 = Math.max(0, S.t - span), yMax = 200;
    axes(c2, Q.w, Q.h, pad, yMax, span, t0, 'deflection (mm)');
    const X = t => pad.l + (Q.w - pad.l - pad.r) * (t - t0) / span, Y = v => pad.t + (Q.h - pad.t - pad.b) * (1 - v * 1000 / yMax);
    c2.strokeStyle = '#ff6b5b'; c2.setLineDash([6, 5]); c2.beginPath(); c2.moveTo(pad.l, Y(LIM)); c2.lineTo(Q.w - pad.r, Y(LIM)); c2.stroke(); c2.setLineDash([]);
    c2.fillStyle = '#ff6b5b'; c2.font = '12px Inter, sans-serif'; c2.textAlign = 'right'; c2.fillText(`limit ${fmtMM(LIM)}`, Q.w - pad.r - 4, Y(LIM) - 6);
    c2.save(); c2.beginPath(); c2.rect(pad.l, 0, Q.w - pad.l - pad.r, Q.h); c2.clip();
    if (S.connected) { c2.fillStyle = '#ffb84d'; S.meas.forEach(m => { if (m[0] >= t0) { c2.beginPath(); c2.arc(X(m[0]), Y(m[1]), 2.2, 0, 7); c2.fill(); } }); }
    c2.strokeStyle = '#3ad0f0'; c2.lineWidth = 2.5; c2.beginPath(); let first = true; S.pred.forEach(p => { if (p[0] < t0) return; first ? c2.moveTo(X(p[0]), Y(p[1])) : c2.lineTo(X(p[0]), Y(p[1])); first = false; }); c2.stroke(); c2.lineWidth = 1;
    c2.restore();
    c2.textAlign = 'left'; c2.font = '12.5px Inter, sans-serif'; c2.fillStyle = '#3ad0f0'; c2.fillText('▬ twin prediction (physics)', pad.l + 8, pad.t + 12);
    if (S.connected) { c2.fillStyle = '#ffb84d'; c2.fillText('● measured on the real bridge', pad.l + 190, pad.t + 12); }
    requestAnimationFrame(frame);
  }
  reset(); requestAnimationFrame(frame);
})();
