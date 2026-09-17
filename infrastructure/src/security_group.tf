module "security_group" {
  source = "terraform-aws-modules/security-group/aws"

  name        = local.vpc_security_group_name
  description = local.vpc_security_group_description
  vpc_id      = module.vpc.vpc_id

  ingress_rules = {
    https = {
      from_port   = 5432
      to_port     = 5432
      ip_protocol = "tcp"
      description = "PostgreSQL access from within VPC"
      cidr_ipv4   = module.vpc.vpc_cidr_block
    }
    self-all = {
      ip_protocol                  = "-1"
      referenced_security_group_id = "self"
      description                  = "All traffic from this SG"
    }
  }

  tags = {
    Environment = "dev"
  }

}