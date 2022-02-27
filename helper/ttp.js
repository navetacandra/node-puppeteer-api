const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function helper(text) {
    let url = `https://api.xteam.xyz/ttp?text=${encodeURIComponent(text)}`;
    let _json = await fetch(url)
    let res = await _json.json();
    console.log(res)
    return (await res.result)
}

module.exports = helper