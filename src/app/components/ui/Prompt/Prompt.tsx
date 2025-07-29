import { ReactNode } from 'react';
import './Prompt.scss';

interface PromptProps {
  children: ReactNode;
}

export function Prompt({ children }: PromptProps) {
  return (
    <div className="prompt">
      <div className="prompt__avatar">
        <span className="prompt__initial">J</span>
      </div>
      <div className="prompt__content">{children}</div>
    </div>
  );
}
