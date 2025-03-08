import React from "react";

export default function Title({ content }: { content: string }) {
  return (
    <h3 className="text-xl font-semibold text-primary">
      Department: {content}
    </h3>
  );
}
