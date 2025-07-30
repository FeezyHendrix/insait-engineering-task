#!/bin/bash
# get bucket name from ../.env
export bucket_name=$(grep -oP '(?<=^BUCKET_NAME=).*' ../.env)
awslocal s3 mb s3://$bucket_name