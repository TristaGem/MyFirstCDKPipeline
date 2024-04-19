import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep} from "aws-cdk-lib/pipelines";
import {validatePipelineVariableName} from "aws-cdk-lib/aws-codepipeline/lib/private/validation";
import {MyPipelineAppStage} from "./stage";
import {ManualApprovalAction} from "aws-cdk-lib/aws-codepipeline-actions";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdklearnStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdklearnQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: "TestPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub('TristaGem/MyFirstCDKPipeline', 'main'),
        commands: [
            'npm ci',
            'npm run build',
            'npm cdk synth'
        ]
      }),
    });

    const testingStage = pipeline.addStage(new MyPipelineAppStage(this, "test", {
      env: {account: "095851874303", region: "us-east-1"}
    }));

    testingStage.addPost(new ManualApprovalStep("Manual approval before production"));

    const prodStage = pipeline.addStage(new MyPipelineAppStage(this, "prod", {
      env: {account: "095851874303", region: "us-east-1"}
    }));

  }
}
