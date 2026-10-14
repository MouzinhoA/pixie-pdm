// app/(tabs)/index.tsx
import { View, Text, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { ProductCard } from '../../components/ProductCard';
import { mockProducts } from '../../mocks/products';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Cabeçalho */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-800">Pixie Marketplace</Text>
        <Text className="text-sm text-gray-500">Encontre seus colecionáveis</Text>
      </View>

      {/* Lista de Produtos */}
      <FlatList
        data={mockProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard 
            title={item.title}
            price={item.price}
            imageUrl={item.image_url}
            sellerName={item.seller_name}
            onPress={() => console.log('Clicou no produto:', item.title)}
          />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }} // paddingBottom para não cobrir a tab bar
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}