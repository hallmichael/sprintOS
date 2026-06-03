import { jsx as c, jsxs as F, Fragment as ue } from "react/jsx-runtime";
import * as Be from "react";
import Ne, { useState as A, useRef as re, useEffect as Q, createContext as Ie, useContext as Me, useCallback as bn, useLayoutEffect as to, useMemo as Re, forwardRef as no } from "react";
import { createPortal as oo } from "react-dom";
var xn = {
  color: void 0,
  size: void 0,
  className: void 0,
  style: void 0,
  attr: void 0
}, It = Ne.createContext && /* @__PURE__ */ Ne.createContext(xn), io = ["attr", "size", "title"];
function so(t, e) {
  if (t == null) return {};
  var n = ro(t, e), o, i;
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(t);
    for (i = 0; i < s.length; i++)
      o = s[i], !(e.indexOf(o) >= 0) && Object.prototype.propertyIsEnumerable.call(t, o) && (n[o] = t[o]);
  }
  return n;
}
function ro(t, e) {
  if (t == null) return {};
  var n = {};
  for (var o in t)
    if (Object.prototype.hasOwnProperty.call(t, o)) {
      if (e.indexOf(o) >= 0) continue;
      n[o] = t[o];
    }
  return n;
}
function Xe() {
  return Xe = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var o in n)
        Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o]);
    }
    return t;
  }, Xe.apply(this, arguments);
}
function Mt(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(i) {
      return Object.getOwnPropertyDescriptor(t, i).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Ze(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Mt(Object(n), !0).forEach(function(o) {
      ao(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Mt(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function ao(t, e, n) {
  return e = lo(e), e in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function lo(t) {
  var e = co(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function co(t, e) {
  if (typeof t != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (typeof o != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function Cn(t) {
  return t && t.map((e, n) => /* @__PURE__ */ Ne.createElement(e.tag, Ze({
    key: n
  }, e.attr), Cn(e.child)));
}
function ee(t) {
  return (e) => /* @__PURE__ */ Ne.createElement(uo, Xe({
    attr: Ze({}, t.attr)
  }, e), Cn(t.child));
}
function uo(t) {
  var e = (n) => {
    var {
      attr: o,
      size: i,
      title: s
    } = t, r = so(t, io), a = i || n.size || "1em", l;
    return n.className && (l = n.className), t.className && (l = (l ? l + " " : "") + t.className), /* @__PURE__ */ Ne.createElement("svg", Xe({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, n.attr, o, r, {
      className: l,
      style: Ze(Ze({
        color: t.color || n.color
      }, n.style), t.style),
      height: a,
      width: a,
      xmlns: "http://www.w3.org/2000/svg"
    }), s && /* @__PURE__ */ Ne.createElement("title", null, s), t.children);
  };
  return It !== void 0 ? /* @__PURE__ */ Ne.createElement(It.Consumer, null, (n) => e(n)) : e(xn);
}
function po(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "rect", attr: { width: "20", height: "5", x: "2", y: "3", rx: "1" }, child: [] }, { tag: "path", attr: { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" }, child: [] }, { tag: "path", attr: { d: "m9.5 17 5-5" }, child: [] }, { tag: "path", attr: { d: "m9.5 12 5 5" }, child: [] }] })(t);
}
function Nt(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "rect", attr: { width: "20", height: "5", x: "2", y: "3", rx: "1" }, child: [] }, { tag: "path", attr: { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" }, child: [] }, { tag: "path", attr: { d: "M10 12h4" }, child: [] }] })(t);
}
function fo(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M20 6 9 17l-5-5" }, child: [] }] })(t);
}
function Tt(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "m9 18 6-6-6-6" }, child: [] }] })(t);
}
function ho(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "circle", attr: { cx: "12", cy: "12", r: "10" }, child: [] }, { tag: "path", attr: { d: "m9 12 2 2 4-4" }, child: [] }] })(t);
}
function kt(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z" }, child: [] }, { tag: "path", attr: { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2M11 14h10" }, child: [] }, { tag: "path", attr: { d: "m17 10 4 4-4 4" }, child: [] }] })(t);
}
function mo(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M12 13v8" }, child: [] }, { tag: "path", attr: { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }, child: [] }, { tag: "path", attr: { d: "m8 17 4-4 4 4" }, child: [] }] })(t);
}
function Sn(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "rect", attr: { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }, child: [] }, { tag: "path", attr: { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }, child: [] }] })(t);
}
function Lt(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }, child: [] }, { tag: "polyline", attr: { points: "7 10 12 15 17 10" }, child: [] }, { tag: "line", attr: { x1: "12", x2: "12", y1: "15", y2: "3" }, child: [] }] })(t);
}
function Fn(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "circle", attr: { cx: "12", cy: "12", r: "1" }, child: [] }, { tag: "circle", attr: { cx: "19", cy: "12", r: "1" }, child: [] }, { tag: "circle", attr: { cx: "5", cy: "12", r: "1" }, child: [] }] })(t);
}
function go(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M15 3h6v6" }, child: [] }, { tag: "path", attr: { d: "M10 14 21 3" }, child: [] }, { tag: "path", attr: { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }, child: [] }] })(t);
}
function vo(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" }, child: [] }, { tag: "path", attr: { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242" }, child: [] }, { tag: "path", attr: { d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" }, child: [] }, { tag: "path", attr: { d: "m2 2 20 20" }, child: [] }] })(t);
}
function $o(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }, child: [] }, { tag: "circle", attr: { cx: "12", cy: "12", r: "3" }, child: [] }] })(t);
}
function yo(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M14 2v4a2 2 0 0 0 2 2h4" }, child: [] }, { tag: "path", attr: { d: "M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" }, child: [] }, { tag: "path", attr: { d: "m9 18-1.5-1.5" }, child: [] }, { tag: "circle", attr: { cx: "5", cy: "14", r: "3" }, child: [] }] })(t);
}
function wo(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" }, child: [] }] })(t);
}
function Nn(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M12 10v6" }, child: [] }, { tag: "path", attr: { d: "M9 13h6" }, child: [] }, { tag: "path", attr: { d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" }, child: [] }] })(t);
}
function bo(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }, child: [] }, { tag: "path", attr: { d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }, child: [] }] })(t);
}
function xo(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M12 2v4" }, child: [] }, { tag: "path", attr: { d: "m16.2 7.8 2.9-2.9" }, child: [] }, { tag: "path", attr: { d: "M18 12h4" }, child: [] }, { tag: "path", attr: { d: "m16.2 16.2 2.9 2.9" }, child: [] }, { tag: "path", attr: { d: "M12 18v4" }, child: [] }, { tag: "path", attr: { d: "m4.9 19.1 2.9-2.9" }, child: [] }, { tag: "path", attr: { d: "M2 12h4" }, child: [] }, { tag: "path", attr: { d: "m4.9 4.9 2.9 2.9" }, child: [] }] })(t);
}
function Co(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "rect", attr: { width: "18", height: "18", x: "3", y: "3", rx: "2" }, child: [] }, { tag: "path", attr: { d: "M9 3v18" }, child: [] }, { tag: "path", attr: { d: "m16 15-3-3 3-3" }, child: [] }] })(t);
}
function So(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "rect", attr: { width: "18", height: "18", x: "3", y: "3", rx: "2" }, child: [] }, { tag: "path", attr: { d: "M9 3v18" }, child: [] }, { tag: "path", attr: { d: "m14 9 3 3-3 3" }, child: [] }] })(t);
}
function kn(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" }, child: [] }, { tag: "path", attr: { d: "m15 5 4 4" }, child: [] }] })(t);
}
function At(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }, child: [] }, { tag: "path", attr: { d: "M21 3v5h-5" }, child: [] }, { tag: "path", attr: { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }, child: [] }, { tag: "path", attr: { d: "M8 16H3v5" }, child: [] }] })(t);
}
function En(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "circle", attr: { cx: "6", cy: "6", r: "3" }, child: [] }, { tag: "path", attr: { d: "M8.12 8.12 12 12" }, child: [] }, { tag: "path", attr: { d: "M20 4 8.12 15.88" }, child: [] }, { tag: "circle", attr: { cx: "6", cy: "18", r: "3" }, child: [] }, { tag: "path", attr: { d: "M14.8 14.8 20 20" }, child: [] }] })(t);
}
function jt(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "circle", attr: { cx: "11", cy: "11", r: "8" }, child: [] }, { tag: "path", attr: { d: "m21 21-4.3-4.3" }, child: [] }] })(t);
}
function Fo(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "rect", attr: { width: "18", height: "18", x: "3", y: "3", rx: "2" }, child: [] }, { tag: "path", attr: { d: "m9 12 2 2 4-4" }, child: [] }] })(t);
}
function No(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }, child: [] }, { tag: "path", attr: { d: "M12 9v4" }, child: [] }, { tag: "path", attr: { d: "M12 17h.01" }, child: [] }] })(t);
}
function Pn(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }, child: [] }, { tag: "polyline", attr: { points: "17 8 12 3 7 8" }, child: [] }, { tag: "line", attr: { x1: "12", x2: "12", y1: "3", y2: "15" }, child: [] }] })(t);
}
function Qe(t) {
  return ee({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M18 6 6 18" }, child: [] }, { tag: "path", attr: { d: "m6 6 12 12" }, child: [] }] })(t);
}
const Ot = ({ loading: t = !1, className: e }) => t ? /* @__PURE__ */ c("div", { className: `loader-container ${e}`, children: /* @__PURE__ */ c(xo, { className: "spinner" }) }) : null, Ke = (t = () => {
}) => {
  const [e, n] = A(!1), o = re(null), i = (s) => {
    o.current?.contains(s.target) ? n(!1) : (n(!0), t(s, o));
  };
  return Q(() => (document.addEventListener("click", i, !0), document.addEventListener("mousedown", i, !0), () => {
    document.removeEventListener("click", i, !0), document.removeEventListener("mousedown", i, !0);
  }), []), { ref: o, isClicked: e, setIsClicked: n };
}, Tn = Ie(), ko = ({ children: t, filesData: e, onError: n }) => {
  const [o, i] = A([]);
  Q(() => {
    i(e);
  }, [e]);
  const s = (r) => r.isDirectory ? o.filter((a) => a.path === `${r.path}/${a.name}`) : [];
  return /* @__PURE__ */ c(Tn.Provider, { value: { files: o, setFiles: i, getChildren: s, onError: n }, children: t });
}, rt = () => Me(Tn), Eo = (t, e = "name", n = "asc") => {
  const o = t.filter((l) => l.isDirectory), i = t.filter((l) => !l.isDirectory), s = (l, d) => {
    let u = 0;
    switch (e) {
      case "name":
        u = l.name.localeCompare(d.name);
        break;
      case "size":
        const p = l.size || 0, m = d.size || 0;
        u = p - m;
        break;
      case "modified":
        const g = l.updatedAt ? new Date(l.updatedAt).getTime() : 0, f = d.updatedAt ? new Date(d.updatedAt).getTime() : 0;
        u = g - f;
        break;
      default:
        u = l.name.localeCompare(d.name);
    }
    return n === "asc" ? u : -u;
  }, r = [...o].sort(s), a = [...i].sort(s);
  return [...r, ...a];
}, Ln = Ie(), Po = ({ children: t, initialPath: e, onFolderChange: n }) => {
  const { files: o } = rt(), i = re(!1), [s, r] = A(""), [a, l] = A(null), [d, u] = A([]), [p, m] = A({ key: "name", direction: "asc" });
  return Q(() => {
    Array.isArray(o) && o.length > 0 ? (u(() => {
      const g = o.filter((f) => f.path === `${s}/${f.name}`);
      return Eo(g, p.key, p.direction);
    }), l(() => o.find((g) => g.path === s) ?? null)) : (u([]), l(null));
  }, [o, s, p]), Q(() => {
    if (!i.current && Array.isArray(o) && o.length > 0) {
      const g = o.some((f) => f.isDirectory && f.path === e) ? e : "";
      r(g), i.current = !0;
    }
  }, [o]), /* @__PURE__ */ c(
    Ln.Provider,
    {
      value: {
        currentPath: s,
        setCurrentPath: r,
        currentFolder: a,
        setCurrentFolder: l,
        currentPathFiles: d,
        setCurrentPathFiles: u,
        sortConfig: p,
        setSortConfig: m,
        onFolderChange: n
      },
      children: t
    }
  );
}, ye = () => Me(Ln), Ee = (t, e, ...n) => {
  try {
    if (typeof t == "function")
      t(...n);
    else
      throw new Error(
        `<FileManager /> Missing prop: Callback function "${e}" is required.`
      );
  } catch (o) {
    console.error(o.message);
  }
}, An = Ie(), To = ({ children: t, onDownload: e, onSelect: n, onSelectionChange: o }) => {
  const [i, s] = A([]);
  Q(() => {
    n?.(i), o?.(i);
  }, [i]);
  const r = () => {
    Ee(e, "onDownload", i);
  };
  return /* @__PURE__ */ c(An.Provider, { value: { selectedFiles: i, setSelectedFiles: s, handleDownload: r }, children: t });
}, xe = () => Me(An), On = Ie(), Lo = ({ children: t, onPaste: e, onCut: n, onCopy: o }) => {
  const [i, s] = A(null), { selectedFiles: r, setSelectedFiles: a } = xe(), l = (u) => {
    s({
      files: r,
      isMoving: u
    }), u ? n && n(r) : o && o(r);
  }, d = (u) => {
    if (u && !u.isDirectory) return;
    const p = i.files, m = i.isMoving ? "move" : "copy";
    Ee(e, "onPaste", p, u, m), i.isMoving && s(null), a([]);
  };
  return /* @__PURE__ */ c(On.Provider, { value: { clipBoard: i, setClipBoard: s, handleCutCopy: l, handlePasting: d }, children: t });
}, at = () => Me(On), B = (t) => typeof t == "string", Ve = () => {
  let t, e;
  const n = new Promise((o, i) => {
    t = o, e = i;
  });
  return n.resolve = t, n.reject = e, n;
}, Ut = (t) => t == null ? "" : "" + t, Ao = (t, e, n) => {
  t.forEach((o) => {
    e[o] && (n[o] = e[o]);
  });
}, Oo = /###/g, Dt = (t) => t && t.indexOf("###") > -1 ? t.replace(Oo, ".") : t, Vt = (t) => !t || B(t), He = (t, e, n) => {
  const o = B(e) ? e.split(".") : e;
  let i = 0;
  for (; i < o.length - 1; ) {
    if (Vt(t)) return {};
    const s = Dt(o[i]);
    !t[s] && n && (t[s] = new n()), Object.prototype.hasOwnProperty.call(t, s) ? t = t[s] : t = {}, ++i;
  }
  return Vt(t) ? {} : {
    obj: t,
    k: Dt(o[i])
  };
}, Ht = (t, e, n) => {
  const {
    obj: o,
    k: i
  } = He(t, e, Object);
  if (o !== void 0 || e.length === 1) {
    o[i] = n;
    return;
  }
  let s = e[e.length - 1], r = e.slice(0, e.length - 1), a = He(t, r, Object);
  for (; a.obj === void 0 && r.length; )
    s = `${r[r.length - 1]}.${s}`, r = r.slice(0, r.length - 1), a = He(t, r, Object), a?.obj && typeof a.obj[`${a.k}.${s}`] < "u" && (a.obj = void 0);
  a.obj[`${a.k}.${s}`] = n;
}, Ro = (t, e, n, o) => {
  const {
    obj: i,
    k: s
  } = He(t, e, Object);
  i[s] = i[s] || [], i[s].push(n);
}, et = (t, e) => {
  const {
    obj: n,
    k: o
  } = He(t, e);
  if (n && Object.prototype.hasOwnProperty.call(n, o))
    return n[o];
}, zo = (t, e, n) => {
  const o = et(t, n);
  return o !== void 0 ? o : et(e, n);
}, Rn = (t, e, n) => {
  for (const o in e)
    o !== "__proto__" && o !== "constructor" && (o in t ? B(t[o]) || t[o] instanceof String || B(e[o]) || e[o] instanceof String ? n && (t[o] = e[o]) : Rn(t[o], e[o], n) : t[o] = e[o]);
  return t;
}, Ae = (t) => t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var Io = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
const Mo = (t) => B(t) ? t.replace(/[&<>"'\/]/g, (e) => Io[e]) : t;
class jo {
  constructor(e) {
    this.capacity = e, this.regExpMap = /* @__PURE__ */ new Map(), this.regExpQueue = [];
  }
  getRegExp(e) {
    const n = this.regExpMap.get(e);
    if (n !== void 0)
      return n;
    const o = new RegExp(e);
    return this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()), this.regExpMap.set(e, o), this.regExpQueue.push(e), o;
  }
}
const Uo = [" ", ",", "?", "!", ";"], Do = new jo(20), Vo = (t, e, n) => {
  e = e || "", n = n || "";
  const o = Uo.filter((r) => e.indexOf(r) < 0 && n.indexOf(r) < 0);
  if (o.length === 0) return !0;
  const i = Do.getRegExp(`(${o.map((r) => r === "?" ? "\\?" : r).join("|")})`);
  let s = !i.test(t);
  if (!s) {
    const r = t.indexOf(n);
    r > 0 && !i.test(t.substring(0, r)) && (s = !0);
  }
  return s;
}, Et = (t, e, n = ".") => {
  if (!t) return;
  if (t[e])
    return Object.prototype.hasOwnProperty.call(t, e) ? t[e] : void 0;
  const o = e.split(n);
  let i = t;
  for (let s = 0; s < o.length; ) {
    if (!i || typeof i != "object")
      return;
    let r, a = "";
    for (let l = s; l < o.length; ++l)
      if (l !== s && (a += n), a += o[l], r = i[a], r !== void 0) {
        if (["string", "number", "boolean"].indexOf(typeof r) > -1 && l < o.length - 1)
          continue;
        s += l - s + 1;
        break;
      }
    i = r;
  }
  return i;
}, _e = (t) => t?.replace("_", "-"), Ho = {
  type: "logger",
  log(t) {
    this.output("log", t);
  },
  warn(t) {
    this.output("warn", t);
  },
  error(t) {
    this.output("error", t);
  },
  output(t, e) {
    console?.[t]?.apply?.(console, e);
  }
};
class tt {
  constructor(e, n = {}) {
    this.init(e, n);
  }
  init(e, n = {}) {
    this.prefix = n.prefix || "i18next:", this.logger = e || Ho, this.options = n, this.debug = n.debug;
  }
  log(...e) {
    return this.forward(e, "log", "", !0);
  }
  warn(...e) {
    return this.forward(e, "warn", "", !0);
  }
  error(...e) {
    return this.forward(e, "error", "");
  }
  deprecate(...e) {
    return this.forward(e, "warn", "WARNING DEPRECATED: ", !0);
  }
  forward(e, n, o, i) {
    return i && !this.debug ? null : (B(e[0]) && (e[0] = `${o}${this.prefix} ${e[0]}`), this.logger[n](e));
  }
  create(e) {
    return new tt(this.logger, {
      prefix: `${this.prefix}:${e}:`,
      ...this.options
    });
  }
  clone(e) {
    return e = e || this.options, e.prefix = e.prefix || this.prefix, new tt(this.logger, e);
  }
}
var be = new tt();
class lt {
  constructor() {
    this.observers = {};
  }
  on(e, n) {
    return e.split(" ").forEach((o) => {
      this.observers[o] || (this.observers[o] = /* @__PURE__ */ new Map());
      const i = this.observers[o].get(n) || 0;
      this.observers[o].set(n, i + 1);
    }), this;
  }
  off(e, n) {
    if (this.observers[e]) {
      if (!n) {
        delete this.observers[e];
        return;
      }
      this.observers[e].delete(n);
    }
  }
  emit(e, ...n) {
    this.observers[e] && Array.from(this.observers[e].entries()).forEach(([i, s]) => {
      for (let r = 0; r < s; r++)
        i(...n);
    }), this.observers["*"] && Array.from(this.observers["*"].entries()).forEach(([i, s]) => {
      for (let r = 0; r < s; r++)
        i.apply(i, [e, ...n]);
    });
  }
}
class Wt extends lt {
  constructor(e, n = {
    ns: ["translation"],
    defaultNS: "translation"
  }) {
    super(), this.data = e || {}, this.options = n, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.options.ignoreJSONStructure === void 0 && (this.options.ignoreJSONStructure = !0);
  }
  addNamespaces(e) {
    this.options.ns.indexOf(e) < 0 && this.options.ns.push(e);
  }
  removeNamespaces(e) {
    const n = this.options.ns.indexOf(e);
    n > -1 && this.options.ns.splice(n, 1);
  }
  getResource(e, n, o, i = {}) {
    const s = i.keySeparator !== void 0 ? i.keySeparator : this.options.keySeparator, r = i.ignoreJSONStructure !== void 0 ? i.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let a;
    e.indexOf(".") > -1 ? a = e.split(".") : (a = [e, n], o && (Array.isArray(o) ? a.push(...o) : B(o) && s ? a.push(...o.split(s)) : a.push(o)));
    const l = et(this.data, a);
    return !l && !n && !o && e.indexOf(".") > -1 && (e = a[0], n = a[1], o = a.slice(2).join(".")), l || !r || !B(o) ? l : Et(this.data?.[e]?.[n], o, s);
  }
  addResource(e, n, o, i, s = {
    silent: !1
  }) {
    const r = s.keySeparator !== void 0 ? s.keySeparator : this.options.keySeparator;
    let a = [e, n];
    o && (a = a.concat(r ? o.split(r) : o)), e.indexOf(".") > -1 && (a = e.split("."), i = n, n = a[1]), this.addNamespaces(n), Ht(this.data, a, i), s.silent || this.emit("added", e, n, o, i);
  }
  addResources(e, n, o, i = {
    silent: !1
  }) {
    for (const s in o)
      (B(o[s]) || Array.isArray(o[s])) && this.addResource(e, n, s, o[s], {
        silent: !0
      });
    i.silent || this.emit("added", e, n, o);
  }
  addResourceBundle(e, n, o, i, s, r = {
    silent: !1,
    skipCopy: !1
  }) {
    let a = [e, n];
    e.indexOf(".") > -1 && (a = e.split("."), i = o, o = n, n = a[1]), this.addNamespaces(n);
    let l = et(this.data, a) || {};
    r.skipCopy || (o = JSON.parse(JSON.stringify(o))), i ? Rn(l, o, s) : l = {
      ...l,
      ...o
    }, Ht(this.data, a, l), r.silent || this.emit("added", e, n, o);
  }
  removeResourceBundle(e, n) {
    this.hasResourceBundle(e, n) && delete this.data[e][n], this.removeNamespaces(n), this.emit("removed", e, n);
  }
  hasResourceBundle(e, n) {
    return this.getResource(e, n) !== void 0;
  }
  getResourceBundle(e, n) {
    return n || (n = this.options.defaultNS), this.getResource(e, n);
  }
  getDataByLanguage(e) {
    return this.data[e];
  }
  hasLanguageSomeTranslations(e) {
    const n = this.getDataByLanguage(e);
    return !!(n && Object.keys(n) || []).find((i) => n[i] && Object.keys(n[i]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}
var zn = {
  processors: {},
  addPostProcessor(t) {
    this.processors[t.name] = t;
  },
  handle(t, e, n, o, i) {
    return t.forEach((s) => {
      e = this.processors[s]?.process(e, n, o, i) ?? e;
    }), e;
  }
};
const In = /* @__PURE__ */ Symbol("i18next/PATH_KEY");
function Wo() {
  const t = [], e = /* @__PURE__ */ Object.create(null);
  let n;
  return e.get = (o, i) => (n?.revoke?.(), i === In ? t : (t.push(i), n = Proxy.revocable(o, e), n.proxy)), Proxy.revocable(/* @__PURE__ */ Object.create(null), e).proxy;
}
function Pt(t, e) {
  const {
    [In]: n
  } = t(Wo());
  return n.join(e?.keySeparator ?? ".");
}
const Bt = {}, mt = (t) => !B(t) && typeof t != "boolean" && typeof t != "number";
class nt extends lt {
  constructor(e, n = {}) {
    super(), Ao(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], e, this), this.options = n, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.logger = be.create("translator");
  }
  changeLanguage(e) {
    e && (this.language = e);
  }
  exists(e, n = {
    interpolation: {}
  }) {
    const o = {
      ...n
    };
    if (e == null) return !1;
    const i = this.resolve(e, o);
    if (i?.res === void 0) return !1;
    const s = mt(i.res);
    return !(o.returnObjects === !1 && s);
  }
  extractFromKey(e, n) {
    let o = n.nsSeparator !== void 0 ? n.nsSeparator : this.options.nsSeparator;
    o === void 0 && (o = ":");
    const i = n.keySeparator !== void 0 ? n.keySeparator : this.options.keySeparator;
    let s = n.ns || this.options.defaultNS || [];
    const r = o && e.indexOf(o) > -1, a = !this.options.userDefinedKeySeparator && !n.keySeparator && !this.options.userDefinedNsSeparator && !n.nsSeparator && !Vo(e, o, i);
    if (r && !a) {
      const l = e.match(this.interpolator.nestingRegexp);
      if (l && l.length > 0)
        return {
          key: e,
          namespaces: B(s) ? [s] : s
        };
      const d = e.split(o);
      (o !== i || o === i && this.options.ns.indexOf(d[0]) > -1) && (s = d.shift()), e = d.join(i);
    }
    return {
      key: e,
      namespaces: B(s) ? [s] : s
    };
  }
  translate(e, n, o) {
    let i = typeof n == "object" ? {
      ...n
    } : n;
    if (typeof i != "object" && this.options.overloadTranslationOptionHandler && (i = this.options.overloadTranslationOptionHandler(arguments)), typeof i == "object" && (i = {
      ...i
    }), i || (i = {}), e == null) return "";
    typeof e == "function" && (e = Pt(e, {
      ...this.options,
      ...i
    })), Array.isArray(e) || (e = [String(e)]);
    const s = i.returnDetails !== void 0 ? i.returnDetails : this.options.returnDetails, r = i.keySeparator !== void 0 ? i.keySeparator : this.options.keySeparator, {
      key: a,
      namespaces: l
    } = this.extractFromKey(e[e.length - 1], i), d = l[l.length - 1];
    let u = i.nsSeparator !== void 0 ? i.nsSeparator : this.options.nsSeparator;
    u === void 0 && (u = ":");
    const p = i.lng || this.language, m = i.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (p?.toLowerCase() === "cimode")
      return m ? s ? {
        res: `${d}${u}${a}`,
        usedKey: a,
        exactUsedKey: a,
        usedLng: p,
        usedNS: d,
        usedParams: this.getUsedParamsDetails(i)
      } : `${d}${u}${a}` : s ? {
        res: a,
        usedKey: a,
        exactUsedKey: a,
        usedLng: p,
        usedNS: d,
        usedParams: this.getUsedParamsDetails(i)
      } : a;
    const g = this.resolve(e, i);
    let f = g?.res;
    const b = g?.usedKey || a, T = g?.exactUsedKey || a, C = ["[object Number]", "[object Function]", "[object RegExp]"], R = i.joinArrays !== void 0 ? i.joinArrays : this.options.joinArrays, N = !this.i18nFormat || this.i18nFormat.handleAsObject, k = i.count !== void 0 && !B(i.count), $ = nt.hasDefaultValue(i), E = k ? this.pluralResolver.getSuffix(p, i.count, i) : "", x = i.ordinal && k ? this.pluralResolver.getSuffix(p, i.count, {
      ordinal: !1
    }) : "", h = k && !i.ordinal && i.count === 0, v = h && i[`defaultValue${this.options.pluralSeparator}zero`] || i[`defaultValue${E}`] || i[`defaultValue${x}`] || i.defaultValue;
    let y = f;
    N && !f && $ && (y = v);
    const O = mt(y), I = Object.prototype.toString.apply(y);
    if (N && y && O && C.indexOf(I) < 0 && !(B(R) && Array.isArray(y))) {
      if (!i.returnObjects && !this.options.returnObjects) {
        this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        const _ = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(b, y, {
          ...i,
          ns: l
        }) : `key '${a} (${this.language})' returned an object instead of string.`;
        return s ? (g.res = _, g.usedParams = this.getUsedParamsDetails(i), g) : _;
      }
      if (r) {
        const _ = Array.isArray(y), H = _ ? [] : {}, W = _ ? T : b;
        for (const Z in y)
          if (Object.prototype.hasOwnProperty.call(y, Z)) {
            const M = `${W}${r}${Z}`;
            $ && !f ? H[Z] = this.translate(M, {
              ...i,
              defaultValue: mt(v) ? v[Z] : void 0,
              joinArrays: !1,
              ns: l
            }) : H[Z] = this.translate(M, {
              ...i,
              joinArrays: !1,
              ns: l
            }), H[Z] === M && (H[Z] = y[Z]);
          }
        f = H;
      }
    } else if (N && B(R) && Array.isArray(f))
      f = f.join(R), f && (f = this.extendTranslation(f, e, i, o));
    else {
      let _ = !1, H = !1;
      !this.isValidLookup(f) && $ && (_ = !0, f = v), this.isValidLookup(f) || (H = !0, f = a);
      const Z = (i.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && H ? void 0 : f, M = $ && v !== f && this.options.updateMissing;
      if (H || _ || M) {
        if (this.logger.log(M ? "updateKey" : "missingKey", p, d, a, M ? v : f), r) {
          const S = this.resolve(a, {
            ...i,
            keySeparator: !1
          });
          S && S.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let oe = [];
        const ce = this.languageUtils.getFallbackCodes(this.options.fallbackLng, i.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && ce && ce[0])
          for (let S = 0; S < ce.length; S++)
            oe.push(ce[S]);
        else this.options.saveMissingTo === "all" ? oe = this.languageUtils.toResolveHierarchy(i.lng || this.language) : oe.push(i.lng || this.language);
        const w = (S, U, D) => {
          const V = $ && D !== f ? D : Z;
          this.options.missingKeyHandler ? this.options.missingKeyHandler(S, d, U, V, M, i) : this.backendConnector?.saveMissing && this.backendConnector.saveMissing(S, d, U, V, M, i), this.emit("missingKey", S, d, U, f);
        };
        this.options.saveMissing && (this.options.saveMissingPlurals && k ? oe.forEach((S) => {
          const U = this.pluralResolver.getSuffixes(S, i);
          h && i[`defaultValue${this.options.pluralSeparator}zero`] && U.indexOf(`${this.options.pluralSeparator}zero`) < 0 && U.push(`${this.options.pluralSeparator}zero`), U.forEach((D) => {
            w([S], a + D, i[`defaultValue${D}`] || v);
          });
        }) : w(oe, a, v));
      }
      f = this.extendTranslation(f, e, i, g, o), H && f === a && this.options.appendNamespaceToMissingKey && (f = `${d}${u}${a}`), (H || _) && this.options.parseMissingKeyHandler && (f = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${d}${u}${a}` : a, _ ? f : void 0, i));
    }
    return s ? (g.res = f, g.usedParams = this.getUsedParamsDetails(i), g) : f;
  }
  extendTranslation(e, n, o, i, s) {
    if (this.i18nFormat?.parse)
      e = this.i18nFormat.parse(e, {
        ...this.options.interpolation.defaultVariables,
        ...o
      }, o.lng || this.language || i.usedLng, i.usedNS, i.usedKey, {
        resolved: i
      });
    else if (!o.skipInterpolation) {
      o.interpolation && this.interpolator.init({
        ...o,
        interpolation: {
          ...this.options.interpolation,
          ...o.interpolation
        }
      });
      const l = B(e) && (o?.interpolation?.skipOnVariables !== void 0 ? o.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let d;
      if (l) {
        const p = e.match(this.interpolator.nestingRegexp);
        d = p && p.length;
      }
      let u = o.replace && !B(o.replace) ? o.replace : o;
      if (this.options.interpolation.defaultVariables && (u = {
        ...this.options.interpolation.defaultVariables,
        ...u
      }), e = this.interpolator.interpolate(e, u, o.lng || this.language || i.usedLng, o), l) {
        const p = e.match(this.interpolator.nestingRegexp), m = p && p.length;
        d < m && (o.nest = !1);
      }
      !o.lng && i && i.res && (o.lng = this.language || i.usedLng), o.nest !== !1 && (e = this.interpolator.nest(e, (...p) => s?.[0] === p[0] && !o.context ? (this.logger.warn(`It seems you are nesting recursively key: ${p[0]} in key: ${n[0]}`), null) : this.translate(...p, n), o)), o.interpolation && this.interpolator.reset();
    }
    const r = o.postProcess || this.options.postProcess, a = B(r) ? [r] : r;
    return e != null && a?.length && o.applyPostProcessor !== !1 && (e = zn.handle(a, e, n, this.options && this.options.postProcessPassResolved ? {
      i18nResolved: {
        ...i,
        usedParams: this.getUsedParamsDetails(o)
      },
      ...o
    } : o, this)), e;
  }
  resolve(e, n = {}) {
    let o, i, s, r, a;
    return B(e) && (e = [e]), e.forEach((l) => {
      if (this.isValidLookup(o)) return;
      const d = this.extractFromKey(l, n), u = d.key;
      i = u;
      let p = d.namespaces;
      this.options.fallbackNS && (p = p.concat(this.options.fallbackNS));
      const m = n.count !== void 0 && !B(n.count), g = m && !n.ordinal && n.count === 0, f = n.context !== void 0 && (B(n.context) || typeof n.context == "number") && n.context !== "", b = n.lngs ? n.lngs : this.languageUtils.toResolveHierarchy(n.lng || this.language, n.fallbackLng);
      p.forEach((T) => {
        this.isValidLookup(o) || (a = T, !Bt[`${b[0]}-${T}`] && this.utils?.hasLoadedNamespace && !this.utils?.hasLoadedNamespace(a) && (Bt[`${b[0]}-${T}`] = !0, this.logger.warn(`key "${i}" for languages "${b.join(", ")}" won't get resolved as namespace "${a}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")), b.forEach((C) => {
          if (this.isValidLookup(o)) return;
          r = C;
          const R = [u];
          if (this.i18nFormat?.addLookupKeys)
            this.i18nFormat.addLookupKeys(R, u, C, T, n);
          else {
            let k;
            m && (k = this.pluralResolver.getSuffix(C, n.count, n));
            const $ = `${this.options.pluralSeparator}zero`, E = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (m && (n.ordinal && k.indexOf(E) === 0 && R.push(u + k.replace(E, this.options.pluralSeparator)), R.push(u + k), g && R.push(u + $)), f) {
              const x = `${u}${this.options.contextSeparator || "_"}${n.context}`;
              R.push(x), m && (n.ordinal && k.indexOf(E) === 0 && R.push(x + k.replace(E, this.options.pluralSeparator)), R.push(x + k), g && R.push(x + $));
            }
          }
          let N;
          for (; N = R.pop(); )
            this.isValidLookup(o) || (s = N, o = this.getResource(C, T, N, n));
        }));
      });
    }), {
      res: o,
      usedKey: i,
      exactUsedKey: s,
      usedLng: r,
      usedNS: a
    };
  }
  isValidLookup(e) {
    return e !== void 0 && !(!this.options.returnNull && e === null) && !(!this.options.returnEmptyString && e === "");
  }
  getResource(e, n, o, i = {}) {
    return this.i18nFormat?.getResource ? this.i18nFormat.getResource(e, n, o, i) : this.resourceStore.getResource(e, n, o, i);
  }
  getUsedParamsDetails(e = {}) {
    const n = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"], o = e.replace && !B(e.replace);
    let i = o ? e.replace : e;
    if (o && typeof e.count < "u" && (i.count = e.count), this.options.interpolation.defaultVariables && (i = {
      ...this.options.interpolation.defaultVariables,
      ...i
    }), !o) {
      i = {
        ...i
      };
      for (const s of n)
        delete i[s];
    }
    return i;
  }
  static hasDefaultValue(e) {
    const n = "defaultValue";
    for (const o in e)
      if (Object.prototype.hasOwnProperty.call(e, o) && n === o.substring(0, n.length) && e[o] !== void 0)
        return !0;
    return !1;
  }
}
class _t {
  constructor(e) {
    this.options = e, this.supportedLngs = this.options.supportedLngs || !1, this.logger = be.create("languageUtils");
  }
  getScriptPartFromCode(e) {
    if (e = _e(e), !e || e.indexOf("-") < 0) return null;
    const n = e.split("-");
    return n.length === 2 || (n.pop(), n[n.length - 1].toLowerCase() === "x") ? null : this.formatLanguageCode(n.join("-"));
  }
  getLanguagePartFromCode(e) {
    if (e = _e(e), !e || e.indexOf("-") < 0) return e;
    const n = e.split("-");
    return this.formatLanguageCode(n[0]);
  }
  formatLanguageCode(e) {
    if (B(e) && e.indexOf("-") > -1) {
      let n;
      try {
        n = Intl.getCanonicalLocales(e)[0];
      } catch {
      }
      return n && this.options.lowerCaseLng && (n = n.toLowerCase()), n || (this.options.lowerCaseLng ? e.toLowerCase() : e);
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? e.toLowerCase() : e;
  }
  isSupportedCode(e) {
    return (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) && (e = this.getLanguagePartFromCode(e)), !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(e) > -1;
  }
  getBestMatchFromCodes(e) {
    if (!e) return null;
    let n;
    return e.forEach((o) => {
      if (n) return;
      const i = this.formatLanguageCode(o);
      (!this.options.supportedLngs || this.isSupportedCode(i)) && (n = i);
    }), !n && this.options.supportedLngs && e.forEach((o) => {
      if (n) return;
      const i = this.getScriptPartFromCode(o);
      if (this.isSupportedCode(i)) return n = i;
      const s = this.getLanguagePartFromCode(o);
      if (this.isSupportedCode(s)) return n = s;
      n = this.options.supportedLngs.find((r) => {
        if (r === s) return r;
        if (!(r.indexOf("-") < 0 && s.indexOf("-") < 0) && (r.indexOf("-") > 0 && s.indexOf("-") < 0 && r.substring(0, r.indexOf("-")) === s || r.indexOf(s) === 0 && s.length > 1))
          return r;
      });
    }), n || (n = this.getFallbackCodes(this.options.fallbackLng)[0]), n;
  }
  getFallbackCodes(e, n) {
    if (!e) return [];
    if (typeof e == "function" && (e = e(n)), B(e) && (e = [e]), Array.isArray(e)) return e;
    if (!n) return e.default || [];
    let o = e[n];
    return o || (o = e[this.getScriptPartFromCode(n)]), o || (o = e[this.formatLanguageCode(n)]), o || (o = e[this.getLanguagePartFromCode(n)]), o || (o = e.default), o || [];
  }
  toResolveHierarchy(e, n) {
    const o = this.getFallbackCodes((n === !1 ? [] : n) || this.options.fallbackLng || [], e), i = [], s = (r) => {
      r && (this.isSupportedCode(r) ? i.push(r) : this.logger.warn(`rejecting language code not found in supportedLngs: ${r}`));
    };
    return B(e) && (e.indexOf("-") > -1 || e.indexOf("_") > -1) ? (this.options.load !== "languageOnly" && s(this.formatLanguageCode(e)), this.options.load !== "languageOnly" && this.options.load !== "currentOnly" && s(this.getScriptPartFromCode(e)), this.options.load !== "currentOnly" && s(this.getLanguagePartFromCode(e))) : B(e) && s(this.formatLanguageCode(e)), o.forEach((r) => {
      i.indexOf(r) < 0 && s(this.formatLanguageCode(r));
    }), i;
  }
}
const Kt = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
}, Yt = {
  select: (t) => t === 1 ? "one" : "other",
  resolvedOptions: () => ({
    pluralCategories: ["one", "other"]
  })
};
class Bo {
  constructor(e, n = {}) {
    this.languageUtils = e, this.options = n, this.logger = be.create("pluralResolver"), this.pluralRulesCache = {};
  }
  addRule(e, n) {
    this.rules[e] = n;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(e, n = {}) {
    const o = _e(e === "dev" ? "en" : e), i = n.ordinal ? "ordinal" : "cardinal", s = JSON.stringify({
      cleanedCode: o,
      type: i
    });
    if (s in this.pluralRulesCache)
      return this.pluralRulesCache[s];
    let r;
    try {
      r = new Intl.PluralRules(o, {
        type: i
      });
    } catch {
      if (!Intl)
        return this.logger.error("No Intl support, please use an Intl polyfill!"), Yt;
      if (!e.match(/-|_/)) return Yt;
      const l = this.languageUtils.getLanguagePartFromCode(e);
      r = this.getRule(l, n);
    }
    return this.pluralRulesCache[s] = r, r;
  }
  needsPlural(e, n = {}) {
    let o = this.getRule(e, n);
    return o || (o = this.getRule("dev", n)), o?.resolvedOptions().pluralCategories.length > 1;
  }
  getPluralFormsOfKey(e, n, o = {}) {
    return this.getSuffixes(e, o).map((i) => `${n}${i}`);
  }
  getSuffixes(e, n = {}) {
    let o = this.getRule(e, n);
    return o || (o = this.getRule("dev", n)), o ? o.resolvedOptions().pluralCategories.sort((i, s) => Kt[i] - Kt[s]).map((i) => `${this.options.prepend}${n.ordinal ? `ordinal${this.options.prepend}` : ""}${i}`) : [];
  }
  getSuffix(e, n, o = {}) {
    const i = this.getRule(e, o);
    return i ? `${this.options.prepend}${o.ordinal ? `ordinal${this.options.prepend}` : ""}${i.select(n)}` : (this.logger.warn(`no plural rule found for: ${e}`), this.getSuffix("dev", n, o));
  }
}
const qt = (t, e, n, o = ".", i = !0) => {
  let s = zo(t, e, n);
  return !s && i && B(n) && (s = Et(t, n, o), s === void 0 && (s = Et(e, n, o))), s;
}, gt = (t) => t.replace(/\$/g, "$$$$");
class _o {
  constructor(e = {}) {
    this.logger = be.create("interpolator"), this.options = e, this.format = e?.interpolation?.format || ((n) => n), this.init(e);
  }
  init(e = {}) {
    e.interpolation || (e.interpolation = {
      escapeValue: !0
    });
    const {
      escape: n,
      escapeValue: o,
      useRawValueToEscape: i,
      prefix: s,
      prefixEscaped: r,
      suffix: a,
      suffixEscaped: l,
      formatSeparator: d,
      unescapeSuffix: u,
      unescapePrefix: p,
      nestingPrefix: m,
      nestingPrefixEscaped: g,
      nestingSuffix: f,
      nestingSuffixEscaped: b,
      nestingOptionsSeparator: T,
      maxReplaces: C,
      alwaysFormat: R
    } = e.interpolation;
    this.escape = n !== void 0 ? n : Mo, this.escapeValue = o !== void 0 ? o : !0, this.useRawValueToEscape = i !== void 0 ? i : !1, this.prefix = s ? Ae(s) : r || "{{", this.suffix = a ? Ae(a) : l || "}}", this.formatSeparator = d || ",", this.unescapePrefix = u ? "" : p || "-", this.unescapeSuffix = this.unescapePrefix ? "" : u || "", this.nestingPrefix = m ? Ae(m) : g || Ae("$t("), this.nestingSuffix = f ? Ae(f) : b || Ae(")"), this.nestingOptionsSeparator = T || ",", this.maxReplaces = C || 1e3, this.alwaysFormat = R !== void 0 ? R : !1, this.resetRegExp();
  }
  reset() {
    this.options && this.init(this.options);
  }
  resetRegExp() {
    const e = (n, o) => n?.source === o ? (n.lastIndex = 0, n) : new RegExp(o, "g");
    this.regexp = e(this.regexp, `${this.prefix}(.+?)${this.suffix}`), this.regexpUnescape = e(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`), this.nestingRegexp = e(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`);
  }
  interpolate(e, n, o, i) {
    let s, r, a;
    const l = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}, d = (g) => {
      if (g.indexOf(this.formatSeparator) < 0) {
        const C = qt(n, l, g, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(C, void 0, o, {
          ...i,
          ...n,
          interpolationkey: g
        }) : C;
      }
      const f = g.split(this.formatSeparator), b = f.shift().trim(), T = f.join(this.formatSeparator).trim();
      return this.format(qt(n, l, b, this.options.keySeparator, this.options.ignoreJSONStructure), T, o, {
        ...i,
        ...n,
        interpolationkey: b
      });
    };
    this.resetRegExp();
    const u = i?.missingInterpolationHandler || this.options.missingInterpolationHandler, p = i?.interpolation?.skipOnVariables !== void 0 ? i.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    return [{
      regex: this.regexpUnescape,
      safeValue: (g) => gt(g)
    }, {
      regex: this.regexp,
      safeValue: (g) => this.escapeValue ? gt(this.escape(g)) : gt(g)
    }].forEach((g) => {
      for (a = 0; s = g.regex.exec(e); ) {
        const f = s[1].trim();
        if (r = d(f), r === void 0)
          if (typeof u == "function") {
            const T = u(e, s, i);
            r = B(T) ? T : "";
          } else if (i && Object.prototype.hasOwnProperty.call(i, f))
            r = "";
          else if (p) {
            r = s[0];
            continue;
          } else
            this.logger.warn(`missed to pass in variable ${f} for interpolating ${e}`), r = "";
        else !B(r) && !this.useRawValueToEscape && (r = Ut(r));
        const b = g.safeValue(r);
        if (e = e.replace(s[0], b), p ? (g.regex.lastIndex += r.length, g.regex.lastIndex -= s[0].length) : g.regex.lastIndex = 0, a++, a >= this.maxReplaces)
          break;
      }
    }), e;
  }
  nest(e, n, o = {}) {
    let i, s, r;
    const a = (l, d) => {
      const u = this.nestingOptionsSeparator;
      if (l.indexOf(u) < 0) return l;
      const p = l.split(new RegExp(`${u}[ ]*{`));
      let m = `{${p[1]}`;
      l = p[0], m = this.interpolate(m, r);
      const g = m.match(/'/g), f = m.match(/"/g);
      ((g?.length ?? 0) % 2 === 0 && !f || f.length % 2 !== 0) && (m = m.replace(/'/g, '"'));
      try {
        r = JSON.parse(m), d && (r = {
          ...d,
          ...r
        });
      } catch (b) {
        return this.logger.warn(`failed parsing options string in nesting for key ${l}`, b), `${l}${u}${m}`;
      }
      return r.defaultValue && r.defaultValue.indexOf(this.prefix) > -1 && delete r.defaultValue, l;
    };
    for (; i = this.nestingRegexp.exec(e); ) {
      let l = [];
      r = {
        ...o
      }, r = r.replace && !B(r.replace) ? r.replace : r, r.applyPostProcessor = !1, delete r.defaultValue;
      const d = /{.*}/.test(i[1]) ? i[1].lastIndexOf("}") + 1 : i[1].indexOf(this.formatSeparator);
      if (d !== -1 && (l = i[1].slice(d).split(this.formatSeparator).map((u) => u.trim()).filter(Boolean), i[1] = i[1].slice(0, d)), s = n(a.call(this, i[1].trim(), r), r), s && i[0] === e && !B(s)) return s;
      B(s) || (s = Ut(s)), s || (this.logger.warn(`missed to resolve ${i[1]} for nesting ${e}`), s = ""), l.length && (s = l.reduce((u, p) => this.format(u, p, o.lng, {
        ...o,
        interpolationkey: i[1].trim()
      }), s.trim())), e = e.replace(i[0], s), this.regexp.lastIndex = 0;
    }
    return e;
  }
}
const Ko = (t) => {
  let e = t.toLowerCase().trim();
  const n = {};
  if (t.indexOf("(") > -1) {
    const o = t.split("(");
    e = o[0].toLowerCase().trim();
    const i = o[1].substring(0, o[1].length - 1);
    e === "currency" && i.indexOf(":") < 0 ? n.currency || (n.currency = i.trim()) : e === "relativetime" && i.indexOf(":") < 0 ? n.range || (n.range = i.trim()) : i.split(";").forEach((r) => {
      if (r) {
        const [a, ...l] = r.split(":"), d = l.join(":").trim().replace(/^'+|'+$/g, ""), u = a.trim();
        n[u] || (n[u] = d), d === "false" && (n[u] = !1), d === "true" && (n[u] = !0), isNaN(d) || (n[u] = parseInt(d, 10));
      }
    });
  }
  return {
    formatName: e,
    formatOptions: n
  };
}, Jt = (t) => {
  const e = {};
  return (n, o, i) => {
    let s = i;
    i && i.interpolationkey && i.formatParams && i.formatParams[i.interpolationkey] && i[i.interpolationkey] && (s = {
      ...s,
      [i.interpolationkey]: void 0
    });
    const r = o + JSON.stringify(s);
    let a = e[r];
    return a || (a = t(_e(o), i), e[r] = a), a(n);
  };
}, Yo = (t) => (e, n, o) => t(_e(n), o)(e);
class qo {
  constructor(e = {}) {
    this.logger = be.create("formatter"), this.options = e, this.init(e);
  }
  init(e, n = {
    interpolation: {}
  }) {
    this.formatSeparator = n.interpolation.formatSeparator || ",";
    const o = n.cacheInBuiltFormats ? Jt : Yo;
    this.formats = {
      number: o((i, s) => {
        const r = new Intl.NumberFormat(i, {
          ...s
        });
        return (a) => r.format(a);
      }),
      currency: o((i, s) => {
        const r = new Intl.NumberFormat(i, {
          ...s,
          style: "currency"
        });
        return (a) => r.format(a);
      }),
      datetime: o((i, s) => {
        const r = new Intl.DateTimeFormat(i, {
          ...s
        });
        return (a) => r.format(a);
      }),
      relativetime: o((i, s) => {
        const r = new Intl.RelativeTimeFormat(i, {
          ...s
        });
        return (a) => r.format(a, s.range || "day");
      }),
      list: o((i, s) => {
        const r = new Intl.ListFormat(i, {
          ...s
        });
        return (a) => r.format(a);
      })
    };
  }
  add(e, n) {
    this.formats[e.toLowerCase().trim()] = n;
  }
  addCached(e, n) {
    this.formats[e.toLowerCase().trim()] = Jt(n);
  }
  format(e, n, o, i = {}) {
    const s = n.split(this.formatSeparator);
    if (s.length > 1 && s[0].indexOf("(") > 1 && s[0].indexOf(")") < 0 && s.find((a) => a.indexOf(")") > -1)) {
      const a = s.findIndex((l) => l.indexOf(")") > -1);
      s[0] = [s[0], ...s.splice(1, a)].join(this.formatSeparator);
    }
    return s.reduce((a, l) => {
      const {
        formatName: d,
        formatOptions: u
      } = Ko(l);
      if (this.formats[d]) {
        let p = a;
        try {
          const m = i?.formatParams?.[i.interpolationkey] || {}, g = m.locale || m.lng || i.locale || i.lng || o;
          p = this.formats[d](a, g, {
            ...u,
            ...i,
            ...m
          });
        } catch (m) {
          this.logger.warn(m);
        }
        return p;
      } else
        this.logger.warn(`there was no format function for ${d}`);
      return a;
    }, e);
  }
}
const Jo = (t, e) => {
  t.pending[e] !== void 0 && (delete t.pending[e], t.pendingCount--);
};
class Go extends lt {
  constructor(e, n, o, i = {}) {
    super(), this.backend = e, this.store = n, this.services = o, this.languageUtils = o.languageUtils, this.options = i, this.logger = be.create("backendConnector"), this.waitingReads = [], this.maxParallelReads = i.maxParallelReads || 10, this.readingCalls = 0, this.maxRetries = i.maxRetries >= 0 ? i.maxRetries : 5, this.retryTimeout = i.retryTimeout >= 1 ? i.retryTimeout : 350, this.state = {}, this.queue = [], this.backend?.init?.(o, i.backend, i);
  }
  queueLoad(e, n, o, i) {
    const s = {}, r = {}, a = {}, l = {};
    return e.forEach((d) => {
      let u = !0;
      n.forEach((p) => {
        const m = `${d}|${p}`;
        !o.reload && this.store.hasResourceBundle(d, p) ? this.state[m] = 2 : this.state[m] < 0 || (this.state[m] === 1 ? r[m] === void 0 && (r[m] = !0) : (this.state[m] = 1, u = !1, r[m] === void 0 && (r[m] = !0), s[m] === void 0 && (s[m] = !0), l[p] === void 0 && (l[p] = !0)));
      }), u || (a[d] = !0);
    }), (Object.keys(s).length || Object.keys(r).length) && this.queue.push({
      pending: r,
      pendingCount: Object.keys(r).length,
      loaded: {},
      errors: [],
      callback: i
    }), {
      toLoad: Object.keys(s),
      pending: Object.keys(r),
      toLoadLanguages: Object.keys(a),
      toLoadNamespaces: Object.keys(l)
    };
  }
  loaded(e, n, o) {
    const i = e.split("|"), s = i[0], r = i[1];
    n && this.emit("failedLoading", s, r, n), !n && o && this.store.addResourceBundle(s, r, o, void 0, void 0, {
      skipCopy: !0
    }), this.state[e] = n ? -1 : 2, n && o && (this.state[e] = 0);
    const a = {};
    this.queue.forEach((l) => {
      Ro(l.loaded, [s], r), Jo(l, e), n && l.errors.push(n), l.pendingCount === 0 && !l.done && (Object.keys(l.loaded).forEach((d) => {
        a[d] || (a[d] = {});
        const u = l.loaded[d];
        u.length && u.forEach((p) => {
          a[d][p] === void 0 && (a[d][p] = !0);
        });
      }), l.done = !0, l.errors.length ? l.callback(l.errors) : l.callback());
    }), this.emit("loaded", a), this.queue = this.queue.filter((l) => !l.done);
  }
  read(e, n, o, i = 0, s = this.retryTimeout, r) {
    if (!e.length) return r(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng: e,
        ns: n,
        fcName: o,
        tried: i,
        wait: s,
        callback: r
      });
      return;
    }
    this.readingCalls++;
    const a = (d, u) => {
      if (this.readingCalls--, this.waitingReads.length > 0) {
        const p = this.waitingReads.shift();
        this.read(p.lng, p.ns, p.fcName, p.tried, p.wait, p.callback);
      }
      if (d && u && i < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, e, n, o, i + 1, s * 2, r);
        }, s);
        return;
      }
      r(d, u);
    }, l = this.backend[o].bind(this.backend);
    if (l.length === 2) {
      try {
        const d = l(e, n);
        d && typeof d.then == "function" ? d.then((u) => a(null, u)).catch(a) : a(null, d);
      } catch (d) {
        a(d);
      }
      return;
    }
    return l(e, n, a);
  }
  prepareLoading(e, n, o = {}, i) {
    if (!this.backend)
      return this.logger.warn("No backend was added via i18next.use. Will not load resources."), i && i();
    B(e) && (e = this.languageUtils.toResolveHierarchy(e)), B(n) && (n = [n]);
    const s = this.queueLoad(e, n, o, i);
    if (!s.toLoad.length)
      return s.pending.length || i(), null;
    s.toLoad.forEach((r) => {
      this.loadOne(r);
    });
  }
  load(e, n, o) {
    this.prepareLoading(e, n, {}, o);
  }
  reload(e, n, o) {
    this.prepareLoading(e, n, {
      reload: !0
    }, o);
  }
  loadOne(e, n = "") {
    const o = e.split("|"), i = o[0], s = o[1];
    this.read(i, s, "read", void 0, void 0, (r, a) => {
      r && this.logger.warn(`${n}loading namespace ${s} for language ${i} failed`, r), !r && a && this.logger.log(`${n}loaded namespace ${s} for language ${i}`, a), this.loaded(e, r, a);
    });
  }
  saveMissing(e, n, o, i, s, r = {}, a = () => {
  }) {
    if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(n)) {
      this.logger.warn(`did not save key "${o}" as the namespace "${n}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (!(o == null || o === "")) {
      if (this.backend?.create) {
        const l = {
          ...r,
          isUpdate: s
        }, d = this.backend.create.bind(this.backend);
        if (d.length < 6)
          try {
            let u;
            d.length === 5 ? u = d(e, n, o, i, l) : u = d(e, n, o, i), u && typeof u.then == "function" ? u.then((p) => a(null, p)).catch(a) : a(null, u);
          } catch (u) {
            a(u);
          }
        else
          d(e, n, o, i, a, l);
      }
      !e || !e[0] || this.store.addResource(e[0], n, o, i);
    }
  }
}
const Gt = () => ({
  debug: !1,
  initAsync: !0,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: !1,
  supportedLngs: !1,
  nonExplicitSupportedLngs: !1,
  load: "all",
  preload: !1,
  simplifyPluralSuffix: !0,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  partialBundledLanguages: !1,
  saveMissing: !1,
  updateMissing: !1,
  saveMissingTo: "fallback",
  saveMissingPlurals: !0,
  missingKeyHandler: !1,
  missingInterpolationHandler: !1,
  postProcess: !1,
  postProcessPassResolved: !1,
  returnNull: !1,
  returnEmptyString: !0,
  returnObjects: !1,
  joinArrays: !1,
  returnedObjectHandler: !1,
  parseMissingKeyHandler: !1,
  appendNamespaceToMissingKey: !1,
  appendNamespaceToCIMode: !1,
  overloadTranslationOptionHandler: (t) => {
    let e = {};
    if (typeof t[1] == "object" && (e = t[1]), B(t[1]) && (e.defaultValue = t[1]), B(t[2]) && (e.tDescription = t[2]), typeof t[2] == "object" || typeof t[3] == "object") {
      const n = t[3] || t[2];
      Object.keys(n).forEach((o) => {
        e[o] = n[o];
      });
    }
    return e;
  },
  interpolation: {
    escapeValue: !0,
    format: (t) => t,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: !0
  },
  cacheInBuiltFormats: !0
}), Xt = (t) => (B(t.ns) && (t.ns = [t.ns]), B(t.fallbackLng) && (t.fallbackLng = [t.fallbackLng]), B(t.fallbackNS) && (t.fallbackNS = [t.fallbackNS]), t.supportedLngs?.indexOf?.("cimode") < 0 && (t.supportedLngs = t.supportedLngs.concat(["cimode"])), typeof t.initImmediate == "boolean" && (t.initAsync = t.initImmediate), t), qe = () => {
}, Xo = (t) => {
  Object.getOwnPropertyNames(Object.getPrototypeOf(t)).forEach((n) => {
    typeof t[n] == "function" && (t[n] = t[n].bind(t));
  });
};
class We extends lt {
  constructor(e = {}, n) {
    if (super(), this.options = Xt(e), this.services = {}, this.logger = be, this.modules = {
      external: []
    }, Xo(this), n && !this.isInitialized && !e.isClone) {
      if (!this.options.initAsync)
        return this.init(e, n), this;
      setTimeout(() => {
        this.init(e, n);
      }, 0);
    }
  }
  init(e = {}, n) {
    this.isInitializing = !0, typeof e == "function" && (n = e, e = {}), e.defaultNS == null && e.ns && (B(e.ns) ? e.defaultNS = e.ns : e.ns.indexOf("translation") < 0 && (e.defaultNS = e.ns[0]));
    const o = Gt();
    this.options = {
      ...o,
      ...this.options,
      ...Xt(e)
    }, this.options.interpolation = {
      ...o.interpolation,
      ...this.options.interpolation
    }, e.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = e.keySeparator), e.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = e.nsSeparator);
    const i = (d) => d ? typeof d == "function" ? new d() : d : null;
    if (!this.options.isClone) {
      this.modules.logger ? be.init(i(this.modules.logger), this.options) : be.init(null, this.options);
      let d;
      this.modules.formatter ? d = this.modules.formatter : d = qo;
      const u = new _t(this.options);
      this.store = new Wt(this.options.resources, this.options);
      const p = this.services;
      p.logger = be, p.resourceStore = this.store, p.languageUtils = u, p.pluralResolver = new Bo(u, {
        prepend: this.options.pluralSeparator,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      }), this.options.interpolation.format && this.options.interpolation.format !== o.interpolation.format && this.logger.deprecate("init: you are still using the legacy format function, please use the new approach: https://www.i18next.com/translation-function/formatting"), d && (!this.options.interpolation.format || this.options.interpolation.format === o.interpolation.format) && (p.formatter = i(d), p.formatter.init && p.formatter.init(p, this.options), this.options.interpolation.format = p.formatter.format.bind(p.formatter)), p.interpolator = new _o(this.options), p.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      }, p.backendConnector = new Go(i(this.modules.backend), p.resourceStore, p, this.options), p.backendConnector.on("*", (g, ...f) => {
        this.emit(g, ...f);
      }), this.modules.languageDetector && (p.languageDetector = i(this.modules.languageDetector), p.languageDetector.init && p.languageDetector.init(p, this.options.detection, this.options)), this.modules.i18nFormat && (p.i18nFormat = i(this.modules.i18nFormat), p.i18nFormat.init && p.i18nFormat.init(this)), this.translator = new nt(this.services, this.options), this.translator.on("*", (g, ...f) => {
        this.emit(g, ...f);
      }), this.modules.external.forEach((g) => {
        g.init && g.init(this);
      });
    }
    if (this.format = this.options.interpolation.format, n || (n = qe), this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const d = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      d.length > 0 && d[0] !== "dev" && (this.options.lng = d[0]);
    }
    !this.services.languageDetector && !this.options.lng && this.logger.warn("init: no languageDetector is used and no lng is defined"), ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"].forEach((d) => {
      this[d] = (...u) => this.store[d](...u);
    }), ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"].forEach((d) => {
      this[d] = (...u) => (this.store[d](...u), this);
    });
    const a = Ve(), l = () => {
      const d = (u, p) => {
        this.isInitializing = !1, this.isInitialized && !this.initializedStoreOnce && this.logger.warn("init: i18next is already initialized. You should call init just once!"), this.isInitialized = !0, this.options.isClone || this.logger.log("initialized", this.options), this.emit("initialized", this.options), a.resolve(p), n(u, p);
      };
      if (this.languages && !this.isInitialized) return d(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, d);
    };
    return this.options.resources || !this.options.initAsync ? l() : setTimeout(l, 0), a;
  }
  loadResources(e, n = qe) {
    let o = n;
    const i = B(e) ? e : this.language;
    if (typeof e == "function" && (o = e), !this.options.resources || this.options.partialBundledLanguages) {
      if (i?.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return o();
      const s = [], r = (a) => {
        if (!a || a === "cimode") return;
        this.services.languageUtils.toResolveHierarchy(a).forEach((d) => {
          d !== "cimode" && s.indexOf(d) < 0 && s.push(d);
        });
      };
      i ? r(i) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((l) => r(l)), this.options.preload?.forEach?.((a) => r(a)), this.services.backendConnector.load(s, this.options.ns, (a) => {
        !a && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language), o(a);
      });
    } else
      o(null);
  }
  reloadResources(e, n, o) {
    const i = Ve();
    return typeof e == "function" && (o = e, e = void 0), typeof n == "function" && (o = n, n = void 0), e || (e = this.languages), n || (n = this.options.ns), o || (o = qe), this.services.backendConnector.reload(e, n, (s) => {
      i.resolve(), o(s);
    }), i;
  }
  use(e) {
    if (!e) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!e.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    return e.type === "backend" && (this.modules.backend = e), (e.type === "logger" || e.log && e.warn && e.error) && (this.modules.logger = e), e.type === "languageDetector" && (this.modules.languageDetector = e), e.type === "i18nFormat" && (this.modules.i18nFormat = e), e.type === "postProcessor" && zn.addPostProcessor(e), e.type === "formatter" && (this.modules.formatter = e), e.type === "3rdParty" && this.modules.external.push(e), this;
  }
  setResolvedLanguage(e) {
    if (!(!e || !this.languages) && !(["cimode", "dev"].indexOf(e) > -1)) {
      for (let n = 0; n < this.languages.length; n++) {
        const o = this.languages[n];
        if (!(["cimode", "dev"].indexOf(o) > -1) && this.store.hasLanguageSomeTranslations(o)) {
          this.resolvedLanguage = o;
          break;
        }
      }
      !this.resolvedLanguage && this.languages.indexOf(e) < 0 && this.store.hasLanguageSomeTranslations(e) && (this.resolvedLanguage = e, this.languages.unshift(e));
    }
  }
  changeLanguage(e, n) {
    this.isLanguageChangingTo = e;
    const o = Ve();
    this.emit("languageChanging", e);
    const i = (a) => {
      this.language = a, this.languages = this.services.languageUtils.toResolveHierarchy(a), this.resolvedLanguage = void 0, this.setResolvedLanguage(a);
    }, s = (a, l) => {
      l ? this.isLanguageChangingTo === e && (i(l), this.translator.changeLanguage(l), this.isLanguageChangingTo = void 0, this.emit("languageChanged", l), this.logger.log("languageChanged", l)) : this.isLanguageChangingTo = void 0, o.resolve((...d) => this.t(...d)), n && n(a, (...d) => this.t(...d));
    }, r = (a) => {
      !e && !a && this.services.languageDetector && (a = []);
      const l = B(a) ? a : a && a[0], d = this.store.hasLanguageSomeTranslations(l) ? l : this.services.languageUtils.getBestMatchFromCodes(B(a) ? [a] : a);
      d && (this.language || i(d), this.translator.language || this.translator.changeLanguage(d), this.services.languageDetector?.cacheUserLanguage?.(d)), this.loadResources(d, (u) => {
        s(u, d);
      });
    };
    return !e && this.services.languageDetector && !this.services.languageDetector.async ? r(this.services.languageDetector.detect()) : !e && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect.length === 0 ? this.services.languageDetector.detect().then(r) : this.services.languageDetector.detect(r) : r(e), o;
  }
  getFixedT(e, n, o) {
    const i = (s, r, ...a) => {
      let l;
      typeof r != "object" ? l = this.options.overloadTranslationOptionHandler([s, r].concat(a)) : l = {
        ...r
      }, l.lng = l.lng || i.lng, l.lngs = l.lngs || i.lngs, l.ns = l.ns || i.ns, l.keyPrefix !== "" && (l.keyPrefix = l.keyPrefix || o || i.keyPrefix);
      const d = this.options.keySeparator || ".";
      let u;
      return l.keyPrefix && Array.isArray(s) ? u = s.map((p) => (typeof p == "function" && (p = Pt(p, {
        ...this.options,
        ...r
      })), `${l.keyPrefix}${d}${p}`)) : (typeof s == "function" && (s = Pt(s, {
        ...this.options,
        ...r
      })), u = l.keyPrefix ? `${l.keyPrefix}${d}${s}` : s), this.t(u, l);
    };
    return B(e) ? i.lng = e : i.lngs = e, i.ns = n, i.keyPrefix = o, i;
  }
  t(...e) {
    return this.translator?.translate(...e);
  }
  exists(...e) {
    return this.translator?.exists(...e);
  }
  setDefaultNamespace(e) {
    this.options.defaultNS = e;
  }
  hasLoadedNamespace(e, n = {}) {
    if (!this.isInitialized)
      return this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages), !1;
    if (!this.languages || !this.languages.length)
      return this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages), !1;
    const o = n.lng || this.resolvedLanguage || this.languages[0], i = this.options ? this.options.fallbackLng : !1, s = this.languages[this.languages.length - 1];
    if (o.toLowerCase() === "cimode") return !0;
    const r = (a, l) => {
      const d = this.services.backendConnector.state[`${a}|${l}`];
      return d === -1 || d === 0 || d === 2;
    };
    if (n.precheck) {
      const a = n.precheck(this, r);
      if (a !== void 0) return a;
    }
    return !!(this.hasResourceBundle(o, e) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || r(o, e) && (!i || r(s, e)));
  }
  loadNamespaces(e, n) {
    const o = Ve();
    return this.options.ns ? (B(e) && (e = [e]), e.forEach((i) => {
      this.options.ns.indexOf(i) < 0 && this.options.ns.push(i);
    }), this.loadResources((i) => {
      o.resolve(), n && n(i);
    }), o) : (n && n(), Promise.resolve());
  }
  loadLanguages(e, n) {
    const o = Ve();
    B(e) && (e = [e]);
    const i = this.options.preload || [], s = e.filter((r) => i.indexOf(r) < 0 && this.services.languageUtils.isSupportedCode(r));
    return s.length ? (this.options.preload = i.concat(s), this.loadResources((r) => {
      o.resolve(), n && n(r);
    }), o) : (n && n(), Promise.resolve());
  }
  dir(e) {
    if (e || (e = this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language)), !e) return "rtl";
    try {
      const i = new Intl.Locale(e);
      if (i && i.getTextInfo) {
        const s = i.getTextInfo();
        if (s && s.direction) return s.direction;
      }
    } catch {
    }
    const n = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"], o = this.services?.languageUtils || new _t(Gt());
    return e.toLowerCase().indexOf("-latn") > 1 ? "ltr" : n.indexOf(o.getLanguagePartFromCode(e)) > -1 || e.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance(e = {}, n) {
    const o = new We(e, n);
    return o.createInstance = We.createInstance, o;
  }
  cloneInstance(e = {}, n = qe) {
    const o = e.forkResourceStore;
    o && delete e.forkResourceStore;
    const i = {
      ...this.options,
      ...e,
      isClone: !0
    }, s = new We(i);
    if ((e.debug !== void 0 || e.prefix !== void 0) && (s.logger = s.logger.clone(e)), ["store", "services", "language"].forEach((a) => {
      s[a] = this[a];
    }), s.services = {
      ...this.services
    }, s.services.utils = {
      hasLoadedNamespace: s.hasLoadedNamespace.bind(s)
    }, o) {
      const a = Object.keys(this.store.data).reduce((l, d) => (l[d] = {
        ...this.store.data[d]
      }, l[d] = Object.keys(l[d]).reduce((u, p) => (u[p] = {
        ...l[d][p]
      }, u), l[d]), l), {});
      s.store = new Wt(a, i), s.services.resourceStore = s.store;
    }
    return s.translator = new nt(s.services, i), s.translator.on("*", (a, ...l) => {
      s.emit(a, ...l);
    }), s.init(i, n), s.translator.options = i, s.translator.backendConnector.services.utils = {
      hasLoadedNamespace: s.hasLoadedNamespace.bind(s)
    }, s;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const le = We.createInstance();
le.createInstance;
le.dir;
le.init;
le.loadResources;
le.reloadResources;
le.use;
le.changeLanguage;
le.getFixedT;
le.t;
le.exists;
le.setDefaultNamespace;
le.hasLoadedNamespace;
le.loadNamespaces;
le.loadLanguages;
const Zo = "مجلد جديد", Qo = "رفع", ei = "لصق", ti = "تغيير العرض", ni = "تحديث", oi = "قص", ii = "نسخ", si = "إعادة تسمية", ri = "تنزيل", ai = "تم تحديد العنصر", li = "تم تحديد {{count}} عناصر", ci = "إلغاء", di = "مسح التحديد", ui = "تم", pi = "إذا قمت بتغيير امتداد الملف، قد يصبح الملف غير قابل للاستخدام. هل أنت متأكد من أنك تريد تغييره؟", fi = "لا", hi = "نعم", mi = "إغلاق", gi = "نوع الملف غير مسموح به.", vi = "الملف موجود بالفعل.", $i = "أقصى حجم رفع هو", yi = "اسحب الملفات للرفع", wi = "اختيار ملف", bi = "فشل الرفع.", xi = "جاري الرفع", Ci = "تم الرفع", Si = "إزالة", Fi = "إلغاء الرفع", Ni = "معاينة", ki = "آسف! المعاينة غير متاحة لهذا الملف.", Ei = "الصفحة الرئيسية", Pi = "عرض المزيد من المجلدات", Ti = "نقل إلى", Li = "هذا المجلد فارغ.", Ai = "تحديد الكل", Oi = "عرض", Ri = "شبكة", zi = "قائمة", Ii = "فتح", Mi = "لا شيء هنا بعد", ji = "الاسم", Ui = "تاريخ التعديل", Di = "الحجم", Vi = 'هل أنت متأكد أنك تريد حذف "{{fileName}}"؟', Hi = "هل أنت متأكد أنك تريد حذف هذه العناصر {{count}}؟", Wi = "{{percent}}% تم", Bi = "تم الإلغاء", _i = 'لا يمكن أن يحتوي اسم الملف على أي من الحروف التالية: \\ / : * ? " < > |', Ki = 'هذا الموقع يحتوي بالفعل على مجلد باسم "{{renameFile}}".', Yi = "طي لوحة التنقل", qi = "توسيع لوحة التنقل", Ji = {
  newFolder: Zo,
  upload: Qo,
  paste: ei,
  changeView: ti,
  refresh: ni,
  cut: oi,
  copy: ii,
  rename: si,
  download: ri,
  delete: "حذف",
  itemSelected: ai,
  itemsSelected: li,
  cancel: ci,
  clearSelection: di,
  completed: ui,
  fileNameChangeWarning: pi,
  no: fi,
  yes: hi,
  close: mi,
  fileTypeNotAllowed: gi,
  fileAlreadyExist: vi,
  maxUploadSize: $i,
  dragFileToUpload: yi,
  chooseFile: wi,
  uploadFail: bi,
  uploading: xi,
  uploaded: Ci,
  remove: Si,
  abortUpload: Fi,
  preview: Ni,
  previewUnavailable: ki,
  home: Ei,
  showMoreFolder: Pi,
  moveTo: Ti,
  folderEmpty: Li,
  selectAll: Ai,
  view: Oi,
  grid: Ri,
  list: zi,
  open: Ii,
  nothingHereYet: Mi,
  name: ji,
  modified: Ui,
  size: Di,
  deleteItemConfirm: Vi,
  deleteItemsConfirm: Hi,
  percentDone: Wi,
  canceled: Bi,
  invalidFileName: _i,
  folderExists: Ki,
  collapseNavigationPane: Yi,
  expandNavigationPane: qi
}, Gi = "Ny mappe", Xi = "Upload", Zi = "Indsæt", Qi = "Skift visning", es = "Opdater", ts = "Klip", ns = "Kopiér", os = "Omdøb", is = "Download", ss = "element valgt", rs = "elementer valgt", as = "Annuller", ls = "Ryd markering", cs = "Fuldført", ds = "Hvis du ændrer en filendelse, kan filen blive ubrugelig. Er du sikker på, at du vil ændre den?", us = "Nej", ps = "Ja", fs = "Luk", hs = "Filtypen er ikke tilladt.", ms = "Fil findes allerede.", gs = "Maksimal uploadstørrelse er", vs = "Træk filer for at uploade", $s = "Vælg fil", ys = "Upload mislykkedes.", ws = "Uploader", bs = "Uploadet", xs = "Fjern", Cs = "Afbryd upload", Ss = "Forhåndsvisning", Fs = "Beklager! Forhåndsvisning er ikke tilgængelig for denne fil.", Ns = "Hjem", ks = "Vis flere mapper", Es = "Flyt til", Ps = "Denne mappe er tom.", Ts = "Vælg alle", Ls = "Vis", As = "Gitter", Os = "Liste", Rs = "Åbn", zs = "Intet her endnu", Is = "Navn", Ms = "Ændret", js = "Størrelse", Us = 'Er du sikker på, at du vil slette "{{fileName}}"?', Ds = "Er du sikker på, at du vil slette disse {{count}} elementer?", Vs = "{{percent}}% færdig", Hs = "Annulleret", Ws = 'Et filnavn må ikke indeholde følgende tegn: \\ / : * ? " < > |', Bs = 'Denne destination indeholder allerede en mappe med navnet "{{renameFile}}".', _s = "Skjul navigationsrude", Ks = "Udvid navigationsrude", Ys = {
  newFolder: Gi,
  upload: Xi,
  paste: Zi,
  changeView: Qi,
  refresh: es,
  cut: ts,
  copy: ns,
  rename: os,
  download: is,
  delete: "Slet",
  itemSelected: ss,
  itemsSelected: rs,
  cancel: as,
  clearSelection: ls,
  completed: cs,
  fileNameChangeWarning: ds,
  no: us,
  yes: ps,
  close: fs,
  fileTypeNotAllowed: hs,
  fileAlreadyExist: ms,
  maxUploadSize: gs,
  dragFileToUpload: vs,
  chooseFile: $s,
  uploadFail: ys,
  uploading: ws,
  uploaded: bs,
  remove: xs,
  abortUpload: Cs,
  preview: Ss,
  previewUnavailable: Fs,
  home: Ns,
  showMoreFolder: ks,
  moveTo: Es,
  folderEmpty: Ps,
  selectAll: Ts,
  view: Ls,
  grid: As,
  list: Os,
  open: Rs,
  nothingHereYet: zs,
  name: Is,
  modified: Ms,
  size: js,
  deleteItemConfirm: Us,
  deleteItemsConfirm: Ds,
  percentDone: Vs,
  canceled: Hs,
  invalidFileName: Ws,
  folderExists: Bs,
  collapseNavigationPane: _s,
  expandNavigationPane: Ks
}, qs = "Neuer Ordner", Js = "Hochladen", Gs = "Einfügen", Xs = "Ansicht ändern", Zs = "Aktualisieren", Qs = "Ausschneiden", er = "Kopieren", tr = "Umbenennen", nr = "Herunterladen", or = "Element ausgewählt", ir = "Elemente ausgewählt", sr = "Abbrechen", rr = "Auswahl aufheben", ar = "Abgeschlossen", lr = "Wenn Sie die Dateierweiterung ändern, kann die Datei unbrauchbar werden. Möchten Sie das wirklich tun?", cr = "Nein", dr = "Ja", ur = "Schließen", pr = "Dateityp nicht erlaubt.", fr = "Datei existiert bereits.", hr = "Maximale Uploadgröße ist", mr = "Dateien zum Hochladen ziehen", gr = "Datei auswählen", vr = "Hochladen fehlgeschlagen.", $r = "Wird hochgeladen", yr = "Hochgeladen", wr = "Entfernen", br = "Upload abbrechen", xr = "Vorschau", Cr = "Leider ist keine Vorschau für diese Datei verfügbar.", Sr = "Startseite", Fr = "Mehr Ordner anzeigen", Nr = "Verschieben nach", kr = "Dieser Ordner ist leer.", Er = "Alle auswählen", Pr = "Ansicht", Tr = "Raster", Lr = "Liste", Ar = "Öffnen", Or = "Hier ist noch nichts", Rr = "Name", zr = "Geändert", Ir = "Größe", Mr = 'Möchten Sie "{{fileName}}" wirklich löschen?', jr = "Möchten Sie diese {{count}} Elemente wirklich löschen?", Ur = "{{percent}}% erledigt", Dr = "Abgebrochen", Vr = 'Ein Dateiname darf keines der folgenden Zeichen enthalten: \\ / : * ? " < > |', Hr = 'In diesem Zielordner gibt es bereits einen Ordner namens "{{renameFile}}".', Wr = "Navigationsbereich einklappen", Br = "Navigationsbereich erweitern", _r = {
  newFolder: qs,
  upload: Js,
  paste: Gs,
  changeView: Xs,
  refresh: Zs,
  cut: Qs,
  copy: er,
  rename: tr,
  download: nr,
  delete: "Löschen",
  itemSelected: or,
  itemsSelected: ir,
  cancel: sr,
  clearSelection: rr,
  completed: ar,
  fileNameChangeWarning: lr,
  no: cr,
  yes: dr,
  close: ur,
  fileTypeNotAllowed: pr,
  fileAlreadyExist: fr,
  maxUploadSize: hr,
  dragFileToUpload: mr,
  chooseFile: gr,
  uploadFail: vr,
  uploading: $r,
  uploaded: yr,
  remove: wr,
  abortUpload: br,
  preview: xr,
  previewUnavailable: Cr,
  home: Sr,
  showMoreFolder: Fr,
  moveTo: Nr,
  folderEmpty: kr,
  selectAll: Er,
  view: Pr,
  grid: Tr,
  list: Lr,
  open: Ar,
  nothingHereYet: Or,
  name: Rr,
  modified: zr,
  size: Ir,
  deleteItemConfirm: Mr,
  deleteItemsConfirm: jr,
  percentDone: Ur,
  canceled: Dr,
  invalidFileName: Vr,
  folderExists: Hr,
  collapseNavigationPane: Wr,
  expandNavigationPane: Br
}, Kr = "New Folder", Yr = "Upload", qr = "Paste", Jr = "Change View", Gr = "Refresh", Xr = "Search", Zr = "Search", Qr = "No matching files in this folder", ea = "Filter by service", ta = "All", na = "Cut", oa = "Copy", ia = "Rename", sa = "Download", ra = "item selected", aa = "items selected", la = "Cancel", ca = "Clear Selection", da = "Completed", ua = "If you change a file name extension, the file might become unusable. Are you sure you want to change it?", pa = "No", fa = "Yes", ha = "Close", ma = "File type is not allowed.", ga = "File already exists.", va = "Maximum upload size is", $a = "Drag files to upload", ya = "Choose File", wa = "Upload failed.", ba = "Uploading", xa = "Uploaded", Ca = "Remove", Sa = "Abort Upload", Fa = "Preview", Na = "Sorry! Preview is not available for this file.", ka = "Home", Ea = "Show more folders", Pa = "Move to", Ta = "This folder is empty.", La = "Select all", Aa = "View", Oa = "Grid", Ra = "List", za = "Preview", Ia = "Nothing here yet", Ma = "Folder/Files", ja = "Last Modified", Ua = "Size", Da = 'Are you sure you want to delete "{{fileName}}"?', Va = "Are you sure you want to delete these {{count}} items?", Ha = "{{percent}}% done", Wa = "Canceled", Ba = `A file name can't contain any of the following characters: \\ / : * ? " < > |`, _a = 'This destination already contains a folder named "{{renameFile}}".', Ka = "Collapse Navigation Pane", Ya = "Expand Navigation Pane", qa = "More", Ja = "Hide superseded files", Ga = "Show superseded files", Xa = "Show archived files", Za = "Hide archived files", Qa = {
  newFolder: Kr,
  upload: Yr,
  paste: qr,
  changeView: Jr,
  refresh: Gr,
  search: Xr,
  searchPlaceholder: Zr,
  searchNoResults: Qr,
  filterByService: ea,
  all: ta,
  cut: na,
  copy: oa,
  rename: ia,
  download: sa,
  delete: "Archive",
  itemSelected: ra,
  itemsSelected: aa,
  cancel: la,
  clearSelection: ca,
  completed: da,
  fileNameChangeWarning: ua,
  no: pa,
  yes: fa,
  close: ha,
  fileTypeNotAllowed: ma,
  fileAlreadyExist: ga,
  maxUploadSize: va,
  dragFileToUpload: $a,
  chooseFile: ya,
  uploadFail: wa,
  uploading: ba,
  uploaded: xa,
  remove: Ca,
  abortUpload: Sa,
  preview: Fa,
  previewUnavailable: Na,
  home: ka,
  showMoreFolder: Ea,
  moveTo: Pa,
  folderEmpty: Ta,
  selectAll: La,
  view: Aa,
  grid: Oa,
  list: Ra,
  open: za,
  nothingHereYet: Ia,
  name: Ma,
  modified: ja,
  size: Ua,
  deleteItemConfirm: Da,
  deleteItemsConfirm: Va,
  percentDone: Ha,
  canceled: Wa,
  invalidFileName: Ba,
  folderExists: _a,
  collapseNavigationPane: Ka,
  expandNavigationPane: Ya,
  more: qa,
  hideSupersededFiles: Ja,
  showSupersededFiles: Ga,
  showArchivedFiles: Xa,
  hideArchivedFiles: Za
}, el = "Nueva carpeta", tl = "Subir", nl = "Pegar", ol = "Cambiar vista", il = "Actualizar", sl = "Cortar", rl = "Copiar", al = "Renombrar", ll = "Descargar", cl = "elemento seleccionado", dl = "elementos seleccionados", ul = "Cancelar", pl = "Borrar selección", fl = "Completado", hl = "Si cambia la extensión del archivo, es posible que no funcione. ¿Está seguro de que desea cambiarla?", ml = "No", gl = "Sí", vl = "Cerrar", $l = "Tipo de archivo no permitido.", yl = "El archivo ya existe.", wl = "El tamaño máximo de subida es", bl = "Arrastre archivos para subir", xl = "Elegir archivo", Cl = "Error al subir.", Sl = "Subiendo", Fl = "Subido", Nl = "Eliminar", kl = "Cancelar subida", El = "Vista previa", Pl = "¡Lo sentimos! No hay vista previa disponible para este archivo.", Tl = "Inicio", Ll = "Mostrar más carpetas", Al = "Mover a", Ol = "Esta carpeta está vacía.", Rl = "Seleccionar todo", zl = "Vista", Il = "Cuadrícula", Ml = "Lista", jl = "Abrir", Ul = "Nada por aquí aún", Dl = "Nombre", Vl = "Modificado", Hl = "Tamaño", Wl = '¿Está seguro de que desea eliminar "{{fileName}}"?', Bl = "¿Está seguro de que desea eliminar estos {{count}} elementos?", _l = "{{percent}}% completado", Kl = "Cancelado", Yl = 'Un nombre de archivo no puede contener ninguno de los siguientes caracteres: \\ / : * ? " < > |', ql = 'Ya existe una carpeta llamada "{{renameFile}}" en este destino.', Jl = "Contraer panel de navegación", Gl = "Expandir panel de navegación", Xl = {
  newFolder: el,
  upload: tl,
  paste: nl,
  changeView: ol,
  refresh: il,
  cut: sl,
  copy: rl,
  rename: al,
  download: ll,
  delete: "Eliminar",
  itemSelected: cl,
  itemsSelected: dl,
  cancel: ul,
  clearSelection: pl,
  completed: fl,
  fileNameChangeWarning: hl,
  no: ml,
  yes: gl,
  close: vl,
  fileTypeNotAllowed: $l,
  fileAlreadyExist: yl,
  maxUploadSize: wl,
  dragFileToUpload: bl,
  chooseFile: xl,
  uploadFail: Cl,
  uploading: Sl,
  uploaded: Fl,
  remove: Nl,
  abortUpload: kl,
  preview: El,
  previewUnavailable: Pl,
  home: Tl,
  showMoreFolder: Ll,
  moveTo: Al,
  folderEmpty: Ol,
  selectAll: Rl,
  view: zl,
  grid: Il,
  list: Ml,
  open: jl,
  nothingHereYet: Ul,
  name: Dl,
  modified: Vl,
  size: Hl,
  deleteItemConfirm: Wl,
  deleteItemsConfirm: Bl,
  percentDone: _l,
  canceled: Kl,
  invalidFileName: Yl,
  folderExists: ql,
  collapseNavigationPane: Jl,
  expandNavigationPane: Gl
}, Zl = "پوشه جدید", Ql = "بارگذاری", ec = "الحاق", tc = "تغییر نمایش", nc = "بازخوانی", oc = "برش", ic = "کپی", sc = "تغییر نام", rc = "دانلود", ac = "مورد انتخاب شده", lc = "مورد انتخاب شده", cc = "لغو", dc = "پاک کردن انتخاب", uc = "تکمیل شد", pc = "اگر پسوند نام فایل را تغییر دهید، ممکن است فایل غیرقابل استفاده شود. آیا مطمئن هستید که می‌خواهید آن را تغییر دهید؟", fc = "خیر", hc = "بله", mc = "بستن", gc = "نوع فایل مجاز نیست.", vc = "فایل از قبل موجود است.", $c = "حداکثر اندازه بارگذاری", yc = "فایل‌ها را برای بارگذاری بکشید", wc = "انتخاب فایل", bc = "بارگذاری ناموفق بود.", xc = "در حال بارگذاری", Cc = "بارگذاری شد", Sc = "حذف", Fc = "لغو بارگذاری", Nc = "پیش‌نمایش", kc = "متأسفیم! پیش‌نمایش برای این فایل در دسترس نیست.", Ec = "خانه", Pc = "نمایش پوشه‌های بیشتر", Tc = "انتقال به", Lc = "این پوشه خالی است.", Ac = "انتخاب همه", Oc = "نمایش", Rc = "شبکه‌ای", zc = "لیستی", Ic = "باز کردن", Mc = "هنوز چیزی اینجا نیست", jc = "نام", Uc = "تغییر یافته", Dc = "اندازه", Vc = 'آیا مطمئن هستید که می‌خواهید "{{fileName}}" را حذف کنید؟', Hc = "آیا مطمئن هستید که می‌خواهید این {{count}} مورد را حذف کنید؟", Wc = "{{percent}}% انجام شد", Bc = "لغو شد", _c = 'نام فایل نمی‌تواند شامل هیچ یک از کاراکترهای زیر باشد: \\ / : * ? " < > |', Kc = 'این مقصد از قبل شامل پوشه‌ای به نام "{{renameFile}}" است.', Yc = "بستن پنل ناوبری", qc = "باز کردن پنل ناوبری", Jc = {
  newFolder: Zl,
  upload: Ql,
  paste: ec,
  changeView: tc,
  refresh: nc,
  cut: oc,
  copy: ic,
  rename: sc,
  download: rc,
  delete: "حذف",
  itemSelected: ac,
  itemsSelected: lc,
  cancel: cc,
  clearSelection: dc,
  completed: uc,
  fileNameChangeWarning: pc,
  no: fc,
  yes: hc,
  close: mc,
  fileTypeNotAllowed: gc,
  fileAlreadyExist: vc,
  maxUploadSize: $c,
  dragFileToUpload: yc,
  chooseFile: wc,
  uploadFail: bc,
  uploading: xc,
  uploaded: Cc,
  remove: Sc,
  abortUpload: Fc,
  preview: Nc,
  previewUnavailable: kc,
  home: Ec,
  showMoreFolder: Pc,
  moveTo: Tc,
  folderEmpty: Lc,
  selectAll: Ac,
  view: Oc,
  grid: Rc,
  list: zc,
  open: Ic,
  nothingHereYet: Mc,
  name: jc,
  modified: Uc,
  size: Dc,
  deleteItemConfirm: Vc,
  deleteItemsConfirm: Hc,
  percentDone: Wc,
  canceled: Bc,
  invalidFileName: _c,
  folderExists: Kc,
  collapseNavigationPane: Yc,
  expandNavigationPane: qc
}, Gc = "Uusi kansio", Xc = "Lataa", Zc = "Liitä", Qc = "Vaihda näkymää", ed = "Päivitä", td = "Leikkaa", nd = "Kopioi", od = "Nimeä uudelleen", id = "Lataa", sd = "kohde valittu", rd = "kohdetta valittu", ad = "Peruuta", ld = "Tyhjennä valinta", cd = "Valmis", dd = "Jos muutat tiedostopäätettä, tiedosto ei ehkä enää toimi. Haluatko varmasti muuttaa sen?", ud = "Ei", pd = "Kyllä", fd = "Sulje", hd = "Tiedostotyyppi ei sallittu.", md = "Tiedosto on jo olemassa.", gd = "Suurin sallittu tiedostokoko on", vd = "Raahaa tiedostoja ladattavaksi", $d = "Valitse tiedosto", yd = "Lataus epäonnistui.", wd = "Ladataan", bd = "Ladattu", xd = "Poista", Cd = "Keskeytä lataus", Sd = "Esikatsele", Fd = "Valitettavasti esikatselua ei ole saatavilla tälle tiedostolle.", Nd = "Etusivu", kd = "Näytä lisää kansioita", Ed = "Siirrä kohteeseen", Pd = "Tämä kansio on tyhjä.", Td = "Valitse kaikki", Ld = "Näytä", Ad = "Ruudukko", Od = "Lista", Rd = "Avaa", zd = "Täällä ei ole vielä mitään", Id = "Nimi", Md = "Muokattu", jd = "Koko", Ud = 'Haluatko varmasti poistaa tiedoston "{{fileName}}"?', Dd = "Haluatko varmasti poistaa nämä {{count}} kohdetta?", Vd = "{{percent}}% valmis", Hd = "Peruutettu", Wd = 'Tiedostonimessä ei voi olla seuraavia merkkejä: \\ / : * ? " < > |', Bd = 'Kohteessa on jo kansio nimeltä "{{renameFile}}".', _d = "Pienennä navigointipaneeli", Kd = "Laajenna navigointipaneeli", Yd = {
  newFolder: Gc,
  upload: Xc,
  paste: Zc,
  changeView: Qc,
  refresh: ed,
  cut: td,
  copy: nd,
  rename: od,
  download: id,
  delete: "Poista",
  itemSelected: sd,
  itemsSelected: rd,
  cancel: ad,
  clearSelection: ld,
  completed: cd,
  fileNameChangeWarning: dd,
  no: ud,
  yes: pd,
  close: fd,
  fileTypeNotAllowed: hd,
  fileAlreadyExist: md,
  maxUploadSize: gd,
  dragFileToUpload: vd,
  chooseFile: $d,
  uploadFail: yd,
  uploading: wd,
  uploaded: bd,
  remove: xd,
  abortUpload: Cd,
  preview: Sd,
  previewUnavailable: Fd,
  home: Nd,
  showMoreFolder: kd,
  moveTo: Ed,
  folderEmpty: Pd,
  selectAll: Td,
  view: Ld,
  grid: Ad,
  list: Od,
  open: Rd,
  nothingHereYet: zd,
  name: Id,
  modified: Md,
  size: jd,
  deleteItemConfirm: Ud,
  deleteItemsConfirm: Dd,
  percentDone: Vd,
  canceled: Hd,
  invalidFileName: Wd,
  folderExists: Bd,
  collapseNavigationPane: _d,
  expandNavigationPane: Kd
}, qd = "Nouveau dossier", Jd = "Téléverser", Gd = "Coller", Xd = "Changer la vue", Zd = "Rafraîchir", Qd = "Couper", eu = "Copier", tu = "Renommer", nu = "Télécharger", ou = "élément sélectionné", iu = "éléments sélectionnés", su = "Annuler", ru = "Effacer la sélection", au = "Terminé", lu = "Si vous modifiez l'extension d'un fichier, celui-ci pourrait devenir inutilisable. Êtes-vous sûr de vouloir le modifier ?", cu = "Non", du = "Oui", uu = "Fermer", pu = "Type de fichier non autorisé.", fu = "Le fichier existe déjà.", hu = "La taille maximale de téléversement est", mu = "Glissez les fichiers à téléverser", gu = "Choisir un fichier", vu = "Échec du téléversement.", $u = "Téléversement en cours", yu = "Téléversé", wu = "Supprimer", bu = "Annuler le téléversement", xu = "Aperçu", Cu = "Désolé ! L'aperçu n'est pas disponible pour ce fichier.", Su = "Accueil", Fu = "Afficher plus de dossiers", Nu = "Déplacer vers", ku = "Ce dossier est vide.", Eu = "Tout sélectionner", Pu = "Vue", Tu = "Grille", Lu = "Liste", Au = "Ouvrir", Ou = "Rien ici pour le moment", Ru = "Nom", zu = "Modifié", Iu = "Taille", Mu = 'Êtes-vous sûr de vouloir supprimer "{{fileName}}" ?', ju = "Êtes-vous sûr de vouloir supprimer ces {{count}} éléments ?", Uu = "{{percent}}% terminé", Du = "Annulé", Vu = 'Un nom de fichier ne peut pas contenir les caractères suivants : \\ / : * ? " < > |', Hu = 'Cette destination contient déjà un dossier nommé "{{renameFile}}".', Wu = "Réduire le panneau de navigation", Bu = "Développer le panneau de navigation", _u = {
  newFolder: qd,
  upload: Jd,
  paste: Gd,
  changeView: Xd,
  refresh: Zd,
  cut: Qd,
  copy: eu,
  rename: tu,
  download: nu,
  delete: "Supprimer",
  itemSelected: ou,
  itemsSelected: iu,
  cancel: su,
  clearSelection: ru,
  completed: au,
  fileNameChangeWarning: lu,
  no: cu,
  yes: du,
  close: uu,
  fileTypeNotAllowed: pu,
  fileAlreadyExist: fu,
  maxUploadSize: hu,
  dragFileToUpload: mu,
  chooseFile: gu,
  uploadFail: vu,
  uploading: $u,
  uploaded: yu,
  remove: wu,
  abortUpload: bu,
  preview: xu,
  previewUnavailable: Cu,
  home: Su,
  showMoreFolder: Fu,
  moveTo: Nu,
  folderEmpty: ku,
  selectAll: Eu,
  view: Pu,
  grid: Tu,
  list: Lu,
  open: Au,
  nothingHereYet: Ou,
  name: Ru,
  modified: zu,
  size: Iu,
  deleteItemConfirm: Mu,
  deleteItemsConfirm: ju,
  percentDone: Uu,
  canceled: Du,
  invalidFileName: Vu,
  folderExists: Hu,
  collapseNavigationPane: Wu,
  expandNavigationPane: Bu
}, Ku = "תיקייה חדשה", Yu = "העלה", qu = "הדבק", Ju = "שנה תצוגה", Gu = "רענן", Xu = "גזור", Zu = "העתק", Qu = "שנה שם", ep = "הורד", tp = "פריט נבחר", np = "פריטים נבחרו", op = "בטל", ip = "נקה בחירה", sp = "הושלם", rp = "אם תשנה את סיומת הקובץ, הקובץ עלול להפוך לבלתי שמיש. האם אתה בטוח שברצונך לשנות זאת?", ap = "לא", lp = "כן", cp = "סגור", dp = "סוג הקובץ אינו מורשה.", up = "הקובץ כבר קיים.", pp = "גודל העלאה מקסימלי הוא", fp = "גרור קבצים להעלאה", hp = "בחר קובץ", mp = "ההעלאה נכשלה.", gp = "מעלה...", vp = "הועלה", $p = "הסר", yp = "בטל העלאה", wp = "תצוגה מקדימה", bp = "מצטערים! אין תצוגה מקדימה זמינה לקובץ זה.", xp = "דף הבית", Cp = "הצג תיקיות נוספות", Sp = "העבר ל", Fp = "התיקייה ריקה.", Np = "בחר הכל", kp = "תצוגה", Ep = "רשת", Pp = "רשימה", Tp = "פתח", Lp = "אין כאן כלום עדיין", Ap = "שם", Op = "שונה", Rp = "גודל", zp = 'האם אתה בטוח שברצונך למחוק את "{{fileName}}"?', Ip = "האם אתה בטוח שברצונך למחוק את {{count}} הפריטים האלו?", Mp = "{{percent}}% הושלמו", jp = "בוטל", Up = 'שם קובץ לא יכול להכיל את התווים הבאים: \\ / : * ? " < > |', Dp = 'כבר קיימת תיקייה בשם "{{renameFile}}" במיקום זה.', Vp = "כווץ את לוח הניווט", Hp = "הרחב את לוח הניווט", Wp = {
  newFolder: Ku,
  upload: Yu,
  paste: qu,
  changeView: Ju,
  refresh: Gu,
  cut: Xu,
  copy: Zu,
  rename: Qu,
  download: ep,
  delete: "מחק",
  itemSelected: tp,
  itemsSelected: np,
  cancel: op,
  clearSelection: ip,
  completed: sp,
  fileNameChangeWarning: rp,
  no: ap,
  yes: lp,
  close: cp,
  fileTypeNotAllowed: dp,
  fileAlreadyExist: up,
  maxUploadSize: pp,
  dragFileToUpload: fp,
  chooseFile: hp,
  uploadFail: mp,
  uploading: gp,
  uploaded: vp,
  remove: $p,
  abortUpload: yp,
  preview: wp,
  previewUnavailable: bp,
  home: xp,
  showMoreFolder: Cp,
  moveTo: Sp,
  folderEmpty: Fp,
  selectAll: Np,
  view: kp,
  grid: Ep,
  list: Pp,
  open: Tp,
  nothingHereYet: Lp,
  name: Ap,
  modified: Op,
  size: Rp,
  deleteItemConfirm: zp,
  deleteItemsConfirm: Ip,
  percentDone: Mp,
  canceled: jp,
  invalidFileName: Up,
  folderExists: Dp,
  collapseNavigationPane: Vp,
  expandNavigationPane: Hp
}, Bp = "नया फ़ोल्डर", _p = "अपलोड करें", Kp = "पेस्ट करें", Yp = "दृश्य बदलें", qp = "रिफ्रेश करें", Jp = "काटें", Gp = "कॉपी करें", Xp = "नाम बदलें", Zp = "डाउनलोड करें", Qp = "आइटम चुना गया", ef = "आइटम्स चुने गए", tf = "रद्द करें", nf = "चयन साफ़ करें", of = "पूर्ण हुआ", sf = "यदि आप फ़ाइल नाम एक्सटेंशन बदलते हैं, तो फ़ाइल अनुपयोगी हो सकती है। क्या आप वाकई इसे बदलना चाहते हैं?", rf = "नहीं", af = "हाँ", lf = "बंद करें", cf = "फ़ाइल प्रकार की अनुमति नहीं है।", df = "फ़ाइल पहले से मौजूद है।", uf = "अधिकतम अपलोड आकार है", pf = "अपलोड करने के लिए फ़ाइलें खींचें", ff = "फ़ाइल चुनें", hf = "अपलोड विफल रहा।", mf = "अपलोड हो रहा है", gf = "अपलोड हो गया", vf = "हटाएं", $f = "अपलोड रोकें", yf = "पूर्वावलोकन", wf = "माफ़ कीजिए! इस फ़ाइल के लिए पूर्वावलोकन उपलब्ध नहीं है।", bf = "होम", xf = "और फ़ोल्डर दिखाएँ", Cf = "इसमें ले जाएँ", Sf = "यह फ़ोल्डर खाली है।", Ff = "सभी का चयन करें", Nf = "दृश्य", kf = "ग्रिड", Ef = "सूची", Pf = "खोलें", Tf = "यहाँ अभी कुछ नहीं है", Lf = "नाम", Af = "परिवर्तित", Of = "आकार", Rf = 'क्या आप वाकई "{{fileName}}" को हटाना चाहते हैं?', zf = "क्या आप वाकई इन {{count}} आइटम्स को हटाना चाहते हैं?", If = "{{percent}}% पूर्ण", Mf = "रद्द किया गया", jf = 'फ़ाइल नाम में निम्नलिखित वर्ण नहीं हो सकते: \\ / : * ? " < > |', Uf = 'इस स्थान पर "{{renameFile}}" नाम का एक फ़ोल्डर पहले से मौजूद है।', Df = "नेविगेशन पैन को संकुचित करें", Vf = "नेविगेशन पैन को विस्तारित करें", Hf = {
  newFolder: Bp,
  upload: _p,
  paste: Kp,
  changeView: Yp,
  refresh: qp,
  cut: Jp,
  copy: Gp,
  rename: Xp,
  download: Zp,
  delete: "हटाएं",
  itemSelected: Qp,
  itemsSelected: ef,
  cancel: tf,
  clearSelection: nf,
  completed: of,
  fileNameChangeWarning: sf,
  no: rf,
  yes: af,
  close: lf,
  fileTypeNotAllowed: cf,
  fileAlreadyExist: df,
  maxUploadSize: uf,
  dragFileToUpload: pf,
  chooseFile: ff,
  uploadFail: hf,
  uploading: mf,
  uploaded: gf,
  remove: vf,
  abortUpload: $f,
  preview: yf,
  previewUnavailable: wf,
  home: bf,
  showMoreFolder: xf,
  moveTo: Cf,
  folderEmpty: Sf,
  selectAll: Ff,
  view: Nf,
  grid: kf,
  list: Ef,
  open: Pf,
  nothingHereYet: Tf,
  name: Lf,
  modified: Af,
  size: Of,
  deleteItemConfirm: Rf,
  deleteItemsConfirm: zf,
  percentDone: If,
  canceled: Mf,
  invalidFileName: jf,
  folderExists: Uf,
  collapseNavigationPane: Df,
  expandNavigationPane: Vf
}, Wf = "Nuova cartella", Bf = "Carica", _f = "Incolla", Kf = "Cambia vista", Yf = "Ricarica", qf = "Taglia", Jf = "Copia", Gf = "Rinomina", Xf = "Scarica", Zf = "elemento selezionato", Qf = "elementi selezionati", eh = "Annulla", th = "Pulisci selezione", nh = "Completato", oh = "Se cambi l'estensione del file, potrebbe diventare inutilizzabile. Sei sicuro di volerlo fare?", ih = "No", sh = "Sì", rh = "Chiudi", ah = "Tipo di file non consentito.", lh = "Il file esiste già.", ch = "La dimensione massima di caricamento è", dh = "Trascina i file per caricarli", uh = "Scegli file", ph = "Caricamento fallito.", fh = "Caricamento in corso", hh = "Caricato", mh = "Rimuovi", gh = "Annulla caricamento", vh = "Anteprima", $h = "Spiacenti! L'anteprima non è disponibile per questo file.", yh = "Home", wh = "Mostra altre cartelle", bh = "Sposta in", xh = "Questa cartella è vuota.", Ch = "Seleziona tutto", Sh = "Vista", Fh = "Griglia", Nh = "Lista", kh = "Apri", Eh = "Niente qui per ora", Ph = "Nome", Th = "Modificato", Lh = "Dimensione", Ah = 'Sei sicuro di voler eliminare "{{fileName}}"?', Oh = "Sei sicuro di voler eliminare questi {{count}} elementi?", Rh = "{{percent}}% completato", zh = "Annullato", Ih = 'Un nome di file non può contenere nessuno dei seguenti caratteri: \\ / : * ? " < > |', Mh = 'Questa destinazione contiene già una cartella chiamata "{{renameFile}}".', jh = "Comprimi pannello di navigazione", Uh = "Espandi pannello di navigazione", Dh = {
  newFolder: Wf,
  upload: Bf,
  paste: _f,
  changeView: Kf,
  refresh: Yf,
  cut: qf,
  copy: Jf,
  rename: Gf,
  download: Xf,
  delete: "Elimina",
  itemSelected: Zf,
  itemsSelected: Qf,
  cancel: eh,
  clearSelection: th,
  completed: nh,
  fileNameChangeWarning: oh,
  no: ih,
  yes: sh,
  close: rh,
  fileTypeNotAllowed: ah,
  fileAlreadyExist: lh,
  maxUploadSize: ch,
  dragFileToUpload: dh,
  chooseFile: uh,
  uploadFail: ph,
  uploading: fh,
  uploaded: hh,
  remove: mh,
  abortUpload: gh,
  preview: vh,
  previewUnavailable: $h,
  home: yh,
  showMoreFolder: wh,
  moveTo: bh,
  folderEmpty: xh,
  selectAll: Ch,
  view: Sh,
  grid: Fh,
  list: Nh,
  open: kh,
  nothingHereYet: Eh,
  name: Ph,
  modified: Th,
  size: Lh,
  deleteItemConfirm: Ah,
  deleteItemsConfirm: Oh,
  percentDone: Rh,
  canceled: zh,
  invalidFileName: Ih,
  folderExists: Mh,
  collapseNavigationPane: jh,
  expandNavigationPane: Uh
}, Vh = "新しいフォルダー", Hh = "アップロード", Wh = "貼り付け", Bh = "ビューを変更", _h = "更新", Kh = "切り取り", Yh = "コピー", qh = "名前変更", Jh = "ダウンロード", Gh = "アイテムが選択されました", Xh = "{{count}} アイテムが選択されました", Zh = "キャンセル", Qh = "選択をクリア", em = "完了", tm = "ファイル拡張子を変更すると、ファイルが使えなくなる場合があります。本当に変更しますか？", nm = "いいえ", om = "はい", im = "閉じる", sm = "ファイルタイプは許可されていません。", rm = "ファイルはすでに存在します。", am = "最大アップロードサイズは", lm = "ファイルをドラッグしてアップロード", cm = "ファイルを選択", dm = "アップロード失敗。", um = "アップロード中", pm = "アップロード済み", fm = "削除", hm = "アップロード中止", mm = "プレビュー", gm = "申し訳ありません！このファイルのプレビューは利用できません。", vm = "ホーム", $m = "さらにフォルダーを表示", ym = "移動先", wm = "このフォルダーは空です。", bm = "すべて選択", xm = "ビュー", Cm = "グリッド", Sm = "リスト", Fm = "開く", Nm = "まだ何もありません", km = "名前", Em = "修正日", Pm = "サイズ", Tm = '"{{fileName}}" を削除してもよろしいですか？', Lm = "{{count}} 件のアイテムを削除してもよろしいですか？", Am = "{{percent}}% 完了", Om = "キャンセルしました", Rm = 'ファイル名には以下の文字を含めることはできません：\\ / : * ? " < > |', zm = 'この宛先には "{{renameFile}}" という名前のフォルダーがすでに存在します。', Im = "ナビゲーションペインを折りたたむ", Mm = "ナビゲーションペインを展開", jm = {
  newFolder: Vh,
  upload: Hh,
  paste: Wh,
  changeView: Bh,
  refresh: _h,
  cut: Kh,
  copy: Yh,
  rename: qh,
  download: Jh,
  delete: "削除",
  itemSelected: Gh,
  itemsSelected: Xh,
  cancel: Zh,
  clearSelection: Qh,
  completed: em,
  fileNameChangeWarning: tm,
  no: nm,
  yes: om,
  close: im,
  fileTypeNotAllowed: sm,
  fileAlreadyExist: rm,
  maxUploadSize: am,
  dragFileToUpload: lm,
  chooseFile: cm,
  uploadFail: dm,
  uploading: um,
  uploaded: pm,
  remove: fm,
  abortUpload: hm,
  preview: mm,
  previewUnavailable: gm,
  home: vm,
  showMoreFolder: $m,
  moveTo: ym,
  folderEmpty: wm,
  selectAll: bm,
  view: xm,
  grid: Cm,
  list: Sm,
  open: Fm,
  nothingHereYet: Nm,
  name: km,
  modified: Em,
  size: Pm,
  deleteItemConfirm: Tm,
  deleteItemsConfirm: Lm,
  percentDone: Am,
  canceled: Om,
  invalidFileName: Rm,
  folderExists: zm,
  collapseNavigationPane: Im,
  expandNavigationPane: Mm
}, Um = "새 폴더", Dm = "업로드", Vm = "붙여넣기", Hm = "보기 변경", Wm = "새로 고침", Bm = "잘라내기", _m = "복사", Km = "이름 바꾸기", Ym = "다운로드", qm = "항목 선택됨", Jm = "개 항목 선택됨", Gm = "취소", Xm = "선택 지우기", Zm = "완료됨", Qm = "파일 확장자를 변경하면 사용할 수 없게 될 수 있습니다. 정말로 변경하시겠습니까?", eg = "아니오", tg = "예", ng = "닫기", og = "허용되지 않는 파일 형식입니다.", ig = "파일이 이미 존재합니다.", sg = "최대 업로드 크기", rg = "업로드하려면 파일을 끌어오세요", ag = "파일 선택", lg = "업로드 실패", cg = "업로드 중", dg = "업로드 완료", ug = "제거", pg = "업로드 중단", fg = "미리보기", hg = "죄송합니다! 이 파일은 미리보기를 제공하지 않습니다.", mg = "홈", gg = "더 많은 폴더 보기", vg = "이동", $g = "이 폴더는 비어 있습니다.", yg = "전체 선택", wg = "보기", bg = "그리드", xg = "목록", Cg = "열기", Sg = "아직 아무것도 없습니다", Fg = "이름", Ng = "수정됨", kg = "크기", Eg = '"{{fileName}}" 파일을 삭제하시겠습니까?', Pg = "{{count}}개의 항목을 삭제하시겠습니까?", Tg = "{{percent}}% 완료", Lg = "취소됨", Ag = '파일 이름에는 다음 문자를 사용할 수 없습니다: \\ / : * ? " < > |', Og = '해당 위치에 "{{renameFile}}" 폴더가 이미 있습니다.', Rg = "탐색 창 축소", zg = "탐색 창 확장", Ig = {
  newFolder: Um,
  upload: Dm,
  paste: Vm,
  changeView: Hm,
  refresh: Wm,
  cut: Bm,
  copy: _m,
  rename: Km,
  download: Ym,
  delete: "삭제",
  itemSelected: qm,
  itemsSelected: Jm,
  cancel: Gm,
  clearSelection: Xm,
  completed: Zm,
  fileNameChangeWarning: Qm,
  no: eg,
  yes: tg,
  close: ng,
  fileTypeNotAllowed: og,
  fileAlreadyExist: ig,
  maxUploadSize: sg,
  dragFileToUpload: rg,
  chooseFile: ag,
  uploadFail: lg,
  uploading: cg,
  uploaded: dg,
  remove: ug,
  abortUpload: pg,
  preview: fg,
  previewUnavailable: hg,
  home: mg,
  showMoreFolder: gg,
  moveTo: vg,
  folderEmpty: $g,
  selectAll: yg,
  view: wg,
  grid: bg,
  list: xg,
  open: Cg,
  nothingHereYet: Sg,
  name: Fg,
  modified: Ng,
  size: kg,
  deleteItemConfirm: Eg,
  deleteItemsConfirm: Pg,
  percentDone: Tg,
  canceled: Lg,
  invalidFileName: Ag,
  folderExists: Og,
  collapseNavigationPane: Rg,
  expandNavigationPane: zg
}, Mg = "Ny mappe", jg = "Last opp", Ug = "Lim inn", Dg = "Bytt visning", Vg = "Oppdater", Hg = "Klipp ut", Wg = "Kopier", Bg = "Gi nytt navn", _g = "Last ned", Kg = "element valgt", Yg = "elementer valgt", qg = "Avbryt", Jg = "Fjern utvalg", Gg = "Fullført", Xg = "Hvis du endrer en filendelse, kan filen bli ubrukelig. Er du sikker på at du vil endre den?", Zg = "Nei", Qg = "Ja", ev = "Lukk", tv = "Filtypen er ikke tillatt.", nv = "Filen finnes allerede.", ov = "Maksimal opplastingsstørrelse er", iv = "Dra filer for å laste opp", sv = "Velg fil", rv = "Opplasting mislyktes.", av = "Laster opp", lv = "Lastet opp", cv = "Fjern", dv = "Avbryt opplasting", uv = "Forhåndsvis", pv = "Beklager! Forhåndsvisning er ikke tilgjengelig for denne filen.", fv = "Hjem", hv = "Vis flere mapper", mv = "Flytt til", gv = "Denne mappen er tom.", vv = "Velg alle", $v = "Vis", yv = "Rutenett", wv = "Liste", bv = "Åpne", xv = "Ingenting her ennå", Cv = "Navn", Sv = "Endret", Fv = "Størrelse", Nv = "Er du sikker på at du vil slette «{{fileName}}»?", kv = "Er du sikker på at du vil slette disse {{count}} elementene?", Ev = "{{percent}}% ferdig", Pv = "Avbrutt", Tv = 'Et filnavn kan ikke inneholde noen av følgende tegn: \\ / : * ? " < > |', Lv = "Denne destinasjonen inneholder allerede en mappe med navnet «{{renameFile}}».", Av = "Skjul navigasjonsrute", Ov = "Utvid navigasjonsrute", Rv = {
  newFolder: Mg,
  upload: jg,
  paste: Ug,
  changeView: Dg,
  refresh: Vg,
  cut: Hg,
  copy: Wg,
  rename: Bg,
  download: _g,
  delete: "Slett",
  itemSelected: Kg,
  itemsSelected: Yg,
  cancel: qg,
  clearSelection: Jg,
  completed: Gg,
  fileNameChangeWarning: Xg,
  no: Zg,
  yes: Qg,
  close: ev,
  fileTypeNotAllowed: tv,
  fileAlreadyExist: nv,
  maxUploadSize: ov,
  dragFileToUpload: iv,
  chooseFile: sv,
  uploadFail: rv,
  uploading: av,
  uploaded: lv,
  remove: cv,
  abortUpload: dv,
  preview: uv,
  previewUnavailable: pv,
  home: fv,
  showMoreFolder: hv,
  moveTo: mv,
  folderEmpty: gv,
  selectAll: vv,
  view: $v,
  grid: yv,
  list: wv,
  open: bv,
  nothingHereYet: xv,
  name: Cv,
  modified: Sv,
  size: Fv,
  deleteItemConfirm: Nv,
  deleteItemsConfirm: kv,
  percentDone: Ev,
  canceled: Pv,
  invalidFileName: Tv,
  folderExists: Lv,
  collapseNavigationPane: Av,
  expandNavigationPane: Ov
}, zv = "Nova pasta", Iv = "Carregar", Mv = "Colar", jv = "Alterar visualização", Uv = "Atualizar", Dv = "Cortar", Vv = "Copiar", Hv = "Renomear", Wv = "Baixar", Bv = "item selecionado", _v = "itens selecionados", Kv = "Cancelar", Yv = "Limpar seleção", qv = "Concluído", Jv = "Se você alterar a extensão do arquivo, ele pode se tornar inutilizável. Tem certeza de que deseja fazer isso?", Gv = "Não", Xv = "Sim", Zv = "Fechar", Qv = "Tipo de arquivo não permitido.", e$ = "Arquivo já existe.", t$ = "Tamanho máximo de upload é", n$ = "Arraste os arquivos para carregar", o$ = "Escolher arquivo", i$ = "Falha no upload.", s$ = "Carregando", r$ = "Carregado", a$ = "Remover", l$ = "Abortar upload", c$ = "Visualizar", d$ = "Desculpe! Não há visualização disponível para este arquivo.", u$ = "Início", p$ = "Mostrar mais pastas", f$ = "Mover para", h$ = "Esta pasta está vazia.", m$ = "Selecionar tudo", g$ = "Visualização", v$ = "Grade", $$ = "Lista", y$ = "Abrir", w$ = "Nada aqui ainda", b$ = "Nome", x$ = "Modificado", C$ = "Tamanho", S$ = 'Tem certeza de que deseja excluir "{{fileName}}"?', F$ = "Tem certeza de que deseja excluir esses {{count}} itens?", N$ = "{{percent}}% concluído", k$ = "Cancelado", E$ = 'Um nome de arquivo não pode conter nenhum dos seguintes caracteres: \\ / : * ? " < > |', P$ = 'Já existe uma pasta com o nome "{{renameFile}}" neste local.', T$ = "Recolher painel de navegação", L$ = "Expandir painel de navegação", A$ = {
  newFolder: zv,
  upload: Iv,
  paste: Mv,
  changeView: jv,
  refresh: Uv,
  cut: Dv,
  copy: Vv,
  rename: Hv,
  download: Wv,
  delete: "Excluir",
  itemSelected: Bv,
  itemsSelected: _v,
  cancel: Kv,
  clearSelection: Yv,
  completed: qv,
  fileNameChangeWarning: Jv,
  no: Gv,
  yes: Xv,
  close: Zv,
  fileTypeNotAllowed: Qv,
  fileAlreadyExist: e$,
  maxUploadSize: t$,
  dragFileToUpload: n$,
  chooseFile: o$,
  uploadFail: i$,
  uploading: s$,
  uploaded: r$,
  remove: a$,
  abortUpload: l$,
  preview: c$,
  previewUnavailable: d$,
  home: u$,
  showMoreFolder: p$,
  moveTo: f$,
  folderEmpty: h$,
  selectAll: m$,
  view: g$,
  grid: v$,
  list: $$,
  open: y$,
  nothingHereYet: w$,
  name: b$,
  modified: x$,
  size: C$,
  deleteItemConfirm: S$,
  deleteItemsConfirm: F$,
  percentDone: N$,
  canceled: k$,
  invalidFileName: E$,
  folderExists: P$,
  collapseNavigationPane: T$,
  expandNavigationPane: L$
}, O$ = "Nova pasta", R$ = "Carregar", z$ = "Colar", I$ = "Mudar vista", M$ = "Atualizar", j$ = "Cortar", U$ = "Copiar", D$ = "Renomear", V$ = "Transferir", H$ = "item selecionado", W$ = "itens selecionados", B$ = "Cancelar", _$ = "Limpar seleção", K$ = "Concluído", Y$ = "Se alterar a extensão de um ficheiro, este pode deixar de funcionar corretamente. Tem a certeza de que deseja alterá-la?", q$ = "Não", J$ = "Sim", G$ = "Fechar", X$ = "Tipo de ficheiro não permitido.", Z$ = "O ficheiro já existe.", Q$ = "O tamanho máximo de carregamento é", ey = "Arraste os ficheiros para carregar", ty = "Escolher ficheiro", ny = "Falha no carregamento.", oy = "A carregar", iy = "Carregado", sy = "Remover", ry = "Cancelar carregamento", ay = "Pré-visualizar", ly = "Lamentamos! A pré-visualização não está disponível para este ficheiro.", cy = "Início", dy = "Mostrar mais pastas", uy = "Mover para", py = "Esta pasta está vazia.", fy = "Selecionar tudo", hy = "Vista", my = "Grelha", gy = "Lista", vy = "Abrir", $y = "Ainda não há nada aqui", yy = "Nome", wy = "Modificado", by = "Tamanho", xy = 'Tem a certeza de que deseja eliminar "{{fileName}}"?', Cy = "Tem a certeza de que deseja eliminar estes {{count}} itens?", Sy = "{{percent}}% concluído", Fy = "Cancelado", Ny = 'O nome do ficheiro não pode conter nenhum dos seguintes caracteres: \\ / : * ? " < > |', ky = 'O destino já contém uma pasta chamada "{{renameFile}}".', Ey = "Recolher painel de navegação", Py = "Expandir painel de navegação", Ty = {
  newFolder: O$,
  upload: R$,
  paste: z$,
  changeView: I$,
  refresh: M$,
  cut: j$,
  copy: U$,
  rename: D$,
  download: V$,
  delete: "Eliminar",
  itemSelected: H$,
  itemsSelected: W$,
  cancel: B$,
  clearSelection: _$,
  completed: K$,
  fileNameChangeWarning: Y$,
  no: q$,
  yes: J$,
  close: G$,
  fileTypeNotAllowed: X$,
  fileAlreadyExist: Z$,
  maxUploadSize: Q$,
  dragFileToUpload: ey,
  chooseFile: ty,
  uploadFail: ny,
  uploading: oy,
  uploaded: iy,
  remove: sy,
  abortUpload: ry,
  preview: ay,
  previewUnavailable: ly,
  home: cy,
  showMoreFolder: dy,
  moveTo: uy,
  folderEmpty: py,
  selectAll: fy,
  view: hy,
  grid: my,
  list: gy,
  open: vy,
  nothingHereYet: $y,
  name: yy,
  modified: wy,
  size: by,
  deleteItemConfirm: xy,
  deleteItemsConfirm: Cy,
  percentDone: Sy,
  canceled: Fy,
  invalidFileName: Ny,
  folderExists: ky,
  collapseNavigationPane: Ey,
  expandNavigationPane: Py
}, Ly = "Новая папка", Ay = "Загрузить", Oy = "Вставить", Ry = "Изменить вид", zy = "Обновить", Iy = "Вырезать", My = "Копировать", jy = "Переименовать", Uy = "Скачать", Dy = "выбран элемент", Vy = "выбрано {{count}} элементов", Hy = "Отменить", Wy = "Очистить выбор", By = "Завершено", _y = "Если вы измените расширение файла, файл может стать неисправным. Вы уверены, что хотите изменить его?", Ky = "Нет", Yy = "Да", qy = "Закрыть", Jy = "Тип файла не разрешен.", Gy = "Файл уже существует.", Xy = "Максимальный размер загрузки:", Zy = "Перетащите файлы для загрузки", Qy = "Выбрать файл", ew = "Загрузка не удалась.", tw = "Загрузка", nw = "Загружено", ow = "Удалить", iw = "Прервать загрузку", sw = "Предпросмотр", rw = "Извините! Предпросмотр для этого файла недоступен.", aw = "Главная", lw = "Показать больше папок", cw = "Переместить в", dw = "Эта папка пуста.", uw = "Выбрать все", pw = "Вид", fw = "Сетка", hw = "Список", mw = "Открыть", gw = "Здесь еще ничего нет", vw = "Имя", $w = "Изменено", yw = "Размер", ww = 'Вы уверены, что хотите удалить "{{fileName}}"?', bw = "Вы уверены, что хотите удалить эти {{count}} элементы?", xw = "{{percent}}% завершено", Cw = "Отменено", Sw = 'Имя файла не может содержать следующие символы: \\ / : * ? " < > |', Fw = 'В этом местоположении уже существует папка с именем "{{renameFile}}".', Nw = "Свернуть панель навигации", kw = "Развернуть панель навигации", Ew = {
  newFolder: Ly,
  upload: Ay,
  paste: Oy,
  changeView: Ry,
  refresh: zy,
  cut: Iy,
  copy: My,
  rename: jy,
  download: Uy,
  delete: "Удалить",
  itemSelected: Dy,
  itemsSelected: Vy,
  cancel: Hy,
  clearSelection: Wy,
  completed: By,
  fileNameChangeWarning: _y,
  no: Ky,
  yes: Yy,
  close: qy,
  fileTypeNotAllowed: Jy,
  fileAlreadyExist: Gy,
  maxUploadSize: Xy,
  dragFileToUpload: Zy,
  chooseFile: Qy,
  uploadFail: ew,
  uploading: tw,
  uploaded: nw,
  remove: ow,
  abortUpload: iw,
  preview: sw,
  previewUnavailable: rw,
  home: aw,
  showMoreFolder: lw,
  moveTo: cw,
  folderEmpty: dw,
  selectAll: uw,
  view: pw,
  grid: fw,
  list: hw,
  open: mw,
  nothingHereYet: gw,
  name: vw,
  modified: $w,
  size: yw,
  deleteItemConfirm: ww,
  deleteItemsConfirm: bw,
  percentDone: xw,
  canceled: Cw,
  invalidFileName: Sw,
  folderExists: Fw,
  collapseNavigationPane: Nw,
  expandNavigationPane: kw
}, Pw = "Ny mapp", Tw = "Ladda upp", Lw = "Klistra in", Aw = "Byt vy", Ow = "Uppdatera", Rw = "Klipp ut", zw = "Kopiera", Iw = "Byt namn", Mw = "Ladda ner", jw = "post vald", Uw = "poster valda", Dw = "Avbryt", Vw = "Rensa markering", Hw = "Färdig", Ww = "Om du ändrar filändelsen kan filen bli oanvändbar. Är du säker på att du vill ändra den?", Bw = "Nej", _w = "Ja", Kw = "Stäng", Yw = "Filtypen är inte tillåten.", qw = "Filen finns redan.", Jw = "Maximal uppladdningsstorlek är", Gw = "Dra filer hit för uppladdning", Xw = "Välj fil", Zw = "Uppladdning misslyckades.", Qw = "Laddar upp", e1 = "Uppladdad", t1 = "Ta bort", n1 = "Avbryt uppladdning", o1 = "Förhandsgranska", i1 = "Förhandsgranskning är inte tillgänglig för denna fil.", s1 = "Hem", r1 = "Visa fler mappar", a1 = "Flytta till", l1 = "Den här mappen är tom.", c1 = "Markera allt", d1 = "Visa", u1 = "Rutnät", p1 = "Lista", f1 = "Öppna", h1 = "Inget här än", m1 = "Namn", g1 = "Ändrad", v1 = "Storlek", $1 = 'Vill du verkligen radera "{{fileName}}"?', y1 = "Vill du verkligen radera dessa {{count}} poster?", w1 = "{{percent}}% klar", b1 = "Avbruten", x1 = 'Ett filnamn får inte innehålla något av följande tecken: \\ / : * ? " < > |', C1 = 'Den här platsen innehåller redan en mapp med namnet "{{renameFile}}".', S1 = "Dölj navigationsfönster", F1 = "Visa navigationsfönster", N1 = {
  newFolder: Pw,
  upload: Tw,
  paste: Lw,
  changeView: Aw,
  refresh: Ow,
  cut: Rw,
  copy: zw,
  rename: Iw,
  download: Mw,
  delete: "Radera",
  itemSelected: jw,
  itemsSelected: Uw,
  cancel: Dw,
  clearSelection: Vw,
  completed: Hw,
  fileNameChangeWarning: Ww,
  no: Bw,
  yes: _w,
  close: Kw,
  fileTypeNotAllowed: Yw,
  fileAlreadyExist: qw,
  maxUploadSize: Jw,
  dragFileToUpload: Gw,
  chooseFile: Xw,
  uploadFail: Zw,
  uploading: Qw,
  uploaded: e1,
  remove: t1,
  abortUpload: n1,
  preview: o1,
  previewUnavailable: i1,
  home: s1,
  showMoreFolder: r1,
  moveTo: a1,
  folderEmpty: l1,
  selectAll: c1,
  view: d1,
  grid: u1,
  list: p1,
  open: f1,
  nothingHereYet: h1,
  name: m1,
  modified: g1,
  size: v1,
  deleteItemConfirm: $1,
  deleteItemsConfirm: y1,
  percentDone: w1,
  canceled: b1,
  invalidFileName: x1,
  folderExists: C1,
  collapseNavigationPane: S1,
  expandNavigationPane: F1
}, k1 = "Yeni Klasör", E1 = "Dosya Yükle", P1 = "Yapıştır", T1 = "Görünümü Değiştir", L1 = "Yenile", A1 = "Kes", O1 = "Kopyala", R1 = "Yeniden İsimlendir", z1 = "İndir", I1 = "öğe seçildi", M1 = "seçilen öğeler", j1 = "İptal", U1 = "Seçimi Temizle", D1 = "Tamamlandı", V1 = "Dosya adı aşağıdaki karakterlerden hiçbirini içeremez:", H1 = "Bir dosya adı uzantısını değiştirirseniz, dosya kullanılamaz hale gelebilir. Bunu değiştirmek istediğinizden emin misiniz?", W1 = "Hayır", B1 = "Evet", _1 = "Kapalı", K1 = "Dosya türüne izin verilmiyor.", Y1 = "Dosya zaten mevcut.", q1 = "Maksimum yükleme boyutu", J1 = "Yüklemek için dosyaları sürükleyin", G1 = "Dosya Seç", X1 = "Yükleme hatası.", Z1 = "Yükleniyor", Q1 = "Yüklendi", eb = "Kaldır", tb = "Yüklemeyi İptal Et", nb = "Görünüm", ob = "Üzgünüz! Bu dosya için önizleme mevcut değil.", ib = "Ana Sayfa", sb = "Daha fazla klasör göster", rb = "Burya Taşı", ab = "Bu klasör boş.", lb = "Hepsini Seç", cb = "Görünüm", db = "Izgara", ub = "Liste", pb = "Aç", fb = "Henüz hiçbir şey yok", hb = "Ad", mb = "Değiştirilme Tarihi", gb = "Boyut", vb = '"{{fileName}}" dosyasını silmek istediğinizden emin misiniz?', $b = "{{count}} öğeyi silmek istediğinizden emin misiniz?", yb = "%{{percent}} tamamlandı", wb = "İptal edildi", bb = 'Bir dosya adı aşağıdaki karakterlerden hiçbirini içeremez: \\ / : * ? " < > |', xb = 'Bu konumda "{{renameFile}}" adında bir klasör zaten var.', Cb = "Gezinti Panelini Daralt", Sb = "Gezinti Panelini Genişlet", Fb = {
  newFolder: k1,
  upload: E1,
  paste: P1,
  changeView: T1,
  refresh: L1,
  cut: A1,
  copy: O1,
  rename: R1,
  download: z1,
  delete: "Sil",
  itemSelected: I1,
  itemsSelected: M1,
  cancel: j1,
  clearSelection: U1,
  completed: D1,
  folderErrorMessage: V1,
  fileNameChangeWarning: H1,
  no: W1,
  yes: B1,
  close: _1,
  fileTypeNotAllowed: K1,
  fileAlreadyExist: Y1,
  maxUploadSize: q1,
  dragFileToUpload: J1,
  chooseFile: G1,
  uploadFail: X1,
  uploading: Z1,
  uploaded: Q1,
  remove: eb,
  abortUpload: tb,
  preview: nb,
  previewUnavailable: ob,
  home: ib,
  showMoreFolder: sb,
  moveTo: rb,
  folderEmpty: ab,
  selectAll: lb,
  view: cb,
  grid: db,
  list: ub,
  open: pb,
  nothingHereYet: fb,
  name: hb,
  modified: mb,
  size: gb,
  deleteItemConfirm: vb,
  deleteItemsConfirm: $b,
  percentDone: yb,
  canceled: wb,
  invalidFileName: bb,
  folderExists: xb,
  collapseNavigationPane: Cb,
  expandNavigationPane: Sb
}, Nb = "Нова папка", kb = "Завантажити", Eb = "Вставити", Pb = "Змінити вигляд", Tb = "Оновити", Lb = "Вирізати", Ab = "Копіювати", Ob = "Перейменувати", Rb = "Завантажити", zb = "вибраний елемент", Ib = "вибрані елементи", Mb = "Скасувати", jb = "Очистити вибір", Ub = "Завершено", Db = "Якщо ви зміните розширення файлу, він може стати непридатним для використання. Ви впевнені, що хочете змінити його?", Vb = "Ні", Hb = "Так", Wb = "Закрити", Bb = "Тип файлу не дозволено.", _b = "Файл уже існує.", Kb = "Максимальний розмір завантаження —", Yb = "Перетягніть файли для завантаження", qb = "Вибрати файл", Jb = "Помилка завантаження.", Gb = "Завантаження", Xb = "Завантажено", Zb = "Видалити", Qb = "Скасувати завантаження", e0 = "Попередній перегляд", t0 = "На жаль! Попередній перегляд для цього файлу недоступний.", n0 = "Головна", o0 = "Показати більше папок", i0 = "Перемістити до", s0 = "Ця папка порожня.", r0 = "Вибрати все", a0 = "Вигляд", l0 = "Сітка", c0 = "Список", d0 = "Відкрити", u0 = "Тут ще нічого немає", p0 = "Назва", f0 = "Змінено", h0 = "Розмір", m0 = 'Ви впевнені, що хочете видалити "{{fileName}}"?', g0 = "Ви впевнені, що хочете видалити ці {{count}} елементи?", v0 = "{{percent}}% завершено", $0 = "Скасовано", y0 = `Ім'я файлу не може містити такі символи: \\ / : * ? " < > |`, w0 = 'У цьому місці вже існує папка з назвою "{{renameFile}}".', b0 = "Згорнути панель навігації", x0 = "Розгорнути панель навігації", C0 = {
  newFolder: Nb,
  upload: kb,
  paste: Eb,
  changeView: Pb,
  refresh: Tb,
  cut: Lb,
  copy: Ab,
  rename: Ob,
  download: Rb,
  delete: "Видалити",
  itemSelected: zb,
  itemsSelected: Ib,
  cancel: Mb,
  clearSelection: jb,
  completed: Ub,
  fileNameChangeWarning: Db,
  no: Vb,
  yes: Hb,
  close: Wb,
  fileTypeNotAllowed: Bb,
  fileAlreadyExist: _b,
  maxUploadSize: Kb,
  dragFileToUpload: Yb,
  chooseFile: qb,
  uploadFail: Jb,
  uploading: Gb,
  uploaded: Xb,
  remove: Zb,
  abortUpload: Qb,
  preview: e0,
  previewUnavailable: t0,
  home: n0,
  showMoreFolder: o0,
  moveTo: i0,
  folderEmpty: s0,
  selectAll: r0,
  view: a0,
  grid: l0,
  list: c0,
  open: d0,
  nothingHereYet: u0,
  name: p0,
  modified: f0,
  size: h0,
  deleteItemConfirm: m0,
  deleteItemsConfirm: g0,
  percentDone: v0,
  canceled: $0,
  invalidFileName: y0,
  folderExists: w0,
  collapseNavigationPane: b0,
  expandNavigationPane: x0
}, S0 = "نیا فولڈر", F0 = "اپ لوڈ کریں", N0 = "چسپاں کریں", k0 = "دیکھنے کا طریقہ تبدیل کریں", E0 = "تازہ کریں", P0 = "کٹ کریں", T0 = "کاپی کریں", L0 = "نام تبدیل کریں", A0 = "ڈاؤن لوڈ کریں", O0 = "آئٹم منتخب کیا گیا", R0 = "{{count}} آئٹمز منتخب کی گئیں", z0 = "منسوخ کریں", I0 = "انتخاب صاف کریں", M0 = "مکمل ہوا", j0 = "اگر آپ فائل کا ایکسٹینشن تبدیل کرتے ہیں، تو فائل ناقابل استعمال ہو سکتی ہے۔ کیا آپ واقعی اسے تبدیل کرنا چاہتے ہیں؟", U0 = "نہیں", D0 = "ہاں", V0 = "بند کریں", H0 = "فائل کی قسم کی اجازت نہیں ہے۔", W0 = "فائل پہلے سے موجود ہے۔", B0 = "زیادہ سے زیادہ اپ لوڈ سائز ہے", _0 = "اپ لوڈ کرنے کے لیے فائلز گھسیٹیں", K0 = "فائل منتخب کریں", Y0 = "اپ لوڈ میں ناکامی۔", q0 = "اپ لوڈ ہو رہا ہے", J0 = "اپ لوڈ ہو گیا", G0 = "ہٹائیں", X0 = "اپ لوڈ منسوخ کریں", Z0 = "پریویو", Q0 = "معذرت! اس فائل کا پریویو دستیاب نہیں ہے۔", ex = "ہوم", tx = "مزید فولڈرز دکھائیں", nx = "منتقل کریں", ox = "یہ فولڈر خالی ہے۔", ix = "سبھی منتخب کریں", sx = "دیکھیں", rx = "گِریڈ", ax = "فہرست", lx = "کھولیں", cx = "ابھی کچھ بھی نہیں ہے", dx = "نام", ux = "ترمیم شدہ", px = "سائز", fx = 'کیا آپ واقعی "{{fileName}}" کو حذف کرنا چاہتے ہیں؟', hx = "کیا آپ واقعی ان {{count}} آئٹمز کو حذف کرنا چاہتے ہیں؟", mx = "{{percent}}% مکمل ہوا", gx = "منسوخ کیا گیا", vx = 'فائل کا نام درج ذیل میں سے کوئی بھی حرف نہیں رکھ سکتا: \\ / : * ? " < > |', $x = 'اس منزل پر پہلے ہی "{{renameFile}}" کے نام کا فولڈر موجود ہے۔', yx = "نیویگیشن پین کو بند کریں", wx = "نیویگیشن پین کو کھولیں", bx = {
  newFolder: S0,
  upload: F0,
  paste: N0,
  changeView: k0,
  refresh: E0,
  cut: P0,
  copy: T0,
  rename: L0,
  download: A0,
  delete: "حذف کریں",
  itemSelected: O0,
  itemsSelected: R0,
  cancel: z0,
  clearSelection: I0,
  completed: M0,
  fileNameChangeWarning: j0,
  no: U0,
  yes: D0,
  close: V0,
  fileTypeNotAllowed: H0,
  fileAlreadyExist: W0,
  maxUploadSize: B0,
  dragFileToUpload: _0,
  chooseFile: K0,
  uploadFail: Y0,
  uploading: q0,
  uploaded: J0,
  remove: G0,
  abortUpload: X0,
  preview: Z0,
  previewUnavailable: Q0,
  home: ex,
  showMoreFolder: tx,
  moveTo: nx,
  folderEmpty: ox,
  selectAll: ix,
  view: sx,
  grid: rx,
  list: ax,
  open: lx,
  nothingHereYet: cx,
  name: dx,
  modified: ux,
  size: px,
  deleteItemConfirm: fx,
  deleteItemsConfirm: hx,
  percentDone: mx,
  canceled: gx,
  invalidFileName: vx,
  folderExists: $x,
  collapseNavigationPane: yx,
  expandNavigationPane: wx
}, xx = "Thư mục mới", Cx = "Tải lên", Sx = "Dán", Fx = "Thay đổi chế độ xem", Nx = "Làm mới", kx = "Cắt", Ex = "Sao chép", Px = "Đổi tên", Tx = "Tải xuống", Lx = "mục đã chọn", Ax = "mục được chọn", Ox = "Hủy", Rx = "Xóa lựa chọn", zx = "Hoàn thành", Ix = "Nếu bạn thay đổi phần mở rộng tên tệp, tệp có thể không sử dụng được. Bạn có chắc chắn muốn thay đổi không?", Mx = "Không", jx = "Có", Ux = "Đóng", Dx = "Loại tệp không được phép.", Vx = "Tệp đã tồn tại.", Hx = "Kích thước tải lên tối đa là", Wx = "Kéo tệp vào để tải lên", Bx = "Chọn tệp", _x = "Tải lên thất bại.", Kx = "Đang tải lên", Yx = "Đã tải lên", qx = "Gỡ bỏ", Jx = "Hủy tải lên", Gx = "Xem trước", Xx = "Rất tiếc! Không thể xem trước tệp này.", Zx = "Trang chủ", Qx = "Hiển thị thêm thư mục", e2 = "Chuyển đến", t2 = "Thư mục này trống.", n2 = "Chọn tất cả", o2 = "Chế độ xem", i2 = "Lưới", s2 = "Danh sách", r2 = "Mở", a2 = "Chưa có gì ở đây", l2 = "Tên", c2 = "Đã chỉnh sửa", d2 = "Kích thước", u2 = 'Bạn có chắc muốn xóa "{{fileName}}"?', p2 = "Bạn có chắc muốn xóa {{count}} mục này không?", f2 = "Hoàn thành {{percent}}%", h2 = "Đã hủy", m2 = 'Tên tệp không được chứa các ký tự sau: \\ / : * ? " < > |', g2 = 'Đã có thư mục tên "{{renameFile}}" tại vị trí này.', v2 = "Thu gọn ngăn điều hướng", $2 = "Mở rộng ngăn điều hướng", y2 = {
  newFolder: xx,
  upload: Cx,
  paste: Sx,
  changeView: Fx,
  refresh: Nx,
  cut: kx,
  copy: Ex,
  rename: Px,
  download: Tx,
  delete: "Xóa",
  itemSelected: Lx,
  itemsSelected: Ax,
  cancel: Ox,
  clearSelection: Rx,
  completed: zx,
  fileNameChangeWarning: Ix,
  no: Mx,
  yes: jx,
  close: Ux,
  fileTypeNotAllowed: Dx,
  fileAlreadyExist: Vx,
  maxUploadSize: Hx,
  dragFileToUpload: Wx,
  chooseFile: Bx,
  uploadFail: _x,
  uploading: Kx,
  uploaded: Yx,
  remove: qx,
  abortUpload: Jx,
  preview: Gx,
  previewUnavailable: Xx,
  home: Zx,
  showMoreFolder: Qx,
  moveTo: e2,
  folderEmpty: t2,
  selectAll: n2,
  view: o2,
  grid: i2,
  list: s2,
  open: r2,
  nothingHereYet: a2,
  name: l2,
  modified: c2,
  size: d2,
  deleteItemConfirm: u2,
  deleteItemsConfirm: p2,
  percentDone: f2,
  canceled: h2,
  invalidFileName: m2,
  folderExists: g2,
  collapseNavigationPane: v2,
  expandNavigationPane: $2
}, w2 = "新建文件夹", b2 = "上传", x2 = "粘贴", C2 = "更改视图", S2 = "刷新", F2 = "剪切", N2 = "复制", k2 = "重命名", E2 = "下载", P2 = "已选择项", T2 = "已选择{{count}}项", L2 = "取消", A2 = "清除选择", O2 = "完成", R2 = "如果更改文件扩展名，文件可能会变得无法使用。您确定要更改吗？", z2 = "否", I2 = "是", M2 = "关闭", j2 = "不允许的文件类型。", U2 = "文件已存在。", D2 = "最大上传大小为", V2 = "拖动文件上传", H2 = "选择文件", W2 = "上传失败。", B2 = "上传中", _2 = "已上传", K2 = "移除", Y2 = "取消上传", q2 = "预览", J2 = "抱歉！该文件无法预览。", G2 = "首页", X2 = "显示更多文件夹", Z2 = "移动到", Q2 = "该文件夹为空。", eC = "全选", tC = "视图", nC = "网格", oC = "列表", iC = "打开", sC = "这里暂时没有内容", rC = "名称", aC = "修改时间", lC = "大小", cC = '您确定要删除 "{{fileName}}" 吗？', dC = "您确定要删除这些 {{count}} 项吗？", uC = "{{percent}}% 完成", pC = "已取消", fC = '文件名不能包含以下字符：\\ / : * ? " < > |', hC = '目标文件夹中已存在名为 "{{renameFile}}" 的文件夹。', mC = "折叠导航窗格", gC = "展开导航窗格", vC = {
  newFolder: w2,
  upload: b2,
  paste: x2,
  changeView: C2,
  refresh: S2,
  cut: F2,
  copy: N2,
  rename: k2,
  download: E2,
  delete: "删除",
  itemSelected: P2,
  itemsSelected: T2,
  cancel: L2,
  clearSelection: A2,
  completed: O2,
  fileNameChangeWarning: R2,
  no: z2,
  yes: I2,
  close: M2,
  fileTypeNotAllowed: j2,
  fileAlreadyExist: U2,
  maxUploadSize: D2,
  dragFileToUpload: V2,
  chooseFile: H2,
  uploadFail: W2,
  uploading: B2,
  uploaded: _2,
  remove: K2,
  abortUpload: Y2,
  preview: q2,
  previewUnavailable: J2,
  home: G2,
  showMoreFolder: X2,
  moveTo: Z2,
  folderEmpty: Q2,
  selectAll: eC,
  view: tC,
  grid: nC,
  list: oC,
  open: iC,
  nothingHereYet: sC,
  name: rC,
  modified: aC,
  size: lC,
  deleteItemConfirm: cC,
  deleteItemsConfirm: dC,
  percentDone: uC,
  canceled: pC,
  invalidFileName: fC,
  folderExists: hC,
  collapseNavigationPane: mC,
  expandNavigationPane: gC
}, $C = "Nowy folder", yC = "Prześlij", wC = "Wklej", bC = "Zmień widok", xC = "Odśwież", CC = "Wytnij", SC = "Kopiuj", FC = "Zmień nazwę", NC = "Pobierz", kC = "element zaznaczony", EC = "elementy zaznaczone", PC = "Anuluj", TC = "Wyczyść zaznaczenie", LC = "Zakończono", AC = "Jeśli zmienisz rozszerzenie pliku, może on stać się nieużyteczny. Czy na pewno chcesz to zrobić?", OC = "Nie", RC = "Tak", zC = "Zamknij", IC = "Typ pliku nie jest dozwolony.", MC = "Plik już istnieje.", jC = "Maksymalny rozmiar przesyłanego pliku to", UC = "Przeciągnij pliki, aby je przesłać", DC = "Wybierz plik", VC = "Przesyłanie nie powiodło się.", HC = "Przesyłanie", WC = "Przesłano", BC = "Usuń", _C = "Przerwij przesyłanie", KC = "Podgląd", YC = "Przepraszamy! Podgląd tego pliku nie jest dostępny.", qC = "Strona główna", JC = "Pokaż więcej folderów", GC = "Przenieś do", XC = "Ten folder jest pusty.", ZC = "Zaznacz wszystko", QC = "Widok", eS = "Siatka", tS = "Lista", nS = "Otwórz", oS = "Nic tu jeszcze nie ma", iS = "Nazwa", sS = "Zmodyfikowano", rS = "Rozmiar", aS = 'Czy na pewno chcesz usunąć "{{fileName}}"?', lS = "Czy na pewno chcesz usunąć te {{count}} elementy?", cS = "{{percent}}% ukończono", dS = "Anulowano", uS = 'Nazwa pliku nie może zawierać żadnego z następujących znaków: \\ / : * ? " < > |', pS = 'To miejsce docelowe zawiera już folder o nazwie "{{renameFile}}".', fS = "Zwiń panel nawigacyjny", hS = "Rozwiń panel nawigacyjny", mS = {
  newFolder: $C,
  upload: yC,
  paste: wC,
  changeView: bC,
  refresh: xC,
  cut: CC,
  copy: SC,
  rename: FC,
  download: NC,
  delete: "Usuń",
  itemSelected: kC,
  itemsSelected: EC,
  cancel: PC,
  clearSelection: TC,
  completed: LC,
  fileNameChangeWarning: AC,
  no: OC,
  yes: RC,
  close: zC,
  fileTypeNotAllowed: IC,
  fileAlreadyExist: MC,
  maxUploadSize: jC,
  dragFileToUpload: UC,
  chooseFile: DC,
  uploadFail: VC,
  uploading: HC,
  uploaded: WC,
  remove: BC,
  abortUpload: _C,
  preview: KC,
  previewUnavailable: YC,
  home: qC,
  showMoreFolder: JC,
  moveTo: GC,
  folderEmpty: XC,
  selectAll: ZC,
  view: QC,
  grid: eS,
  list: tS,
  open: nS,
  nothingHereYet: oS,
  name: iS,
  modified: sS,
  size: rS,
  deleteItemConfirm: aS,
  deleteItemsConfirm: lS,
  percentDone: cS,
  canceled: dS,
  invalidFileName: uS,
  folderExists: pS,
  collapseNavigationPane: fS,
  expandNavigationPane: hS
}, gS = {
  "ar-SA": { translation: Ji },
  "da-DK": { translation: Ys },
  "de-DE": { translation: _r },
  "en-US": { translation: Qa },
  "es-ES": { translation: Xl },
  "fa-IR": { translation: Jc },
  "fi-FI": { translation: Yd },
  "fr-FR": { translation: _u },
  "he-IL": { translation: Wp },
  "hi-IN": { translation: Hf },
  "it-IT": { translation: Dh },
  "ja-JP": { translation: jm },
  "ko-KR": { translation: Ig },
  "nb-NO": { translation: Rv },
  "pt-BR": { translation: A$ },
  "pt-PT": { translation: Ty },
  "ru-RU": { translation: Ew },
  "sv-SE": { translation: N1 },
  "tr-TR": { translation: Fb },
  "uk-UA": { translation: C0 },
  "ur-UR": { translation: bx },
  "vi-VN": { translation: y2 },
  "zh-CN": { translation: vC },
  "pl-PL": { translation: mS }
}, vS = (t = "en-US") => {
  le.isInitialized ? le.changeLanguage(t) : le.init({
    resources: gS,
    lng: t,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: !1
    }
  });
}, Mn = Ie(() => (t) => t), $S = ({ children: t, language: e }) => {
  const [n, o] = A(() => le.t.bind(le));
  return Q(() => {
    vS(e), o(() => le.t.bind(le));
  }, [e]), /* @__PURE__ */ c(Mn.Provider, { value: n, children: t });
}, pe = () => Me(Mn);
function yS(t) {
  if (!t) return "";
  const e = t.service?.name?.trim?.() ?? "", n = t.name?.trim?.() ?? "";
  return e && n ? `${e} - ${n}` : n || e || t.id || "";
}
const jn = ({
  onRefresh: t,
  triggerAction: e,
  permissions: n,
  searchTerm: o = "",
  setSearchTerm: i,
  searchInputVisible: s = !1,
  setSearchInputVisible: r,
  projectServices: a,
  selectedServiceId: l = "all",
  setSelectedServiceId: d,
  toolbarFilterContent: u,
  renderSearchInput: p,
  hideSupersededFiles: m = !1,
  setHideSupersededFiles: g,
  showArchivedFiles: f = !1,
  setShowArchivedFiles: b
}) => {
  const { currentFolder: T } = ye(), { selectedFiles: C, setSelectedFiles: R, handleDownload: N } = xe(), { clipBoard: k, setClipBoard: $, handleCutCopy: E, handlePasting: x } = at(), h = pe(), [v, y] = A(!1), O = Ke(() => y(!1)), I = [
    {
      icon: /* @__PURE__ */ c(kt, { size: 14 }),
      text: h("paste"),
      permission: !!k,
      onClick: W
    }
  ], H = [
    {
      icon: /* @__PURE__ */ c(Nn, { size: 14 }),
      text: h("newFolder"),
      title: h("newFolder"),
      permission: n.create,
      onClick: () => e.show("createFolder")
    },
    {
      icon: /* @__PURE__ */ c(Pn, { size: 14 }),
      text: h("upload"),
      title: h("upload"),
      permission: n.upload,
      onClick: () => e.show("uploadFile")
    }
  ].filter(
    (M) => M.permission === void 0 || M.permission
  );
  function W() {
    x(T);
  }
  const Z = () => {
    N(), R([]);
  };
  return C.length > 0 ? /* @__PURE__ */ c("div", { className: "toolbar file-selected", children: /* @__PURE__ */ F("div", { className: "file-action-container", children: [
    /* @__PURE__ */ F("div", { children: [
      n.move && /* @__PURE__ */ F("button", { className: "item-action file-action", onClick: () => E(!0), children: [
        /* @__PURE__ */ c(En, { size: 14 }),
        /* @__PURE__ */ c("span", { children: h("cut") })
      ] }),
      n.copy && /* @__PURE__ */ F("button", { className: "item-action file-action", onClick: () => E(!1), children: [
        /* @__PURE__ */ c(Sn, { size: 14 }),
        /* @__PURE__ */ c("span", { children: h("copy") })
      ] }),
      k?.files?.length > 0 && /* @__PURE__ */ F(
        "button",
        {
          className: "item-action file-action",
          onClick: W,
          children: [
            /* @__PURE__ */ c(kt, { size: 14 }),
            /* @__PURE__ */ c("span", { children: h("paste") })
          ]
        }
      ),
      C.length === 1 && n.rename && /* @__PURE__ */ F(
        "button",
        {
          className: "item-action file-action",
          onClick: () => e.show("rename"),
          children: [
            /* @__PURE__ */ c(kn, { size: 14 }),
            /* @__PURE__ */ c("span", { children: h("rename") })
          ]
        }
      ),
      n.download && /* @__PURE__ */ F("button", { className: "item-action file-action", onClick: Z, children: [
        /* @__PURE__ */ c(Lt, { size: 14 }),
        /* @__PURE__ */ c("span", { children: h("download") })
      ] }),
      n.delete && /* @__PURE__ */ F(
        "button",
        {
          className: "item-action file-action",
          onClick: () => e.show("delete"),
          children: [
            /* @__PURE__ */ c(Nt, { size: 14 }),
            /* @__PURE__ */ c("span", { children: h("delete") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ F(
      "button",
      {
        className: "item-action file-action",
        title: h("clearSelection"),
        onClick: () => R([]),
        children: [
          /* @__PURE__ */ F("span", { children: [
            C.length,
            " ",
            h(C.length > 1 ? "itemsSelected" : "itemSelected")
          ] }),
          /* @__PURE__ */ c(Qe, { size: 14 })
        ]
      }
    )
  ] }) }) : /* @__PURE__ */ c("div", { className: "toolbar", children: /* @__PURE__ */ F("div", { className: "fm-toolbar", children: [
    /* @__PURE__ */ F("div", { className: "fm-toolbar-left", children: [
      u ?? (Array.isArray(a) && a.length > 0 && d ? /* @__PURE__ */ F("div", { className: "fm-toolbar-filter-wrap", children: [
        /* @__PURE__ */ c("label", { htmlFor: "fm-filter-by-service", className: "fm-toolbar-filter-label", children: h("filterByService") || "Filter by service" }),
        /* @__PURE__ */ F(
          "select",
          {
            id: "fm-filter-by-service",
            className: "fm-toolbar-filter-select",
            value: l,
            onChange: (M) => d(M.target.value),
            "aria-label": h("filterByService") || "Filter by service",
            children: [
              /* @__PURE__ */ c("option", { value: "all", children: h("all") || "All" }),
              a.map((M) => /* @__PURE__ */ c("option", { value: M.id, children: yS(M) }, M.id))
            ]
          }
        )
      ] }) : null),
      I.filter((M) => M.permission).map((M, oe) => /* @__PURE__ */ F("button", { className: "item-action", onClick: M.onClick, children: [
        M.icon,
        /* @__PURE__ */ c("span", { children: M.text })
      ] }, oe))
    ] }),
    /* @__PURE__ */ F("div", { children: [
      H.map((M, oe) => /* @__PURE__ */ c("div", { className: "toolbar-left-items", children: /* @__PURE__ */ F(
        "button",
        {
          className: `item-action ${M.text ? "" : "icon-only"}`,
          title: M.title,
          onClick: M.onClick,
          children: [
            M.icon,
            M.text && /* @__PURE__ */ c("span", { children: M.text })
          ]
        }
      ) }, oe)),
      g != null && b != null && /* @__PURE__ */ F("div", { className: "toolbar-left-items fm-toolbar-more-wrap", ref: O.ref, children: [
        /* @__PURE__ */ F(
          "button",
          {
            type: "button",
            className: "item-action",
            title: h("more") || "More",
            onClick: () => y((M) => !M),
            "aria-haspopup": "true",
            "aria-expanded": v,
            "aria-label": h("more") || "More",
            children: [
              /* @__PURE__ */ c(Fn, { size: 14 }),
              /* @__PURE__ */ c("span", { children: h("more") || "More" })
            ]
          }
        ),
        v && /* @__PURE__ */ F("div", { className: "fm-toolbar-more-dropdown", role: "menu", children: [
          /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "fm-toolbar-more-item",
              role: "menuitem",
              onClick: () => g((M) => !M),
              children: m ? /* @__PURE__ */ F(ue, { children: [
                /* @__PURE__ */ c($o, { size: 14 }),
                /* @__PURE__ */ c("span", { children: h("showSupersededFiles") || "Show superseded files" })
              ] }) : /* @__PURE__ */ F(ue, { children: [
                /* @__PURE__ */ c(vo, { size: 14 }),
                /* @__PURE__ */ c("span", { children: h("hideSupersededFiles") || "Hide superseded files" })
              ] })
            }
          ),
          /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "fm-toolbar-more-item",
              role: "menuitem",
              onClick: () => b((M) => !M),
              children: f ? /* @__PURE__ */ F(ue, { children: [
                /* @__PURE__ */ c(po, { size: 14 }),
                /* @__PURE__ */ c("span", { children: h("hideArchivedFiles") || "Hide archived files" })
              ] }) : /* @__PURE__ */ F(ue, { children: [
                /* @__PURE__ */ c(Nt, { size: 14 }),
                /* @__PURE__ */ c("span", { children: h("showArchivedFiles") || "Show archived files" })
              ] })
            }
          )
        ] })
      ] }),
      r != null && /* @__PURE__ */ F("div", { className: "toolbar-left-items", children: [
        /* @__PURE__ */ c("div", { className: "item-separator" }),
        s ? p ? /* @__PURE__ */ c("div", { className: "fm-toolbar-search-wrap", children: p({
          value: o,
          onChangeText: i,
          placeholder: h("searchPlaceholder") || "Search",
          onClear: () => {
            i(""), r(!1);
          }
        }) }) : /* @__PURE__ */ F("div", { className: "fm-toolbar-search-wrap", children: [
          /* @__PURE__ */ c("span", { className: "fm-toolbar-search-icon-left", "aria-hidden": !0, children: /* @__PURE__ */ c(jt, { size: 14 }) }),
          /* @__PURE__ */ c(
            "input",
            {
              type: "text",
              className: "fm-toolbar-search-input",
              placeholder: h("searchPlaceholder") || "Search",
              value: o,
              onChange: (M) => i(M.target.value),
              autoFocus: !0,
              "aria-label": h("searchPlaceholder") || "Search"
            }
          ),
          /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "fm-toolbar-search-clear",
              title: h("close"),
              onClick: () => {
                i(""), r(!1);
              },
              "aria-label": h("close"),
              children: /* @__PURE__ */ c(Qe, { size: 14 })
            }
          )
        ] }) : /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "item-action icon-only",
            title: h("search") || "Search",
            onClick: () => r(!0),
            "aria-label": h("search") || "Search",
            children: /* @__PURE__ */ c(jt, { size: 14 })
          }
        )
      ] }),
      /* @__PURE__ */ c("div", { className: "toolbar-left-items", children: /* @__PURE__ */ c(
        "button",
        {
          className: "item-action icon-only",
          title: h("refresh"),
          onClick: () => {
            Ee(t, "onRefresh"), $(null);
          },
          children: /* @__PURE__ */ c(At, { size: 14 })
        }
      ) })
    ] })
  ] }) });
};
jn.displayName = "Toolbar";
var wS = process.env.NODE_ENV === "production";
function bS(t, e) {
  if (!wS) {
    if (t)
      return;
    var n = "Warning: " + e;
    typeof console < "u" && console.warn(n);
    try {
      throw Error(n);
    } catch {
    }
  }
}
var xS = class extends Error {
  constructor(t) {
    super(`react-collapsed: ${t}`);
  }
}, ot = (...t) => bS(t[0], `[react-collapsed] -- ${t[1]}`);
function Un(t) {
  const e = re(t);
  return Q(() => {
    e.current = t;
  }), bn((...n) => e.current?.(...n), []);
}
function CS(t, e, n) {
  const [o, i] = A(e), s = re(typeof t < "u"), r = s.current ? t : o, a = Un(n), l = bn(
    (d) => {
      const p = typeof d == "function" ? d(r) : d;
      s.current || i(p), a?.(p);
    },
    [a, r]
  );
  return Q(() => {
    ot(
      !(s.current && t == null),
      "`isExpanded` state is changing from controlled to uncontrolled. useCollapse should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the `isExpanded` prop."
    ), ot(
      !(!s.current && t != null),
      "`isExpanded` state is changing from uncontrolled to controlled. useCollapse should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the `isExpanded` prop."
    );
  }, [t]), [r, l];
}
var SS = "(prefers-reduced-motion: reduce)";
function FS() {
  const [t, e] = A(!1);
  return Q(() => {
    if (typeof window > "u" || typeof window.matchMedia != "function")
      return;
    const n = window.matchMedia(SS);
    e(n.matches);
    const o = (i) => {
      e(i.matches);
    };
    if (n.addEventListener)
      return n.addEventListener("change", o), () => {
        n.removeEventListener("change", o);
      };
    if (n.addListener)
      return n.addListener(o), () => {
        n.removeListener(o);
      };
  }, []), t;
}
var NS = Be.useId || (() => {
});
function kS() {
  return NS() ?? "";
}
var ES = typeof window < "u" ? Be.useLayoutEffect : Be.useEffect, vt = !1, PS = 0, Zt = () => ++PS;
function TS(t) {
  const e = t || (vt ? Zt() : null), [n, o] = Be.useState(e);
  return ES(() => {
    n === null && o(Zt());
  }, []), Be.useEffect(() => {
    vt === !1 && (vt = !0);
  }, []), n != null ? String(n) : void 0;
}
function LS(t) {
  const e = kS(), n = TS(t);
  return typeof t == "string" ? t : typeof e == "string" ? e : n;
}
function AS(t, e) {
  const n = performance.now(), o = {};
  function i() {
    o.id = requestAnimationFrame((s) => {
      s - n > e ? t() : i();
    });
  }
  return i(), o;
}
function Qt(t) {
  t.id && cancelAnimationFrame(t.id);
}
function en(t) {
  return t?.current ? t.current.scrollHeight : (ot(
    !0,
    "Was not able to find a ref to the collapse element via `getCollapseProps`. Ensure that the element exposes its `ref` prop. If it exposes the ref prop under a different name (like `innerRef`), use the `refKey` property to change it. Example:\n\nconst collapseProps = getCollapseProps({refKey: 'innerRef'})"
  ), 0);
}
function OS(t) {
  if (!t || typeof t == "string")
    return 0;
  const e = t / 36;
  return Math.round((4 + 15 * e ** 0.25 + e / 5) * 10);
}
function RS(t, e) {
  if (t != null)
    if (typeof t == "function")
      t(e);
    else
      try {
        t.current = e;
      } catch {
        throw new xS(`Cannot assign value "${e}" to ref "${t}"`);
      }
}
function tn(...t) {
  return t.every((e) => e == null) ? null : (e) => {
    t.forEach((n) => {
      RS(n, e);
    });
  };
}
function zS(t) {
  let e = (n) => {
  };
  e = (n) => {
    if (!n?.current)
      return;
    const { paddingTop: o, paddingBottom: i } = window.getComputedStyle(n.current);
    ot(
      !(o && o !== "0px" || i && i !== "0px"),
      `Padding applied to the collapse element will cause the animation to break and not perform as expected. To fix, apply equivalent padding to the direct descendent of the collapse element. Example:

Before:   <div {...getCollapseProps({style: {padding: 10}})}>{children}</div>

After:   <div {...getCollapseProps()}>
             <div style={{padding: 10}}>
                 {children}
             </div>
          </div>`
    );
  }, Q(() => {
    e(t);
  }, [t]);
}
var IS = typeof window > "u" ? Q : to;
function MS({
  duration: t,
  easing: e = "cubic-bezier(0.4, 0, 0.2, 1)",
  onTransitionStateChange: n = () => {
  },
  isExpanded: o,
  defaultExpanded: i = !1,
  hasDisabledAnimation: s,
  id: r,
  ...a
} = {}) {
  const l = Un(n), d = LS(r ? `${r}` : void 0), [u, p] = CS(
    o,
    i
  ), m = re(u), [g, f] = A(!1), b = FS(), T = s ?? b, C = re(), R = re(), N = re(null), [k, $] = A(null);
  zS(N);
  const E = `${a.collapsedHeight || 0}px`;
  function x(h) {
    if (!N.current)
      return;
    const v = N.current;
    for (const y in h) {
      const O = h[y];
      O ? v.style[y] = O : v.style.removeProperty(y);
    }
  }
  return IS(() => {
    if (!N.current || u === m.current)
      return;
    m.current = u;
    function v(I) {
      return T ? 0 : t ?? OS(I);
    }
    const y = (I) => `height ${v(I)}ms ${e}`, O = (I) => {
      function _() {
        u ? (x({
          height: "",
          overflow: "",
          transition: "",
          display: ""
        }), l("expandEnd")) : (x({ transition: "" }), l("collapseEnd")), f(!1);
      }
      R.current && Qt(R.current), R.current = AS(_, I);
    };
    return f(!0), u ? C.current = requestAnimationFrame(() => {
      l("expandStart"), x({
        display: "block",
        overflow: "hidden",
        height: E
      }), C.current = requestAnimationFrame(() => {
        l("expanding");
        const I = en(N);
        O(v(I)), N.current && (N.current.style.transition = y(I), N.current.style.height = `${I}px`);
      });
    }) : C.current = requestAnimationFrame(() => {
      l("collapseStart");
      const I = en(N);
      O(v(I)), x({
        transition: y(I),
        height: `${I}px`
      }), C.current = requestAnimationFrame(() => {
        l("collapsing"), x({
          height: E,
          overflow: "hidden"
        });
      });
    }), () => {
      C.current && cancelAnimationFrame(C.current), R.current && Qt(R.current);
    };
  }, [
    u,
    E,
    T,
    t,
    e,
    l
  ]), {
    isExpanded: u,
    setExpanded: p,
    getToggleProps(h) {
      const { disabled: v, onClick: y, refKey: O, ...I } = {
        refKey: "ref",
        onClick() {
        },
        disabled: !1,
        ...h
      }, _ = k ? k.tagName === "BUTTON" : void 0, H = h?.[O || "ref"], W = {
        id: `react-collapsed-toggle-${d}`,
        "aria-controls": `react-collapsed-panel-${d}`,
        "aria-expanded": u,
        onClick(oe) {
          v || (y?.(oe), p((ce) => !ce));
        },
        [O || "ref"]: tn(H, $)
      }, Z = {
        type: "button",
        disabled: v ? !0 : void 0
      }, M = {
        "aria-disabled": v ? !0 : void 0,
        role: "button",
        tabIndex: v ? -1 : 0
      };
      return _ === !1 ? { ...W, ...M, ...I } : _ === !0 ? { ...W, ...Z, ...I } : {
        ...W,
        ...Z,
        ...M,
        ...I
      };
    },
    getCollapseProps(h) {
      const { style: v, refKey: y } = { refKey: "ref", style: {}, ...h }, O = h?.[y || "ref"];
      return {
        id: `react-collapsed-panel-${d}`,
        "aria-hidden": !u,
        "aria-labelledby": `react-collapsed-toggle-${d}`,
        role: "region",
        ...h,
        [y || "ref"]: tn(N, O),
        style: {
          boxSizing: "border-box",
          ...!g && !u ? {
            // collapsed and not animating
            display: E === "0px" ? "none" : "block",
            height: E,
            overflow: "hidden"
          } : {},
          // additional styles passed, e.g. getCollapseProps({style: {}})
          ...v
        }
      };
    }
  };
}
const jS = ({ open: t, children: e }) => {
  const [n, o] = A(t), { getCollapseProps: i } = MS({
    isExpanded: n,
    duration: 500
  });
  return Q(() => {
    o(t);
  }, [t, o]), /* @__PURE__ */ c(ue, { children: /* @__PURE__ */ c("div", { ...i(), children: e }) });
};
function nn(t) {
  return ee({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM155.7 250.2L192 302.1l36.3-51.9c7.6-10.9 22.6-13.5 33.4-5.9s13.5 22.6 5.9 33.4L221.3 344l46.4 66.2c7.6 10.9 5 25.8-5.9 33.4s-25.8 5-33.4-5.9L192 385.8l-36.3 51.9c-7.6 10.9-22.6 13.5-33.4 5.9s-13.5-22.6-5.9-33.4L162.7 344l-46.4-66.2c-7.6-10.9-5-25.8 5.9-33.4s25.8-5 33.4 5.9z" }, child: [] }] })(t);
}
function US(t) {
  return ee({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z" }, child: [] }] })(t);
}
function on(t) {
  return ee({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM111 257.1l26.8 89.2 31.6-90.3c3.4-9.6 12.5-16.1 22.7-16.1s19.3 6.4 22.7 16.1l31.6 90.3L273 257.1c3.8-12.7 17.2-19.9 29.9-16.1s19.9 17.2 16.1 29.9l-48 160c-3 10-12 16.9-22.4 17.1s-19.8-6.2-23.2-16.1L192 336.6l-33.3 95.3c-3.4 9.8-12.8 16.3-23.2 16.1s-19.5-7.1-22.4-17.1l-48-160c-3.8-12.7 3.4-26.1 16.1-29.9s26.1 3.4 29.9 16.1z" }, child: [] }] })(t);
}
function ie(t) {
  return ee({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z" }, child: [] }] })(t);
}
function sn(t) {
  return ee({ attr: { viewBox: "0 0 576 512" }, child: [{ tag: "path", attr: { d: "M88.7 223.8L0 375.8 0 96C0 60.7 28.7 32 64 32l117.5 0c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7L416 96c35.3 0 64 28.7 64 64l0 32-336 0c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224l400 0c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480L32 480c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z" }, child: [] }] })(t);
}
function it(t) {
  return ee({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" }, child: [] }] })(t);
}
function we(t) {
  return ee({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6l96 0 32 0 208 0c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" }, child: [] }] })(t);
}
const Dn = ({ folder: t, onFileOpen: e }) => {
  const [n, o] = A(!1), [i, s] = A(!1), { currentPath: r, setCurrentPath: a, onFolderChange: l } = ye(), d = () => {
    s(!0), e(t), a(t.path), l?.(t.path);
  }, u = (p) => {
    p.stopPropagation(), o((m) => !m);
  };
  return Q(() => {
    s(r === t.path);
    const p = r.split("/");
    p.pop(), p.join("/") === t.path && o(!0);
  }, [r]), t.subDirectories.length > 0 ? /* @__PURE__ */ F(ue, { children: [
    /* @__PURE__ */ F(
      "div",
      {
        className: `sb-folders-list-item ${i ? "active-list-item" : ""}`,
        onClick: d,
        children: [
          /* @__PURE__ */ c("span", { onClick: u, children: /* @__PURE__ */ c(
            Tt,
            {
              size: 14,
              className: `folder-icon-default ${n ? "folder-rotate-down" : ""}`
            }
          ) }),
          /* @__PURE__ */ F("div", { className: "sb-folder-details", children: [
            n || i ? /* @__PURE__ */ c(sn, { size: 14, className: "folder-open-icon", color: "#FFB547" }) : /* @__PURE__ */ c(it, { size: 14, className: "folder-close-icon", color: "#FFB547" }),
            /* @__PURE__ */ c("span", { className: "sb-folder-name", title: t.name, children: t.name })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ c(jS, { open: n, children: /* @__PURE__ */ c("div", { className: "folder-collapsible", children: t.subDirectories.map((p, m) => /* @__PURE__ */ c(Dn, { folder: p, onFileOpen: e }, m)) }) })
  ] }) : /* @__PURE__ */ F(
    "div",
    {
      className: `sb-folders-list-item ${i ? "active-list-item" : ""}`,
      onClick: d,
      children: [
        /* @__PURE__ */ c("span", { className: "non-expanable" }),
        /* @__PURE__ */ F("div", { className: "sb-folder-details", children: [
          i ? /* @__PURE__ */ c(sn, { size: 14, className: "folder-open-icon", color: "#FFB547" }) : /* @__PURE__ */ c(it, { size: 14, className: "folder-close-icon", color: "#FFB547" }),
          /* @__PURE__ */ c("span", { className: "sb-folder-name", title: t.name, children: t.name })
        ] })
      ]
    }
  );
}, DS = (t) => t?.split("/").slice(0, -1).join("/"), Vn = ({ onFileOpen: t }) => {
  const [e, n] = A([]), { files: o } = rt(), i = pe(), s = (r, a) => a[r] ? a[r]?.map((l) => ({
    ...l,
    subDirectories: s(l.path, a)
  })) : [];
  return Q(() => {
    if (Array.isArray(o)) {
      const r = o.filter((l) => l.isDirectory), a = Object.groupBy(r, ({ path: l }) => DS(l));
      n(() => s("", a));
    }
  }, [o]), /* @__PURE__ */ c("div", { className: "sb-folders-list", children: e?.length > 0 ? /* @__PURE__ */ c(ue, { children: e?.map((r, a) => /* @__PURE__ */ c(Dn, { folder: r, onFileOpen: t }, a)) }) : /* @__PURE__ */ c("div", { className: "empty-nav-pane", children: i("nothingHereYet") }) });
};
Vn.displayName = "NavigationPane";
function VS(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Je = { exports: {} }, Ge = { exports: {} }, te = {};
var rn;
function HS() {
  if (rn) return te;
  rn = 1;
  var t = typeof Symbol == "function" && Symbol.for, e = t ? /* @__PURE__ */ Symbol.for("react.element") : 60103, n = t ? /* @__PURE__ */ Symbol.for("react.portal") : 60106, o = t ? /* @__PURE__ */ Symbol.for("react.fragment") : 60107, i = t ? /* @__PURE__ */ Symbol.for("react.strict_mode") : 60108, s = t ? /* @__PURE__ */ Symbol.for("react.profiler") : 60114, r = t ? /* @__PURE__ */ Symbol.for("react.provider") : 60109, a = t ? /* @__PURE__ */ Symbol.for("react.context") : 60110, l = t ? /* @__PURE__ */ Symbol.for("react.async_mode") : 60111, d = t ? /* @__PURE__ */ Symbol.for("react.concurrent_mode") : 60111, u = t ? /* @__PURE__ */ Symbol.for("react.forward_ref") : 60112, p = t ? /* @__PURE__ */ Symbol.for("react.suspense") : 60113, m = t ? /* @__PURE__ */ Symbol.for("react.suspense_list") : 60120, g = t ? /* @__PURE__ */ Symbol.for("react.memo") : 60115, f = t ? /* @__PURE__ */ Symbol.for("react.lazy") : 60116, b = t ? /* @__PURE__ */ Symbol.for("react.block") : 60121, T = t ? /* @__PURE__ */ Symbol.for("react.fundamental") : 60117, C = t ? /* @__PURE__ */ Symbol.for("react.responder") : 60118, R = t ? /* @__PURE__ */ Symbol.for("react.scope") : 60119;
  function N($) {
    if (typeof $ == "object" && $ !== null) {
      var E = $.$$typeof;
      switch (E) {
        case e:
          switch ($ = $.type, $) {
            case l:
            case d:
            case o:
            case s:
            case i:
            case p:
              return $;
            default:
              switch ($ = $ && $.$$typeof, $) {
                case a:
                case u:
                case f:
                case g:
                case r:
                  return $;
                default:
                  return E;
              }
          }
        case n:
          return E;
      }
    }
  }
  function k($) {
    return N($) === d;
  }
  return te.AsyncMode = l, te.ConcurrentMode = d, te.ContextConsumer = a, te.ContextProvider = r, te.Element = e, te.ForwardRef = u, te.Fragment = o, te.Lazy = f, te.Memo = g, te.Portal = n, te.Profiler = s, te.StrictMode = i, te.Suspense = p, te.isAsyncMode = function($) {
    return k($) || N($) === l;
  }, te.isConcurrentMode = k, te.isContextConsumer = function($) {
    return N($) === a;
  }, te.isContextProvider = function($) {
    return N($) === r;
  }, te.isElement = function($) {
    return typeof $ == "object" && $ !== null && $.$$typeof === e;
  }, te.isForwardRef = function($) {
    return N($) === u;
  }, te.isFragment = function($) {
    return N($) === o;
  }, te.isLazy = function($) {
    return N($) === f;
  }, te.isMemo = function($) {
    return N($) === g;
  }, te.isPortal = function($) {
    return N($) === n;
  }, te.isProfiler = function($) {
    return N($) === s;
  }, te.isStrictMode = function($) {
    return N($) === i;
  }, te.isSuspense = function($) {
    return N($) === p;
  }, te.isValidElementType = function($) {
    return typeof $ == "string" || typeof $ == "function" || $ === o || $ === d || $ === s || $ === i || $ === p || $ === m || typeof $ == "object" && $ !== null && ($.$$typeof === f || $.$$typeof === g || $.$$typeof === r || $.$$typeof === a || $.$$typeof === u || $.$$typeof === T || $.$$typeof === C || $.$$typeof === R || $.$$typeof === b);
  }, te.typeOf = N, te;
}
var ne = {};
var an;
function WS() {
  return an || (an = 1, process.env.NODE_ENV !== "production" && (function() {
    var t = typeof Symbol == "function" && Symbol.for, e = t ? /* @__PURE__ */ Symbol.for("react.element") : 60103, n = t ? /* @__PURE__ */ Symbol.for("react.portal") : 60106, o = t ? /* @__PURE__ */ Symbol.for("react.fragment") : 60107, i = t ? /* @__PURE__ */ Symbol.for("react.strict_mode") : 60108, s = t ? /* @__PURE__ */ Symbol.for("react.profiler") : 60114, r = t ? /* @__PURE__ */ Symbol.for("react.provider") : 60109, a = t ? /* @__PURE__ */ Symbol.for("react.context") : 60110, l = t ? /* @__PURE__ */ Symbol.for("react.async_mode") : 60111, d = t ? /* @__PURE__ */ Symbol.for("react.concurrent_mode") : 60111, u = t ? /* @__PURE__ */ Symbol.for("react.forward_ref") : 60112, p = t ? /* @__PURE__ */ Symbol.for("react.suspense") : 60113, m = t ? /* @__PURE__ */ Symbol.for("react.suspense_list") : 60120, g = t ? /* @__PURE__ */ Symbol.for("react.memo") : 60115, f = t ? /* @__PURE__ */ Symbol.for("react.lazy") : 60116, b = t ? /* @__PURE__ */ Symbol.for("react.block") : 60121, T = t ? /* @__PURE__ */ Symbol.for("react.fundamental") : 60117, C = t ? /* @__PURE__ */ Symbol.for("react.responder") : 60118, R = t ? /* @__PURE__ */ Symbol.for("react.scope") : 60119;
    function N(P) {
      return typeof P == "string" || typeof P == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      P === o || P === d || P === s || P === i || P === p || P === m || typeof P == "object" && P !== null && (P.$$typeof === f || P.$$typeof === g || P.$$typeof === r || P.$$typeof === a || P.$$typeof === u || P.$$typeof === T || P.$$typeof === C || P.$$typeof === R || P.$$typeof === b);
    }
    function k(P) {
      if (typeof P == "object" && P !== null) {
        var fe = P.$$typeof;
        switch (fe) {
          case e:
            var Ce = P.type;
            switch (Ce) {
              case l:
              case d:
              case o:
              case s:
              case i:
              case p:
                return Ce;
              default:
                var $e = Ce && Ce.$$typeof;
                switch ($e) {
                  case a:
                  case u:
                  case f:
                  case g:
                  case r:
                    return $e;
                  default:
                    return fe;
                }
            }
          case n:
            return fe;
        }
      }
    }
    var $ = l, E = d, x = a, h = r, v = e, y = u, O = o, I = f, _ = g, H = n, W = s, Z = i, M = p, oe = !1;
    function ce(P) {
      return oe || (oe = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), w(P) || k(P) === l;
    }
    function w(P) {
      return k(P) === d;
    }
    function S(P) {
      return k(P) === a;
    }
    function U(P) {
      return k(P) === r;
    }
    function D(P) {
      return typeof P == "object" && P !== null && P.$$typeof === e;
    }
    function V(P) {
      return k(P) === u;
    }
    function X(P) {
      return k(P) === o;
    }
    function K(P) {
      return k(P) === f;
    }
    function q(P) {
      return k(P) === g;
    }
    function j(P) {
      return k(P) === n;
    }
    function Y(P) {
      return k(P) === s;
    }
    function G(P) {
      return k(P) === i;
    }
    function ae(P) {
      return k(P) === p;
    }
    ne.AsyncMode = $, ne.ConcurrentMode = E, ne.ContextConsumer = x, ne.ContextProvider = h, ne.Element = v, ne.ForwardRef = y, ne.Fragment = O, ne.Lazy = I, ne.Memo = _, ne.Portal = H, ne.Profiler = W, ne.StrictMode = Z, ne.Suspense = M, ne.isAsyncMode = ce, ne.isConcurrentMode = w, ne.isContextConsumer = S, ne.isContextProvider = U, ne.isElement = D, ne.isForwardRef = V, ne.isFragment = X, ne.isLazy = K, ne.isMemo = q, ne.isPortal = j, ne.isProfiler = Y, ne.isStrictMode = G, ne.isSuspense = ae, ne.isValidElementType = N, ne.typeOf = k;
  })()), ne;
}
var ln;
function Hn() {
  return ln || (ln = 1, process.env.NODE_ENV === "production" ? Ge.exports = HS() : Ge.exports = WS()), Ge.exports;
}
var $t, cn;
function BS() {
  if (cn) return $t;
  cn = 1;
  var t = Object.getOwnPropertySymbols, e = Object.prototype.hasOwnProperty, n = Object.prototype.propertyIsEnumerable;
  function o(s) {
    if (s == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(s);
  }
  function i() {
    try {
      if (!Object.assign)
        return !1;
      var s = new String("abc");
      if (s[5] = "de", Object.getOwnPropertyNames(s)[0] === "5")
        return !1;
      for (var r = {}, a = 0; a < 10; a++)
        r["_" + String.fromCharCode(a)] = a;
      var l = Object.getOwnPropertyNames(r).map(function(u) {
        return r[u];
      });
      if (l.join("") !== "0123456789")
        return !1;
      var d = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(u) {
        d[u] = u;
      }), Object.keys(Object.assign({}, d)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return $t = i() ? Object.assign : function(s, r) {
    for (var a, l = o(s), d, u = 1; u < arguments.length; u++) {
      a = Object(arguments[u]);
      for (var p in a)
        e.call(a, p) && (l[p] = a[p]);
      if (t) {
        d = t(a);
        for (var m = 0; m < d.length; m++)
          n.call(a, d[m]) && (l[d[m]] = a[d[m]]);
      }
    }
    return l;
  }, $t;
}
var yt, dn;
function Rt() {
  if (dn) return yt;
  dn = 1;
  var t = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return yt = t, yt;
}
var wt, un;
function Wn() {
  return un || (un = 1, wt = Function.call.bind(Object.prototype.hasOwnProperty)), wt;
}
var bt, pn;
function _S() {
  if (pn) return bt;
  pn = 1;
  var t = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var e = /* @__PURE__ */ Rt(), n = {}, o = /* @__PURE__ */ Wn();
    t = function(s) {
      var r = "Warning: " + s;
      typeof console < "u" && console.error(r);
      try {
        throw new Error(r);
      } catch {
      }
    };
  }
  function i(s, r, a, l, d) {
    if (process.env.NODE_ENV !== "production") {
      for (var u in s)
        if (o(s, u)) {
          var p;
          try {
            if (typeof s[u] != "function") {
              var m = Error(
                (l || "React class") + ": " + a + " type `" + u + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof s[u] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw m.name = "Invariant Violation", m;
            }
            p = s[u](r, u, l, a, null, e);
          } catch (f) {
            p = f;
          }
          if (p && !(p instanceof Error) && t(
            (l || "React class") + ": type specification of " + a + " `" + u + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof p + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), p instanceof Error && !(p.message in n)) {
            n[p.message] = !0;
            var g = d ? d() : "";
            t(
              "Failed " + a + " type: " + p.message + (g ?? "")
            );
          }
        }
    }
  }
  return i.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (n = {});
  }, bt = i, bt;
}
var xt, fn;
function KS() {
  if (fn) return xt;
  fn = 1;
  var t = Hn(), e = BS(), n = /* @__PURE__ */ Rt(), o = /* @__PURE__ */ Wn(), i = /* @__PURE__ */ _S(), s = function() {
  };
  process.env.NODE_ENV !== "production" && (s = function(a) {
    var l = "Warning: " + a;
    typeof console < "u" && console.error(l);
    try {
      throw new Error(l);
    } catch {
    }
  });
  function r() {
    return null;
  }
  return xt = function(a, l) {
    var d = typeof Symbol == "function" && Symbol.iterator, u = "@@iterator";
    function p(w) {
      var S = w && (d && w[d] || w[u]);
      if (typeof S == "function")
        return S;
    }
    var m = "<<anonymous>>", g = {
      array: C("array"),
      bigint: C("bigint"),
      bool: C("boolean"),
      func: C("function"),
      number: C("number"),
      object: C("object"),
      string: C("string"),
      symbol: C("symbol"),
      any: R(),
      arrayOf: N,
      element: k(),
      elementType: $(),
      instanceOf: E,
      node: y(),
      objectOf: h,
      oneOf: x,
      oneOfType: v,
      shape: I,
      exact: _
    };
    function f(w, S) {
      return w === S ? w !== 0 || 1 / w === 1 / S : w !== w && S !== S;
    }
    function b(w, S) {
      this.message = w, this.data = S && typeof S == "object" ? S : {}, this.stack = "";
    }
    b.prototype = Error.prototype;
    function T(w) {
      if (process.env.NODE_ENV !== "production")
        var S = {}, U = 0;
      function D(X, K, q, j, Y, G, ae) {
        if (j = j || m, G = G || q, ae !== n) {
          if (l) {
            var P = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw P.name = "Invariant Violation", P;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var fe = j + ":" + q;
            !S[fe] && // Avoid spamming the console because they are often not actionable except for lib authors
            U < 3 && (s(
              "You are manually calling a React.PropTypes validation function for the `" + G + "` prop on `" + j + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), S[fe] = !0, U++);
          }
        }
        return K[q] == null ? X ? K[q] === null ? new b("The " + Y + " `" + G + "` is marked as required " + ("in `" + j + "`, but its value is `null`.")) : new b("The " + Y + " `" + G + "` is marked as required in " + ("`" + j + "`, but its value is `undefined`.")) : null : w(K, q, j, Y, G);
      }
      var V = D.bind(null, !1);
      return V.isRequired = D.bind(null, !0), V;
    }
    function C(w) {
      function S(U, D, V, X, K, q) {
        var j = U[D], Y = Z(j);
        if (Y !== w) {
          var G = M(j);
          return new b(
            "Invalid " + X + " `" + K + "` of type " + ("`" + G + "` supplied to `" + V + "`, expected ") + ("`" + w + "`."),
            { expectedType: w }
          );
        }
        return null;
      }
      return T(S);
    }
    function R() {
      return T(r);
    }
    function N(w) {
      function S(U, D, V, X, K) {
        if (typeof w != "function")
          return new b("Property `" + K + "` of component `" + V + "` has invalid PropType notation inside arrayOf.");
        var q = U[D];
        if (!Array.isArray(q)) {
          var j = Z(q);
          return new b("Invalid " + X + " `" + K + "` of type " + ("`" + j + "` supplied to `" + V + "`, expected an array."));
        }
        for (var Y = 0; Y < q.length; Y++) {
          var G = w(q, Y, V, X, K + "[" + Y + "]", n);
          if (G instanceof Error)
            return G;
        }
        return null;
      }
      return T(S);
    }
    function k() {
      function w(S, U, D, V, X) {
        var K = S[U];
        if (!a(K)) {
          var q = Z(K);
          return new b("Invalid " + V + " `" + X + "` of type " + ("`" + q + "` supplied to `" + D + "`, expected a single ReactElement."));
        }
        return null;
      }
      return T(w);
    }
    function $() {
      function w(S, U, D, V, X) {
        var K = S[U];
        if (!t.isValidElementType(K)) {
          var q = Z(K);
          return new b("Invalid " + V + " `" + X + "` of type " + ("`" + q + "` supplied to `" + D + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return T(w);
    }
    function E(w) {
      function S(U, D, V, X, K) {
        if (!(U[D] instanceof w)) {
          var q = w.name || m, j = ce(U[D]);
          return new b("Invalid " + X + " `" + K + "` of type " + ("`" + j + "` supplied to `" + V + "`, expected ") + ("instance of `" + q + "`."));
        }
        return null;
      }
      return T(S);
    }
    function x(w) {
      if (!Array.isArray(w))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? s(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : s("Invalid argument supplied to oneOf, expected an array.")), r;
      function S(U, D, V, X, K) {
        for (var q = U[D], j = 0; j < w.length; j++)
          if (f(q, w[j]))
            return null;
        var Y = JSON.stringify(w, function(ae, P) {
          var fe = M(P);
          return fe === "symbol" ? String(P) : P;
        });
        return new b("Invalid " + X + " `" + K + "` of value `" + String(q) + "` " + ("supplied to `" + V + "`, expected one of " + Y + "."));
      }
      return T(S);
    }
    function h(w) {
      function S(U, D, V, X, K) {
        if (typeof w != "function")
          return new b("Property `" + K + "` of component `" + V + "` has invalid PropType notation inside objectOf.");
        var q = U[D], j = Z(q);
        if (j !== "object")
          return new b("Invalid " + X + " `" + K + "` of type " + ("`" + j + "` supplied to `" + V + "`, expected an object."));
        for (var Y in q)
          if (o(q, Y)) {
            var G = w(q, Y, V, X, K + "." + Y, n);
            if (G instanceof Error)
              return G;
          }
        return null;
      }
      return T(S);
    }
    function v(w) {
      if (!Array.isArray(w))
        return process.env.NODE_ENV !== "production" && s("Invalid argument supplied to oneOfType, expected an instance of array."), r;
      for (var S = 0; S < w.length; S++) {
        var U = w[S];
        if (typeof U != "function")
          return s(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + oe(U) + " at index " + S + "."
          ), r;
      }
      function D(V, X, K, q, j) {
        for (var Y = [], G = 0; G < w.length; G++) {
          var ae = w[G], P = ae(V, X, K, q, j, n);
          if (P == null)
            return null;
          P.data && o(P.data, "expectedType") && Y.push(P.data.expectedType);
        }
        var fe = Y.length > 0 ? ", expected one of type [" + Y.join(", ") + "]" : "";
        return new b("Invalid " + q + " `" + j + "` supplied to " + ("`" + K + "`" + fe + "."));
      }
      return T(D);
    }
    function y() {
      function w(S, U, D, V, X) {
        return H(S[U]) ? null : new b("Invalid " + V + " `" + X + "` supplied to " + ("`" + D + "`, expected a ReactNode."));
      }
      return T(w);
    }
    function O(w, S, U, D, V) {
      return new b(
        (w || "React class") + ": " + S + " type `" + U + "." + D + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + V + "`."
      );
    }
    function I(w) {
      function S(U, D, V, X, K) {
        var q = U[D], j = Z(q);
        if (j !== "object")
          return new b("Invalid " + X + " `" + K + "` of type `" + j + "` " + ("supplied to `" + V + "`, expected `object`."));
        for (var Y in w) {
          var G = w[Y];
          if (typeof G != "function")
            return O(V, X, K, Y, M(G));
          var ae = G(q, Y, V, X, K + "." + Y, n);
          if (ae)
            return ae;
        }
        return null;
      }
      return T(S);
    }
    function _(w) {
      function S(U, D, V, X, K) {
        var q = U[D], j = Z(q);
        if (j !== "object")
          return new b("Invalid " + X + " `" + K + "` of type `" + j + "` " + ("supplied to `" + V + "`, expected `object`."));
        var Y = e({}, U[D], w);
        for (var G in Y) {
          var ae = w[G];
          if (o(w, G) && typeof ae != "function")
            return O(V, X, K, G, M(ae));
          if (!ae)
            return new b(
              "Invalid " + X + " `" + K + "` key `" + G + "` supplied to `" + V + "`.\nBad object: " + JSON.stringify(U[D], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(w), null, "  ")
            );
          var P = ae(q, G, V, X, K + "." + G, n);
          if (P)
            return P;
        }
        return null;
      }
      return T(S);
    }
    function H(w) {
      switch (typeof w) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !w;
        case "object":
          if (Array.isArray(w))
            return w.every(H);
          if (w === null || a(w))
            return !0;
          var S = p(w);
          if (S) {
            var U = S.call(w), D;
            if (S !== w.entries) {
              for (; !(D = U.next()).done; )
                if (!H(D.value))
                  return !1;
            } else
              for (; !(D = U.next()).done; ) {
                var V = D.value;
                if (V && !H(V[1]))
                  return !1;
              }
          } else
            return !1;
          return !0;
        default:
          return !1;
      }
    }
    function W(w, S) {
      return w === "symbol" ? !0 : S ? S["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && S instanceof Symbol : !1;
    }
    function Z(w) {
      var S = typeof w;
      return Array.isArray(w) ? "array" : w instanceof RegExp ? "object" : W(S, w) ? "symbol" : S;
    }
    function M(w) {
      if (typeof w > "u" || w === null)
        return "" + w;
      var S = Z(w);
      if (S === "object") {
        if (w instanceof Date)
          return "date";
        if (w instanceof RegExp)
          return "regexp";
      }
      return S;
    }
    function oe(w) {
      var S = M(w);
      switch (S) {
        case "array":
        case "object":
          return "an " + S;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + S;
        default:
          return S;
      }
    }
    function ce(w) {
      return !w.constructor || !w.constructor.name ? m : w.constructor.name;
    }
    return g.checkPropTypes = i, g.resetWarningCache = i.resetWarningCache, g.PropTypes = g, g;
  }, xt;
}
var Ct, hn;
function YS() {
  if (hn) return Ct;
  hn = 1;
  var t = /* @__PURE__ */ Rt();
  function e() {
  }
  function n() {
  }
  return n.resetWarningCache = e, Ct = function() {
    function o(r, a, l, d, u, p) {
      if (p !== t) {
        var m = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw m.name = "Invariant Violation", m;
      }
    }
    o.isRequired = o;
    function i() {
      return o;
    }
    var s = {
      array: o,
      bigint: o,
      bool: o,
      func: o,
      number: o,
      object: o,
      string: o,
      symbol: o,
      any: o,
      arrayOf: i,
      element: o,
      elementType: o,
      instanceOf: i,
      node: o,
      objectOf: i,
      oneOf: i,
      oneOfType: i,
      shape: i,
      exact: i,
      checkPropTypes: n,
      resetWarningCache: e
    };
    return s.PropTypes = s, s;
  }, Ct;
}
var mn;
function qS() {
  if (mn) return Je.exports;
  if (mn = 1, process.env.NODE_ENV !== "production") {
    var t = Hn(), e = !0;
    Je.exports = /* @__PURE__ */ KS()(t.isElement, e);
  } else
    Je.exports = /* @__PURE__ */ YS()();
  return Je.exports;
}
var JS = /* @__PURE__ */ qS();
const L = /* @__PURE__ */ VS(JS), zt = ({ collapsibleNav: t, isNavigationPaneOpen: e, setNavigationPaneOpen: n }) => {
  const [o, i] = A([]), [s, r] = A([]), [a, l] = A([]), [d, u] = A(!1), { currentPath: p, setCurrentPath: m, onFolderChange: g } = ye(), f = re(null), b = re([]), T = re(null), C = Ke(() => {
    u(!1);
  }), R = pe(), N = re(null);
  Q(() => {
    i(() => {
      let h = "";
      return p?.split("/").map((v) => ({
        name: v || R("home"),
        path: v === "" ? v : h += `/${v}`
      }));
    }), r([]), l([]);
  }, [p, R]);
  const k = (h) => {
    m(h), g?.(h);
  }, $ = () => {
    const h = f.current.clientWidth, v = getComputedStyle(f.current), y = parseFloat(v.paddingLeft), O = t ? 2 : 0, _ = t ? N.current?.clientWidth + 1 : 0, H = s.length > 0 ? 1 : 0, W = parseFloat(v.gap) * (o.length + H + O);
    return h - (y + W + _);
  }, E = () => {
    const h = $(), v = b.current.reduce((O, I) => I ? O + I.clientWidth : O, 0), y = T.current?.clientWidth || 0;
    return h - (v + y);
  }, x = () => f.current.scrollWidth > f.current.clientWidth;
  return Q(() => {
    if (x()) {
      const h = o[1], v = b.current[1]?.clientWidth;
      l((y) => [...y, v]), r((y) => [...y, h]), i((y) => y.filter((O, I) => I !== 1));
    } else if (s.length > 0 && E() > a.at(-1)) {
      const h = [o[0], s.at(-1), ...o.slice(1)];
      i(h), r((v) => v.slice(0, -1)), l((v) => v.slice(0, -1));
    }
  }, [x]), /* @__PURE__ */ F("div", { className: "bread-crumb-container", children: [
    /* @__PURE__ */ F("div", { className: "breadcrumb", ref: f, children: [
      t && /* @__PURE__ */ F(ue, { children: [
        /* @__PURE__ */ c(
          "div",
          {
            ref: N,
            className: "nav-toggler",
            title: `${R(e ? "collapseNavigationPane" : "expandNavigationPane")}`,
            children: /* @__PURE__ */ c(
              "span",
              {
                className: "folder-name folder-name-btn",
                onClick: () => n((h) => !h),
                children: e ? /* @__PURE__ */ c(Co, {}) : /* @__PURE__ */ c(So, {})
              }
            )
          }
        ),
        /* @__PURE__ */ c("div", { className: "divider" })
      ] }),
      o.map((h, v) => /* @__PURE__ */ F("div", { style: { display: "contents" }, children: [
        /* @__PURE__ */ F(
          "span",
          {
            className: "folder-name",
            onClick: () => k(h.path),
            ref: (y) => b.current[v] = y,
            children: [
              v === 0 ? /* @__PURE__ */ c(bo, {}) : /* @__PURE__ */ c(Tt, {}),
              h.name
            ]
          }
        ),
        s?.length > 0 && v === 0 && /* @__PURE__ */ c(
          "button",
          {
            className: "folder-name folder-name-btn",
            onClick: () => u(!0),
            ref: T,
            title: R("showMoreFolder"),
            children: /* @__PURE__ */ c(Fn, { size: 14, className: "hidden-folders" })
          }
        )
      ] }, v))
    ] }),
    d && /* @__PURE__ */ c("ul", { ref: C.ref, className: "hidden-folders-container", children: s.map((h, v) => /* @__PURE__ */ c(
      "li",
      {
        onClick: () => {
          k(h.path), u(!1);
        },
        children: h.name
      },
      v
    )) })
  ] });
};
zt.displayName = "BreadCrumb";
zt.propTypes = {
  isNavigationPaneOpen: L.bool.isRequired,
  setNavigationPaneOpen: L.func.isRequired
};
const J = {
  pdf: "#E53E3E",
  word: "#3182CE",
  excel: "#38A169",
  image: "#805AD5",
  other: "#718096"
}, st = (t) => ({
  pdf: /* @__PURE__ */ c(US, { size: t, color: J.pdf }),
  jpg: /* @__PURE__ */ c(we, { size: t, color: J.image }),
  jpeg: /* @__PURE__ */ c(we, { size: t, color: J.image }),
  png: /* @__PURE__ */ c(we, { size: t, color: J.image }),
  gif: /* @__PURE__ */ c(we, { size: t, color: J.image }),
  webp: /* @__PURE__ */ c(we, { size: t, color: J.image }),
  bmp: /* @__PURE__ */ c(we, { size: t, color: J.image }),
  ico: /* @__PURE__ */ c(we, { size: t, color: J.image }),
  tiff: /* @__PURE__ */ c(we, { size: t, color: J.image }),
  tif: /* @__PURE__ */ c(we, { size: t, color: J.image }),
  svg: /* @__PURE__ */ c(we, { size: t, color: J.image }),
  txt: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  doc: /* @__PURE__ */ c(on, { size: t, color: J.word }),
  docx: /* @__PURE__ */ c(on, { size: t, color: J.word }),
  mp4: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  webm: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  mp3: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  m4a: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  zip: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  ppt: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  pptx: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  xls: /* @__PURE__ */ c(nn, { size: t, color: J.excel }),
  xlsx: /* @__PURE__ */ c(nn, { size: t, color: J.excel }),
  exe: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  html: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  css: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  js: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  php: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  py: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  java: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  cpp: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  c: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  ts: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  jsx: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  tsx: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  json: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  xml: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  sql: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  csv: /* @__PURE__ */ c(ie, { size: t, color: J.other }),
  md: /* @__PURE__ */ c(ie, { size: t, color: J.other })
}), Bn = (t, e, n) => {
  if (n.find((o) => o.name === t)) {
    const i = t;
    let s = 0;
    const r = new RegExp(`${i} \\(\\d+\\)`);
    n.forEach((d) => {
      const u = d.isDirectory ? d.name : d.name.split(".").slice(0, -1).join(".");
      if (r.test(u)) {
        const p = u.split(`${i} (`).pop().slice(0, -1), m = parseInt(p);
        !isNaN(m) && m > s && (s = m);
      }
    });
    const a = ` (${++s})`;
    return i + a + "";
  } else
    return t;
}, _n = ({ nameInputRef: t, id: e, maxLength: n, value: o, onChange: i, onKeyDown: s, onClick: r, rows: a }) => /* @__PURE__ */ c(
  "textarea",
  {
    ref: t,
    id: e,
    className: "rename-file",
    maxLength: n,
    value: o,
    onChange: i,
    onKeyDown: s,
    onClick: r,
    rows: a
  }
), Kn = ({ message: t, xPlacement: e, yPlacement: n }) => /* @__PURE__ */ c("p", { className: `error-tooltip ${e} ${n}`, children: t }), Yn = Ie(), GS = ({ children: t, layout: e }) => {
  const [n, o] = A(() => i(e));
  function i(s) {
    return ["list", "grid"].includes(s) ? s : "grid";
  }
  return /* @__PURE__ */ c(Yn.Provider, { value: { activeLayout: n, setActiveLayout: o }, children: t });
}, ct = () => Me(Yn), XS = 220, ZS = ({ filesViewRef: t, file: e, onCreateFolder: n, triggerAction: o }) => {
  const [i, s] = A(e.name), [r, a] = A(!1), [l, d] = A(""), [u, p] = A("right"), [m, g] = A("bottom"), f = Ke((x) => {
    x.preventDefault(), x.stopPropagation();
  }), { currentFolder: b, currentPathFiles: T, setCurrentPathFiles: C } = ye(), { activeLayout: R } = ct(), N = pe(), k = (x) => {
    s(x.target.value), a(!1);
  }, $ = (x) => {
    if (x.stopPropagation(), x.key === "Enter") {
      x.preventDefault(), E();
      return;
    }
    if (x.key === "Escape") {
      x.preventDefault(), o.close(), C((v) => v.filter((y) => y.key !== e.key));
      return;
    }
    /[\\/:*?"<>|]/.test(x.key) ? (x.preventDefault(), d(N("invalidFileName")), a(!0)) : (a(!1), d(""));
  };
  Q(() => {
    if (r) {
      const x = setTimeout(() => {
        a(!1), d("");
      }, 7e3);
      return () => clearTimeout(x);
    }
  }, [r]);
  function E() {
    let x = i.trim();
    const h = T.filter((y) => !(y.key && y.key === e.key));
    if (h.find((y) => y.name.toLowerCase() === x.toLowerCase())) {
      d(N("folderExists", { renameFile: x })), a(!0), f.ref.current?.focus(), f.ref.current?.select(), f.setIsClicked(!1);
      return;
    }
    x === "" && (x = Bn("New Folder", !0, h)), Ee(n, "onCreateFolder", x, b), C((y) => y.filter((O) => O.key !== e.key)), o.close();
  }
  return Q(() => {
    if (f.ref.current?.focus(), f.ref.current?.select(), f.ref?.current) {
      const y = t.current.getBoundingClientRect(), O = f.ref.current, I = O.getBoundingClientRect();
      y.right - I.left > 313 ? p("right") : p("left"), y.bottom - (I.top + O.clientHeight) > 88 ? g("bottom") : g("top");
    }
  }, []), Q(() => {
    f.isClicked && E();
  }, [f.isClicked]), /* @__PURE__ */ F(ue, { children: [
    /* @__PURE__ */ c(
      _n,
      {
        id: "newFolder",
        nameInputRef: f.ref,
        maxLength: XS,
        value: i,
        onChange: k,
        onKeyDown: $,
        onClick: (x) => x.stopPropagation(),
        ...R === "list" && { rows: 1 }
      }
    ),
    r && /* @__PURE__ */ c(
      Kn,
      {
        message: l,
        xPlacement: u,
        yPlacement: m
      }
    )
  ] });
}, ze = ({ onClick: t, onKeyDown: e, type: n = "primary", padding: o = "0.4rem 0.8rem", children: i }) => /* @__PURE__ */ c(
  "button",
  {
    onClick: t,
    onKeyDown: e,
    className: `fm-button fm-button-${n}`,
    style: { padding: o },
    children: i
  }
), qn = ({
  children: t,
  show: e,
  setShow: n,
  heading: o,
  dialogWidth: i = "25%",
  contentClassName: s = "",
  closeButton: r = !0
}) => {
  const a = re(null), l = pe(), d = (u) => {
    u.key === "Escape" && n(!1);
  };
  return Q(() => {
    e ? a.current.showModal() : a.current.close();
  }, [e]), /* @__PURE__ */ F(
    "dialog",
    {
      ref: a,
      className: "fm-modal dialog",
      style: { width: i },
      onKeyDown: d,
      children: [
        /* @__PURE__ */ F("div", { className: "fm-modal-header", children: [
          /* @__PURE__ */ c("span", { className: "fm-modal-heading", children: o }),
          r && /* @__PURE__ */ c(
            Qe,
            {
              size: 14,
              onClick: () => n(!1),
              className: "close-icon",
              title: l("close")
            }
          )
        ] }),
        t
      ]
    }
  );
}, Oe = (t) => t.split(".").pop(), QS = 220, eF = ({ filesViewRef: t, file: e, onRename: n, triggerAction: o }) => {
  const [i, s] = A(e?.name), [r, a] = A(!1), [l, d] = A(!1), [u, p] = A(""), [m, g] = A("right"), [f, b] = A("bottom"), { currentPathFiles: T, setCurrentPathFiles: C } = ye(), { activeLayout: R } = ct(), N = pe(), k = re(null), $ = Ke((v) => {
    k.current?.contains(v.target) || (v.preventDefault(), v.stopPropagation());
  }), E = (v) => {
    if (v.stopPropagation(), v.key === "Enter") {
      v.preventDefault(), $.setIsClicked(!0);
      return;
    }
    if (v.key === "Escape") {
      v.preventDefault(), C(
        (O) => O.map((I) => (I.key === e.key && (I.isEditing = !1), I))
      ), o.close();
      return;
    }
    /[\\/:*?"<>|]/.test(v.key) ? (v.preventDefault(), p(N("invalidFileName")), d(!0)) : d(!1);
  };
  Q(() => {
    if (l) {
      const v = setTimeout(() => {
        d(!1), p("");
      }, 7e3);
      return () => clearTimeout(v);
    }
  }, [l]);
  function x(v) {
    if (i === "" || i === e.name) {
      C(
        (y) => y.map((O) => (O.key === e.key && (O.isEditing = !1), O))
      ), o.close();
      return;
    } else if (T.some((y) => y.name === i)) {
      d(!0), p(N("folderExists", { renameFile: i })), $.setIsClicked(!1);
      return;
    } else if (!e.isDirectory && !v) {
      const y = Oe(e.name), O = Oe(i);
      if (y !== O) {
        a(!0);
        return;
      }
    }
    d(!1), Ee(n, "onRename", e, i), C((y) => y.filter((O) => O.key !== e.key)), o.close();
  }
  const h = () => {
    if ($.ref?.current?.focus(), e.isDirectory)
      $.ref?.current?.select();
    else {
      const v = Oe(e.name), y = e.name.length - v.length - 1;
      $.ref?.current?.setSelectionRange(0, y);
    }
  };
  return Q(() => {
    if (h(), $.ref?.current) {
      const I = t.current.getBoundingClientRect(), _ = $.ref.current, H = _.getBoundingClientRect();
      I.right - H.left > 313 ? g("right") : g("left"), I.bottom - (H.top + _.clientHeight) > 88 ? b("bottom") : b("top");
    }
  }, []), Q(() => {
    $.isClicked && x(!1), h();
  }, [$.isClicked]), /* @__PURE__ */ F(ue, { children: [
    /* @__PURE__ */ c(
      _n,
      {
        id: e.name,
        nameInputRef: $.ref,
        maxLength: QS,
        value: i,
        onChange: (v) => {
          s(v.target.value), d(!1);
        },
        onKeyDown: E,
        onClick: (v) => v.stopPropagation(),
        ...R === "list" && { rows: 1 }
      }
    ),
    l && /* @__PURE__ */ c(
      Kn,
      {
        message: u,
        xPlacement: m,
        yPlacement: f
      }
    ),
    /* @__PURE__ */ c(
      qn,
      {
        heading: N("rename"),
        show: r,
        setShow: a,
        dialogWidth: "25vw",
        closeButton: !1,
        children: /* @__PURE__ */ F("div", { className: "fm-rename-folder-container", ref: k, children: [
          /* @__PURE__ */ c("div", { className: "fm-rename-folder-input", children: /* @__PURE__ */ F("div", { className: "fm-rename-warning", children: [
            /* @__PURE__ */ c(No, { size: 14, color: "orange" }),
            /* @__PURE__ */ c("div", { children: N("fileNameChangeWarning") })
          ] }) }),
          /* @__PURE__ */ F("div", { className: "fm-rename-folder-action", children: [
            /* @__PURE__ */ c(
              ze,
              {
                type: "secondary",
                onClick: () => {
                  C(
                    (v) => v.map((y) => (y.key === e.key && (y.isEditing = !1), y))
                  ), a(!1), o.close();
                },
                children: N("no")
              }
            ),
            /* @__PURE__ */ c(
              ze,
              {
                type: "danger",
                onClick: () => {
                  a(!1), x(!0);
                },
                children: N("yes")
              }
            )
          ] })
        ] })
      }
    )
  ] });
}, dt = (t, e = 2) => {
  if (isNaN(t)) return "";
  const n = t / 1024, o = n / 1024, i = o / 1024;
  if (n < 1024)
    return `${n.toFixed(e)} KB`;
  if (o < 1024)
    return `${o.toFixed(e)} MB`;
  if (o >= 1024)
    return `${i.toFixed(e)} GB`;
}, Jn = ({ name: t, id: e, checked: n, onClick: o, onChange: i, className: s = "", title: r, disabled: a = !1 }) => /* @__PURE__ */ c(
  "input",
  {
    className: `fm-checkbox ${s}`,
    type: "checkbox",
    name: t,
    id: e,
    checked: n,
    onClick: o,
    onChange: i,
    title: r,
    disabled: a
  }
), St = 14, tF = (t) => t == null ? "" : Array.isArray(t) ? t.filter(Boolean).join(", ") : String(t), nF = (t) => Array.isArray(t) && t.length > 0 && t.every((e) => e && typeof e == "object" && typeof e.primary == "string");
function oF({ items: t, anchorRef: e, onClose: n, fontFamily: o }) {
  const i = re(null);
  Q(() => {
    const a = (d) => {
      i.current && !i.current.contains(d.target) && e?.current && !e.current.contains(d.target) && n();
    }, l = (d) => {
      d.key === "Escape" && n();
    };
    return document.addEventListener("mousedown", a), document.addEventListener("keydown", l), () => {
      document.removeEventListener("mousedown", a), document.removeEventListener("keydown", l);
    };
  }, [n, e]);
  const s = e?.current?.getBoundingClientRect(), r = s ? {
    position: "fixed",
    top: s.bottom + 6,
    left: Math.min(s.left, window.innerWidth - 360),
    zIndex: 1e4,
    ...o ? { fontFamily: o } : {}
  } : o ? { fontFamily: o } : {};
  return /* @__PURE__ */ F(ue, { children: [
    /* @__PURE__ */ c("div", { className: "fm-services-popover-backdrop", "aria-hidden": !0, onClick: n }),
    /* @__PURE__ */ F("div", { ref: i, className: "fm-services-popover", style: r, children: [
      /* @__PURE__ */ c("div", { className: "fm-services-popover-title", children: "This file is used in the following services" }),
      /* @__PURE__ */ c("ul", { className: "fm-services-popover-list", children: t.map((a, l) => /* @__PURE__ */ F("li", { className: "fm-services-popover-item", children: [
        /* @__PURE__ */ F("div", { className: "fm-services-popover-item-content", children: [
          /* @__PURE__ */ c("span", { className: "fm-services-popover-item-primary", children: a.primary }),
          a.secondary && /* @__PURE__ */ c("span", { className: "fm-services-popover-item-secondary", children: a.secondary })
        ] }),
        a.url && /* @__PURE__ */ c(
          "a",
          {
            href: a.url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "fm-services-popover-item-link",
            "aria-label": "Open service",
            onClick: (d) => d.stopPropagation(),
            children: /* @__PURE__ */ c(go, { size: 14 })
          }
        )
      ] }, l)) })
    ] })
  ] });
}
const iF = ({
  index: t,
  file: e,
  onCreateFolder: n,
  onRename: o,
  enableFilePreview: i,
  onFileOpen: s,
  filesViewRef: r,
  selectedFileIndexes: a,
  triggerAction: l,
  handleContextMenu: d,
  setLastSelectedFile: u,
  draggable: p,
  formatDate: m,
  listColumns: g = [
    { id: "name", label: "name" },
    { id: "modified", label: "modified" },
    { id: "size", label: "size" }
  ],
  fontFamily: f
}) => {
  const [b, T] = A(!1), [C, R] = A(0), [N, k] = A("hidden"), [$, E] = A(""), [x, h] = A(null), [v, y] = A(!1), O = re(null), { activeLayout: I } = ct(), _ = 14, H = st(_), { setCurrentPath: W, currentPathFiles: Z, onFolderChange: M } = ye(), { setSelectedFiles: oe } = xe(), { clipBoard: ce, handleCutCopy: w, setClipBoard: S, handlePasting: U } = at(), D = re(null), V = st(St), X = ce?.isMoving && ce.files.find((z) => z.name === e.name && z.path === e.path), K = e.disabled === !0, q = e.isSuperseded === !0 || e.rawSharePointFile?.status === "Superseded", j = e.isArchived === !0 || e.rawSharePointFile?.status === "Archived", Y = () => {
    s(e), e.isDirectory ? (W(e.path), M?.(e.path), oe([])) : i && l.show("previewFile");
  }, G = (z, se) => {
    if (a.length > 0 && z) {
      let me = !1, de = a[0], he = t;
      if (de >= he) {
        const Le = de;
        de = he, he = Le, me = !0;
      }
      const Te = Z.slice(de, he + 1);
      oe(me ? Te.reverse() : Te);
    } else a.length > 0 && se ? oe((me) => {
      const de = me.filter((he) => he.path !== e.path);
      return me.length === de.length ? [...me, e] : de;
    }) : oe([e]);
  }, ae = (z) => {
    if (z.stopPropagation(), e.isEditing) return;
    G(z.shiftKey, z.ctrlKey);
    const se = (/* @__PURE__ */ new Date()).getTime();
    if (se - C < 300) {
      Y();
      return;
    }
    R(se);
  }, P = (z) => {
    z.key === "Enter" && (z.stopPropagation(), oe([e]), Y());
  }, fe = (z) => {
    z.stopPropagation(), z.preventDefault(), !e.isEditing && (b || oe([e]), u(e), d(z, !0));
  }, Ce = () => {
    k("visible");
  }, $e = () => {
    !b && k("hidden");
  }, Ye = (z) => {
    z.target.checked ? oe((se) => [...se, e]) : oe((se) => se.filter((me) => me.name !== e.name && me.path !== e.path)), T(z.target.checked);
  }, je = (z) => {
    z.dataTransfer.setDragImage(D.current, 30, 50), z.dataTransfer.effectAllowed = "copy", w(!0);
  }, ut = () => {
    S(null), h(null);
  }, Pe = (z) => {
    z.preventDefault(), b || !e.isDirectory ? z.dataTransfer.dropEffect = "none" : (h({ x: z.clientX, y: z.clientY + 12 }), z.dataTransfer.dropEffect = "copy", E("file-drop-zone"));
  }, pt = (z) => {
    z.currentTarget.contains(z.relatedTarget) || (E((se) => se && ""), h(null));
  }, Ue = (z) => {
    z.preventDefault(), !(b || !e.isDirectory) && (U(e), E((se) => se && ""), h(null));
  };
  return Q(() => {
    T(a.includes(t)), k(a.includes(t) ? "visible" : "hidden");
  }, [a]), Q(() => {
    ce || h(null);
  }, [ce]), Q(() => {
    h(null);
  }, [e.path]), /* @__PURE__ */ F(
    "div",
    {
      className: `file-item-container ${$} ${b || e.isEditing ? "file-selected" : ""} ${X ? "file-moving" : ""} ${K ? "file-disabled" : ""} ${q ? "file-superseded" : ""} ${j ? "file-archived" : ""}`,
      tabIndex: 0,
      title: e.name,
      "data-file-id": e.id,
      onClick: ae,
      onKeyDown: P,
      onContextMenu: fe,
      onMouseOver: Ce,
      onMouseLeave: $e,
      draggable: b && p,
      onDragStart: je,
      onDragEnd: ut,
      onDragEnter: Pe,
      onDragOver: Pe,
      onDragLeave: pt,
      onDrop: Ue,
      children: [
        /* @__PURE__ */ F("div", { className: "file-item", children: [
          !e.isEditing && /* @__PURE__ */ c(
            Jn,
            {
              name: e.name,
              id: e.name,
              checked: b,
              className: `selection-checkbox ${N}`,
              onChange: Ye,
              onClick: (z) => z.stopPropagation()
            }
          ),
          e.isDirectory ? /* @__PURE__ */ c(it, { size: _, color: "#FFB547" }) : /* @__PURE__ */ c(ue, { children: H[e.name?.split(".").pop()?.toLowerCase()] ?? /* @__PURE__ */ c(ie, { size: _, color: "#718096" }) }),
          e.isEditing ? /* @__PURE__ */ c("div", { className: `rename-file-container ${I}`, children: l.actionType === "createFolder" ? /* @__PURE__ */ c(
            ZS,
            {
              filesViewRef: r,
              file: e,
              onCreateFolder: n,
              triggerAction: l
            }
          ) : /* @__PURE__ */ c(
            eF,
            {
              filesViewRef: r,
              file: e,
              onRename: o,
              triggerAction: l
            }
          ) }) : /* @__PURE__ */ c(
            "span",
            {
              className: `text-truncate file-name ${q ? "file-name-superseded" : ""} ${j ? "file-name-archived" : ""}`,
              children: e.name
            }
          )
        ] }),
        I === "list" && g.filter((z) => z.id !== "name").map((z) => {
          if (z.id === "modified")
            return /* @__PURE__ */ c("div", { className: "modified-date", children: m(e.updatedAt) }, z.id);
          if (z.id === "size")
            return /* @__PURE__ */ c("div", { className: "size", children: e?.size > 0 ? dt(e?.size) : "" }, z.id);
          const se = z.fileKey ? e[z.fileKey] : "", me = Array.isArray(se) && se.length > 0 && se.every((de) => typeof de == "string");
          if (nF(se)) {
            const de = se, he = z.id === "services" ? O : null, Te = z.id === "services" && v, Le = (Se) => {
              z.id === "services" && (Se.stopPropagation(), Se.preventDefault(), y((ft) => !ft));
            };
            return /* @__PURE__ */ F(
              "div",
              {
                ref: he,
                role: z.id === "services" ? "button" : void 0,
                tabIndex: z.id === "services" ? 0 : void 0,
                className: `file-custom file-col-${z.id} ${z.id === "services" ? "file-services-trigger" : ""}`,
                onClick: z.id === "services" ? Le : void 0,
                onKeyDown: z.id === "services" ? (Se) => {
                  (Se.key === "Enter" || Se.key === " ") && Le(Se);
                } : void 0,
                children: [
                  z.id === "services" ? /* @__PURE__ */ c("span", { className: "file-services-badge", children: de.length }) : de.length,
                  z.id === "services" && Te && oo(
                    /* @__PURE__ */ c(
                      oF,
                      {
                        items: de,
                        anchorRef: he,
                        onClose: () => y(!1),
                        fontFamily: f
                      }
                    ),
                    document.body
                  )
                ]
              },
              z.id
            );
          }
          if (me) {
            const de = se.filter(Boolean), he = de.join(`
`);
            return /* @__PURE__ */ c(
              "div",
              {
                className: `file-custom file-col-${z.id}`,
                title: he,
                children: de.length
              },
              z.id
            );
          }
          return /* @__PURE__ */ c("div", { className: `file-custom file-col-${z.id}`, children: tF(se) }, z.id);
        }),
        x && /* @__PURE__ */ F(
          "div",
          {
            style: {
              top: `${x.y}px`,
              left: `${x.x}px`
            },
            className: "drag-move-tooltip",
            children: [
              "Move to ",
              /* @__PURE__ */ c("span", { className: "drop-zone-file-name", children: e.name })
            ]
          }
        ),
        /* @__PURE__ */ c("div", { ref: D, className: "drag-icon", children: e.isDirectory ? /* @__PURE__ */ c(it, { size: St, color: "#FFB547" }) : /* @__PURE__ */ c(ue, { children: V[e.name?.split(".").pop()?.toLowerCase()] ?? /* @__PURE__ */ c(ie, { size: St, color: "#718096" }) }) })
      ]
    }
  );
}, sF = ({ subMenuRef: t, list: e, position: n = "right" }) => /* @__PURE__ */ c("ul", { ref: t, className: `sub-menu ${n}`, children: e?.map((o) => /* @__PURE__ */ F("li", { onClick: o.onClick, children: [
  /* @__PURE__ */ c("span", { className: "item-selected", children: o.selected && /* @__PURE__ */ c(fo, { size: 14 }) }),
  o.icon,
  /* @__PURE__ */ c("span", { children: o.title })
] }, o.title)) }), rF = ({ filesViewRef: t, contextMenuRef: e, menuItems: n, visible: o, clickPosition: i }) => {
  const [s, r] = A(0), [a, l] = A(0), [d, u] = A(null), [p, m] = A("right"), g = re(null), f = () => {
    const { clickX: C, clickY: R } = i, N = t.current, k = N.getBoundingClientRect(), $ = N.offsetWidth - N.clientWidth, E = e.current.getBoundingClientRect(), x = E.width, h = E.height, v = C - k.left, y = k.width - (v + $) > x, O = !y, I = R - k.top, _ = k.height - I > h, H = !_;
    y ? (r(`${v}px`), m("right")) : O && (r(`${v - x}px`), m("left")), _ ? l(`${I + N.scrollTop}px`) : H && l(`${I + N.scrollTop - h}px`);
  }, b = (C) => {
    C.preventDefault(), C.stopPropagation();
  }, T = (C) => {
    u(C);
  };
  if (Q(() => {
    o && e.current ? f() : (l(0), r(0), u(null));
  }, [o]), o)
    return /* @__PURE__ */ c(
      "div",
      {
        ref: e,
        onContextMenu: b,
        onClick: (C) => C.stopPropagation(),
        className: `fm-context-menu ${a ? "visible" : "hidden"}`,
        style: {
          top: a,
          left: s
        },
        children: /* @__PURE__ */ c("div", { className: "file-context-menu-list", children: /* @__PURE__ */ c("ul", { children: n.filter((C) => !C.hidden).map((C, R) => {
          const N = C.hasOwnProperty("children"), k = d === R && N;
          return /* @__PURE__ */ c("div", { children: /* @__PURE__ */ F(
            "li",
            {
              onClick: C.onClick,
              className: `${C.className ?? ""} ${k ? "active" : ""}`,
              onMouseOver: () => T(R),
              children: [
                C.icon,
                /* @__PURE__ */ c("span", { children: C.title }),
                N && /* @__PURE__ */ F(ue, { children: [
                  /* @__PURE__ */ c(Tt, { size: 14, className: "list-expand-icon" }),
                  k && /* @__PURE__ */ c(
                    sF,
                    {
                      subMenuRef: g,
                      list: C.children,
                      position: p
                    }
                  )
                ] })
              ]
            }
          ) }, C.title);
        }) }) })
      }
    );
}, aF = (t, e, n, o, i) => {
  const [s, r] = A([]), [a, l] = A(!1), [d, u] = A(!1), [p, m] = A({ clickX: 0, clickY: 0 }), [g, f] = A(null), { clipBoard: b, setClipBoard: T, handleCutCopy: C, handlePasting: R } = at(), { selectedFiles: N, setSelectedFiles: k, handleDownload: $ } = xe(), { currentPath: E, setCurrentPath: x, currentPathFiles: h, setCurrentPathFiles: v, onFolderChange: y } = ye(), O = pe(), I = () => {
    i(g), g.isDirectory ? (x(g.path), y?.(g.path), r([]), k([])) : e && n.show("previewFile"), l(!1);
  }, _ = (j) => {
    C(j), l(!1);
  }, H = () => {
    R(g), l(!1);
  }, W = () => {
    l(!1), n.show("rename");
  }, Z = () => {
    $(), l(!1);
  }, M = () => {
    l(!1), n.show("delete");
  }, oe = () => {
    l(!1), Ee(t, "onRefresh"), T(null);
  }, ce = () => {
    n.show("createFolder"), l(!1);
  }, w = () => {
    l(!1), n.show("uploadFile");
  }, S = () => {
    k(h), l(!1);
  }, U = [
    {
      title: O("refresh"),
      icon: /* @__PURE__ */ c(At, { size: 14 }),
      onClick: oe
    },
    {
      title: O("newFolder"),
      icon: /* @__PURE__ */ c(Nn, { size: 14 }),
      onClick: ce,
      hidden: !o.create
    },
    {
      title: O("upload"),
      icon: /* @__PURE__ */ c(Pn, { size: 14 }),
      onClick: w,
      hidden: !o.upload
    },
    {
      title: O("selectAll"),
      icon: /* @__PURE__ */ c(Fo, { size: 14 }),
      onClick: S
    }
  ], D = [
    {
      title: g?.isDirectory ? "Open Folder" : O("open"),
      icon: g?.isDirectory ? /* @__PURE__ */ c(wo, { size: 14 }) : /* @__PURE__ */ c(yo, { size: 14 }),
      onClick: I
    },
    {
      title: O("cut"),
      icon: /* @__PURE__ */ c(En, { size: 14 }),
      onClick: () => _(!0),
      hidden: !o.move
    },
    {
      title: O("copy"),
      icon: /* @__PURE__ */ c(Sn, { size: 14 }),
      onClick: () => _(!1),
      hidden: !o.copy
    },
    {
      title: O("paste"),
      icon: /* @__PURE__ */ c(kt, { size: 14 }),
      onClick: H,
      className: `${b ? "" : "disable-paste"}`,
      hidden: !g?.isDirectory || !o.move && !o.copy
    },
    {
      title: O("rename"),
      icon: /* @__PURE__ */ c(kn, { size: 14 }),
      onClick: W,
      hidden: N.length > 1 || !o.rename
    },
    {
      title: O("download"),
      icon: /* @__PURE__ */ c(Lt, { size: 14 }),
      onClick: Z,
      hidden: !o.download
    },
    {
      title: O("delete"),
      icon: /* @__PURE__ */ c(Nt, { size: 14 }),
      onClick: M,
      hidden: !o.delete,
      className: "fm-context-menu-danger"
    }
  ], V = () => {
    v((j) => [
      ...j,
      {
        name: Bn("New Folder", !0, j),
        isDirectory: !0,
        path: E,
        isEditing: !0,
        key: (/* @__PURE__ */ new Date()).valueOf()
      }
    ]);
  }, X = () => {
    v((j) => {
      const Y = s.at(-1);
      return j[Y] ? j.map((G, ae) => ae === Y ? {
        ...G,
        isEditing: !0
      } : G) : (n.close(), j);
    }), r([]), k([]);
  }, K = () => {
    r([]), k((j) => j.length > 0 ? [] : j);
  }, q = (j, Y = !1) => {
    j.preventDefault(), m({ clickX: j.clientX, clickY: j.clientY }), u(Y), !Y && K(), l(!0);
  };
  return Q(() => {
    if (n.isActive)
      switch (n.actionType) {
        case "createFolder":
          V();
          break;
        case "rename":
          X();
          break;
      }
  }, [n.isActive]), Q(() => {
    r([]), k([]);
  }, [E]), Q(() => {
    N.length > 0 ? r(() => N.map((j) => h.findIndex((Y) => Y.path === j.path))) : r([]);
  }, [N, h]), {
    emptySelecCtxItems: U,
    selecCtxItems: D,
    handleContextMenu: q,
    unselectFiles: K,
    visible: a,
    setVisible: l,
    setLastSelectedFile: f,
    selectedFileIndexes: s,
    clickPosition: p,
    isSelectionCtx: d
  };
}, gn = ["name", "modified", "size"], lF = (t) => t === "name" ? "file-name" : t === "modified" ? "file-date" : t === "size" ? "file-size" : `file-custom file-col-${t}`, cF = ({ unselectFiles: t, onSort: e, sortConfig: n, listColumns: o = [] }) => {
  const i = pe(), [s, r] = A(!1), { selectedFiles: a, setSelectedFiles: l } = xe(), { currentPathFiles: d } = ye(), u = Re(() => d.length > 0 && a.length === d.length, [a, d]), p = (f) => {
    f.target.checked ? (l(d), r(!0)) : t();
  }, m = (f) => {
    e && e(f);
  }, g = o.length > 0 ? o : [
    { id: "name", label: "name" },
    { id: "modified", label: "modified" },
    { id: "size", label: "size" }
  ];
  return /* @__PURE__ */ F(
    "div",
    {
      className: "files-header",
      onMouseOver: () => r(!0),
      onMouseLeave: () => r(!1),
      children: [
        /* @__PURE__ */ c("div", { className: "file-select-all", children: (s || u) && /* @__PURE__ */ c(
          Jn,
          {
            id: "selectAll",
            checked: u,
            onChange: p,
            title: "Select all",
            disabled: d.length === 0
          }
        ) }),
        g.map((f) => {
          const b = gn.includes(f.id) && f.sortable !== !1, T = n?.key === f.id, C = gn.includes(f.id) ? i(f.id) : f.label;
          return /* @__PURE__ */ F(
            "div",
            {
              className: `${lF(f.id)} ${T ? "active" : ""}`,
              onClick: b ? () => m(f.id) : void 0,
              role: b ? "button" : void 0,
              children: [
                C,
                b && T && /* @__PURE__ */ c("span", { className: "sort-indicator", children: n.direction === "asc" ? " ▲" : " ▼" })
              ]
            },
            f.id
          );
        })
      ]
    }
  );
}, Gn = ({
  onCreateFolder: t,
  onRename: e,
  onFileOpen: n,
  onRefresh: o,
  enableFilePreview: i,
  triggerAction: s,
  permissions: r,
  formatDate: a,
  listColumns: l = [
    { id: "name", label: "name" },
    { id: "modified", label: "modified" },
    { id: "size", label: "size" }
  ],
  fontFamily: d,
  searchTerm: u = ""
}) => {
  const { currentPathFiles: p, sortConfig: m, setSortConfig: g } = ye(), f = re(null), { activeLayout: b } = ct(), T = pe(), C = Re(() => {
    if (!u || !u.trim()) return p || [];
    const H = u.trim().toLowerCase();
    return (p || []).filter(
      (W) => W.name && W.name.toLowerCase().includes(H)
    );
  }, [p, u]), {
    emptySelecCtxItems: R,
    selecCtxItems: N,
    handleContextMenu: k,
    unselectFiles: $,
    visible: E,
    setVisible: x,
    setLastSelectedFile: h,
    selectedFileIndexes: v,
    clickPosition: y,
    isSelectionCtx: O
  } = aF(o, i, s, r, n), I = Ke(() => x(!1)), _ = (H) => {
    let W = "asc";
    m.key === H && m.direction === "asc" && (W = "desc"), g({ key: H, direction: W });
  };
  return /* @__PURE__ */ F(
    "div",
    {
      ref: f,
      className: `files ${b}`,
      onContextMenu: k,
      onClick: $,
      children: [
        b === "list" && /* @__PURE__ */ c(
          cF,
          {
            unselectFiles: $,
            onSort: _,
            sortConfig: m,
            listColumns: l
          }
        ),
        C?.length > 0 ? /* @__PURE__ */ c(ue, { children: C.map((H, W) => /* @__PURE__ */ c(
          iF,
          {
            index: W,
            file: H,
            onCreateFolder: t,
            onRename: e,
            onFileOpen: n,
            enableFilePreview: i,
            triggerAction: s,
            filesViewRef: f,
            selectedFileIndexes: v,
            handleContextMenu: k,
            setVisible: x,
            setLastSelectedFile: h,
            draggable: r.move,
            formatDate: a,
            listColumns: l,
            fontFamily: d
          },
          W
        )) }) : /* @__PURE__ */ c("div", { className: "empty-folder", children: u?.trim() ? T("searchNoResults") || "No matching files in this folder" : T("folderEmpty") }),
        /* @__PURE__ */ c(
          rF,
          {
            filesViewRef: f,
            contextMenuRef: I.ref,
            menuItems: O ? N : R,
            visible: E,
            setVisible: x,
            clickPosition: y
          }
        )
      ]
    }
  );
};
Gn.displayName = "FileList";
const dF = ({ triggerAction: t, onDelete: e }) => {
  const [n, o] = A(""), { selectedFiles: i, setSelectedFiles: s } = xe(), r = pe();
  Q(() => {
    o(() => {
      if (i.length === 1)
        return r("deleteItemConfirm", { fileName: i[0].name });
      if (i.length > 1)
        return r("deleteItemsConfirm", { count: i.length });
    });
  }, [r]);
  const a = () => {
    e(i), s([]), t.close();
  };
  return /* @__PURE__ */ F("div", { className: "file-delete-confirm", children: [
    /* @__PURE__ */ c("p", { className: "file-delete-confirm-text", children: n }),
    /* @__PURE__ */ F("div", { className: "file-delete-confirm-actions", children: [
      /* @__PURE__ */ c(ze, { type: "secondary", onClick: () => t.close(), children: r("cancel") }),
      /* @__PURE__ */ c(ze, { type: "danger", onClick: a, children: r("delete") })
    ] })
  ] });
}, uF = ({ percent: t = 0, isCanceled: e = !1, isCompleted: n = !1, error: o }) => {
  const i = pe();
  return /* @__PURE__ */ F("div", { role: "progressbar", className: "fm-progress", children: [
    !o && /* @__PURE__ */ c("div", { className: "fm-progress-bar", children: /* @__PURE__ */ c("div", { className: "fm-progress-bar-fill", style: { width: `${t}%` } }) }),
    e ? /* @__PURE__ */ c("span", { className: "fm-upload-canceled", children: i("canceled") }) : o ? /* @__PURE__ */ c("span", { className: "fm-upload-canceled", children: o }) : /* @__PURE__ */ c("div", { className: "fm-progress-status", children: /* @__PURE__ */ c("span", { children: n ? i("completed") : i("percentDone", { percent: t }) }) })
  ] });
}, pF = ({
  index: t,
  fileData: e,
  setFiles: n,
  setIsUploading: o,
  fileUploadConfig: i,
  onFileUploaded: s,
  handleFileRemove: r
}) => {
  const [a, l] = A(0), [d, u] = A(!1), [p, m] = A(!1), [g, f] = A(!1), b = st(33), T = re(), { onError: C } = rt(), R = pe(), N = (x) => {
    l(0), o((v) => ({
      ...v,
      [t]: !1
    }));
    const h = {
      type: "upload",
      message: R("uploadFail"),
      response: {
        status: x.status,
        statusText: x.statusText,
        data: x.response
      }
    };
    n(
      (v) => v.map((y, O) => t === O ? {
        ...y,
        error: h.message
      } : y)
    ), f(!0), C(h, e.file);
  }, k = (x) => {
    if (!x.error)
      return new Promise((h, v) => {
        const y = new XMLHttpRequest();
        T.current = y, o((W) => ({
          ...W,
          [t]: !0
        })), y.upload.onprogress = (W) => {
          if (W.lengthComputable) {
            const Z = Math.round(W.loaded / W.total * 100);
            l(Z);
          }
        }, y.onload = () => {
          o((W) => ({
            ...W,
            [t]: !1
          })), y.status === 200 || y.status === 201 ? (u(!0), s(y.response), h(y.response)) : (v(y.statusText), N(y));
        }, y.onerror = () => {
          v(y.statusText), N(y);
        };
        const O = i?.method || "POST";
        y.open(O, i?.url, !0), y.withCredentials = i?.withCredentials || !1;
        const I = i?.headers;
        for (let W in I)
          y.setRequestHeader(W, I[W]);
        const _ = new FormData(), H = x?.appendData;
        for (let W in H)
          H[W] && _.append(W, H[W]);
        _.append("file", x.file), y.send(_);
      });
  };
  Q(() => {
    T.current || k(e);
  }, []);
  const $ = () => {
    T.current && (T.current.abort(), o((x) => ({
      ...x,
      [t]: !1
    })), m(!0), l(0));
  }, E = () => {
    e?.file && (n(
      (x) => x.map((h, v) => t === v ? {
        ...h,
        error: !1
      } : h)
    ), k({ ...e, error: !1 }), m(!1), f(!1));
  };
  return e.removed ? null : /* @__PURE__ */ F("li", { children: [
    /* @__PURE__ */ c("div", { className: "file-icon", children: b[Oe(e.file?.name)] ?? /* @__PURE__ */ c(ie, { size: 14, color: "#718096" }) }),
    /* @__PURE__ */ F("div", { className: "file", children: [
      /* @__PURE__ */ F("div", { className: "file-details", children: [
        /* @__PURE__ */ F("div", { className: "file-info", children: [
          /* @__PURE__ */ c("span", { className: "file-name text-truncate", title: e.file?.name, children: e.file?.name }),
          /* @__PURE__ */ c("span", { className: "file-size", children: dt(e.file?.size) })
        ] }),
        d ? /* @__PURE__ */ c(ho, { title: R("uploaded"), className: "upload-success" }) : p || g ? /* @__PURE__ */ c(At, { className: "retry-upload", title: "Retry", onClick: E }) : /* @__PURE__ */ c(
          "div",
          {
            className: "rm-file",
            title: `${e.error ? R("Remove") : R("abortUpload")}`,
            onClick: e.error ? () => r(t) : $,
            children: /* @__PURE__ */ c(Qe, {})
          }
        )
      ] }),
      /* @__PURE__ */ c(
        uF,
        {
          percent: a,
          isCanceled: p,
          isCompleted: d,
          error: e.error
        }
      )
    ] })
  ] });
}, fF = ({
  fileUploadConfig: t,
  maxFileSize: e,
  acceptedFileTypes: n,
  onFileUploading: o,
  onFileUploaded: i
}) => {
  const [s, r] = A([]), [a, l] = A(!1), [d, u] = A({}), { currentFolder: p, currentPathFiles: m } = ye(), { onError: g } = rt(), f = re(null), b = pe(), T = (E) => {
    E.key === "Enter" && f.current.click();
  }, C = (E) => {
    if (n && !n.includes(Oe(E.name)))
      return b("fileTypeNotAllowed");
    if (m.some(
      (v) => v.name.toLowerCase() === E.name.toLowerCase() && !v.isDirectory
    )) return b("fileAlreadyExist");
    if (e && E.size > e) return `${b("maxUploadSize")} ${dt(e, 0)}.`;
  }, R = (E) => {
    if (E = E.filter(
      (x) => !s.some((h) => h.file.name.toLowerCase() === x.name.toLowerCase())
    ), E.length > 0) {
      const x = E.map((h) => {
        const v = o(h, p), y = C(h);
        return y && g({ type: "upload", message: y }, h), {
          file: h,
          appendData: v,
          ...y && { error: y }
        };
      });
      r((h) => [...h, ...x]);
    }
  }, N = (E) => {
    E.preventDefault(), l(!1);
    const x = Array.from(E.dataTransfer.files);
    R(x);
  }, k = (E) => {
    const x = Array.from(E.target.files);
    R(x);
  }, $ = (E) => {
    r((x) => {
      const h = x.map((v, y) => E === y ? {
        ...v,
        removed: !0
      } : v);
      return h.every((v) => !!v.removed) ? [] : h;
    });
  };
  return /* @__PURE__ */ F("div", { className: `fm-upload-file ${s.length > 0 ? "file-selcted" : ""}`, children: [
    /* @__PURE__ */ F("div", { className: "select-files", children: [
      /* @__PURE__ */ c(
        "div",
        {
          className: `draggable-file-input ${a ? "dragging" : ""}`,
          onDrop: N,
          onDragOver: (E) => E.preventDefault(),
          onDragEnter: () => l(!0),
          onDragLeave: () => l(!1),
          children: /* @__PURE__ */ F("div", { className: "input-text", children: [
            /* @__PURE__ */ c(mo, { size: 14 }),
            /* @__PURE__ */ c("span", { children: b("dragFileToUpload") })
          ] })
        }
      ),
      /* @__PURE__ */ c("div", { className: "btn-choose-file", children: /* @__PURE__ */ F(ze, { padding: "0", onKeyDown: T, children: [
        /* @__PURE__ */ c("label", { htmlFor: "chooseFile", children: b("chooseFile") }),
        /* @__PURE__ */ c(
          "input",
          {
            ref: f,
            type: "file",
            id: "chooseFile",
            className: "choose-file-input",
            onChange: k,
            multiple: !0,
            accept: n
          }
        )
      ] }) })
    ] }),
    s.length > 0 && /* @__PURE__ */ F("div", { className: "files-progress", children: [
      /* @__PURE__ */ c("div", { className: "heading", children: Object.values(d).some((E) => E) ? /* @__PURE__ */ F(ue, { children: [
        /* @__PURE__ */ c("h2", { children: b("uploading") }),
        /* @__PURE__ */ c(Ot, { loading: !0, className: "upload-loading" })
      ] }) : /* @__PURE__ */ c("h2", { children: b("completed") }) }),
      /* @__PURE__ */ c("ul", { children: s.map((E, x) => /* @__PURE__ */ c(
        pF,
        {
          index: x,
          fileData: E,
          setFiles: r,
          fileUploadConfig: t,
          setIsUploading: u,
          onFileUploaded: i,
          handleFileRemove: $
        },
        x
      )) })
    ] })
  ] });
}, vn = ["jpg", "jpeg", "png"], $n = ["mp4", "mov", "avi"], yn = ["mp3", "wav", "m4a"], wn = ["txt", "pdf"], hF = ({ filePreviewPath: t, filePreviewComponent: e }) => {
  const [n, o] = A(!0), [i, s] = A(!1), { selectedFiles: r, handleDownload: a } = xe(), l = st(14), d = Oe(r[0].name)?.toLowerCase(), u = `${t}${r[0].path}`, p = pe(), m = Re(
    () => e?.(r[0]),
    [e]
  ), g = () => {
    o(!1), s(!1);
  }, f = () => {
    o(!1), s(!0);
  }, b = () => {
    a();
  };
  return Ne.isValidElement(m) ? m : /* @__PURE__ */ F("section", { className: `file-previewer ${d === "pdf" ? "pdf-previewer" : ""}`, children: [
    i || ![
      ...vn,
      ...$n,
      ...yn,
      ...wn
    ].includes(d) && /* @__PURE__ */ F("div", { className: "preview-error", children: [
      /* @__PURE__ */ c("span", { className: "error-icon", children: l[d] ?? /* @__PURE__ */ c(ie, { size: 14, color: "#718096" }) }),
      /* @__PURE__ */ c("span", { className: "error-msg", children: p("previewUnavailable") }),
      /* @__PURE__ */ F("div", { className: "file-info", children: [
        /* @__PURE__ */ c("span", { className: "file-name", children: r[0].name }),
        r[0].size && /* @__PURE__ */ c("span", { children: "-" }),
        /* @__PURE__ */ c("span", { className: "file-size", children: dt(r[0].size) })
      ] }),
      /* @__PURE__ */ c(ze, { onClick: b, padding: "0.45rem .9rem", children: /* @__PURE__ */ F("div", { className: "download-btn", children: [
        /* @__PURE__ */ c(Lt, { size: 14 }),
        /* @__PURE__ */ c("span", { children: p("download") })
      ] }) })
    ] }),
    vn.includes(d) && /* @__PURE__ */ F(ue, { children: [
      /* @__PURE__ */ c(Ot, { isLoading: n }),
      /* @__PURE__ */ c(
        "img",
        {
          src: u,
          alt: "Preview Unavailable",
          className: `photo-popup-image ${n ? "img-loading" : ""}`,
          onLoad: g,
          onError: f,
          loading: "lazy"
        }
      )
    ] }),
    $n.includes(d) && /* @__PURE__ */ c("video", { src: u, className: "video-preview", controls: !0, autoPlay: !0 }),
    yn.includes(d) && /* @__PURE__ */ c("audio", { src: u, controls: !0, autoPlay: !0, className: "audio-preview" }),
    wn.includes(d) && /* @__PURE__ */ c(ue, { children: /* @__PURE__ */ c(
      "iframe",
      {
        src: u,
        onLoad: g,
        onError: f,
        frameBorder: "0",
        className: `photo-popup-iframe ${n ? "img-loading" : ""}`
      }
    ) })
  ] });
}, Ft = (t) => t.toLowerCase(), ge = (t, e, n = !1) => {
  const o = re(/* @__PURE__ */ new Set([])), i = Re(() => new Set(t.map((l) => Ft(l))), [t]), s = (l) => {
    if (!l.repeat && (o.current.add(Ft(l.key)), i.isSubsetOf(o.current) && !n)) {
      l.preventDefault(), e(l);
      return;
    }
  }, r = (l) => {
    o.current.delete(Ft(l.key));
  }, a = () => {
    o.current.clear();
  };
  Q(() => (window.addEventListener("keydown", s), window.addEventListener("keyup", r), window.addEventListener("blur", a), () => {
    window.removeEventListener("keydown", s), window.removeEventListener("keyup", r), window.removeEventListener("blur", a);
  }), [i, e, n]);
}, ve = {
  createFolder: ["Alt", "Shift", "N"],
  uploadFiles: ["Control", "U"],
  cut: ["Control", "X"],
  copy: ["Control", "C"],
  paste: ["Control", "V"],
  rename: ["F2"],
  download: ["Control", "D"],
  delete: ["Delete"],
  selectAll: ["Control", "A"],
  jumpToFirst: ["Home"],
  jumpToLast: ["End"],
  refresh: ["F5"],
  clearSelection: ["Escape"]
}, mF = (t, e, n) => {
  const { setClipBoard: o, handleCutCopy: i, handlePasting: s } = at(), { currentFolder: r, currentPathFiles: a } = ye(), { selectedFiles: l, setSelectedFiles: d, handleDownload: u } = xe(), p = () => {
    n.create && t.show("createFolder");
  }, m = () => {
    n.upload && t.show("uploadFile");
  }, g = () => {
    n.move && i(!0);
  }, f = () => {
    n.copy && i(!1);
  }, b = () => {
    s(r);
  }, T = () => {
    n.rename && t.show("rename");
  }, C = () => {
    n.download && u();
  }, R = () => {
    n.delete && l.length && t.show("delete");
  }, N = () => {
    a.length > 0 && d([a[0]]);
  }, k = () => {
    a.length > 0 && d([a.at(-1)]);
  }, $ = () => {
    d(a);
  }, E = () => {
    d((h) => h.length > 0 ? [] : h);
  }, x = () => {
    Ee(e, "onRefresh"), o(null);
  };
  ge(ve.createFolder, p, t.isActive), ge(ve.uploadFiles, m, t.isActive), ge(ve.cut, g, t.isActive), ge(ve.copy, f, t.isActive), ge(ve.paste, b, t.isActive), ge(ve.rename, T, t.isActive), ge(ve.download, C, t.isActive), ge(ve.delete, R, t.isActive), ge(ve.jumpToFirst, N, t.isActive), ge(ve.jumpToLast, k, t.isActive), ge(ve.selectAll, $, t.isActive), ge(ve.clearSelection, E, t.isActive), ge(ve.refresh, x, t.isActive);
}, gF = ({
  fileUploadConfig: t,
  onFileUploading: e,
  onFileUploaded: n,
  onDelete: o,
  onRefresh: i,
  maxFileSize: s,
  filePreviewPath: r,
  filePreviewComponent: a,
  acceptedFileTypes: l,
  triggerAction: d,
  permissions: u
}) => {
  const [p, m] = A(null), { selectedFiles: g } = xe(), f = pe();
  mF(d, i, u);
  const b = {
    uploadFile: {
      title: f("upload"),
      component: /* @__PURE__ */ c(
        fF,
        {
          fileUploadConfig: t,
          maxFileSize: s,
          acceptedFileTypes: l,
          onFileUploading: e,
          onFileUploaded: n
        }
      ),
      width: "35%"
    },
    delete: {
      title: f("delete"),
      component: /* @__PURE__ */ c(dF, { triggerAction: d, onDelete: o }),
      width: "25%"
    },
    previewFile: {
      title: f("preview"),
      component: /* @__PURE__ */ c(
        hF,
        {
          filePreviewPath: r,
          filePreviewComponent: a
        }
      ),
      width: "50%"
    }
  };
  if (Q(() => {
    if (d.isActive) {
      const T = d.actionType;
      T === "previewFile" && (b[T].title = g?.name ?? f("preview")), m(b[T]);
    } else
      m(null);
  }, [d.isActive]), p)
    return /* @__PURE__ */ c(
      qn,
      {
        heading: p.title,
        show: d.isActive,
        setShow: d.close,
        dialogWidth: p.width,
        children: p?.component
      }
    );
}, vF = () => {
  const [t, e] = A(!1), [n, o] = A(null);
  return {
    isActive: t,
    actionType: n,
    show: (r) => {
      e(!0), o(r);
    },
    close: () => {
      e(!1), o(null);
    }
  };
}, $F = (t, e) => {
  const [n, o] = A({ col1: t, col2: e }), [i, s] = A(!1), r = re(null);
  return {
    containerRef: r,
    colSizes: n,
    setColSizes: o,
    isDragging: i,
    handleMouseDown: () => {
      s(!0);
    },
    handleMouseUp: () => {
      s(!1);
    },
    handleMouseMove: (u) => {
      if (!i) return;
      u.preventDefault();
      const m = r.current.getBoundingClientRect(), g = (u.clientX - m.left) / m.width * 100;
      g >= 15 && g <= 60 && o({ col1: g, col2: 100 - g });
    }
  };
}, yF = (t, e, n) => {
  const o = t[e];
  if (o && isNaN(Date.parse(o)))
    return new Error(
      `Invalid prop \`${e}\` supplied to \`${n}\`. Expected a valid date string (ISO 8601) but received \`${o}\`.`
    );
}, Xn = (t, e, n) => {
  const o = t[e];
  try {
    new URL(o);
    return;
  } catch {
    return new Error(
      `Invalid prop \`${e}\` supplied to \`${n}\`. Expected a valid URL but received \`${o}\`.`
    );
  }
}, wF = (t, e, n) => {
  const o = t[e];
  if (!(o == null || o === ""))
    return Xn(t, e, n);
}, bF = {
  create: !0,
  upload: !0,
  move: !0,
  copy: !0,
  rename: !0,
  download: !0,
  delete: !0
}, xF = (t) => {
  if (!t || isNaN(Date.parse(t))) return "";
  t = new Date(t);
  let e = t.getHours();
  const n = t.getMinutes(), o = e >= 12 ? "PM" : "AM";
  e = e % 12, e = e || 12;
  const i = t.getMonth() + 1, s = t.getDate(), r = t.getFullYear();
  return `${i}/${s}/${r} ${e}:${n < 10 ? "0" + n : n} ${o}`;
}, Zn = no(function({
  files: e,
  fileUploadConfig: n,
  isLoading: o,
  onCreateFolder: i,
  onFileUploading: s = () => {
  },
  onFileUploaded: r = () => {
  },
  onCut: a,
  onCopy: l,
  onPaste: d,
  onRename: u,
  onDownload: p,
  onDelete: m = () => null,
  onLayoutChange: g = () => {
  },
  onRefresh: f,
  onFileOpen: b = () => {
  },
  onFolderChange: T = () => {
  },
  onSelect: C,
  onSelectionChange: R,
  onError: N = () => {
  },
  layout: k = "list",
  enableFilePreview: $ = !0,
  maxFileSize: E,
  filePreviewPath: x,
  acceptedFileTypes: h,
  height: v = "600px",
  width: y = "100%",
  initialPath: O = "",
  filePreviewComponent: I,
  primaryColor: _ = "#6155b4",
  fontFamily: H = "Nunito Sans, sans-serif",
  language: W = "en-US",
  permissions: Z = {},
  collapsibleNav: M = !1,
  defaultNavExpanded: oe = !0,
  className: ce = "",
  style: w = {},
  formatDate: S = xF,
  listColumns: U,
  projectServices: D,
  renderToolbarFilter: V,
  renderSearchInput: X
}, K) {
  const q = [
    { id: "name", label: "name" },
    { id: "modified", label: "modified" },
    { id: "size", label: "size" }
  ], j = U && U.length > 0 ? U : q, [Y, G] = A(oe), [ae, P] = A(""), [fe, Ce] = A(!1), [$e, Ye] = A("all"), [je, ut] = A(!1), [Pe, pt] = A(!1), Ue = vF(), z = (Fe) => Fe.isSuperseded === !0 || Fe.rawSharePointFile?.status === "Superseded", se = (Fe) => Fe.isArchived === !0 || Fe.rawSharePointFile?.status === "Archived", me = Re(() => {
    let De = Array.isArray(e) ? e : [];
    return $e && $e !== "all" && (De = De.filter((ke) => ke.isDirectory ? !0 : (ke.projectServiceIds ?? ke.rawSharePointFile?.projectServiceIds ?? "").toString().split(",").map((eo) => eo.trim()).filter(Boolean).includes($e))), De = De.filter((ke) => ke.isDirectory ? !0 : !(je && z(ke) || !Pe && se(ke))), De;
  }, [e, $e, je, Pe]), { containerRef: de, colSizes: he, isDragging: Te, handleMouseMove: Le, handleMouseUp: Se, handleMouseDown: ft } = $F(20, 80), Qn = {
    "--file-manager-font-family": H,
    "--file-manager-primary-color": _,
    height: v,
    width: y
  }, ht = Re(
    () => ({ ...bF, ...Z }),
    [Z]
  );
  return /* @__PURE__ */ F(
    "main",
    {
      ref: K,
      className: `file-explorer ${ce}`,
      onContextMenu: (Fe) => Fe.preventDefault(),
      style: { ...Qn, ...w },
      children: [
        /* @__PURE__ */ c(Ot, { loading: o }),
        /* @__PURE__ */ c($S, { language: W, children: /* @__PURE__ */ c(ko, { filesData: me, onError: N, children: /* @__PURE__ */ c(Po, { initialPath: O, onFolderChange: T, children: /* @__PURE__ */ c(
          To,
          {
            onDownload: p,
            onSelect: C,
            onSelectionChange: R,
            children: /* @__PURE__ */ c(Lo, { onPaste: d, onCut: a, onCopy: l, children: /* @__PURE__ */ F(GS, { layout: k, children: [
              /* @__PURE__ */ c(
                jn,
                {
                  onRefresh: f,
                  triggerAction: Ue,
                  permissions: ht,
                  searchTerm: ae,
                  setSearchTerm: P,
                  searchInputVisible: fe,
                  setSearchInputVisible: Ce,
                  projectServices: D,
                  selectedServiceId: $e,
                  setSelectedServiceId: Ye,
                  toolbarFilterContent: V?.({
                    projectServices: D ?? [],
                    selectedServiceId: $e,
                    setSelectedServiceId: Ye
                  }),
                  renderSearchInput: X,
                  hideSupersededFiles: je,
                  setHideSupersededFiles: ut,
                  showArchivedFiles: Pe,
                  setShowArchivedFiles: pt
                }
              ),
              /* @__PURE__ */ F(
                "section",
                {
                  ref: de,
                  onMouseMove: Le,
                  onMouseUp: Se,
                  className: "files-container",
                  children: [
                    /* @__PURE__ */ F(
                      "div",
                      {
                        className: `navigation-pane ${Y ? "open" : "closed"}`,
                        style: {
                          width: he.col1 + "%"
                        },
                        children: [
                          /* @__PURE__ */ c(Vn, { onFileOpen: b }),
                          /* @__PURE__ */ c(
                            "div",
                            {
                              className: `sidebar-resize ${Te ? "sidebar-dragging" : ""}`,
                              onMouseDown: ft
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ F(
                      "div",
                      {
                        className: "folders-preview",
                        style: { width: (Y ? he.col2 : 100) + "%" },
                        children: [
                          /* @__PURE__ */ c(
                            zt,
                            {
                              collapsibleNav: M,
                              isNavigationPaneOpen: Y,
                              setNavigationPaneOpen: G
                            }
                          ),
                          /* @__PURE__ */ c(
                            Gn,
                            {
                              onCreateFolder: i,
                              onRename: u,
                              onFileOpen: b,
                              onRefresh: f,
                              enableFilePreview: $,
                              triggerAction: Ue,
                              permissions: ht,
                              formatDate: S,
                              listColumns: j,
                              fontFamily: H,
                              searchTerm: ae
                            }
                          )
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ c(
                gF,
                {
                  fileUploadConfig: n,
                  onFileUploading: s,
                  onFileUploaded: r,
                  onDelete: m,
                  onRefresh: f,
                  maxFileSize: E,
                  filePreviewPath: x,
                  filePreviewComponent: I,
                  acceptedFileTypes: h,
                  triggerAction: Ue,
                  permissions: ht
                }
              )
            ] }) })
          }
        ) }) }) })
      ]
    }
  );
});
Zn.displayName = "FileManager";
Zn.propTypes = {
  files: L.arrayOf(
    L.shape({
      name: L.string.isRequired,
      isDirectory: L.bool.isRequired,
      path: L.string.isRequired,
      updatedAt: yF,
      size: L.number
    })
  ).isRequired,
  fileUploadConfig: L.shape({
    url: Xn,
    headers: L.objectOf(L.string),
    method: L.oneOf(["POST", "PUT"])
  }),
  isLoading: L.bool,
  onCreateFolder: L.func,
  onFileUploading: L.func,
  onFileUploaded: L.func,
  onRename: L.func,
  onDelete: L.func,
  onCut: L.func,
  onCopy: L.func,
  onPaste: L.func,
  onDownload: L.func,
  onLayoutChange: L.func,
  onRefresh: L.func,
  onFileOpen: L.func,
  onFolderChange: L.func,
  onSelect: L.func,
  onSelectionChange: L.func,
  onError: L.func,
  layout: L.oneOf(["grid", "list"]),
  maxFileSize: L.number,
  enableFilePreview: L.bool,
  filePreviewPath: wF,
  acceptedFileTypes: L.string,
  height: L.oneOfType([L.string, L.number]),
  width: L.oneOfType([L.string, L.number]),
  initialPath: L.string,
  filePreviewComponent: L.func,
  primaryColor: L.string,
  fontFamily: L.string,
  language: L.string,
  permissions: L.shape({
    create: L.bool,
    upload: L.bool,
    move: L.bool,
    copy: L.bool,
    rename: L.bool,
    download: L.bool,
    delete: L.bool
  }),
  collapsibleNav: L.bool,
  defaultNavExpanded: L.bool,
  className: L.string,
  style: L.object,
  formatDate: L.func,
  listColumns: L.arrayOf(
    L.shape({
      id: L.string,
      label: L.string,
      fileKey: L.string
    })
  ),
  projectServices: L.arrayOf(
    L.shape({
      id: L.string,
      name: L.string,
      service: L.shape({
        id: L.string,
        name: L.string
      })
    })
  ),
  renderToolbarFilter: L.func,
  renderSearchInput: L.func
};
export {
  Zn as FileManager
};
