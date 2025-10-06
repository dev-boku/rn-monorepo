import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

export function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>설정</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>학습 설정</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>일일 목표</Text>
            <Text style={styles.settingValue}>20 카드</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>복습 알림 시간</Text>
            <Text style={styles.settingValue}>오전 9:00</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>알림 활성화</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: theme.colors.primary.light }}
              thumbColor={notificationsEnabled ? theme.colors.primary.main : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 설정</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>다크 모드</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: theme.colors.primary.light }}
              thumbColor={darkMode ? theme.colors.primary.main : '#f4f3f4'}
            />
          </View>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>언어</Text>
            <Text style={styles.settingValue}>한국어</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>데이터</Text>
          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>백업 생성</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>백업 복원</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingButton, styles.dangerButton]}>
            <Text style={[styles.settingButtonText, styles.dangerText]}>모든 데이터 삭제</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>버전</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>이용약관</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>개인정보처리방침</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  settingLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
  },
  settingValue: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  settingButton: {
    backgroundColor: theme.colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  settingButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary.main,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: theme.colors.error.main,
    backgroundColor: 'transparent',
  },
  dangerText: {
    color: theme.colors.error.main,
  },
});