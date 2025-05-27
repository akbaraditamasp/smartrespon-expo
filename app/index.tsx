import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { LockIcon, MailIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export default function Login() {
  return (
    <Box className="flex-1 p-12 justify-center">
      <Box className="items-center mb-8">
        <Image
          source={require("@/assets/images/pln.png")}
          className="w-[80%]"
          resizeMode="contain"
        />
      </Box>
      <Box className="mb-20">
        <Text className="text-2xl font-bold text-primary-700 text-center">
          SmartRespon PLN
        </Text>
        <Text className="text-xl text-center">ULP Sukarami</Text>
      </Box>
      <FormControl className="mb-5">
        <Input size="xl">
          <InputSlot className="pl-3">
            <InputIcon className="text-black" as={MailIcon} />
          </InputSlot>
          <InputField placeholder="Email" />
        </Input>
        <FormControlError>
          <FormControlErrorIcon />
          <FormControlErrorText />
        </FormControlError>
      </FormControl>
      <FormControl className="mb-5">
        <Input size="xl">
          <InputSlot className="pl-3">
            <InputIcon className="text-black" as={LockIcon} />
          </InputSlot>
          <InputField type="password" placeholder="Password" />
        </Input>
        <FormControlError>
          <FormControlErrorIcon />
          <FormControlErrorText />
        </FormControlError>
      </FormControl>
      <Button size="xl">
        <ButtonText>Masuk</ButtonText>
      </Button>
    </Box>
  );
}
