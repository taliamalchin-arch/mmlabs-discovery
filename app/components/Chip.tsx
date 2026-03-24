'use client';

interface ChipProps {
  options: string[];
  selected: string | string[];
  onSelect: (value: string | string[]) => void;
  multi?: boolean;
}

export default function Chip({ options, selected, onSelect, multi = false }: ChipProps) {
  const handleClick = (option: string) => {
    if (multi) {
      const sel = selected as string[];
      if (sel.includes(option)) {
        onSelect(sel.filter(s => s !== option));
      } else {
        onSelect([...sel, option]);
      }
    } else {
      onSelect(selected === option ? '' : option);
    }
  };

  return (
    <div className="chip-group">
      {options.map(option => {
        const isOn = multi
          ? (selected as string[]).includes(option)
          : selected === option;
        return (
          <button
            key={option}
            type="button"
            className={`chip${isOn ? ' on' : ''}`}
            onClick={() => handleClick(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
