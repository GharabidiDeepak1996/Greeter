import react from 'react'
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import moment from 'moment'


const Date = ({ date, onSelectDate, selected }) =>{
    const day = moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? 'Today' : 
    moment(date).format('ddd')
 
    const dayNumber = moment(date).format('D')

    const fullDate = moment(date).format('YYYY-MM-DD')

    return(
        <TouchableOpacity
        
        onPress={() =>{ 
            console.log(fullDate)
            onSelectDate(fullDate)}}
      style={[styles.card, selected === fullDate && { backgroundColor: "#360063" }]}>

<Text
        style={[styles.big, selected === fullDate && { color: "#fff" }]}
      >
         {day}
      </Text>

      <View style={{ height: 3 }} />
      <Text
        style={[
          styles.medium,
          selected === fullDate && { color: "#fff", fontWeight: 'bold', fontSize: 22 },
        ]}
      >
        {dayNumber}
        
      </Text>
        </TouchableOpacity>
    )
}

export default Date

const styles = StyleSheet.create({
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      borderWidth:1,
      borderColor: '#ddd',
      padding: 4,
      marginVertical: 8,
      alignItems: 'center',
      height: 60,
      width: 55,
      marginHorizontal: 2,
    },
    big: {
      color:'#666666',
     // fontWeight: 'bold',
      fontSize: 14,
    },
    medium: {
      color:'#666666',
      fontSize: 16,
    },
  })