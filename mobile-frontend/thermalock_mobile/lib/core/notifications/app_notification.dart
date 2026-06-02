class AppNotification {
  final bool visible;
  final bool isError;
  final String message;

  const AppNotification({
    required this.visible,
    required this.isError,
    required this.message,
  });

  factory AppNotification.hidden() {
    return const AppNotification(
      visible: false,
      isError: false,
      message: '',
    );
  }
}