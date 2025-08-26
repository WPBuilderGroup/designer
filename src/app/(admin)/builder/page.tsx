'use client'

import LeftDock from '../../../components/builder/LeftDock'
import RightInspector from '../../../components/builder/RightInspector'
import Topbar from '../../../components/builder/Topbar'
import CanvasHost from '../../../components/builder/CanvasHost'

export default function Page() {
  return (
    <div className="h-screen w-screen grid grid-cols-[56px_1fr_360px] grid-rows-[48px_1fr] bg-slate-50">
      {/* Topbar spans across all columns */}
      <div className="col-span-3 border-b border-gray-200 bg-white">
        <Topbar />
      </div>

      {/* Left Dock */}
      <div className="bg-gray-800 border-r border-gray-700">
        <LeftDock />
      </div>

      {/* Canvas Area */}
      <div className="bg-gray-100">
        <CanvasHost />
      </div>

      {/* Right Inspector */}
      <div className="bg-white border-l border-gray-200">
        <RightInspector />
      </div>
    </div>
  )
}
