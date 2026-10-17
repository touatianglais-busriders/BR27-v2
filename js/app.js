/* Busriders · maquette de réservation. Aucune donnée n'est envoyée nulle part : tout reste dans la page. */
(function () {
  'use strict';
  var THEMES = [['nuit', 'Bleu nuit'], ['quai', 'Quai 4H'], ['cadre', 'Plein cadre']];
  var SORTIES = [
    { id: 'a', badge: 'JOURNÉE', b2: false, d1: '28', d2: 'NOV.', place: 'Les 2 Alpes', sub: 'Bus + forfait', price: 'dès 73 €', open: true,
      line: { mpl: 'Départ 4h00', nim: 'Départ 4h30' } },
    { id: 'b', badge: 'WEEK-END', b2: true, d1: '15-17', d2: 'JANV.', place: 'Les Sybelles', sub: '2 nuits · forfait inclus', price: '265 €', open: false,
      line: { mpl: 'Départ ven. 18h30', nim: 'Départ ven. 19h00' } },
    { id: 'c', badge: 'WEEK-END', b2: true, d1: '12-14', d2: 'MARS', place: 'Les Sybelles', sub: '2 nuits · forfait inclus', price: '265 €', open: false,
      line: { mpl: 'Départ ven. 18h30', nim: 'Départ ven. 19h00' } }
  ];
  var FORMULAS = [
    { id: 'f', name: 'Avec forfait', sub: 'Bus + forfait de la journée', price: 73 },
    { id: 's', name: 'Sans forfait', sub: 'Bus seul', price: 45 }
  ];
  var RDV = {
    mpl: { city: 'Montpellier', txt: 'RDV 3h30 · av. du Pirée (Antigone) · départ 4h00', short: 'RDV 3h30 · bus 4h00', where: 'Parking de l\'ancien Office de Tourisme, 78 av. du Pirée (Antigone)', q: '78 avenue du Pirée, 34000 Montpellier' },
    nim: { city: 'Nîmes', txt: 'RDV 4h00 · parking sortie Nîmes Ouest · départ 4h30', short: 'RDV 4h00 · bus 4h30', where: 'Parking de la barrière de péage, sortie Nîmes Ouest', q: 'Péage Nîmes Ouest, Nîmes' }
  };
  var STATIONS = [
    { id: 'les2alpes', name: 'Les 2 Alpes', url: 'http://www.les2alpes.com/fr/', cam: 'http://www.les2alpes.com/fr/webcams.html' },
    { id: 'alpedhuez', name: 'L\'Alpe d\'Huez', url: 'http://www.alpedhuez.com/fr/hiver', cam: 'http://www.skiinfo.fr/alpes-du-nord/alpe-dhuez/webcams.html', plan: 'http://www.alpedhuez.com/fr/hiver/la-glisse/plans-des-pistes.html' },
    { id: 'chamrousse', name: 'Chamrousse', url: 'http://www.chamrousse.com', cam: 'http://www.chamrousse.com/webcams.html', plan: 'http://www.chamrousse.com/plan-des-pistes.html' },
    { id: 'vars', name: 'Vars', url: 'http://www.vars.com/hiver/', cam: 'http://www.vars.com/hiver/domaine/webcams-meteo-bulletin-neige', plan: 'http://www.vars.com/hiver/domaine/plan-pistes' },
    { id: 'les7laux', name: 'Les 7 Laux', url: 'http://www.les7laux.com/', cam: 'http://www.les7laux.com/index.php/fr/menu-webcam.html', plan: 'http://www.les7laux.com/index.php/fr/menu-hiver/104-domaine-skiable.html' },
    { id: 'sybelles', name: 'Les Sybelles', url: 'https://www.sybelles.ski/' },
    { id: 'courchevel', name: 'Courchevel', url: 'https://www.courchevel.com/' },
    { id: 'valmorel', name: 'Valmorel', url: 'https://www.valmorel.com/' }
  ];
  var PARTNERS = [
    { name: 'The Fat Monkeys', url: 'http://www.thefatmonkeys.com' },
    { name: 'Vague et Vent', url: 'http://www.vagueetvent.com' },
    { name: 'Australian Café OZ', url: 'https://cafe-oz.com/montpellier.html' },
    { name: 'Easy Board Company', url: 'http://easyboardcompany.com' },
    { name: 'Hexis Energy', url: 'https://hexis-energy.com/' },
    { name: 'NRJ', url: 'http://www.nrj.fr' }
  ];
  var SOCIAL = [['Instagram', 'https://www.instagram.com/busriders_mtp/']];
  var MAIL = 'busridersmtp@gmail.com';
  function ext(u) { return ' href="' + u + '" target="_blank" rel="noopener noreferrer"'; }
  function gps(c, cls) {
    var q = encodeURIComponent(RDV[c].q);
    return '<details class="gps' + (cls ? ' ' + cls : '') + '"><summary>' + ICON.nav + 'Itinéraire</summary><div class="gps-menu" role="menu">' +
      '<a role="menuitem"' + ext('https://www.google.com/maps/search/?api=1&query=' + q) + '>Google Maps</a>' +
      '<a role="menuitem"' + ext('https://maps.apple.com/?q=' + q) + '>Plans (Apple)</a>' +
      '<a role="menuitem"' + ext('https://waze.com/ul?q=' + q + '&navigate=yes') + '>Waze</a></div></details>';
  }
  var INSURANCE = 4;
  var S = { city: 'mpl', formula: 'f', ins: false, qty: 1, ticket: 0, cgv: false, err: '', form: {} };

  var $ = function (s) { return document.querySelector(s); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  var ICON = {
    pin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2"/></svg>',
    shield: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    clock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    minus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>',
    plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/><path d="M12 6v12"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>',
    lock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    n1: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 11h16"/><path d="M8 7h8"/><circle cx="8" cy="20" r="1.5"/><circle cx="16" cy="20" r="1.5"/></svg>',
    n2: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3z"/><path d="M14 6v12"/></svg>',
    n3: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>',
    nav: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l18-8-8 18-2-8z"/></svg>',
    ext: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    n5: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7"/><path d="M12 17h.01"/></svg>',
    dl: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/></svg>',
    n4: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>'
  };
  var QR = '<svg viewBox="0 0 21 21" shape-rendering="crispEdges" role="img" aria-label="QR code du billet (exemple, non scannable)"><rect width="21" height="21" fill="#fff"/><g fill="#111"><rect width="7" height="7"/><rect x="14" width="7" height="7"/><rect y="14" width="7" height="7"/><path d="M8 0h2v1h-2zM11 0h1v1h-1zM9 1h3v1h-3zM8 2h1v1h-1zM10 2h2v1h-2zM9 3h1v1h-1zM11 3h2v1h-2zM8 4h2v1h-2zM12 4h1v1h-1zM10 5h2v1h-2zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM9 7h3v1h-3zM0 8h2v1h-2zM3 8h1v1h-1zM5 8h3v1h-3zM9 8h1v1h-1zM11 8h2v1h-2zM14 8h3v1h-3zM18 8h3v1h-3zM1 9h1v1h-1zM4 9h2v1h-2zM8 9h2v1h-2zM12 9h1v1h-1zM15 9h2v1h-2zM19 9h2v1h-2zM0 10h3v1h-3zM5 10h1v1h-1zM7 10h2v1h-2zM11 10h2v1h-2zM14 10h1v1h-1zM17 10h2v1h-2zM20 10h1v1h-1zM2 11h2v1h-2zM6 11h3v1h-3zM10 11h1v1h-1zM13 11h3v1h-3zM18 11h1v1h-1zM20 11h1v1h-1zM0 12h1v1h-1zM3 12h3v1h-3zM8 12h2v1h-2zM12 12h2v1h-2zM16 12h2v1h-2zM19 12h2v1h-2zM8 13h2v1h-2zM11 13h1v1h-1zM14 13h3v1h-3zM18 13h2v1h-2zM9 14h3v1h-3zM13 14h1v1h-1zM16 14h2v1h-2zM20 14h1v1h-1zM8 15h1v1h-1zM10 15h2v1h-2zM14 15h2v1h-2zM17 15h1v1h-1zM19 15h2v1h-2zM9 16h1v1h-1zM12 16h3v1h-3zM16 16h1v1h-1zM18 16h3v1h-3zM8 17h3v1h-3zM12 17h1v1h-1zM15 17h2v1h-2zM19 17h1v1h-1zM10 18h2v1h-2zM13 18h3v1h-3zM17 18h1v1h-1zM20 18h1v1h-1zM8 19h1v1h-1zM11 19h3v1h-3zM15 19h2v1h-2zM18 19h2v1h-2zM9 20h2v1h-2zM12 20h1v1h-1zM14 20h1v1h-1zM16 20h3v1h-3zM20 20h1v1h-1z"/></g><g fill="#fff"><rect x="1" y="1" width="5" height="5"/><rect x="15" y="1" width="5" height="5"/><rect x="1" y="15" width="5" height="5"/></g><g fill="#111"><rect x="2" y="2" width="3" height="3"/><rect x="16" y="2" width="3" height="3"/><rect x="2" y="16" width="3" height="3"/></g></svg>';

  var NAV = [['/', 'Sorties', 'n1'], ['/billet', 'Mon billet', 'n2'], ['/infos', 'Infos', 'n3'], ['/faq', 'FAQ', 'n5'], ['/contact', 'Contact', 'n4']];
  function unit() { var f = FORMULAS.filter(function (x) { return x.id === S.formula; })[0]; return f.price + (S.ins ? INSURANCE : 0); }
  function total() { return unit() * S.qty; }
  function fname() { return FORMULAS.filter(function (x) { return x.id === S.formula; })[0].name; }
  function route() { var h = location.hash.replace(/^#/, '') || '/'; return h.split('?')[0]; }
  function param(k) { var m = new RegExp('[?&]' + k + '=([^&]*)').exec(location.hash); return m ? decodeURIComponent(m[1]) : ''; }
  function seg() {
    return '<div class="seg" role="group" aria-label="Mon départ">' +
      ['mpl', 'nim'].map(function (c) { return '<button type="button" data-act="city" data-v="' + c + '" aria-pressed="' + (S.city === c) + '">' + RDV[c].city + '</button>'; }).join('') + '</div>';
  }
  function back(href, label, n) { return '<div class="back"><a href="' + href + '" aria-label="' + label + '">' + ICON.back + '</a><span class="h" style="font-size:18px;font-weight:800">' + (n ? label : '') + '</span><span class="step-n">' + (n || '') + '</span></div>'; }

  /* ---------- Écrans ---------- */
  function vSorties() {
    var cards = SORTIES.map(function (s) {
      var act = s.open ? '<a class="btn sm" href="#/choix">Réserver</a>' : '<button type="button" class="btn ghost sm" data-act="notify">M\'avertir</button>';
      var l3 = s.open ? s.line[S.city] : 'Ouvre 10 jours avant';
      return '<article class="card"><div class="date"><span class="d1">' + s.d1 + '</span><span class="d2">' + s.d2 + '</span></div>' +
        '<div class="info"><span class="badge' + (s.b2 ? ' b2' : '') + '">' + s.badge + '</span><div class="place">' + s.place + '</div><div class="sub">' + s.sub + '</div><div class="l3">' + (s.open ? s.line[S.city] : l3) + '</div></div>' +
        '<div class="buy"><div class="price">' + s.price + '</div>' + act + '</div></article>';
    }).join('');
    return '<div class="stack"><div class="head-row"><div><h1>Prochaines sorties</h1><p class="lead desk-only">Ski et snowboard depuis Montpellier et Nîmes.</p></div>' + seg() + '</div>' +
      '<div class="cards">' + cards + '</div>' +
      '<div class="trust">' + ICON.shield + '<span>Départ confirmé dès [X] inscrits. Sortie annulée = remboursé.</span></div>' +
      '<div class="chips"><a class="chip" href="#/infos?open=rdv">' + ICON.pin + 'Points de RDV</a><a class="chip" href="#/infos?open=deroule">' + ICON.clock + 'Déroulé</a></div>' +
      '<p class="note" id="notice" role="status"></p></div>';
  }
  function optBtns() {
    return FORMULAS.map(function (f) { return '<button type="button" class="opt" data-act="formula" data-v="' + f.id + '" aria-pressed="' + (S.formula === f.id) + '"><span><span class="t">' + f.name + '</span><span class="s">' + f.sub + '</span></span><span class="p">' + f.price + ' €</span></button>'; }).join('');
  }
  function asideHtml(cta, href) {
    return '<aside class="aside" aria-label="Récapitulatif"><h2 class="label">Mon récapitulatif</h2>' +
      '<div class="line"><span>Sortie</span><b>Les 2 Alpes · 28 nov.</b></div><div class="line"><span>Départ</span><b>' + RDV[S.city].city + '</b></div>' +
      '<div class="line"><span>Formule</span><b>' + fname() + '</b></div><div class="line"><span>Assurance</span><b>' + (S.ins ? 'Oui (+' + INSURANCE + ' €)' : 'Non') + '</b></div>' +
      '<div class="line"><span>Participants</span><b>' + S.qty + '</b></div>' +
      '<div class="tot"><span class="label">Total</span><b>' + total() + ' €</b></div>' + cta +
      '<p class="note">Paiement sécurisé par carte · billet envoyé par e-mail</p></aside>';
  }
  function vChoix() {
    return '<div class="stack">' + back('#/', 'Mes choix', '1 / 3') +
      '<div class="grid2"><div class="stack">' +
      '<div class="hero-d"><div class="date"><span class="d1">28</span><span class="d2">NOV.</span></div><div><div class="place" style="font-size:20px">Les 2 Alpes</div><div class="lead" style="margin:2px 0 0;font-size:13px">Samedi 28 novembre 2026 · journée</div></div></div>' +
      '<section class="stack" style="gap:8px"><h2 class="label">Départ</h2>' + seg() + '<div class="rdv">' + ICON.pin + '<span>' + RDV[S.city].txt + '</span></div>' + gps(S.city) + '</section>' +
      '<section class="stack" style="gap:8px"><h2 class="label">Formule</h2><div class="opts stack" style="gap:8px">' + optBtns() + '</div></section>' +
      '<section class="opts stack" style="gap:10px">' +
      '<div class="row"><div><span class="t">Assurance ski · +' + INSURANCE + ' €</span><span class="s">Possible jusqu\'au jeudi 22 h</span></div><button type="button" class="sw" role="switch" aria-checked="' + S.ins + '" aria-label="Assurance ski" data-act="ins"><i><b></b></i></button></div>' +
      '<div class="row" style="padding-right:12px"><div><span class="t">Participants</span><span class="s">Un billet nominatif par personne</span></div><div class="step"><button type="button" aria-label="Moins un participant" data-act="dec">' + ICON.minus + '</button><output>' + S.qty + '</output><button type="button" aria-label="Plus un participant" data-act="inc">' + ICON.plus + '</button></div></div>' +
      '</section></div>' + asideHtml('<a class="btn lg" href="#/paiement">Continuer vers le paiement</a>') + '</div></div>';
  }
  function partFields() {
    var out = '';
    for (var i = 0; i < S.qty; i++) {
      out += '<section class="stack" style="gap:10px"><h2 class="label">Participant ' + (i + 1) + '</h2><div class="two">' +
        '<div class="field"><label for="p' + i + 'f">Prénom</label><input id="p' + i + 'f" data-k="pf' + i + '" autocomplete="off" placeholder="Prénom" value="' + esc(S.form['pf' + i]) + '"></div>' +
        '<div class="field"><label for="p' + i + 'n">Nom</label><input id="p' + i + 'n" data-k="pn' + i + '" autocomplete="off" placeholder="Nom" value="' + esc(S.form['pn' + i]) + '"></div></div>' +
        '<div class="field"><label for="p' + i + 'm">E-mail (reçoit son billet)</label><input id="p' + i + 'm" type="email" inputmode="email" data-k="pm' + i + '" autocomplete="off" placeholder="adresse e-mail" value="' + esc(S.form['pm' + i]) + '"></div>' +
        '<div class="field"><label for="p' + i + 't">Mobile</label><input id="p' + i + 't" type="tel" inputmode="tel" data-k="pt' + i + '" autocomplete="off" placeholder="numéro de mobile" value="' + esc(S.form['pt' + i]) + '"></div></section>';
    }
    return out;
  }
  function vPaiement() {
    return '<div class="stack form-wrap">' + back('#/choix', 'Paiement', '2 / 3') +
      '<div class="recap"><div><span class="t">Les 2 Alpes · sam. 28 nov.</span><span class="s">' + RDV[S.city].city + ' · ' + fname().toLowerCase() + (S.ins ? ' · assurance' : '') + ' · ' + S.qty + ' pers.</span></div><span class="p">' + total() + ' €</span></div>' +
      '<p class="note" style="text-align:left">Une inscription nominative par participant : nom, prénom, e-mail et mobile de chacun.</p>' +
      partFields() +
      '<div class="cgv"><input id="cgv" type="checkbox" data-act="cgv"' + (S.cgv ? ' checked' : '') + '><label for="cgv">J\'adhère à l\'association Busriders pour la saison en cours (cotisation incluse dans le montant de mon premier billet). J\'accepte les <a href="#/infos?open=cgv">CGV</a>, la <a href="#/legal?doc=confidentialite">Politique de Confidentialité</a> et la <a href="#/charte">Charte du Participant</a>.</label></div>' +
      '<div class="err" id="err" role="alert">' + esc(S.err) + '</div>' +
      '<div class="desk-only"><button type="button" class="btn lg" data-act="pay" style="width:100%">' + ICON.lock + 'Payer ' + total() + ' €</button></div>' +
      '<p class="note">Maquette : aucun paiement réel, rien n\'est envoyé ni enregistré. Texte de la case provisoire, à valider.</p></div>';
  }
  function who(i) { var f = S.form['pf' + i], n = S.form['pn' + i]; return (f || n) ? ((f || '') + ' ' + (n || '')).trim() : (i === 0 ? 'Camille Martin' : 'Participant ' + (i + 1)); }
  function code(i) { return 'BR-2811-A7K' + (i + 2); }
  function vBillet() {
    if (S.ticket >= S.qty) S.ticket = 0;
    var i = S.ticket, r = RDV[S.city];
    var pager = S.qty > 1 ? '<div class="pager"><button type="button" aria-label="Billet précédent" data-act="tprev">' + ICON.back + '</button><span>Billet ' + (i + 1) + ' sur ' + S.qty + '</span><button type="button" aria-label="Billet suivant" data-act="tnext" style="transform:scaleX(-1)">' + ICON.back + '</button></div>' : '';
    return '<div class="stack form-wrap" style="max-width:none">' + back('#/', 'Mon billet', '3 / 3') +
      '<article class="ticket"><div class="t-qr desk-only"><div class="qr">' + QR + '</div></div><div class="t-main">' +
      '<div class="t-head"><div><div class="h">Les 2 Alpes</div><span class="d">Samedi 28 novembre 2026</span></div><span class="valid">' + ICON.check + 'VALIDE</span></div>' +
      '<div class="t-body mobile-only"><div class="qr">' + QR + '</div><div class="who"><b>' + esc(who(i)) + '</b><span>' + code(i) + '</span></div></div>' +
      '<div class="t-meta desk-only"><div><small>PASSAGER</small><b>' + esc(who(i)) + '</b></div><div><small>CODE</small><b>' + code(i) + '</b></div><div><small>FORMULE</small><b>' + fname() + '</b></div></div>' +
      '<div class="t-foot"><div><small>DÉPART ' + r.city.toUpperCase() + '</small><b>' + r.short + '</b><div class="desk-only" style="font-size:15px;color:var(--pmuted)">' + r.where + '</div></div><span class="tag mobile-only">' + fname() + '</span></div>' +
      '</div><span class="wm" aria-hidden="true"></span></article>' + pager +
      '<div class="gps-wrap">' + gps(S.city, 'full') + '</div>' +
      '<p class="note">Présentez ce code au chauffeur à la montée. Un scan = un billet utilisé. Billet et QR d\'exemple (non scannable).</p></div>';
  }
  function acc(key, title, body, openKey) { return '<details class="acc" id="acc-' + key + '"' + (openKey === key ? ' open' : '') + '><summary>' + title + '</summary><div>' + body + '</div></details>'; }
  function dl(name) { return '<button type="button" class="btn ghost dl" data-act="dl" style="width:100%">' + ICON.dl + 'Télécharger : ' + name + '</button>'; }
  function vInfos() {
    var o = param('open') || 'rdv';
    var rdv = ['mpl', 'nim'].map(function (c) { return '<div class="rdvbox"><b>' + RDV[c].city + '</b><span>' + RDV[c].where + '</span>' + gps(c) + '</div>'; }).join('');
    var deroule = '<ul class="tl"><li><b>3h30 / 4h00</b> Rendez-vous (Montpellier / Nîmes)</li><li><b>4h00 / 4h30</b> Départ (3h00 / 3h30 pour Valmorel et Courchevel)</li><li><b>~7h15</b> Arrêt petit-déjeuner</li><li><b>~8h30</b> Arrivée en station</li><li><b>16h45</b> Pointage au bus</li><li><b>17h00</b> Départ de la station, précises</li><li><b>22h00 à 22h30</b> Arrivée à Montpellier, selon trafic</li></ul>';
    var st = '<div class="lnks">' + STATIONS.map(function (x) { return '<a class="lnk" href="#/station?id=' + x.id + '"><span>' + x.name + '</span>' + ICON.ext + '</a>'; }).join('') + '</div>';
    var pa = '<div class="lnks">' + PARTNERS.map(function (x) { return '<a class="lnk"' + ext(x.url) + '><span>' + x.name + '' + '</span>' + ICON.ext + '</a>'; }).join('') + '</div>';
    var cgv = '<ul class="bl"><li><b>Adhésion</b> à l\'association incluse dans le premier billet de la saison, sans surcoût. L\'accès aux sorties est réservé aux membres.</li><li><b>Inscription</b> nominative, uniquement sur le site. Aucune place n\'est réservée sans paiement.</li><li><b>Prix</b> en euros TTC. Deux e-mails : au paiement, puis à la validation de la sortie.</li><li><b>Assurance</b> secours sur piste facultative, mais recommandée.</li><li><b>Horaires</b> le bus part à l\'heure, à l\'aller comme au retour. Retard = aucun remboursement.</li><li><b>Annulation</b> par le participant : réservation ferme, aucun remboursement. Par l\'association (tempête, force majeure) : avoir de 100 % réutilisable sur la saison, ou remboursement sous 14 jours.</li><li><b>Rétractation</b> : aucun droit de rétractation (art. L221-28 du Code de la consommation).</li><li><b>Mineurs</b> non accompagnés acceptés dès 16 ans, après contact préalable et autorisation parentale écrite.</li><li><b>Données</b> utilisées uniquement pour l\'inscription et les sorties, non cédées (RGPD).</li></ul><a class="btn ghost" style="width:100%;margin-top:12px"' + ext('https://busriders.net/cgv/') + '>CGV complètes' + ICON.ext + '</a>';
    return '<div class="stack form-wrap"><h1>Infos pratiques</h1><div>' +
      acc('rdv', 'Points de RDV', rdv, o) + acc('deroule', 'Déroulé de la journée', deroule, o) +
      acc('stations', 'Les stations', st, o) + acc('partners', 'Nos partenaires', pa, o) +
      acc('charte', 'Charte du Participant', '<p style="margin:0 0 12px"><b style="color:var(--zero)">Tolérance zéro</b> : alcool et stupéfiants interdits à bord. Ponctualité stricte.</p><a class="btn" href="#/charte" style="width:100%">Lire la Charte</a>', o) +
      acc('mineurs', 'Mineurs (16-17 ans)', '<p style="margin:0 0 12px">Autorisation parentale obligatoire pour les mineurs voyageant seuls, accompagnée de la pièce d\'identité du tuteur.</p>' + dl('Autorisation Parentale Mineur'), o) +
      acc('docs', 'Téléchargements', dl('Guide du Rider (Welcome Pack)') + '<p class="note" style="text-align:left;margin-top:10px">Valeurs de l\'asso, déroulé d\'une journée, réductions chez les magasins de sport partenaires à Montpellier et Nîmes.</p>', o) +
      acc('cgv', 'CGV & Adhésion', cgv, o) +
      '</div></div>';
  }
  function vStation() {
    var x = STATIONS.filter(function (y) { return y.id === param('id'); })[0];
    if (!x) { location.hash = '#/infos?open=stations'; return ''; }
    return '<div class="stack form-wrap"><div class="back"><a href="#/infos?open=stations" aria-label="Retour aux stations">' + ICON.back + '</a><span class="step-n">Station</span></div>' +
      '<div class="leave"><div class="label">Vous quittez la maquette</div><h1>' + x.name + '</h1><p class="lead">Le site officiel de la station s\'ouvre dans un nouvel onglet.</p>' +
      '<a class="btn lg"' + ext(x.url) + ' style="width:100%;margin-top:18px">Ouvrir le site de ' + x.name + ICON.ext + '</a>' +
      (x.cam ? '<a class="btn ghost"' + ext(x.cam) + ' style="width:100%;margin-top:10px">Webcams' + ICON.ext + '</a>' : '') +
      (x.plan ? '<a class="btn ghost"' + ext(x.plan) + ' style="width:100%;margin-top:10px">Plan des pistes' + ICON.ext + '</a>' : '') + '</div></div>';
  }
  function vCharte() {
    return '<div class="stack form-wrap"><h1>Charte du Participant</h1>' +
      '<section class="zero" aria-labelledby="z1"><div class="zero-t" id="z1">Tolérance zéro</div>' +
      '<ul class="zl"><li><b>Alcool et produits stupéfiants interdits</b> à l\'intérieur de l\'autocar.</li>' +
      '<li><b>Expulsion immédiate</b> de tout contrevenant ou personne en état d\'ivresse, lors d\'une halte sécurisée (aire d\'autoroute, péage).</li>' +
      '<li><b>Retour à la charge du passager expulsé.</b> Aucun remboursement du billet. Signalement aux forces de l\'ordre si nécessaire.</li></ul></section>' +
      '<section class="blocks" style="grid-template-columns:1fr"><section><h2>À respecter</h2><ul class="bl"><li><b>Ponctualité stricte</b> : départ 4h00 Montpellier, 4h30 Nîmes.</li><li><b>Présence 30 min avant</b> le départ (RDV 3h30 Montpellier, 4h00 Nîmes).</li><li><b>Pas de chaussures de ski</b> en cabine.</li><li><b>Départ de la station à 17h00 précises</b> (présence dès 16h45).</li><li><b>Tabac et vapotage interdits</b> dans le car.</li></ul></section></section>' +
      '<p class="note">Texte provisoire (Charte du Participant v2 en cours de finalisation). La version officielle remplacera ce contenu.</p>' +
      '<a class="btn lg" href="#/" style="width:100%">Voir les sorties</a></div>';
  }
  function vLegal() {
    var d = param('doc'), T = { confidentialite: 'Politique de Confidentialité (RGPD)', mentions: 'Mentions Légales' };
    return '<div class="stack form-wrap"><h1>' + (T[d] || 'Document') + '</h1><p class="lead">Document en cours de finalisation. Le texte officiel sera publié ici.</p>' +
      '<a class="btn ghost" href="#/" style="width:100%">Retour aux sorties</a></div>';
  }
  function footer() {
    return '<footer class="legal" aria-label="Informations légales"><a href="#/infos?open=cgv">CGV &amp; Adhésion</a><a href="#/legal?doc=confidentialite">Politique de Confidentialité (RGPD)</a><a href="#/charte">Charte du Participant</a><a href="#/legal?doc=mentions">Mentions Légales</a><span>Contact : ' + MAIL + '</span></footer>';
  }
  function vAsso() {
    return '<div class="stack form-wrap"><h1>L\'association</h1><p class="lead" style="font-size:17px">Des bus vers les Alpes, depuis Montpellier et Nîmes.</p>' +
      '<div class="kpis"><div><b>2002</b><span>création</span></div><div><b>4</b><span>amis fondateurs</span></div><div><b>2</b><span>villes de départ</span></div></div>' +
      '<div class="blocks"><section><h2>Qui sommes-nous</h2><p>Association loi 1901 fondée par quatre amis passionnés de sports de glisse.</p></section>' +
      '<section><h2>Notre mission</h2><p>Réunir les passionnés et faciliter l\'accès à la montagne, toute la saison.</p></section>' +
      '<section><h2>Pour qui</h2><p>Tous les niveaux, toutes les pratiques : ski, snowboard, raquettes… et même sans skier.</p></section>' +
      '<section><h2>Sur place</h2><p>Tests de matériel, contests et vin chaud, avec nos partenaires.</p></section></div>' +
      '<a class="btn lg" href="#/" style="width:100%">Voir les sorties</a>' +
      '<div class="social">' + SOCIAL.map(function (x) { return '<a class="btn ghost"' + ext(x[1]) + '>' + x[0] + '</a>'; }).join('') + '</div>' +
      '<p class="note">Licence transport 2007/82/0000275</p></div>';
  }
  function vFaq() {
    var Q = [
      ['Comment réserver ?', 'Sur le site, avec nom, prénom, e-mail et mobile. Une inscription par personne ; pour un groupe, contactez l\'association.'],
      ['Faut-il payer tout de suite ?', 'Oui : aucune place n\'est réservée sans paiement. Vous recevez un e-mail au paiement, puis un second quand la sortie est validée.'],
      ['Puis-je annuler ou me faire rembourser ?', 'Non, les inscriptions sont fermes après paiement. Seule une annulation par l\'association donne droit à un remboursement intégral.'],
      ['Que se passe-t-il si la sortie est annulée ?', 'En cas de tempête ou de force majeure, l\'association peut annuler. Vous recevez un avoir de 100 % réutilisable sur la saison, ou un remboursement sous 14 jours.'],
      ['Dois-je adhérer à l\'association ?', 'Oui, l\'accès aux sorties est réservé aux membres. L\'adhésion annuelle est incluse dans votre premier billet de la saison, sans surcoût.'],
      ['Que risque-t-on avec de l\'alcool à bord ?', 'Tolérance zéro : alcool et stupéfiants sont interdits dans le car. Le contrevenant est expulsé lors d\'une halte sécurisée, sans remboursement, et le retour est à sa charge. Voir la Charte du Participant.'],
      ['À quelle heure faut-il être là ?', 'Rendez-vous 30 min avant le départ : Montpellier 3h30 (départ 4h00), Nîmes 4h00 (départ 4h30). Le bus part à l\'heure, sans attendre : aucun remboursement ni report en cas de retard. Retour : pointage à 16h45, départ de la station à 17h00 précises.'],
      ['Comment se passe la journée ?', 'Petit-déjeuner vers 7h15, arrivée en station vers 8h30, retour vers 17h, arrivée à Montpellier vers 22h selon météo et trafic.'],
      ['Et mon matériel ?', 'Vous pouvez l\'emporter dans le bus ou le louer sur place.'],
      ['L\'assurance est-elle obligatoire ?', 'Non, elle est facultative (+4 €) mais recommandée. Elle se prend jusqu\'au jeudi 22 h précédant la sortie.'],
      ['Puis-je venir mineur ?', 'Entre 16 et 17 ans, avec l\'Autorisation Parentale Mineur (à télécharger dans Infos) et la pièce d\'identité du tuteur.'],
      ['Puis-je venir sans skier ?', 'Oui, le bus est ouvert à tous, même sans pratiquer.'],
      ['Où trouver mon billet ?', 'Dans l\'onglet « Mon billet » : un QR code par participant, à présenter au chauffeur.']
    ];
    return '<div class="stack form-wrap"><h1>Questions fréquentes</h1><div>' + Q.map(function (q) { return '<details class="acc"><summary>' + q[0] + '</summary><div>' + q[1] + '</div></details>'; }).join('') + '</div>' +
      '<p class="note">Une autre question ? <a href="#/contact" style="text-decoration:underline">Contactez-nous</a>.</p></div>';
  }
  function vContact() {
    return '<div class="stack form-wrap"><h1>Contact</h1><p class="lead">Une question avant de réserver ?</p>' +
      '<a class="btn lg" href="mailto:' + MAIL + '" style="width:100%">Écrire à l\'association</a>' +
      '<div class="social">' + SOCIAL.map(function (x) { return '<a class="btn ghost"' + ext(x[1]) + '>' + x[0] + '</a>'; }).join('') + '</div>' +
      '<p class="note">' + MAIL + '</p></div>';
  }
  var VIEWS = { '/': vSorties, '/choix': vChoix, '/paiement': vPaiement, '/billet': vBillet, '/infos': vInfos, '/station': vStation, '/asso': vAsso, '/charte': vCharte, '/legal': vLegal, '/faq': vFaq, '/contact': vContact };

  /* ---------- Rendu ---------- */
  function render() {
    var r = route(); if (!VIEWS[r]) r = '/';
    $('#view').innerHTML = VIEWS[r]() + footer();
    var step = (r === '/choix' || r === '/paiement');
    document.body.classList.toggle('hide-nav', step);
    var cur = (r === '/choix' || r === '/paiement') ? '/' : (r === '/station' ? '/infos' : r);
    var nav = NAV.map(function (n) { return '<a href="#' + n[0] + '"' + (cur === n[0] ? ' aria-current="page"' : '') + '>' + ICON[n[2]] + '<span>' + n[1] + '</span></a>'; }).join('');
    $('#bottomnav').innerHTML = nav;
    $('#topnav').innerHTML = NAV.map(function (n) { return '<a href="#' + n[0] + '"' + (cur === n[0] ? ' aria-current="page"' : '') + '>' + n[1] + '</a>'; }).join('');
    var st = $('#sticky');
    if (r === '/choix') { st.hidden = false; st.innerHTML = '<div class="in"><div class="tot"><small>TOTAL</small><b>' + total() + ' €</b></div><a class="btn" href="#/paiement">Continuer</a></div>'; }
    else if (r === '/paiement') { st.hidden = false; st.innerHTML = '<div class="in"><button type="button" class="btn full" data-act="pay" style="max-width:none">' + ICON.lock + 'Payer ' + total() + ' €</button></div>'; }
    else { st.hidden = true; st.innerHTML = ''; }
    document.title = 'Busriders · maquette de réservation';
  }
  function renderThemes() {
    var t = document.documentElement.dataset.theme;
    $('#themes').innerHTML = THEMES.map(function (x) { return '<button type="button" data-theme-btn="' + x[0] + '" aria-pressed="' + (t === x[0]) + '">' + x[1] + '</button>'; }).join('');
  }
  function setTheme(t) { document.documentElement.dataset.theme = t; store('br-theme', t); renderThemes(); }

  document.addEventListener('click', function (e) {
    var tb = e.target.closest('[data-theme-btn]'); if (tb) { setTheme(tb.dataset.themeBtn); return; }
    var b = e.target.closest('[data-act]'); if (!b) return;
    var a = b.dataset.act, v = b.dataset.v, keep = true;
    if (a === 'city') S.city = v;
    else if (a === 'formula') S.formula = v;
    else if (a === 'ins') S.ins = !S.ins;
    else if (a === 'inc') S.qty = Math.min(6, S.qty + 1);
    else if (a === 'dec') S.qty = Math.max(1, S.qty - 1);
    else if (a === 'tprev') S.ticket = (S.ticket + S.qty - 1) % S.qty;
    else if (a === 'tnext') S.ticket = (S.ticket + 1) % S.qty;
    else if (a === 'dl') { var d = $('#dlmsg'); if (!d) { d = document.createElement('p'); d.id = 'dlmsg'; d.className = 'note'; d.setAttribute('role', 'status'); b.parentNode.appendChild(d); } d.textContent = 'Démo : le fichier PDF sera mis en ligne ici une fois finalisé.'; return; }
    else if (a === 'notify') { var n = $('#notice'); if (n) n.textContent = 'Démo : vous seriez averti(e) par e-mail à l\'ouverture des ventes.'; return; }
    else if (a === 'pay') { if (!S.cgv) { S.err = 'Cochez la case d\'adhésion et d\'acceptation pour continuer.'; var er = $('#err'); if (er) er.textContent = S.err; return; } S.err = ''; location.hash = '#/billet'; return; }
    else if (a === 'cgv') { S.cgv = b.checked; if (S.cgv) { S.err = ''; var er2 = $('#err'); if (er2) er2.textContent = ''; } return; }
    render();
  });
  document.addEventListener('input', function (e) { var k = e.target.dataset && e.target.dataset.k; if (k) S.form[k] = e.target.value; });
  window.addEventListener('hashchange', function () { render(); window.scrollTo(0, 0); });

  var q = /[?&]charte=(nuit|quai|cadre)/.exec(location.search + location.hash);
  var saved = store('br-theme');
  setTheme(q ? q[1] : (/^(nuit|quai|cadre)$/.test(saved) ? saved : 'nuit'));
  render();
})();
