import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native";

export default function TabSettings() {
  return (
    <SafeAreaView>
      <HStack className="justify-between">
        <Text className="text-xl font-bold">Settings</Text>
        <Text className="text-xl font-bold">Hello</Text>
      </HStack>
    </SafeAreaView>
  );
}
