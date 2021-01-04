import React, { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import axios from 'axios'
import { capitalizeFirstLetter } from '../../utils/utils.js'
import sky from '../../assets/images/sky.jpg'

export default function pokemonPage(props) {
    const [pokemonDetail, setPokemonDetail] = useState({ sprites: {} })
    const [loading, setLoading] = useState(true)

    const { url } = props.route.params


    useEffect(() => {
        // load pokemon detail on start
        getPokemonDetail()
    }, [])

    function getPokemonDetail() {
        // get pokemon detail from the pokeAPI
        axios.get(url).then(res => {
            setPokemonDetail(res.data)
        }).catch(err => {
            console.log("Erro na chamada GET detail", err)
        }).finally(() => {
            setLoading(false)
        })
    }

    function transformStats(type) {
        // get stats abreviation
        switch (type) {
            case 'hp':
                return 'HP'
            case 'attack':
                return 'ATK'
            case 'defense':
                return 'DEF'
            case 'special-attack':
                return 'SPA'
            case 'special-defense':
                return 'SPF'
            case 'speed':
                return 'SPD'
            default:
                return 'HP'
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <Image style={{ height: 160, width: '100%', position: 'absolute' }} source={sky} />
                        {
                            loading ? // loading indicator container
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="white" marginBottom={10} />
                                <Text style={{ color: 'white' }}>
                                    Loading pokemons...
                                </Text>
                            </View> 
                            :
                            // main container
                            <View style={styles.card}>
                                <View style={styles.imageContainer}>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: `https://pokeres.bastionbot.org/images/pokemon/${pokemonDetail.id}.png` }}
                                    />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={[styles.title, { marginTop: 60 }]}>
                                        {capitalizeFirstLetter(pokemonDetail.name)}
                                    </Text>
                                    <View style={styles.typesContainer}>
                                        {
                                            pokemonDetail.types.map((item, index) => {
                                                return (
                                                    <View key={index} style={styles.types}>
                                                        <Text style={{ color: 'white' }}>
                                                            {item.type.name}
                                                        </Text>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                    <View style={ styles.sizeContainer }>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>{ pokemonDetail.height / 10 } M</Text>
                                            <Text style={{ color: 'rgba(0,0,0,0.5)' }}>Height</Text>
                                        </View>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{ pokemonDetail.weight } KG</Text>
                                            <Text style={{ color: 'rgba(0,0,0,0.5)' }}>Weight</Text>
                                        </View>
                                    </View>
                                    <View style={ styles.statsContainer }>
                                        <View style={{ alignItems: 'center', marginBottom: 5 }}>
                                            <Text style={{ color: 'white', fontSize: 20 }}>Base Stats </Text>
                                        </View>
                                        {
                                            pokemonDetail.stats.map((item, index) => {
                                                return (
                                                    <View style={styles.statsBarContainer} key={index}>
                                                        <Text style={{ width: 50, color: 'lightgray' }}>{transformStats(item.stat.name)}</Text>
                                                        <Text style={{ width: 50, color: 'white' }}>{item.base_stat}</Text>
                                                        <View style={[styles.statsBar, { width: `${(item.base_stat / 255) * 100}%` }]} />
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            </View>
                        }
                    </ScrollView>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#da5552',
        marginTop: 100,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
    },
    sizeContainer:{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 20,
        paddingTop: 10
    },
    statsContainer:{
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 15,
        padding: 15,
        paddingTop: 10,
    },
    statsBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden'
    },
    statsBar: {
        height: 7,
        backgroundColor: 'royalblue',
        borderRadius: 100,
    },
    types: {
        backgroundColor: 'rgba(102, 179, 255, 1)',
        marginRight: 10,
        paddingHorizontal: 15,
        paddingTop: 5,
        paddingBottom: 8,
        borderRadius: 25,
    },
    typesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        color: 'white'
    },
    card: {
        borderRadius: 5,
        flex: 1,
    },
    image: {
        height: 200,
        width: 200,
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
        zIndex: 10,
        elevation: 10,
        marginBottom: -80,
        marginTop: 5
    },
    textContainer: {
        borderWidth: 0,
        borderColor: 'gray',
        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
        borderBottomColor: 'transparent',
        zIndex: 0,
        padding: 15,
        backgroundColor: '#da5552',
        flex: 1,
    }
});
