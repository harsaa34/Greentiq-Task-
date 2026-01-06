interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = ["Activities", "Contacts", "Projects", "Sales", "Requests"];

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="flex gap-4 bg-white p-3 rounded-xl shadow text-sm">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-full ${
            tab === activeTab
              ? "bg-emerald-100 text-emerald-700 font-medium"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}