import { useEffect, useState } from 'react';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
    value: number;
    onChange: (value: number) => void;
    showPrefix?: boolean;
}

const toDisplay = (n: number): string =>
    n === 0 ? '' : n.toLocaleString('id-ID');

const parseRaw = (raw: string): number => {
    const digits = raw.replace(/\./g, '').replace(/,/g, '').replace(/[^0-9]/g, '');
    return digits === '' ? 0 : parseInt(digits, 10);
};

export default function CurrencyInput({
    value,
    onChange,
    showPrefix = false,
    className = '',
    ...props
}: CurrencyInputProps) {
    const [display, setDisplay] = useState(toDisplay(value));

    useEffect(() => {
        setDisplay(toDisplay(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const num = parseRaw(raw);
        setDisplay(num === 0 ? '' : num.toLocaleString('id-ID'));
        onChange(num);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setDisplay(toDisplay(value));
        props.onBlur?.(e);
    };

    if (showPrefix) {
        return (
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none select-none">
                    Rp
                </span>
                <input
                    {...props}
                    type="text"
                    inputMode="numeric"
                    value={display}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`pl-9 ${className}`}
                />
            </div>
        );
    }

    return (
        <input
            {...props}
            type="text"
            inputMode="numeric"
            value={display}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={className}
        />
    );
}
