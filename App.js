/* eslint-disable react-native/no-inline-styles */
// App.js
import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const App = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between Sign Up and Login

  // Sign Up Function
  const handleSignUp = async () => {
    if (email && password && username) {
      try {
        const userCredential = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        const user = userCredential.user;

        // Store the username in Firestore
        await firestore().collection('Users').doc(user.uid).set({
          username: username,
          email: user.email,
        });

        Alert.alert('Success!', 'User registered successfully');
        // Clear input fields
        setEmail('');
        setPassword('');
        setUsername('');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
  };

  // Log In Function
  const handleLogin = async () => {
    if (email && password) {
      try {
        const userCredential = await auth().signInWithEmailAndPassword(
          email,
          password,
        );
        Alert.alert('Success!', `Welcome back, ${userCredential.user.email}`);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'Please fill in both email and password');
    }
  };

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>
        {isSignUp ? 'Sign Up' : 'Login'}
      </Text>

      {isSignUp && (
        <>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={{marginBottom: 10, borderWidth: 1, padding: 10}}
          />
        </>
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{marginBottom: 10, borderWidth: 1, padding: 10}}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{marginBottom: 10, borderWidth: 1, padding: 10}}
      />

      <Button
        title={isSignUp ? 'Sign Up' : 'Login'}
        onPress={isSignUp ? handleSignUp : handleLogin}
      />

      <Button
        title={
          isSignUp ? 'Already have an account? Login' : 'New user? Sign Up'
        }
        onPress={() => setIsSignUp(!isSignUp)}
        color="gray"
        style={{marginTop: 10}}
      />
    </View>
  );
};

export default App;
