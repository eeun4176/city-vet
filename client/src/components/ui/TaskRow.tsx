import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Check, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react';
import type { PetTask } from '../../types/portal';

interface TaskRowProps {
  task: PetTask;
  onToggle: (id: string) => void;
  onEdit: (task: PetTask) => void;
  onRemove: (task: PetTask) => void;
}

export default function TaskRow({ task, onToggle, onEdit, onRemove }: TaskRowProps) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) menuRef.current?.removeAttribute('open');
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [menuOpen]);

  useEffect(() => {
    if (editing) {
      dialogRef.current?.showModal();
      dialogRef.current?.querySelector('input')?.focus();
    }
  }, [editing]);

  function saveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get('title') ?? '').trim();
    const detail = String(data.get('detail') ?? '').trim();
    if (!title) { setError('Give your task a title.'); return; }
    onEdit({ ...task, title, detail });
    dialogRef.current?.close();
  }

  return <div className="task-row" data-complete={task.complete}>
    <label className="task-checkbox-label">
      <span className="task-checkbox">
        <input type="checkbox" checked={task.complete} onChange={() => onToggle(task.id)} />
        <Check className="task-checkbox-check" size={12} aria-hidden="true" />
      </span>
      <span className="task-copy"><span className="task-title">{task.title}</span>{task.detail && <span className="task-detail">{task.detail}</span>}</span>
    </label>
    <details ref={menuRef} className="task-menu" onToggle={event => setMenuOpen(event.currentTarget.open)} onKeyDown={event => {
      if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus(); }
    }} onBlur={event => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
    }}>
      <summary className="task-menu-trigger" aria-label={`Options for ${task.title}`}><MoreHorizontal size={16} aria-hidden="true" /></summary>
      <div className="task-menu-panel">
        <button type="button" onClick={() => { menuRef.current?.removeAttribute('open'); setError(''); setEditing(true); }}><Pencil size={15} aria-hidden="true" />Edit Task</button>
        <button type="button" className="task-remove" onClick={() => onRemove(task)}><Trash2 size={15} aria-hidden="true" />Remove Task</button>
      </div>
    </details>
    <dialog ref={dialogRef} className="task-editor" aria-labelledby={`edit-task-${task.id}`} onClose={() => { setEditing(false); menuRef.current?.querySelector('summary')?.focus(); }} onClick={event => {
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.target === event.currentTarget && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) event.currentTarget.close();
    }}>
      {editing && <form onSubmit={saveTask}>
        <div className="task-editor-heading"><div><p className="dashboard-eyebrow">A LITTLE ORGANIZATION</p><h2 id={`edit-task-${task.id}`}>Edit Task</h2></div><button type="button" className="task-menu-trigger" aria-label="Close task editor" onClick={() => dialogRef.current?.close()}><X size={18} aria-hidden="true" /></button></div>
        <label className="task-editor-field">Task title<input name="title" defaultValue={task.title} required maxLength={120} aria-invalid={!!error} aria-describedby={error ? `task-error-${task.id}` : undefined} onChange={() => setError('')} /></label>
        <label className="task-editor-field">Details <span className="task-field-optional">Optional</span><textarea name="detail" defaultValue={task.detail} maxLength={240} rows={3} /></label>
        {error && <p id={`task-error-${task.id}`} role="alert" className="task-editor-error">{error}</p>}
        <div className="task-editor-actions"><button type="button" className="secondary-button task-cancel" onClick={() => dialogRef.current?.close()}>Cancel</button><button type="submit" className="primary-button dashboard-cta">Save changes</button></div>
      </form>}
    </dialog>
  </div>;
}
