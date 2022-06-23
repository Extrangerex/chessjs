import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Navbar, NavDropdown, Nav } from 'react-bootstrap';


import "./fonts/fontawesome-all.min.css";
import "./fonts/ionicons.min.css";
import "./fonts/line-awesome.min.css";
import "./fonts/fontawesome5-overrides.min.css";
import "./css/Social-Icons.css";

import "./css/menu.css";
import "./css/encabezado.css";
import "./Movimientos.css";


import { MyNavbar } from "./Navbar";
import { MyFooter } from "./Footer";
import rey from "./images/tableros/rey.png";
import mov_rey from "./images/tableros/mov-rey.png";
import dama from "./images/tableros/dama.png";
import mov_dama from "./images/tableros/mov-dama.png";
import elefante from "./images/tableros/elefante.png";
import mov_elefante from "./images/tableros/mov-elefante.png";
import pantera from "./images/tableros/pantera.png";
import mov_pantera from "./images/tableros/mov-pantera.png";
import torre from "./images/tableros/torre.png";
import mov_torre from "./images/tableros/mov-torre.png";
import leon from "./images/tableros/leon.png";
import mov_leon from "./images/tableros/mov-leon.png";
import alfil from "./images/tableros/alfil.png";
import mov_alfil from "./images/tableros/mov-alfil.png";
import perro from "./images/tableros/perro.png";
import mov_perro from "./images/tableros/mov-perro.png";
import caballo from "./images/tableros/caballo.png";
import mov_caballo from "./images/tableros/mov-caballo.png";
import ardilla from "./images/tableros/ardilla.png";
import mov_ardilla from "./images/tableros/mov-ardilla.png";
import conejo from "./images/tableros/conejo.png";
import mov_conejo from "./images/tableros/mov-conejo.png";
import peon from "./images/tableros/peon.png";
import mov_peon from "./images/tableros/mov-peon.png";


export function Movimientos() {
        
    const imagenes = [rey,dama,elefante,pantera,torre,leon,alfil,perro,caballo,ardilla,conejo,peon];
    const tableros = [mov_rey,mov_dama,mov_elefante,mov_pantera,mov_torre,mov_leon,mov_alfil,mov_perro,mov_caballo,mov_ardilla,mov_conejo,mov_peon];
    const textos = [
    "El rey es la pieza más importante. Solo hay un rey. En el Leochess 90, el monarca se mueve igual que en el ajedrez tradicional, es decir, solo puede mover una casilla en cualquier dirección. Si se captura al rey enemigo (se le da jaque mate) se gana el juego. Si el enemigo captura nuestro rey, perdemos el juego. El rey se puede 'enrocar' como en el ajedrez tradicional, pero la diferencia es que no hay enroque corto o largo, sino enroque derecho o izquierdo, y además, el enroque consiste en acercar la torre (derecha o izquierda) hacia el rey y 'saltar' sobre ella, una o dos casillas, a diferencia del enroque del ajedrez tradicional. El rey puede 'optar' por ocupar cualquiera de las 2 casillas entre la torre y el rey. Si, por ejemplo, se enroca del lado derecho en g1, se llama enroque derecho corto y si se enroca en h1, se llama enroque derecho largo. (hay 4 posibles enroques) este movimiento solo se da en la fila 1 para las blancas y en la fila 10 para las negras. El rey solo se puede enrocar si no hay ninguna pieza entre la torre y el rey. Si alguna pieza enemiga interfiere en cualquiera de las casillas del enroque, el rey no se puede enrocar. Si un león corona, se transforma en rey y al haber 2 reyes gana la partida. Después de la coronación del león, automáticamente se gana el juego, a menos que en el siguiente turno el contrincante pueda matarlo o eliminarlo. El rey puede comer o ser ser comido por cualquier pieza.",
    "Después del rey, la dama es la pieza más valiosa del Leochess 90. Cada jugador cuenta con 2 damas. La dama es la pieza de defensa y ataque más poderosa en el tablero. Las damas mueven en diagonal y en columnas o filas sin límite de casillas. La dama del leochess 90 mueve igual que la dama del ajedrez tradicional. La única diferencia es que, a diferencia del ajedrez tradicional que cuenta con una sola dama, en el Leochess 90 hay dos damas. Si una ardilla 'corona', se transforma en dama. Solo las ardillas se pueden coronar en damas. Las damas pueden comer o ser comidas por cualquier pieza.",       
    "El elefante es una pieza mayor y tiene el mismo valor que la pantera. Cada jugador cuenta con 2 elefantes. Mueve como dama, pero su alcance es de tan solo dos casillas. El elefante se pueden desplazar libremente 2 casillas en cualquier dirección, exepto cuando interfiere una pieza del propio color. El elefante es la única pieza que se puede comer a 2 piezas enemigas simultaneamente en su camino, bien sea en diagonales o en filas y columnas. Las únicas piezas que pueden destruir al elefante son las piezas mayores y medias, ya que es inmune al ataque de piezas menores (peones, ardillas y conejos) ninguna pieza se puede coronar en elefante (son únicos). El elefante es una pieza muy útil para romper la estructura de peones. Los elefantes son muy poderosos, tanto en el ataque como en la defensa, sobre todo en juegos cerrados.",
    "La pantera tiene un valor equivalente al del elefante, ambas son piezas mayores. Cada jugador cuenta con 2 panteras. Son, después del rey, el león, las damas y las torres, las piezas más valiosas. Las panteras mueven igual que los caballos, pero su alcance es aún mayor, porque también pueden alcanzar la cuarta casilla contando...1,2,3 y al lado. Tanto en filas como en columnas. La pantera puede, al igual que los caballos saltar sobre las demás piezas y, por ello, es ideal para atacar a varias piezas simultáneamente. Ninguna pieza se puede coronar en pantera (son únicas) las panteras son muy potentes en los finales de partida y en juegos abiertos porque pueden dar dobletes, tripletes, etc. La pantera puede comer o ser comidas por cualquier pieza, no es inmune, como el elefante, al ataque de piezas menores.",
    "La torre, por su gran poder, tiene un valor equivalente al del león. Cada jugador cuenta con 2 torres. La torre se mueve igual que en el ajedrez tradicional. Las torres mueven a lo largo de todas las casillas de filas y columnas. La torre es una pieza muy poderosa en los finales, cuando quedan pocas piezas, por su gran alcance. A diferencia del león, la torre no pueden coronar y ganar la partida. Si un conejo corona, se transforma en torre. La torre puede comer o ser comida por cualquier pieza",  
    "El león es, después del rey y las damas, la pieza más importante del Leochess 90. Su valor es equivalente al de las torres, aunque éstas no pueden ganar por si mismas el juego. El león mueve como las torres, pero su alcance máximo es de tan solo 3 casillas, pero también mueve como los alfiles con un alcance de tan solo 2 casillas en cualquier diagonal. Si el león se corona, se transforma en 'el rey león' y gana el juego, a menos que el oponente pueda comer al león justo en su siguiente turno. (Movimiento siguiente a haberse coronado). El león es inmune al ataque de los peones. Si un jugador pierde a su león, no pierde el juego, pero pierde la posibilidad de ganar 'coronando'.",
    "El alfil es la pieza media más valiosas por su gran alcance. Cada jugador cuenta con 2 alfiles del mismo color. Los alfiles mueven igual que en el ajedrez tradicional, esto quiere decir que los alfiles se mueven a lo largo de las diagonales sin límites. Si un peón 'corona', se transforma en alfil. El es una pieza ideal para finales de partida y juegos abiertos por su alcance. También es importante para reforzar la estructura de peones. En el Leochess 90, cada jugador cuenta con 2 alfiles del mismo color, que se mueven por las diagonales de su propio color, lo cual le dá una ventaja estratégica sobre esas diagonales, ya que los alfiles enemigos son de distinto color. La única forma de obtener una pareja de alfiles de distinto color es coronando. El alfil puede comer o ser comidos por cualquier pieza.",
    "El perro es la pieza media de menor valor. Su movimiento hacia el frente es como el de una torre o un alfil, moviendo tan solo 2 casillas. También se puede mover como torre hacia los lados y atrás dos casillas, pero sin poder comer. No se pueden mover hacia atrás en diagonal. El perro puede comer piezas que se encuentren frente a ellos a diferencia de las piezas menores, que solo pueden comer en diagonal, pero no frente a ellos. El perro (como la ardilla) tampoco puede comer hacia los lados, pero si puede deslpazarse 2 casillas en esa dirección. El perro es ideal para romper la estructura de peones del enemigo. El perro puede comer o ser comido por cualquier pieza. ",
    "El caballo es una pieza media, su poder es intermedio entre el perro y el alfil. Cada jugador cuenta con 2 caballos. Los caballos mueven igual que en el ajedrez tradicional, esto es, contando 1 y 2 sobre diagonales y columnas y después moviendo al lado. El caballo, junto con la pantera, es la única pieza que puede 'saltar' sobre las demás piezas. Los caballos son ideales para amenazar a 2 o más piezas simultáneamente. Son poderosos sobre todo en juegos cerrados, posicionandolos en casillas centrales, ya que en casillas periféricas pierden mucha de su fortaleza. El caballo puede comer o ser comidos por cualquier pieza.",   
    "La ardilla es la más valiosa de las piezas menores. Se trata de un 'super peón'. Cada jugador cuenta con 2 ardillas. Las ardillas mueven como los peones, pero pueden avanzar en todo momento una, dos o hasta tres casillas si están libres frente a ellas, moviéndose solo hacia el frente. Las ardillas, a diferencia de los peones y los conejos, pueden moverse hacia los lados una casilla, pero no pueden 'comer' hacia los lados, solo moverse. Si una pieza está frente a ellas, no pueden avanzar. No pueden comer de frente, exepto si se trata de un peón o conejo, ya que se lo pueden comer 'al salto'. La ardilla puede comer peones y conejos enemigos 'al salto' y 'al paso', y también otras ardillas enemigas 'al paso' pero no 'al salto'. La ardilla también puede 'saltar' sobre peones y conejos de su propio color (sin ser comidos) pero no pueden saltar sobre otras piezas que no sean peones y conejos. A diferencia de los peones, y como los conejos, pueden avanzar hacia la casilla diagonal que está frente a ellas aunque no estén ocupadas por otra pieza (sin haber comido). Lla ardilla es la única pieza que puede transformarse en dama si corona. La ardilla no puede comer elefantes. La ardilla puede ser comida por cualquier pieza.",
    "El conejo es una pieza menor. Es, por decirlo así, un peón 'potenciado'. Cada jugador cuenta con 3 conejos. Los conejos, a diferencia de los peones, puede mover dos casillas hacia adelante en todo el tablero. No pueden retroceder y, como los peones, comen en diagonal. El conejo no puede avanzar hacia adelante si   la pieza que tienen enfrente no es un peón. Los conejos pueden comer peones 'al salto', eso quiere decir que si un peón está frente al conejo y atrás de él la casilla está libre, el conejo puede saltar sobre el peón y comerlo. Los conejos también pueden 'saltar' sobres peones de su mismo color (sin ser comidos) y también pueden comer peones y conejos 'al paso'. Los conejos pueden, al igual que el peón, comer hacia adelante una casilla en diagonal, pero también pueden ocujpar dicha casilla si está vacía (sin haber 'comido'). Si un conejo 'corona', se transforma en torre. Los conejos no pueden comer elefantes. Los conejos pueden ser comidos por cualquier pieza. Los conejos pueden, al igual que el peón, comer hacia adelante una casilla en diagonal, pero también pueden ocujpar dicha casilla si está vacía. (sin haber 'comido') si un conejo 'corona', se transforma en torre. Los conejos no pueden comer elefantes.",
    "El peón es la pieza menor de menor valor. Cada jugador cuenta con 6 peones. Los peones se mueven igual que en el ajedrez tradicional. El peón mueve avanzando una o dos casillas solo al inicio, pero después solo una. El peón no puede avanzar si tienen una pieza frente a él. Los peones solo comen en diagonal hacia el frente (una casilla) los peones pueden comer 'al paso' a otros peones como en el ajedrez tradicional. La única diferencia con relación al ajedrez tradicional se da con relación a la coronación; si un peón llega hasta la última casilla, se transforma en alfil. Los peones solo se pueden coronar en alfiles. Los peones no pueden comer leónes ni elefantes. Los peones pueden ser comidos 'al salto' y 'al paso' por los conejos y ardillas. Los peones pueden ser comidos por cualquier pieza.",
    ]


    const [numeroimagen, setNumeroImagen] = useState(0);
    
    return (
        <section className="fondo_principal">
            <MyNavbar />
            
            <section className="encabezado">
                <header className="masthead">
                    <Container>
                        <Row>
                            <Col xs={12} style={{ padding: 0 }}>
                                <div className="site-heading">
                                    <h1>Piezas de LeoChess90</h1>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </header>
            </section>
            <section className="movimientos">
                <Container>
                    <Row>
                        <Col xs={12} md={6} style={{ padding: 0 }}>
                            <div align="center">
                                <img src={tableros[numeroimagen]} className="img-fluid" alt=""></img>
                                <br></br><br></br>
                                <img src={imagenes[numeroimagen]} className="img-fluid pieza" alt=""></img>
                            </div>
                        </Col>
                        <Col xs={12} md={6} >
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Pieza</th>
                                        <th>Símbolo</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td><button onClick={() => setNumeroImagen(0)}  className="btn btn-info">REY</button></td>
                                        <td>♔</td>
                                        <td>10 pts</td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td><button onClick={() => setNumeroImagen(1)} className="btn btn-info">DAMA</button></td>
                                        <td>♕</td>
                                        <td>9 pts</td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td><button onClick={() => setNumeroImagen(2)} className="btn btn-info">ELEFANTE</button></td>
                                        <td>El</td>
                                        <td>7 pts</td>
                                    </tr>
                                    <tr>
                                        <td>4</td>
                                        <td><button onClick={() => setNumeroImagen(3)} className="btn btn-info">PANTERA</button></td>
                                        <td>Pa</td>
                                        <td>7 pts</td>
                                    </tr>
                                    <tr>
                                        <td>5</td>
                                        <td><button onClick={() => setNumeroImagen(4)} className="btn btn-info">TORRE</button></td>
                                        <td>♖</td>
                                        <td>7 pts</td>
                                    </tr>
                                    <tr>
                                        <td>6</td>
                                        <td><button onClick={() => setNumeroImagen(5)} className="btn btn-info">LEÓN</button></td>
                                        <td>Le</td>
                                        <td>8 pts</td>
                                    </tr>
                                    <tr>
                                        <td>7</td>
                                        <td><button onClick={() => setNumeroImagen(6)} className="btn btn-info">ALFIL</button></td>
                                        <td>♗</td>
                                        <td>6 pts</td>
                                    </tr>
                                    <tr>
                                        <td>8</td>
                                        <td><button onClick={() => setNumeroImagen(7)} className="btn btn-info">PERRO</button></td>
                                        <td>Pe</td>
                                        <td>4 pts</td>
                                    </tr>
                                    <tr>
                                        <td>9</td>
                                        <td><button onClick={() => setNumeroImagen(8)} className="btn btn-info">CABALLO</button></td>
                                        <td>♘</td>
                                        <td>5 pts</td>
                                    </tr>
                                    <tr>
                                        <td>10</td>
                                        <td><button onClick={() => setNumeroImagen(9)} className="btn btn-info">ARDILLA</button></td>
                                        <td>Ar</td>
                                        <td>3 pts</td>
                                    </tr>
                                    <tr>
                                        <td>11</td>
                                        <td><button onClick={() => setNumeroImagen(10)} className="btn btn-info">CONEJO</button></td>
                                        <td>Co</td>
                                        <td>2 pts</td>
                                    </tr>
                                    <tr>
                                        <td>12</td>
                                        <td><button onClick={() => setNumeroImagen(11)} className="btn btn-info">PEONES</button></td>
                                        <td>♙</td>
                                        <td>1 pts</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                        <Col xs={12} style={{ padding: 0 }}>
                            <p style={{paddingLeft:"30px",paddingRight:"30px",color:"white"}}>{textos[numeroimagen]}</p>
                        </Col>
                    </Row>
                </Container>
            </section>
            <MyFooter/>
        </section>
    );
}
