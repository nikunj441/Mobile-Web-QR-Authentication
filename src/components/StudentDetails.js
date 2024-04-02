import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Modal, TouchableHighlight, TouchableOpacity, StyleSheet } from 'react-native';

const StudentDetails = ({ rollNumber, phoneNumberInfo, showScanButton, updateScan }) => {
  const [distance, setDistance] = useState('');
  const [residence, setResidence] = useState('');
  const [income, setIncome] = useState('');
  const [participation, setParticipation] = useState(-1);
  const [modalVisible, setModalVisible] = useState(false);
  
  const addStudent = async ()  => {
    const url = `http://172.18.2.12:8000/addStudent`; 
  
    try {
      const response =  await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollNumber, phoneNumberInfo, distance, residence, income, participation }),
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
        placeholder="Enter Distance"
        onChangeText={text => setDistance(text)}
        value={distance}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Income per annum"
        onChangeText={text => setIncome(text)}
        value={income}
        keyboardType="numeric"
      />
      <TouchableHighlight
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>{residence || 'Select Residence'}</Text>
      </TouchableHighlight>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.text}>Select Residence</Text>
            <View style={styles.buttonContainer}>
              <Button title="Home" onPress={() => { setResidence('Home'); setModalVisible(false); }} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Hostel" onPress={() => { setResidence('Hostel'); setModalVisible(false); }} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Flat" onPress={() => { setResidence('Flat'); setModalVisible(false); }} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="PG" onPress={() => { setResidence('PG'); setModalVisible(false); }} />
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
