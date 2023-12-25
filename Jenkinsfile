pipeline {
    agent any

    environment {
        // Set your AWS ECR registry URL
        AWS_ECR_REGISTRY = 'https://public.ecr.aws/s8j2k2x6/user'
        // Set your Docker image name
        DOCKER_IMAGE_NAME = 'get-stronger-mind-body'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image from Dockerfile in the USER folder
                    docker.build("${DOCKER_IMAGE_NAME}", "--file user/Dockerfile .")
                }
            }
        }

        stage('Push to AWS ECR') {
            steps {
                script {
                    // Authenticate Docker with AWS ECR
                        docker.withRegistry("${AWS_ECR_REGISTRY}", 'ecr:us-east-1:aws_access_key_prithvi_general') {
                           
                            // Push the Docker image to ECR
                            docker.image("${DOCKER_IMAGE_NAME}").push()
                        }
                    
                }
            }
        }
    }
}
