import 'dart:async';
import 'package:flutter/material.dart';

import 'app_notification.dart';

class NotificationProvider extends ChangeNotifier {
  AppNotification _notification = AppNotification.hidden();
  Timer? _timer;

  AppNotification get notification => _notification;

  void showSuccess(String message) {
    _show(
      message: message,
      isError: false,
    );
  }

  void showError(String message) {
    _show(
      message: message,
      isError: true,
    );
  }

  void _show({
    required String message,
    required bool isError,
  }) {
    _timer?.cancel();

    _notification = AppNotification(
      visible: true,
      isError: isError,
      message: message,
    );

    notifyListeners();

    _timer = Timer(
      const Duration(seconds: 3),
      hide,
    );
  }

  void hide() {
    _notification = AppNotification.hidden();
    notifyListeners();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}