import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../theme/colors';
import type { AuthData } from '../types/auth';

type LoginScreenProps = {
  onLoginSuccess: (email: string) => void;
};

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [form, setForm] = useState<AuthData>({ email: '', password: '' });

  const isFormValid =
    form.email.trim().length > 0 && form.password.trim().length >= 6;

  const handleChange = (field: keyof AuthData, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = (): void => {
    if (!isFormValid) {
      Alert.alert(
        'Datos incompletos',
        'Ingresa un correo y una contrasena de al menos 6 caracteres.'
      );
      return;
    }

    onLoginSuccess(form.email.trim());
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.brand}>Cafe Verde</Text>
        <Text style={styles.title}>Iniciar sesion</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={form.email}
          onChangeText={(text: string) => handleChange('email', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Contrasena"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={form.password}
          onChangeText={(text: string) => handleChange('password', text)}
        />

        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  brand: {
    color: colors.primaryDark,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.background,
    color: colors.textPrimary,
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
});
