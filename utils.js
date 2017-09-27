const { h } = snabbdom;
const hh = (name, props, ...children) => {
    // console.group('hh=>>>>', name);
    // console.log('props =>', props);
    // console.log('children =>', children);
    // console.groupEnd();

    return snabbdom.h(name, { props }, children);
};

var LOG = false;
const util = {
    inspect: (args, opts) =>
        JSON.stringify(
            args,
            (key, value) => {
                console.log({ key });
                if (
                    [
                        '_parent',
                        '_camera',
                        'parent',
                        'babylonScene',
                        'babylonCMP',
                        'engine',
                        'scene',
                        '_scene',
                    ].indexOf(key) >= 0
                ) {
                    return `-> ${key}`;
                }
                return value;
            },
            4
        ),
};

const C = (prefix, name, show, cb) => (...args) => {
    if (show.log) {
        const signature = show.signature
            ? cb
                  .toString()
                  .replace(/(.*)(=>|{)(.*)/gi, '($1)')
                  .trim()
            : '';
        console.log(`[${prefix}.BEGIN.${name}]${signature}`);

        if (show.args) {
            console.log(' args => ', ...args);
        }
    }

    const result = cb(...args);
    if (show.log) {
        if (show.result) {
            console.log(`\n##result=>`, result, `<=result##\n\n`);
        }

        console.log(`[${prefix}.END.${name}]\n\n`);
    }
    return result;
};

const WRAPPER = (
    source,
    prefix = '#?!',
    show = () => ({ log: true, args: false, result: false })
) =>
    Object.keys(source).reduce(
        (res, key) =>
            Object.assign(res, {
                [key]: C(prefix, key, show(key), source[key]),
            }),
        {}
    );

const DEBUG = (source, ...args) =>
    LOG &&
    console.log(
        `[${source}.BEGIN]\n`,
        args,
        /*util
            .inspect(args, { depth: 2 })
            .split('\n')
            .map(a => `   ${a}`)
            .join(`\n`),*/
        '\n[end]======='
    );
