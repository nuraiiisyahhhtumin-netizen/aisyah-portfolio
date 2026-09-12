'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { BarChart3, BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight, Download, GraduationCap, Heart, LayoutDashboard, Menu, NotebookPen, Plus, Trash2, Wallet, X } from 'lucide-react'

type Task = { id: number; label: string; detail: string; dueDate?: string; dueTime?: string; done: boolean }
type Fund = { id: number; label: string; amount: number; icon: string }
type Entry = { id: number; title: string; detail: string }
type QuickLink = { id: number; label: string; href: string }

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'savings', label: 'Savings Tracker', icon: Wallet },
  { id: 'tasks', label: 'Daily & Upcoming Tasks', icon: Check },
  { id: 'calendar', label: 'Period Calendar', icon: CalendarDays },
  { id: 'journal', label: 'Notes & Journal', icon: NotebookPen },
  { id: 'pgdt', label: 'PGDT Console', icon: GraduationCap },
  { id: 'teacher', label: 'Teacher Console', icon: BookOpen },
] as const

const starterQuickLinks: QuickLink[] = [
  { id: 1, label: 'DELIMa KPM', href: 'https://www.delima.my/' },
  { id: 2, label: 'APDM / HRMIS', href: 'https://hrmis2.eghrmis.gov.my/' },
  { id: 3, label: 'Google Classroom', href: 'https://classroom.google.com/' },
  { id: 4, label: 'Online RPH', href: '#' },
]

export default function Page() {
  const [active, setActive] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, label: 'Prepare PGDT presentation slides', detail: 'Today · 10:00 AM', done: false },
    { id: 2, label: 'Check 5 Pintar student exercise books', detail: 'Today · 02:00 PM', done: true },
    { id: 3, label: 'Review teaching notes', detail: 'Tomorrow · 09:00 AM', done: false },
  ])
  const [funds, setFunds] = useState<Fund[]>([
    { id: 1, label: 'Future Savings', amount: 0, icon: '✦' },
    { id: 2, label: 'Wedding Fund', amount: 0, icon: '♡' },
    { id: 3, label: 'Hajj / Umrah Fund', amount: 0, icon: '☾' },
    { id: 4, label: 'Further Studies Fund', amount: 0, icon: '▣' },
  ])
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [savingFundId, setSavingFundId] = useState<number | null>(null)
  const [taskDraft, setTaskDraft] = useState('')
  const [taskDate, setTaskDate] = useState('')
  const [taskTime, setTaskTime] = useState('')
  const [journalEntries, setJournalEntries] = useState<Entry[]>([])
  const [pgdtEntries, setPgdtEntries] = useState<Entry[]>([])
  const [teacherEntries, setTeacherEntries] = useState<Entry[]>([])
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(starterQuickLinks)
  const [profileImage, setProfileImage] = useState('')
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 8, 1))
  const [periodDays, setPeriodDays] = useState<string[]>([])
  const [greeting, setGreeting] = useState('Good morning')
  const completed = tasks.filter((task) => task.done).length
  const totalSavings = funds.reduce((sum, fund) => sum + fund.amount, 0)

  useEffect(() => {
    setGreeting(new Date().getHours() < 12 ? 'Good morning' : 'Good afternoon')
  }, [])

  function toggleTask(id: number) { setTasks((items) => items.map((task) => task.id === id ? { ...task, done: !task.done } : task)) }
  function addSaving() {
    const amount = Number(note)
    if (!Number.isFinite(amount) || amount <= 0 || savingFundId === null) return
    setFunds((items) => items.map((fund) => fund.id === savingFundId ? { ...fund, amount: fund.amount + amount } : fund))
    setNote(''); setSaving(false); setSavingFundId(null)
  }
  function addTask() {
    if (!taskDraft.trim()) return
    const formattedDate = taskDate ? new Date(`${taskDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'
    const detail = `${formattedDate}${taskTime ? ` · ${taskTime}` : ''} · Personal`
    setTasks((items) => [...items, { id: Date.now(), label: taskDraft.trim(), detail, dueDate: taskDate, dueTime: taskTime, done: false }])
    setTaskDraft(''); setTaskDate(''); setTaskTime('')
  }
  function handleProfileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setProfileImage(String(reader.result))
    reader.readAsDataURL(file)
  }
  function downloadData() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), tasks, funds, journalEntries, pgdtEntries, teacherEntries, periodDays }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'aisyah-my-year.json'; link.click(); URL.revokeObjectURL(url)
  }

  const current = navItems.find((item) => item.id === active) ?? navItems[0]

  return (
    <main className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="brand-row"><div className="brand-mark"><Heart size={18} fill="currentColor" /></div><div><strong>My Safe Space</strong><small>&quot;One day I will say: I did it&quot;</small></div><button className="close-menu" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={18} /></button></div>
        <nav className="main-nav" aria-label="Main navigation">{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={active === item.id ? 'nav-item active' : 'nav-item'} onClick={() => { setActive(item.id); setMenuOpen(false) }}><Icon size={16} /><span>{item.label}</span></button> })}</nav>
        <div className="year-card"><div className="year-card-top"><span>2026 My Year</span><button onClick={downloadData} aria-label="Download all data"><Download size={16} /></button></div><small>Work hard in silence</small><div className="year-progress"><span /></div></div>
      </aside>
      {menuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

      <section className="content-area">
        <header className="topbar"><button className="menu-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={20} /></button><div><p className="eyebrow">Saturday, Sept 12, 2026</p><h1>{current.label}</h1></div><label className="profile-button profile-upload" aria-label="Change profile picture">{profileImage ? <img src={profileImage} alt="Aisyah profile" /> : <span>AS</span>}<input type="file" accept="image/*" onChange={handleProfileChange} /></label></header>

        {active === 'dashboard' && <div className="dashboard-view">
          <section className="welcome-card"><div><p className="eyebrow light">{greeting}, Aisyah</p><h2>&quot;One day I will say: I did it&quot;</h2><p>Welcome to your personal aesthetic planner dashboard. Track your savings goals, daily tasks, PGDT studies, and teaching schedule with love and pink vibes.</p><div className="savings-total"><small>Total savings</small><strong>RM {totalSavings.toFixed(2)}</strong></div><button className="light-button" onClick={() => setActive('savings')}>View savings <span>→</span></button></div><div className="welcome-image" /> </section>
          <section className="dashboard-grid"><article className="panel"><div className="panel-heading"><div><p className="eyebrow">Stay on track</p><h2>Today&apos;s Daily Tasks</h2></div><button className="text-button" onClick={() => setActive('tasks')}>Manage</button></div><TaskList tasks={tasks.slice(0, 2)} onToggle={toggleTask} onDelete={(id) => setTasks((items) => items.filter((task) => task.id !== id))} /></article><article className="panel"><div className="panel-heading"><div><p className="eyebrow">Your goals</p><h2>Savings Summary</h2></div><BarChart3 size={18} className="muted-icon" /></div><div className="fund-list">{funds.map((fund) => <div className="fund-row" key={fund.id}><span className="fund-icon">{fund.icon}</span><span>{fund.label}</span><strong>RM {fund.amount.toFixed(2)}</strong></div>)}</div></article></section>
          <QuickLinks links={quickLinks} onChange={setQuickLinks} />
        </div>}

        {active === 'tasks' && <section className="full-panel"><div className="panel-heading"><div><p className="eyebrow">Plan gently</p><h2>Daily &amp; Upcoming Tasks</h2></div><div className="add-row task-add-form"><input value={taskDraft} onChange={(event) => setTaskDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) addTask() }} placeholder="Add a task..." aria-label="New task" /><label><span>Date</span><input type="date" value={taskDate} onChange={(event) => setTaskDate(event.target.value)} aria-label="Task date" /></label><label><span>Time</span><input type="time" value={taskTime} onChange={(event) => setTaskTime(event.target.value)} aria-label="Task time" /></label><button className="dark-button" onClick={addTask}><Plus size={15} /> Add task</button></div></div><TaskList tasks={tasks} onToggle={toggleTask} onDelete={(id) => setTasks((items) => items.filter((task) => task.id !== id))} /></section>}
        {active === 'savings' && <section className="full-panel"><div className="panel-heading"><div><p className="eyebrow">Grow with intention</p><h2>Savings Tracker</h2></div><button className="dark-button" onClick={() => setSaving(true)}><Plus size={15} /> Add saving</button></div><div className="big-total"><small>Total savings</small><strong>RM {totalSavings.toFixed(2)}</strong><div className="big-progress"><span style={{ width: `${Math.min(totalSavings / 20, 100)}%` }} /></div></div><div className="fund-grid">{funds.map((fund) => <button className="fund-card fund-card-editable" key={fund.id} onClick={() => { setSavingFundId(fund.id); setSaving(true) }}><span>{fund.icon}</span><p>{fund.label}</p><strong>RM {fund.amount.toFixed(2)}</strong><small>Tap to update</small></button>)}</div>{saving && <div className="inline-form"><input type="number" min="1" value={note} onChange={(event) => setNote(event.target.value)} placeholder={`Add to ${funds.find((fund) => fund.id === savingFundId)?.label ?? 'fund'} (RM)`} aria-label="Amount in RM" /><button className="dark-button" onClick={addSaving}>Save amount</button><button className="text-button" onClick={() => setSaving(false)}>Cancel</button></div>}</section>}
        {active === 'calendar' && <PeriodCalendar month={calendarMonth} periodDays={periodDays} onMonthChange={setCalendarMonth} onToggleDay={(day) => setPeriodDays((items) => items.includes(day) ? items.filter((item) => item !== day) : [...items, day])} />}
        {active === 'journal' && <EditableSection icon={<NotebookPen size={26} />} title="Notes & Journal" text="A quiet place for thoughts, gratitude, plans, and everything in between." action="Write a new note" entries={journalEntries} onChange={setJournalEntries} />}
        {active === 'pgdt' && <EditableSection icon={<GraduationCap size={26} />} title="PGDT Console" text="Your dedicated space for assignments, presentation plans, and study progress." action="Add study task" entries={pgdtEntries} onChange={setPgdtEntries} />}
        {active === 'teacher' && <EditableSection icon={<BookOpen size={26} />} title="Teacher Console" text="Organise teaching schedules, classroom links, and your daily educator workflow." action="Add teaching plan" entries={teacherEntries} onChange={setTeacherEntries} />}
      </section>
    </main>
  )
}

function TaskList({ tasks, onToggle, onDelete }: { tasks: Task[]; onToggle: (id: number) => void; onDelete: (id: number) => void }) { return <div className="task-list">{tasks.map((task) => <div className={`task-item ${task.done ? 'done' : ''}`} key={task.id}><button className="task-main" onClick={() => onToggle(task.id)}><span className="task-check">{task.done && <Check size={13} />}</span><span><strong>{task.label}</strong><small>{task.detail}</small></span></button><button className="delete-button" aria-label={`Delete ${task.label}`} onClick={() => onDelete(task.id)}><Trash2 size={15} /></button></div>)}</div> }
function QuickLinks({ links, onChange }: { links: QuickLink[]; onChange: (links: QuickLink[]) => void }) {
  const [isAdding, setIsAdding] = useState(false)
  const [label, setLabel] = useState('')
  const [href, setHref] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  function resetForm() { setLabel(''); setHref(''); setEditingId(null); setIsAdding(false) }
  function saveLink() {
    if (!label.trim() || !href.trim()) return
    const next = { id: editingId ?? Date.now(), label: label.trim(), href: href.trim() }
    onChange(editingId ? links.map((link) => link.id === editingId ? next : link) : [...links, next])
    resetForm()
  }
  function editLink(link: QuickLink) { setEditingId(link.id); setLabel(link.label); setHref(link.href); setIsAdding(true) }

  return <section className="quick-section"><div className="panel-heading"><div><p className="eyebrow">Keep close</p><h2>Daily Quick Links</h2><small className="quick-hint">Your everyday links, always ready on the dashboard.</small></div><button className="text-button" onClick={() => { resetForm(); setIsAdding(true) }}><Plus size={14} /> Add link</button></div>
    {isAdding && <div className="inline-form quick-form"><input autoFocus value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Link name" aria-label="Quick link name" /><input type="url" value={href} onChange={(event) => setHref(event.target.value)} placeholder="https://example.com" aria-label="Quick link URL" /><button className="dark-button" onClick={saveLink}>{editingId ? 'Update link' : 'Save link'}</button><button className="text-button" onClick={resetForm}>Cancel</button></div>}
    <div className="quick-links">{links.map((link, index) => <div className="quick-link-item" key={link.id}><a href={link.href} target={link.href !== '#' ? '_blank' : undefined} rel="noreferrer"><span className={`quick-icon icon-${index % 4}`}>{link.label.charAt(0).toUpperCase()}</span>{link.label}<span className="link-arrow">↗</span></a><div className="quick-actions"><button aria-label={`Edit ${link.label}`} onClick={() => editLink(link)}>Edit</button><button aria-label={`Delete ${link.label}`} onClick={() => onChange(links.filter((item) => item.id !== link.id))}><Trash2 size={13} /></button></div></div>)}</div>
  </section>
}
function PeriodCalendar({ month, periodDays, onMonthChange, onToggleDay }: { month: Date; periodDays: string[]; onMonthChange: (month: Date) => void; onToggleDay: (day: string) => void }) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)]
  const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const keyFor = (day: number) => `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return <section className="full-panel calendar-panel"><div className="panel-heading"><div><p className="eyebrow">Listen to your body</p><h2>Period Calendar</h2><p className="calendar-help">Tap a date to mark your period days.</p></div><CalendarDays className="muted-icon" size={22} /></div><div className="calendar-toolbar"><button className="calendar-nav" aria-label="Previous month" onClick={() => onMonthChange(new Date(year, monthIndex - 1, 1))}><ChevronLeft size={17} /></button><strong>{monthLabel}</strong><button className="calendar-nav" aria-label="Next month" onClick={() => onMonthChange(new Date(year, monthIndex + 1, 1))}><ChevronRight size={17} /></button></div><div className="calendar-weekdays">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{cells.map((day, index) => day ? <button key={index} className={`calendar-day ${periodDays.includes(keyFor(day)) ? 'period-day' : ''}`} aria-pressed={periodDays.includes(keyFor(day))} onClick={() => onToggleDay(keyFor(day))}>{day}</button> : <span key={index} />)}</div><p className="calendar-count">{periodDays.length ? `${periodDays.length} date${periodDays.length === 1 ? '' : 's'} marked this month` : 'No dates marked yet'}</p></section>
}
function EditableSection({ icon, title, text, action, entries, onChange }: { icon: React.ReactNode; title: string; text: string; action: string; entries: Entry[]; onChange: (entries: Entry[]) => void }) {
  const [draft, setDraft] = useState('')
  const [draftLink, setDraftLink] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  function addEntry() {
    if (!draft.trim()) return
    onChange([...entries, { id: Date.now(), title: draft.trim(), detail: draftLink.trim() || 'Added just now' }])
    setDraft(''); setDraftLink(''); setIsAdding(false)
  }
  return <section className="full-panel editable-panel"><div className="panel-heading"><div><p className="eyebrow">Your private corner</p><h2>{title}</h2><p>{text}</p></div><button className="dark-button" onClick={() => setIsAdding(true)}><Plus size={15} /> {action}</button></div>{isAdding && <div className="inline-form"><input autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) addEntry() }} placeholder={`Write ${title.toLowerCase()}...`} aria-label={`New ${title}`} /><input type="url" value={draftLink} onChange={(event) => setDraftLink(event.target.value)} placeholder="PDF, website or app link (optional)" aria-label="Optional link" /><button className="dark-button" onClick={addEntry}>Save</button><button className="text-button" onClick={() => setIsAdding(false)}>Cancel</button></div>}{entries.length === 0 ? <div className="empty-state compact-empty"><div className="empty-icon">{icon}</div><p>No entries yet. Use the button above to add one.</p></div> : <div className="entry-list">{entries.map((entry) => <article className="entry-card" key={entry.id}><div><strong>{entry.title}</strong>{entry.detail.startsWith('http') ? <a href={entry.detail} target="_blank" rel="noreferrer">Open link ↗</a> : <small>{entry.detail}</small>}</div><button className="delete-button" aria-label={`Delete ${entry.title}`} onClick={() => onChange(entries.filter((item) => item.id !== entry.id))}><Trash2 size={15} /></button></article>)}</div>}</section>
}
