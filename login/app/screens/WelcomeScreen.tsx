import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../theme/colors';

type WelcomeScreenProps = {
  email: string;
  onLogout: () => void;
};

const featuredMenu = [
  {
    name: 'Latte de la casa',
    description: 'Espresso doble con leche cremosa y canela.',
    price: '$ 12.90',
  },
  {
    name: 'Capuccino avellana',
    description: 'Cafe intenso con espuma suave y toque dulce.',
    price: '$ 13.50',
  },
  {
    name: 'Cheesecake cafe',
    description: 'Postre frio para combinar con tu bebida favorita.',
    price: '$ 10.00',
  },
];

const quickActions = [
  { label: 'Pedido para llevar', value: 'Listo en 12 min' },
  { label: 'Mesa disponible', value: '8 mesas libres' },
  { label: 'Programa puntos', value: '2 bebidas para premio' },
];

export function WelcomeScreen({ email, onLogout }: WelcomeScreenProps) {
  const usernameFromEmail = email.split('@')[0]?.trim() ?? '';
  const displayName =
    usernameFromEmail.length > 0
      ? usernameFromEmail.charAt(0).toUpperCase() + usernameFromEmail.slice(1)
      : 'Cliente';

  return (
    <View style={styles.container}>
      <View style={styles.backgroundCircleLarge} />
      <View style={styles.backgroundCircleSmall} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.brand}>Cafe Verde</Text>
          <Text style={styles.title}>Hola, {displayName}</Text>
          <Text style={styles.subtitle}>{email}</Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Sesion activa</Text>
          </View>

          <Text style={styles.sectionTitle}>Recomendados de hoy</Text>
          {featuredMenu.map((item) => (
            <View style={styles.menuCard} key={item.name}>
              <View style={styles.menuHeaderRow}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuPrice}>{item.price}</Text>
              </View>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Atajos</Text>
          <View style={styles.shortcutBox}>
            {quickActions.map((item) => (
              <View style={styles.shortcutRow} key={item.label}>
                <Text style={styles.shortcutLabel}>{item.label}</Text>
                <Text style={styles.shortcutValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={onLogout}>
            <Text style={styles.buttonText}>Cerrar sesion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 26,
  },
  backgroundCircleLarge: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#ebf2e9',
    top: -80,
    right: -70,
  },
  backgroundCircleSmall: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#f1f5ee',
    bottom: -50,
    left: -40,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#182117',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  brand: {
    color: colors.primaryDark,
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'center',
    backgroundColor: '#e8f1e7',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d3e3d1',
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 22,
  },
  statusText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  menuCard: {
    backgroundColor: '#fbfcfa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
  },
  menuHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  menuName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  menuPrice: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
  menuDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  shortcutBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: '#fdfefd',
    paddingHorizontal: 12,
    marginBottom: 22,
  },
  shortcutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2ec',
  },
  shortcutLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
  },
  shortcutValue: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
