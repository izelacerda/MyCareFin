import React, { useState }  from 'react'
import { Modal, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { useAuth } from '../../hooks/auth';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { OptionButton } from '../../components/Form/OptionButton';
import { SelectButton } from '../../components/Form/SelectButton';
import { CategorySelect } from '../CategorySelect';

import { 
  Container, 
  Header,
  Title,
  Form,
  Fields,
  OptionTypes,
} from './styles'

interface FormData {
  name: string;
  amount: string;
}
const schema = Yup.object().shape({
  name: Yup
  .string()
  .required('Nome é Obrigatório'),
  amount: Yup
  .number()
  .typeError('Informe um valor númerico')
  .positive('O valor não pode ser negativo')
  // .required('O valor é obrigatório')  
})
export function Register() {
  const [optionType, setOptionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const { user } = useAuth();

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });
  const navigation = useNavigation();
  const {
    control, 
    handleSubmit,
    reset,
    formState: { errors }
   } = useForm({
    resolver: yupResolver(schema)
  });

  function handleOptionButtonSelect(type: 'positive' | 'negative') {
    setOptionType(type);
  }
  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }
  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }
  async function handleRegister(form: FormData) {
    if(!optionType) {
      return Alert.alert('Selecione o Tipo da Transação');
    }
    if(category.key === 'category') {
      return Alert.alert('Selecione o Tipo a Category');
    }
    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: optionType,
      category: category.key,
      date: new Date()
    }
    try {
      const dataKey = `@mycarefin:transactions_user:${user.id}`;
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];
      const dataFormatted = [
        ...currentData,
        newTransaction
      ];
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
      reset();
      setOptionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });
      navigation.navigate('Listagem');
    } catch (error) {
      Alert.alert('Erro ao gravar');
      
    }
  }

  
  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
      <Container>
        <Header>
          <Title>
            Cadastro
          </Title>
        </Header>
        <Form>
          <Fields>
            <InputForm 
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
              />
            <InputForm 
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
              />
            <OptionTypes>
              <OptionButton 
                type="up" 
                title="Income"
                onPress={() => handleOptionButtonSelect('positive')}
                isActive={optionType === 'positive'}
                />
              <OptionButton 
                type="down" 
                title="Outcome" 
                onPress={() => handleOptionButtonSelect('negative')}
                isActive={optionType === 'negative'}
                />
            </OptionTypes>
            <SelectButton 
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
              />
          </Fields>
          <Button 
            title="Enviar" 
            onPress={handleSubmit(handleRegister)}
            />
        </Form>

        <Modal 
          visible={categoryModalOpen}>
          <CategorySelect 
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
            />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}