using Domain;
using FluentValidation;

namespace Application.Activities
{
    /// <summary>
    /// A validator class to validate activity request for creating and updating records
    /// </summary>
    public class ActivityValidator : AbstractValidator<Activity>
    {
        public ActivityValidator()
        {
            RuleFor(x => x.Category).NotEmpty();
            RuleFor(x => x.City).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Venue).NotEmpty();
        }
    }
}