import type { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <article className="card">
      <header className="card__header">
        <h2>{title}</h2>
      </header>
      <div className="card__body">{children}</div>
    </article>
  );
}
