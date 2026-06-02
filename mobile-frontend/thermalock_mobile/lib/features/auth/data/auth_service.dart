import 'package:dio/dio.dart';

import '../../../core/network/api_client.dart';
import '../models/user_signin_request.dart';
import '../models/user_signup_request.dart';

class AuthService {
  Future<String> signup(UserSignupRequest request) async {
    try {
      final response = await ApiClient.dio.post(
        '/auth/signup',
        data: request.toJson(),
      );

      return response.data['message'] ?? 'Signup successful';
    } on DioException catch (e) {
      final message = e.response?.data?['message'] ?? 'Signup failed';
      throw Exception(message);
    } catch (_) {
      throw Exception('Something went wrong');
    }
  }

  Future<String> signin(UserSigninRequest request) async {
    try {
      final response = await ApiClient.dio.post(
        '/auth/signin',
        data: request.toJson(),
      );

      return response.data['data']['token'];
    } on DioException catch (e) {
      final message = e.response?.data?['message'] ?? 'Signin failed';
      throw Exception(message);
    } catch (_) {
      throw Exception('Something went wrong');
    }
  }
}