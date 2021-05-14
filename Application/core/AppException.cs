namespace Application.core
{
    public class AppException
    {
        private readonly int _statusCode;
        private readonly string _message;
        private readonly string _details;
        public AppException(int statusCode, string message, string details = null)
        {
            this._details = details;
            this._message = message;
            this._statusCode = statusCode;
        }
    }
}