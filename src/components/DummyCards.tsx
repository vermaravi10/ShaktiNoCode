import React from "react";

interface DummyCardProps {
  imageUrl: string;
  name: string;
  usageCount: number;
}

const DummyCard: React.FC<DummyCardProps> = ({
  imageUrl,
  name,
  usageCount,
}) => (
  <div
    style={{
      //   border: "1px solid",
      borderRadius: 8,
      width: 250,
      padding: 16,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      textAlign: "center",
      //   background: "black",
    }}
  >
    <img
      src={imageUrl}
      alt={name}
      style={{
        width: "100%",
        height: 170,
        objectFit: "cover",
        borderRadius: 6,
        backgroundColor: "black",
      }}
    />
    <div
      style={{ marginTop: 12, fontWeight: 600, fontSize: 18, color: "white" }}
    >
      {name}
    </div>
    <div style={{ marginTop: 6, color: "#888", fontSize: 14 }}>
      Remixed {usageCount} times
    </div>
  </div>
);

export default DummyCard;
