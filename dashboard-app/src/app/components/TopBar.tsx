import {
  Bell,
  ChevronDown,
  Search,
  HelpCircle,
  Menu,
  Building2,
  SlidersHorizontal,
  User,
  BookOpen,
} from "lucide-react";

export default function TopBar() {
  return (
    <header className="bg-[#f6f7f7] border-b px-4 py-2 flex items-center justify-between">

      {/* LEFT */}
      <div className="flex items-center gap-2">

        {/* NEW BUTTON */}
        <div className="flex items-center bg-white border border-gray-300 rounded-full h-9 shadow-sm overflow-hidden">
          <div className="pl-3 pr-2 flex items-center">
            <Building2 size={16} className="text-gray-600" />
          </div>

          <span className="text-sm font-medium text-gray-700 pr-2">
            New
          </span>

          <div className="h-5 w-px bg-gray-300" />

          <button className="px-2 flex items-center hover:bg-gray-100">
            <ChevronDown size={14} className="text-gray-500" />
          </button>
        </div>

        {/* FILTER BUTTON */}
        <button className="w-9 h-9 bg-white border border-gray-300 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-100">
          <SlidersHorizontal size={16} className="text-gray-600" />
        </button>
      </div>

      {/* CENTER SEARCH */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-[420px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search for anything"
            className="w-full bg-white border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* RIGHT (UPDATED) */}
      <div className="flex items-center gap-6 text-[#5f6f73]">

        {/* NOTIFICATION */}
        <div className="relative cursor-pointer">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </div>

        {/* USER */}
        <User size={18} className="cursor-pointer" />

        {/* MENU */}
        <Menu size={18} className="cursor-pointer" />

        {/* HELP (ICON + TEXT) */}
        <div className="flex items-center gap-1 cursor-pointer">
          <HelpCircle size={18} />
          <span className="text-sm">Help</span>
        </div>

        {/* LAST ICON – FULL CIRCLE HOVER */}
        <button
          className="
            w-9 h-9
            flex items-center justify-center
            rounded-full
            text-[#0f766e]
            hover:bg-[#0f766e]
            hover:text-white
            transition-all duration-200
          "
        >
          <BookOpen size={18} />
        </button>

      </div>
    </header>
  );
}
