import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://wpglaxqxakcfluonbazl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZ2xheHF4YWtjZmx1b25iYXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjQ2MzgsImV4cCI6MjA3NDc0MDYzOH0.HWtzRz3WhnLIfSLinZ9_hN5mEpQoaHOiDNY7m4HkIpY'
const supabase = createClient(supabaseUrl, supabaseAnonKey)


export async function buscarViagemIdPorLink(link) {
  if (!link || typeof link !== 'string') return null

  const { data, error } = await supabase
    .from('viagens')
    .select('id')
    .eq('link_viagem', link.trim())
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Erro ao buscar viagem por link_viagem:', error)
    return null
  }
  return data?.id ?? null
}


export async function buscarViagemPorId(viagemId) {
  const { data, error } = await supabase
    .from('viagens')
    .select(`
      id,
      imagem_viagem,
      destino,
      cidade:cidade!viagens_destino_fkey ( id, nome )
    `)
    .eq('id', viagemId)
    .single()

  if (error) { console.error('Erro viagem por id:', error); return null }
  if (!data) return null

  return {
    viagemId: data.id,
    cidadeId: data.cidade?.id ?? data.destino ?? null,
    nome: data.cidade?.nome ?? 'Seu Destino',
    imagem: data.imagem_viagem ?? ''
  }
}

export async function obterDestinoOrquestrado() {
  const params = new URLSearchParams(location.search)
  const viagemIdParam = params.get('viagemId')

  if (viagemIdParam) {
    const v = await buscarViagemPorId(Number(viagemIdParam))
    if (v) 
      return v
  }

  // Fallback (quase não usado aqui, pois a Tela A redireciona com viagemId)
  return {
    viagemId: null,
    cidadeId: null,
    nome: 'Seu Destino',
    imagem: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1600&auto=format&fit=crop'
  }
}


export async function inserirDestinosManualTeste() {
   const { error: errDel } = await supabase
    .from('viagens')
    .delete()
    .neq('id', 0); // deleta todos os registros (exceto id=0, se existisse)

  if (errDel) {
    console.error('Erro ao apagar viagens:', errDel);
    return;
  }

  const { data: cidades, error: erroCidade } = await supabase
    .from("cidade")
    .insert([
      {nome: "Paris"},
      {nome: "Tóquio"},
      {nome: "Nova York"}
    ])
    .select("id, nome") 
  

  if (erroCidade) {
    console.error("Erro ao inserir cidades:", erroCidade)
    return
  }

  console.log("Cidades inseridas:", cidades)

  const idParis = cidades[0]?.id
  const idToquio = cidades[1]?.id
  const idNY = cidades[2]?.id

  const { data: viagens, error: erroViagem } = await supabase
    .from("viagens")
    .insert([
      {
        destino: idParis,
        imagem_viagem: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
        link_viagem: "www.viaje.com/viagem_paris"
      },
      {
        destino: idToquio,
        imagem_viagem: "https://plus.unsplash.com/premium_photo-1661914240950-b0124f20a5c1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link_viagem: "www.viaje.com/viagem_toquio"
      },
      {
        destino: idNY,
        imagem_viagem: "https://images.unsplash.com/photo-1663052720904-fdb2e32ee6cd?q=80&w=1047&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link_viagem: "www.viaje.com/viagem_nova_iorque"
      }
    ])
    .select("id, destino, link_viagem")

  if (erroViagem) {
    console.error("Erro ao inserir viagens:", erroViagem)
    return
  }

  console.log("Viagens inseridas:", viagens)
}

