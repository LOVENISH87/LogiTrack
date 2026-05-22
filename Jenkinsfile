pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'logitrack-backend'
        FRONTEND_IMAGE = 'logitrack-frontend'
        DOCKER_TAG = "v${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout code from source control
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('backend') {
                    // Placeholder for tests when they are added
                    // sh 'npm test'
                    echo 'No tests specified yet. Skipping.'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    sh "docker build -t ${FRONTEND_IMAGE}:${DOCKER_TAG} -t ${FRONTEND_IMAGE}:latest ."
                }
            }
        }

        // Optional: Push to a registry like Docker Hub
        // stage('Push Docker Image') {
        //     steps {
        //         withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
        //             sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
        //             sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
        //             sh "docker push ${DOCKER_IMAGE}:latest"
        //         }
        //     }
        // }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
            sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
            sh "docker rmi ${FRONTEND_IMAGE}:${DOCKER_TAG} || true"
        }
        success {
            echo 'Build was successful! Proceeding to deployment phase.'
        }
        failure {
            echo 'Build failed. Check the logs for more details.'
        }
    }
}
