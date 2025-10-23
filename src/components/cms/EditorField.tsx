import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface EditorFieldProps {
  label: string;
  type?: 'text' | 'textarea' | 'select' | 'custom';
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
  children?: ReactNode;
}

export const EditorField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  options,
  children 
}: EditorFieldProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      
      {type === 'text' && (
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="bg-background border-border"
        />
      )}
      
      {type === 'textarea' && (
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="bg-background border-border min-h-[80px]"
        />
      )}
      
      {type === 'select' && options && (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="bg-background border-border">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {type === 'custom' && children}
    </div>
  );
};
