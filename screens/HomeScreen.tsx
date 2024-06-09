import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import userData from '../data/leaderboard.json';

const HomeScreen = () => {
  const [userName, setUserName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [sortedBy, setSortedBy] = useState('bananas');

  const handleSearch = () => {
    const users = Object.values(userData);
    const user = users.find(u => u.name.toLowerCase() === userName.toLowerCase());
    if (!user) {
      Alert.alert('Error', 'This user name does not exist! Please specify an existing user name!');
      return;
    }

    const sortedUsers = users.sort((a, b) => b.bananas - a.bananas).slice(0, 10);
    const userInTop10 = sortedUsers.find(u => u.name === user.name);
    if (!userInTop10) {
      const lastUser = sortedUsers[9];
      sortedUsers[9] = user;
      user.rank = users.findIndex(u => u.uid === user.uid) + 1;
      lastUser.rank = 10;
    } else {
      user.rank = sortedUsers.findIndex(u => u.uid === user.uid) + 1;
    }

    setLeaderboard(sortedUsers.map((u, index) => ({ ...u, rank: index + 1 })));
  };

  const handleSort = (criteria) => {
    const sortedUsers = [...leaderboard].sort((a, b) => {
      if (criteria === 'name') {
        return a.name.localeCompare(b.name);
      }
      return b.bananas - a.bananas;
    });
    setSortedBy(criteria);
    setLeaderboard(sortedUsers);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={userName}
          onChangeText={setUserName}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sort by Name" onPress={() => handleSort('name')} />
        <Button title="Sort by Bananas" onPress={() => handleSort('bananas')} />
      </View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title numeric>Rank</DataTable.Title>
          <DataTable.Title numeric>Bananas</DataTable.Title>
        </DataTable.Header>
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <DataTable.Row style={item.name.toLowerCase() === userName.toLowerCase() ? styles.highlight : null}>
              <DataTable.Cell>{item.name}</DataTable.Cell>
              <DataTable.Cell numeric>{item.rank}</DataTable.Cell>
              <DataTable.Cell numeric>{item.bananas}</DataTable.Cell>
            </DataTable.Row>
          )}
        />
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop : 80,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  highlight: {
    backgroundColor: 'yellow',
  },
});

export default HomeScreen;
