from django.urls import path, include
from rest_framework.routers import DefaultRouter
from deadline_reminder.views import AssignmentViewSet, register_user, user_profile
from deadline_reminder.views import register_page, login_page, dashboard_page, calendar_page, profile_page


router = DefaultRouter()
router.register('assignments', AssignmentViewSet, basename='assignments')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
    path('register-page/', register_page, name='register_page'),
    path('login-page/', login_page, name='login_page'),
    path('dashboard-page/', dashboard_page, name='dashboard_page'),
    path('calendar-page/', calendar_page, name='calendar_page'),
    path('profile-page/', profile_page, name='profile_page'),
    path('user-profile/', user_profile, name='user_profile'),    
]
