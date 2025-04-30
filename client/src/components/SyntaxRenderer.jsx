import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function SyntaxRenderer({ text }) {
  try {
    const blocks = text.split(/```/);
    return blocks.map((block, index) => {
      if (index % 2 === 1) {
        const [langLine, ...codeLines] = block.split("\n");
        const lang = langLine.trim().toLowerCase() || "text";
        const code = codeLines.join("\n");
        return (
          <SyntaxHighlighter key={index} language={lang} style={oneDark}>
            {code}
          </SyntaxHighlighter>
        );
      }
      return (
        <p key={index} className="mb-2 whitespace-pre-wrap">
          {block}
        </p>
      );
    });
  } catch (e) {
    return <p className="text-red-500">⚠️ Error rendering message.</p>;
  }
}
