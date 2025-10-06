import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, Switch } from 'react-native';
import { IconSymbol } from '@/src/shared/ui/components';

export default function InsightBanner() {
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const handleToggle = () => {
    setNotificationEnabled(!notificationEnabled);
    // TODO: 실제 알림 권한 요청 및 스케줄링 로직 추가
    console.log(`알림 ${!notificationEnabled ? '켜짐' : '꺼짐'}`);
  };

  return (
    <Pressable style={styles.container} onPress={handleToggle}>
      <View style={styles.iconContainer}>
        <IconSymbol name="house.fill" size={16} color="#1E6BFF" />
      </View>
      <Text style={styles.text}>
        발표 3시간 전 알림 {notificationEnabled ? '켜짐' : '꺼짐'}
      </Text>
      <Switch
        value={notificationEnabled}
        onValueChange={setNotificationEnabled}
        trackColor={{ false: '#E2E8F0', true: '#1E6BFF' }}
        thumbColor="#FFFFFF"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F1F5FF',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2EFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  text: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    fontWeight: '500',
  },
});
