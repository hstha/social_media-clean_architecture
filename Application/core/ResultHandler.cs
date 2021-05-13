namespace Application.core
{
    public class ResultHandler<T>
    {
        public bool IsSuccess { get; set; }
        public T Value { get; set; }
        public string Error { get; set; }
        public static ResultHandler<T> Success(T value) => new ResultHandler<T> { IsSuccess = true, Value = value };
        public static ResultHandler<T> Failure(string error) => new ResultHandler<T> { IsSuccess = false, Error = error };
    }
}