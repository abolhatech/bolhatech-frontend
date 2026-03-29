output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint (host:port)."
  value       = aws_db_instance.postgres.endpoint
}

output "rds_host" {
  description = "RDS PostgreSQL hostname only."
  value       = aws_db_instance.postgres.address
}

output "db_name" {
  description = "PostgreSQL database name."
  value       = aws_db_instance.postgres.db_name
}

output "database_url_template" {
  description = "DATABASE_URL template — replace <password> with the actual value."
  value       = "postgresql://${aws_db_instance.postgres.username}:<password>@${aws_db_instance.postgres.endpoint}/${aws_db_instance.postgres.db_name}"
  sensitive   = false
}
