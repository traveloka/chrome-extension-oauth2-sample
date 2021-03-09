data "aws_caller_identity" "aws_account" {}

data "aws_region" "current" {}

data "aws_kms_alias" "tvlk_secret_alias" {
  name = "alias/tvlk/ssm/tvlk-secret"
}

data "template_file" "apigw" {
  template = "${file("${path.module}/templates/apigw.json")}"

  vars = {
    authorizer_lambda = "${module.authorizer_lambda.lambda_name}"
  }
}
