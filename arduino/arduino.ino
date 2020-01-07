// including lib's
#include <TheThingsNetwork.h>
#include <CayenneLPP.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// Serial com
#define debugSerial Serial
#define loraSerial Serial1

// Lora settings
#define freqPlan TTN_FP_EU868
const char *appEui = "70B3D57ED0022C4A";
const char *appKey = "0EEC435188193DA8E409D5DA099F785D";
TheThingsNetwork ttn(loraSerial, debugSerial, freqPlan);
int counter = 0;
const unsigned long MAX_LONG = 4294967295;  // hiermee kunnen we de lora module maximaal laten slapen zodat als de code niet meer werkt het alsnog stroom minimaliseerd
int max_payload_cayenne = 51;

// Temp settings
#define ONE_WIRE_BUS 10
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensors(&oneWire);

// PH settings
#define PH_sensor A0  // ph-sensor's port
// Salinity settings
#define H1 2    //  Digital pin for Salt 
#define H2 3    //  Digital pin for Salt
#define AnalogSalt A1   // Analog pin for salt measurement

void setup() {
  loraSerial.begin(57600);
  debugSerial.begin(9600);

  // sets the sensors to input
  pinMode(PH_sensor, INPUT);
  pinMode(H1, OUTPUT);
  pinMode(H2, OUTPUT);
  pinMode(AnalogSalt, INPUT); 


  // begins OneWire for the tempsensor
  tempSensors.begin();

  // Wait a maximum of 10s for Serial Monitor
  while (!debugSerial && millis() < 10000);

  ttn.join(appEui, appKey, 3, 10000);        /* als deze gecommend is kan je zonder connectie doorgaan */
}

// global methode to read an analog sensor
float readASensor(uint8_t sensorPin) {
  unsigned long int avgSensorValue = 0;       //Store the average value of the sensor feedback
  int sensorBuff[10];                         //buffer for read analog
  int sensorValue;                            //The sensor value of 1 measurement

  for (int i = 0; i < 10; i++) {              //Get 10 sample value from the sensor for smooth the value
    sensorBuff[i] = analogRead(sensorPin);    //Read the sensor
    delay(10);
  }

  for (int i = 0; i < 9; i++) {               //Sort the analog from small to large
    for (int j = i + 1; j < 10; j++) {
      if (sensorBuff[i] > sensorBuff[j]) {
        int temp = sensorBuff[i];
        sensorBuff[i] = sensorBuff[j];
        sensorBuff[j] = temp;
      }
    }
  }

  for (int i = 2; i < 8; i++) {               //Take the average value of 6 center sample
    avgSensorValue += sensorBuff[i];
  }

  sensorValue = avgSensorValue / 6;
  return (sensorValue / 10.0);
}

// ************************************Kijk bij zoutgehalte in de aantekeningen
//R2(unknown) = (Vout * R1 (known)) / (Vin - Vout)
int getAnalogResistance(uint8_t sensorPin, bool alpha) {
  float KNOWN = 221.0;    // The known resistor value
  float Vin = 5.0;        // Volt input
  float Vout = 0;         // Volt output
  float R2 = 0;           // Resistor value
  int raw = 0;            // The raw data
  float buffer = 0;

  raw = analogRead(sensorPin);
  Vout = (raw / 1023.0) * 5.0;

  if(alpha) {
    buffer = Vout * KNOWN;
    R2 = buffer / (Vin - Vout);
  } else {
    buffer = (KNOWN * Vin) - (KNOWN * Vout);
    R2 = buffer / Vout;
  }

  Serial.print("R2: ");
  Serial.println(R2);
  return R2;
} 

float measureSalinity(uint8_t sensorPin) {
  digitalWrite(H1, HIGH);
  digitalWrite(H2, LOW);
  int salt_Alpha = getAnalogResistance(sensorPin, true);
  delay(50);
  
  digitalWrite(H1, LOW);
  digitalWrite(H2, HIGH);
  int salt_Beta = getAnalogResistance(sensorPin, false);
  return ((salt_Alpha + salt_Beta)/2)/10.0;
}

void goSleep(int milliss) {
  delay(milliss);
}

void loop() {
  // we want to see when something was measured, so if we send multiple at once we will know what data was recent
  if(counter > 300){
    counter = 0;
  }

  // de data die verstuurd wordt
  tempSensors.requestTemperatures();
  /* No Number (28 AA 52 EB 52 14 1 FB) */
  float waterTemp = tempSensors.getTempCByIndex(0);        // waterTemp
  debugSerial.print("WaterTemp: ");
  debugSerial.println(waterTemp);

  /* NR 1 (28 AA 16 5D 53 14 1 3E) */
  float airTemp = tempSensors.getTempCByIndex(1);          // airTemp
  debugSerial.print("Air Temp: ");
  debugSerial.println(airTemp);

  // PH
  float ph = readASensor(PH_sensor); // phSensorValue
  debugSerial.print("PH sensordata: ");
  debugSerial.print(ph);

  // Zoutgehalte
  float zoutgehalte = measureSalinity(AnalogSalt);
  debugSerial.print("Zoutgehalte: ");
  debugSerial.println(zoutgehalte);

  // Gather the data to send it
  CayenneLPP lpp(max_payload_cayenne);
  lpp.addTemperature(1, waterTemp);
  lpp.addTemperature(2, airTemp);
  lpp.addAnalogInput(1, ph);
  lpp.addAnalogInput(2, zoutgehalte);
  lpp.addAnalogInput(3, counter);
  counter += 1;

  // Sending data
  sendData(lpp);

  // Sleep
  goSleep(20000);
}

// temporarily variables to hold on the data
CayenneLPP tempLpp1(max_payload_cayenne);
CayenneLPP tempLpp2(max_payload_cayenne);

// Methode to send data in the right order (fifo)
void sendData(CayenneLPP payload) {
  int ttnResponse = loraSend(payload);
  
  if(ttnResponse != 1){
    if(tempLpp1.getSize() != 0 && tempLpp2.getSize() != 0){
      tempLpp1 = tempLpp2;
      tempLpp2 = payload;
    } else if(tempLpp1.getSize() != 0 && payload.getSize() != 0){
      tempLpp1 = payload;
      payload.reset();
    } else if(tempLpp2.getSize() != 0 && payload.getSize() != 0){
      tempLpp1 = payload;
      payload.reset();
    }
  } else if(ttnResponse == 1){
    if(tempLpp2.getSize() != 0){
      ttnResponse = loraSend(tempLpp2);
      if(ttnResponse == 1 && tempLpp1.getSize() != 0){
        tempLpp1.reset();
        ttnResponse = loraSend(tempLpp1.getSize() != 0);
        if(ttnResponse == 1){
          tempLpp1.reset();
        }
      } else if(ttnResponse == 1){
        tempLpp2.reset();
      }
    } else if (tempLpp1.getSize() != 0){
      ttnResponse = loraSend(tempLpp1);
      if(ttnResponse == 1){
        tempLpp1.reset();
      }
    }
  }
}

// Methode to send data to the The Things Network 
int loraSend(CayenneLPP payload) {
  ttn.wake();

  int ttnResponse = ttn.sendBytes(payload.getBuffer(), payload.getSize());

  ttn.sleep(MAX_LONG);
  return ttnResponse;
}

/*          ***********Hier zijn wat aantekeningen waar we achterzijn gekomen door te testen***********
// 30000ms / 110ms = 272 x versturen per dag
// 272 / 24 = 11 x versturen per uur
// elke +-6 minuten versturen per dag

// Na 3x mislukte versturing stopt het, omdat de stack vol kwam te zitten waardoor er geen ruimte meer was
// TTN stopt ook met proberen na 3x
// Risico log:
  * Data verstuurd goed, maar komt niet aan.
  * Data gaat verloren door de stack
  * De boei gaat uit de running door join fout

// Oplossingen:
  * De data schrijven naar een sd kaartje of een externe opslag
  * Wel data op laten slaan als de join niet werkt
  * Op nieuw checken voor join elke paar x

// het maximale getal wat een analoge kan sturen is 327
// berekening: 2^16 / 2 / 100 = 327.68

// 150 verzonden vaarwan er na 100 terug lezen er maar 8/9 niet aangekomen waren!!
// Maar wel alles goed verzonden was op de arduino
*/

void sleep(int seconds) {
  int iterations = seconds / 8;
  USBCON = 0;
  for (int i = 0; i < iterations; i++) {
    LowPower.powerDown(SLEEP_8S, ADC_OFF, BOD_OFF);
  }
  USBDevice.attach();
}