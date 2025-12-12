export default async () => {
    return new Response(
        JSON.stringify({ ok: true, msg: "ping funcionando" }),
        { headers: { "Content-Type": "application/json" } }
    );
};
