// import React from 'react';
// import { View, Platform, StyleSheet } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';
// import CustomText from '../components/CustomText';
// import Pdf from 'react-native-pdf';

// export default function VisorPDF() {
//   const { file, title } = useLocalSearchParams();

//   if (Platform.OS === 'web') {
//     return (
//       <View style={styles.center}>
//         <CustomText style={styles.text}>
//           La visualización de PDFs no está disponible en la versión web de la app.
//         </CustomText>
//       </View>
//     );
//   }

//   const source = { uri: file as string };

//   return (
//     <View style={{ flex: 1 }}>
//       <Pdf
//         source={source}
//         style={{ flex: 1 }}
//         onError={(error) => {
//           console.error(error);
//         }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   text: {
//     textAlign: 'center',
//   },
// });
