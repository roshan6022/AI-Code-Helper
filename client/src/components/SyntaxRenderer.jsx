import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function SyntaxRenderer({ text }) {
  try {
    const blocks = text.split(/```/);

    return (
      <>
        {blocks.map((block, index) => {
          // Code block
          if (index % 2 === 1) {
            const [langLine = "", ...codeLines] = block.split("\n");
            const language = langLine.trim().toLowerCase() || "text";
            const code = codeLines.join("\n").trim();

            return (
              <SyntaxHighlighter
                key={index}
                language={language}
                style={oneDark}
                customStyle={{
                  borderRadius: "12px",
                  padding: "0.75rem 0.5rem",
                }}
              >
                {code}
              </SyntaxHighlighter>
            );
          }

          // Text block
          return (
            <p key={index} className="mb-3 whitespace-pre-wrap leading-relaxed">
              {block.trim()}
            </p>
          );
        })}
      </>
    );
  } catch (e) {
    console.error("🛑 SyntaxRenderer error:", e);
    return <p className="text-red-500">⚠️ Error rendering code snippet.</p>;
  }
}
