/*Creiamo un calendario dinamico con le festività.
Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull’API).
Milestone 1
Creiamo il mese di Gennaio, e con la chiamata all'API inseriamo le festività.
Milestone 2
Diamo la possibilità di cambiare mese, gestendo il caso in cui l’API non possa ritornare festività.
Attenzione!
Ogni volta che cambio mese dovrò:
Controllare se il mese è valido (per ovviare al problema che l’API non carichi holiday non del 2018)
Controllare quanti giorni ha il mese scelto formando così una lista
Chiedere all’API quali sono le festività per il mese scelto
Evidenziare le festività nella lista

Link API: c*/

/*
{
    "success": true,
    "response": [
        {
            "name": "Capodanno",
            "date": "2018-01-01"
        },
        {
            "name": "Epifania",
            "date": "2018-01-06"
        }
    ]
}
*/


$(document).ready(function(){
    var dataCorrente = moment($('h1.month').attr('data-this-date'));        // unica variabile globale
      inserisciData(dataCorrente);
      inserisciFesta(dataCorrente);

      $('button#next').click(function(){
          next(dataCorrente);
      });
      $('button#prev').click(function(){
          prev(dataCorrente);
      });

//****FUNZIONI****
    function addzero(n){
        if(n<10){
            return '0' + n;
        }
        return n;
    }


    function inserisciData(data){
        $('ul.month-list').empty();                             // svuoto l'elenco ul prima di riempirlo

        var giorniTotali = data.daysInMonth();                 // calcolo i giorni totali in un mese

        var meseParola = data.format('MMMM');                  // memorizzo in una variabile il nome del mese
        var anno = data.year();                               // memorizzo in una variabile l'anno

        $('h1.month').html(meseParola + ' ' + anno);          // implemento l'h1 con mese e anno

        for (var i = 1; i <= giorniTotali; i++){             // ciclo tutti i giorni del mese
            var source = $("#day-template").html();
            var template = Handlebars.compile(source);

            var context = {
                day: addzero(i),
                month: meseParola,
                completeData: anno + '-' + data.format('MM') + '-' + addzero(i)
            };
            var html = template(context);

            $('.month-list').append(html);
        }
    }

    function inserisciFesta(data){
        $.ajax(
            {
                url: 'https://flynn.boolean.careers/exercises/api/holidays',
                method:'GET',
                data:{
                    year: data.year(),
                    month: data.month()
                },
                success: function(risposta){
                    for (var i = 0; i < risposta.response.length; i++){
                        var elemento = $('li[data-complete-date="' + risposta.response[i].date + '"]');
                        elemento.addClass('festività');
                        elemento.append(' - ' + risposta.response[i].name);
                        console.log(elemento);
                    }

                },
                error: function(){
                    alert('Si è verificato un errore');
                }
            }
        );
    }

    function next(data){
        if (data.month() == 11){
            alert('Non puoi proseguire');
        } else {
            data.add(1, 'months');
            inserisciData(data);
            inserisciFesta(data);
        }
    }

    function prev(data){
        if (data.month() == 0){
            alert('Non puoi proseguire');
        } else {
            data.subtract(1, 'months');
            inserisciData(data);
            inserisciFesta(data);
        }
    }
});
