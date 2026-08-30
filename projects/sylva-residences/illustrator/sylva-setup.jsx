/*
  Sylva Residences — Illustrator project setup script
  Run from Illustrator: File > Scripts > Other Script… > sylva-setup.jsx

  Creates (or updates) a document with:
   - two swatch groups, "Sylva - Light" and "Sylva - Dark", as named global swatches
   - three artboards sized for the wordmark lockup, palette sheet, and type specimen

  This is a starting point, not a substitute for the .ase libraries in ../assets/swatches —
  use whichever fits the workflow. Re-running is safe: existing swatches with matching names
  are reused rather than duplicated.
*/

(function () {
  var LIGHT = {
    "Stone": "EFE4D2",
    "Stone 2": "F7F0E4",
    "Ink": "211913",
    "Ink Soft": "5B4E42",
    "Copper": "8C5943",
    "Sage": "5A5B40",
    "Umber": "4F2A19",
    "Rule": "DCCEB2",
    "Card": "FBF7EF"
  };

  var DARK = {
    "Stone": "191512",
    "Stone 2": "1F1A15",
    "Ink": "F0E6D8",
    "Ink Soft": "C7B9A8",
    "Copper": "C97F5C",
    "Sage": "9AA073",
    "Umber": "8C5A3C",
    "Rule": "3A2F24",
    "Card": "211B15"
  };

  function hexToRGBColor(hex) {
    var c = new RGBColor();
    c.red = parseInt(hex.substring(0, 2), 16);
    c.green = parseInt(hex.substring(2, 4), 16);
    c.blue = parseInt(hex.substring(4, 6), 16);
    return c;
  }

  function findSwatch(doc, name) {
    try {
      return doc.swatches.getByName(name);
    } catch (e) {
      return null;
    }
  }

  function addSwatchGroup(doc, groupLabelPrefix, tokens) {
    for (var key in tokens) {
      if (!tokens.hasOwnProperty(key)) continue;
      var swatchName = groupLabelPrefix + " / " + key;
      if (findSwatch(doc, swatchName)) continue;

      // Use a Spot with colorType PROCESSCOLOR: this is how Illustrator represents a
      // named *global* swatch (editable everywhere it's used) without spot-ink print behavior.
      var spot = doc.spots.add();
      spot.name = swatchName;
      spot.colorType = SpotColorKind.PROCESSCOLOR;
      spot.color = hexToRGBColor(tokens[key]);
    }
  }

  function ensureDoc() {
    if (app.documents.length > 0) return app.documents[0];
    var preset = new DocumentPreset();
    preset.width = 1200;
    preset.height = 1200;
    preset.units = RulerUnits.Points;
    preset.colorMode = DocumentColorSpace.RGB;
    return app.documents.addDocument(DocumentColorSpace.RGB, preset);
  }

  var doc = ensureDoc();

  addSwatchGroup(doc, "Sylva Light", LIGHT);
  addSwatchGroup(doc, "Sylva Dark", DARK);

  // Three working artboards, laid out left to right, 200pt gutters.
  var ab = doc.artboards;
  var specs = [
    { name: "Sylva - Wordmark Lockup", w: 1200, h: 800 },
    { name: "Sylva - Palette Sheet", w: 1200, h: 800 },
    { name: "Sylva - Type Specimen", w: 1200, h: 1000 }
  ];

  var x = 0;
  var gutter = 200;
  for (var i = 0; i < specs.length; i++) {
    var s = specs[i];
    var rect = [x, 0, x + s.w, -s.h]; // Illustrator artboard rect: [left, top, right, bottom], top-down Y
    if (ab.length > i) {
      ab[i].artboardRect = rect;
      ab[i].name = s.name;
    } else {
      var newAb = ab.add(rect);
      newAb.name = s.name;
    }
    x += s.w + gutter;
  }

  alert(
    "Sylva setup complete.\n\n" +
    "Swatches added under 'Sylva Light / …' and 'Sylva Dark / …' in the Swatches panel.\n" +
    "Three artboards created: Wordmark Lockup, Palette Sheet, Type Specimen.\n\n" +
    "Fonts required for the wordmark: Manrope (ExtraBold), Poppins (Light), Newsreader (Light Italic) — " +
    "install from Google Fonts if Illustrator flags them as missing."
  );
})();
