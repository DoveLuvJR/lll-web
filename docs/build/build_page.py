"""Build collections/nations-before-the-map/index.html (Batch 21).

Reads page.template.html (hand-written prose), the three seed files in docs/specs/,
and the traced outlines in docs/tracing/. Writes every widget state into the HTML
(D-012); the page itself never loads any of these files (D-013).

Run from the repo root:  python docs/build/build_page.py
When a name changes, change the seed AND rebuild in the same commit.
"""
import html
import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
SPECS = ROOT / 'docs' / 'specs'
TRACE = ROOT / 'docs' / 'tracing'
OUT = ROOT / 'collections' / 'nations-before-the-map' / 'index.html'

e = html.escape
names = json.loads((SPECS / 'names.seed.json').read_text(encoding='utf-8'))['entries']
origins = json.loads((SPECS / 'origins.seed.json').read_text(encoding='utf-8'))
stocks = json.loads((SPECS / 'families.seed.json').read_text(encoding='utf-8'))['stocks']
paths = json.loads((TRACE / 'paths.json').read_text(encoding='utf-8'))
palette = json.loads((TRACE / 'palette.json').read_text(encoding='utf-8'))
N = {n['id']: n for n in names}

VIEWBOX = '95 60 1870 1190'  # the conterminous map inside the 2093x1421 tracing grid

AREA_NAMES = {
    'northwest-coast': 'Northwest Coast', 'plateau': 'Plateau', 'california': 'California',
    'great-basin': 'Great Basin', 'southwest': 'Southwest', 'plains': 'Plains',
    'northeast': 'Northeast', 'southeast': 'Southeast', 'desert': 'Desert',
}
# Stock names exactly as the legend prints them
STOCK_NAMES = {
    'na-dene': 'Na-Dene', 'algonkian': 'Algonkian', 'gulf': 'Gulf', 'tonkawa': 'Tonkawa',
    'siouan-yuchi': 'Siouan-Yuchi', 'iroquoian': 'Iroquoian', 'caddoan': 'Caddoan',
    'hokan-coahuiltecan': 'Hokan-Coahuiltecan', 'penutian': 'Penutian',
    'aztec-tanoan': 'Aztec-Tanoan', 'keres': 'Keres', 'yukian': 'Yukian', 'kutenai': 'Kutenai',
    'karankawa': 'Karankawa', 'chimakuan': 'Chimakuan', 'salish': 'Salish',
    'wakashan': 'Wakashan', 'timucua': 'Timucua', 'insufficient': 'Insufficient data',
}

# ---------- Widget 1 cards: stocks measured from the tracing (share > 2%), peoples as printed ----------
# (label as printed, seed id for the own name or None, nc)
CARDS = [
    ('northwest-coast', ['salish', 'na-dene', 'penutian', 'wakashan', 'chimakuan'],
     [('Makah', None), ('Quileute', None), ('Lower Chinook', None), ('Tillamook', None), ('Yurok', None)],
     'A narrow coast with at least five stocks side by side.'),
    ('plateau', ['penutian', 'salish', 'kutenai'],
     [('Nez Perce', 'nez-perce'), ('Yakima', None), ('Spokane', None), ('Flathead', None), ('Cayuse', None)],
     'Salish peoples to the north, Penutian peoples to the south.'),
    ('california', ['penutian', 'hokan-coahuiltecan', 'aztec-tanoan', 'yukian'],
     [('Pomo', None), ('Maidu', None), ('Yokuts', None), ('Chumash', None), ('Yuki', None)],
     'Many small territories, packed close together.'),
    ('great-basin', ['aztec-tanoan'],
     [('Shoshoni', 'shoshone'), ('Ute', 'ute'), ('Northern Paiute', None), ('Southern Paiute', None), ('Washo', None)],
     'One stock covers almost all of it.'),
    ('southwest', ['na-dene', 'hokan-coahuiltecan', 'aztec-tanoan', 'keres'],
     [('Navaho', 'navajo'), ('Papago', 'papago'), ('Pima', 'pima'), ('Hopi', None), ('Zuni', None), ('Chiricahua', None)],
     'The Pueblo towns along the Rio Grande sit among Na-Dene neighbors.'),
    ('plains', ['siouan-yuchi', 'aztec-tanoan', 'algonkian', 'caddoan'],
     [('Teton', 'sioux'), ('Crow', 'crow'), ('Cheyenne', 'cheyenne'), ('Comanche', 'comanche'), ('Pawnee', None), ('Osage', 'osage')],
     'The largest area on the sheet.'),
    ('northeast', ['algonkian', 'iroquoian'],
     [('Iroquois', 'iroquois'), ('Delaware', 'delaware'), ('Ojibwa', 'chippewa'), ('Winnebago', 'winnebago'), ('Fox', 'fox'), ('Shawnee', None)],
     'Iroquoian nations in the middle, mostly Algonkian peoples around them.'),
    ('southeast', ['gulf', 'siouan-yuchi', 'caddoan', 'iroquoian', 'timucua'],
     [('Cherokee', 'cherokee'), ('Muskogee', 'creek'), ('Choctaw', 'choctaw'), ('Chickasaw', 'chickasaw'), ('Catawba', 'catawba'), ('Tuscarora', 'tuscarora')],
     'The Gulf stock across the middle; Siouan and Iroquoian peoples in the Carolinas.'),
    ('desert', ['hokan-coahuiltecan'],
     [('Coahuiltec', None), ('Comecrudo', None), ('Carrizo', None)],
     'The smallest area on the sheet, in south Texas.'),
]
# Own name shown on a card: the first form the seed gives (Teton -> Lakota by name, not seed list)
CARD_OWN = {'sioux': 'Lakota', 'cherokee': 'Aniyvwiya', 'chippewa': 'Anishinaabe', 'winnebago': 'Ho-Chunk'}


def own_short(sid):
    if sid in CARD_OWN:
        return CARD_OWN[sid]
    s = N[sid]['self_name']
    return re.split(r' / |; | \(', s)[0]


def pts(d):
    v = [float(x) for x in re.findall(r'-?\d+(?:\.\d+)?', d)]
    return list(zip(v[0::2], v[1::2]))


def path_d(sub):
    """paths.json stores 'Mx y x y ...Z'; emit compact SVG 'Mx,y Lx,y ... Z' per subpath."""
    out = []
    for s in sub:
        p = pts(s)
        out.append('M' + ' '.join(f'{x:.0f},{y:.0f}' for x, y in p) + 'Z')
    return ''.join(out)


def mapbox_img(alt):
    return ('<picture><source srcset="./img/sturtevant-1967.webp" type="image/webp">'
            f'<img class="mapbox-img" src="./img/sturtevant-1967.jpg" width="2400" height="1630" alt="{e(alt)}" loading="lazy"></picture>')


def w1():
    out = ['      <!-- ============ WIDGET 1: MAP EXPLORER (D-016 highlight; D-017 fit) ============ -->',
           '      <!-- Every card is always visible. Tapping a region or a card adds .is-on to both. -->',
           '      <div class="widget wide" id="explorer">',
           '        <div class="widget-top">',
           '          <div class="widget-kicker">Interactive · Widget 1 of 4</div>',
           '          <div class="widget-title">Map Explorer</div>',
           '          <div class="widget-hint">Tap a region or a card. Both light up together.</div>',
           '        </div>',
           '        <div class="chips" role="group" aria-label="Highlight on the map">',
           '          <button type="button" class="chip" data-hl="nc" aria-pressed="false">North Carolina</button>',
           '          <button type="button" class="chip" data-hl="clear">Clear</button>',
           '        </div>',
           '        <div class="ex-grid">',
           '          <div class="ex-map">',
           '            <div class="mapbox">',
           '              ' + mapbox_img('The 1967 Sturtevant map of tribes, culture areas and language stocks, under simplified tracings of its nine culture areas.'),
           f'              <svg class="map-svg" viewBox="{VIEWBOX}" aria-label="The nine culture areas, traced from the 1967 map">']
    for a, *_ in CARDS:
        d = path_d(paths['areas'][a])
        nc = ' data-nc' if a == 'southeast' else ''
        out.append(f'                <path class="area" data-area="{a}"{nc} tabindex="0" role="button" aria-pressed="false" aria-label="{AREA_NAMES[a]}" d="{d}"/>')
    out += ['              </svg>',
            '            </div>',
            '            <p class="map-cap">Simplified tracings of the culture areas on the 1967 map.<span class="credit">Map: W. C. Sturtevant, National Atlas of the United States, USGS. Scan: Library of Congress, Geography and Map Division.</span></p>',
            '          </div>',
            '          <div class="ex-cards">']
    for a, stks, peoples, note in CARDS:
        nc_card = ' data-nc' if a == 'southeast' else ''
        out.append(f'            <div class="ex-card" data-area="{a}"{nc_card}>')
        out.append(f'              <button type="button" class="ex-name" data-area="{a}" aria-pressed="false">{AREA_NAMES[a]}</button>')
        out.append('              <p class="ex-stocks"><span class="k">Stocks</span> ' + ' · '.join(STOCK_NAMES[s] for s in stks) + '</p>')
        items = []
        for label, sid in peoples:
            nc = ' class="nc"' if sid and N[sid]['nc'] else ''
            own = f' · <span class="own">{e(own_short(sid))}</span>' if sid else ''
            items.append(f'<li{nc}>{e(label)}{own}</li>')
        out.append('              <ul class="ex-peoples">' + ''.join(items) + '</ul>')
        out.append(f'              <p class="ex-note">{e(note)}</p>')
        out.append('            </div>')
    out += ['          </div>', '        </div>', '      </div>',
            '      <!-- ============ /WIDGET 1 ============ -->']
    return '\n'.join(out)


# ---------- Widget 2 ----------
GROUPS = [
    ('Southeast', ['cherokee', 'creek', 'choctaw', 'chickasaw', 'catawba', 'tuscarora', 'seminole']),
    ('Northeast', ['iroquois', 'delaware', 'huron', 'fox', 'sauk', 'menominee', 'chippewa', 'winnebago']),
    ('Plains', ['sioux', 'blackfoot', 'crow', 'cheyenne', 'comanche', 'assiniboin', 'osage', 'omaha', 'ponca']),
    ('Southwest', ['navajo', 'apache', 'papago', 'pima']),
    ('Great Basin', ['shoshone', 'ute']),
    ('Plateau', ['nez-perce']),
]
KIND = {'outsider-name': ('outsider', 'Outsider name'), 'own-name-respelled': ('respelled', 'Own name, respelled')}
# label_origin in the seed describes the common label, not the printed one
ORIGIN_IS_SEED_LABEL = {'creek', 'sioux', 'apache', 'huron', 'seminole'}
SILENT_MEANING = ('not stated', 'not confirmed', 'no consensus', 'not stated by the nation')


def safe(u):
    assert urlparse(u).scheme in ('https', 'http'), u
    return u


def src_label(u):
    host = urlparse(u).netloc.replace('www.', '')
    if 'wikipedia' in host:
        return 'Wikipedia'
    if 'britannica' in host:
        return 'Britannica'
    return host


def w2():
    pub = [n for n in names if n['publish']]
    grouped = [i for _, ids in GROUPS for i in ids]
    assert sorted(grouped) == sorted(n['id'] for n in pub), 'every published name must be in exactly one group'
    out = ['      <!-- ============ WIDGET 2: NAMES THEN & NOW (static, D-014) ============ -->',
           '      <!-- Chips only tint rows (D-016). Rows come from names.seed.json, publish: true. -->',
           '      <div class="widget" id="names">',
           '        <div class="widget-top">',
           '          <div class="widget-kicker">Interactive · Widget 2 of 4</div>',
           '          <div class="widget-title">Names Then &amp; Now</div>',
           '          <div class="widget-hint">Every name is here. The buttons tint rows; nothing hides.</div>',
           '        </div>',
           '        <div class="chips" role="group" aria-label="Tint rows">',
           '          <button type="button" class="chip" data-hl="outsider" aria-pressed="false">Outsider names</button>',
           '          <button type="button" class="chip" data-hl="respelled" aria-pressed="false">Own names, respelled</button>',
           '          <button type="button" class="chip" data-hl="nc" aria-pressed="false">North Carolina</button>',
           '          <button type="button" class="chip" data-hl="clear">Clear</button>',
           '        </div>',
           '        <table class="names-tbl">',
           '          <thead><tr><th scope="col">On the map</th><th scope="col">In their own words</th></tr></thead>',
           '          <tbody>']
    for gname, ids in GROUPS:
        out.append(f'            <tr class="grp"><th colspan="2" scope="colgroup">{gname}</th></tr>')
        for i in ids:
            n = N[i]
            kind, kind_txt = KIND[n['label_kind']]
            tags = [kind] + (['nc'] if n['nc'] else [])
            lab = n['map_label']
            left = []
            if lab == '(not printed)':
                left.append('<span class="lbl-map none">Not printed</span>')
            else:
                left.append(f'<span class="lbl-map">{e(lab)}</span>')
            if n['nc']:
                left.append('<span class="nc-tag">NC</span>')
            # Where the map prints something other than the common label, the tag and the
            # origin line name the common label they describe (ruling R3).
            other = n.get('seed_label') if i in ORIGIN_IS_SEED_LABEL else None
            if n.get('map_note'):
                left.append(f'<span class="kind">{kind_txt}: “{e(n["seed_label"])}”</span>')
                left.append(f'<span class="nm-line">{e(n["map_note"])}</span>')
            else:
                left.append(f'<span class="kind">{kind_txt}</span>')
            about = f'“{e(other)}” from' if other else 'Label from'
            left.append(f'<span class="nm-line"><span class="k">{about}</span> {e(n["label_origin"])}</span>')
            if n['still_uses_label']:
                common = n.get('seed_label', lab)
                left.append(f'<span class="still">“{e(common)}” still in official use</span>')
            right = [f'<span class="self">{e(n["self_name"])}</span>']
            m = n['meaning']
            if m and not m.lower().startswith(SILENT_MEANING):
                right.append(f'<span class="nm-line"><span class="k">Meaning</span> {e(m)}</span>')
            right.append(f'<span class="nm-line"><span class="k">Today</span> {e(n["nations_today"])}</span>')
            # Every non-empty caution needs a reviewed reader_note (empty is allowed, with reader_note_why)
            assert 'reader_note' in n and (n['reader_note'] or not n['caution'] or n.get('reader_note_why')), i
            if n['reader_note']:
                right.append(f'<span class="nm-line note">{e(n["reader_note"])}</span>')
            links = ' · '.join(f'<a href="{e(safe(u))}">{e(src_label(u))}</a>' for u in n['sources'])
            right.append(f'<span class="nm-src"><span class="k">Source</span> {links}</span>')
            out.append(f'            <tr class="nm-row" data-tags="{" ".join(tags)}">')
            out.append('              <td class="on-map">' + ''.join(left) + '</td>')
            out.append('              <td class="own-words">' + ''.join(right) + '</td>')
            out.append('            </tr>')
    out += ['          </tbody>', '        </table>', '      </div>',
            '      <!-- ============ /WIDGET 2 ============ -->']
    return '\n'.join(out)


# ---------- Widget 3: the tree. Peoples are labels as printed, in that stock's color on the sheet ----------
TREE = [
    ('na-dene', 'Navaho, Chiricahua, Mescalero, Jicarilla and Lipan in the Southwest; Kiowa Apache on the southern Plains; California Athapaskan peoples on the Pacific coast. Their relatives also live in Alaska and western Canada.'),
    ('algonkian', 'From the Blackfoot in Montana to the Delaware and Penobscot on the Atlantic, with the Yurok and Wiyot on the California coast.'),
    ('siouan-yuchi', 'Crow and Teton on the northern Plains; Osage and Winnebago farther east; Catawba and Tutelo in the Carolinas and Virginia; Biloxi on the Gulf.'),
    ('iroquoian', 'The Iroquois (Mohawk, Oneida, Onondaga, Cayuga, Seneca) in New York; the Tuscarora in North Carolina; the Cherokee in the southern mountains.'),
    ('gulf', 'Choctaw, Chickasaw, Muskogee and Alabama; Natchez, Tunica, Chitimacha and Atakapa toward the Mississippi.'),
    ('caddoan', 'Caddo and Wichita in the south; Pawnee and Arikara far up the Missouri.'),
    ('aztec-tanoan', 'Shoshoni and Ute in the Great Basin; Comanche and Kiowa on the southern Plains; Hopi, Tewa, Papago and Pima in the Southwest.'),
    ('hokan-coahuiltecan', 'Pomo and Chumash in California; Washo, Walapai and Yavapai inland; Coahuiltec in south Texas.'),
    ('penutian', 'Nez Perce and Yakima on the Plateau; Klamath, Maidu and Yokuts in California; Zuni in New Mexico.'),
    ('salish', 'Flathead, Spokane and Kalispel inland; Tillamook and Chehalis on the coast.'),
    ('keres', 'The Keres pueblos, among them Acoma, Laguna, Cochiti and Santo Domingo.'),
    ('yukian', 'Yuki and Wappo, in northern California.'),
    ('chimakuan', 'Chemakum and Quileute, in northwest Washington.'),
    ('wakashan', 'Makah, at the northwest tip of Washington.'),
    ('kutenai', 'Kutenai, at the Canadian border.'),
    ('tonkawa', 'Tonkawa, in central Texas.'),
    ('karankawa', 'Karankawa, on the Texas coast.'),
    ('timucua', 'Timucua, in northern Florida.'),
    ('insufficient', 'Gray on the map: peoples too thinly recorded to classify, among them the Calusa of south Florida and peoples of the Carolina piedmont.'),
]


def centroid(sub):
    p = max((pts(s) for s in sub), key=len)
    xs, ys = zip(*p)
    return sum(xs) / len(xs), sum(ys) / len(ys)


LABEL_NUDGE = {'northwest-coast': (-10, -40), 'california': (5, 40), 'northeast': (60, 40), 'desert': (0, 25), 'plateau': (0, 0)}


def w3():
    assert set(t for t, _ in TREE) == set(palette), 'tree must cover every traced stock'
    assert sorted(s['stock_1967'] for s in stocks) == sorted(STOCK_NAMES[t] for t, _ in TREE if t != 'insufficient'), 'table and tree name the same 18 stocks'
    out = ['      <!-- ============ WIDGET 3: THREE LENSES (D-016 highlight; D-017 fit) ============ -->',
           '      <!-- Both layers are always drawn. Chips strengthen one layer; the tree lights one stock. -->',
           '      <div class="widget wide" id="lenses">',
           '        <div class="widget-top">',
           '          <div class="widget-kicker">Interactive · Widget 3 of 4</div>',
           '          <div class="widget-title">Three Lenses</div>',
           '          <div class="widget-hint">Lines are culture areas; colors are language stocks. Tap a stock to light it up.</div>',
           '        </div>',
           '        <div class="chips" role="group" aria-label="Choose a lens">',
           '          <button type="button" class="chip" data-mode="culture" aria-pressed="false">Culture</button>',
           '          <button type="button" class="chip" data-mode="language" aria-pressed="false">Language</button>',
           '          <button type="button" class="chip" data-mode="clear">Clear</button>',
           '        </div>',
           '        <div class="ln-grid">',
           '          <div class="ln-map">',
           f'            <svg class="map-svg" viewBox="{VIEWBOX}" role="group" aria-label="Language stocks in color, with the nine culture areas outlined, traced from the 1967 map">',
           '              <g class="fams">']
    for t, _ in TREE:
        out.append(f'                <path class="fam" data-fam="{t}" style="--c:{palette[t]}" tabindex="0" role="button" aria-pressed="false" aria-label="{STOCK_NAMES[t]}" d="{path_d(paths["families"][t])}"/>')
    out.append('              </g>')
    out.append('              <g class="cas">')
    for a in AREA_NAMES:
        out.append(f'                <path class="ca" d="{path_d(paths["areas"][a])}"/>')
    out.append('              </g>')
    out.append('              <g class="ca-lbls" aria-hidden="true">')
    for a, nm in AREA_NAMES.items():
        x, y = centroid(paths['areas'][a])
        dx, dy = LABEL_NUDGE.get(a, (0, 0))
        if a == 'northwest-coast':  # runs up the coast at an angle, as the 1967 sheet prints it
            out.append(f'                <text transform="translate(150 330) rotate(-74)">{nm}</text>')
            continue
        out.append(f'                <text x="{x + dx:.0f}" y="{y + dy:.0f}">{nm}</text>')
    out += ['              </g>', '            </svg>',
            '            <p class="map-cap">Simplified tracing of the 1967 map, recolored.<span class="credit">Map: W. C. Sturtevant, National Atlas of the United States, USGS. Scan: Library of Congress, Geography and Map Division.</span></p>',
            '          </div>',
            '          <div class="ln-tree">',
            '            <p class="tree-hd">The stocks as branches, with far-apart relatives</p>',
            '            <ul class="tree">']
    for t, kin in TREE:
        out.append(f'              <li><button type="button" class="stock" data-fam="{t}" aria-pressed="false"><span class="sw" style="--c:{palette[t]}"></span>{STOCK_NAMES[t]}</button><span class="kin">{e(kin)}</span></li>')
    out += ['            </ul>', '          </div>', '        </div>',
            '        <table class="stocks-tbl">',
            '          <caption>The 1967 stocks today' + (' <span class="draft">Draft: awaiting ruling</span>' if any(not x.get('ruled') for x in stocks) else '') + '</caption>',
            '          <thead><tr><th scope="col">Stock, as printed in 1967</th><th scope="col">How linguists class it today</th></tr></thead>',
            '          <tbody>']
    for s in stocks:
        out.append(f'            <tr><th scope="row">{e(s["stock_1967"])}</th><td>{e(s["today"])}</td></tr>')
    out += ['          </tbody>', '        </table>',
            '        <p class="tbl-note">After L. Campbell, <cite>American Indian Languages</cite> (1997); M. Mithun, <cite>The Languages of Native North America</cite> (1999); I. Goddard, ed., <cite>Handbook of North American Indians</cite>, vol. 17 (1996).</p>',
            '      </div>', '      <!-- ============ /WIDGET 3 ============ -->']
    return '\n'.join(out)


# ---------- Widget 4 ----------
ORDER = ['chickasaw', 'choctaw', 'poarch-creek', 'muscogee-fire', 'cherokee', 'catawba',
         'haudenosaunee', 'oneida', 'lenape', 'anishinaabe', 'ho-chunk', 'dine', 'hopi']
LANE_B_FOR = {'chickasaw': 'muskogean', 'choctaw': 'muskogean', 'poarch-creek': 'muskogean',
              'muscogee-fire': 'muskogean', 'cherokee': 'iroquoian', 'catawba': 'siouan-catawban',
              'haudenosaunee': 'iroquoian', 'oneida': 'iroquoian', 'lenape': 'algonquian',
              'anishinaabe': 'algonquian', 'ho-chunk': 'siouan-catawban', 'dine': 'athabaskan',
              'hopi': 'uto-aztecan'}
MIGRATION = {'chickasaw', 'choctaw', 'poarch-creek'}
BADGE = {'winter': ('b-winter', 'Winter story'), 'sacred-place': ('b-sacred', 'Sacred place'),
         'restricted': ('b-held', 'Held by the Nation'), 'permission': ('b-ask', 'Ask permission'),
         'caution': ('b-ask', 'Ask permission')}
LANE_A_NOTES = {
    'choctaw': 'Nvnih Waiya is a sacred site. Visits need permission from the Mississippi Band of Choctaw Indians.',
    'muscogee-fire': 'A story of continuity after removal, not a migration account.',
    'oneida': 'The Nation notes that this is a shortened telling; the full story takes days.',
    'lenape': 'The Delaware Nation urges caution about publishing Lenape culture and asks people to contact its Historic Preservation Office.',
    'anishinaabe': 'Many Ojibwe stories are told only in winter, so this stays at outline length.',
    'cherokee': 'Tribal Council protected Kituwah in 2013.',
    'dine': 'Emergence stories are told in winter, so this stays at outline length.',
    'hopi': 'The Hopi Cultural Preservation Office asks that Hopi stories not be published without the Tribe\'s permission. This row gives a one-line outline only.',
}


def w4():
    A = {a['id']: a for a in origins['lane_a']}
    B = {b['family']: b for b in origins['lane_b']}
    assert sorted(ORDER) == sorted(A), 'every Lane A account appears once'
    out = ['      <!-- ============ WIDGET 4: ORIGINS & HOMELANDS (static, D-014) ============ -->',
           '      <!-- Two lanes per row, never merged (spec §11). Chips only tint rows (D-016). -->',
           '      <div class="widget" id="origins">',
           '        <div class="widget-top">',
           '          <div class="widget-kicker">Interactive · Widget 4 of 4</div>',
           '          <div class="widget-title">Origins &amp; Homelands</div>',
           '          <div class="widget-hint">Two kinds of account, side by side. Neither lane corrects the other.</div>',
           '        </div>',
           '        <div class="chips" role="group" aria-label="Tint rows">',
           '          <button type="button" class="chip" data-hl="nc" aria-pressed="false">North Carolina</button>',
           '          <button type="button" class="chip" data-hl="winter" aria-pressed="false">Winter stories</button>',
           '          <button type="button" class="chip" data-hl="migration" aria-pressed="false">Shared migration</button>',
           '          <button type="button" class="chip" data-hl="clear">Clear</button>',
           '        </div>',
           '        <ul class="badge-key" aria-label="What the marks mean">',
           '          <li><span class="badge b-winter">Winter story</span> Told in winter; kept to an outline here</li>',
           '          <li><span class="badge b-sacred">Sacred place</span> Names a place the nation protects</li>',
           '          <li><span class="badge b-held">Held by the Nation</span> Kept for the nation\'s own members</li>',
           '          <li><span class="badge b-ask">Ask permission</span> The nation asks to be contacted first</li>',
           '        </ul>',
           '        <div class="org-head" aria-hidden="true"><span>What the nations tell</span><span>What linguists reconstruct</span></div>',
           '        <div class="org-rows">']
    for i in ORDER:
        a = A[i]
        b = B[LANE_B_FOR[i]]
        tags = []
        if 'nc' in a['tags']:
            tags.append('nc')
        if 'winter' in a['tags']:
            tags.append('winter')
        if i in MIGRATION:
            tags.append('migration')
        badges = ''.join(f'<span class="badge {BADGE[t][0]}">{BADGE[t][1]}</span>' for t in a['tags'] if t in BADGE)
        nc = '<span class="nc-tag">NC</span>' if 'nc' in a['tags'] else ''
        url = safe(a['source'])
        ltxt = "The Nation's archive record (members only)" if 'restricted' in a['tags'] else "The Nation's own page"
        para = a.get('page_text', a['paraphrase'])
        note = ''
        if i in LANE_A_NOTES:
            extra = ''
            if a.get('permission_link'):
                extra = f' <a href="{e(safe(a["permission_link"]))}">Hopi Cultural Preservation Office</a>'
            note = f'<p class="org-note">{e(LANE_A_NOTES[i])}{extra}</p>'
        out.append(f'          <div class="org-row" data-tags="{" ".join(tags)}">')
        out.append('            <div class="lane lane-a"><span class="lane-lbl">What the nations tell</span>'
                   f'<p class="org-nation">{e(a["nation"])}{nc}</p>'
                   + (f'<p class="badges">{badges}</p>' if badges else '')
                   + f'<p>{e(para)}</p>{note}<p class="org-src"><a href="{e(url)}">{ltxt}</a></p></div>')
        out.append('            <div class="lane lane-b"><span class="lane-lbl">What linguists reconstruct</span>'
                   f'<p class="org-nation">{e(b["name"])}</p><p>{e(b["homeland"])}</p>'
                   f'<p class="status">{e(b["status"])}</p><p class="cite">{e(b["cite"])}</p></div>')
        out.append('          </div>')
    out += ['        </div>', '      </div>', '      <!-- ============ /WIDGET 4 ============ -->']
    return '\n'.join(out)


import sys
DRAFT = '--draft' in sys.argv
unruled = [x['stock_1967'] for x in stocks if not x.get('ruled')]
if unruled and not DRAFT:
    sys.exit(f'Refusing to publish {len(unruled)} unruled stock rows (D-023). Rule them in families.seed.json, or build with --draft.')

page = (Path(__file__).with_name('page.template.html')).read_text(encoding='utf-8')
for k, f in (('{{W1}}', w1), ('{{W2}}', w2), ('{{W3}}', w3), ('{{W4}}', w4)):
    assert page.count(k) == 1, k
    page = page.replace(k, f())
OUT.write_text(page, encoding='utf-8', newline='\n')
print(OUT, len(page.encode('utf-8')), 'bytes')
