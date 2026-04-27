import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../theme/colors';
import type { AuthData } from '../types/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginScreenProps = {
  onLoginSuccess: (email: string) => void;
};

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [form, setForm] = useState<AuthData>({ email: '', password: '' });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleChange = (field: keyof AuthData, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const closeAlert = (): void => {
    setAlertMessage(null);
  };

  const getValidationError = (): string | null => {
    const email = form.email.trim();
    const password = form.password.trim();

    if (email.length === 0) {
      return 'Ingresa tu correo.';
    }

    if (!EMAIL_REGEX.test(email)) {
      return 'Ingresa un correo valido.';
    }

    if (password.length < 6) {
      return 'La contrasena debe tener al menos 6 caracteres.';
    }

    return null;
  };

  const handleLogin = (): void => {
    const validationError = getValidationError();

    if (validationError) {
      setAlertMessage(validationError);
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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={alertMessage !== null}
        onRequestClose={closeAlert}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>Datos invalidos</Text>
            <Text style={styles.alertMessage}>{alertMessage ?? ''}</Text>

            <TouchableOpacity style={styles.alertButton} onPress={closeAlert}>
              <Text style={styles.alertButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(45, 58, 44, 0.35)',
    justifyContent: 'center',
    padding: 24,
  },
  alertCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  alertTitle: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  alertMessage: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  alertButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  alertButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
