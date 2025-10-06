-- * atributos em jsonb para criptografia de dados, modificações ainda serão feitas para melhorias *
-- Tabela: dados_sites
CREATE TABLE dados_sites (
    id SERIAL PRIMARY KEY,
    nome_site TEXT NOT NULL,
    avaliacao TEXT,
    link_site TEXT
);

-- Tabela: viajantes
CREATE TABLE viajantes (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    orcamento NUMERIC(12,2),
    nome_usuario JSONB,
    password JSONB,
    sexo TEXT NOT NULL,
    idade INT NOT NULL,
    email TEXT NOT NULL,
    telefone INT,
    endereco_residencia TEXT
);

-- Tabela: convites
CREATE TABLE convites (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    destino TEXT,
    status TEXT,
    anfitriao INT REFERENCES viajantes(id) ON DELETE CASCADE,
    receptor INT REFERENCES viajantes(id) ON DELETE CASCADE,
    valor NUMERIC(12,2)
);

-- Tabela: cidade
CREATE TABLE cidade (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    pais TEXT,
    moeda TEXT,
    temperatura_media FLOAT,
    avaliacao_estrelas INT,
    continente TEXT
);

-- Tabela: hotel
CREATE TABLE hotel (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    preco_diaria NUMERIC(12,2),
    cafe_incluso BOOLEAN,
    almoco_incluso BOOLEAN,
    janta_incluso BOOLEAN,
    endereco TEXT,
    area_de_lazer BOOLEAN,
    descricao_lazer TEXT,
    avaliacao_hospedes TEXT,
    horario_checkin TIMESTAMP,
    horario_checkout TIMESTAMP,
    horario_atendimento TIMESTAMP,
    cidade_id INT REFERENCES cidade(id) ON DELETE CASCADE
);

-- Tabela: avaliacoes
CREATE TABLE avaliacoes (
    id SERIAL PRIMARY KEY,
    cidade INT REFERENCES cidade(id) ON DELETE CASCADE,
    viagem INT REFERENCES viagens(id) ON DELETE CASCADE,
    nota_estrelas INT,
    grupo JSONB,
    data DATE,
    comentario TEXT
);

-- Tabela: viagens
CREATE TABLE viagens (
    id SERIAL PRIMARY KEY,
    destino INT REFERENCES cidade(id) ON DELETE CASCADE,
    data_ida TIMESTAMP,
    data_volta TIMESTAMP,
    custo_total NUMERIC(12,2),
    preco_hotel NUMERIC(12,2),
    preco_passagem NUMERIC(12,2),
    atracoes TEXT,
    preco_atracoes NUMERIC(12,2),
    concluida BOOLEAN,
    confirmada BOOLEAN,
    viajante_id INT REFERENCES viajantes(id) ON DELETE CASCADE
);

-- Tabela: itens_de_viagem
CREATE TABLE itens_de_viagem (
    id SERIAL PRIMARY KEY,
    nome_item TEXT NOT NULL,
    preco NUMERIC(12,2),
    adquirido BOOLEAN,
    viagem_id INT REFERENCES viagens(id) ON DELETE CASCADE
);

-- Tabela: passagens
CREATE TABLE passagens (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    data_ida TIMESTAMP,
    data_volta TIMESTAMP,
    preco NUMERIC(12,2),
    compra_pendente BOOLEAN,
    viagem_id INT REFERENCES viagens(id) ON DELETE CASCADE
);

-- Tabela: database_locations (RASCUNHO, SERÁ EXCLUÍDO NO FIM DA MODELAGEM ESTRUTURAL)
CREATE TABLE database_locations (
    id SERIAL PRIMARY KEY,
    cidade INT REFERENCES cidade(id) ON DELETE CASCADE,
    ponto_turistico TEXT,
    preco NUMERIC(12,2),
    endereco TEXT,
    city_key TEXT
);


