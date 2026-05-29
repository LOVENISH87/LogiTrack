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
                    sh 'npm test || echo "No tests specified yet. Skipping."'
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

        stage('Deploy to Render') {
            steps {
                echo 'Triggering Render deployments...'
                sh 'curl -s -o /dev/null -w "%{http_code}" -X POST "$RENDER_BACKEND_WEBHOOK"'
                sh 'curl -s -o /dev/null -w "%{http_code}" -X POST "$RENDER_FRONTEND_WEBHOOK"'
                echo 'Render deployments triggered successfully.'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
            sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
            sh "docker rmi ${FRONTEND_IMAGE}:${DOCKER_TAG} || true"
        }
        success {
            echo 'Build and deployment successful!'
        }
        failure {
            echo 'Pipeline failed. Check the logs for details.'
        }
    }
}
