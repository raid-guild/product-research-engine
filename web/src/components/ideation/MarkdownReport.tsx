import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents: Components = {
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto border border-border">
      <table className="m-0 w-full min-w-[680px] border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-muted/70 px-4 py-3 text-left font-heading text-sm text-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-4 py-3 align-top text-sm text-muted-foreground">
      {children}
    </td>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-secondary"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
};

type MarkdownReportProps = {
  content: string;
};

export function MarkdownReport({ content }: MarkdownReportProps) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-foreground prose-code:text-primary prose-pre:border prose-pre:border-border prose-pre:bg-card">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
