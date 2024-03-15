import { cn } from '@/src/lib/utils';
import * as React from 'react';

import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/src/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover';
import { Check, ChevronsUpDown, X } from 'lucide-react';

export type OptionType = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: OptionType[];
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
  inputClassName?: string;
  name?: string;
  placeholder?: string;
}

function MultiSelect({
  options,
  selected,
  onChange,
  className,
  inputClassName,
  ...props
}: MultiSelectProps) {
  // const { register } = useFormContext(); // Get the useFormContext hook
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`tw-w-full tw-justify-between ${inputClassName}  ${
            selected.length > 1 ? 'tw-h-full' : 'tw-h-10'
          }`}
          onClick={() => setOpen(!open)}
        >
          <div className="tw-flex tw-gap-1 tw-flex-wrap">
            {selected.map((item) => (
              <Badge
                variant="secondary"
                key={item}
                className="tw-mr-1 tw-mb-1"
                onClick={() => handleUnselect(item)}
              >
                {item}
                <button
                  className="tw-ml-1 tw-ring-offset-background tw-rounded-full tw-outline-none focus:tw-ring-2 focus:tw-ring-ring focus:tw-ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(item)}
                >
                  <X className="tw-h-3 tw-w-3 tw-text-muted-foreground hover:tw-text-foreground" />
                </button>
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className="tw-h-4 tw-w-4 tw-shrink-0 tw-opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="tw-w-full tw-p-0">
        <Command className={className}>
          <CommandInput placeholder="Search ..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup className="tw-max-h-64 tw-overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter((item) => item !== option.value)
                        : [...selected, option.value]
                    );
                    setOpen(true);
                  }}
                >
                  <Check
                    className={cn(
                      'tw-mr-2 tw-h-4 tw-w-4',
                      selected.includes(option.value)
                        ? 'tw-opacity-100'
                        : 'tw-opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
