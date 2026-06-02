import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:thermalock_mobile/features/menu/pages/menu_page.dart';

import '../core/notifications/global_alert.dart';
import '../core/notifications/notification_provider.dart';
import '../core/themes/app_theme.dart';
import '../features/auth/pages/signup_page.dart';
import '../features/auth/providers/auth_provider.dart';
import 'guards/protected_route.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => NotificationProvider()),
      ],
      child: const AppView(),
    );
  }
}

class AppView extends StatelessWidget {
  const AppView({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    if (auth.loading) {
      return const MaterialApp(
        home: Scaffold(
          body: Center(child: CircularProgressIndicator()),
        ),
      );
    }

    return MaterialApp(
      title: 'ThermaLock',
      theme: AppTheme.data,
      builder: (context, child) {
        return Stack(
          children: [
            child ?? const SizedBox.shrink(),
            const Align(
              alignment: Alignment.topCenter,
              child: GlobalAlert(),
            ),
          ],
        );
      },
      home: auth.isAuthenticated
          ? const MenuPage()
          : const SignupPage(),
      routes: {
        '/menu': (context) => const ProtectedRoute(
          child: MenuPage(),
        ),
        '/signup': (context) => const SignupPage(),
      },
    );
  }
}