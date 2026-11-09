/**
 * Render Worker — Blueprint §6
 * JANGAN jalankan di Vercel Functions. Worker terpisah untuk build/test/render panjang.
 */
export interface RenderJob { id: string; type: 'build'|'render'|'test'; payload: any; timeoutSec: number; }
export async function handleJob(job: RenderJob) {
  console.log(`[worker] handling ${job.type} ${job.id}`);
  return { jobId: job.id, status: 'done', artifactUrl: `https://storage.supabase.co/artifacts/${job.id}.zip` };
}
if (require.main === module) {
  const http = require('http');
  http.createServer(async (req: any, res: any) => {
    if (req.url === '/health') { res.writeHead(200); res.end('ok'); return; }
    let body=''; req.on('data',(c:any)=>body+=c); req.on('end', async()=>{
      try { const job = JSON.parse(body || '{}'); const out=await handleJob(job); res.writeHead(200,{'content-type':'application/json'}); res.end(JSON.stringify(out)); }
      catch(e:any){ res.writeHead(500); res.end(e.message); }
    });
  }).listen(3001, '0.0.0.0', ()=>console.log('Render worker @ http://0.0.0.0:3001'));
}
