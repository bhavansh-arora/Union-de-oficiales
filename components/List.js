import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Image,
} from 'react-native';
import AuthContext from '../Context/Context';
import Recursive from './RecursiveList';

function List({data, url, query}) {
  const {user} = useContext(AuthContext);
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    if (query) {
      setShowChildren(true);
    } else {
      setShowChildren(false);
    }
  }, [query]);

  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => setShowChildren(!showChildren)}>
          <View style={styles.folderContainer}>
            <Image
              source={
                showChildren
                  ? require('../assets/folderOpen.png')
                  : require('../assets/folder.png')
              }
              style={styles.icon}
              resizeMode="contain"
            />
            <Text>{data.title}</Text>
          </View>
        </TouchableWithoutFeedback>
        {showChildren && (
          <Recursive
            data={data.subcategories}
            files={data.files}
            // give user role here user.user_role
            access={data.permissions.some(p => user.user_role.includes(p))}
            url={url + '/' + encodeURI(data.title)}
            search={query}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  folderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
    width: 15,
    height: 15,
  },
});

export default List;
