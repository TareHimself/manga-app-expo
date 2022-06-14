import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView, Text, View } from '../components/Themed';
import useMangaDexChapters from '../hooks/useMangaChapters';
import { MainStackScreenProps, MainStackParamList, IMangaDexApiChapter } from '../types';
import MangaChapterPreviewTouchable from '../components/MangaChapterPreviewTouchable';
import { isTablet } from '../utils';
export default function MangaPreviewScreen({ navigation, route }: MainStackScreenProps<'MangaPreview'>) {

  const { manga } = route.params;

  const bIsTablet = isTablet();

  console.log(bIsTablet)
  const coverUrl = manga.cover;
  const title = manga.name;
  const description = "Come along with me";
  const status = " unknown";

  const [chapters] = useMangaDexChapters(manga.id || '');

  const [wantsToRead, setWantsToRead] = useState(false);

  const onReadChapter = (chapter: string) => {
    if (manga) {
      navigate('ReadMangaModal', { manga: manga, chapters: chapters, startChapter: chapter })
    }

  }

  const navigate = useCallback((route: keyof MainStackParamList, params: MainStackParamList[keyof MainStackParamList]) => {
    navigation.navigate(route, params)
  }, [])



  return (
    <SafeAreaView style={styles.container} level={'level0'}>

      <View style={styles.topBar}></View>
      <View style={styles.informationView} level={'level1'}>
        <View style={styles.imageContainer}>
          <Image style={styles.coverImg} source={{ uri: coverUrl }} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.status}>status | {status}</Text>
        </View>

      </View>
      <View style={styles.contentView} level={'level1'}>
        <ScrollView style={styles.scroll} contentContainerStyle={{ alignItems: 'flex-start' }}>

          {chapters.map(chapter => <MangaChapterPreviewTouchable chapter={chapter} key={chapter} readChapter={onReadChapter} />)}
        </ScrollView>
      </View>


    </SafeAreaView>

  );

}

const width = Dimensions.get('window').width;
const height = 230;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginTop: 20
  },
  topBar: {
    flex: 1,
    height: 50,
    maxHeight: 100,
    width: width * 0.8
  },
  informationView: {
    flexDirection: 'row',
    width: '90%',
    marginLeft: '5%',
    marginBottom: 20,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  textContainer: {
    width: '60%',
  },
  imageContainer: {
    minWidth: 100,
    width: '20%',
    maxWidth: 150,
    aspectRatio: 0.65,
    marginRight: 10
  },
  coverImg: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
    borderRadius: 15
  },
  title: {
    fontSize: 20,
    marginTop: 15,
    marginBottom: 15
  },
  status: {
    fontSize: 15,
    marginBottom: 15
  },
  scroll: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  contentView: {
    flex: 1,
    width: '90%',
    marginLeft: '5%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  description: {
    fontSize: 15,
  },
  text: {

  }
});
