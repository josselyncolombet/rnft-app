import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back);
  const { height, width } = Dimensions.get("window");
  const maskRowHeight = Math.round((height - 200) / 30);
  const maskColWidth = (width - 200) / 2;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={ref => { setCameraRef(ref) }}>

        <View style={styles.maskOutter}>


          <View
            style={[
              { flex: maskRowHeight, marginTop: -150 },
              styles.maskRow,
              styles.maskFrame
            ]}
          />
          <View style={[{ width: "100%", alignItems: 'center', padding: 70 }, styles.maskFrame]} >
            <Image
              style={styles.logo}
              source={require('./assets/rnftlogosmall.png')}
            />
          </View>


          <View style={[{ flex: 30 }, styles.maskCenter]}>
            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
            <View style={styles.maskInner}>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: 10,
                  borderColor: "#FFFFFF",
                  borderTopWidth: 1,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: 10,
                  borderColor: "#FFFFFF",
                  borderBottomWidth: 1,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 20,
                  height: "100%",
                  borderColor: "#FFFFFF",
                  borderLeftWidth: 1,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 20,
                  height: "100%",
                  borderColor: "#FFFFFF",
                  borderRightWidth: 1,
                }}
              />

            </View>
            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
          </View>
          <View
            style={[
              { flex: maskRowHeight },
              styles.maskRow,
              styles.maskFrame
            ]}
          >
            <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 20 }} onPress={async () => {
              if (cameraRef) {
                let photo = await cameraRef.takePictureAsync({ skipProcessing: true });
                const manipResult = await ImageManipulator.manipulateAsync(
                  photo.uri,
                  [{ crop: { height: 1600, originX: 200, originY: 1500, width: 1550 } }],
                  { compress: 1, format: ImageManipulator.SaveFormat.PNG });

                  MediaLibrary.saveToLibraryAsync(manipResult.uri);
                const formData = new FormData()
                formData.append('picture', { uri: manipResult.uri, name: 'picture.jpg', type: 'image/jpg' })
                const request = await fetch('https://rnft-upload-api.herokuapp.com/api/upload', {
                  method: 'POST',
                  body: formData
                })

                const result = await request.json()
                console.log(result)
              }
            }}>
              <View style={{ backgroundColor: "white", marginTop: 50, padding: 15 }}>
                <Image
                  style={styles.imageButton}
                  source={require('./assets/rnftbutton.png')}
                />
              </View>

            </TouchableOpacity>
          </View>

        </View>

      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    margin: 20,
  },
  imageButton: {
    resizeMode: 'contain'
  },
  logo: {
    backgroundColor: 'black',
    alignItems: 'center',
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  maskOutter: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around"
  },
  maskInner: {
    width: 300,
    backgroundColor: "transparent"
  },
  maskFrame: {
    backgroundColor: "#000",
    opacity: 0.7
  },
  maskRow: {
    width: "100%"
  },
  maskCenter: { flexDirection: "row" },
  rectangleText: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flex: 1,
    textAlign: "center",
    color: "white"
  }
});