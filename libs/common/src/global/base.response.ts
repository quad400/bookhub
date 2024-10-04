export class BaseResponse<T> {
  sucess: boolean;
  businessDescription: string;
  businessCode: number;
  data?: T;
  errors?: any;

  constructor(
    status: boolean,
    businessCode: number,
    businessDescription: string,
    data?: T,
    errors?: any,
  ) {
    this.sucess = true;
    this.businessCode = businessCode;
    this.businessDescription = businessDescription;
    this.data = data;
    this.errors = errors;
  }

  public static success<T>({
    businessCode,
    businessDescription,
    data,
  }: {
    businessCode: number;
    businessDescription: string;
    data?: T;
  }): BaseResponse<T> {
    return new BaseResponse(true, businessCode, businessDescription, data);
  }

  public static error<T>({
    businessCode,
    businessDescription,
    errors,
  }: {
    businessCode: number;
    businessDescription: string;
    errors?: any;
  }): BaseResponse<T> {
    return {
      sucess: false,
      businessCode,
      businessDescription,
      errors,
    };
  }
}
