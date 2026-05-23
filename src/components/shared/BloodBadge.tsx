interface BloodBadgeProps {
  group: string;
  size?: number;
  textSize?: string;
}

export default function BloodBadge({ group, size = 50, textSize = "18px" }: BloodBadgeProps) {
  return (
    <div
      className="flex items-center justify-center rounded-xl font-black text-rakta-red"
      style={{
        width: size,
        height: size,
        backgroundColor: "#FFEBEE",
        fontSize: textSize,
      }}
    >
      {group}
    </div>
  );
}
