import {javascript} from "projen";
import {monorepo} from "@aws/pdk";
import {AwsCdkConstructLibrary} from "projen/lib/awscdk";
import path from "node:path";
import {CodeArtifactAuthProvider} from "projen/lib/release";
import {NpmAccess} from "projen/lib/javascript";


const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "@cloudkitect/pnpm-pdk-sample",
  packageManager: javascript.NodePackageManager.PNPM,
  pnpmVersion: "8",
  github: true,
  release: true,
  releaseToNpm: true,
  depsUpgrade: false,
  projenrcTs: true,
  npmAccess: NpmAccess.RESTRICTED,
  npmProvenance: false,
  npmRegistryUrl: 'https://cloudkitect-053336355397.d.codeartifact.us-east-1.amazonaws.com/npm/cloudkitect-artifacts/',
  codeArtifactOptions: {
    roleToAssume: 'arn:aws:iam::053336355397:role/GithubRole-RepositoryPublisherRole-Ou627tXHJL0P',
    authProvider: CodeArtifactAuthProvider.GITHUB_OIDC
  },
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
const task = constructs.tasks.tryFind('package')
task?.removeStep(0)
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
const task2 = patterns.tasks.tryFind('package')
task2?.removeStep(0)
patterns.addPeerDeps('@sample/constructs')

patterns.synth();

project.subprojects
    .filter((p) => p instanceof AwsCdkConstructLibrary)
    .forEach((p) => {
      const distDir = `${path.relative(p.outdir, project.outdir)}/dist/js`;
      p.packageTask.exec(`rm -fr dist && npx projen package-all && mkdir -p ${distDir} && cp -r dist/js/*.tgz ${distDir}`);
    });

project.synth();