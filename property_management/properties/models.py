from django.db import models

class Community(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    
    def __str__(self):
        return self.name

class Block(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='blocks')
    name = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.community.name} - Block {self.name}"

class Property(models.Model):
    block = models.ForeignKey(Block, on_delete=models.CASCADE, related_name='properties')
    door_number = models.CharField(max_length=10)
    is_occupied = models.BooleanField(default=False)
    
    class Meta:
        verbose_name_plural = "Properties"
    
    def __str__(self):
        return f"{self.block.community.name} - Block {self.block.name} - Door {self.door_number}"

class Tenant(models.Model):
    property = models.OneToOneField(Property, on_delete=models.CASCADE, related_name='tenant')
    name = models.CharField(max_length=200)
    contact_number = models.CharField(max_length=15)
    email = models.EmailField()
    move_in_date = models.DateField()
    
    def __str__(self):
        return f"{self.name} - {self.property}"

class Bill(models.Model):
    BILL_TYPES = (
        ('rent', 'Rent'),
        ('maintenance', 'Maintenance Fee'),
        ('utility', 'Utility Bill'),
        ('other', 'Other'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    )
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='bills')
    bill_type = models.CharField(max_length=20, choices=BILL_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.tenant.name} - {self.bill_type} - {self.amount}"

class MaintenanceComplaint(models.Model):
    STATUS_CHOICES = (
        ('raised', 'Raised'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    )
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='complaints')
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='raised')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.tenant.name} - {self.title}"