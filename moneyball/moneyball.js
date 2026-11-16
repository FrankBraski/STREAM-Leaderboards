/* MoneyBall — STREAM scholarships & career opportunities
   Donovan Catholic, Athens GA
   Shared engine for moneyball.html and moneyball-panel.html
*/
(function () {
  "use strict";

  const TZ = "America/New_York";

  const CLASS_ALIASES = {
    cs1: "CS1",
    cs2: "CS2",
    "stream lab 102": "LAB102",
    lab102: "LAB102",
    "lab 102": "LAB102",
    "stream lab102": "LAB102",
    "stream team": "TEAM",
    team: "TEAM",
    "ms stream 101": "MS101",
    ms101: "MS101",
    "ms stream101": "MS101",
    "middle school": "MS101",
    "middle school stream": "MS101",
    "ms stream": "MS101"
  };

  const CLASS_LABELS = {
    CS1: "CS1",
    CS2: "CS2",
    LAB102: "STREAM Lab 102",
    MS101: "MS STREAM 101",
    TEAM: "STREAM Team"
  };

  /* Evergreen "your future" tiles for MS STREAM 101.
     Labeled as goals, never as deadlines. */
  const MS101_GOALS = [
    {
      name: "Athens Tech Dual Enrollment",
      sponsor: "Athens Technical College / Georgia Dual Enrollment",
      type: "goal",
      award: "Free college credit (tuition covered by GA Dual Enrollment)",
      award_usd: null,
      grades: "Start in 10th grade",
      deadline: "",
      deadline_et: "",
      other_dates: "",
      url: "https://athenstech.edu/programs/high-school-programs/dual-enrollment/",
      blurb: "Earn real college credit for free once you hit 10th grade. Private-school students qualify. Aim now so you're ready then.",
      classes: "MS STREAM 101",
      flags: "GOAL — not a deadline. Dual enrollment starts in 10th grade.",
      source_pulled: "evergreen",
      _goalLabel: "Goal: start in 10th grade"
    },
    {
      name: "Coolidge Scholarship",
      sponsor: "Calvin Coolidge Presidential Foundation",
      type: "goal",
      award: "Full ride (tuition, room, board, fees) at any U.S. college",
      award_usd: null,
      grades: "Apply in 11th grade",
      deadline: "",
      deadline_et: "",
      other_dates: "",
      url: "https://coolidgescholars.org/eligibility/",
      blurb: "A merit full ride to any U.S. college — yes, a full ride. It's a junior-year application. Keep your grades and writing in fighting shape.",
      classes: "MS STREAM 101",
      flags: "GOAL — not a deadline. Junior-year aim. Application opens when you're in 11th grade.",
      source_pulled: "evergreen",
      _goalLabel: "Goal: apply junior year"
    }
  ];

  const FALLBACK = {
  "generated": "2026-11-16",
  "timezone": "America/New_York",
  "note": "Upcoming and rolling only. Past: Space Apps (Nov 15), Robertson (Nov 15), Elks, JKC, Regeneron, NCWIT, Congressional App Challenge.",
  "items": [
    {
      "name": "Greenhouse Scholars – Part 1",
      "sponsor": "Greenhouse Scholars",
      "type": "scholarship",
      "award": "Up to ~$44,000 over 4 yrs (est.: $5k tuition + $6k flex per yr) plus mentoring",
      "award_usd": 44000,
      "grades": "12",
      "deadline": "2026-11-16",
      "deadline_et": "2026-11-16 (no clock time stated)",
      "other_dates": "Part 1 only; later parts follow",
      "url": "https://apply.greenhousescholars.com/",
      "blurb": "Georgia seniors with a 3.5+ GPA and family income up to $80k: money plus a mentor team. Due TODAY.",
      "classes": "CS2|STREAM Team",
      "flags": "Award total is an estimate; deadline time not stated; due today Nov 16",
      "source_pulled": "2026-11-05 to 2026-11-13 (ET)"
    },
    {
      "name": "STEM Next x Panasonic AI Innovation Challenge",
      "sponsor": "STEM Next Opportunity Fund / Panasonic",
      "type": "competition",
      "award": "$5,000 program prize",
      "award_usd": 5000,
      "grades": "unconfirmed (team/program entry)",
      "deadline": "2026-11-19",
      "deadline_et": "2026-11-19 11:59 PM ET",
      "other_dates": "",
      "url": "https://stemnext.org/ai-innovation-challenge/",
      "blurb": "Pitch a real AI project as a team for a $5k prize. FireSpotter proposal already drafted.",
      "classes": "STREAM Team|CS2|STREAM Lab 102",
      "flags": "Grade eligibility unconfirmed; deadline time assumed 11:59 PM ET",
      "source_pulled": "2026-11-05 to 2026-11-13 (ET)"
    },
    {
      "name": "NHS Scholarship",
      "sponsor": "National Honor Society (NASSP)",
      "type": "scholarship",
      "award": "Up to $25,000",
      "award_usd": 25000,
      "grades": "12",
      "deadline": "2026-11-20",
      "deadline_et": "2026-11-20 5:00 PM ET",
      "other_dates": "",
      "url": "https://www.nationalhonorsociety.org/the-nhs-scholarship/",
      "blurb": "NHS senior members can compete for up to $25k.",
      "classes": "CS2|STREAM Team",
      "flags": "Requires an active NHS chapter membership; Donovan chapter status unconfirmed",
      "source_pulled": "2026-11-05 to 2026-11-13 (ET)"
    },
    {
      "name": "Coolidge Scholarship",
      "sponsor": "Calvin Coolidge Presidential Foundation",
      "type": "scholarship",
      "award": "Full ride (tuition, room, board, fees) at any U.S. college",
      "award_usd": null,
      "grades": "11",
      "deadline": "2026-12-01",
      "deadline_et": "2026-12-01 8:00 PM ET (5 PM PT)",
      "other_dates": "",
      "url": "https://coolidgescholars.org/eligibility/",
      "blurb": "Juniors: a merit full ride to any U.S. college. Yes, a full ride.",
      "classes": "CS1|CS2|STREAM Team|STREAM Lab 102",
      "flags": "",
      "source_pulled": "2026-11-05 to 2026-11-13 (ET)"
    },
    {
      "name": "Mercer University FIRST Scholarship",
      "sponsor": "Mercer University",
      "type": "scholarship",
      "award": "$1,000/yr, renewable up to 4 yrs",
      "award_usd": 4000,
      "grades": "12",
      "deadline": "2026-12-01",
      "deadline_et": "2026-12-01 (time not stated)",
      "other_dates": "",
      "url": "https://sites.google.com/donovanathens.org/roborams/scholarship-opportunities",
      "blurb": "FIRST robotics alumni heading to Mercer get $1k a year.",
      "classes": "STREAM Team",
      "flags": "award_usd is 4-yr total (est.); URL is our listing page, official link listed there",
      "source_pulled": "2026-11-05 to 2026-11-13 (ET)"
    },
    {
      "name": "Burger King Scholars",
      "sponsor": "Burger King Foundation",
      "type": "scholarship",
      "award": "$1,000–$60,000",
      "award_usd": 60000,
      "grades": "12",
      "deadline": "2026-12-15",
      "deadline_et": "2026-12-16 12:59 AM ET (Dec 15 11:59 PM CT)",
      "other_dates": "Only the first 30,000 applications are reviewed — apply early",
      "url": "https://burgerking.scholarsapply.org/",
      "blurb": "Seniors with a 2.0+ GPA: up to $60k, but only the first 30,000 apps count, so go early.",
      "classes": "CS1|CS2|STREAM Lab 102|STREAM Team",
      "flags": "May close early at 30,000 apps",
      "source_pulled": "2026-11-05 to 2026-11-13 (ET)"
    },
    {
      "name": "Amazon Future Engineer Scholarship",
      "sponsor": "Amazon / Scholarship America",
      "type": "scholarship",
      "award": "Up to $40,000 (+ Amazon internship offer)",
      "award_usd": 40000,
      "grades": "12",
      "deadline": "2027-01-05",
      "deadline_et": "2027-01-05 4:00 PM ET (3 PM CT)",
      "other_dates": "",
      "url": "https://scholarshipamerica.org/scholarship/amazonfutureengineer/",
      "blurb": "Seniors heading into computer science: up to $40k from Amazon. Private-school students OK.",
      "classes": "CS1|CS2|STREAM Team",
      "flags": "",
      "source_pulled": "2026-11-05 to 2026-11-13 (ET)"
    },
    {
      "name": "Georgia Tech FIRST Scholarship",
      "sponsor": "Georgia Institute of Technology",
      "type": "scholarship",
      "award": "$5,000 one-time, need-based",
      "award_usd": 5000,
      "grades": "12",
      "deadline": "2027-01-31",
      "deadline_et": "2027-01-31 (time not stated)",
      "other_dates": "",
      "url": "https://sites.google.com/donovanathens.org/roborams/scholarship-opportunities",
      "blurb": "FIRST robotics kids headed to Georgia Tech: $5k toward the first year.",
      "classes": "STREAM Team",
      "flags": "URL is our listing page, official link listed there",
      "source_pulled": "2026-11-05 to 2026-11-13 (ET)"
    },
    {
      "name": "SME Education Foundation Scholarships",
      "sponsor": "SME Education Foundation",
      "type": "scholarship",
      "award": "$2,500–$20,000",
      "award_usd": 20000,
      "grades": "12 (and college students)",
      "deadline": "2027-02-01",
      "deadline_et": "2027-02-01 (time not stated)",
      "other_dates": "",
      "url": "https://sites.google.com/donovanathens.org/roborams/scholarship-opportunities",
      "blurb": "Into making, manufacturing, or engineering? SME pays $2.5k–$20k.",
      "classes": "STREAM Team|STREAM Lab 102",
      "flags": "URL is our listing page, official link listed there",
      "source_pulled": "2026-11-05 to 2026-11-13 (ET)"
    },
    {
      "name": "mikeroweWORKS Work Ethic Scholarship",
      "sponsor": "mikeroweWORKS Foundation",
      "type": "scholarship",
      "award": "Varies (no fixed amount published)",
      "award_usd": null,
      "grades": "12 and graduates",
      "deadline": "",
      "deadline_et": "2027 window not posted yet",
      "other_dates": "2026 window closed Oct 31, 2026",
      "url": "https://mikeroweworks.org/scholarship/",
      "blurb": "Want to be a welder, electrician, plumber, or HVAC tech? Money for 2-year-or-less trade programs. Sign the S.W.E.A.T. Pledge.",
      "classes": "STREAM Lab 102|STREAM Team",
      "flags": "Rolling/TBD: next window not announced; U.S. citizens only",
      "source_pulled": "2026-11-05 to 2026-11-13 (ET)"
    },
    {
      "name": "Athens Tech Dual Enrollment",
      "sponsor": "Athens Technical College / Georgia Dual Enrollment",
      "type": "camp",
      "award": "Free college credit (tuition covered by GA Dual Enrollment)",
      "award_usd": null,
      "grades": "10-12",
      "deadline": "",
      "deadline_et": "Rolling, by semester",
      "other_dates": "",
      "url": "https://athenstech.edu/programs/high-school-programs/dual-enrollment/",
      "blurb": "Earn real college credit for free while still at Donovan. Private-school 10th–12th graders qualify.",
      "classes": "CS1|CS2|STREAM Lab 102|STREAM Team",
      "flags": "type is 'camp' as closest category (really a college-credit program); semester deadlines not pulled",
      "source_pulled": "2026-11-05 to 2026-11-13 (ET)"
    }
  ]
};

  function qs() {
    return new URLSearchParams(location.search);
  }

  function getNow() {
    const raw = qs().get("now");
    if (raw) {
      const d = new Date(raw);
      if (!isNaN(+d)) return d;
    }
    return new Date();
  }

  function classKey(raw) {
    if (raw == null || raw === "") return null;
    const trimmed = String(raw).trim();
    if (CLASS_LABELS[trimmed]) return trimmed;
    const k = trimmed.toLowerCase().replace(/[_|]+/g, " ").replace(/\s+/g, " ");
    return CLASS_ALIASES[k] || null;
  }

  function tokensToKeys(classes) {
    if (!classes) return [];
    return String(classes)
      .split("|")
      .map(function (s) { return s.trim(); })
      .filter(Boolean)
      .map(function (t) { return classKey(t) || t; });
  }

  function zonedDate(ymd, hour, min, sec) {
    const parts = ymd.split("-").map(Number);
    const y = parts[0], mo = parts[1], d = parts[2];
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    });
    function read(ms) {
      const p = {};
      fmt.formatToParts(new Date(ms)).forEach(function (x) {
        if (x.type !== "literal") p[x.type] = x.value;
      });
      return p;
    }
    let t = Date.UTC(y, mo - 1, d, hour, min, sec);
    for (let i = 0; i < 4; i++) {
      const p = read(t);
      const want = Date.UTC(y, mo - 1, d, hour, min, sec);
      const got = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
      const delta = want - got;
      if (delta === 0) break;
      t += delta;
    }
    return new Date(t);
  }

  function parseDeadline(item) {
    if (!item) return { kind: "rolling", at: null };
    if (item.type === "goal" || item._goalLabel) return { kind: "goal", at: null };
    const d = String(item.deadline || "").trim();
    const et = String(item.deadline_et || "").trim();
    const hasDate = /^\d{4}-\d{2}-\d{2}$/.test(d);
    if (!hasDate) return { kind: "rolling", at: null };

    const timeMatch = et.match(/(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)\s*ET/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[2], 10);
      const m = parseInt(timeMatch[3], 10);
      const ap = timeMatch[4].toUpperCase();
      if (ap === "PM" && h !== 12) h += 12;
      if (ap === "AM" && h === 12) h = 0;
      return { kind: "dated", at: zonedDate(timeMatch[1], h, m, 0) };
    }
    /* Date known, clock time not stated: stay up through 11:59:59 PM Eastern. */
    return { kind: "dated", at: zonedDate(d, 23, 59, 59) };
  }

  function isOpen(item, now) {
    const p = parseDeadline(item);
    if (p.kind !== "dated") return true;
    return p.at.getTime() >= now.getTime();
  }

  function etYmd(date) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  }

  function isDueToday(item, now) {
    const p = parseDeadline(item);
    if (p.kind !== "dated") return false;
    return etYmd(now) === etYmd(p.at);
  }

  function urgency(item, now) {
    const p = parseDeadline(item);
    if (p.kind === "goal") return "goal";
    if (p.kind === "rolling") return "rolling";
    const ms = p.at.getTime() - now.getTime();
    const day = 24 * 60 * 60 * 1000;
    if (ms < 0) return "past";
    if (etYmd(now) === etYmd(p.at)) return "today";
    if (ms <= 3 * day) return "red";
    if (ms <= 14 * day) return "yellow";
    return "green";
  }

  function remainParts(target, now) {
    let ms = Math.max(0, target.getTime() - now.getTime());
    const sec = 1000, min = 60 * sec, hr = 60 * min, day = 24 * hr;
    const days = Math.floor(ms / day); ms %= day;
    const hours = Math.floor(ms / hr); ms %= hr;
    const mins = Math.floor(ms / min); ms %= min;
    const secs = Math.floor(ms / sec);
    return { days: days, hours: hours, mins: mins, secs: secs };
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatDeadline(item, now) {
    const p = parseDeadline(item);
    if (p.kind === "goal") return item._goalLabel || "Goal";
    if (p.kind === "rolling") return "Rolling";
    const weekday = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      weekday: "short",
      month: "short",
      day: "numeric"
    }).format(p.at);
    const timePart = String(item.deadline_et || "").match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
    const time = timePart ? timePart[1].replace(/\s+/g, " ").trim() : "";
    if (etYmd(now) === etYmd(p.at)) {
      return time ? "TODAY · " + time : "TODAY";
    }
    return time ? weekday + " · " + time : weekday;
  }

  function deadlineCue(item, now) {
    const p = parseDeadline(item);
    if (p.kind !== "dated") return formatDeadline(item, now);
    const timePart = String(item.deadline_et || "").match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
    const time = timePart ? timePart[1].replace(/\s+/g, " ").trim() : "";
    if (etYmd(now) === etYmd(p.at)) {
      return time ? "Closes today · " + time + " ET" : "Closes end of day ET (no time posted)";
    }
    return "Deadline " + formatDeadline(item, now);
  }

  function formatClock(now) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(now) + " ET";
  }

  function formatClockParts(now) {
    const date = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      weekday: "short",
      month: "short",
      day: "numeric"
    }).format(now);
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(now);
    return { date: date, time: time };
  }

  function moneySum(items) {
    let sum = 0, counted = 0, fullRides = 0;
    (items || []).forEach(function (it) {
      if (it.type === "goal") return;
      if (typeof it.award_usd === "number" && isFinite(it.award_usd)) {
        sum += it.award_usd;
        counted += 1;
      }
      if (/full ride/i.test(it.award || "")) fullRides += 1;
    });
    return { sum: sum, counted: counted, fullRides: fullRides };
  }

  function formatUSD(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  function typeLabel(t) {
    if (t === "scholarship") return "Scholarship";
    if (t === "competition") return "Challenge";
    if (t === "camp") return "Program";
    if (t === "goal") return "Goal";
    return t || "Opportunity";
  }

  function gradeLabel(g) {
    if (!g) return "";
    if (/unconfirmed/i.test(g)) return "Grades: confirm";
    if (/^12$/.test(g)) return "Grade 12";
    if (/^11$/.test(g)) return "Grade 11";
    if (/10-12/.test(g)) return "Grades 10–12";
    if (/^10$/.test(g)) return "Grade 10";
    if (/^Grade|^Apply|^Start|^Grades/.test(g)) return g;
    return "Grades: " + g;
  }

  function flagInfo(item) {
    const f = item.flags || "";
    const badges = [];
    if (/est\.|estimate/i.test(f)) badges.push({ k: "est", label: "est." });
    if (/unconfirmed/i.test(f)) badges.push({ k: "confirm", label: "confirm" });
    if (/30,000|apply early|close early/i.test(f)) badges.push({ k: "early", label: "apply early" });
    return { badges: badges, note: f };
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderQR(url) {
    if (!url) return '<div class="qr empty" aria-hidden="true">No link</div>';
    try {
      if (typeof qrcode === "function") {
        const qr = qrcode(0, "M");
        qr.addData(url);
        qr.make();
        const svg = qr.createSvgTag({ scalable: true, margin: 2 });
        return '<div class="qr" data-url="' + escapeHtml(url) + '" title="' + escapeHtml(url) + '">' + svg + "</div>";
      }
    } catch (err) {
      /* fall through */
    }
    return '<div class="qr empty" data-url="' + escapeHtml(url) + '">QR</div>';
  }

  function sortItems(items) {
    return items.slice().sort(function (a, b) {
      const pa = parseDeadline(a), pb = parseDeadline(b);
      function rank(p) {
        if (p.kind === "dated") return 0;
        if (p.kind === "rolling") return 1;
        return 2;
      }
      const ra = rank(pa), rb = rank(pb);
      if (ra !== rb) return ra - rb;
      if (pa.kind === "dated" && pb.kind === "dated") return pa.at - pb.at;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
  }

  function nextDated(items, now) {
    return sortItems(items).find(function (it) {
      const p = parseDeadline(it);
      return p.kind === "dated" && p.at.getTime() >= now.getTime();
    }) || null;
  }

  async function loadData() {
    try {
      const res = await fetch("opportunities.json", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.items)) return { data: data, source: "live" };
      }
    } catch (err) {
      /* file:// or missing json — use the inlined copy */
    }
    return { data: FALLBACK, source: "fallback" };
  }

  function visibleItems(data, cls, now) {
    const raw = (data && data.items) || [];
    if (cls === "MS101") {
      return MS101_GOALS.map(function (g) {
        const live = raw.find(function (it) { return it.name === g.name; });
        if (!live) return g;
        return Object.assign({}, live, {
          type: "goal",
          _goalLabel: g._goalLabel,
          grades: g.grades,
          blurb: g.blurb,
          flags: g.flags,
          deadline: "",
          deadline_et: ""
        });
      });
    }
    let items = raw.slice();
    if (cls) {
      items = items.filter(function (it) {
        return tokensToKeys(it.classes).indexOf(cls) !== -1;
      });
    }
    items = items.filter(function (it) { return isOpen(it, now); });
    return sortItems(items);
  }

  function badgesHtml(item, now) {
    const bits = [];
    if (isDueToday(item, now)) bits.push('<span class="badge today">DUE TODAY</span>');
    const info = flagInfo(item);
    info.badges.forEach(function (b) {
      bits.push('<span class="badge ' + b.k + '">' + escapeHtml(b.label) + "</span>");
    });
    return bits.join("");
  }


  function awardFlair(item) {
    const award = (item && item.award) || "";
    if (/full ride/i.test(award)) return "🏆";
    if ((item && typeof item.award_usd === "number" && isFinite(item.award_usd)) || /\$/.test(award)) return "💵";
    return "🪙";
  }

  function awardTier(item) {
    if (!item) return "";
    if (/full ride/i.test(item.award || "")) return "jackpot";
    if (typeof item.award_usd === "number" && isFinite(item.award_usd) && item.award_usd >= 25000) {
      return "high-roller";
    }
    return "";
  }

  function wrapAwardNumbers(text) {
    const re = /\$(\d{1,3}(?:,\d{3})+)/g;
    let m, maxVal = -1, maxRaw = null, maxNum = null;
    while ((m = re.exec(text))) {
      const v = parseInt(m[1].replace(/,/g, ""), 10);
      if (v > maxVal) {
        maxVal = v;
        maxRaw = m[0];
        maxNum = m[1];
      }
    }
    if (!maxRaw) return escapeHtml(text);
    const idx = text.indexOf(maxRaw);
    return escapeHtml(text.slice(0, idx + 1)) +
      '<span class="slot-num" data-target="' + maxVal + '" data-display="' + escapeHtml(maxNum) + '">' +
      escapeHtml(maxNum) + "</span>" +
      escapeHtml(text.slice(idx + maxRaw.length));
  }

  function awardHtml(item, extra) {
    const icon = awardFlair(item);
    const text = (item && item.award) || "";
    const more = extra ? " · " + escapeHtml(extra) : "";
    const tier = awardTier(item);
    const body = tier ? wrapAwardNumbers(text) : escapeHtml(text);
    return '<span class="emo" aria-hidden="true">' + icon + "</span> " +
      '<span class="award-text' + (tier ? " shimmer" : "") + '">' + body + "</span>" + more;
  }

  function startSlotRolls(root) {
    /* One-time count-up of the headline figure. Plain text (no digit strips) so
       it stays readable with the shimmer and never changes the card's layout. */
    if (!root || prefersReducedMotion()) return;
    if (!document.body.classList.contains("sign")) return;
    Array.prototype.forEach.call(root.querySelectorAll(".slot-num"), function (el) {
      if (el.getAttribute("data-rolled") === "1") return;
      const display = el.getAttribute("data-display") || el.textContent.trim();
      const target = parseInt(el.getAttribute("data-target"), 10);
      if (!display || !isFinite(target)) return;
      el.setAttribute("data-rolled", "1");
      el.setAttribute("aria-label", display);
      const t0 = performance.now();
      const dur = 900;
      el.classList.add("rolling");
      function frame(now) {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString("en-US");
        if (p < 1) requestAnimationFrame(frame);
        else {
          el.textContent = display;
          el.classList.remove("rolling");
        }
      }
      requestAnimationFrame(frame);
    });
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function flairCoin(cls, style, face) {
    return '<div class="mb-coin ' + cls + '" style="' + style + '"><span>' + face + "</span></div>";
  }

  function flairBill(style) {
    return '<div class="mb-bill" style="' + style + '"><span>$</span></div>';
  }

  function headerFlairMarkup(layout) {
    /* A few coins tucked in the header only — panel-safe, not over the wordmark. */
    const coins = layout === "strip"
      ? [
          flairCoin("idle", "--x:72%;--y:4px;--size:18px;--d:9s;--delay:-2s;", "$"),
          flairCoin("idle star", "--x:88%;--y:8px;--size:14px;--d:11s;--delay:-5s;", "★"),
          flairCoin("idle", "--x:64%;--y:10px;--size:13px;--d:10s;--delay:-1s;", "$")
        ]
      : layout === "sign"
      ? [
          flairCoin("idle", "--x:78%;--y:12px;--size:22px;--d:10s;--delay:-2s;", "$"),
          flairCoin("idle star", "--x:93%;--y:8px;--size:16px;--d:12s;--delay:-6s;", "★"),
          flairCoin("idle", "--x:86%;--y:46px;--size:14px;--d:9s;--delay:-3s;", "$")
        ]
      : [
          flairCoin("idle", "--x:78%;--y:18px;--size:26px;--d:10s;--delay:-2s;", "$"),
          flairCoin("idle star", "--x:90%;--y:8px;--size:18px;--d:12s;--delay:-6s;", "★"),
          flairCoin("idle", "--x:84%;--y:42px;--size:16px;--d:9s;--delay:-3s;", "$")
        ];
    return coins.join("");
  }

  function signFlairMarkup() {
    const coins = [
      ["fall", "--x:6%;--y:-8%;--size:40px;--d:28s;--delay:-8s;--dx:30px;", "$"],
      ["fall star", "--x:18%;--y:-20%;--size:26px;--d:34s;--delay:-18s;--dx:-24px;", "★"],
      ["fall", "--x:28%;--y:-5%;--size:32px;--d:26s;--delay:-4s;--dx:18px;", "$"],
      ["fall star", "--x:42%;--y:-16%;--size:22px;--d:38s;--delay:-22s;--dx:-12px;", "★"],
      ["fall", "--x:58%;--y:-10%;--size:36px;--d:30s;--delay:-12s;--dx:22px;", "$"],
      ["fall", "--x:72%;--y:-18%;--size:28px;--d:32s;--delay:-20s;--dx:-28px;", "$"],
      ["fall star", "--x:86%;--y:-6%;--size:34px;--d:27s;--delay:-9s;--dx:16px;", "★"],
      ["fall", "--x:93%;--y:-22%;--size:24px;--d:36s;--delay:-15s;--dx:-20px;", "$"],
      ["fall", "--x:10%;--y:-30%;--size:20px;--d:40s;--delay:-26s;--dx:10px;", "$"],
      ["fall star", "--x:50%;--y:-28%;--size:30px;--d:33s;--delay:-11s;--dx:-18px;", "★"],
      ["fall", "--x:78%;--y:-34%;--size:22px;--d:29s;--delay:-7s;--dx:26px;", "$"],
      ["spin", "--x:4%;--y:62%;--size:28px;--d:14s;--delay:-3s;", "$"]
    ];
    const bills = [
      "--x:12%;--y:-12%;--d:32s;--delay:-6s;--dx:50px;--rot:18deg;",
      "--x:36%;--y:-24%;--d:38s;--delay:-16s;--dx:-40px;--rot:-14deg;",
      "--x:64%;--y:-8%;--d:30s;--delay:-10s;--dx:36px;--rot:10deg;",
      "--x:88%;--y:-20%;--d:36s;--delay:-22s;--dx:-30px;--rot:-16deg;",
      "--x:48%;--y:-32%;--d:42s;--delay:-28s;--dx:24px;--rot:8deg;"
    ];
    return coins.map(function (c) {
      return flairCoin(c[0], c[1], c[2]);
    }).join("") + bills.map(function (s) {
      return flairBill(s);
    }).join("") + '<div class="burst-layer"></div>';
  }

  function burstCoins(layer) {
    if (!layer || prefersReducedMotion()) return;
    const burst = layer.querySelector(".burst-layer");
    if (!burst) return;
    burst.innerHTML = "";
    const n = 10;
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 * i) / n + 0.3;
      const dist = 80 + (i % 3) * 36;
      const dx = Math.round(Math.cos(ang) * dist);
      const dy = Math.round(Math.sin(ang) * dist - 20);
      const el = document.createElement("div");
      el.className = "mb-coin burst" + (i % 2 ? " star" : "");
      el.style.setProperty("--dx", dx + "px");
      el.style.setProperty("--dy", dy + "px");
      el.style.setProperty("--rot", (i % 2 ? 160 : -160) + "deg");
      el.style.left = "72%";
      el.style.top = "28%";
      el.style.setProperty("--size", (16 + (i % 4) * 4) + "px");
      el.innerHTML = "<span>" + (i % 2 ? "★" : "$") + "</span>";
      burst.appendChild(el);
    }
    /* Clear after the animation so later bursts can replay */
    setTimeout(function () { burst.innerHTML = ""; }, 1200);
  }

  function startFlair() {
    const stage = document.getElementById("stage");
    if (!stage) return;
    const isSign = document.body.classList.contains("sign");
    const layout = document.body.getAttribute("data-layout") || "side";

    const old = stage.querySelector("#flair");
    if (old) old.remove();

    if (isSign) {
      const layer = document.createElement("div");
      layer.id = "flair";
      layer.setAttribute("aria-hidden", "true");
      layer.innerHTML = signFlairMarkup();
      stage.insertBefore(layer, stage.firstChild);
      if (!prefersReducedMotion()) {
        /* A brief sparkle as the hero comes on, then once a minute. */
        setTimeout(function () { burstCoins(layer); }, 600);
        if (startFlair._timer) clearInterval(startFlair._timer);
        startFlair._timer = setInterval(function () { burstCoins(layer); }, 60000);
        startFlair._hero = (stage.querySelector(".atbat h2") || {}).textContent || "";
      }
    }

    const hdr = stage.querySelector(".hdr");
    if (hdr) {
      const hf = document.createElement("div");
      hf.className = "hdr-flair";
      hf.setAttribute("aria-hidden", "true");
      hf.innerHTML = headerFlairMarkup(isSign ? "sign" : layout);
      hdr.insertBefore(hf, hdr.firstChild);
    }
  }

  function cardHtml(item, now, compact) {
    const urg = urgency(item, now);
    const info = flagInfo(item);
    const due = formatDeadline(item, now);
    const award = item.award || "";
    const tier = awardTier(item);
    const flagNote = info.note
      ? '<div class="flag-note" title="' + escapeHtml(info.note) + '">' + escapeHtml(info.note) + "</div>"
      : "";
    const bling = tier
      ? '<div class="bling-marquee" aria-hidden="true"></div><span class="bling-sparkle" aria-hidden="true"></span>'
      : "";
    return (
      '<article class="card urg-' + urg + (tier ? " tier-" + tier : "") +
        '" data-name="' + escapeHtml(item.name) + '" data-urg="' + urg +
        '"' + (tier ? ' data-tier="' + tier + '"' : "") + ">" +
        bling +
        '<div class="card-accent"></div>' +
        '<div class="card-body">' +
          '<div class="card-top">' +
            '<span class="type-pill">' + escapeHtml(typeLabel(item.type)) + "</span>" +
            '<span class="due">' + escapeHtml(due) + "</span>" +
          "</div>" +
          "<h3>" + escapeHtml(item.name) + "</h3>" +
          '<div class="award">' + awardHtml(item) + "</div>" +
          '<div class="meta">' +
            '<span class="grades">' + escapeHtml(gradeLabel(item.grades)) + "</span>" +
            (item.sponsor ? '<span class="sponsor">' + escapeHtml(item.sponsor) + "</span>" : "") +
          "</div>" +
          (compact ? "" : '<p class="blurb">' + escapeHtml(item.blurb || "") + "</p>") +
          '<div class="badge-row">' + badgesHtml(item, now) + "</div>" +
          flagNote +
        "</div>" +
        renderQR(item.url) +
      "</article>"
    );
  }

  function countdownHtml(parts, showSeconds) {
    const cells = [
      [pad2(parts.days), "DAYS"],
      [pad2(parts.hours), "HOURS"],
      [pad2(parts.mins), "MINS"]
    ];
    if (showSeconds) cells.push([pad2(parts.secs), "SECS"]);
    return cells.map(function (c) {
      return (
        '<div class="tick">' +
          '<div class="tick-num">' + c[0] + "</div>" +
          '<div class="tick-lbl">' + c[1] + "</div>" +
        "</div>"
      );
    }).join('<div class="tick-colon">:</div>');
  }

  function timelineHtml(items, now, nextName) {
    if (!items.length) return "";
    return items.map(function (it) {
      const urg = urgency(it, now);
      const due = formatDeadline(it, now);
      const on = it.name === nextName ? " on" : "";
      return (
        '<div class="tl-item urg-' + urg + on + '">' +
          '<span class="tl-dot"></span>' +
          '<span class="tl-date">' + escapeHtml(due) + "</span>" +
          '<span class="tl-name">' + escapeHtml(it.name) + "</span>" +
        "</div>"
      );
    }).join("");
  }

  function purseHtml(items, mode) {
    const m = moneySum(items);
    const rides = m.fullRides
      ? '<span class="rides"><span class="emo" aria-hidden="true">🏆</span> + ' + m.fullRides + " FULL RIDE</span>"
      : "";
    if (mode === "goals") {
      return (
        '<div class="purse goals">' +
          '<div class="purse-kicker"><span class="emo" aria-hidden="true">🌟</span> YOUR FUTURE</div>' +
          '<div class="purse-amt">2 CAREER GOALS</div>' +
          '<div class="purse-sub">Not deadlines — aims worth chasing</div>' +
        "</div>"
      );
    }
    const amt = m.counted ? "UP TO " + formatUSD(m.sum) : "OPEN WINDOWS";
    const sub = m.counted
      ? "in opportunities open"
      : "Rolling opportunities still in play";
    const n = items.filter(function (it) { return it.type !== "goal"; }).length;
    return (
      '<div class="purse bling-purse">' +
        '<div class="bling-marquee" aria-hidden="true"></div>' +
        '<div class="purse-kicker"><span class="emo" aria-hidden="true">💰</span> OPEN PURSE</div>' +
        '<div class="purse-amt shimmer">' + amt + "</div>" +
        '<div class="purse-sub">' + sub + " " + rides + "</div>" +
        '<div class="purse-count">' + n + " live " + (n === 1 ? "opportunity" : "opportunities") + "</div>" +
      "</div>"
    );
  }

  function startPager(port, axis) {
    if (!port) return;
    const track = port.querySelector(".track");
    if (!track) return;
    if (port._pagerTimer) {
      clearInterval(port._pagerTimer);
      port._pagerTimer = null;
    }
    track.style.animation = "none";
    track.style.transform = "none";
    track.classList.remove("scroll-x", "scroll-y", "static");

    const board = port.parentElement;
    if (board) {
      const oldDots = board.querySelector(".pager-dots");
      if (oldDots) oldDots.remove();
    }

    const cards = Array.prototype.slice.call(track.children);
    if (!cards.length) return;

    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16;
    cards.forEach(function (c) {
      c.style.flex = "";
      c.style.width = "";
      c.style.height = "";
    });
    if (axis === "x") {
      port.style.paddingBottom = "18px";
    }
    const view = axis === "x" ? port.clientWidth : port.clientHeight;
    const target = axis === "y" ? 230 : (cards[0].offsetWidth || 440);
    const perPage = Math.max(1, Math.floor((view + gap) / (target + gap)));
    const exact = Math.floor((view - (perPage - 1) * gap) / perPage);
    cards.forEach(function (c) {
      if (axis === "x") {
        c.style.flex = "0 0 " + exact + "px";
        c.style.width = exact + "px";
      } else {
        c.style.flex = "0 0 " + exact + "px";
        c.style.height = exact + "px";
      }
    });
    const cardSize = exact;
    port.dataset.perPage = String(perPage);
    port.dataset.scrolling = "0";

    if (cards.length <= perPage) {
      track.classList.add("static");
      return;
    }

    const maxStart = cards.length - perPage;
    let index = 0;
    const dots = document.createElement("div");
    dots.className = "pager-dots";
    dots.setAttribute("aria-hidden", "true");
    for (let i = 0; i <= maxStart; i++) {
      const b = document.createElement("span");
      if (i === 0) b.className = "on";
      dots.appendChild(b);
    }
    if (board) board.appendChild(dots);

    function go(i) {
      index = i;
      const offset = index * (cardSize + gap);
      track.style.transform = axis === "x"
        ? "translateX(" + (-offset) + "px)"
        : "translateY(" + (-offset) + "px)";
      Array.prototype.forEach.call(dots.children, function (d, n) {
        d.className = n === index ? "on" : "";
      });
    }

    go(0);
    port.dataset.scrolling = "1";
    port._pagerTimer = setInterval(function () {
      go(index >= maxStart ? 0 : index + 1);
    }, 7000);
  }

  function bindClock(root, item) {
    const el = root.querySelector("[data-countdown]");
    if (!el) return;
    const p = item ? parseDeadline(item) : { kind: "rolling", at: null };
    function paint() {
      const now = getNow();
      const clock = root.querySelector("[data-clock]");
      if (clock) clock.textContent = formatClock(now);
      const partsClock = formatClockParts(now);
      const dEl = root.querySelector("[data-clock-date]");
      const tEl = root.querySelector("[data-clock-time]");
      if (dEl) dEl.textContent = partsClock.date;
      if (tEl) tEl.textContent = partsClock.time;
      const heroName = (root.querySelector(".atbat h2") || {}).textContent || "";
      if (startFlair._hero != null && heroName && heroName !== startFlair._hero) {
        const layer = document.getElementById("flair");
        if (layer) burstCoins(layer);
      }
      startFlair._hero = heroName;
      if (p.kind !== "dated") return;
      const parts = remainParts(p.at, now);
      const showSec = parts.days === 0;
      el.innerHTML = countdownHtml(parts, showSec);
      if (p.at.getTime() < now.getTime()) {
        /* Item just expired — reload so it drops */
        if (!bindClock._reloading) {
          bindClock._reloading = true;
          location.reload();
        }
      }
    }
    paint();
    setInterval(paint, 1000);
  }

  function renderSign(data, source) {
    const now = getNow();
    const items = visibleItems(data, null, now);
    const next = nextDated(items, now);
    const stage = document.getElementById("stage");
    const today = next && isDueToday(next, now);

    let heroInner;
    if (next) {
      const p = parseDeadline(next);
      const parts = remainParts(p.at, now);
      const urg = urgency(next, now);
      heroInner =
        '<div class="atbat urg-' + urg + (today ? " due-today" : "") + '">' +
          (today ? '<div class="today-banner"><span class="emo" aria-hidden="true">💸</span> DUE TODAY <span class="emo" aria-hidden="true">🤑</span></div>' : '<div class="atbat-kicker">NOW AT BAT</div>') +
          "<h2>" + escapeHtml(next.name) + "</h2>" +
          '<div class="atbat-award">' + awardHtml(next, gradeLabel(next.grades)) + "</div>" +
          '<div class="countdown" data-countdown>' + countdownHtml(parts, parts.days === 0) + "</div>" +
          '<div class="atbat-due">' + escapeHtml(deadlineCue(next, now)) + "</div>" +
          '<div class="badge-row">' + badgesHtml(next, now) + "</div>" +
        "</div>";
    } else {
      heroInner =
        '<div class="atbat urg-rolling">' +
          '<div class="atbat-kicker">OPEN WINDOWS</div>' +
          "<h2>Rolling opportunities</h2>" +
          '<div class="atbat-award">No hard deadline on the board right now — these stay in play.</div>' +
        "</div>";
    }

    stage.innerHTML =
      '<div class="led" aria-hidden="true"></div>' +
      '<header class="hdr">' +
        '<div class="brand">' +
          '<div class="wordmark">MONEYBALL <span class="emo" aria-hidden="true">💰</span></div>' +
          '<div class="tag">Donovan Catholic · Athens, GA</div>' +
        "</div>" +
        '<div class="hdr-mid">' +
          "<h1>Scholarships &amp; STREAM Career Opportunities</h1>" +
          '<div class="tagline">Don\'t leave money on the field. Scan a QR. Beat the clock.</div>' +
        "</div>" +
        '<div class="hdr-clock">' +
          '<div class="clock-lbl">EASTERN</div>' +
          '<div class="clock-date" data-clock-date>' + escapeHtml(formatClockParts(now).date) + "</div>" +
          '<div class="clock" data-clock-time>' + escapeHtml(formatClockParts(now).time) + "</div>" +
        "</div>" +
      "</header>" +
      '<section class="hero">' +
        heroInner +
        purseHtml(items) +
      "</section>" +
      '<section class="timeline" aria-label="Deadline timeline">' +
        '<div class="tl-kicker">SCHEDULE · SOONEST FIRST</div>' +
        '<div class="tl-port"><div class="tl-track">' +
          timelineHtml(items, now, next ? next.name : "") +
        "</div></div>" +
      "</section>" +
      '<section class="board" aria-label="Opportunities">' +
        '<div class="cards-port" id="cards-port"><div class="track">' +
          items.map(function (it) { return cardHtml(it, now, false); }).join("") +
        "</div></div>" +
      "</section>" +
      '<footer class="foot">' +
        "<span>Scan any QR to open the official page · Data: STREAM DREAMS Future$" +
        (source === "fallback" ? " · built-in data (opportunities.json not loaded)" : " · live data") +
        "</span>" +
        '<span class="foot-note">Award totals marked est. are estimates. Badges marked confirm still need a staff check. TIMES IN EASTERN.</span>' +
      "</footer>";

    bindClock(stage, next);
    startFlair();
    startSlotRolls(stage);
    startPager(document.getElementById("cards-port"), "x");
    /* Timeline: if it overflows, let it slowly scroll too */
    const tlPort = stage.querySelector(".tl-port");
    if (tlPort) {
      const track = tlPort.querySelector(".tl-track");
      if (track && track.scrollWidth > tlPort.clientWidth + 2) {
        const kids = Array.prototype.slice.call(track.children);
        kids.forEach(function (c) { track.appendChild(c.cloneNode(true)); });
        const half = track.scrollWidth / 2;
        track.style.setProperty("--mb-dur", Math.max(24, half / 40) + "s");
        track.classList.add("scroll-x");
      }
    }
  }

  function renderPanel(data, source) {
    const now = getNow();
    const layout = (qs().get("layout") || "side").toLowerCase() === "strip" ? "strip" : "side";
    const cls = classKey(qs().get("class")) || null;
    const items = visibleItems(data, cls, now);
    const next = nextDated(items, now);
    const label = cls ? CLASS_LABELS[cls] || cls : "All classes";
    const isGoals = cls === "MS101";
    const stage = document.getElementById("stage");
    document.body.setAttribute("data-layout", layout);
    document.body.setAttribute("data-class", cls || "ALL");

    const today = next && isDueToday(next, now);
    let heroInner;
    if (isGoals) {
      heroInner =
        '<div class="atbat urg-goal">' +
          '<div class="atbat-kicker">YOUR FUTURE</div>' +
          "<h2>Goals, not deadlines</h2>" +
          '<div class="atbat-award">Start aiming now — these unlock in high school.</div>' +
        "</div>";
    } else if (next) {
      const p = parseDeadline(next);
      const parts = remainParts(p.at, now);
      const urg = urgency(next, now);
      heroInner =
        '<div class="atbat urg-' + urg + (today ? " due-today" : "") + '">' +
          (today ? '<div class="today-banner"><span class="emo" aria-hidden="true">💸</span> DUE TODAY <span class="emo" aria-hidden="true">🤑</span></div>' : '<div class="atbat-kicker">NEXT DEADLINE</div>') +
          "<h2>" + escapeHtml(next.name) + "</h2>" +
          '<div class="countdown" data-countdown>' + countdownHtml(parts, parts.days === 0) + "</div>" +
          '<div class="atbat-due">' + escapeHtml(deadlineCue(next, now)) + "</div>" +
          '<div class="badge-row">' + badgesHtml(next, now) + "</div>" +
        "</div>";
    } else {
      heroInner =
        '<div class="atbat urg-rolling">' +
          '<div class="atbat-kicker">OPEN WINDOWS</div>' +
          "<h2>Rolling opportunities</h2>" +
        "</div>";
    }

    const compact = layout === "strip";
    stage.innerHTML =
      '<div class="led" aria-hidden="true"></div>' +
      '<header class="hdr">' +
        '<div class="brand">' +
          '<div class="wordmark">MONEYBALL <span class="emo" aria-hidden="true">💰</span></div>' +
          '<div class="tag">' + escapeHtml(label) + "</div>" +
        "</div>" +
        '<div class="hdr-clock"><div class="clock" data-clock>' + escapeHtml(formatClock(now)) + "</div></div>" +
      "</header>" +
      '<section class="hero">' +
        heroInner +
        purseHtml(items, isGoals ? "goals" : "open") +
      "</section>" +
      '<section class="board" aria-label="Opportunities">' +
        '<div class="cards-port" id="cards-port"><div class="track">' +
          items.map(function (it) { return cardHtml(it, now, compact); }).join("") +
        "</div></div>" +
      "</section>" +
      '<footer class="foot">' +
        "<span>Scan the QR · " + (source === "fallback" ? "built-in data" : "live data") + " · ET</span>" +
      "</footer>";

    bindClock(stage, next);
    startFlair();
    startPager(document.getElementById("cards-port"), layout === "strip" ? "x" : "y");
  }

  function fitStage(w, h) {
    const stage = document.getElementById("stage");
    const s = Math.min(window.innerWidth / w, window.innerHeight / h);
    document.documentElement.style.setProperty("--s", String(s));
    if (stage) stage.style.transform = "scale(" + s + ")";
  }

  async function init(mode) {
    const design = mode === "panel"
      ? ((qs().get("layout") || "side").toLowerCase() === "strip" ? [1920, 240] : [480, 1080])
      : [1920, 1080];
    const fit = function () { fitStage(design[0], design[1]); };
    fit();
    window.addEventListener("resize", fit);

    const loaded = await loadData();
    if (mode === "panel") renderPanel(loaded.data, loaded.source);
    else renderSign(loaded.data, loaded.source);
    fit();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        /* Remeasure marquees after fonts settle */
        const port = document.getElementById("cards-port");
        if (port) {
          const axis = document.body.classList.contains("sign")
            ? "x"
            : (document.body.getAttribute("data-layout") === "side" ? "y" : "x");
          startPager(port, axis);
        }
        startSlotRolls(document.getElementById("stage"));
        fit();
        document.body.classList.add("ready");
      });
    } else {
      document.body.classList.add("ready");
    }
    /* Don't sit hidden if fonts hang */
    setTimeout(function () { document.body.classList.add("ready"); }, 800);
  }

  window.MoneyBall = {
    init: init,
    parseDeadline: parseDeadline,
    isOpen: isOpen,
    urgency: urgency,
    visibleItems: visibleItems,
    getNow: getNow,
    formatDeadline: formatDeadline,
    moneySum: moneySum,
    classKey: classKey,
    tokensToKeys: tokensToKeys,
    remainParts: remainParts,
    zonedDate: zonedDate,
    nextDated: nextDated,
    awardTier: awardTier,
    loadData: loadData,
    FALLBACK: FALLBACK,
    CLASS_LABELS: CLASS_LABELS
  };
})();
