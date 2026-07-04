const net = require('net');
const { yeelightDiscover } = require('../core/YeelightDetect.js');

const EFFECT = 'smooth';
const DURATION_MS = 300;

function supports(dev, flag) {
    const caps = dev.caps || {};
    return Object.keys(caps).length === 0 || !!caps[flag];
}

const ACTIONS = {
    off: {
        title: 'All off',
        commands: (dev) => [
            ['set_power', ['off', EFFECT, DURATION_MS]],
            ...(dev.caps && dev.caps.hasBG ? [['bg_set_power', ['off', EFFECT, DURATION_MS]]] : []),
        ],
    },
    on: {
        title: 'All on',
        commands: (dev) => [
            ['set_power', ['on', EFFECT, DURATION_MS]],
            ...(dev.caps && dev.caps.hasBG ? [['bg_set_power', ['on', EFFECT, DURATION_MS]]] : []),
        ],
    },
    ct5600max: {
        title: 'All CT 5600K, max brightness',
        commands: (dev) => [
            ['set_power', ['on', EFFECT, DURATION_MS, 1]],
            ...(supports(dev, 'hasCT') ? [['set_ct_abx', [5600, EFFECT, DURATION_MS]]] : []),
            ['set_bright', [100, EFFECT, DURATION_MS]],
            ...(dev.caps && dev.caps.hasBG ? [
                ['bg_set_power', ['on', EFFECT, DURATION_MS]],
                ...(dev.caps.hasBGCT ? [['bg_set_ct_abx', [5600, EFFECT, DURATION_MS]]] : []),
                ['bg_set_bright', [100, EFFECT, DURATION_MS]],
            ] : []),
        ],
    },
    ct2700min: {
        title: 'All CT 2700K, min brightness',
        commands: (dev) => [
            ['set_power', ['on', EFFECT, DURATION_MS, 1]],
            ...(supports(dev, 'hasCT') ? [['set_ct_abx', [2700, EFFECT, DURATION_MS]]] : []),
            ['set_bright', [1, EFFECT, DURATION_MS]],
            ...(dev.caps && dev.caps.hasBG ? [
                ['bg_set_power', ['on', EFFECT, DURATION_MS]],
                ...(dev.caps.hasBGCT ? [['bg_set_ct_abx', [2700, EFFECT, DURATION_MS]]] : []),
                ['bg_set_bright', [1, EFFECT, DURATION_MS]],
            ] : []),
        ],
    },
};

function parseArgs(argv) {
    const opts = {
        action: '',
        timeout: 3000,
        interfaceAddress: '',
    };

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--action' || arg === '-a') {
            opts.action = argv[++i] || '';
        } else if (arg === '--timeout' || arg === '-t') {
            opts.timeout = parseInt(argv[++i], 10) || opts.timeout;
        } else if (arg === '--interface' || arg === '-i') {
            opts.interfaceAddress = (argv[++i] || '').trim();
        }
    }

    return opts;
}

function sendCommand(host, port, id, method, params) {
    return new Promise((resolve) => {
        const socket = net.createConnection({ host, port, timeout: 3000 }, () => {
            socket.write(JSON.stringify({ id, method, params }) + '\r\n');
        });

        let settled = false;
        const finish = (result) => {
            if (settled) return;
            settled = true;
            socket.destroy();
            resolve(result);
        };

        socket.on('data', (data) => {
            const text = data.toString('utf8').trim();
            try {
                const msg = JSON.parse(text);
                if (msg.error) {
                    finish({ ok: false, text });
                    return;
                }
            } catch (e) {
                // Non-JSON responses are still useful to show to the caller.
            }
            finish({ ok: true, text });
        });
        socket.on('timeout', () => finish({ ok: false, text: 'timeout' }));
        socket.on('error', (err) => finish({ ok: false, text: err.message }));
        setTimeout(() => finish({ ok: false, text: 'overall timeout' }), 5000);
    });
}

async function run() {
    const opts = parseArgs(process.argv.slice(2));
    const action = ACTIONS[opts.action];
    if (!action) {
        console.error('Unknown or missing action. Use one of: off, on, ct5600max, ct2700min');
        process.exitCode = 1;
        return;
    }

    console.log(`\x1b[36m[Yeelight CLI]\x1b[0m ${action.title}`);
    console.log(`\x1b[36m[Yeelight CLI]\x1b[0m Scanning network (timeout: ${opts.timeout}ms)...`);
    global.log = () => {};

    const devices = await yeelightDiscover(opts.timeout, { interfaceAddress: opts.interfaceAddress });
    console.log(`Found \x1b[33m${devices.length}\x1b[0m devices.\n`);

    let id = 1;
    for (const dev of devices) {
        const label = `${dev.ip}:${dev.port || 55443} ${dev.model || 'unknown'} ${dev.name || ''}`.trim();
        console.log(`\x1b[36m${label}\x1b[0m`);

        for (const [method, params] of action.commands(dev)) {
            const result = await sendCommand(dev.ip, dev.port || 55443, id++, method, params);
            const mark = result.ok ? '\x1b[32mok\x1b[0m' : '\x1b[31mfail\x1b[0m';
            console.log(`  ${method}: ${mark} ${result.text}`);
        }
        console.log('');
    }
}

run().catch((err) => {
    console.error(`\x1b[31m[Error]\x1b[0m ${err.message}`);
    process.exitCode = 1;
});
