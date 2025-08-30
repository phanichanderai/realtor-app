from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'communities', views.CommunityViewSet)
router.register(r'blocks', views.BlockViewSet)
router.register(r'properties', views.PropertyViewSet)
router.register(r'tenants', views.TenantViewSet)
router.register(r'bills', views.BillViewSet)
router.register(r'complaints', views.MaintenanceComplaintViewSet)

urlpatterns = [
    path('', include(router.urls)),
]