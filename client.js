window.__ModuleLoader__.load({
  id: '@local/dsh-sticky-wall',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'stickyWall';
    const NOTES_KEY = 'dsh-sticky-wall:notes:v2';
    const DRAFT_KEY = 'dsh-sticky-wall:draft:v2';
    const PANEL_KEY = 'sticky-wall';
    const LOCALES = ['en', 'zh', 'zh-CN'];
    const UNDO_MS = 8000;

    const MESSAGES = {
      en: {
        trigger: 'Sticky wall',
        title: 'Sticky wall',
        search: 'Search notes',
        autosave: 'Jot it down. Notes save themselves.',
        placeholder: 'Write your next idea…',
        add: 'Add to wall',
        shortcut: '⌘/Ctrl + Enter',
        empty: 'The wall is empty. Write an idea above and add it.',
        noResults: 'No notes match your search.',
        category: 'Category (optional)',
        randomColor: 'Surprise me',
        deleteNote: 'Delete this note',
        editNote: 'Edit this note',
        pinNote: 'Pin note',
        unpinNote: 'Unpin note',
        save: 'Save',
        cancel: 'Cancel',
        countUnit: 'notes',
        deleted: 'Note deleted',
        undo: 'Undo',
        saveFailed: 'Could not save locally. This note lives in this page only.',
      },
      zh: {
        trigger: '便签墙',
        title: '便签墙',
        search: '搜索便签',
        autosave: '记下来。便签自动保存。',
        placeholder: '写下你的下一个灵感…',
        add: '添加到墙上',
        shortcut: '⌘/Ctrl + Enter',
        empty: '墙上还空着，写个想法贴上吧。',
        noResults: '没有匹配的便签。',
        category: '分类（可选）',
        randomColor: '随机颜色',
        deleteNote: '删掉这张便签',
        editNote: '编辑这张便签',
        pinNote: '置顶',
        unpinNote: '取消置顶',
        save: '保存',
        cancel: '取消',
        countUnit: '张便签',
        deleted: '已删除',
        undo: '撤销',
        saveFailed: '没能存到本地，这条只在本页有效。',
      },
    };
    MESSAGES['zh-CN'] = MESSAGES.zh;

    const PALETTE = [
      { id: 'yellow', bg: '#fce6ae', ink: '#6a5316', dot: '#f6d78a' },
      { id: 'pink', bg: '#fbdfe7', ink: '#6b3a49', dot: '#f3c6d3' },
      { id: 'blue', bg: '#dcebfa', ink: '#284a6b', dot: '#c3dcf5' },
      { id: 'green', bg: '#cdeee1', ink: '#235c47', dot: '#b1e2d0' },
      { id: 'lilac', bg: '#ded4f8', ink: '#41346b', dot: '#c9baf1' },
      { id: 'cream', bg: '#f8f2e3', ink: '#5a4a2e', dot: '#efe4cd' },
    ];
    const DEFAULT_COLOR = 'yellow';
    const RANDOM_COLOR = 'random';
    const RANDOM_GRADIENT = 'conic-gradient(from 200deg, #f6d78a, #f3c6d3, #c3dcf5, #b1e2d0, #c9baf1, #f6d78a)';

    function paletteOf(id) {
      for (const entry of PALETTE) {
        if (entry.id === id) return entry;
      }
      return PALETTE[0];
    }

    const CSS = `
.dsw-sw-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  padding: 26px 34px 44px;
  color: var(--dsw-alias-label-primary);
  font-family: inherit;
  font-size: 13px;
  line-height: 1.55;
}
.dsw-sw-page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.dsw-sw-page-title {
  margin: 0;
  font-size: 21px;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.dsw-sw-tools {
  display: flex;
  align-items: center;
  gap: 14px;
}
.dsw-sw-search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 17px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
}
.dsw-sw-search:focus-within {
  border-color: var(--dsw-alias-border-l2);
}
.dsw-sw-search-input {
  width: 190px;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font-family: inherit;
  font-size: 12px;
  outline: none;
}
.dsw-sw-search-input::placeholder {
  color: var(--dsw-alias-label-secondary);
}
.dsw-sw-page-count {
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
  white-space: nowrap;
}
.dsw-sw-compose {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 20px 16px;
  margin-bottom: 22px;
  border-radius: 16px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
}
.dsw-sw-compose-note {
  font-size: 12px;
  opacity: 0.62;
}
.dsw-sw-category {
  width: 150px;
  border: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.14);
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: 12px;
  padding: 0 0 3px;
  outline: none;
}
.dsw-sw-category::placeholder {
  color: inherit;
  opacity: 0.42;
}
.dsw-sw-input {
  width: 100%;
  box-sizing: border-box;
  min-height: 58px;
  max-height: 180px;
  resize: vertical;
  padding: 2px 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.6;
  outline: none;
}
.dsw-sw-input::placeholder {
  color: inherit;
  opacity: 0.4;
}
.dsw-sw-compose-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.dsw-sw-dots {
  display: flex;
  align-items: center;
  gap: 9px;
}
.dsw-sw-dot {
  width: 18px;
  height: 18px;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 50%;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease;
}
.dsw-sw-dot:hover {
  transform: scale(1.1);
}
.dsw-sw-dot[data-selected="true"] {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.85), 0 0 0 3.5px currentColor;
}
.dsw-sw-compose-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dsw-sw-kbd {
  font-size: 11px;
  opacity: 0.55;
  white-space: nowrap;
}
.dsw-sw-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border: 0;
  border-radius: 16px;
  background: var(--dsw-alias-label-primary);
  color: var(--dsw-alias-bg-base);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
.dsw-sw-add:disabled {
  opacity: 0.4;
  cursor: default;
}
.dsw-sw-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 16px;
  padding: 9px 14px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
}
.dsw-sw-banner[data-tone="error"] {
  color: var(--dsw-alias-state-error-primary);
}
.dsw-sw-banner-action {
  padding: 3px 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
}
.dsw-sw-banner-action:hover {
  background: var(--dsw-alias-bg-layer-2);
}
.dsw-sw-grid {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-y: auto;
}
.dsw-sw-note {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: calc((100% - 28px) / 3);
  height: 184px;
  margin: 0 14px 14px 0;
  padding: 16px 16px 12px;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.035);
  transition: transform 140ms ease, box-shadow 140ms ease;
}
.dsw-sw-note:nth-child(3n) {
  margin-right: 0;
}
.dsw-sw-note:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
.dsw-sw-note[data-editing="true"] {
  height: auto;
  min-height: 184px;
}
.dsw-sw-note-category {
  display: block;
  flex: 0 0 auto;
  padding-right: 26px;
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  opacity: 0.6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsw-sw-note-text {
  margin: 0;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  font-size: 15.5px;
  font-weight: 600;
  line-height: 1.58;
  white-space: pre-wrap;
  word-break: break-word;
}
.dsw-sw-note-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  font-size: 11px;
}
.dsw-sw-note-time {
  opacity: 0.5;
}
.dsw-sw-note-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}
.dsw-sw-note-pin,
.dsw-sw-note-edit,
.dsw-sw-note-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: opacity 120ms ease, background-color 120ms ease;
}
.dsw-sw-note-pin {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 5;
}
.dsw-sw-note-pin,
.dsw-sw-note-edit,
.dsw-sw-note-remove {
  opacity: 0;
}
.dsw-sw-note:hover .dsw-sw-note-pin,
.dsw-sw-note:hover .dsw-sw-note-edit,
.dsw-sw-note:hover .dsw-sw-note-remove,
.dsw-sw-note-pin:focus-visible,
.dsw-sw-note-edit:focus-visible,
.dsw-sw-note-remove:focus-visible {
  opacity: 0.55;
}
.dsw-sw-note-pin:hover,
.dsw-sw-note-edit:hover,
.dsw-sw-note-remove:hover,
.dsw-sw-note-pin:focus-visible,
.dsw-sw-note-edit:focus-visible,
.dsw-sw-note-remove:focus-visible {
  opacity: 1;
  background: rgba(0, 0, 0, 0.08);
  outline: none;
}
.dsw-sw-note:hover .dsw-sw-note-pin[data-pinned="true"],
.dsw-sw-note .dsw-sw-note-pin[data-pinned="true"] {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
}
.dsw-sw-edit-category,
.dsw-sw-edit-text {
  width: 100%;
  box-sizing: border-box;
  border: 0;
  border-radius: 7px;
  padding: 5px 8px;
  background: rgba(255, 255, 255, 0.5);
  color: inherit;
  font-family: inherit;
  outline: none;
}
.dsw-sw-edit-category {
  font-size: 11.5px;
}
.dsw-sw-edit-category::placeholder {
  color: inherit;
  opacity: 0.42;
}
.dsw-sw-edit-text {
  flex: 1 1 auto;
  min-height: 76px;
  resize: none;
  font-size: 14px;
  line-height: 1.55;
}
.dsw-sw-edit-foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: auto;
}
.dsw-sw-edit-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.dsw-sw-edit-save {
  padding: 4px 11px;
  border: 0;
  border-radius: 7px;
  background: rgba(0, 0, 0, 0.72);
  color: #ffffff;
  font-family: inherit;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
}
.dsw-sw-edit-save:disabled {
  opacity: 0.4;
  cursor: default;
}
.dsw-sw-edit-cancel {
  padding: 4px 8px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: 11.5px;
  cursor: pointer;
  opacity: 0.62;
}
.dsw-sw-edit-cancel:hover {
  opacity: 1;
}
.dsw-sw-empty {
  margin: 8px 2px;
  font-size: 13px;
  color: var(--dsw-alias-label-secondary);
}
@media (max-width: 900px) {
  .dsw-sw-note {
    width: calc((100% - 14px) / 2);
  }
  .dsw-sw-note:nth-child(3n) {
    margin-right: 14px;
  }
  .dsw-sw-note:nth-child(2n) {
    margin-right: 0;
  }
}
@media (max-width: 560px) {
  .dsw-sw-note {
    width: 100%;
    margin-right: 0;
  }
}
@media (max-width: 640px) {
  .dsw-sw-page {
    padding: 18px 16px 32px;
  }
  .dsw-sw-search-input {
    width: 110px;
  }
}
`;

    const PLUS_ICON = h('svg', {
      viewBox: '0 0 24 24',
      width: 13,
      height: 13,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      'aria-hidden': 'true',
      focusable: 'false',
    }, h('path', { d: 'M12 5v14M5 12h14' }));

    const SEARCH_ICON = h('svg', {
      viewBox: '0 0 24 24',
      width: 13,
      height: 13,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
      'aria-hidden': 'true',
      focusable: 'false',
    }, [
      h('circle', { key: 'circle', cx: 11, cy: 11, r: 6.2 }),
      h('path', { key: 'handle', d: 'M15.6 15.6L20 20' }),
    ]);

    const TRASH_ICON = h('svg', {
      viewBox: '0 0 24 24',
      width: 14,
      height: 14,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.7,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': 'true',
      focusable: 'false',
    }, [
      h('path', { key: 'lid', d: 'M4.5 7h15' }),
      h('path', { key: 'handle', d: 'M9.5 7V5.4h5V7' }),
      h('path', { key: 'bin', d: 'M6.8 7l.8 12a1.7 1.7 0 0 0 1.7 1.6h5.4a1.7 1.7 0 0 0 1.7-1.6l.8-12' }),
    ]);

    const EDIT_ICON = h('svg', {
      viewBox: '0 0 24 24',
      width: 14,
      height: 14,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.7,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': 'true',
      focusable: 'false',
    }, [
      h('path', { key: 'box', d: 'M13.4 5.6H7.2A2.7 2.7 0 0 0 4.5 8.3v8.5a2.7 2.7 0 0 0 2.7 2.7h8.5a2.7 2.7 0 0 0 2.7-2.7v-4.3' }),
      h('path', { key: 'pen', d: 'M17.4 4.7l1.9 1.9-6.9 6.9-2.4.5.5-2.4z' }),
    ]);

    const PIN_ICON = h('svg', {
      viewBox: '0 0 24 24',
      width: 14,
      height: 14,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2.2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': 'true',
      focusable: 'false',
    }, [
      h('path', { key: 'base', d: 'M6.5 4.6h11' }),
      h('path', { key: 'shaft', d: 'M12 20V8.2' }),
      h('path', { key: 'head', d: 'M7.4 12.8L12 8.2L16.6 12.8' }),
    ]);

    function panelIcon(props) {
      const size = props && typeof props.size === 'number' ? props.size : 16;
      return h('svg', {
        viewBox: '0 0 24 24',
        width: size,
        height: size,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
        focusable: 'false',
      }, [
        h('rect', { key: 'frame', x: 4, y: 4.5, width: 16, height: 15, rx: 2.4 }),
        h('path', { key: 'line-1', d: 'M8.2 9.6h7.6', strokeLinecap: 'round' }),
        h('path', { key: 'line-2', d: 'M8.2 12.8h5.2', strokeLinecap: 'round' }),
      ]);
    }

    function formatAbsolute(ms, localeId) {
      const date = new Date(ms);
      const options = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      try {
        if (date.getFullYear() !== new Date().getFullYear()) options.year = 'numeric';
        return new Intl.DateTimeFormat(localeId || undefined, options).format(date);
      } catch (error) {
        try {
          return date.toLocaleString();
        } catch (inner) {
          return '';
        }
      }
    }

    function formatTime(ms, localeId) {
      const minutes = Math.round((Date.now() - ms) / 60000);
      try {
        const relative = new Intl.RelativeTimeFormat(localeId || undefined, { numeric: 'auto' });
        if (minutes < 1) return relative.format(0, 'minute');
        if (minutes < 60) return relative.format(-minutes, 'minute');
        const hours = Math.round(minutes / 60);
        if (hours < 24) return relative.format(-hours, 'hour');
        const days = Math.round(hours / 24);
        if (days < 7) return relative.format(-days, 'day');
      } catch (error) {
        // Fall through to the absolute label.
      }
      return formatAbsolute(ms, localeId);
    }

    function sortNotes(notes) {
      return notes.slice().sort((a, b) => {
        if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
        return b.createdAt - a.createdAt;
      });
    }

    function readNotes() {
      try {
        const raw = window.localStorage.getItem(NOTES_KEY) || window.localStorage.getItem('dsh-sticky-wall:notes:v1');
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        const notes = parsed
          .filter((note) => note && typeof note.id === 'string' && typeof note.text === 'string' && note.text.trim())
          .map((note) => ({
            id: note.id,
            text: note.text,
            category: typeof note.category === 'string' ? note.category : '',
            color: typeof note.color === 'string' ? note.color : DEFAULT_COLOR,
            pinned: note.pinned === true,
            createdAt: typeof note.createdAt === 'number' && isFinite(note.createdAt) ? note.createdAt : Date.now(),
          }));
        return sortNotes(notes);
      } catch (error) {
        return [];
      }
    }

    function writeNotes(notes) {
      try {
        window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
        return true;
      } catch (error) {
        return false;
      }
    }

    function readDraft() {
      try {
        return window.localStorage.getItem(DRAFT_KEY) || window.localStorage.getItem('dsh-sticky-wall:draft:v1') || '';
      } catch (error) {
        return '';
      }
    }

    function writeDraft(text) {
      try {
        if (text) window.localStorage.setItem(DRAFT_KEY, text);
        else window.localStorage.removeItem(DRAFT_KEY);
      } catch (error) {
        // A draft that cannot be stored still works in memory.
      }
    }

    function mergeNotes(local, remote) {
      const merged = new Map();
      for (const note of remote) merged.set(note.id, note);
      for (const note of local) merged.set(note.id, note);
      return sortNotes(Array.from(merged.values()));
    }

    function sameIds(left, right) {
      if (left.length !== right.length) return false;
      for (let index = 0; index < left.length; index += 1) {
        if (left[index].id !== right[index].id) return false;
      }
      return true;
    }

    function createStore() {
      let state = {
        notes: readNotes(),
        draft: readDraft(),
        category: '',
        color: RANDOM_COLOR,
        query: '',
        editingId: null,
        editDraft: null,
        saveFailed: false,
        lastDeleted: null,
      };
      let undoTimer = null;
      const listeners = new Set();

      const emit = () => {
        listeners.forEach((listener) => {
          try {
            listener();
          } catch (error) {
            // One broken subscriber must not stop the others.
          }
        });
      };

      const setState = (patch) => {
        state = Object.assign({}, state, patch);
        emit();
      };

      const clearUndoTimer = () => {
        if (undoTimer !== null) {
          clearTimeout(undoTimer);
          undoTimer = null;
        }
      };

      return {
        subscribe(listener) {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
        getState() {
          return state;
        },
        setDraft(text) {
          writeDraft(text);
          setState({ draft: text });
        },
        setCategory(category) {
          setState({ category: category });
        },
        setQuery(query) {
          setState({ query: query });
        },
        setColor(color) {
          setState({ color: color });
        },
        add(text) {
          const trimmed = String(text == null ? '' : text).trim();
          if (!trimmed) return;
          const note = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
            text: trimmed,
            category: state.category.trim(),
            color: state.color === RANDOM_COLOR
              ? PALETTE[Math.floor(Math.random() * PALETTE.length)].id
              : state.color,
            pinned: false,
            createdAt: Date.now(),
          };
          const next = sortNotes([note].concat(state.notes));
          const saved = writeNotes(next);
          writeDraft('');
          setState({ notes: next, draft: '', saveFailed: !saved, lastDeleted: null });
        },
        beginEdit(note) {
          setState({
            editingId: note.id,
            editDraft: { text: note.text, category: note.category || '' },
          });
        },
        patchEdit(patch) {
          if (!state.editDraft) return;
          setState({ editDraft: Object.assign({}, state.editDraft, patch) });
        },
        cancelEdit() {
          setState({ editingId: null, editDraft: null });
        },
        saveEdit() {
          const draft = state.editDraft;
          const id = state.editingId;
          if (!draft || !id) return;
          const text = draft.text.trim();
          if (!text) return;
          const next = state.notes.map((note) => (note.id === id
            ? Object.assign({}, note, { text: text, category: draft.category.trim() })
            : note));
          const saved = writeNotes(next);
          setState({ notes: next, editingId: null, editDraft: null, saveFailed: !saved });
        },
        togglePin(id) {
          const target = state.notes.find((note) => note.id === id);
          if (!target) return;
          const next = sortNotes(state.notes.map((note) => (note.id === id
            ? Object.assign({}, note, { pinned: !note.pinned })
            : note)));
          const saved = writeNotes(next);
          setState({ notes: next, saveFailed: !saved });
        },
        remove(id) {
          const note = state.notes.find((item) => item.id === id);
          if (!note) return;
          const next = state.notes.filter((item) => item.id !== id);
          const saved = writeNotes(next);
          clearUndoTimer();
          undoTimer = setTimeout(() => {
            undoTimer = null;
            setState({ lastDeleted: null });
          }, UNDO_MS);
          setState({ notes: next, lastDeleted: note, saveFailed: !saved });
        },
        undo() {
          if (!state.lastDeleted) return;
          const restored = state.lastDeleted;
          clearUndoTimer();
          const next = sortNotes(state.notes.concat([restored]));
          const saved = writeNotes(next);
          setState({ notes: next, lastDeleted: null, saveFailed: !saved });
        },
        syncFromStorage() {
          const remote = readNotes();
          const merged = mergeNotes(state.notes, remote);
          if (sameIds(merged, state.notes)) return;
          setState({ notes: merged });
        },
        dispose() {
          clearUndoTimer();
          listeners.clear();
        },
      };
    }

    function createComponents(store, locale) {
      const subscribeState = (listener) => store.subscribe(listener);
      const getState = () => store.getState();
      const subscribeLocale = (listener) => locale.subscribe(listener);
      const getLocaleSnapshot = () => locale.getSnapshot();

      function colorDot(entry, selected, onSelect, className) {
        return h('button', {
          key: entry.id,
          type: 'button',
          className: className,
          'data-selected': selected ? 'true' : 'false',
          style: { background: entry.dot, color: entry.dot },
          title: entry.id,
          'aria-label': entry.id,
          'aria-pressed': selected ? 'true' : 'false',
          onClick: onSelect,
        });
      }

      function WallPage() {
        const state = React.useSyncExternalStore(subscribeState, getState, getState);
        const snapshot = React.useSyncExternalStore(subscribeLocale, getLocaleSnapshot, getLocaleSnapshot);
        const t = locale.bind(NS);
        const inputRef = React.useRef(null);

        const localeId = snapshot && typeof snapshot.active === 'string' ? snapshot.active : undefined;
        const current = paletteOf(state.color === RANDOM_COLOR ? 'cream' : state.color);
        const query = state.query.trim().toLowerCase();
        const visible = query
          ? state.notes.filter((note) => (note.text + ' ' + note.category).toLowerCase().indexOf(query) !== -1)
          : state.notes;
        const countText = String(state.notes.length) + ' ' + t('countUnit');

        const submit = () => {
          if (!state.draft.trim()) return;
          store.add(state.draft);
          const node = inputRef.current;
          if (node && typeof node.focus === 'function') node.focus();
        };

        const renderNote = (note) => {
          const tone = paletteOf(note.color);
          const editing = state.editingId === note.id;
          const style = { background: tone.bg, color: tone.ink };

          if (editing && state.editDraft) {
            const draft = state.editDraft;
            return h('article', {
              className: 'dsw-sw-note',
              key: note.id,
              'data-editing': 'true',
              style: style,
            },
              h('input', {
                key: 'category',
                className: 'dsw-sw-edit-category',
                value: draft.category,
                placeholder: t('category'),
                'aria-label': t('category'),
                onChange: (event) => store.patchEdit({ category: event.target.value }),
              }),
              h('textarea', {
                key: 'text',
                className: 'dsw-sw-edit-text',
                value: draft.text,
                autoFocus: true,
                'aria-label': t('editNote'),
                onChange: (event) => store.patchEdit({ text: event.target.value }),
                onKeyDown: (event) => {
                  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                    event.preventDefault();
                    store.saveEdit();
                  }
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    store.cancelEdit();
                  }
                },
              }),
              h('div', { key: 'foot', className: 'dsw-sw-edit-foot' },
                h('div', { className: 'dsw-sw-edit-actions' },
                  h('button', {
                    key: 'cancel',
                    type: 'button',
                    className: 'dsw-sw-edit-cancel',
                    onClick: () => store.cancelEdit(),
                  }, t('cancel')),
                  h('button', {
                    key: 'save',
                    type: 'button',
                    className: 'dsw-sw-edit-save',
                    disabled: !draft.text.trim(),
                    onClick: () => store.saveEdit(),
                  }, t('save')),
                ),
              ),
            );
          }

          return h('article', {
            className: 'dsw-sw-note',
            key: note.id,
            title: note.text,
            style: style,
          },
            h('button', {
              key: 'pin',
              type: 'button',
              className: 'dsw-sw-note-pin',
              'data-pinned': note.pinned ? 'true' : 'false',
              title: note.pinned ? t('unpinNote') : t('pinNote'),
              'aria-label': note.pinned ? t('unpinNote') : t('pinNote'),
              'aria-pressed': note.pinned ? 'true' : 'false',
              onClick: (event) => {
                event.stopPropagation();
                store.togglePin(note.id);
              },
            }, PIN_ICON),
            h('span', { key: 'category', className: 'dsw-sw-note-category' }, note.category || '\u00A0'),
            h('p', { key: 'text', className: 'dsw-sw-note-text' }, note.text),
            h('div', { key: 'foot', className: 'dsw-sw-note-foot' },
              h('time', { key: 'time', className: 'dsw-sw-note-time' }, formatTime(note.createdAt, localeId)),
              h('div', { key: 'actions', className: 'dsw-sw-note-actions' },
                h('button', {
                  key: 'edit',
                  type: 'button',
                  className: 'dsw-sw-note-edit',
                  title: t('editNote'),
                  'aria-label': t('editNote'),
                  onClick: () => store.beginEdit(note),
                }, EDIT_ICON),
                h('button', {
                  key: 'remove',
                  type: 'button',
                  className: 'dsw-sw-note-remove',
                  title: t('deleteNote'),
                  'aria-label': t('deleteNote'),
                  onClick: () => store.remove(note.id),
                }, TRASH_ICON),
              ),
            ),
          );
        };

        return h(
          React.Fragment,
          null,
          h('style', { key: 'sticky-wall-style' }, CSS),
          h('div', { key: 'sticky-wall-page', className: 'dsw-sw-page' },
            h('header', { className: 'dsw-sw-page-head' },
              h('h1', { className: 'dsw-sw-page-title' }, t('title')),
              h('div', { className: 'dsw-sw-tools' },
                h('label', { className: 'dsw-sw-search' },
                  SEARCH_ICON,
                  h('input', {
                    className: 'dsw-sw-search-input',
                    type: 'search',
                    value: state.query,
                    placeholder: t('search'),
                    'aria-label': t('search'),
                    onChange: (event) => store.setQuery(event.target.value),
                  }),
                ),
                h('span', { className: 'dsw-sw-page-count' }, countText),
              ),
            ),
            state.saveFailed
              ? h('div', { key: 'save-banner', className: 'dsw-sw-banner', 'data-tone': 'error' }, t('saveFailed'))
              : null,
            state.lastDeleted
              ? h('div', { key: 'undo-banner', className: 'dsw-sw-banner' },
                  h('span', { key: 'text' }, t('deleted')),
                  h('button', {
                    key: 'undo',
                    type: 'button',
                    className: 'dsw-sw-banner-action',
                    onClick: () => store.undo(),
                  }, t('undo')),
                )
              : null,
            h('form', {
              className: 'dsw-sw-compose',
              style: { background: current.bg, color: current.ink },
              onSubmit: (event) => {
                event.preventDefault();
                submit();
              },
            },
              h('input', {
                key: 'category',
                className: 'dsw-sw-category',
                value: state.category,
                placeholder: t('category'),
                'aria-label': t('category'),
                onChange: (event) => store.setCategory(event.target.value),
              }),
              h('textarea', {
                key: 'draft',
                ref: inputRef,
                className: 'dsw-sw-input',
                rows: 2,
                value: state.draft,
                placeholder: t('placeholder'),
                'aria-label': t('placeholder'),
                onChange: (event) => store.setDraft(event.target.value),
                onKeyDown: (event) => {
                  if (event.key !== 'Enter') return;
                  if (!(event.ctrlKey || event.metaKey)) return;
                  const native = event.nativeEvent;
                  if (native && (native.isComposing || native.keyCode === 229)) return;
                  event.preventDefault();
                  submit();
                },
              }),
              h('div', { key: 'foot', className: 'dsw-sw-compose-foot' },
                h('div', { className: 'dsw-sw-dots' },
                  h('button', {
                    key: 'random',
                    type: 'button',
                    className: 'dsw-sw-dot',
                    'data-selected': state.color === RANDOM_COLOR ? 'true' : 'false',
                    style: { background: RANDOM_GRADIENT, color: '#a9a29a' },
                    title: t('randomColor'),
                    'aria-label': t('randomColor'),
                    'aria-pressed': state.color === RANDOM_COLOR ? 'true' : 'false',
                    onClick: () => store.setColor(RANDOM_COLOR),
                  }),
                  PALETTE.map((entry) => colorDot(
                    entry,
                    state.color === entry.id,
                    () => store.setColor(entry.id),
                    'dsw-sw-dot',
                  )),
                ),
                h('div', { className: 'dsw-sw-compose-actions' },
                  h('span', { className: 'dsw-sw-kbd' }, t('shortcut')),
                  h('button', {
                    type: 'submit',
                    className: 'dsw-sw-add',
                    disabled: !state.draft.trim(),
                  }, PLUS_ICON, t('add')),
                ),
              ),
            ),
            state.notes.length === 0
              ? h('p', { className: 'dsw-sw-empty' }, t('empty'))
              : visible.length === 0
                ? h('p', { className: 'dsw-sw-empty' }, t('noResults'))
                : h('div', { className: 'dsw-sw-grid' }, visible.map(renderNote)),
          ),
        );
      }

      return { WallPage };
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        const store = createStore();
        const { WallPage } = createComponents(store, ctx.locale);

        ctx.effect(() => {
          const disposers = [];
          for (const id of LOCALES) {
            try {
              disposers.push(ctx.locale.register(NS, id, MESSAGES[id]));
            } catch (error) {
              // A duplicate or unsupported dictionary must not disable the wall.
            }
          }
          const onStorage = (event) => {
            if (!event || event.key === null || event.key === NOTES_KEY) store.syncFromStorage();
          };
          window.addEventListener('storage', onStorage);
          return () => {
            window.removeEventListener('storage', onStorage);
            store.dispose();
            for (const dispose of disposers) {
              try {
                dispose();
              } catch (error) {
                // Disposal is best effort.
              }
            }
          };
        });

        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: PANEL_KEY,
          order: 20,
          label: () => ctx.locale.bind(NS)('trigger'),
        }, panelIcon));

        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: PANEL_KEY,
        }, WallPage));
      },
    };
  },
});
