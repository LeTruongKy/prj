'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ActivityRecord {
  registration_id: number
  activity_id: number
  activity_title: string
  registered_date: string
  status: 'REGISTERED' | 'CHECKED_IN' | 'CANCELLED' | 'PENDING' | 'VERIFIED'
  registration_status_id: number
  check_in_time?: string
  proof_url?: string
}

interface ActivityHistoryTableProps {
  activities: ActivityRecord[]
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    REGISTERED: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
    CHECKED_IN: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
    PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
    VERIFIED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    REGISTERED: 'Registered',
    CHECKED_IN: 'Checked In',
    CANCELLED: 'Cancelled',
    PENDING: 'Pending Proof',
    VERIFIED: 'Verified',
  }
  return labels[status] || status
}

export default function ActivityHistoryTable({ activities }: ActivityHistoryTableProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No activities found in this category.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Activity Title</TableHead>
            <TableHead>Registered Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.registration_id}>
              <TableCell className="font-medium">{activity.activity_title}</TableCell>
              <TableCell>
                {new Date(activity.registered_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(activity.status)}>
                  {getStatusLabel(activity.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <button className="text-primary hover:underline text-sm font-medium">View</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
