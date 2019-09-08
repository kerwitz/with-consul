const consul = require('consul')();
const uuidGenerator = require('uuid').v4;

module.exports = (expressApp, options) => {
    originalListen = expressApp.listen.bind(expressApp);

    expressApp.listen = (port, callback) => {
        const serviceId = uuidGenerator();

        const server = originalListen(port, () => {        
            // Now that we know our port, register the service to consul.
            let details = {
                port: server.address().port,
                id: serviceId,
                check: {
                    ttl: '10s',
                    deregister_critical_service_after: '1m'
                },
                ...options
            };

            console.log(`Registering service "${options.name}" to consul with the following options`);
            console.log(JSON.stringify(details));
            
            consul.agent.service.register(details, err => {
                if (err) {
                    console.error('Could not register service', err);
                    return;
                } else {
                    console.log('Service registered successfully');

                    callback();
                }
            
                setInterval(() => {
                    consul.agent.check.pass({id:`service:${serviceId}`}, err => {
                        if (err) throw new Error(err);
                    });
                }, 5 * 1000);
            });
            
            process.on('SIGINT', () => {
                console.log('SIGINT. De-Registering...');
                let details = {id: serviceId};
              
                consul.agent.service.deregister(details, (err) => {
                    console.log('de-registered.', err);
                    process.exit();
                });
            });
        });

        return server;
    };

    return expressApp;
};