import React from "react";
import Input from "../../atoms/Input/Input";

/**
 * Molécula: FormField
 * Agrupa: Label + Input (o children personalizados) + mensaje de error.
 *
 * Uso con Input por defecto:
 *   <FormField label="Correo" type="email" value={correo} onChange={...} />
 *
 * Uso con children (para Select, Textarea, etc.):
 *   <FormField label="Rol">
 *     <Select ... />
 *   </FormField>
 */
const FormField = ({
  label,
  error,
  required = false,
  children,
  // Props que se pasan al Input interno cuando no hay children:
  type,
  placeholder,
  value,
  onChange,
  disabled,
  className = "",
}) => {
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {children ? (
        // Si se pasan children (ej: <Select>, <Textarea>), los renderiza directamente
        React.cloneElement(children, { hasError })
      ) : (
        // Si no, renderiza un Input por defecto
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          hasError={hasError}
        />
      )}

      {hasError && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
