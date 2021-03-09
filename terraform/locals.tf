locals {
  product_domain = "fpr"
  service_name   = "fprcred"
  lambda_handler = "index.handler"
  environment    = "development"

  authorizer_lambda_name = "authorizer"

  authorizer_environment_variables = {
    TOKEN_ISSUER = "https://identity.ath.staging-traveloka.com/"
    AUDIENCE     = "https://tvlk/fprcred"
  }
}
