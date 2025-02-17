# Static web site deployed to AWS

    HTML/CSS/JS website for a fictitious automotive detailing business, deployed on AWS 
    (S3, CloudFront, Route53, Lambdas, DynamoDB, API Gateway, CodePipelines)

## Link to website

    https://primetimeauto.knightj.xyz

## Technologies

    HTML, CSS, JavaScript, AWS 
    (S3, CloudFront, Route53, Lambdas, DynamoDB, API Gateway, CodePipelines)

## Status

    Project is in progress (February 2022 - Present)

## Why

        After completing a Udemy course on HTML and CSS by Jonas Schmedtmann,
    I wanted to test out my HTML, CSS, and JavaScript skills.

    I decided to develop a website for a fictitious business.
    The fictitious business is called Primtetime Automotive Detailing LLC.

    I came up with the idea, because I thought that a car detailing business would need various features
    such as a Gallery, Pricing plans, FAQs, a Contact form, and more.

    2 years later, after gaining more experience with JavaScript through online resources such as Frontend Masters
    and Youtube, I decided to implement more features on this project.

    I revamped the form section and improved the sticky navigation bar.

    The form is multi step and has a progress bar on top.

    I also added validations for the appointment date with the earliest date being the current date and the latest being 2 months in advance.

    At the end of 2024, I wanted to gain more experience with AWS, so I decided to migrate from Netlify to AWS

## Infrastructure

    I used AWS CDK to provision various resources
    (S3 Bucket, CloudFront Distribution, CodePipelines, Inserting a DNS record, Lambdas, DynamoDB API Gateway).

    Setup automated CI/CD pipeline with CodePipelines that is triggered by GitHub Commits to the main branch.

    Integrated infrastucture tests within the pipeline.

    Created two AWS Lambda functions for server-side validation and securing database calls, exposing them through API Gateway to enable the Contact Us form to submit data to DynamoDB.

## Wireframes

![IMG_6077](https://user-images.githubusercontent.com/96459238/159185485-62a71c25-2758-4db5-896f-adda672ef436.jpeg)

![IMG_6078](https://user-images.githubusercontent.com/96459238/159185486-c8a94eeb-1a30-4323-a00b-49058b9e0413.jpeg)

![IMG_6079](https://user-images.githubusercontent.com/96459238/159185489-baaff980-f339-4f7a-8ee7-9bf37e6c94b0.jpeg)

![IMG_6080](https://user-images.githubusercontent.com/96459238/159185546-ee439313-729d-4072-8278-a2895254e907.jpeg)

## Updates (2024)

### Form before:

![image](https://github.com/user-attachments/assets/ac371999-f956-4764-83a2-a8a874f1efa1)

### Form after:

![image](https://github.com/user-attachments/assets/dc179ab6-dad5-4e42-9664-cea049f4e81d)
![image](https://github.com/user-attachments/assets/aa378ee7-e66d-4f0e-a499-2ac791a0ef0b)
