export class CustomHttpResponse<T> {
  timeStamp: string = '';
  responseCode: number = 0;
  responseReason: string = '';
  responseMessage: string = '';
  responseData!: T;
}
