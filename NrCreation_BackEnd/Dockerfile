FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY target/NrCreation-0.0.1-SNAPSHOT.jar app.jar

LABEL authors="sushil"

EXPOSE 8080

CMD ["java","-jar","app.jar"]