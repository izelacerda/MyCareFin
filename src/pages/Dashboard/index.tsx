import React, { useState, useEffect, useCallback }  from 'react'
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from "styled-components";
import { useAuth } from '../../hooks/auth';

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'
import { 
  Container, 
  Header, 
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreetings,
  Username,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer
} from './styles'

export interface DataListProps extends TransactionCardProps {
  id: string;
}
interface HighlightProps {
  amount: string;
  lastTransaction: string;
}
interface HighlightData {
  entries: HighlightProps,
  expensives: HighlightProps,
  total: HighlightProps,
}

function getLastTransactionDate(
  collection: DataListProps[],
  type: 'positive' | 'negative'
  ): string {
  const collectionFilttered = collection
  .filter((transaction) => transaction.type === type);
  if(collectionFilttered.length === 0) {
    return '';
  }
  const lastTransaction = new Date( Math.max.apply(Math, collectionFilttered
    .map((transaction) => new Date(transaction.date).getTime())
  ));
  return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;

}
export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);
  const theme = useTheme();
  const { user, signOut } = useAuth();

  // const data: DataListProps[] = [
  //   {
  //     id: "1",
  //     type: "positive",
  //     title: "Desenvolvimento de site",
  //     amount: "R$ 12.000,00",
  //     category: {
  //       name: "Vendas",
  //       icon: 'dollar-sign'
  //     },
  //     date: "13/04/2021",
  //   },
  //   {
  //     id: "2",
  //     type: "negative",
  //     title: "Hamburgueria Pizzy",
  //     amount: "R$ 59,00",
  //     category: {
  //       name: "Alimentação",
  //       icon: 'coffee'
  //     },
  //     date: "15/05/2021",
  //   },
  //   {
  //     id: "3",
  //     type: "negative",
  //     title: "Aluguel do apartamento",
  //     amount: "R$ 1.200,00",
  //     category: {
  //       name: "Casa",
  //       icon: 'shopping-bag'
  //     },
  //     date: "15/05/2021",
  //   }
  // ];
  async function loadTransactions() {
    const dataKey = `@mycarefin:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];
    let entriesTotal = 0;
    let expensiveTotal = 0;
    const transactionsFormated: DataListProps[] = transactions.map((item: DataListProps)=> {
      if(item.type === 'positive') {
        entriesTotal += Number(item.amount);
      } else {
        expensiveTotal += Number(item.amount);
      }
      const amount = Number(item.amount)
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date));
      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      }
    });
    setTransactions(transactionsFormated); 
    const lastTransactionsEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionsExpensives = getLastTransactionDate(transactions, 'negative');
    const totalInterval = lastTransactionsExpensives === '' 
    ? 'Não há transações'
    : `01 a ${lastTransactionsExpensives}`

    const total = entriesTotal - expensiveTotal;

    setHighlightData( {
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionsEntries === '' 
        ? 'Não há transações'
        : `Ultima entrada dia ${lastTransactionsEntries}`
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionsExpensives === '' 
        ? 'Não há transações'
        : `Ultima saída dia ${lastTransactionsExpensives}` 
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    });
    setIsLoading(false);
  };
  useEffect(() => {
    loadTransactions();
    // const dataKey = '@mycarefin:transactions';
    // AsyncStorage.removeItem(dataKey);
 },[])

 useFocusEffect(useCallback(() => {
   loadTransactions();
 },[]));

  return (
    <Container>
      
      { 
        isLoading ? 
          <LoadContainer>
            <ActivityIndicator 
              color={theme.colors.primary} 
              size="large"
            />
          </LoadContainer> :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreetings>Óla,</UserGreetings>
                  <Username>{user.name}</Username>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard 
              type="up"
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlightCard 
              type="down"
              title="Saídas"
              amount={highlightData.expensives.amount}
              lastTransaction={highlightData.expensives.lastTransaction}
            />
            <HighlightCard 
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
            />
          </HighlightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionList 
              data={transactions}
              keyExtractor={item  => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />        
          </Transactions>
        </> 
      }
    </Container>
  )
}