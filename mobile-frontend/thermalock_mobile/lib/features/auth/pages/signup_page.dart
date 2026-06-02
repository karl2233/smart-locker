import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../core/notifications/notification_provider.dart';
import '../providers/auth_provider.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  bool isSignin = true;

  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> signup() async {
    final authProvider = context.read<AuthProvider>();
    final notificationProvider = context.read<NotificationProvider>();

    try {
      final message = await authProvider.signup(
        name: nameController.text.trim(),
        email: emailController.text.trim(),
        password: passwordController.text.trim(),
        confirmPassword: confirmPasswordController.text.trim(),
      );

      notificationProvider.showSuccess(message);

      setState(() {
        isSignin = true;
      });
    } catch (e) {
      notificationProvider.showError(
        e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<void> signin() async {
    final authProvider = context.read<AuthProvider>();
    final notificationProvider = context.read<NotificationProvider>();

    try {
      final message = await authProvider.signin(
        email: emailController.text.trim(),
        password: passwordController.text.trim(),
      );

      notificationProvider.showSuccess(message);

      // Later you can navigate to home/dashboard here
      // Navigator.pushReplacementNamed(context, '/home');
    } catch (e) {
      notificationProvider.showError(
        e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  void switchMode() {
    setState(() {
      isSignin = !isSignin;
      passwordController.clear();
      confirmPasswordController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    final loading = context.watch<AuthProvider>().loading;
    final theme = Theme.of(context);

    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 460),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      isSignin ? 'Welcome Back' : 'Create Account',
                      style: theme.textTheme.displayLarge,
                    ),

                    const SizedBox(height: 8),

                    Text(
                      isSignin
                          ? 'Signin to access your account.'
                          : 'Signup to create your account.',
                      style: theme.textTheme.bodyMedium,
                    ),

                    const SizedBox(height: 32),

                    if (!isSignin) ...[
                      TextField(
                        controller: nameController,
                        decoration: const InputDecoration(
                          labelText: 'Name',
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    TextField(
                      controller: emailController,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                      ),
                    ),

                    const SizedBox(height: 16),

                    TextField(
                      controller: passwordController,
                      obscureText: true,
                      decoration: const InputDecoration(
                        labelText: 'Password',
                      ),
                    ),

                    if (!isSignin) ...[
                      const SizedBox(height: 16),
                      TextField(
                        controller: confirmPasswordController,
                        obscureText: true,
                        decoration: const InputDecoration(
                          labelText: 'Confirm Password',
                        ),
                      ),
                    ],

                    const SizedBox(height: 28),

                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: loading
                            ? null
                            : isSignin
                            ? signin
                            : signup,
                        child: loading
                            ? const SizedBox(
                          height: 22,
                          width: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                            : Text(isSignin ? 'Signin' : 'Signup'),
                      ),
                    ),

                    const SizedBox(height: 18),

                    Center(
                      child: TextButton(
                        onPressed: loading ? null : switchMode,
                        child: Text(
                          isSignin
                              ? "Don't have an account? Signup"
                              : "Already have an account? Signin",
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}