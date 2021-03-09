output "id" {
  value       = "${aws_api_gateway_rest_api.fprcred.id}"
  description = "The ID of the REST API"
}

output "root_resource_id" {
  value       = "${aws_api_gateway_rest_api.fprcred.root_resource_id}"
  description = "The resource ID of the REST API's root"
}

output "api_arn" {
  value       = "${aws_api_gateway_rest_api.fprcred.execution_arn}"
  description = "The execution ARN of the REST API"
}
