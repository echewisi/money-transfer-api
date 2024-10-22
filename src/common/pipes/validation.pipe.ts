import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      // Map over errors and handle missing constraints gracefully
      const errorMessages = errors
        .map((error: ValidationError) => {
          if (error.constraints) {
            return Object.values(error.constraints).join(', ');
          }
          return ''; // Return an empty string if no constraints are available
        })
        .filter((msg) => msg.length > 0); // Filter out empty strings

      if (errorMessages.length > 0) {
        throw new BadRequestException(errorMessages);
      }
    }

    return value;
  }

  // Replace Function type with a more specific type
  private toValidate(metatype: new (...args: any[]) => any): boolean {
    const types: Array<new (...args: any[]) => any> = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }
}
