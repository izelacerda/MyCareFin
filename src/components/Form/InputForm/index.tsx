import React from "react";
import { Control, Controller } from "react-hook-form";
import { TextInputProps } from "react-native";

import { Input } from '../Input'

import { Container, Error } from './styles';

interface Props extends TextInputProps {
  control: Control;
  name: string;
  error: string;
}

export function InputForm({
  control,
  name,
  error,
  ...rest
} : Props){
  return (
    <Container>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value }}) => (
          <Input 
            onChangeText={onChange}
            value={value}
            {...rest}
          />
        )}
        name={name}
      />
      {error && <Error>{error}</Error>}
    </Container>
  )
}