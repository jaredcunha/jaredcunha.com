import { ReactNode } from 'react';
import './Prompt.scss';

interface PromptProps {
  children: ReactNode;
}

export function Prompt({ children }: PromptProps) {
  return (
    <div className="prompt">
      <div className="prompt__avatar">
        <span className="prompt__initial">
          <span className="sr-only">Prompt from: </span>J
        </span>
      </div>
      <div className="prompt__content">{children}</div>
      <p className="sr-only">end of prompt</p>
    </div>
  );
}
