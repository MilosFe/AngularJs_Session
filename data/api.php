<?php

        // set up the connection variables
        $db_name  = 'blog';
        $hostname = '127.0.0.1';
        $username = 'tim';
        $password = 'mypass1234';

        // connect to the database
        $dbh = new PDO("mysql:host=$hostname;dbname=$db_name", $username, $password);

        // a query get all the records from the users table
        $sql = 'SELECT  id, title, image, opis, sadrzaj FROM post ORDER BY id desc';

        // use prepared statements, even if not strictly required is good practice
        $stmt = $dbh->prepare( $sql );

        // execute the query
        $stmt->execute();

        // fetch the results into an array
        $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

        // convert to json
        $json = json_encode( $result );

        // echo the json string
        echo $json;
?>

