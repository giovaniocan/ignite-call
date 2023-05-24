import { useState } from 'react'
import { CalanderStep } from './CalanderStep'
import { ConfirmStep } from './ConfirmStep'

export function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)

  if (selectedDateTime) {
    return <ConfirmStep schedulingDate={selectedDateTime} />
  }

  return <CalanderStep onSelectDateTime={setSelectedDateTime} />
}
