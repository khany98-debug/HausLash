'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '../layout'
import { formatPence, formatDuration } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Plus, Pencil, X } from 'lucide-react'

interface ServiceRow {
  id: string
  name: string
  slug: string
  description: string | null
  duration_minutes: number
  price_pence: number | null
  deposit_pence: number
  active: boolean
  sort_order: number
}

export default function AdminServicesPage() {
  const { token } = useAdminAuth()
  const [services, setServices] = useState<ServiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ServiceRow | null>(null)
  const [creating, setCreating] = useState(false)

  const fetchServices = () => {
    if (!token) return
    setLoading(true)
    fetch('/api/admin/services', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setServices(data.services || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchServices()
  }, [token])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-foreground">Services</h1>
        <Button size="sm" onClick={() => setCreating(true)} className="gap-1">
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </div>

      {(creating || editing) && (
        <ServiceForm
          token={token}
          service={editing}
          onClose={() => {
            setEditing(null)
            setCreating(false)
          }}
          onSaved={() => {
            setEditing(null)
            setCreating(false)
            fetchServices()
          }}
        />
      )}

      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{s.name}</span>
                  {!s.active && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDuration(s.duration_minutes)}
                  {s.price_pence ? ` / ${formatPence(s.price_pence)}` : ''}
                  {' / Deposit: '}{formatPence(s.deposit_pence)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(s)}
                className="gap-1"
              >
                <Pencil className="h-3 w-3" /> Edit
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ServiceForm({
  token,
  service,
  onClose,
  onSaved,
}: {
  token: string
  service: ServiceRow | null
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    name: service?.name ?? '',
    description: service?.description ?? '',
    duration_minutes: service?.duration_minutes ?? 60,
    price_pence: service?.price_pence ?? 0,
    deposit_pence: service?.deposit_pence ?? 1500,
    active: service?.active ?? true,
    sort_order: service?.sort_order ?? 0,
  })

  async function handleSubmit() {
    const method = service ? 'PATCH' : 'POST'
    const body = service ? { ...form, id: service.id } : form

    const res = await fetch('/api/admin/services', {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      toast.success(service ? 'Service updated' : 'Service created')
      onSaved()
    } else {
      toast.error('Failed to save service')
    }
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-foreground">
          {service ? 'Edit Service' : 'New Service'}
        </h2>
        <button onClick={onClose}>
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            value={form.duration_minutes}
            onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Price (pence)</Label>
          <Input
            type="number"
            value={form.price_pence}
            onChange={(e) => setForm({ ...form, price_pence: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Deposit (pence)</Label>
          <Input
            type="number"
            value={form.deposit_pence}
            onChange={(e) => setForm({ ...form, deposit_pence: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Sort Order</Label>
          <Input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={form.active}
            onCheckedChange={(checked) => setForm({ ...form, active: checked })}
          />
          <Label>Active</Label>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button onClick={handleSubmit}>{service ? 'Update' : 'Create'}</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  )
}
