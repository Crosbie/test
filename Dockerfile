FROM ubuntu:latest

RUN git clone https://github.com/albertobsd/keyhunt.git
RUN cd keytools
RUN make
RUN ./keyhunt -m bsgs -f tests/130.txt -b 130 -R -k 512 -q -t 8 -s 10 -S