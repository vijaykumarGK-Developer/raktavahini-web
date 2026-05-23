interface SegmentedControlProps {
  items: string[];
  isFirstActive: boolean;
  onTabSwitch: (isFirst: boolean) => void;
}

export default function SegmentedControl({ items, isFirstActive, onTabSwitch }: SegmentedControlProps) {
  return (
    <div className="flex w-full bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
      {items.map((title, i) => {
        const active = i === 0 ? isFirstActive : !isFirstActive;
        return (
          <button
            key={title}
            onClick={() => onTabSwitch(i === 0)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-colors ${
              active
                ? "bg-white dark:bg-gray-800 text-rakta-red shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {title}
          </button>
        );
      })}
    </div>
  );
}
