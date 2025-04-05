import { useState } from "react";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("notice board");

  return (
    <div className="w-full mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-300">
        {["notice board", "activity logs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-3 text-sm font-medium capitalize flex-1 transition-all 
              ${
                activeTab === tab
                  ? "text-green-700 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-[3px] bg-green-700 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5 text-gray-700 text-sm">
        {activeTab === "notice board" && <div>🏠 No notice for you yet!</div>}
        {activeTab === "activity logs" && (
          <div>👤 You haven't logged an activity.</div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
