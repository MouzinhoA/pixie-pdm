import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Tabs } from 'expo-router/js-tabs';

import { BotaoTema } from '@/componentes/BotaoTema';
import { useCores } from '@/tema/cores';

function Logo() {
  return (
    <Image
      source={require('@/assets/images/logo.png')}
      style={{ width: 84, height: 44 }}
      contentFit="contain"
      accessibilityLabel="Pixie"
    />
  );
}

export default function LayoutAbas() {
  const cores = useCores();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoSuave,
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => <BotaoTema />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorar',
          headerTitle: () => <Logo />,
          tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="interesses"
        options={{
          title: 'Meus interesses',
          tabBarLabel: 'Interesses',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
