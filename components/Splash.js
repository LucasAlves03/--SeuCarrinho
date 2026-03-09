import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";

export default function AnimatedSplash({ onFinish }) {
  const animation = useRef(null);

  useEffect(() => {
    animation.current?.play();

    const timer = setTimeout(() => {
      onFinish();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        source={require("../assets/Animations/main.json")}
        autoPlay
        loop={false}
        style={styles.animation}
        resizeMode="cover"
        onAnimationFinish={onFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  animation: {
    width: 300,
    height: 300,
  },
});
