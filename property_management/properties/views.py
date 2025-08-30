from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Community, Block, Property, Tenant, Bill, MaintenanceComplaint
from .serializers import (
    CommunitySerializer, BlockSerializer, PropertySerializer, 
    TenantSerializer, BillSerializer, MaintenanceComplaintSerializer
)

class CommunityViewSet(viewsets.ModelViewSet):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer

class BlockViewSet(viewsets.ModelViewSet):
    queryset = Block.objects.all()
    serializer_class = BlockSerializer
    
    def get_queryset(self):
        queryset = Block.objects.all()
        community_id = self.request.query_params.get('community_id')
        if community_id is not None:
            queryset = queryset.filter(community_id=community_id)
        return queryset

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    
    def get_queryset(self):
        queryset = Property.objects.all()
        block_id = self.request.query_params.get('block_id')
        is_occupied = self.request.query_params.get('is_occupied')
        
        if block_id is not None:
            queryset = queryset.filter(block_id=block_id)
        if is_occupied is not None:
            queryset = queryset.filter(is_occupied=is_occupied.lower() == 'true')
        
        return queryset

class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    
    def get_queryset(self):
        queryset = Tenant.objects.all()
        property_id = self.request.query_params.get('property_id')
        
        if property_id is not None:
            queryset = queryset.filter(property_id=property_id)
        
        return queryset

class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    
    def get_queryset(self):
        queryset = Bill.objects.all()
        tenant_id = self.request.query_params.get('tenant_id')
        status = self.request.query_params.get('status')
        
        if tenant_id is not None:
            queryset = queryset.filter(tenant_id=tenant_id)
        if status is not None:
            queryset = queryset.filter(status=status)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def mark_as_paid(self, request, pk=None):
        bill = self.get_object()
        bill.status = 'paid'
        bill.save()
        return Response({'status': 'bill paid'})

class MaintenanceComplaintViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceComplaint.objects.all()
    serializer_class = MaintenanceComplaintSerializer
    
    def get_queryset(self):
        queryset = MaintenanceComplaint.objects.all()
        tenant_id = self.request.query_params.get('tenant_id')
        status = self.request.query_params.get('status')
        
        if tenant_id is not None:
            queryset = queryset.filter(tenant_id=tenant_id)
        if status is not None:
            queryset = queryset.filter(status=status)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        complaint = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in dict(MaintenanceComplaint.STATUS_CHOICES):
            complaint.status = new_status
            if new_status == 'resolved':
                from django.utils import timezone
                complaint.resolved_at = timezone.now()
            complaint.save()
            return Response({'status': f'complaint status updated to {new_status}'})
        
        return Response(
            {'error': 'Invalid status'}, 
            status=status.HTTP_400_BAD_REQUEST
        )