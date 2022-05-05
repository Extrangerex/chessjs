import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col } from 'react-bootstrap';

import "./fonts/fontawesome-all.min.css";
import "./fonts/ionicons.min.css";
import "./fonts/line-awesome.min.css";
import "./fonts/fontawesome5-overrides.min.css";
import "./css/Social-Icons.css";

import "./css/menu.css";
import "./css/encabezado.css";
import "./Reglas.css";

import tablero from "./assets/tablero.png";

import { MyNavbar } from "./Navbar";
import { MyFooter } from "./Footer";

export function Reglas() {

    return (
        <section className="fondo_principal">
            <MyNavbar />

            <section className="encabezado">
                <header className="masthead">
                    <Container>
                        <Row>
                            <Col xs={12} style={{ padding: 0 }}>
                                <div className="site-heading">
                                    <h1 className="titulo">Reglas</h1>

                                    <h4>REGLA NO. 1 INICIO DEL JUEGO</h4>

                                    <p>El Leochess90 es un juego de ajedrez nuevo y ampliado con relación al ajedrez tradicional,
                                        donde se enfrentan 2 jugadores, el primero juega con las piezas blancas y el segundo con
                                        las piezas negras. Tiene 12 tipos diferentes de piezas a diferencia de las 6 del juego
                                        tradicional.</p>

                                    <h4>1.1 EL TABLERO</h4>

                                    <p>El tablero del Leochess 90 consiste en un rectángulo casi cuadrado, formado por 10 filas y
                                        9 columnas, formando una retícula que consta de 90 casillas. Este tablero es mayor que el
                                        del ajedrez tradicional que consta de un cuadrado de 8 filas y 8 columnas, formando una
                                        retícula de 64 casillas. Las casillas se alternan entre tonalidades claras y oscuras, las casillas
                                        de color claro se llaman blancas y las de color oscuro negras. Las 10 filas son numeradas del
                                        1 al 10 y las columnas reciben letras del abecedario: A,B,C,D,E,F,G,H, I. Esta nomenclatura
                                        permite que cada casilla tenga una denominación particular, por ejemplo, A1, B6, E9, H10,
                                        etc.</p>

                                    <h4>1.2 LAS PIEZAS</h4>

                                    <p>Cada jugador recibe al inicio del juego 27 piezas. Las piezas se dividen en Piezas mayores,
                                        Piezas menores y peones, además del Rey y el León, que son piezas especiales.</p>

                                    <p>• En el Leochess 90, hay 3 tipos diferentes de peones; los peones propiamente dichos,
                                        los conejos y las ardillas.</p>

                                    <p>• También hay 3 tipos de Piezas menores, los Alfiles, los Caballos y los Perros.</p>

                                    <p>• Además, hay 4 tipos de Piezas mayores, las Torres, las Panteras, los Elefantes y las
                                        Damas.</p>

                                    <p>• Finalmente, existen 2 piezas únicas y especiales que son el Rey y el León.</p>

                                    <p>Al inicio de cada juego, los jugadores reciben 1 Rey, 1 León, 2 Damas, 2 Elefantes, 2 Panteras,
                                        2 Torres, 2 Alfiles, 2 Perros, 2 Ardillas, 3 Conejos y 6 Peones.</p>

                                    <h4>1.2.1 VALOR DE LAS PIEZAS</h4>

                                    <p>Las piezas tienen un valor intrínseco, que permite a un jugador determinar si le conviene
                                        realizar intercambios, así, por ejemplo, no cambiará una torre por un caballo, dado que ésta
                                        tiene un valor mayor que aquel, a menos que la posición estratégica resulte más
                                        conveniente después del intercambio. A esto se le denomina “sacrificio” de la pieza o
                                        pérdida de calidad. Aunque en la tabla se indica como 10 el máximo valor del Rey (que es la
                                        pieza más valiosa), en realidad éste es invaluable, debido a que, si se captura, se pierde la
                                        partida.</p>


                                    <h4>1.2.2 ACOMODO DE LAS PIEZAS</h4>

                                    <p>Al inicio del juego, el Rey blanco se acomodará en una casilla clara en el centro de la primera
                                        fila y el Rey negro en una casilla oscura en el centro de la décima fila, frente a ellos se
                                        pondrán sus respectivos leones, el resto de las piezas se deben acomodar como se indica
                                        en el siguiente diagrama:</p>
                                        <img src={tablero} alt="" ></img>
                                        <br></br>    
                                        <br></br>
                                    <h4>1.3 OBJETIVO DEL JUEGO</h4>

                                    <p>El objetivo del juego es ganar la partida, venciendo a nuestro contrincante, lo cual puede
                                        ocurrir si capturamos al Rey enemigo o bien coronamos nuestro León, llegando hasta la
                                        última fila.</p>

                                    <h4>1.4 MOVIMIENTOS Y TURNOS.</h4>

                                    <p>Un movimiento consiste en colocar una pieza en una casilla diferente, siguiendo las reglas
                                        de movimiento de cada una de las piezas. Las piezas blancas inician la partida, realizando
                                        un solo movimiento, después juegan las negras haciendo lo propio. Cuando ambos
                                        jugadores han realizado su primer movimiento, se ha realizado el primer turno. En el
                                        Leochess 90 se juegan 90 turnos, es decir, 90 movimientos por cada jugador.</p>

                                    <h4>REGLA NO. 2 TURNOS Y CICLOS.</h4>

                                    <p>En el Leochess 90, al igual que en el ajedrez tradicional, el primer jugador que lleva las piezas
                                        blancas, inicia la partida y solo puede mover una pieza en cada turno. El jugador de las
                                        negras responde moviendo a su vez una sola pieza en su turno.</p>

                                    <h4>2.1 TURNOS</h4>

                                    <p>Cada turno, por lo tanto, consiste en 2 movimientos, el de las blancas y el de las negras.
                                        Pero al completarse los primeros 9 turnos, se termina el primer ciclo. Cada ciclo contiene 9
                                        turnos.</p>

                                    <h4>2.2 CICLOS</h4>

                                    <p>El juego consta de 10 ciclos, lo que significa que cada jugador tiene 90 movimientos; si al
                                        finalizar los 90 movimientos de cada jugador, ninguno ha obtenido la victoria, el juego se
                                        declara empatado o, como se dice en el lenguaje del ajedrez, “tablas”.</p>

                                    <h4>2.3 DOBLE TURNO</h4>

                                    <p>Cuando los jugadores han completado el primer ciclo, consistente en 9 movimientos cada
                                        uno, el jugador de las negras tiene doble turno, ahora le corresponde tomar la iniciativa del
                                        juego y como fue el último en mover en el noveno turno, le corresponde salir primero en el
                                        segundo ciclo; no obstante, no le es permitido mover la misma pieza dos veces seguidas,
                                        por lo cual al inicio del segundo ciclo (en el movimiento 10) deberá mover cualquier pieza
                                        excepto la última que movió al final del primer ciclo.</p>

                                    <p>Cuando finaliza el segundo ciclo, le corresponde al jugador de las piezas blancas tener doble
                                        turno, ya que fue el último en mover en el segundo ciclo y ahora le corresponde retomar la
                                        iniciativa del juego en el tercer ciclo (movimientos 18 y 19).</p>

                                    <p>Esto significa que el jugador de las blancas inicia siempre en los ciclos nones y el jugador de
                                        las negras en los ciclos pares. Cada jugador tiene la iniciativa durante 5 ciclos a lo largo de
                                        la partida.</p>

                                    <h4>REGLA NO. 3 DURACIÓN DE LA PARTIDA</h4>

                                    <p>El tiempo siempre es un factor en los juegos de ajedrez. Desde luego, los jugadores se
                                        pueden poner de acuerdo con relación al tiempo que le quieren destinar al juego, para lo
                                        cual contarán con un reloj de ajedrez, o también jugar a tiempo indefinido sin límite de
                                        tiempo y sin reloj; sin embargo, para efectos de los torneos oficiales de Leochess 90, existen
                                        3 modalidades de tiempo:</p>

                                    <p>• El juego oficial estándar que tiene una duración de 90 minutos (45 para cada
                                        jugador). </p>

                                    <p>• La partida rápida con duración de 60 minutos (30 minutos para cada jugador)</p>

                                    <p>• La partida relámpago o “Blitz” que tiene una duración de 30 minutos (15 minutos
                                        para cada jugador)</p>

                                    <p>Si cualquier jugador excede su tiempo de juego, automáticamente pierde la partida.</p>

                                    <h4>REGLA NO.4 LOS PEONES</h4>

                                    <p>En el Leochess 90, existen 3 tipos diferentes de peones:</p>

                                    <p>• Los Peones</p>

                                    <p>• Los Conejos</p>

                                    <p>• Las Ardillas</p>

                                    <h4>4.1 EL PEÓN</h4>

                                    <p>El peón, al igual que en el ajedrez tradicional, puede iniciar su movimiento moviendo una o
                                        dos casillas hacia el frente (en columnas) y posteriormente solo puede hacer un solo
                                        movimiento hacia el frente, una sola casilla. El peón (como cualquier otra pieza), cuando
                                        captura otra pieza se dice que “se la come”. El peón solo come de lado en diagonal
                                        avanzando una sola casilla y si frente a él se encuentra cualquier otro peón o pieza, está
                                        impedido para avanzar. Los peones nunca comen de frente.</p>

                                    <h4>4.2 EL CONEJO</h4>

                                    <p>El conejo es un peón potenciado (potenciado al cuadrado), esto quiere decir que, a
                                        diferencia del peón tradicional, puede mover 2 casillas hacia el frente en cualquier
                                        momento de la partida, también come de lado en diagonal, pero no solo eso, sino que se
                                        puede mover hacia el frente en diagonal una sola casilla, aunque no haya comido, si esta
                                        casilla está vacía.</p>

                                    <h4>4.3 LA ARDILLA</h4>

                                    <p>La ardilla también es un peón potenciado (potenciado al cubo), esto quiere decir que la
                                        ardilla puede mover 3 casillas hacia el frente en cualquier momento, siempre y cuando
                                        alguna otra pieza no se lo impida. La ardilla, al igual que el conejo, come en diagonal pero
                                        también se puede mover en diagonal una casilla sin necesidad de comer. Adicionalmente,
                                        la ardilla se puede mover hacia los lados una casilla, pero en este caso no puede comer.</p>

                                    <p>Los peones (peones, conejos y ardillas) nunca pueden retroceder.</p>

                                    <p>Los peones, como es lógico, tienen jerarquías, esto quiere decir que el peón de menor
                                        jerarquía es el peón propiamente dicho, seguido de el conejo y la ardilla, que es el peón de
                                        mayor jerarquía.</p>

                                    <h4>REGLA NO. 5 CORONACIÓN DE LOS PEONES</h4>

                                    <p>Cuando los peones logran llegar hasta la última fila en el campo enemigo (fila 10 para las
                                        blancas y fila 1 para las negras) pueden “Coronar” o promover, esto quiere decir que
                                        cambian su naturaleza de peón y se transforman en una pieza más poderosa. En el ajedrez
                                        tradicional que solo tiene un tipo de peón, cuando éste corona, se puede convertir en
                                        cualquier pieza menor o mayor (dama, torre, alfil o caballo); pero, dado que en el Leochess
                                        90 hay 3 tipos diferentes de peones, estos solo coronan de acuerdo con sus jerarquías:</p>

                                    <p>• El Peón se corona en Alfil</p>
                                    <p>• El Conejo se corona en Torre</p>
                                    <p>• La Ardilla se corona en Dama.</p>

                                    <h4>REGLA NO. 6 COMER AL PASO</h4>

                                    <p>Los peones pueden comer a otros peones al paso de acuerdo con sus jerarquías.</p>

                                    <p>El peón solo puede comer al paso a otros peones, esto solo ocurre cuando en su primer
                                        movimiento un peón avanza 2 casillas. La casilla libre que queda después del avance, puede
                                        ser ocupada por otro peón, si este se encuentra en condiciones de ocuparla al moverse en
                                        diagonal hacia esa casilla. En el caso de las piezas blancas, sus peones solo pueden comer al
                                        paso si se encuentran en la fila 7 y pueden ocupar la fila 8 después del avance de 2 casillas
                                        del peón negro. En el caso de las piezas negras, estas solo pueden comer al paso a otros
                                        peones si se encuentran en la fila 5 y pueden ocupar la fila 4 después del avance. Comer al
                                        paso es siempre opcional.</p>

                                    <p>Los conejos y las ardillas también pueden comer al paso a los peones si están en las mismas
                                        condiciones. Los peones no pueden comer al paso a los conejos y las ardillas, porque estas
                                        son de mayor jerarquía.</p>

                                    <p>Los conejos pueden comer al paso a otros conejos, esto ocurre cuando un conejo avanza 2
                                        casillas y el conejo enemigo puede ocupar la casilla libre después del avance.</p>

                                    <p>Esto puede ocurrir en cualquier lugar del tablero. Los conejos no pueden comer al paso a
                                        las ardillas, pero éstas si pueden comer al paso a los conejos si están en las mismas
                                        condiciones.</p>

                                    <p>Las ardillas pueden comer al paso a otras ardillas. Dado que las ardillas pueden desplazarse
                                        hasta 3 casillas, esto significa que dejan no uno sino 2 casillas libres al realizar el avance. SI
                                        una ardilla enemiga puede ocupar alguna de esas 2 casillas libres, puede comer al paso a la
                                        ardilla enemiga. Esto ocurre en cualquier parte del tablero.</p>

                                    <h4>REGLA NO. 7 COMER AL SALTO</h4>

                                    <p>En el Leochess 90, además de comer al paso, los conejos y las ardillas también pueden
                                        comer al salto. Comer al salto significa que si un peón de menor jerarquía está frente a otro
                                        de mayor jerarquía, éste puede saltar hacia el frente y comerlo, siempre y cuando la casilla
                                        que está detrás del peón de menor jerarquía se encuentre libre. Obviamente el peón no
                                        puede comer al salto, dado que no existe ninguna pieza de menor jerarquía; sin embargo,
                                        los conejos pueden comer al salto a los peones y las ardillas pueden comer al salto a los
                                        conejos y a los peones.</p>

                                    <h4>REGLA NO. 8 LAS PIEZAS MENORES</h4>

                                    <p>En el Leochess 90 hay 3 piezas menores, éstas son:</p>

                                    <p>• El Alfil</p>
                                    <p>• El Caballo</p>
                                    <p>• El perro</p>

                                    <h4>8.1 EL ALFIL</h4>

                                    <p>El Alfil es la más poderosa de las piezas menores, ya que domina las diagonales de su color
                                        en todo el tablero. El Alfil del Leochess 90 se mueve igual que en el ajedrez tradicional; sin
                                        embargo, existe una notable diferencia respecto a este juego, ya que en él, los alfiles con
                                        siempre de distinto color, en cambio, en el Leochess 90 los alfiles son siempre del mismo
                                        color, esto quiere decir que las piezas blancas dominan las casillas ubicadas en las
                                        diagonales blancas y las piezas negras dominan las diagonales negras, dándole un sentido
                                        estratégico diferente al juego. La única forma de obtener un alfil de diferente color es
                                        coronando un peón en una casilla de color diferente al de los respectivos alfiles.</p>

                                    <h4>8.2 EL CABALLO</h4>

                                    <p>El caballo es la única pieza menor que puede “saltar” sobre otras piezas. Su movimiento
                                        consiste en avanzar 2 casillas sobre filas y columnas y después moverse hacia una casilla
                                        que se encuentre al lado de la segunda, esto se puede visualizar como un rectángulo de 6
                                        casillas, donde el caballo ocupa una de las esquinas y se mueve hacia la esquina contraria.</p>

                                    <p>Los caballos se mueven igual que en el ajedrez tradicional y son ideales para atacar
                                        simultáneamente a 2 o más piezas que se encuentren en su zona de influencia.</p>

                                    <h4>8.3 EL PERRO</h4>

                                    <p>El perro es la única pieza menor que existe en el Leochess 90, pero no en el ajedrez
                                        tradicional. El perro es una pieza poderosa en el ataque frontal, pero de poca capacidad de
                                        ataque y movilidad hacia los lados y hacia atrás. Su movimiento consiste en ocupar una o
                                        dos casillas hacia el frente, tanto en columnas como en diagonales, y cualquier pieza que se
                                        encuentre en este rango de acción puede ser comida por el perro; sin embargo, también se
                                        puede mover una o dos casillas hacia los lados o hacia atrás, pero en este caso sin poder
                                        comer. No se puede mover en diagonal hacia atrás. El perro es ideal para romper la
                                        estructura de peones del jugador enemigo.</p>

                                    <h4>REGLA NO. 9 LAS PIEZAS MAYORES</h4>

                                    <p>En el Leochess 90 hay 4 piezas mayores que son:</p>

                                    <p>• La Torre</p>

                                    <p>• La Pantera</p>

                                    <p>• El Elefante</p>

                                    <p>• La Dama</p>

                                    <h4>9.1 LA TORRE</h4>

                                    <p>La Torre se mueve a lo largo de las columnas y las filas, sin límite de alcance, es por ello que
                                        puede ocupar todas las casillas del tablero. Su capacidad y movilidad es igual a la del ajedrez
                                        tradicional. Su gran alcance la hace una pieza muy poderosa, sobre todo en el juego medio
                                        y hacia el final de la partida.</p>

                                    <h4>9.2 LA PANTERA</h4>

                                    <p>La pantera es una pieza única del Leochess 90 y se puede considerar como un caballo
                                        potenciado. Es la única pieza mayor que puede saltar sobre el resto de las piezas.</p>

                                    <p>Su movimiento puede ser igual al del caballo, pero adicionalmente se puede mover tres
                                        casillas a lo largo de filas y columnas y después moverse hacia un lado de la tercera, esto se
                                        puede visualizar como un rectángulo de 6 o de 8 casillas, donde la pantera ocupa una de las
                                        esquinas y se mueve hacia la esquina contraria. Esta característica le permite a la pantera
                                        ser una poderosa pieza de ataque que puede amenazar a muchas piezas simultáneamente.</p>

                                    <h4>9.3 EL ELEFANTE</h4>

                                    <p>El Elefante es una pieza única del Leochess 90 y se puede considerar como una dama de
                                        corto alcance pero de mayor capacidad de ataque. Su movimiento consiste en mover una o
                                        dos casillas, tanto en columnas y filas como en diagonales.</p>

                                    <h4>9.3.1 INMUNIDAD DEL ELEFANTE</h4>

                                    <p>El Elefante es inmune al ataque de todos los peones, tanto del peón propiamente dicho,
                                        como del conejo y la ardilla, por lo tanto, las únicas piezas que pueden comer a un elefante
                                        son las piezas menores y mayores.</p>

                                    <h4>9.3.2 ATAQUE DEL ELEFANTE</h4>

                                    <p>El Elefante es la única pieza del Leochess 90 cuyo ataque es diferente que el resto de las
                                        piezas, ya que puede comer a 2 piezas simultáneamente, esto ocurre debido a que en su
                                        trayecto de 2 casillas en cualquier dirección, puede arrasar con todo lo que esté en su
                                        camino, excepto si hay alguna pieza propia, es decir, solo si se trata de peones o piezas
                                        enemigas.</p>

                                    <h4>9.4 LA DAMA</h4>

                                    <p>La dama es la pieza más poderosa del Leochess 90, al igual que del ajedrez tradicional, ya
                                        que se puede mover tanto como Alfil como Torre, desplazándose indefinidamente tanto en
                                        columnas y filas como en diagonales. La única diferencia respecto al ajedrez tradicional, es
                                        que en éste cada jugador cuenta con una sola dama, en tanto que en el Leochess 90 cada
                                        jugador inicia el juego con 2 damas.</p>

                                    <h4>REGLA NO.10 LAS PIEZAS ESPECIALES</h4>

                                    <p>En el Leochess 90 hay 2 piezas únicas y especiales:</p>

                                    <p>• El León</p>

                                    <p>• El Rey</p>

                                    <h4>10.1 EL LEÓN</h4>

                                    <p>El León es una pieza única que se mueve como una combinación de Alfil y Torre, pero de
                                        alcance limitado. Como Torre mueve 3 casillas a lo largo de filas o columnas y como alfil
                                        mueve 2 casillas en diagonal en cualquier dirección. En este sentido, el león se podría
                                        considerar también como una pieza mayor, excepto por algunas particularidades que se
                                        mencionan enseguida.</p>

                                    <h4>10.1.1 INMUNIDAD DEL LEÓN</h4>

                                    <p>El León es, junto con el Elefante, la única pieza inmune a algunos ataques; sin embargo, en
                                        el caso del León, la inmunidad es únicamente respecto a los peones propiamente dichos,
                                        pudiendo ser comido por conejos y ardillas.</p>

                                    <h4>10.1.2 CORONACIÓN DEL LEÓN</h4>

                                    <p>El León es la única pieza del tablero, además de los peones, que puede coronar.</p>

                                    <p>Si el León corona, se transforma en Rey y automáticamente gana el juego, a menos que en
                                        el siguiente movimiento el otro jugador pueda comerlo. Tener 2 reyes del mismo color hace
                                        que la partida se termine.</p>

                                    <h4>10.1.3 PÉRDIDA DEL LEÓN</h4>

                                    <p>Si un jugador pierde a su León durante el juego por haber sido comido por alguna pieza
                                        enemiga (excepto el peón), el juego aún no está perdido, ya que no se ha eliminado al Rey,
                                        lo único que en realidad se pierde es la posibilidad de ganar el juego coronando.</p>

                                    <h4>10.2 EL REY</h4>

                                    <p>El Rey es la pieza más valiosa del ajedrez y del Leochess 90, ya que el objetivo del juego es
                                        eliminarlo, y si el oponente lo consigue, se pierde el juego. Su movilidad es muy limitada, ya
                                        que solo puede mover una casilla en cualquier dirección, razón por la cual debe ser siempre
                                        protegido por el resto de las piezas.</p>

                                    <h4>10.2.1 JAQUE AL REY</h4>

                                    <p>Si alguna pieza enemiga ataca al Rey, el jugador está obligado a anunciar que el Rey se
                                        encuentra en Jaque. Para evitar el jaque, el jugador amenazado debe o bien mover su Rey
                                        o bloquear el jaque con alguna de sus piezas o eliminar a la pieza que está realizando el
                                        Jaque.</p>

                                    <h4>10.2.2 JAQUE MATE</h4>

                                    <p>Si al realizar el jaque, el Rey no tiene escapatoria y no se puede cubrir, defender o eliminar
                                        a la pieza enemiga, el Rey se encuentra en Jaque Mate y esto significa que se ha perdido el
                                        juego o la batalla.</p>

                                    <h4>10.2.3 ENROQUE DEL REY</h4>

                                    <p>Para dar protección al Rey, en el Leochess 90 hay 4 tipos de enroque, a diferencia del ajedrez
                                        tradicional donde solo hay 2 enroques, el enroque corto y el enroque largo. El enroque solo
                                        se puede dar entre el Rey y alguna de sus Torres, siempre y cuando ninguna de ambas piezas
                                        se haya movido de su posición original.</p>

                                    <p>En el Leochess 90, dada la simetría que existe en el tablero, el Rey se puede enrocar en
                                        corto y en largo, tanto a la derecha como a la izquierda y el enroque se puede dar
                                        únicamente si se cumplen las siguientes 2 condiciones:</p>

                                    <p>• Que entre el Rey y la Torre no se encuentre ninguna pieza, esto es, que todas las
                                        casillas entre la Torre y el Rey se encuentren libres.</p>

                                    <p>• Que al realizar el enroque el Rey pueda quedar en jaque por alguna pieza enemiga.</p>

                                    <p>Si se cumplen estas condiciones, el Rey se puede enrocar.</p>

                                    <p>El enroque consiste en acercar alguna de las Torres a la casilla contigua al Rey, y que éste
                                        salta sobre la Torre ocupando o bien la casilla contigua (enroque corto) o bien dejando una
                                        casilla libre entre la Torre y el Rey (enroque largo), moviéndose 2 o 3 casillas hacia los lados,
                                        según sea enroque corto o largo.</p>

                                    <h4>10.2.4 REY AHOGADO</h4>

                                    <p>Si el juego llega a una posición en la cual el Rey no se puede mover hacia ninguna casilla
                                        porque están amenazadas por las piezas enemigas y tampoco puede mover ninguna de sus
                                        otras piezas, pero no se encuentra amenazado por algún tipo de jaque, se dice que el Rey
                                        está ahogado, y en ese caso la partida queda automáticamente empatada, es decir, se llega
                                        a una posición de tablas.</p>

                                    <h4>REGLA NO. 11 CONDUCTA E IRREGULARIDADES</h4>

                                    <p>El Leochess 90, no es un juego de azar, sino un juego de conocimiento y estrategia, donde
                                        no gana el jugador que tiene más suerte, sino aquel que tiene mayor conocimiento del juego
                                        y establece las mejores estrategias. Cuando un principiante se inicia en el juego,
                                        normalmente pierde sistemáticamente ante jugadores que tienen un mayor nivel. Para
                                        aprender el juego se requiere ser humilde y aprender a perder muchas veces, hasta que se
                                        va adquiriendo un nivel competitivo, pero la recompensa es muy grande, ya que la diversión
                                        es mayúscula.</p>

                                    <h4>11. 1 CONDUCTA</h4>

                                    <p>Los jugadores deben respetar siempre al oponente y realizar únicamente movimientos que
                                        se consideren legales, de acuerdo con las reglas de movimiento de cada pieza. Si alguno de
                                        los jugadores considera que la partida es tan equilibrada que ninguno podrá vencer a su
                                        oponente, puede ofrecer “tablas” a su oponente, el cual podrá aceptar o rechazar la oferta.</p>

                                    <p>Si considera que su oponente está en una posición muy superior y no tendrá posibilidades
                                        de ganar, puede abandonar la partida, expresando su intención al oponente y aceptando su
                                        derrota. </p>

                                    <p>Al finalizar la partida, ambos jugadores pueden estrechar sus manos, como gesto de
                                        aprobación de lo que ha sucedido durante el desarrollo de la partida.</p>

                                    <h4>11.2 IRREGULARIDADES</h4>

                                    <p>Durante el desarrollo del juego, pueden surgir algunos problemas que deben resolverse con
                                        una adecuada conducta, tales situaciones son las siguientes:</p>

                                    <p>• Cuando un jugador mueve una pieza de manera diferente a las reglas de movimiento
                                        de cada pieza, se considera un movimiento ilegal y se debe regresar a la posición
                                        anterior.</p>

                                    <p>• Si el Rey está en jaque, no se pueden realizar movimientos con otras piezas, a menos
                                        que sean para evitar que el Rey siga permaneciendo en jaque.</p>

                                    <p>• Si un jugador toda una pieza, está obligado a mover dicha pieza, de lo contrario se
                                        considera un acto ilegal.</p>

                                    <p>• Si en una misma partida un jugador realiza 3 movimientos ilegales, pierde la partida.</p>

                                    <h4>REGLA NO.12 FIN DEL JUEGO</h4>

                                    <p>Al final del juego existen 3 posibilidades, que se haya ganado la partida, que se hayan
                                        realizado tablas (empate) o bien que se haya perdido.</p>

                                    <h4>12.1 GANAR LA PARTIDA</h4>

                                    <p>Gana la partida el jugador que:</p>

                                    <p>• Haya conseguido hacer jaque mate al rey de su oponente</p>

                                    <p>• Haya logrado coronar o promover a su propio León sin que el oponente lo haya
                                        podido eliminar inmediatamente después de la coronación.</p>

                                    <p>• Su oponente se haya rendido, es decir, haya abandonado la partida.</p>

                                    <p>• Su oponente haya excedido el tiempo reglamentario en su reloj, si se juega bajo la
                                        modalidad de control de tiempo.</p>

                                    <h4>12.2 EMPATAR LA PARTIDA</h4>

                                    <p>La partida se empata o bien, se declara “tablas” si:</p>

                                    <p>• Los jugadores lo han acordado de mutuo acuerdo.</p>

                                    <p>• Se completan los 90 turnos sin que ninguno de los jugadores haya podido coronar a
                                        su León o haber dado jaque mate a su oponente.</p>

                                    <p>• El Rey propio o del oponente se encuentra ahogado.</p>

                                    <p>• Ninguno de los dos jugadores tiene material suficiente al final del juego para dar
                                        jaque mate con movimientos legales al Rey enemigo, lo cual ocurre cuando:</p>

                                    <p>Solo quedan los 2 reyes; queda un Rey contra Rey y una pieza menor; queda un Rey
                                        contra Rey y un peón propiamente dicho, ya que solo puede coronar en Alfil.</p>

                                    <h4>12.3 PERDER LA PARTIDA</h4>

                                    <p>Pierde la partida el jugador que:</p>

                                    <p>• Lo declara expresamente al abandonar la partida, por considerar que su situación ya
                                        no le permite poder remontar la desventaja.</p>

                                    <p>• Si se juega bajo modalidad de control de tiempo y se agota el tiempo en el reloj.</p>

                                    <p>• Su Rey recibe jaque mate por parte del oponente</p>

                                    <p>• El contrincante corona su León y no tiene forma de impedirlo.</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </header>
            </section>

            <MyFooter />

        </section>
    );
}