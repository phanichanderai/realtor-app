from rest_framework import serializers
from .models import Community, Block, Property, Tenant, Bill, MaintenanceComplaint

class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = '__all__'

class BlockSerializer(serializers.ModelSerializer):
    community_name = serializers.CharField(source='community.name', read_only=True)
    
    class Meta:
        model = Block
        fields = '__all__'

class PropertySerializer(serializers.ModelSerializer):
    block_name = serializers.CharField(source='block.name', read_only=True)
    community_name = serializers.CharField(source='block.community.name', read_only=True)
    
    class Meta:
        model = Property
        fields = '__all__'

class TenantSerializer(serializers.ModelSerializer):
    property_details = PropertySerializer(source='property', read_only=True)
    
    class Meta:
        model = Tenant
        fields = '__all__'

class BillSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)
    property_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Bill
        fields = '__all__'
    
    def get_property_details(self, obj):
        return {
            'block': obj.tenant.property.block.name,
            'door_number': obj.tenant.property.door_number,
            'community': obj.tenant.property.block.community.name
        }

class MaintenanceComplaintSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)
    property_details = serializers.SerializerMethodField()
    
    class Meta:
        model = MaintenanceComplaint
        fields = '__all__'
    
    def get_property_details(self, obj):
        return {
            'block': obj.tenant.property.block.name,
            'door_number': obj.tenant.property.door_number,
            'community': obj.tenant.property.block.community.name
        }