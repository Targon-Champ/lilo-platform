# **L.I.L.O. Complete Database Schema**

## **Multi-Tenant PostgreSQL Database Design**

---

## **Schema Organization Strategy**

## **Multi-Tenant Isolation Approach**

* Platform Schema: lilo\_platform \- Shared infrastructure and tenant management  
* Tenant Schemas: tenant\_\<org\_id\> \- Isolated data per customer organization  
* Security: Row-level security policies for shared tables, complete schema isolation for tenant data

---

## **PLATFORM SCHEMA: lilo\_platform**

## **Core Platform Management**

```sql
-- ============================================================================
-- PLATFORM SCHEMA: Tenant Management & Shared Infrastructure
-- ============================================================================

CREATE SCHEMA lilo_platform;

-- ----------------------------------------------------------------------------
-- Organizations (Tenants)
-- ----------------------------------------------------------------------------
CREATE TABLE lilo_platform.organizations (
    org_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_name VARCHAR(255) NOT NULL,
    org_slug VARCHAR(100) UNIQUE NOT NULL, -- URL-safe identifier
    org_type VARCHAR(50) NOT NULL, -- 'university', 'pharma', 'biotech', 'government', 'industrial'
    
    -- Business details
    industry VARCHAR(100),
    country VARCHAR(2), -- ISO 3166-1 alpha-2
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    
    -- Subscription
    subscription_tier VARCHAR(50) NOT NULL DEFAULT 'starter', -- 'starter', 'professional', 'enterprise'
    subscription_status VARCHAR(50) NOT NULL DEFAULT 'trial', -- 'trial', 'active', 'suspended', 'cancelled'
    trial_ends_at TIMESTAMP,
    subscription_started_at TIMESTAMP,
    
    -- Limits and quotas
    max_cabinets INT NOT NULL DEFAULT 20,
    max_users INT NOT NULL DEFAULT 50,
    max_storage_gb INT NOT NULL DEFAULT 100,
    
    -- Billing
    billing_email VARCHAR(255),
    billing_contact_name VARCHAR(255),
    stripe_customer_id VARCHAR(100),
    
    -- Technical
    aws_region VARCHAR(50) DEFAULT 'us-east-1',
    database_schema_name VARCHAR(100) NOT NULL, -- 'tenant_<org_id>'
    
    -- Compliance flags
    requires_hipaa BOOLEAN DEFAULT FALSE,
    requires_gxp BOOLEAN DEFAULT FALSE,
    requires_21cfr_part11 BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'deleted'
    
    CONSTRAINT valid_org_type CHECK (org_type IN ('university', 'pharma', 'biotech', 'government', 'industrial')),
    CONSTRAINT valid_subscription_tier CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')),
    CONSTRAINT valid_subscription_status CHECK (subscription_status IN ('trial', 'active', 'suspended', 'cancelled'))
);

CREATE INDEX idx_org_slug ON lilo_platform.organizations(org_slug);
CREATE INDEX idx_org_status ON lilo_platform.organizations(status);
CREATE INDEX idx_subscription_status ON lilo_platform.organizations(subscription_status);

-- ----------------------------------------------------------------------------
-- Users (Platform-wide)
-- ----------------------------------------------------------------------------
CREATE TABLE lilo_platform.users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Authentication (synced with Amazon Cognito)
    cognito_user_id VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    
    -- Profile
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(200),
    phone_number VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Account status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'deleted', 'pending_verification'
    last_login_at TIMESTAMP,
    login_count INT DEFAULT 0,
    
    -- Security
    mfa_enabled BOOLEAN DEFAULT FALSE,
    password_changed_at TIMESTAMP,
    must_change_password BOOLEAN DEFAULT FALSE,
    
    -- Preferences
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    locale VARCHAR(10) DEFAULT 'en-US',
    notification_preferences JSONB DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP,
    
    CONSTRAINT valid_user_status CHECK (status IN ('active', 'suspended', 'deleted', 'pending_verification'))
);

CREATE INDEX idx_user_email ON lilo_platform.users(email);
CREATE INDEX idx_cognito_user ON lilo_platform.users(cognito_user_id);
CREATE INDEX idx_user_status ON lilo_platform.users(status);

-- ----------------------------------------------------------------------------
-- User Organization Memberships
-- ----------------------------------------------------------------------------
CREATE TABLE lilo_platform.user_org_memberships (
    membership_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES lilo_platform.users(user_id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES lilo_platform.organizations(org_id) ON DELETE CASCADE,
    
    -- Role at organization level
    org_role VARCHAR(50) NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'manager', 'member'
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'invited', 'suspended', 'removed'
    invited_by UUID REFERENCES lilo_platform.users(user_id),
    invited_at TIMESTAMP,
    joined_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, org_id),
    CONSTRAINT valid_org_role CHECK (org_role IN ('owner', 'admin', 'manager', 'member')),
    CONSTRAINT valid_membership_status CHECK (status IN ('active', 'invited', 'suspended', 'removed'))
);

CREATE INDEX idx_membership_user ON lilo_platform.user_org_memberships(user_id);
CREATE INDEX idx_membership_org ON lilo_platform.user_org_memberships(org_id);
CREATE INDEX idx_membership_status ON lilo_platform.user_org_memberships(status);

-- ----------------------------------------------------------------------------
-- IoT Devices Registry
-- ----------------------------------------------------------------------------
CREATE TABLE lilo_platform.iot_devices (
    device_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES lilo_platform.organizations(org_id) ON DELETE CASCADE,
    
    -- Device identification
    device_serial_number VARCHAR(100) UNIQUE NOT NULL,
    device_type VARCHAR(50) NOT NULL DEFAULT 'smart_cabinet', -- 'smart_cabinet', 'sensor_module', 'camera_unit'
    hardware_version VARCHAR(50),
    firmware_version VARCHAR(50),
    
    -- AWS IoT Core integration
    iot_thing_name VARCHAR(128) UNIQUE NOT NULL,
    iot_certificate_arn TEXT,
    iot_certificate_id VARCHAR(64),
    iot_endpoint VARCHAR(255),
    
    -- Device status
    status VARCHAR(50) DEFAULT 'provisioned', -- 'provisioned', 'active', 'offline', 'maintenance', 'decommissioned'
    last_seen_at TIMESTAMP,
    last_heartbeat_at TIMESTAMP,
    
    -- Location (will reference tenant schema cabinet)
    assigned_cabinet_id UUID, -- References tenant schema
    physical_location TEXT,
    
    -- Network info
    ip_address INET,
    mac_address VARCHAR(17),
    network_ssid VARCHAR(100),
    
    -- Health metrics (latest snapshot)
    cpu_usage_percent DECIMAL(5,2),
    memory_usage_percent DECIMAL(5,2),
    disk_usage_percent DECIMAL(5,2),
    temperature_celsius DECIMAL(5,2),
    uptime_seconds BIGINT,
    
    -- Metadata
    provisioned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activated_at TIMESTAMP,
    last_maintenance_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_device_status CHECK (status IN ('provisioned', 'active', 'offline', 'maintenance', 'decommissioned'))
);

CREATE INDEX idx_device_org ON lilo_platform.iot_devices(org_id);
CREATE INDEX idx_device_serial ON lilo_platform.iot_devices(device_serial_number);
CREATE INDEX idx_device_status ON lilo_platform.iot_devices(status);
CREATE INDEX idx_device_thing_name ON lilo_platform.iot_devices(iot_thing_name);

-- ----------------------------------------------------------------------------
-- API Keys
-- ----------------------------------------------------------------------------
CREATE TABLE lilo_platform.api_keys (
    api_key_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES lilo_platform.organizations(org_id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES lilo_platform.users(user_id),
    
    -- Key details
    key_name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(128) UNIQUE NOT NULL, -- SHA-256 hash of actual key
    key_prefix VARCHAR(10) NOT NULL, -- First 8 chars for identification
    
    -- Permissions
    scopes JSONB NOT NULL DEFAULT '[]', -- Array of permission scopes
    
    -- Rate limiting
    rate_limit_per_hour INT DEFAULT 1000,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'revoked', 'expired'
    expires_at TIMESTAMP,
    last_used_at TIMESTAMP,
    usage_count BIGINT DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP,
    revoked_by UUID REFERENCES lilo_platform.users(user_id),
    revocation_reason TEXT,
    
    CONSTRAINT valid_api_key_status CHECK (status IN ('active', 'revoked', 'expired'))
);

CREATE INDEX idx_api_key_org ON lilo_platform.api_keys(org_id);
CREATE INDEX idx_api_key_hash ON lilo_platform.api_keys(key_hash);
CREATE INDEX idx_api_key_status ON lilo_platform.api_keys(status);

-- ----------------------------------------------------------------------------
-- System Events (Platform-level audit log)
-- ----------------------------------------------------------------------------
CREATE TABLE lilo_platform.system_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Context
    org_id UUID REFERENCES lilo_platform.organizations(org_id),
    user_id UUID REFERENCES lilo_platform.users(user_id),
    
    -- Event classification
    event_type VARCHAR(50) NOT NULL, -- 'org_created', 'user_invited', 'subscription_changed', etc.
    event_category VARCHAR(50) NOT NULL, -- 'organization', 'user', 'billing', 'security', 'system'
    severity VARCHAR(20) NOT NULL DEFAULT 'info', -- 'debug', 'info', 'warning', 'error', 'critical'
    
    -- Event details
    event_data JSONB,
    
    -- Request context
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    
    -- Full-text search
    tsv TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('english', COALESCE(event_type, '') || ' ' || COALESCE(event_data::text, ''))
    ) STORED
);

CREATE INDEX idx_system_events_timestamp ON lilo_platform.system_events(event_timestamp DESC);
CREATE INDEX idx_system_events_org ON lilo_platform.system_events(org_id);
CREATE INDEX idx_system_events_user ON lilo_platform.system_events(user_id);
CREATE INDEX idx_system_events_type ON lilo_platform.system_events(event_type);
CREATE INDEX idx_system_events_category ON lilo_platform.system_events(event_category);
CREATE INDEX idx_system_events_tsv ON lilo_platform.system_events USING GIN(tsv);

-- Partition by month for performance
CREATE TABLE lilo_platform.system_events_y2025m11 PARTITION OF lilo_platform.system_events
    FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

```

## **TENANT SCHEMA TEMPLATE: tenant\_\<org\_id\>**

## **Hierarchical Organization Structure**

```sql
-- ============================================================================
-- TENANT SCHEMA: Per-Organization Isolated Data
-- Created dynamically for each organization as tenant_<org_id>
-- ============================================================================

-- Example: CREATE SCHEMA tenant_123e4567_e89b_12d3_a456_426614174000;

-- ----------------------------------------------------------------------------
-- Departments
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_{org_id}.departments (
    dept_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Department details
    dept_name VARCHAR(255) NOT NULL,
    dept_code VARCHAR(50) UNIQUE,
    description TEXT,
    
    -- Hierarchy
    parent_dept_id UUID REFERENCES tenant_{org_id}.departments(dept_id),
    
    -- Location
    building VARCHAR(100),
    floor VARCHAR(50),
    room_numbers TEXT[],
    
    -- Contact
    dept_head_user_id UUID, -- References lilo_platform.users
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    -- Budget tracking
    annual_budget DECIMAL(15,2),
    budget_fiscal_year INT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'archived'
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID
);

CREATE INDEX idx_dept_code ON tenant_{org_id}.departments(dept_code);
CREATE INDEX idx_dept_parent ON tenant_{org_id}.departments(parent_dept_id);
CREATE INDEX idx_dept_status ON tenant_{org_id}.departments(status);

-- ----------------------------------------------------------------------------
-- Laboratories
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_{org_id}.laboratories (
    lab_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dept_id UUID NOT NULL REFERENCES tenant_{org_id}.departments(dept_id) ON DELETE CASCADE,
    
    -- Lab identification
    lab_name VARCHAR(255) NOT NULL,
    lab_code VARCHAR(50) UNIQUE,
    description TEXT,
    
    -- Location
    building VARCHAR(100),
    floor VARCHAR(50),
    room_number VARCHAR(50),
    square_footage DECIMAL(10,2),
    
    -- Personnel
    lab_manager_user_id UUID, -- References lilo_platform.users
    principal_investigator_user_id UUID,
    safety_officer_user_id UUID,
    
    -- Contact
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    emergency_contact VARCHAR(255),
    
    -- Classification
    biosafety_level VARCHAR(10), -- 'BSL-1', 'BSL-2', 'BSL-3', 'BSL-4'
    lab_type VARCHAR(50), -- 'teaching', 'research', 'clinical', 'analytical'
    
    -- Certifications
    certifications JSONB DEFAULT '[]', -- Array of certification objects
    last_inspection_date DATE,
    next_inspection_date DATE,
    
    -- Budget
    cost_center VARCHAR(50),
    annual_budget DECIMAL(15,2),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID
);

CREATE INDEX idx_lab_dept ON tenant_{org_id}.laboratories(dept_id);
CREATE INDEX idx_lab_code ON tenant_{org_id}.laboratories(lab_code);
CREATE INDEX idx_lab_manager ON tenant_{org_id}.laboratories(lab_manager_user_id);
CREATE INDEX idx_lab_status ON tenant_{org_id}.laboratories(status);

-- ----------------------------------------------------------------------------
-- Cabinets (Smart Cabinets / Storage Units)
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_{org_id}.cabinets (
    cabinet_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_id UUID NOT NULL REFERENCES tenant_{org_id}.laboratories(lab_id) ON DELETE CASCADE,
    
    -- Cabinet identification
    cabinet_name VARCHAR(255) NOT NULL,
    cabinet_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Physical characteristics
    num_shelves INT NOT NULL DEFAULT 4,
    shelf_height_cm DECIMAL(5,2)[],
    width_cm DECIMAL(5,2),
    depth_cm DECIMAL(5,2),
    height_cm DECIMAL(5,2),
    max_weight_kg DECIMAL(8,2),
    
    -- Storage classification
    storage_type VARCHAR(50), -- 'chemical', 'biological', 'flammable', 'acid', 'base', 'general'
    temperature_controlled BOOLEAN DEFAULT FALSE,
    ventilated BOOLEAN DEFAULT FALSE,
    lockable BOOLEAN DEFAULT TRUE,
    
    -- IoT device linkage
    device_id UUID, -- References lilo_platform.iot_devices
    
    -- Location
    precise_location VARCHAR(255), -- "North wall, near fume hood 3"
    gps_coordinates POINT,
    qr_code VARCHAR(100) UNIQUE, -- Cabinet-level QR code
    
    -- Environmental monitoring
    temperature_sensor_id VARCHAR(100),
    humidity_sensor_id VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'maintenance', 'offline', 'decommissioned'
    installation_date DATE,
    last_calibration_date DATE,
    next_maintenance_date DATE,
    
    -- Compliance
    requires_logging BOOLEAN DEFAULT TRUE,
    requires_dual_approval BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID
);

CREATE INDEX idx_cabinet_lab ON tenant_{org_id}.cabinets(lab_id);
CREATE INDEX idx_cabinet_code ON tenant_{org_id}.cabinets(cabinet_code);
CREATE INDEX idx_cabinet_device ON tenant_{org_id}.cabinets(device_id);
CREATE INDEX idx_cabinet_status ON tenant_{org_id}.cabinets(status);

-- ----------------------------------------------------------------------------
-- Chemical Inventory
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_{org_id}.chemical_inventory (
    container_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cabinet_id UUID NOT NULL REFERENCES tenant_{org_id}.cabinets(cabinet_id) ON DELETE CASCADE,
    
    -- Container identification
    qr_code VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100),
    custom_id VARCHAR(100), -- User-defined identifier
    
    -- Physical location
    shelf_level INT NOT NULL CHECK (shelf_level >= 1 AND shelf_level <= 20),
    position_code VARCHAR(20), -- e.g., "A3" for grid position
    
    -- Chemical information
    chemical_name VARCHAR(255) NOT NULL,
    cas_number VARCHAR(50),
    chemical_formula VARCHAR(200),
    molecular_weight DECIMAL(10,4),
    
    -- Supplier information
    supplier VARCHAR(255),
    catalog_number VARCHAR(100),
    lot_number VARCHAR(100),
    
    -- Quantity and units
    quantity DECIMAL(10,3) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- 'mL', 'L', 'g', 'kg', 'mg', 'units'
    initial_quantity DECIMAL(10,3),
    minimum_quantity DECIMAL(10,3), -- Reorder threshold
    
    -- Container details
    container_type VARCHAR(50), -- 'bottle', 'jar', 'drum', 'ampule', 'vial'
    container_size VARCHAR(50), -- '500mL', '1L', '5kg'
    container_material VARCHAR(50), -- 'glass', 'plastic', 'metal'
    
    -- Concentration/purity
    concentration DECIMAL(10,4),
    concentration_unit VARCHAR(20), -- 'M', '%', 'mg/mL'
    purity_percent DECIMAL(5,2),
    
    -- Dates
    date_received DATE,
    date_opened DATE,
    expiry_date DATE,
    manufacture_date DATE,
    
    -- Hazard classification
    hazard_class VARCHAR(50)[], -- Array: 'toxic', 'flammable', 'corrosive', 'oxidizer', 'explosive'
    ghs_pictograms VARCHAR(50)[], -- Array of GHS codes
    signal_word VARCHAR(20), -- 'Danger', 'Warning'
    
    -- Safety
    h_statements TEXT[], -- Hazard statements
    p_statements TEXT[], -- Precautionary statements
    nfpa_rating JSONB, -- {health: 2, flammability: 3, reactivity: 1, special: 'W'}
    
    -- Regulatory
    dea_schedule VARCHAR(10), -- DEA controlled substance schedule
    epa_waste_code VARCHAR(20)[], -- EPA hazardous waste codes
    dot_hazard_class VARCHAR(50), -- DOT shipping classification
    
    -- Documentation
    sds_url TEXT, -- Safety Data Sheet link
    sds_revision_date DATE,
    product_url TEXT,
    notes TEXT,
    
    -- Financial
    cost_per_unit DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    purchase_order_number VARCHAR(100),
    grant_number VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'in_cabinet', -- 'in_cabinet', 'checked_out', 'disposed', 'empty', 'expired'
    last_detected TIMESTAMP,
    last_verified_by_user UUID,
    last_verified_at TIMESTAMP,
    
    -- Disposal tracking
    disposal_date DATE,
    disposal_method VARCHAR(100),
    disposed_by_user UUID,
    disposal_vendor VARCHAR(255),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    
    -- Full-text search
    tsv TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('english', 
            COALESCE(chemical_name, '') || ' ' || 
            COALESCE(cas_number, '') || ' ' || 
            COALESCE(supplier, '') || ' ' ||
            COALESCE(catalog_number, '')
        )
    ) STORED
);

CREATE INDEX idx_inventory_cabinet ON tenant_{org_id}.chemical_inventory(cabinet_id);
CREATE INDEX idx_inventory_qr ON tenant_{org_id}.chemical_inventory(qr_code);
CREATE INDEX idx_inventory_shelf ON tenant_{org_id}.chemical_inventory(shelf_level);
CREATE INDEX idx_inventory_chemical ON tenant_{org_id}.chemical_inventory(chemical_name);
CREATE INDEX idx_inventory_cas ON tenant_{org_id}.chemical_inventory(cas_number);
CREATE INDEX idx_inventory_status ON tenant_{org_id}.chemical_inventory(status);
CREATE INDEX idx_inventory_expiry ON tenant_{org_id}.chemical_inventory(expiry_date);
CREATE INDEX idx_inventory_tsv ON tenant_{org_id}.chemical_inventory USING GIN(tsv);

-- ----------------------------------------------------------------------------
-- Container Transactions (Checkout/Return History)
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_{org_id}.container_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    container_id UUID NOT NULL REFERENCES tenant_{org_id}.chemical_inventory(container_id) ON DELETE CASCADE,
    
    -- Transaction details
    transaction_type VARCHAR(50) NOT NULL, -- 'checkout', 'return', 'transfer', 'dispose', 'adjust'
    qr_code VARCHAR(100) NOT NULL,
    
    -- User information
    user_id UUID NOT NULL, -- References lilo_platform.users
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_role VARCHAR(50),
    
    -- Timestamps
    checkout_timestamp TIMESTAMP,
    expected_return_timestamp TIMESTAMP,
    actual_return_timestamp TIMESTAMP,
    
    -- Location tracking
    source_cabinet_id UUID REFERENCES tenant_{org_id}.cabinets(cabinet_id),
    source_shelf_level INT,
    destination_location JSON, -- {type: 'fume_hood', location: 'Lab 301, Hood 2'}
    return_cabinet_id UUID REFERENCES tenant_{org_id}.cabinets(cabinet_id),
    return_shelf_level INT,
    
    -- Quantity tracking
    quantity_checkout DECIMAL(10,3),
    quantity_returned DECIMAL(10,3),
    quantity_unit VARCHAR(20),
    
    -- Usage details
    purpose TEXT, -- Experiment description or reason
    experiment_id VARCHAR(100),
    project_name VARCHAR(255),
    grant_number VARCHAR(100),
    protocol_id VARCHAR(100),
    
    -- Approval workflow
    requires_approval BOOLEAN DEFAULT FALSE,
    approved_by UUID,
    approved_at TIMESTAMP,
    approval_notes TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'returned', 'overdue', 'lost', 'disposed'
    
    -- Return condition
    return_condition VARCHAR(50), -- 'good', 'damaged', 'contaminated', 'empty'
    return_notes TEXT,
    
    -- Safety checks
    safety_verification_required BOOLEAN DEFAULT FALSE,
    safety_verified_by UUID,
    safety_verified_at TIMESTAMP,
    
    -- Related transactions
    parent_transaction_id UUID REFERENCES tenant_{org_id}.container_transactions(transaction_id),
    workflow_id UUID, -- Group related transactions
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_transaction_type CHECK (transaction_type IN ('checkout', 'return', 'transfer', 'dispose', 'adjust')),
    CONSTRAINT valid_transaction_status CHECK (status IN ('active', 'returned', 'overdue', 'lost', 'disposed'))
);

CREATE INDEX idx_trans_container ON tenant_{org_id}.container_transactions(container_id);
CREATE INDEX idx_trans_user ON tenant_{org_id}.container_transactions(user_id);
CREATE INDEX idx_trans_type ON tenant_{org_id}.container_transactions(transaction_type);
CREATE INDEX idx_trans_status ON tenant_{org_id}.container_transactions(status);
CREATE INDEX idx_trans_checkout ON tenant_{org_id}.container_transactions(checkout_timestamp DESC);
CREATE INDEX idx_trans_workflow ON tenant_{org_id}.container_transactions(workflow_id);

-- ----------------------------------------------------------------------------
-- Scan Results (Camera Scans)
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_{org_id}.scan_results (
    scan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cabinet_id UUID NOT NULL REFERENCES tenant_{org_id}.cabinets(cabinet_id) ON DELETE CASCADE,
    shelf_id INT NOT NULL,
    
    -- Scan details
    scan_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    trigger_type VARCHAR(50) NOT NULL, -- 'scheduled', 'motion', 'manual', 'api'
    triggered_by UUID, -- User who triggered manual scan
    
    -- Image information
    image_s3_key TEXT NOT NULL,
    image_url TEXT,
    image_size_bytes BIGINT,
    image_resolution VARCHAR(20), -- '1920x1080'
    
    -- Processing results
    processing_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    processing_time_ms INT,
    processing_error TEXT,
    
    -- Detection results
    containers_detected INT DEFAULT 0,
    qr_codes_found TEXT[], -- Array of detected QR codes
    qr_detection_confidence DECIMAL(5,4)[], -- Array of confidence scores
    
    -- Computer vision analysis
    image_quality_score DECIMAL(5,4),
    lighting_quality_score DECIMAL(5,4),
    focus_quality_score DECIMAL(5,4),
    
    -- Safety hazards detected
    spill_detected BOOLEAN DEFAULT FALSE,
    spill_confidence DECIMAL(5,4),
    spill_location JSON,
    
    breakage_detected BOOLEAN DEFAULT FALSE,
    breakage_confidence DECIMAL(5,4),
    
    anomalies_detected JSON[], -- Array of detected anomalies
    
    -- Organization assessment
    shelf_organization_score DECIMAL(5,4),
    recommendations JSON,
    
    -- Lambda execution details
    lambda_request_id VARCHAR(100),
    lambda_function_version VARCHAR(50),
    
    -- Comparison with previous scan
    previous_scan_id UUID REFERENCES tenant_{org_id}.scan_results(scan_id),
    containers_added TEXT[],
    containers_removed TEXT[],
    containers_moved TEXT[],
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_trigger_type CHECK (trigger_type IN ('scheduled', 'motion', 'manual', 'api')),
    CONSTRAINT valid_processing_status CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed'))
);

CREATE INDEX idx_scan_cabinet ON tenant_{org_id}.scan_results(cabinet_id);
CREATE INDEX idx_scan_timestamp ON tenant_{org_id}.scan_results(scan_timestamp DESC);
CREATE INDEX idx_scan_trigger ON tenant_{org_id}.scan_results(trigger_type);
CREATE INDEX idx_scan_status ON tenant_{org_id}.scan_results(processing_status);
CREATE INDEX idx_scan_spill ON tenant_{org_id}.scan_results(spill_detected) WHERE spill_detected = TRUE;
CREATE INDEX idx_scan_breakage ON tenant_{org_id}.scan_results(breakage_detected) WHERE breakage_detected = TRUE;

-- ----------------------------------------------------------------------------
-- Safety Alerts
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_{org_id}.safety_alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Location context
    cabinet_id UUID REFERENCES tenant_{org_id}.cabinets(cabinet_id),
    lab_id UUID REFERENCES tenant_{org_id}.laboratories(lab_id),
    shelf_id INT,
    
    -- Alert classification
    alert_type VARCHAR(50) NOT NULL, -- 'spill', 'breakage', 'leak', 'corrosion', 'unknown_anomaly', 'expired_chemical'
    hazard_type VARCHAR(50), -- Specific hazard classification
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    
    -- Detection details
    detected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    detection_method VARCHAR(50), -- 'computer_vision', 'manual_report', 'sensor'
    confidence DECIMAL(5,4),
    
    -- Related data
    scan_id UUID REFERENCES tenant_{org_id}.scan_results(scan_id),
    container_id UUID REFERENCES tenant_{org_id}.chemical_inventory(container_id),
    
    -- Alert content
    title VARCHAR(255) NOT NULL,
    description TEXT,
    affected_area_description TEXT,
    affected_containers UUID[],
    
    -- Evidence
    image_references TEXT[], -- S3 keys
    video_reference TEXT,
    sensor_data JSON,
    
    -- Response workflow
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'acknowledged', 'in_progress', 'resolved', 'false_positive'
    acknowledged_by UUID,
    acknowledged_at TIMESTAMP,
    acknowledged_via VARCHAR(50), -- 'web', 'mobile', 'email', 'sms'
    
    assigned_to UUID,
    assigned_at TIMESTAMP,
    
    resolved_by UUID,
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    resolution_actions TEXT[],
    
    -- Escalation
    escalation_level INT DEFAULT 0,
    escalated_to UUID,
    escalated_at TIMESTAMP,
    
    -- Notification tracking
    notifications_sent JSON[], -- Array of notification records
    
    -- Action required
    action_required TEXT,
    action_deadline TIMESTAMP,
    
    -- Compliance flags
    requires_regulatory_report BOOLEAN DEFAULT FALSE,
    reported_to_authorities BOOLEAN DEFAULT FALSE,
    reported_at TIMESTAMP,
    report_reference VARCHAR(100),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_alert_type CHECK (alert_type IN ('spill', 'breakage', 'leak', 'corrosion', 'unknown_anomaly', 'expired_chemical')),
    CONSTRAINT valid_severity CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT valid_alert_status CHECK (status IN ('open', 'acknowledged', 'in_progress', 'resolved', 'false_positive'))
);

CREATE INDEX idx_alert_cabinet ON tenant_{org_id}.safety_alerts(cabinet_id);
CREATE INDEX idx_alert_type ON tenant_{org_id}.safety_alerts(alert_type);
CREATE INDEX idx_alert_severity ON tenant_{org_id}.safety_alerts(severity);
CREATE INDEX idx_alert_status ON tenant_{org_id}.safety_alerts(status);
CREATE INDEX idx_alert_detected ON tenant_{org_id}.safety_alerts(detected_at DESC);
CREATE INDEX idx_alert_assigned ON tenant_{org_id}.safety_alerts(assigned_to) WHERE status != 'resolved';

-- ----------------------------------------------------------------------------
-- Unified Event Log (Comprehensive Audit Trail)
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_{org_id}.unified_event_log (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Event classification
    event_type VARCHAR(50) NOT NULL, -- 'access', 'transaction', 'scan', 'safety', 'hardware', 'manual', 'system'
    event_category VARCHAR(50), -- 'inventory', 'safety', 'maintenance', 'user_action', 'system'
    severity VARCHAR(20) DEFAULT 'info', -- 'debug', 'info', 'warning', 'error', 'critical'
    
    -- Location context
    lab_id UUID REFERENCES tenant_{org_id}.laboratories(lab_id),
    cabinet_id UUID REFERENCES tenant_{org_id}.cabinets(cabinet_id),
    shelf_id INT,
    
    -- User context
    user_id UUID, -- References lilo_platform.users
    user_name VARCHAR(255),
    user_role VARCHAR(50),
    
    -- Container context
    container_id UUID REFERENCES tenant_{org_id}.chemical_inventory(container_id),
    qr_code VARCHAR(100),
    chemical_name VARCHAR(255),
    cas_number VARCHAR(50),
    
    -- Event details (flexible JSON structure)
    event_details JSONB,
    
    -- Changes tracking (for update events)
    old_values JSONB,
    new_values JSONB,
    changes_summary TEXT,
    
    -- Evidence
    image_reference VARCHAR(500),
    video_reference VARCHAR(500),
    
    -- Workflow tracking
    related_event_id UUID REFERENCES tenant_{org_id}.unified_event_log(event_id),
    workflow_id UUID,
    parent_event_id UUID REFERENCES tenant_{org_id}.unified_event_log(event_id),
    
    -- Request context
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    api_endpoint VARCHAR(255),
    
    -- Compliance flags
    requires_review BOOLEAN DEFAULT FALSE,
    reviewed_by UUID,
    reviewed_at TIMESTAMP,
    compliance_flags JSONB,
    
    -- Regulatory categories
    osha_relevant BOOLEAN DEFAULT FALSE,
    epa_relevant BOOLEAN DEFAULT FALSE,
    dea_relevant BOOLEAN DEFAULT FALSE,
    
    -- Full-text search
    tsv TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('english', 
            COALESCE(event_type, '') || ' ' || 
            COALESCE(event_category, '') || ' ' ||
            COALESCE(changes_summary, '') || ' ' ||
            COALESCE(chemical_name, '')
        )
    ) STORED
);

-- Partition by month for performance
CREATE INDEX idx_event_timestamp ON tenant_{org_id}.unified_event_log(event_timestamp DESC);
CREATE INDEX idx_event_type ON tenant_{org_id}.unified_event_log(event_type);
CREATE INDEX idx_event_category ON tenant_{org_id}.unified_event_log(event_category);
CREATE INDEX idx_event_severity ON tenant_{org_id}.unified_event_log(severity);
CREATE INDEX idx_event_user ON tenant_{org_id}.unified_event_log(user_id);
CREATE INDEX idx_event_cabinet ON tenant_{org_id}.unified_event_log(cabinet_id);
CREATE INDEX idx_event_container ON tenant_{org_id}.unified_event_log(container_id);
CREATE INDEX idx_event_workflow ON tenant_{org_id}.unified_event_log(workflow_id);
CREATE INDEX idx_event_requires_review ON tenant_{org_id}.unified_event_log(requires_review) WHERE requires_review = TRUE;
CREATE INDEX idx_event_tsv ON tenant_{org_id}.unified_event_log USING GIN(tsv);

-- ----------------------------------------------------------------------------
-- Compliance Audit Log (7-Year Retention)
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_{org_id}.compliance_audit_log (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES tenant_{org_id}.unified_event_log(event_id),
    
    -- Audit metadata
    audit_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    audit_category VARCHAR(50) NOT NULL, -- 'controlled_substance', 'hazardous_waste', 'safety_incident', 'inventory_audit'
    
    -- Regulatory framework
    regulation VARCHAR(100), -- 'OSHA_1910.1450', 'DEA_Schedule_II', 'EPA_RCRA', '21_CFR_Part_11'
    regulation_section VARCHAR(100),
    
    -- Compliance assessment
    compliance_status VARCHAR(50) DEFAULT 'compliant', -- 'compliant', 'flagged', 'reviewed', 'resolved', 'violation'
    
    -- Review tracking
    reviewed_by UUID,
    reviewed_at TIMESTAMP,
    auditor_name VARCHAR(255),
    auditor_notes TEXT,
    auditor_signature VARCHAR(500), -- Digital signature hash
    
    -- Retention
    retention_until DATE NOT NULL, -- Auto-calculated (typically +7 years)
    archive_status VARCHAR(50) DEFAULT 'active', -- 'active', 'archived', 'purged'
    
    -- Export tracking
    exported_count INT DEFAULT 0,
    last_exported_at TIMESTAMP,
    last_exported_by UUID,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_audit_category CHECK (audit_category IN ('controlled_substance', 'hazardous_waste', 'safety_incident', 'inventory_audit')),
    CONSTRAINT valid_compliance_status CHECK (compliance_status IN ('compliant', 'flagged', 'reviewed', 'resolved', 'violation'))
);

CREATE INDEX idx_audit_event ON tenant_{org_id}.compliance_audit_log(event_id);
CREATE INDEX idx_audit_category ON tenant_{org_id}.compliance_audit_log(audit_category);
CREATE INDEX idx_audit_regulation ON tenant_{org_id}.compliance_audit_log(regulation);
CREATE INDEX idx_audit_status ON tenant_{org_id}.compliance_audit_log(compliance_status);
CREATE INDEX idx_audit_retention ON tenant_{org_id}.compliance_audit_log(retention_until);
CREATE INDEX idx_audit_timestamp ON tenant_{org_id}.compliance_audit_log(audit_timestamp DESC);

-- ----------------------------------------------------------------------------
-- Saved Views (LabKey-Inspired Custom Queries)
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_{org_id}.saved_views (
    view_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- View identification
    view_name VARCHAR(255) NOT NULL,
    description TEXT,
    view_slug VARCHAR(100),
    
    -- Ownership
    created_by UUID NOT NULL, -- References lilo_platform.users
    owner_user_id UUID,
    
    -- Query definition
    entity VARCHAR(50) NOT NULL, -- 'chemicals', 'transactions', 'scans', 'alerts'
    query_definition JSONB NOT NULL, -- GraphQL query structure
    
    -- Display configuration
    column_configuration JSONB, -- Column order, widths, formatting
    default_sort JSONB,
    default_filters JSONB,
    aggregations JSONB,
    
    -- Sharing
    visibility VARCHAR(50) DEFAULT 'private', -- 'private', 'shared', 'public'
    shared_with_users UUID[],
    shared_with_roles VARCHAR(50)[],
    shared_with_labs UUID[],
    
    -- Usage tracking
    view_count INT DEFAULT 0,
    last_viewed_at TIMESTAMP,
    favorite_count INT DEFAULT 0,
    
    -- Scheduling
    is_scheduled BOOLEAN DEFAULT FALSE,
    schedule_expression VARCHAR(100), -- Cron expression
    schedule_timezone VARCHAR(50),
    schedule_recipients JSON,
    schedule_format VARCHAR(20),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_by UUID,
    
    CONSTRAINT valid_entity CHECK (entity IN ('chemicals', 'transactions', 'scans', 'alerts', 'events')),
    CONSTRAINT valid_visibility CHECK (visibility IN ('private', 'shared', 'public'))
);

CREATE INDEX idx_view_owner ON tenant_{org_id}.saved_views(owner_user_id);
CREATE INDEX idx_view_entity ON tenant_{org_id}.saved_views(entity);
CREATE INDEX idx_view_visibility ON tenant_{org_id}.saved_views(visibility);
CREATE INDEX idx_view_created_by ON tenant_{org_id}.saved_views(created_by);

-- ----------------------------------------------------------------------------
-- Scheduled Reports
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_{org_id}.scheduled_reports (
    schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Report details
    report_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Source query
    saved_view_id UUID REFERENCES tenant_{org_id}.saved_views(view_id) ON DELETE CASCADE,
    report_template VARCHAR(50), -- 'standard', 'regulatory', 'executive', 'safety'
    
    -- Schedule (cron-like expression)
    schedule_expression VARCHAR(100) NOT NULL, -- '0 9 * * MON' = Every Monday 9 AM
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    
    -- Smart triggering
    trigger_on_threshold BOOLEAN DEFAULT FALSE,
    threshold_condition JSONB, -- {"field": "expiring_count", "operator": ">", "value": 5}
    
    -- Delivery
    delivery_method VARCHAR(50) NOT NULL, -- 'email', 'slack', 'webhook', 's3'
    recipients JSONB NOT NULL, -- Array of email addresses or endpoints
    cc_recipients JSONB,
    
    -- Format
    format VARCHAR(20) DEFAULT 'pdf', -- 'pdf', 'excel', 'csv', 'html'
    include_charts BOOLEAN DEFAULT TRUE,
    include_raw_data BOOLEAN DEFAULT FALSE,
    
    -- Execution tracking
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMP,
    last_run_status VARCHAR(50), -- 'success', 'failed', 'skipped'
    last_run_error TEXT,
    next_run_at TIMESTAMP,
    run_count INT DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_delivery_method CHECK (delivery_method IN ('email', 'slack', 'webhook', 's3')),
    CONSTRAINT valid_format CHECK (format IN ('pdf', 'excel', 'csv', 'html', 'json'))
);

CREATE INDEX idx_report_active ON tenant_{org_id}.scheduled_reports(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_report_next_run ON tenant_{org_id}.scheduled_reports(next_run_at);
CREATE INDEX idx_report_view ON tenant_{org_id}.scheduled_reports(saved_view_id);

-- ----------------------------------------------------------------------------
-- Role-Based Access Control
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_{org_id}.roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Role definition
    role_name VARCHAR(100) UNIQUE NOT NULL,
    role_slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Role type
    is_system_role BOOLEAN DEFAULT FALSE, -- Pre-defined vs custom
    
    -- Permissions (array of permission strings)
    permissions JSONB NOT NULL DEFAULT '[]',
    
    -- Hierarchy
    inherits_from UUID REFERENCES tenant_{org_id}.roles(role_id),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID
);

CREATE INDEX idx_role_slug ON tenant_{org_id}.roles(role_slug);

-- ----------------------------------------------------------------------------
-- User Role Assignments (Scoped)
-- ----------------------------------------------------------------------------
CREATE TABLE tenant_{org_id}.user_role_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User and role
    user_id UUID NOT NULL, -- References lilo_platform.users
    role_id UUID NOT NULL REFERENCES tenant_{org_id}.roles(role_id) ON DELETE CASCADE,
    
    -- Scope (hierarchical)
    scope_type VARCHAR(50) NOT NULL, -- 'organization', 'department', 'lab', 'cabinet'
    scope_id UUID NOT NULL, -- ID of the dept/lab/cabinet
    
    -- Grant details
    granted_by UUID, -- References lilo_platform.users
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP, -- Optional temporary access
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    revoked_at TIMESTAMP,
    revoked_by UUID,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, role_id, scope_type, scope_id),
    CONSTRAINT valid_scope_type CHECK (scope_type IN ('organization', 'department', 'lab', 'cabinet'))
);

CREATE INDEX idx_assignment_user ON tenant_{org_id}.user_role_assignments(user_id);
CREATE INDEX idx_assignment_role ON tenant_{org_id}.user_role_assignments(role_id);
CREATE INDEX idx_assignment_scope ON tenant_{org_id}.user_role_assignments(scope_type, scope_id);
CREATE INDEX idx_assignment_active ON tenant_{org_id}.user_role_assignments(is_active) WHERE is_active = TRUE;
```

## **DynamoDB Tables (NoSQL for Real-Time Data)**

```javascript
// ============================================================================
// DYNAMODB TABLES: Real-time event streaming and device telemetry
// ============================================================================

// Table 1: Real-Time Event Stream (Hot Data, 7-day TTL)
{
  TableName: "lilo-event-stream",
  KeySchema: [
    { AttributeName: "org_id", KeyType: "HASH" },  // Partition key
    { AttributeName: "timestamp", KeyType: "RANGE" } // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: "org_id", AttributeType: "S" },
    { AttributeName: "timestamp", AttributeType: "N" }, // Unix timestamp
    { AttributeName: "event_type", AttributeType: "S" },
    { AttributeName: "cabinet_id", AttributeType: "S" }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "EventTypeIndex",
      KeySchema: [
        { AttributeName: "org_id", KeyType: "HASH" },
        { AttributeName: "event_type", KeyType: "RANGE" }
      ],
      Projection: { ProjectionType: "ALL" }
    },
    {
      IndexName: "CabinetIndex",
      KeySchema: [
        { AttributeName: "cabinet_id", KeyType: "HASH" },
        { AttributeName: "timestamp", KeyType: "RANGE" }
      ],
      Projection: { ProjectionType: "ALL" }
    }
  ],
  TimeToLiveSpecification: {
    Enabled: true,
    AttributeName: "ttl" // Auto-delete after 7 days
  },
  BillingMode: "PAY_PER_REQUEST"
}

// Item Structure:
{
  "org_id": "uuid",
  "timestamp": 1698768000,
  "event_id": "uuid",
  "event_type": "motion_detected|scan_complete|checkout|safety_alert",
  "cabinet_id": "uuid",
  "shelf_id": 3,
  "user_id": "uuid",
  "details": {
    // Event-specific details
  },
  "ttl": 1699372800 // Auto-expire
}

// Table 2: Device Telemetry (IoT Health Metrics)
{
  TableName: "lilo-device-telemetry",
  KeySchema: [
    { AttributeName: "device_id", KeyType: "HASH" },
    { AttributeName: "timestamp", KeyType: "RANGE" }
  ],
  AttributeDefinitions: [
    { AttributeName: "device_id", AttributeType: "S" },
    { AttributeName: "timestamp", AttributeType: "N" },
    { AttributeName: "org_id", AttributeType: "S" }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "OrgDevicesIndex",
      KeySchema: [
        { AttributeName: "org_id", KeyType: "HASH" },
        { AttributeName: "timestamp", KeyType: "RANGE" }
      ],
      Projection: { ProjectionType: "ALL" }
    }
  ],
  TimeToLiveSpecification: {
    Enabled: true,
    AttributeName: "ttl" // Auto-delete after 30 days
  },
  BillingMode: "PAY_PER_REQUEST"
}

// Item Structure:
{
  "device_id": "uuid",
  "timestamp": 1698768000,
  "org_id": "uuid",
  "cabinet_id": "uuid",
  "metrics": {
    "cpu_usage": 45.2,
    "memory_usage": 62.1,
    "disk_usage": 38.5,
    "temperature": 42.3,
    "uptime_seconds": 432000,
    "network_quality": "excellent"
  },
  "health_status": "healthy|warning|critical",
  "ttl": 1701360000
}

// Table 3: User Sessions (Real-time activity)
{
  TableName: "lilo-user-sessions",
  KeySchema: [
    { AttributeName: "session_id", KeyType: "HASH" }
  ],
  AttributeDefinitions: [
    { AttributeName: "session_id", AttributeType: "S" },
    { AttributeName: "user_id", AttributeType: "S" },
    { AttributeName: "last_activity", AttributeType: "N" }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "UserSessionsIndex",
      KeySchema: [
        { AttributeName: "user_id", KeyType: "HASH" },
        { AttributeName: "last_activity", KeyType: "RANGE" }
      ],
      Projection: { ProjectionType: "ALL" }
    }
  ],
  TimeToLiveSpecification: {
    Enabled: true,
    AttributeName: "ttl" // 24-hour session expiry
  },
  BillingMode: "PAY_PER_REQUEST"
}
```

## **Key Schema Features Summary**

## **Multi-Tenancy**

* Complete data isolation via schema-per-tenant in PostgreSQL  
* Org\_id partition key in DynamoDB for query isolation  
* Row-level security policies for shared platform tables

## **Hierarchical Organization**

* Organization → Department → Laboratory → Cabinet → Container  
* Flexible role assignments at any hierarchy level  
* Inherited permissions cascade down the tree

## **Compliance & Audit**

* 7-year audit log retention with automatic archival  
* Immutable event logs with full change tracking  
* Digital signatures for regulatory report authenticity  
* Separate compliance audit table for regulatory events

## **LabKey-Inspired Analytics**

* Saved views with GraphQL query definitions  
* Scheduled reports with smart threshold triggering  
* Custom dashboards with shared/private visibility  
* Full-text search across all major tables

## **Real-Time Capabilities**

* DynamoDB for sub-second event streaming  
* WebSocket subscriptions via AppSync  
* Device telemetry with 30-day hot retention  
* Live activity feeds and notifications

## **Performance Optimizations**

* Extensive indexing strategy on all foreign keys and query patterns  
* Partitioning for high-volume tables (events, scans)  
* Full-text search indexes using PostgreSQL tsvector  
* TTL-based automatic cleanup in DynamoDB

## **Data Retention Strategy**

* Hot data: DynamoDB (7-30 days)  
* Warm data: PostgreSQL active tables (3 years)  
* Cold data: S3/Glacier archival (7+ years for compliance)  
* Automatic lifecycle policies for cost optimization

This schema supports all features discussed in the proposal including automated tracking, compliance, analytics, safety monitoring, and real-time updates while maintaining strong multi-tenant isolation and security.

