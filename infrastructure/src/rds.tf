module "rds" {
  source = "terraform-aws-modules/rds/aws"

  identifier = local.rds_name

  engine                   = "postgres"
  engine_version           = "18"
  engine_lifecycle_support = "open-source-rds-extended-support-disabled"
  family                   = "postgres18"
  major_engine_version     = "18"
  instance_class           = "db.t4g.micro"

  allocated_storage     = "20"
  max_allocated_storage = "0"

  db_name  = local.db_name
  username = local.db_username
  port     = local.db_port

  manage_master_user_password_rotation = false
  #master_user_password_rotate_immediately           = false
  #master_user_password_rotation_schedule_expression = "rate(15 days)"

  multi_az               = true
  db_subnet_group_name   = module.vpc.database_subnet_group
  vpc_security_group_ids = [module.security_group.id]

  iam_database_authentication_enabled = true

  maintenance_window              = "Mon:00:00-Mon:03:00"
  backup_window                   = "03:00-06:00"
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  create_cloudwatch_log_group     = true

  backup_retention_period = 1
  skip_final_snapshot     = true
  deletion_protection     = false

  publicly_accessible = false

  performance_insights_enabled          = true
  performance_insights_retention_period = 7
  create_monitoring_role                = true
  monitoring_interval                   = 60
  monitoring_role_name                  = local.rds_monitoring_role_name
  monitoring_role_use_name_prefix       = true
  monitoring_role_description           = local.rds_monitoring_role_description

  tags = {
    Owner       = "ledger"
    Environment = "dev"
  }
}