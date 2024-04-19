import {Construct} from "constructs";
import {MyLambdaStack} from "./lambda-stack";
import * as cdk from 'aws-cdk-lib';


export class MyPipelineAppStage extends cdk.Stage {
    constructor(scope: Construct, stageName: string, props?: cdk.StageProps) {
        super(scope, stageName, props);

        const lambdaStack = new MyLambdaStack(this, 'LambdaStack', stageName);
    }
}