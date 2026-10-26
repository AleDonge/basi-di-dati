import {diagramSchema} from "@/lib/er/model";
import {ErStaticDiagram} from "@/components/er/diagram";
import { isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { headingId, localContentUrl } from "@/lib/content/markdown";

export function LessonMarkdown({ body }: { body: string }) {
  return <div className="lesson-prose"><ReactMarkdown skipHtml remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { trust: false, strict: "error", throwOnError: true }]]} urlTransform={localContentUrl} disallowedElements={["img"]} components={{
    h2: ({ children }) => <h2 id={headingId(String(children))}>{children}</h2>,
    table: ({ children }) => <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabella della lezione"><table>{children}</table></div>,
    pre: ({ children }) => {
      if (isValidElement<{ className?: string; children?: ReactNode }>(children) && children.props.className === "language-diagram") {
        const steps = String(children.props.children).trim().split("→").map(s => s.trim());
        return <figure className="lesson-diagram"><figcaption>Schema esplicativo aggiuntivo</figcaption><ol>{steps.map((step, i) => <li key={i}>{step}</li>)}</ol></figure>;
      }
      if(isValidElement<{className?:string;children?:ReactNode}>(children)&&children.props.className==="language-erdiagram"){
        try{return <ErStaticDiagram diagram={diagramSchema.parse(JSON.parse(String(children.props.children)))}/>;}catch{return <p>Diagramma ER non valido: contenuto da revisionare.</p>;}
      }
      return <pre tabIndex={0}>{children}</pre>;
    },
    a: ({ href, children }) => href ? <a href={href}>{children}</a> : <span>{children}</span>,
  }}>{body}</ReactMarkdown></div>;
}
