class Posts {

    constructor() {
        // Deklaracja pola w klasie, które odpowiada adresowi pod ktorym sa dostepne zasoby postow
        this.url = 'https://jsonplaceholder.typicode.com/posts';
    }

    // zad (1)
    // pobranie listy wszystkich postow
    getAllPosts() {
        // przygotowanie opcji, ktore sa przekazywane do funkcji fetch w tym przypadku jest to ustawienie metody GET (mozna to pominac, fetch domyslnie ustawia te metode)
        const options = {
            // klucz method odopowiada za poinformowanie jakiej metody chcemy uzyc do zapytania
            method: 'GET'
        };

        // wywolanie funkcji fetch z parametrem URL oraz opcjami. Funkcja fetch zwraca obiekt Promise, ktory jest przypisywany do zmiennej fetchPromise.
        const fetchPromise = fetch(this.url, options);
        // W momeicie, dodajemy obsluge kiedy nasza Promise sie zakonczy -> w tym przypadku trzeba skorzystac w metody .then na obiekcie Promise co powoduje wywolanie metody przekazanej jako argument funkcji .then w momencie kiedy Promesa sie zakonczy. Nasza funkcja przekazana zwraca nowa Promise w tym przypadku ta Promise spowoduje zamiane obiektu Response na format JSON.
        return fetchPromise.then((response) => response.json());
    }

    deletePost(postId) {
        // Przygotowanie informacji dla funkcji fetch, ze chce wykonac zapytanie typu DELETE
        const options = {
            method: 'DELETE'
        };

        // Zgodnie z informacjami zamieszczonymi w dokumentacji API przygotowywuje odpowiedni adres URL, pod ktory powinno zostac wykonane zapytanie
        const url = `${this.url}/${postId}`;

        // Wywolanie funkcji fetch, ktora zwraca obiekt Promise i przypisuje go do zmiennej
        const fetchPromise = fetch(url, options);
        // W momencie obsluzenia zapytania przez przegladarke, zwracam kolejna Promise ktora obiecuje, ze przygotuje mi odpowiedz uzyskana z serwera w postaci JSON.
        return fetchPromise.then((response) => response.json());
    }

    addPost(newPost) {
        // Tworze nowy obiekt options z dwoma polami : metod oraz body.
        // Funkcja fetch w dokumentacji pokazuje, ze mozemy przekazac cialo do zapytania pod kluczem body ale musi byc ono w formie np. tekstowej.
        const options = {
            method: 'POST',
            body: JSON.stringify(newPost)
        }

        // Wywolanie funkcji fetch dla danego URL oraz options, zwraca mi to Promise ktory obiecuje ze zwroci obiekt typu Response
        const fetchPromise = fetch(this.url, options);

        // W momencie kiedy to zapytanie sie wykona metoda .then wywola przekazana funkcje jako swoj parametr
        return fetchPromise.then((response) => {
            // Sprawdzenie czy status odpowiedzi miesci sie w grupie 2 statusów HTTP (200-299)
            if (response.ok) {
                // Jezeli jest ok to zwracamy odpowiedz w postaci JSON
                return response.json();
            } else {
                // W przeciwnym przypadku zwracamy nowy obiekt, ktory opisuje ze wystapil jakis blad podczas zapytania
                return {
                    error: 'Wystapil jakis blad podczas zapytania',
                    status: response.status,
                    statusText: response.statusText
                }
            }
        });
    }

    editPost(editedPost) {
        // Przygotowanie opcji - ustawienie odpowiedniej metody oraz ciala zapytania
        const options = {
            method: 'PUT',
            body: JSON.stringify(editedPost)
        };

        // zgodnie z dokumentacja wykonujemy zapytanie na odpowiedni adres URL
        const url = `${this.url}/${editedPost.id}`

        // wywolanie funkcji fetch pod konretnym adresem oraz z opcjami
        const fetchPromise = fetch(url, options);

        // obsluga Promesy zwroconej przez fetch
        return fetchPromise.then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return {
                    error: 'Wystapil blad podczas edycji posta',
                    status: response.status,
                    statusText: response.statusText
                }
            }
        })
    }
}

class Comments {

    constructor() {
        // ustawienie adresu URL jako pole w klasie
        this.url = 'https://jsonplaceholder.typicode.com/comments';
    }

    getAllComments() {
        // wywolanie funkcji fetch, ktora z podanego adresu URL pobiera zasób. Domyslnie metoda uzyta przez fetch to GET
        const fetchPromise = fetch(this.url);
        // wynikiem funkcji jest zwrocenie obiektu Promise, ktory w momencie rozwiazania bedzie mial wartosc odpowiedzi uzyskanej z serwera w postaci JSON
        return fetchPromise.then((response) => response.json())
    }

    deleteComment(commentId) {
        // przygotowanie informacji dla funkcji fetch o metodzie jaka ma byc uzyta do zapytania
        const options = {
            method: 'DELETE'
        };

        // przygotowanie adresu URL pod ktory ma zostac wyslane zapytanie
        const url = `${this.url}/${commentId}`;

        // wywolanie funkcji fetch na konkretnym adresie z opcjami, i zwrocenie Promesy ktora obiecuje przeksztalcic wynik uzyskany z serwera do postaci JSON.
        return fetch(url, options).then((response) => response.json());
    }

    addComment(newComment) {
        const options = {
            method: 'POST',
            body: JSON.stringify(newComment)
        }

        const fetchPromise = fetch(this.url, options);

        return fetchPromise.then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return {
                    error: 'Wystapil blad poczas dodawania nowego komentarza',
                    status: response.status,
                    statusText: response.statusText
                }
            }
        });
    }

    editComment(editedComment) {
        const options = {
            method: 'PUT',
            body: JSON.stringify(editedComment)
        }

        const url = `${this.url}/${editedComment.id}`;

        const fetchPromise = fetch(url, options);

        return fetchPromise.then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return {
                    error: `Wystapil blad podczas edycji komentarza: ${editedComment.id}`,
                    status: response.status,
                    statusText: response.statusText
                }
            }
        });
    }

    getCommentsForPost(postId) {
        // Aby recznie nie tworzyc odpowiedniego adresu URL korzystamy z klasy URLSearchParams, ktora pozwala nam w prosty sposob pracowac z query paramsami dla jakiegos URL. W konstruktorze przekazujemy obiekt, ktory zostanie przeksztalcony przez logike zawarta w klasie URLSearchParams do postaci odpowiedniej aby byla uzyta w adresie URL
        const queryParams = new URLSearchParams({
            postId: postId
        });
        // Budowanie odpowiedniego adresu zasobu - uzycie metody toString() spowoduje przygotowanie odpowiednich query parameters
        const url = `${this.url}?${queryParams.toString()}`;

        // wykonanie zapytania - domyslnie wykonuje sie zapytanie GET
        const fetchPromise = fetch(url);

        // obsluga obiektu Response, ktory jest zwracany przez Promise z fetch.
        return fetchPromise.then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return {
                    error: `Wystapil blad podczas pobierania komentarzy dla postu o ID ${postId}`,
                    status: response.status,
                    statusText: response.statusText
                }
            }
        })
    }
}

// Wywolanie konstruktora klasy Posts i stworzenie nowego obiektu
const posts = new Posts();
// Wywolanie metody getAllPosts ktora zwraca obiekt typu Promise. W momencie rozwiazanie tego Promise wywoluje funkcje (przekazana jako parametr), ktora wyswietli w konsoli przeksztalcona odpowiedz w formacie JSON.
posts.getAllPosts().then((json) => {
    console.log('JSON zawierajacy dane odnosnie postow w formacie JSON', json)
});
// Wywolanie metody deletePost z parametrem 5 oznacza, ze chce usunac post, ktorego ID = 5.
posts.deletePost(5).then(console.log);
// Wywolanie metody ktora stworzy nowy zasob Post bazujac na podanych parametrach
let newPost = { userId: 5, title: 'Moj nowy post', body: 'Moje nowe cialo w nowym poscie' };
posts.addPost(newPost).then((json) => {
    newPost = {
        ...newPost,
        ...json
    };
    console.log('Utworzono nowy post:', newPost);

    // Z powodu, ze API tak na prawde nie dodaje do bazy danych nowego postu ta metoda zakonczy sie z błedem
    posts.editPost({
        ...newPost,
        title: 'Moj zedytowany tytul'
    }).then(console.log);
});

// Edycja juz istniejacego postu w bazie danych
posts.editPost({
    id: 2,
    userId: 2,
    title: 'Edited title',
    body: 'Edited body'
}).then(console.log);

// Wywolanie konstruktora klasy Comments i stworzenie nowego obiektu
const comments = new Comments();
// Wywolanie metody getAllPosts ktora zwraca obiekt typu Promise. W momencie rozwiazanie tego Promise wywoluje funkcje (przekazana jako parametr), ktora wyswietli w konsoli przeksztalcona odpowiedz w formacie JSON.
comments.getAllComments().then((json) => {
    console.log('JSON zawierajacy dane odnosnie komentarzy w formacie JSON', json);
});
// Wywolanie metody deleteComment z parametrem 2 oznacza, ze chce usunac komentarz ktorego ID = 2;
comments.deleteComment(2).then(console.log);
// Dodanie nowego komentarza
comments.addComment({
    postId: 5,
    name: 'Bartek',
    email: 'bartek@test.pl',
    body: 'Ale super post, ciesze sie ze to sie udało!'
}).then(console.log);

// Edycja komentarza
comments.editComment({
    postId: 1,
    id: 5,
    name: "Super komentarz",
    email: "bartosz@test.com",
    body: "Uczymy sie HTTP"
}).then(console.log);

// Pobranie komentarza dla konkretnego postu
comments.getCommentsForPost(2).then(console.log);

class Users {
    constructor () {};

}
