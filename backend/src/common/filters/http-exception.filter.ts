// http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

//Filtro que convierte directamente las excepcciones http el mensaje en un array siempre (que no devuelva a veces un array de string y otra el string solo)
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        // Normalizar el mensaje siempre como array
        let messages: string[];
        
        if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        const msg = exceptionResponse.message;
        messages = Array.isArray(msg) ? msg : [msg];
        } else {
        messages = [exception.message];
        }

        response.status(status).json({
        statusCode: status,
        message: messages, // Siempre array
        timestamp: new Date().toISOString(),
        });
    }
}