import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationException } from '../exceptions/http.exception';

export const ValidatorPipe = (): ValidationPipe => {
  return new ValidationPipe({
    exceptionFactory(errors) {
      const errorValues = errors.map((err) => {
        if (err.constraints) {
          const [message] = Object.values(err.constraints);
          const fieldName = err.property;
          return { fieldName, message };
        }
        return {
          fieldName: err.property,
          message: 'Invalid input',
        };
      });
      throw new ValidationException(
        errorValues,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    },
  });
};
