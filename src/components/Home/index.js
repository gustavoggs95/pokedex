import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import axios from 'axios'
import { capitalizeFirstLetter } from '../../utils/utils'
import pokeBall from '../../assets/images/pokeball.png'

const Home = ({ navigation }) => {

    useEffect(() => {
        // get pokemon list on start
        getPokemonList()
    }, [])

    const [pokemonList, setPokemonList] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageLoading, setPageLoading] = useState(false)
    const [page, setPage] = useState(1)

    // get pokemon list from the pokeAPI
    function getPokemonList(offset) {
        setPageLoading(true)
        axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${offset}`).then(res => {
            setPokemonList(res.data.results)
        }).catch(err => {
            console.log("Error", err)
        }).finally(() => {
            setLoading(false)
            setPageLoading(false)
        })
    }

    // update page variable and go to the next page
    function nextPage() {
        const newPage = page + 1
        setPage(newPage)
        let offset = (newPage - 1) * 10 // determine the API offset (pagination)
        getPokemonList(offset)
    }

    // update page variable and go to the previous page
    function previousPage() {
        const newPage = page - 1
        setPage(newPage)
        let offset = (newPage - 1) * 10 // determine the API offset (pagination)
        getPokemonList(offset)
    }

    // get pokemon ID from the pokeAPI URL string
    function getPokemonId(word) {
        let index = word.indexOf('pokemon')
        let idIndex = index + 8 // 8 = pokemon length
        return word.slice(idIndex, -1)
    }

    // determiness if the user can go back on the page
    function canGoPrevious() {
        if (page > 1) {
            return true
        } else {
            return false
        }
    }

    // determiness if the user can go forward on the page
    function canGoNext() {
        if (page < 111) { // 111 is the page limit for this API
            return true
        } else {
            return false
        }
    }

    return (
        <View style={{ flexGrow: 1, backgroundColor: '#34393f' }}>
            {
                loading ?
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="white" marginBottom={10} />
                        <Text style={{ color: 'white' }}>
                            Loading pokemons...
                        </Text>
                    </View>
                    :
                    // main container
                    <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 0, flexGrow: 1 }}>

                        {/* pagination container */}
                        <View style={styles.pagination}>
                            <TouchableOpacity disabled={!canGoPrevious()} onPress={() => previousPage()}>
                                <Text style={{ color: 'white', padding: 5, opacity: canGoPrevious() ? 1 : 0.3 }}>
                                    {'<'} Back
                                </Text>
                            </TouchableOpacity>
                            <Text style={{ color: 'white', padding: 5 }}>
                                Page: {page}
                            </Text>
                            <TouchableOpacity onPress={() => nextPage()}>
                                <Text style={{ color: 'white', padding: 5, opacity: canGoNext() ? 1 : 0.3 }}>
                                    Next >
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {
                            pageLoading ? // loading indicator for the pages
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="white" marginBottom={10} />
                                <Text style={{ color: 'white' }}>
                                    Loading pokemons...
                                </Text>
                            </View>
                            :
                            pokemonList.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        style={styles.pokeCard}
                                        key={index}
                                        onPress={() =>
                                            navigation.navigate('Pokemon Page', { url: item.url, name: capitalizeFirstLetter(item.name) })
                                        }
                                    >
                                        <Image
                                            style={{ height: 100, width: 100, marginRight: 15 }}
                                            source={{ uri: `https://pokeres.bastionbot.org/images/pokemon/${getPokemonId(item.url)}.png` }}
                                        />
                                        <Image
                                            style={{ height: 100, width: 100, opacity: 0.3, position: 'absolute', right: -20, top: -20 }}
                                            source={pokeBall}
                                        />
                                        <View style={{ position: 'absolute', width: '100%', marginLeft: 15, alignItems: 'center' }}>
                                            <Text style={{ fontSize: 18, color: 'white' }}>
                                                {capitalizeFirstLetter(item.name)}
                                            </Text>
                                        </View>
                                        <Text style={styles.displayId}>
                                            #{getPokemonId(item.url)}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        {
                            !pageLoading && // show bottom pagination only when not loading
                            <View style={styles.pagination}>
                                <TouchableOpacity disabled={!canGoPrevious()} onPress={() => previousPage()}>
                                    <Text style={{ color: 'white', padding: 5, opacity: canGoPrevious() ? 1 : 0.3 }}>
                                        {'<'} Back
                                    </Text>
                                </TouchableOpacity>
                                <Text style={{ color: 'white', padding: 5 }}>
                                    Page: {page}
                                </Text>
                                <TouchableOpacity onPress={() => nextPage()}>
                                    <Text style={{ color: 'white', padding: 5, opacity: canGoNext() ? 1 : 0.3 }}>
                                        Next >
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </ScrollView>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    pokeCard: {
        borderWidth: 0,
        borderColor: 'black',
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#da5552'
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    displayId: {
        position: 'absolute',
        right: 15,
        bottom: 10,
        color: 'rgba(0,0,0,0.5)',
        fontSize: 16
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        padding: 5,
    }
});

export default Home;
