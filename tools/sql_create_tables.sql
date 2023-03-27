CREATE TABLE maakunta (
    aluenumero INT NOT NULL,
    maakunta VARCHAR(70),
    PRIMARY KEY (aluenumero)
);

CREATE TABLE kunta (
    kunta_id INT,
    aluenumero INT,
    kunta VARCHAR(50),
    PRIMARY KEY (kunta_id),
    FOREIGN KEY (aluenumero) REFERENCES maakunta(aluenumero)
);

CREATE TABLE alue (
    alue_id INT AUTO_INCREMENT,
    postinumero VARCHAR(5),
    kunta_id INT,
    PRIMARY KEY (alue_id),
    FOREIGN KEY (kunta_id) REFERENCES kunta(kunta_id)
);

CREATE TABLE katutiedot (
    alue_id INT,
    katu VARCHAR(90),
    katunumero VARCHAR(5),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    FOREIGN KEY (alue_id) REFERENCES alue(alue_id)
);