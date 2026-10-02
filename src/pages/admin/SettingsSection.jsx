import { useState } from 'react'
import { useResource } from '../../hooks'
import { api } from '../../lib/api'
import { ErrorNote, Loading, Panel, SuccessNote } from './parts'

const BLANK = {
  storeName: '',
  contactEmail: '',
  phone: '',
  address: '',
  announcement: '',
  freeShippingThreshold: '0',
  currency: 'CHF',
  lowStockAt: '12',
  ordersOpen: true,
}

const fieldClass =
  'mt-1.5 w-full border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink-950'

function toForm(settings) {
  if (!settings) return { ...BLANK }
  return {
    ...BLANK,
    ...settings,
    freeShippingThreshold: String(settings.freeShippingThreshold ?? 0),
    lowStockAt: String(settings.lowStockAt ?? 12),
    ordersOpen: Boolean(settings.ordersOpen),
  }
}

export default function SettingsSection() {
  const { data, error, loading } = useResource(() => api.adminSettings())

  if (loading && !data) return <Loading label="Loading settings" />
  if (error && !data) return <ErrorNote>{error}</ErrorNote>

  return <SettingsForm settings={data?.settings} />
}

function SettingsForm({ settings }) {
  const [form, setForm] = useState(() => toForm(settings))
  const [busy, setBusy] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)

  const set = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setSaveError('')
    try {
      await api.saveSettings({
        ...form,
        freeShippingThreshold: Number(form.freeShippingThreshold),
        lowStockAt: Number(form.lowStockAt),
      })
      setSaved(true)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      {saveError && <ErrorNote>{saveError}</ErrorNote>}
      {saved && <SuccessNote>Settings saved.</SuccessNote>}

      <Panel title="Store details" description="Shown across the site">
        <div className="grid gap-5 px-5 py-6 sm:grid-cols-2">
          <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
            Store name
            <input
              value={form.storeName}
              onChange={set('storeName')}
              required
              minLength={2}
              maxLength={60}
              className={fieldClass}
            />
          </label>

          <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
            Contact email
            <input
              type="email"
              value={form.contactEmail}
              onChange={set('contactEmail')}
              required
              className={fieldClass}
            />
          </label>

          <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
            Phone
            <input value={form.phone} onChange={set('phone')} className={fieldClass} />
          </label>

          <label className="block text-xs uppercase tracking-[0.15em] text-ink-500 sm:col-span-2">
            Address
            <input value={form.address} onChange={set('address')} className={fieldClass} />
          </label>

          <label className="block text-xs uppercase tracking-[0.15em] text-ink-500 sm:col-span-2">
            Announcement bar
            <input
              value={form.announcement}
              onChange={set('announcement')}
              maxLength={160}
              placeholder="Complimentary shipping on orders over CHF 80"
              className={fieldClass}
            />
          </label>
        </div>
      </Panel>

      <Panel title="Commerce" description="Thresholds and availability">
        <div className="grid gap-5 px-5 py-6 sm:grid-cols-3">
          <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
            Free shipping over
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.freeShippingThreshold}
              onChange={set('freeShippingThreshold')}
              className={fieldClass}
            />
          </label>

          <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
            Currency
            <input
              value={form.currency}
              onChange={set('currency')}
              required
              maxLength={8}
              className={fieldClass}
            />
          </label>

          <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
            Low stock at
            <input
              type="number"
              min="0"
              value={form.lowStockAt}
              onChange={set('lowStockAt')}
              className={fieldClass}
            />
          </label>

          <label className="flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-ink-500 sm:col-span-3">
            <input
              type="checkbox"
              checked={form.ordersOpen}
              onChange={set('ordersOpen')}
              className="size-4 accent-ink-950"
            />
            Accepting new orders
          </label>
        </div>
      </Panel>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  )
}
