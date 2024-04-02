import React, {useState} from 'react';  

import { View, Text, Button, Alert, TextInput } from 'react-native';
import SmsRetriever from 'react-native-sms-retriever';
import { PermissionsAndroid } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import { ViewPropTypes } from 'deprecated-react-native-prop-types'
import axios from 'axios';

import StudentDetails from './components/StudentDetails';

const App = () => {
  const [phoneNumberInfo, setPhoneNumberInfo] = useState(0);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [showScanButton, setShowScanButton] = useState(false);

  const [showDetails, setShowDetails] = useState(false)
  //**********************************Request Phone Number****************************
  const requestPhoneNumber = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
    );
 

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted, now access SIM card information
        try {
          const phoneNumber = await SmsRetriever.requestPhoneNumber();                        
          const phoneWithoutCountryCode = phoneNumber.replace(/^\+91/, ''); 
          setPhoneNumberInfo(phoneWithoutCountryCode);
          console.log(phoneWithoutCountryCode,"Phone number without country code",);
         
        
        } catch (error) {
          console.log(JSON.stringify(error));
        }
      } else {
        
       console.log('')
      }
    
    
  };

  const updateScan = (showScanButton) =>{
    setShowDetails(false)
    setScannerOpen(!scannerOpen)
  }
  const handleProceed=()=>{
    handleProceedData(rollNumber,phoneNumberInfo)
  }

  const handleProceedData = async(rollNumber, phoneNumberInfo) => {
    const url = `http://172.18.2.12:8000/validateStudent`; 
   

    try {
      const response =  await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollNumber, phoneNumberInfo }),
      });
      

      const responseData =  await response.json();
      console.log('Response data:', responseData); 
     

     if(responseData.exists===1){
      setScannerOpen(true)
     }else if(responseData.exists === 0){
       setShowDetails(true)
     }else{
      setMessage("Phone Number and roll number didn't match");
     }
        
   

    } catch (error) {
      console.error('Error sending data to server:', error);
      setMessage('Failed to record attendance'); // Handle error
    }

  };



  /***************  Validate Student Ends *****************/
  
  /***************  Scan Starts *****************/
  const handleExitScanPress = () => {
    if (phoneNumberInfo !== 0) {
      setScannerOpen(false);
    }
    else{
      Alert.alert('Enter phone number first');
    }
  };

  const renderScanner = () => {
    return (
      <QRCodeScanner
        onRead={onSuccess}
        
        reactivate={true}
        reactivateTimeout={500}
      />
    );
  };

  const onSuccess = (event) => {
    // Handle the scanned QR code data
    const scannedData = event.data;
    sendToServer(phoneNumberInfo, scannedData);
    setScannerOpen(false);   
  };

  //send data to server
  const sendToServer = async(phoneNumberInfo, scannedData) => {
    const url = `http://172.18.2.12:8000/authenticateAttendance`; 
   

    try {
      const response =  await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumberInfo, scannedData }),
      });
      
      
      setScannerOpen(false);
     
      const responseData =  await response.json();
      console.log('Response data:', responseData); 
      setMessage(responseData.message);
      console.log(responseData.message);
    } catch (error) {
      console.error('Error sending data to server:', error);
      setMessage('Error: Failed to record attendance'); // Handle error
    }

  };

  const renderMessage = () => {
    // Render message component in the center of the screen
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'green', fontSize: 20 }}>{message}</Text>
      </View>
    );
  };

  

  return (
    
    <View style={{ flex: 1 }}>
    {showDetails ? (
      // If showDetails state is set, render StudentDetails component
      <StudentDetails phoneNumberInfo={phoneNumberInfo} rollNumber={rollNumber} scannerOpen={scannerOpen} updateScan={updateScan}/>
    ) : (
      // If showDetails state is not set, render main UI components
      message ? renderMessage() :
      (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
            placeholder="Enter Roll Number"
            onChangeText={text => setRollNumber(text)}
            value={rollNumber}
          />
          <Button title="Get Phone Number" onPress={requestPhoneNumber} style={{ marginBottom: 20 }} />
          <Text>Phone Number: {phoneNumberInfo}</Text>
          {phoneNumberInfo != 0 && rollNumber != '' && (
            <View style={{ marginTop: 20 }}>
              <Button title="Proceed" onPress={handleProceed} />
            </View>
          )}
          {scannerOpen && renderScanner()}
          {scannerOpen && <Button title='Exit' onPress={handleExitScanPress} />}
        </View>
      )
    )}
  { /* <View>
      {scannerOpen && renderScanner()}
          </View>*/}
  </View>
  
    
  );
};

export default App;
