import React, { useState } from 'react';

// Import icons
import mailIcon from '../../assets/ui/mail.svg';
import lockIcon from '../../assets/ui/padlock.svg';
import eyeIcon from '../../assets/ui/eye.svg';
import eyeClosedIcon from '../../assets/ui/eye-closed.svg';
import userIcon from '../../assets/ui/FormkitPeople.svg';

interface AuthInputProps {
  label: string;
  type: 'text' | 'email' | 'password';
  name: string;
  placeholder: string;
  required?: boolean;
  className?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  type,
  name,
  placeholder,
  required = true,
  className = ""
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getIcon = () => {
    switch (name) {
      case 'email': return mailIcon;
      case 'password': return lockIcon;
      case 'name':
      case 'surname': return userIcon;
      default: return null;
    }
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <></>
  );
};

export default AuthInput;
