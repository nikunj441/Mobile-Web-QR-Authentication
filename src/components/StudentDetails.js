import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Modal, TouchableHighlight, TouchableOpacity, StyleSheet } from 'react-native';

const StudentDetails = ({ rollNumber, phoneNumberInfo, showScanButton, updateScan }) => {
  const [distance, setDistance] = useState('');
  const [residence, setResidence] = useState('');
  const [income, setIncome] = useState('');
  const [transport, setTransport] = useState('');
  const [participation, setParticipation] = useState(-1);
  const [modalVisibleResidence, setModalVisibleResidence] = useState(false);
  const [modalVisibleTransport, setModalVisibleTransport] = useState(false);
  const BASE_URL = `https://skoolai-server.onrender.com`
  const addStudent = async ()  => {
    const url = `${BASE_URL}/addStudent`; 
  
    try {
      const response =  await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollNumber, phoneNumberInfo, distance, residence, transport, income, participation }),
      });
      

      const responseData =  await response.json();
      updateScan(showScanButton);
      console.log('Response data:', responseData); 
    

    } catch (error) {
      console.error('Error sending data to server:', error);
     
    }
  }
  const handleSaveDetails = () => {
    // Validate if all fields are filled
    if (!residence || !distance || participation==-1) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    } else {

      addStudent();
      // Save details logic goes here
      console.log('Details saved:', {
        rollNumber,
        phoneNumberInfo,
        distance,
        residence,
        income,
        participation
      });

       
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Roll Number: {rollNumber}</Text>
      <Text style={styles.text}>Phone Number: {phoneNumberInfo}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Distance in KM"
        onChangeText={text => setDistance(text)}
        value={distance}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Income per annum without ',' or '-'"
        onChangeText={text => setIncome(text)}
        value={income}
        keyboardType="numeric"
      />
      <TouchableHighlight
        style={styles.button}
        onPress={() => setModalVisibleResidence(true)}
      >
        <Text style={styles.buttonText}>{residence || 'Select Residence'}</Text>
      </TouchableHighlight>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleResidence}
        onRequestClose={() => {
          setModalVisibleResidence(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.text}>Select Residence</Text>
            <View style={styles.buttonContainer}>
              <Button title="House" onPress={() => { setResidence('House'); setModalVisibleResidence(false); }} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Hostel" onPress={() => { setResidence('Hostel'); setModalVisibleResidence(false); }} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Flat" onPress={() => { setResidence('Flat'); setModalVisibleResidence(false); }} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="PG" onPress={() => { setResidence('PG'); setModalVisibleResidence(false); }} />
            </View>
          </View>
        </View>
      </Modal>
      <TouchableHighlight
        style={styles.button}
        onPress={() => setModalVisibleTransport(true)}
      >
        <Text style={styles.buttonText}>{transport || 'Select Mode of Transport'}</Text>
      </TouchableHighlight>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleTransport}
        onRequestClose={() => {
          setModalVisibleTransport(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.text}>Mode of Transport</Text>
            <View style={styles.buttonContainer}>
              <Button title="Bus" onPress={() => { setTransport('Bus'); setModalVisibleTransport(false); }} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Walking" onPress={() => { setTransport('Walking'); setModalVisibleTransport(false); }} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Car" onPress={() => { setTransport('Car'); setModalVisibleTransport(false); }} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Bike" onPress={() => { setTransport('Bike'); setModalVisibleTransport(false); }} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Metro" onPress={() => { setTransport('Metro'); setModalVisibleTransport(false); }} />
            </View>
          </View>
        </View>
      </Modal>
      <Text style={styles.text}>Do you participate in any extracurricular activities?</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setParticipation(1)}
        >
          <View style={[styles.radioCircle, { backgroundColor: participation === 1 ? 'black' : 'white' }]}></View>
          <Text style={styles.text}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setParticipation(0)}
        >
          <View style={[styles.radioCircle, { backgroundColor: participation === 0 ? 'black' : 'white' }]}></View>
          <Text style={styles.text}>No</Text>
        </TouchableOpacity>
      </View>
      <Button title="Save Details" onPress={handleSaveDetails} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  button: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 5,
    backgroundColor: 'white',
  },
});

export default StudentDetails;
