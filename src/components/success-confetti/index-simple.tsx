import React from 'react'
import { StyleSheet, View } from 'react-native'

export function SuccessConfetti() {
  return (
    <View style={styles.container}>
      <View style={styles.celebration}>
        <View style={[styles.confetti, styles.confetti1]} />
        <View style={[styles.confetti, styles.confetti2]} />
        <View style={[styles.confetti, styles.confetti3]} />
        <View style={[styles.confetti, styles.confetti4]} />
        <View style={[styles.confetti, styles.confetti5]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1000,
  },
  celebration: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 20,
  },
  confetti: {
    position: 'absolute',
    borderRadius: 3,
    zIndex: 1000,
  },
  confetti1: {
    width: 8,
    height: 8,
    backgroundColor: '#FFD700',
    left: 10,
    top: 20,
  },
  confetti2: {
    width: 6,
    height: 12,
    backgroundColor: '#FF6B6B',
    left: 30,
    top: 10,
  },
  confetti3: {
    width: 10,
    height: 6,
    backgroundColor: '#4ECDC4',
    left: 50,
    top: 25,
  },
  confetti4: {
    width: 8,
    height: 8,
    backgroundColor: '#45B7D1',
    right: 30,
    top: 15,
  },
  confetti5: {
    width: 12,
    height: 4,
    backgroundColor: '#96CEB4',
    right: 10,
    top: 30,
  },
})
