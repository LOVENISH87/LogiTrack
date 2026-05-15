pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'logitrack-backend'
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

        stage('Build Docker Image') {
            steps {
                dir('backend') {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -t ${DOCKER_IMAGE}:latest ."
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
            // Clean up old images if needed
            // sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
        }
        success {
            echo 'Build was successful! Proceeding to deployment phase.'
        }
        failure {
            echo 'Build failed. Check the logs for more details.'
        }
    }
}
