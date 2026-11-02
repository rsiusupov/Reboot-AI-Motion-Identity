import { AbsoluteFill } from "remotion";

export const MyComposition = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B0B0C",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          color: "#F4F4F5",
          fontFamily: "system-ui, sans-serif",
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: "-0.03em",
        }}
      >
        Reboot
      </div>
    </AbsoluteFill>
  );
};
