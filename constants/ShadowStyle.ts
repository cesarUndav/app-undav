export const getShadowStyle = (elevation:number) => {
  // Approximate iOS values based on elevation
  const height = elevation * 0.4;
  const radius = elevation * 1.5;
  const opacity = Math.min(0.3 + elevation * 0.02, 0.5); // cap opacity

  return {
    elevation, // Android
    shadowColor: '#000', // IOS
    shadowOffset: { width: 0, height }, // IOS
    shadowOpacity: opacity, // IOS
    shadowRadius: radius, // IOS
  };
};