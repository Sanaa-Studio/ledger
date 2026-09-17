locals {
  #security group
  vpc_security_group_name        = "ledger_vpc_security_group"
  vpc_security_group_description = "Security group for Ledger VPC"

  #rds
  rds_name                        = "ledger-dev-rds"
  rds_monitoring_role_name        = "ledger-rds-monitoring-role"
  rds_monitoring_role_description = "Monitoring the postgres db"
  db_name                         = "ledger_dev_db"
  db_username                     = "sanaa_studio"
  db_port                         = 5432

  #vpc
  vpc_name = "ledger-beta-vpc"
  vpc_cidr = "172.16.0.0/16"

  #ecs
  ecs_cluster_name = "ledger_ecs_cluster"
}
