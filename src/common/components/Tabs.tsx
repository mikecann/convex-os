import React, { useState } from "react";

interface TabPanel {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabPanel[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export function Tabs({
  tabs,
  defaultActiveTab,
  onTabChange,
  className = "",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <section className={`tabs ${className}`}>
      <menu role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-controls={tab.id}
            aria-selected={activeTab === tab.id}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </menu>
      {tabs.map((tab) => (
        <article
          key={tab.id}
          role="tabpanel"
          id={tab.id}
          hidden={activeTab !== tab.id}
        >
          {tab.content}
        </article>
      ))}
    </section>
  );
}
