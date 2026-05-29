// generators.js — shared CSPRNG, word lists, and strength estimator.
// Plain JS (no JSX) so each direction loads them off `window.PassReg`.
(function () {
  const ADJ = [
    "tiny","brave","quiet","loud","sleek","wild","still","glossy","amber","keen",
    "brisk","fond","plump","spry","vast","grim","sly","bold","rough","calm",
    "lush","mute","neat","odd","prime","quirk","sage","tame","vivid","ample",
    "stark","blunt","clean","crisp","frail","lone","ripe","stout","sunny","wry"
  ];
  const VERB = [
    "digs","leaps","hums","spies","wades","prowls","drifts","mends","wrings","cooks",
    "seals","forges","stalks","molds","plots","tames","rouses","whisks","carves","shears",
    "names","binds","crests","posts","reads","sings","tilts","veers","weighs","yields",
    "files","sorts","tunes","prints","greets","studies"
  ];
  const NOUN = [
    "tiger","bear","fox","wren","kelp","brick","loom","crate","stone","atlas",
    "prism","ember","wagon","forest","river","steam","badge","ledger","kettle","comet",
    "quartz","willow","cliff","harbor","cedar","copper","flint","glade","marsh","onyx",
    "plume","raven","barley","feather","beacon","linen"
  ];
  const SYMBOLS = "!@#$%^&*?";

  function randUint32() {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0];
  }
  function randInt(min, max) { return min + (randUint32() % (max - min + 1)); }
  function pick(arr) { return arr[randUint32() % arr.length]; }
  function cap(s) { return s[0].toUpperCase() + s.slice(1); }

  function generateMemorable(opts) {
    const a = cap(pick(ADJ));
    const v = cap(pick(VERB));
    const n = cap(pick(NOUN));
    let n2 = pick(NOUN);
    while (n2 === n.toLowerCase()) n2 = pick(NOUN);
    const memo = `a ${a.toLowerCase()} ${n.toLowerCase()} ${v.toLowerCase()} ${n2}`;
    const d1 = opts.digits ? String(randInt(10, 99)) : "";
    const d2 = opts.digits ? String(randInt(10, 99)) : "";
    const symbol = opts.symbols ? SYMBOLS[randUint32() % SYMBOLS.length] : null;
    const dash = opts.dashes ? ((randUint32() & 1) ? "-" : "_") : null;
    const sep1 = symbol || dash || ".";
    const sep2 = dash || symbol || ".";
    return { password: `${a}${d1}${sep1}${v}${d2}${sep2}${n}`, memo };
  }

  function generateRandom(opts) {
    let charset = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
    if (opts.digits)  charset += "23456789";
    if (opts.symbols) charset += SYMBOLS;
    if (opts.dashes)  charset += "-_";
    const len = Math.max(4, Math.min(64, opts.length || 20));
    const buf = new Uint32Array(len);
    crypto.getRandomValues(buf);
    let pw = "";
    for (let i = 0; i < len; i++) pw += charset[buf[i] % charset.length];
    return { password: pw, memo: null };
  }

  function strengthOf(pw) {
    let csize = 0;
    if (/[a-z]/.test(pw)) csize += 26;
    if (/[A-Z]/.test(pw)) csize += 26;
    if (/[0-9]/.test(pw)) csize += 10;
    if (/[-_]/.test(pw)) csize += 2;
    if (new RegExp(`[${SYMBOLS.replace(/[\^\-\]]/g, "\\$&")}]`).test(pw)) csize += SYMBOLS.length;
    if (csize === 0) csize = 26;
    const bits = pw.length * Math.log2(csize);
    let label, tone;
    if (bits < 40)      { label = "Weak";        tone = "weak"; }
    else if (bits < 60) { label = "Fair";        tone = "fair"; }
    else if (bits < 80) { label = "Strong";      tone = "good"; }
    else                { label = "Very Strong"; tone = "good"; }
    return { bits: Math.round(bits), label, tone, ratio: Math.min(1, bits / 100) };
  }

  // Default options bag — every direction starts here.
  const DEFAULT_OPTS = { symbols: true, dashes: true, digits: true, length: 20 };

  window.PassReg = {
    generateMemorable, generateRandom, strengthOf,
    SYMBOLS, DEFAULT_OPTS,
  };
})();
