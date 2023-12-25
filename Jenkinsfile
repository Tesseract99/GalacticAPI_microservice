pipeline {
    agent any

    environment {
        // Set your AWS ECR registry URL
        AWS_ECR_REGISTRY = 'https://public.ecr.aws/s8j2k2x6/user'
        // Set your Docker image name
        DOCKER_IMAGE_NAME = 'user'
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
              
                   sh'''
                   aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${AWS_ECR_REGISTRY}
                   docker tag ${DOCKER_IMAGE_NAME}:latest public.ecr.aws/s8j2k2x6/${DOCKER_IMAGE_NAME}:latest
                   docker push public.ecr.aws/s8j2k2x6/${DOCKER_IMAGE_NAME}:latest
                    '''
                
            }
        }
    }
}
