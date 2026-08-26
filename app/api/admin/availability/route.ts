import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAdminRequest } from '@/lib/admin-auth'
import { localDateTimeInputToUtcIso } from '@/lib/appointment-time'

export const dynamic = 'force-dynamic'

// GET availability rules
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const sql = getDb()
  const rules = await sql`SELECT * FROM availability_rules ORDER BY weekday ASC`
  return NextResponse.json({ rules })
}

// POST create/update a rule
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const sql = getDb()

  // Upsert: delete existing rule for this weekday, then insert
  await sql`DELETE FROM availability_rules WHERE weekday = ${body.weekday}`
  if (body.enabled !== false) {
    await sql`
      INSERT INTO availability_rules (weekday, start_time, end_time, buffer_minutes)
      VALUES (${body.weekday}, ${body.start_time}, ${body.end_time}, ${body.buffer_minutes || 15})
    `
  }
  return NextResponse.json({ success: true })
}

// GET blocked times
export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const sql = getDb()
  const blocked = await sql`SELECT * FROM blocked_times ORDER BY start_at DESC`
  return NextResponse.json({ blocked })
}

// PATCH add blocked time
expo…33930 tokens truncated…t.target.value)} className="mt-1 rounded-full" />
                </div>
                <div>
                  <label className="text-sm font-medium">Reason</label>
                  <Input
                    type="text"
                    placeholder="Holiday, personal time, training"
                    value={blockReason}
                    onChange={(event) => setBlockReason(event.target.value)}
                    className="mt-1 rounded-full"
                  />
                </div>
              </div>

              <Button
                onClick={addBlockedTime}
                disabled={processingActionId === 'add-blocked' || !blockStart || !blockEnd}
                className="rounded-full"
              >
                {processingActionId === 'add-blocked' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add blocked time
              </Button>

              <div className="grid gap-2">
                {blockedTimes.length > 0 ? (
                  blockedTimes.map((blocked) => (
                    <div key={blocked.id} className="flex items-start justify-between gap-3 rounded-2xl border border-foreground/10 bg-background/70 p-3">
                      <div className="flex min-w-0 items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {formatAppointmentDate(blocked.start_at)} {formatAppointmentTime(blocked.start_at)} -{' '}
                            {formatAppointmentDate(blocked.end_at)} {formatAppointmentTime(blocked.end_at)}
                          </p>
                          {blocked.reason && <p className="mt-1 text-xs text-muted-foreground">{blocked.reason}</p>}
                        </div>
                      </div>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => deleteBlockedTime(blocked.id)}
                        disabled={processingActionId === `delete-blocked-${blocked.id}`}
                        className="rounded-full text-muted-foreground hover:text-destructive"
                        aria-label="Delete blocked time"
                      >
                        {processingActionId === `delete-blocked-${blocked.id}` ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-foreground/15 bg-background/65 p-5 text-center">
                    <p className="text-sm text-muted-foreground">No blocked time set.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
