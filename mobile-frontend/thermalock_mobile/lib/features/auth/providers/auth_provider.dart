import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../data/auth_service.dart';
import '../models/user_signup_request.dart';
import '../models/user_signin_request.dart';

class AuthProvider extends ChangeNotifier {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  final AuthService _authService = AuthService();

  String? _token;
  bool _loading = false;

  String? get token => _token;
  bool get loading => _loading;

  bool get isAuthenticated {
    return _token != null && _token!.isNotEmpty;
  }

  Future<String> signup({
    required String name,
    required String email,
    required String password,
    required String confirmPassword,
  }) async {
    _loading = true;
    notifyListeners();

    try {
      final request = UserSignupRequest(
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      );

      return await _authService.signup(request);
    } catch (e) {
      throw Exception(e.toString().replaceFirst('Exception: ', ''));
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<String> signin({
    required String email,
    required String password,
  }) async {
    _loading = true;
    notifyListeners();

    try {
      final request = UserSigninRequest(
        email: email,
        password: password,
      );

      final token = await _authService.signin(request);

      await saveToken(token);

      return 'Signin successful';
    } catch (e) {
      throw Exception(e.toString().replaceFirst('Exception: ', ''));
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> loadToken() async {
    _loading = true;
    notifyListeners();

    _token = await _storage.read(key: 'jwt_token');

    _loading = false;
    notifyListeners();
  }

  Future<void> saveToken(String token) async {
    _token = token;
    await _storage.write(key: 'jwt_token', value: token);
    notifyListeners();
  }

  Future<void> logout() async {
    _token = null;
    await _storage.delete(key: 'jwt_token');
    notifyListeners();
  }
}