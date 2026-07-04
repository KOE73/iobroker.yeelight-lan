const { yeelightDiscover } = require('../core/YeelightDetect.js');

async function main() {
    const args = process.argv.slice(2);
    let timeout = 3000;
    let interfaceAddress = '';
    
    // Simple argument parsing
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--timeout' || args[i] === '-t') {
            timeout = parseInt(args[i + 1], 10) || 3000;
        } else if (args[i] === '--interface' || args[i] === '-i') {
            interfaceAddress = (args[i + 1] || '').trim();
        }
    }

    console.log(`\x1b[36m[Yeelight CLI]\x1b[0m Starting network scan (timeout: ${timeout}ms)...`);
    global.log = () => {};
    
    try {
        const devices = await yeelightDiscover(timeout, { interfaceAddress });
        
        console.log(`\n\x1b[32m=== Scan Complete ===\x1b[0m`);
        console.log(`Found \x1b[33m${devices.length}\x1b[0m devices.\n`);

        devices.forEach((dev, index) => {
            const state = dev.state || {};
            const caps = dev.caps || {};
            const capNames = [];
            if (caps.hasCT) capNames.push('CT');
            if (caps.hasRGB) capNames.push('RGB');
            if (caps.hasHSV) capNames.push('HSV');
            if (caps.hasFlow) capNames.push('Flow');
            if (caps.hasBG) capNames.push('BG');
            if (caps.hasToggle) capNames.push('Toggle');

            console.log(`\x1b[36mDevice #${index + 1}\x1b[0m`);
            console.log(`  \x1b[1mID\x1b[0m:    ${dev.id}`);
            console.log(`  \x1b[1mIP\x1b[0m:    ${dev.ip}:${dev.port}`);
            console.log(`  \x1b[1mModel\x1b[0m: ${dev.model}`);
            console.log(`  \x1b[1mName\x1b[0m:  ${dev.name || 'N/A'}`);
            console.log(`  \x1b[1mState\x1b[0m: Power=${state.power || '?'}, Brightness=${state.bright || '?'}%, CT=${state.ct || '?'}, RGB=${state.rgb || '?'}`);
            console.log(`  \x1b[1mCaps\x1b[0m:  ${capNames.length ? capNames.join(', ') : 'N/A'}`);
            console.log('');
        });

    } catch (err) {
        console.error(`\x1b[31m[Error]\x1b[0m Network scan failed: ${err.message}`);
    }
}

main();
