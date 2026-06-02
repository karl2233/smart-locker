import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../features/auth/pages/login_page.dart';
import '../../features/auth/providers/auth_provider.dart';

class ProtectedRoute extends StatelessWidget {
  final Widget child;

  const ProtectedRoute({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    if (!auth.isAuthenticated) {
      return const LoginPage();
    }

    return child;
  }
}