import React, { Component } from 'react';

export default class Home extends Component {
    render() {
        const  {navigate} = this.props.navigation; //使用这种引入方式更加简单
        return (
            <View style={styles.container}>
                <Button
                    title="更新测试页"
                    onPress={() => navigate('Update')}
                />
            </View>
        );
    }
    
}