import { MongoError } from 'mongodb';
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, InternalServerErrorException } from '@nestjs/common';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    
    if (exception.code === 11000) {
      console.log("🚀 ~ MongoExceptionFilter ~ exception:", exception)
      throw new BadRequestException(
        `Duplicate key error: ${JSON.stringify(exception['keyValue'])}`,
      );
    }

    // Para otros errores de MongoDB
    throw new InternalServerErrorException(
      `MongoDB error: ${exception.message}`,
    );
  }
}