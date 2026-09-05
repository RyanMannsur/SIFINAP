CREATE TABLE divida_template (
    id              BIGSERIAL PRIMARY KEY,
    nome            VARCHAR(100) NOT NULL,
    dia_vencimento  INTEGER      NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
    ativa           BOOLEAN      NOT NULL DEFAULT TRUE
);
