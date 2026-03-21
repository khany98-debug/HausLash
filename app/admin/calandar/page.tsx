'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '../layout'
import { Calendar } from '@/components/ui/calendar'

export default function AdminCalendarPage(){

const { token } = useAdminAuth()

const [date,setDate] = useState<Date>()
const [availability,setAvailability] = useState<Date[]>([])
const [bookings,setBookings] = useState<Date[]>([])

useEffect(()=>{

if(!token) return

fetch('/api/admin/calendar',{
headers:{Authorization:`Bearer ${token}`}
})
.then(r=>r.json())
.then(data=>{

const availableDates = (data.availability || []).map((d:string)=>new Date(d))
const bookedDates = (data.bookings || []).map((d:string)=>new Date(d))

setAvailability(availableDates)
setBookings(bookedDates)

})

},[token])

return(

<div className="flex flex-col gap-6">

<h1 className="font-serif text-2xl">
Booking Calendar
</h1>

<Calendar
mode="single"
selected={date}
onSelect={setDate}

modifiers={{
booked: bookings,
available: availability
}}

modifiersStyles={{
booked:{backgroundColor:'#ef4444',color:'white'},
available:{backgroundColor:'#22c55e',color:'white'}
}}
/>

</div>

)

}