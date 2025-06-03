import React, { ReactNode } from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

interface OcultadorTecladoProps {
  children: ReactNode;
}

const OcultadorTeclado: React.FC<OcultadorTecladoProps> = ({
  children
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default OcultadorTeclado;
