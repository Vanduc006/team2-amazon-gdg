import { useState } from 'react'
import { cn } from '../lib/utils'
import { Menu, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link, Outlet } from 'react-router-dom'
// import { Toaster } from "@/components/ui/sonner"

const DashLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false) 
  return (
    <div className='flex h-screen bg-gray-200 text-gray-900'>
        {/* <Toaster/> */}
        <aside
        className={cn(
            "fixed inset-y-0 z-50 flex w-72 flex-col bg-gray-200 transition-transform lg:static lg:translate-x-0 ",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}>
            <div className="flex items-center justify-between h-16 px-6">
            <h2 className="gap-2 text-xl font-semibold cursor-pointer flex items-center justify-content-center">
                {/* <img src="/favicon.svg" className="w-8 h-8 rounded-md mr-2"/> */}
                <img src='/favicon.svg' className='w-10 h-10 rounded-md'/>
                GDG TEAM 2
            </h2>
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <nav className='flex flex-col h-full overflow-auto p-2 scrollbar-hide'>
                <ul className="space-y-1 flex-1 overflow-auto">
                    <li>
                        <Link to="/">
                            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-gray-500 hover:text-white">
                                <div className="flex items-center justify-content-center">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Home
                                </div>
                            </Button>
                        </Link>
                    </li>

                    <li>
                        <Link to="/uservirtual">
                            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-gray-500 hover:text-white">
                                <div className="flex items-center justify-content-center">
                                    <Plus className="h-5 w-5 mr-2" />
                                    User Virtual
                                </div>
                            </Button>
                        </Link>
                    </li>

                    <li>
                        <Link to="/product">
                            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-gray-500 hover:text-white">
                                <div className="flex items-center justify-content-center">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Product
                                </div>
                            </Button>
                        </Link>
                    </li>
                </ul>

            </nav>
        </aside>


        <div className="flex flex-1 flex-col overflow-hidden mx-2">
            <header className="flex h-16 items-center bg-gray-200 ">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>

                </div>
                <div className="flex items-center font-bold">
                    <span className="text-gray-500 text-lg">AMAZON ELECTRONICS ANALYSIS</span>

                </div>
            </header>

            <main className="flex-1 thin-scrollbar overflow-auto p-6 bg-white rounded-lg border-2 border-solid border-slate-200">
                <Outlet/>
            </main>
        </div>
    </div>
  )
}

export default DashLayout