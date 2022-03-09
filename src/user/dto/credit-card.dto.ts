import { IsString, IsNotEmpty } from 'class-validator';
import { UpdateUserDto } from '.';
 
export class AddCreditCardDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}
 
export default AddCreditCardDto;