pipeline {
    agent any

    environment {
        // Set your AWS ECR registry URL
        // AWS_ECR_REGISTRY = 'http://557571305961.dkr.ecr.us-east-1.amazonaws.com/user'
        AWS_ECR_REGISTRY = "557571305961.dkr.ecr.us-east-1.amazonaws.com/"
        // Set your Docker image name
        DOCKER_TAG_USER = "user:latest"
        DOCKER_TAG_TOUR= "tour:latest"
        DOCKER_TAG_VIEW= "view:latest"
        DOCKER_TAG_BOOKING= "booking:latest"

        DOCKER_IMAGE_NAME_USER = "${AWS_ECR_REGISTRY}${DOCKER_TAG_USER}"
        DOCKER_IMAGE_NAME_TOUR = "${AWS_ECR_REGISTRY}${DOCKER_TAG_TOUR}"
        DOCKER_IMAGE_NAME_VIEW = "${AWS_ECR_REGISTRY}${DOCKER_TAG_VIEW}"
        DOCKER_IMAGE_NAME_BOOKING = "${AWS_ECR_REGISTRY}${DOCKER_TAG_BOOKING}"

    }

    stages {
        stage('Build Docker Images') {
            steps {
                script {
                    // Build Docker image from Dockerfile in the USER folder
                    echo 'Building user image'
                    dir('user') {
                    docker.build("${DOCKER_IMAGE_NAME_USER}", "--file Dockerfile .")
                    }
                }
                script {
                    // Build Docker image from Dockerfile in the USER folder
                    echo 'Building tour image'
                    dir('tour') {
                    docker.build("${DOCKER_IMAGE_NAME_TOUR}", "--file Dockerfile .")
                    }
                }
                script {
                    // Build Docker image from Dockerfile in the USER folder
                    echo 'Building view image'
                    dir('view') {
                    docker.build("${DOCKER_IMAGE_NAME_VIEW}", "--file Dockerfile .")
                    }
                }
                script {
                    // Build Docker image from Dockerfile in the USER folder
                    echo 'Building booking image'
                    dir('booking') {
                    docker.build("${DOCKER_IMAGE_NAME_BOOKING}", "--file Dockerfile .")
                    }
                }
            }
        }

        stage('Push to AWS ECR') {
            steps {
                script{
                    echo 'Pushing user image to ECR'
                  def dockerImage = docker.image("${DOCKER_IMAGE_NAME_USER}")
                   docker.withRegistry("http://${AWS_ECR_REGISTRY}", 'ecr:us-east-1:aws_access_key_prithvi_general2') {
                    dockerImage.push()
                   }
                }
                script{
                    echo 'Pushing user image to ECR'
                  def dockerImage = docker.image("${DOCKER_IMAGE_NAME_TOUR}")
                   docker.withRegistry("http://${AWS_ECR_REGISTRY}", 'ecr:us-east-1:aws_access_key_prithvi_general2') {
                    dockerImage.push()
                   }
                }
                script{
                    echo 'Pushing user image to ECR'
                  def dockerImage = docker.image("${DOCKER_IMAGE_NAME_VIEW}")
                   docker.withRegistry("http://${AWS_ECR_REGISTRY}", 'ecr:us-east-1:aws_access_key_prithvi_general2') {
                    dockerImage.push()
                   }
                }
                script{
                    echo 'Pushing user image to ECR'
                  def dockerImage = docker.image("${DOCKER_IMAGE_NAME_BOOKING}")
                   docker.withRegistry("http://${AWS_ECR_REGISTRY}", 'ecr:us-east-1:aws_access_key_prithvi_general2') {
                    dockerImage.push()
                   }
                }
            }
        }
    }
}
