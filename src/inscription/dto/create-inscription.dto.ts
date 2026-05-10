import { IsString, IsEmail } from 'class-validator';

export class CreateInscriptionDto {
    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;

    @IsEmail()
    email!: string;
}