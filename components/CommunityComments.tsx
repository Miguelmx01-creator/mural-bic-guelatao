'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, ChevronDown, ChevronUp, Pencil, Loader2, Trash2, Send } from 'lucide-react';
import { subscribeComentarios, crearComentario, type Comentario } from '@/lib/comentarios';
import {
  canEditComment,
  generateEditToken,
  getCommentToken,
  getSavedAuthorName,
  saveAuthorName,
  saveCommentToken,
} from '@/lib/comment-tokens';
import { parseModerarResponse } from '@/lib/moderar-api';

interface Props {
  comunidadKey: string;
}

const FIELD =
  'w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pine-green/40 focus:border-pine-green/60 transition';

function formatWhen(date: Date | null): string {
  if (!date) return '';
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

function CommentItem({ comment }: { comment: Comentario }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.texto);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editable = canEditComment(comment.id);

  useEffect(() => {
    if (!editing) setText(comment.texto);
  }, [comment.texto, editing]);

  const handleSave = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Escribe un comentario.');
      return;
    }
    const token = getCommentToken(comment.id);
    if (!token) {
      setError('Solo puedes editar desde el mismo dispositivo donde comentaste.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/comentarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId: comment.id, editToken: token, texto: trimmed }),
      });
      const data = await parseModerarResponse(res);
      if (!res.ok) {
        setError(data.error ?? 'No se pudo guardar.');
        return;
      }
      setEditing(false);
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar tu comentario?')) return;
    const token = getCommentToken(comment.id);
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/comentarios', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId: comment.id, editToken: token }),
      });
      const data = await parseModerarResponse(res);
      if (!res.ok) setError(data.error ?? 'No se pudo eliminar.');
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="bg-white rounded-lg border border-gray-100 px-3 py-2.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-pine-green truncate">{comment.autor}</p>
          {editing ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              maxLength={500}
              className={`${FIELD} mt-1 resize-none`}
              autoFocus
            />
          ) : (
            <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap break-words leading-relaxed">
              {comment.texto}
            </p>
          )}
          <p className="text-[10px] text-gray-400 mt-1">
            {formatWhen(comment.creadoEn)}
            {comment.editadoEn ? ' · editado' : ''}
          </p>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>

        {editable && !editing && (
          <div className="flex gap-0.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-pine-green hover:bg-pine-green/10"
              title="Editar tu comentario"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
              title="Eliminar tu comentario"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {editing && (
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => { setEditing(false); setText(comment.texto); setError(null); }}
            className="flex-1 px-2 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-600"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-2 py-1.5 rounded-lg bg-pine-green text-cream text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            Guardar
          </button>
        </div>
      )}
    </li>
  );
}

export default function CommunityComments({ comunidadKey }: Props) {
  const [open, setOpen] = useState(false);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [autor, setAutor] = useState('');
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setAutor(getSavedAuthorName());
  }, []);

  useEffect(() => {
    const unsub = subscribeComentarios(
      comunidadKey,
      (data) => {
        setComentarios(data);
        setLoadError(null);
      },
      () => setLoadError('No se pudieron cargar los comentarios.')
    );
    return () => unsub();
  }, [comunidadKey]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!autor.trim() || !texto.trim()) {
      setError('Escribe tu nombre y comentario.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const editToken = generateEditToken();
      const id = await crearComentario({
        comunidadKey,
        autor: autor.trim(),
        texto: texto.trim(),
        editToken,
      });
      saveCommentToken(id, editToken);
      saveAuthorName(autor.trim());
      setTexto('');
      setOpen(true);
    } catch (err) {
      console.error(err);
      setError('No se pudo publicar el comentario. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [autor, texto, comunidadKey]);

  return (
    <div className="mt-2 border-t border-pine-green/15 pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg hover:bg-pine-green/5 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-pine-green">
          <MessageCircle className="w-4 h-4" />
          Comentarios
          <span className="bg-pine-green/10 text-pine-green text-xs px-2 py-0.5 rounded-full">
            {comentarios.length}
          </span>
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="mt-2 space-y-3 px-1">
          {loadError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-2 py-1.5">{loadError}</p>
          )}

          {comentarios.length === 0 && !loadError && (
            <p className="text-xs text-gray-400 text-center py-2">
              Sé el primero en comentar sobre este mural.
            </p>
          )}

          {comentarios.length > 0 && (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {comentarios.map((c) => (
                <CommentItem key={c.id} comment={c} />
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit} className="space-y-2 bg-pine-green/5 rounded-xl p-3 border border-pine-green/10">
            <p className="text-xs text-gray-600 leading-snug">
              Comenta sobre el mural de <strong>{comunidadKey}</strong>. Solo podrás editar desde este mismo celular o computadora.
            </p>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              placeholder="Tu nombre"
              maxLength={80}
              className={FIELD}
            />
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe tu comentario…"
              rows={2}
              maxLength={500}
              className={`${FIELD} resize-none`}
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-gray-400">{texto.length}/500</span>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pine-green text-cream text-xs font-semibold disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Comentar
              </button>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
