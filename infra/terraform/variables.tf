variable "project_name" {
  description = "Project name prefix for resources."
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev/prod)."
  type        = string
}

variable "aws_region" {
  description = "AWS region."
  type        = string
  default     = "us-east-1"
}

variable "db_name" {
  description = "PostgreSQL database name."
  type        = string
  default     = "bolhatech"
}

variable "db_username" {
  description = "PostgreSQL master username."
  type        = string
  default     = "bolhatech"
}

variable "db_password" {
  description = "PostgreSQL master password. Store in CI secrets — never commit."
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t3.micro"
}

variable "allowed_cidr_blocks" {
  description = "CIDRs allowed to connect to RDS on port 5432. Restrict to your IPs in production."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
