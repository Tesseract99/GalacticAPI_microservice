pipeline {
    agent any

    environment {
        // Set your AWS ECR registry URL
        // AWS_ECR_REGISTRY = 'http://557571305961.dkr.ecr.us-east-1.amazonaws.com/user'
        AWS_ECR_REGISTRY = "557571305961.dkr.ecr.us-east-1.amazonaws.com/"
        // Set your Docker image name
        DOCKER_TAG = "user:latest"
        DOCKER_IMAGE_NAME = "${AWS_ECR_REGISTRY}${DOCKER_TAG}"
    }

    stages {
        stage('Build Docker Image: user') {
            steps {
                script {
                    // Build Docker image from Dockerfile in the USER folder
                    docker.build("${DOCKER_IMAGE_NAME}", "--file user/Dockerfile .")
                }
            }
        }

        stage('Push to AWS ECR') {
            steps {
                script{
                  def dockerImage = docker.image("${DOCKER_IMAGE_NAME}")
                   docker.withRegistry("http://${AWS_ECR_REGISTRY}", 'ecr:us-east-1:aws_access_key_prithvi_general2') {
                    dockerImage.push()
                   }
                }
            }
        }
    }
}
