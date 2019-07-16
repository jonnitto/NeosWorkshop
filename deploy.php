<?php

namespace Deployer;
use Symfony\Component\Yaml\Yaml;

require_once 'recipe/flow_framework.php';

inventory('hosts.yml');

set('html_path', '/var/www/virtual/{{user}}');
set('deploy_path', '/var/www/virtual/{{user}}/Neos');
set('bash_sync', 'https://raw.githubusercontent.com/jonnitto/bash/master/bash.sh');

// Share global configuration
set('shared_files', [
    'Configuration/Settings.yaml',
]);


desc('Initialize installation on Uberspace');
task('install', [
    'install:check',
    'ssh:key',
    'install:wait',
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'deploy:vendors',
    'deploy:shared',
    'deploy:writable',
    'install:settings',
    'install:copy',
    'deploy:run_migrations',
    'deploy:publish_resources',
    'install:symlink',
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
    'install:success',
    'install:bash'
]);


desc('Create and/or read the deployment key');
task('ssh:key', function () {
    $hasKey = test('[ -f ~/.ssh/id_rsa.pub ]');
    if (!$hasKey) {
        run('cat /dev/zero | ssh-keygen -q -N "" -t rsa -b 4096 -C "$(hostname -f)"');
    }
    $pub = run('cat ~/.ssh/id_rsa.pub');
    writeln('');
    writeln('<comment>Your id_rsa.pub key is:</comment>');
    writeln("<info>{$pub}</info>");
    writeln('');

    $repository = preg_replace('/.*@([^:]*).*/', '$1', get('repository'));
    if ($repository) {
        run("ssh-keyscan {$repository} >> ~/.ssh/known_hosts");
    }
})->shallow();


desc('Install the synchronized bash script');
task('install:bash', function () {
    $bash_sync = false;
    try {
        $bash_sync = get('bash_sync');
    } catch (\Throwable $th) {
    }
    if ($bash_sync && askConfirmation(' Do you want to install the synchronized bash script? ', true)) {
        run('wget -qN {{bash_sync}} -O syncBashScript.sh; source syncBashScript.sh');
        writeln('');
        writeln('<info>Synchronized bash scripts from GitHub successfully installed</info>');
        writeln('');
        exit;
    }
})->shallow();


desc('Wait for the user to continue');
task('install:wait', function () {
    writeln('<comment>Add this key as a deployment key in your Repository</comment>');
    writeln('<comment>under → Settings → Deploy keys</comment>');
    writeln('');
    if (!askConfirmation(' Press enter to continue ', true)) {
        writeln('');
        writeln('<error> Installation canceled </error>');
        writeln('');
        exit;
    }
})->shallow()->setPrivate();


desc('Success message');
task('install:success', function () {
    writeln('');
    writeln('<info>Successfully installed!</info>');
    writeln('To deploy your site in the future, simply run <fg=cyan>dep deploy</fg=cyan>.');
    writeln('');
})->shallow()->setPrivate();


desc('Symlink the html folder');
task('install:symlink', function () {
    within('{{html_path}}', function() {
        run('if [ -d html ]; then mv html html_OLD; fi');
        run('rm -rf html');
        run('ln -s {{deploy_path}}/current/Web html');
    });
})->setPrivate();


desc('Check if Neos is already installed');
task('install:check', function () {
    $installed = test('[ -f {{deploy_path}}/shared/Configuration/Settings.yaml ]');
    if ($installed) {
        writeln('');
        writeln('<error> Neos seems already installed </error>');
        writeln('<comment>Please remove the whole Neos folder to start over again.</comment>');
        writeln('');
        exit;
    }
})->shallow()->setPrivate();


desc('Create Settings.yaml for Neos');
task('install:settings', function () {
    cd('{{release_path}}');
    run('
cat > Configuration/Settings.yaml <<__EOF__
Neos: &settings
  Imagine:
    driver: Imagick
  Flow:
    core:
      phpBinaryPathAndFilename: \'/usr/bin/php\'
      subRequestIniEntries:
        memory_limit: 2048M
    persistence:
      backendOptions:
        driver: pdo_mysql
        dbname: $(whoami)
        user: $(whoami)
        password: \'$(grep -Po -m 1 "password=\K(\S)*" ~/.my.cnf)\'
        host: localhost
TYPO3: *settings
__EOF__
');
})->setPrivate();


desc('Import the local database and persistent resources');
task('install:copy', function() {
    if (askConfirmation(' Do you want to import your local database and persistent resources? ', true)) {
        writeln('   Export, compress, upload and import database');
        $yaml = runLocally('./flow configuration:show --type Settings --path Neos.Flow.persistence.backendOptions');
        $settings = Yaml::parse($yaml);
        $file = 'dump.sql';
        $port = isset($settings['port']) ? $settings['port'] : '3306';
        runLocally("mysqldump -h {$settings['host']} -P {$port} -u {$settings['user']} -p{$settings['password']} {$settings['dbname']} > {$file}");
        runLocally("tar cfz {$file}.tgz {$file}");
        upload("{$file}.tgz", "{{release_path}}/{$file}.tgz");
        cd("{{release_path}}");
        run("tar xzOf {$file}.tgz | mysql $(whoami)");
        runLocally("rm -f {$file}.tgz {$file}");
        run("rm -f {$file}.tgz");

        writeln('   Compress, upload and extract persistent resources');
        runLocally("tar cfz Resources.tgz Data/Persistent/Resources");
        upload("Resources.tgz", "{{release_path}}/Resources.tgz");
        run("tar xf Resources.tgz");
        runLocally("rm -f Resources.tgz");
        run("rm -f Resources.tgz");
    }
})->setPrivate();


desc('Kill all PHP processes after symlink');
task('deploy:kill_php', function () {
    run('killall -q php-fpm || true;');
})->setPrivate();
after('deploy:symlink', 'deploy:kill_php');


desc('Build frontend files');
task('yarn:pipeline', function () {
    runLocally('yarn pipeline');
})->setPrivate();


desc('Push rendererd resources to git');
task('yarn:git', function () {
    runLocally('git add DistributionPackages/**/Resources/Public');
    runLocally('git add DistributionPacka ge s/**/Resources/Private/Templates/I nlineAssets ');
    runLocally('git commit -m ":lipstick: Build frontend resources" || echo ""');
    runLocally('git push');
})->setPrivate();


desc('Build frontend files and push them to git');
task('yarn', [
    'yarn:pipeline',
    'yarn:git'
]);


desc('Create release tag on git');
task('deploy:tag', function () {
    // Set timestamps tag
    set('tag', date('Y-m-d_T_H-i-s'));
    set('day', date('d.m.Y'));
    set('time', date('H:i:s'));

    runLocally(
        'git tag -a -m "Deployment on the {{day}} at {{time}}" "{{tag}}"'
    );
    runLocally('git push origin --tags');
});


after('deploy:failed', 'deploy:unlock');

// Execute flow publish resources after a rollback (path differs, because release_path is the old one here)
desc('Publish flow resources');
task('rollback:publishresources', function () {
    run('FLOW_CONTEXT={{flow_context}} {{bin/php}} {{release_path}}/{{flow_command}} resource:publish');
})->setPrivate();
after('rollback', 'rollback:publishresources');
