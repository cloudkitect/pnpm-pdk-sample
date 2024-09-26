import { javascript } from "projen";
import { monorepo } from "@aws/pdk";
import {AwsCdkConstructLibrary} from "projen/lib/awscdk";
import {NpmAccess} from "projen/lib/javascript";


const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "pnpm-pdk-sample",
  packageManager: javascript.NodePackageManager.PNPM,
  pnpmVersion: "8",
  github: true,
  release: true,
  releaseToNpm: true,
  npmAccess: NpmAccess.PUBLIC,
  npmProvenance: false,
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
  repositoryUrl: 'https://github.com/cloudkitect/pnpm-pdk-sample',
});
constructs.synth();

const patterns = new AwsCdkConstructLibrary({
  defaultReleaseBranch: 'main',
  name: `@sample/patterns`,
  outdir: `packages/@sample/patterns`,
  cdkVersion: '2.160.0',
  author: 'CloudKitect Inc',
  authorAddress: 'support@cloudkitect.com',
  parent: project,
  constructsVersion: '10.3.0',
  jsiiVersion: '~5.5.0',
  packageManager: project.package.packageManager,
  repositoryUrl: 'https://github.com/cloudkitect/pnpm-pdk-sample',
});
patterns.addPeerDeps('@sample/constructs')

patterns.synth();

project.nx.setTargetDefault("release", {
  dependsOn: ["^release"],
});
project.synth();