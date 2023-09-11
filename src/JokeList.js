import React, { Component, useEffect, useState } from "react";

import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";


/** List of jokes. */

const JokeList = ({ numJokesToGet = 5 }) => {
    const [jokes, setJokes] = useState([])
    const [isLoading, setIsLoading] = useState(true)


    /* retrieve jokes from API */
    useEffect(() => {
        async function getJokes() {
            let jok = [...jokes];
            let seenJokes = new Set();
            while (jok.length < numJokesToGet) {
                let res = await axios.get('https://icanhazdadjoke.com', {
                    headers: { Accept: 'application/json' }
                });
                let { ...jokeobj } = res.data
                if (!seenJokes.has(jokeobj.id)) {
                    seenJokes.add(jokeobj.id);
                    jok.push({ ...jokeobj, votes: 0 })
                } else {
                    console.error('DUPLICATE FOUND!!')
                }
            }
            setJokes(jok);
            setIsLoading(false);
        }
        if(jokes.length === 0) getJokes();
    }, [jokes, numJokesToGet])
   


    const generateNewJokes = () =>{
        setIsLoading(true);
        setJokes([]);

    }

    const vote = (id, delta) => {
        setJokes(jokes => jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta}: j)))
    }
    
    if(isLoading){
        return (
            <div className="loading">
                <i className="fas fa-4x fa-spinner fa-spin" />
            </div>
        )
    }
    let sortedJokes = [...jokes].sort((a,b) => b.votes - a.votes)

    return (
              <div className="JokeList">
                <button
                  className="JokeList-getmore"
                  onClick={generateNewJokes}
                >
                  Get New Jokes
                </button>
                {sortedJokes.map(({id, joke, votes}) => (
                    <Joke
                        joke={joke}
                        id={id}
                        key={id}
                        votes={votes}
                        vote={vote}
                    />
                ))}
               
              </div>
            );


}

export default JokeList;
