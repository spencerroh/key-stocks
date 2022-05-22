import path from 'path';

const __dirname = path.resolve();
const frontend = path.join(__dirname, '..', 'frontend', 'build');

var configuration = {
    endpoint: '/key-stocks',
    frontend: frontend,
    index: path.join(frontend, 'index.html'),
};

export default configuration;