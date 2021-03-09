terraform {
  version = "0.11.11"
}

provider "aws" {
  version = "2.45"
  region  = "ap-southeast-1"
}

module "authorizer_lambda" {
  source                        = "git@github.com:traveloka/terraform-aws-lambda.git?ref=v0.10.0"
  is_local_archive              = "true"
  lambda_archive_directory_path = "${path.module}/lambda/dist/lambda.zip"
  lambda_code_directory_path    = "${path.module}/lambda/src"
  lambda_descriptive_name       = "${local.authorizer_lambda_name}"
  lambda_runtime                = "nodejs12.x"
  lambda_handler                = "${local.lambda_handler}"
  lambda_memory_size            = "128"
  lambda_timeout                = "30"
  environment                   = "${local.environment}"
  product_domain                = "${local.product_domain}"

  log_retention_days           = "14"
  lambda_environment_variables = "${local.authorizer_environment_variables}"
}

resource "aws_api_gateway_rest_api" "fprcred" {
  name        = "fprcred"
  description = "API Gateway to manage authorisation"
  body        = "${data.template_file.apigw.rendered}"
}

resource "aws_lambda_permission" "authorizer" {
  action        = "lambda:InvokeFunction"
  statement_id  = "allowAuthorizerInvocation"
  function_name = "${module.authorizer_lambda.lambda_name}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.fprcred.execution_arn}/*"
}

resource "aws_api_gateway_method_settings" "v1" {
  rest_api_id = "${aws_api_gateway_rest_api.fprcred.id}"
  stage_name  = "${aws_api_gateway_deployment.RestApiDeploymentv1.stage_name}"
  method_path = "*/*"

  settings {
    metrics_enabled        = false
    logging_level          = "INFO"
    cache_ttl_in_seconds   = "300"
    throttling_burst_limit = "20"
    throttling_rate_limit  = "30"
  }
}

resource "aws_api_gateway_deployment" "RestApiDeploymentv1" {
  rest_api_id = "${aws_api_gateway_rest_api.fprcred.id}"
  stage_name  = "v1"
}
