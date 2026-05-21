pipeline {
    agent any

    stages {
        stage('Build and Test') {
            steps {
                sh './mvnw clean verify'
            }
        }
    }

    post {
        always {
            junit testResults: 'target/surefire-reports/*.xml', allowEmptyResults: true
        }
    }
}