CREATE TABLE mes_financeiro (
    id   BIGSERIAL PRIMARY KEY,
    ano  INTEGER NOT NULL,
    mes  INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
    CONSTRAINT uq_mes_financeiro_ano_mes UNIQUE (ano, mes)
);

CREATE TABLE divida (
    id                  BIGSERIAL PRIMARY KEY,
    mes_financeiro_id   BIGINT         NOT NULL REFERENCES mes_financeiro(id) ON DELETE CASCADE,
    divida_template_id  BIGINT         REFERENCES divida_template(id) ON DELETE SET NULL,
    nome                VARCHAR(100)   NOT NULL,
    valor               NUMERIC(12, 2),
    dia_vencimento      INTEGER        NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
    tipo                VARCHAR(20)    NOT NULL,
    parcela_atual       INTEGER,
    total_parcelas      INTEGER,
    responsavel         VARCHAR(100),
    pago                BOOLEAN        NOT NULL DEFAULT FALSE,
    data_pagamento      DATE,
    observacao          VARCHAR(255)
);

CREATE INDEX idx_divida_mes_financeiro ON divida(mes_financeiro_id);
CREATE INDEX idx_divida_tipo ON divida(tipo);
CREATE INDEX idx_divida_pago ON divida(pago);
