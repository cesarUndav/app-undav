export const getShadowStyle = (elevation:number) => {
  // Approximate iOS values based on elevation
  const height = elevation * 0.1;
  const radius = elevation * 1.2;
  const opacity = Math.min(0.2 + elevation * 0.02, 0.4); // cap opacity

  return {
    elevation, // Android
    shadowColor: '#000', // IOS
    shadowOffset: { width: 0, height }, // IOS
    shadowOpacity: opacity, // IOS
    shadowRadius: radius, // IOS
  };
};