import React from 'react';
import { Controller } from 'react-hook-form';

/**
 * Lightweight stand-ins for Sprint's Indi component library, used ONLY by the
 * local preview harness so the real screen files render here. Placeholder
 * styling — NOT Sprint's design. Form validation, tables, modals, navigation
 * and toasts are functional.
 */

// ── token / style coercion ────────────────────────────────────────────────
const COLORS: Record<string, string> = {
  $pageBg: '#f6f7f9', $containerBg: '#ffffff', $modalBg: '#ffffff',
  $textPrimary: '#15181d', $textSecondary: '#5b6470', $textNeutral: '#8a93a0',
  $textPlaceholder: '#aeb6c0', $border: '#e3e6ea',
  $Red500: '#e5484d', $Green500: '#30a46c', $Blue500: '#0091ff',
  $Orange500: '#f76b15', $Purple500: '#8e4ec6', $Pink500: '#e93d82', $Neutral200: '#e5e7eb',
  white: '#ffffff',
};
const c = (v: any) => (v == null ? undefined : COLORS[v] ?? (typeof v === 'string' && v[0] === '$' ? undefined : v));
const u = (v: any) => (typeof v === 'string' && /^\$[\d.]+$/.test(v) ? parseFloat(v.slice(1)) * 4 : v);

function sx(p: any): React.CSSProperties {
  const s: any = {};
  for (const k of ['flex', 'flexWrap', 'flexGrow', 'alignItems', 'justifyContent', 'alignSelf', 'textAlign', 'fontWeight', 'fontSize', 'width', 'height', 'maxWidth', 'minWidth'])
    if (p[k] != null) s[k] = p[k];
  if (p.gap != null) s.gap = u(p.gap);
  if (p.padding != null) s.padding = u(p.padding);
  if (p.backgroundColor != null) s.background = c(p.backgroundColor);
  if (p.color != null) s.color = c(p.color);
  if (p.borderRadius != null) s.borderRadius = u(p.borderRadius);
  return s;
}
const rest = (p: any) => {
  const omit = new Set(['gap', 'padding', 'backgroundColor', 'color', 'borderRadius', 'children', 'flex', 'flexWrap', 'flexGrow', 'alignItems', 'justifyContent', 'alignSelf', 'textAlign', 'fontWeight', 'fontSize', 'width', 'height', 'maxWidth', 'minWidth']);
  const o: any = {};
  for (const k in p) if (!omit.has(k) && !k.startsWith('$')) o[k] = p[k];
  return o;
};
const getPath = (row: any, dataIndex: any) => {
  const path = Array.isArray(dataIndex) ? dataIndex : [dataIndex];
  return path.reduce((acc: any, k: string) => (acc == null ? acc : acc[k]), row);
};

// ── layout ────────────────────────────────────────────────────────────────
const Stack = (dir: 'row' | 'column') => ({ children, ...p }: any) => (
  <div style={{ display: 'flex', flexDirection: dir, ...sx(p) }}>{children}</div>
);
export const IndiYStack = Stack('column');
export const IndiXStack = Stack('row');
export const IndiView = ({ children, ...p }: any) => <div style={{ ...sx(p) }}>{children}</div>;
export const IndiSeparator = (p: any) => <hr style={{ border: 0, borderTop: '1px solid #e3e6ea', width: '100%', ...sx(p) }} />;
export const IndiCard = ({ children, ...p }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e9ecf0', borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.04)', padding: 16, ...sx(p) }}>{children}</div>
);
export const IndiOutlineCard = ({ children, ...p }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #e3e6ea', borderRadius: 12, padding: 16, ...sx(p) }}>{children}</div>
);
export const Container = ({ children }: any) => (
  <div style={{ maxWidth: 1040, margin: '0 auto', width: '100%' }}>{children}</div>
);
export const LoadingContainer = () => <div style={{ padding: 24, color: '#8a93a0' }}>Loading…</div>;
export const IndiLoader = () => <span style={{ color: '#8a93a0' }}>⏳</span>;

// ── text ──────────────────────────────────────────────────────────────────
const Text = (tag: any, base: React.CSSProperties) => ({ children, ...p }: any) =>
  React.createElement(tag, { style: { margin: 0, color: '#15181d', ...base, ...sx(p) } }, children);
export const IndiText = Text('span', {});
export const IndiParagraph = Text('p', { color: '#5b6470', lineHeight: 1.5 });
export const IndiLabel = Text('label', { fontSize: 13, color: '#5b6470' });
export const IndiH1 = Text('h1', { fontSize: 26, fontWeight: 700 });
export const IndiH2 = Text('h2', { fontSize: 22, fontWeight: 700 });
export const IndiH3 = Text('h3', { fontSize: 18, fontWeight: 600 });
export const IndiH4 = Text('h4', { fontSize: 15, fontWeight: 600 });
export const IndiErrorText = Text('span', { color: '#e5484d', fontSize: 12 });

// ── button ──────────────────────────────────────────────────────────────
export const IndiButton = ({ type = 'solid', color = 'primary', size = 'lg', disabled, loading, handlePress, onPress, text, children, ...p }: any) => {
  const accent = color === 'red' ? '#e5484d' : color === 'secondary' ? '#5b6470' : '#0d9488';
  const solid = type === 'solid';
  const link = type === 'link';
  return (
    <button
      disabled={disabled}
      onClick={(e) => !disabled && !loading && (handlePress ? handlePress(e) : onPress?.(e))}
      style={{
        background: solid ? accent : 'transparent',
        color: solid ? '#fff' : accent,
        border: type === 'outline' || type === 'ghost' ? `1px solid ${accent}` : 'none',
        borderRadius: 8, padding: link ? 0 : size === 'sm' ? '6px 11px' : '9px 15px',
        cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 14,
        textDecoration: link ? 'underline' : 'none', opacity: disabled ? 0.5 : 1, ...sx(p),
      }}
    >
      {loading ? '…' : children ?? text}
    </button>
  );
};

// ── badges / tags ─────────────────────────────────────────────────────────
export const IndiBadge = ({ children }: any) => (
  <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 999, background: '#eef1f4', color: '#3b4351', fontSize: 12, fontWeight: 600 }}>{children}</span>
);
export const IndiTag = IndiBadge;

// ── inputs ──────────────────────────────────────────────────────────────
export const IndiInput = ({ value, onChangeText, placeholder, onSubmitEditing, ...p }: any) => (
  <input
    value={value ?? ''} placeholder={placeholder}
    onChange={(e) => onChangeText?.(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && onSubmitEditing?.()}
    style={{ padding: '9px 11px', border: '1px solid #e3e6ea', borderRadius: 8, fontSize: 14, ...sx(p) }}
  />
);
export const IndiSelect = ({ data = [], value, onChange }: any) => (
  <select value={value} onChange={(e) => onChange?.(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e3e6ea', fontSize: 14 }}>
    {data.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

// ── form wrappers (react-hook-form) ───────────────────────────────────────
const Field = ({ label, error, children }: any) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: '#5b6470' }}>
    {label}
    {children}
    {error && <span style={{ color: '#e5484d', fontSize: 12 }}>{error}</span>}
  </label>
);
const inputStyle = (err?: boolean): React.CSSProperties => ({ padding: '9px 11px', border: `1px solid ${err ? '#e5484d' : '#e3e6ea'}`, borderRadius: 8, fontSize: 14, color: '#15181d' });

export const FormTextInput = ({ control, name, label, placeholder, secureTextEntry }: any) => (
  <Controller control={control} name={name} render={({ field, fieldState }) => (
    <Field label={label} error={fieldState.error?.message}>
      <input type={secureTextEntry ? 'password' : 'text'} placeholder={placeholder} value={field.value ?? ''} onBlur={field.onBlur} onChange={(e) => field.onChange(e.target.value)} style={inputStyle(!!fieldState.error)} />
    </Field>
  )} />
);
export const FormNumberInput = ({ control, name, label, placeholder }: any) => (
  <Controller control={control} name={name} render={({ field, fieldState }) => (
    <Field label={label} error={fieldState.error?.message}>
      <input type="number" step="any" placeholder={placeholder} value={field.value ?? ''} onBlur={field.onBlur} onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} style={inputStyle(!!fieldState.error)} />
    </Field>
  )} />
);
export const FormSelect = ({ control, name, label, data = [] }: any) => (
  <Controller control={control} name={name} render={({ field, fieldState }) => (
    <Field label={label} error={fieldState.error?.message}>
      <select value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} style={inputStyle(!!fieldState.error)}>
        <option value="" disabled>Select…</option>
        {data.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  )} />
);
export const FormCheckbox = ({ control, name, label }: any) => (
  <Controller control={control} name={name} render={({ field }) => (
    <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: '#15181d' }}>
      <input type="checkbox" checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />
      {label}
    </label>
  )} />
);

// ── table ──────────────────────────────────────────────────────────────
export type IndiColumn<T> = { title?: string; dataIndex: string | string[]; render?: (value: any, record: T, index: number) => React.ReactNode };
export function IndiTable<T = any>({ data = [], columns = [], loading }: { data?: T[]; columns?: IndiColumn<T>[]; loading?: boolean }) {
  if (loading) return <LoadingContainer />;
  return (
    <div style={{ overflowX: 'auto', border: '1px solid #e9ecf0', borderRadius: 12 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>{columns.map((col, i) => <th key={i} style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #e9ecf0', color: '#5b6470', fontWeight: 600, background: '#fafbfc' }}>{col.title}</th>)}</tr>
        </thead>
        <tbody>
          {data.length === 0 && <tr><td colSpan={columns.length} style={{ padding: 16, color: '#8a93a0' }}>No rows.</td></tr>}
          {data.map((row, ri) => (
            <tr key={ri}>
              {columns.map((col, ci) => (
                <td key={ci} style={{ padding: '10px 12px', borderBottom: '1px solid #f0f2f4' }}>
                  {col.render ? col.render(getPath(row, col.dataIndex), row, ri) : String(getPath(row, col.dataIndex) ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── modal ──────────────────────────────────────────────────────────────
export const IndiModal = ({ isOpen, setIsOpen, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div onClick={() => setIsOpen?.(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, width: 'min(480px, 92vw)', maxHeight: '85vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #eef1f4' }}>
          <strong style={{ fontSize: 16 }}>{title}</strong>
          <button onClick={() => setIsOpen?.(false)} style={{ border: 0, background: 'transparent', fontSize: 20, cursor: 'pointer', color: '#8a93a0' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ── toast (DOM-based) ──────────────────────────────────────────────────────
function showToast(message: string, color: string) {
  const el = document.createElement('div');
  el.textContent = message;
  Object.assign(el.style, { position: 'fixed', right: '20px', bottom: '20px', background: color, color: '#fff', padding: '11px 16px', borderRadius: '10px', boxShadow: '0 6px 20px rgba(0,0,0,0.18)', zIndex: '100', fontSize: '14px', fontWeight: '600' } as CSSStyleDeclaration);
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}
export const Toast = {
  Provider: () => null,
  show: ({ message, type = 'success' }: any) => showToast(message, type === 'error' ? '#e5484d' : type === 'warning' ? '#f76b15' : '#30a46c'),
  success: ({ message }: any) => showToast(message, '#30a46c'),
  error: ({ message }: any) => showToast(message, '#e5484d'),
  warning: ({ message }: any) => showToast(message, '#f76b15'),
  info: ({ message }: any) => showToast(message, '#0091ff'),
};
