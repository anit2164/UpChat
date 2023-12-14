import axios, { AxiosResponse } from "axios";
import { errorDebug } from "../../error_debug";

export class HttpServices {
  private _contentType = "application/json; charset=UTF-8";
  private _formType = "multipart/form-data";
  private _URL: string = "";
  private _authToken?: string;
  private _isAuthRequired: boolean = false;
  private _dataToSend: any; // You should define a proper type for your data

  get dataToSend(): any {
    return this._dataToSend;
  }

  get URL(): string {
    return this._URL;
  }

  set URL(url: string) {
    this._URL = url;
  }

  set setAuthToken(authToken: string | undefined) {
    this._authToken = authToken;
  }

  set setAuthRequired(authRequired: boolean) {
    this._isAuthRequired = authRequired;
  }

  set dataToSend(data: any) {
    this._dataToSend = data;
  }

  /**
   * @Function SEND_POST_REQUEST()
   * @Methods axios.POST()
   * @Returns An Object
   */

  async sendPostRequest(): Promise<{ statusCode: number; responseBody: any }> {
    try {
      const response: AxiosResponse = await axios.post(
        this._URL, // URL Passing
        this._dataToSend, // Data-Body Passing
        {
          headers: {
            "Content-Type": this._contentType,
            Authorization:
              this._isAuthRequired && this._authToken ? this._authToken : "",
            "X-API-KEY": "QXBpS2V5TWlkZGxld2FyZQ==",
          },
        }
      );

      return {
        statusCode: response.status,
        responseBody: response.data,
      };
    } catch (error: any) {
      const errorResult = errorDebug(
        error.response.data,
        "httpServices.sendPostRequest()"
      );

      return {
        statusCode: errorResult.statusCode,
        responseBody: errorResult.responseBody,
      };
    }
  }

  async sendFileDataPostRequest(): Promise<{
    statusCode: number;
    responseBody: any;
  }> {
    try {
      const response: AxiosResponse = await axios.post(
        this._URL, // URL Passing
        this._dataToSend, // Data-Body Passing
        {
          headers: {
            "Content-Type": this._formType,
            Authorization:
              this._isAuthRequired && this._authToken ? this._authToken : "",
          },
        }
      );

      return {
        statusCode: response.status,
        responseBody: response.data,
      };
    } catch (error: any) {
      const errorResult = errorDebug(
        error.response.data,
        "httpServices.sendPostRequest()"
      );

      return {
        statusCode: errorResult.statusCode,
        responseBody: errorResult.responseBody,
      };
    }
  }

  /**
   * @Function SEND_GET_REQUEST()
   * @Methods axios.GET()
   * @Returns An Object
   */

  async sendGetRequest(): Promise<{ statusCode: number; responseBody: any }> {
    try {
      const response: AxiosResponse = await axios.get(this._URL, {
        headers: {
          "Content-Type": this._contentType,
          Authorization:
            this._isAuthRequired && this._authToken ? this._authToken : "",
          "X-API-KEY": "QXBpS2V5TWlkZGxld2FyZQ==",
        },
      });

      return {
        statusCode: response.status,
        responseBody: response.data,
      };
    } catch (error: any) {
      const errorResult = errorDebug(
        error.response.data,
        "httpServices.sendGetRequest()"
      );
      return {
        statusCode: errorResult.statusCode,
        responseBody: errorResult.responseBody,
      };
    }
  }

  /**
   * @Function SEND_PUT_REQUEST()
   * @Methods axios.PUT()
   * @Returns An Object
   */

  async sendPutRequest(): Promise<{ statusCode: number; responseBody: any }> {
    try {
      const response: AxiosResponse = await axios.put(
        this._URL,
        this._dataToSend,
        {
          headers: {
            "Content-Type": this._contentType,
            Authorization:
              this._isAuthRequired && this._authToken ? this._authToken : "",
          },
        }
      );
      return {
        statusCode: response.status,
        responseBody: response.data,
      };
    } catch (error: any) {
      const errorResult = errorDebug(
        error.response.data,
        "httpServices.sendPutRequest()"
      );
      return {
        statusCode: errorResult.statusCode,
        responseBody: errorResult.responseBody,
      };
    }
  }

  //TODO:- Implementation
  async sendDeleteRequest() {}
}
