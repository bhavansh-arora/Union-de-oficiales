import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated, Dimensions, Text, Image } from 'react-native';

export const tabHeight = 64;
const width = Dimensions.get("window").width;

export default class StaticTabbar extends Component {
    constructor(props) {
        super(props)
        const { tabs } = this.props;
        this.values = tabs.map((tab, index) => new Animated.Value(index === 0 ? 1 : 0));
        this.state = {
            // values: new Animated.Value(0)
        }
    }
    onPress = (index) => {
        const { value, tabs } = this.props;
        const tabWidth = width / tabs.length;
        Animated.sequence([
            ...this.values.map(value => Animated.timing(value, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true
            })),
            Animated.parallel([
                Animated.spring(this.values[index], {
                    toValue: 1,
                    useNativeDriver: true
                }),
                Animated.spring(value, {
                    toValue: -width + tabWidth * index,
                    useNativeDriver: true
                })
            ]),
        ]).start();
            if(index===0){
            this.props.navigation.navigate("Blog");
            }

            else if(index===1){
            this.props.navigation.navigate("ContactUs");
            }

           else if(index===2){
            this.props.navigation.navigate("Download");
           }

            else if(index===3){  
            this.props.navigation.navigate("User");
            }

            else if(index===4){
            this.props.navigation.navigate("Examenes");
            }
        
    }
    render() {
        const { tabs, value } = this.props;
        const tabWidth = width / tabs.length;

        return (
            <View style={styles.container}>
                {
                    tabs.map((item, key) => {
                        const isFocused = this.props.state.index === key;
                        const activeValue = this.values[key];
                        const opacity = value.interpolate({
                            inputRange: [-width + tabWidth * (key - 1), -width + tabWidth * key, -width + tabWidth * (key + 1)],
                            outputRange: [1, 0, 1],
                            extrapolate: "clamp",
                        })
                        const translateY = activeValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [tabHeight, 0]
                        })
                        return (
                            <React.Fragment {...{ key }}>
                                <TouchableWithoutFeedback onPress={() => this.onPress(key)}>
                                    <Animated.View style={[styles.tab, { opacity }]}>
                                        <Image style={{width: 23, height: 23}}
                                          source={item.name} />
                                    </Animated.View>
                                </TouchableWithoutFeedback>
                                <Animated.View style={{
                                    position: "absolute",
                                    width: tabWidth,
                                    top: -8,
                                    left: tabWidth * key,
                                    height: tabHeight,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    transform: [{ translateY }]
                                }}>
                                    <View style={styles.circle}>
                                    <Image style={{width: 25, height: 25}}
                                         source={item.activeName} />                                        
                                    </View>                                    
                                </Animated.View>
                            </React.Fragment>
                        )
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    tab: {
        flex: 1,
        height: tabHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "white",
        justifyContent: 'center',
        alignItems: 'center'
    }
})