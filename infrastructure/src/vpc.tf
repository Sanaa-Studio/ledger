module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = local.vpc_name
  cidr = local.vpc_cidr

  azs             = ["us-west-2a", "us-west-2b"]
  public_subnets  = ["172.16.0.0/24", "172.16.1.0/24"]
  private_subnets = ["172.16.10.0/24", "172.16.11.0/24"]

  database_subnets    = ["172.16.20.0/24", "172.16.21.0/24"]
  elasticache_subnets = ["172.16.30.0/24", "172.16.31.0/24"]

  create_database_subnet_group    = true
  create_elasticache_subnet_group = true

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Project     = "ledger"
    Environment = "dev"
    Terraform   = "true"
  }
}