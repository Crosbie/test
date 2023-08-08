# syntax=docker/dockerfile:1
   
FROM ubuntu


# install git
RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install git -y
RUN apt-get install make -y

RUN git clone https://github.com/albertobsd/keyhunt.git
WORKDIR "/keyhunt"
RUN make
RUN ./keyhunt -m bsgs -f tests/130.txt -b 130 -R -k 512 -q -t 8 -s 10 -S



