provider "aws" {
  access_key = "ledgeraccesskey"
  secret_key = "ledgersecretkey"
  region     = "us-west-2"

  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    ec2                  = "http://localhost:4566"
    s3                   = "http://localhost:4566"
    rds                  = "http://localhost:4566"
    lambda               = "http://localhost:4566"
    apigateway           = "http://localhost:4566"
    elasticache          = "http://localhost:4566"
    ecs                  = "http://localhost:4566"
    cloudwatch           = "http://localhost:4566"
    cloudwatchlogs       = "http://localhost:4566"
    iam                  = "http://localhost:4566"
    secretsmanager       = "http://localhost:4566"
    sns                  = "http://localhost:4566"
    sqs                  = "http://localhost:4566"
    kms                  = "http://localhost:4566"
    elasticloadbalancing = "http://localhost:4566"
    route53              = "http://localhost:4566"
    acm                  = "http://localhost:4566"
  }
}

resource "aws_ecs_cluster" "ledger" {
  name = local.ecs_cluster_name
  setting {
    name  = "containerInsights"
    value = "disabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "cluster" {
  cluster_name       = aws_ecs_cluster.ledger.name
  capacity_providers = ["FARGATE"]
}