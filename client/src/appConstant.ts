export class AppConstant {
  public static ERROR = {
    NO_USER: 'No User Is Present',
    BAD_STATUS: {
      401: 'Unauthorised',
      500: 'Server Error',
      404: '/not-found'
    }
  }

  public static SUCCESS = {
    ACTIVITY: {
      CREATE: '{activityTitle} Activity Has Been Created',
      DELETE: 'Activity Has Been Deleted',
      CANCEL: 'The {activityTitle} Has Been Cancelled'
    }
  }

  public static LOADING = {
    ACTIVITIES: 'Loading Activities...',
    SELECTED_ACTIVITY: 'Loading Activity',
    APP: 'Loading App...',
    ACTIVITY: 'Loading Activity...'
  }
}