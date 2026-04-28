// components/global-alert.tsx
'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAlertStore } from "@/store/alert.store"
import { X } from "lucide-react"

export function GlobalAlert() {
  const { show, title, message, type, clearAlert } = useAlertStore()

  if (!show) return null

  return (
    <div className="
      /* Position & Sizing for Mobile (Small-Medium) */
      fixed inset-x-4 top-1/2 -translate-y-1/2 z-50
      w-auto max-w-[90%] mx-auto 
      
      /* Position & Sizing for Desktop (Large and up) */
      lg:inset-x-auto lg:top-4 lg:right-4 lg:translate-y-0
      lg:w-full lg:max-w-md
      
      /* Animation */
      animate-in fade-in zoom-in-95 lg:slide-in-from-top-4
    ">
      <Alert variant={type} className="shadow-2xl border-2">
        <div className="flex justify-between items-start gap-4">
          <div className="py-2 lg:py-0"> {/* Extra padding for mobile legibility */}
            <AlertTitle className="text-lg lg:text-base font-bold">{title}</AlertTitle>
            <AlertDescription className="text-base lg:text-sm mt-1">
              {message}
            </AlertDescription>
          </div>
          <button 
            onClick={clearAlert} 
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-6 w-6 lg:h-4 lg:w-4" /> {/* Larger close icon for mobile touch */}
          </button>
        </div>
      </Alert>
    </div>

    // <div className="fixed top-4 right-4 z-[100] lg:w-full max-w-md animate-in fade-in slide-in-from-top-4">
    //   <Alert variant={type}>
    //     <div className="flex justify-between items-start">
    //       <div>
    //         <AlertTitle>{title}</AlertTitle>
    //         <AlertDescription>{message}</AlertDescription>
    //       </div>
    //       <button onClick={clearAlert} className="text-muted-foreground hover:text-foreground">
    //         <X className="h-4 w-4" />
    //       </button>
    //     </div>
    //   </Alert>
    // </div>
  )
}
