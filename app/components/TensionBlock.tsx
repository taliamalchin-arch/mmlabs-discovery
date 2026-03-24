'use client';

interface TensionBlockProps {
  text: string;
}

export default function TensionBlock({ text }: TensionBlockProps) {
  return (
    <div className="tension-block">
      <span className="tension-flag">Needs a decision</span>
      {text}
    </div>
  );
}
