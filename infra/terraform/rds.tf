resource "aws_db_instance" "postgres" {
  identifier        = "${local.prefix}-postgres"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = var.db_instance_class
  allocated_storage = 20
  storage_type      = "gp3"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.default.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  publicly_accessible = true # needed for Amplify Hosting (no fixed egress IPs)
  skip_final_snapshot = true
  deletion_protection = false

  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
