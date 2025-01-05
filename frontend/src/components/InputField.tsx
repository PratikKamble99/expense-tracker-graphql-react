type Props = {
  label: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  onChange: (e: any) => void;
  onBlur?: (e: any) => void;
  value: string;
  disabled?: boolean;
  autoComplete?: string;
  error?: string | null;
  required?: boolean;
};

const InputField = ({
  label,
  id,
  name,
  type = "text",
  placeholder = "",
  onChange,
  value,
  disabled = false,
  error,
  onBlur,
  ...props
}: Props) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        className="mt-1 p-2 w-full border rounded-md text-black focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 disabled:cursor-not-allowed"
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
      {error ? <p className="text-red-600">{error}</p> : null}
    </div>
  );
};

export default InputField;
