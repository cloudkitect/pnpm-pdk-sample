import { javascript } from "projen";
import { monorepo } from "@aws/pdk";
import {AwsCdkConstructLibrary} from "projen/lib/awscdk";


const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "pnpm-pdk-sample",
  packageManager: javascript.NodePackageManager.PNPM,
  pnpmVersion: "8",
  github: true,
  release: true,
  depsUpgrade: false,
  projenrcTs: true,
});

const constructs = new AwsCdkConstructLibrary({
  defaultReleaseBranch: 'main',
  name: `@sample/constructs`,
  outdir: `packages/@sample/constructs`,
  cdkVersion: '2.160.0',
  author: 'CloudKitect Inc',
  authorAddress: 'support@cloudkitect.com',
  parent: project,
  constructsVersion: '10.3.0',
  jsiiVersion: '~5.5.0',
  packageManager: project.package.packageManager,
  repositoryUrl: 'https://github.com/cloudkitect/sample',
});
constructs.synth();
project.synth();