import { EyeOpenIcon } from "@radix-ui/react-icons";
import { EyeClosedIcon } from "lucide-react";

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
  isPassword?: boolean;
  showPassword?: boolean;
  setShowPassword?:  React.Dispatch<React.SetStateAction<boolean>>
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
  isPassword = false,
  showPassword = false,
  setShowPassword,
  ...props
}: Props) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
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
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword &&  setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5F6C72] hover:text-[#0D3F32] transition-colors"
          >
          {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
        </button>
      )}
      </div>
      {error ? <p className="text-red-600">{error}</p> : null}
    </div>
  );
};

export default InputField;
