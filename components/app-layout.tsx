import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
// import HistoryIcon from '../assets/icons/history.svg';
import HomeIcon from '../assets/icons/home.svg';
import ManageIcon from '../assets/icons/manage.svg';


type AppLayoutProps = {
    title: string;
    showLinks?: boolean;
    children: React.ReactNode;
};

export default function AppLayout({ title, showLinks = true, children }: AppLayoutProps) {

  return (
    <View style={styles.appContainer}>
      <Text style={styles.title}>
        {title}
      </Text>
      <ScrollView style={[styles.appContent, { maxHeight: showLinks === true ? "78%" : "89%" }]}>
        {children}
      </ScrollView>
      {showLinks !== false &&
        <View style={styles.appLinks}>
            <Link href="/">
                <View style={styles.linkButton}>
                    <HomeIcon width={36} height={36} fill="#13163aff" />
                    <Text style={styles.linkText}>Tela Inicial</Text>
                </View>
            </Link>
            <Link href="/manage">
                <View style={styles.linkButton}>
                    <ManageIcon width={36} height={36} fill="#13163aff" />
                    <Text style={styles.linkText}>Gerenciar</Text>
                </View>
            </Link>
            {/* <Link href="/history">
                <View style={styles.linkButton}>
                    <HistoryIcon width={36} height={36} fill="#13163aff" />
                    <Text style={styles.linkText}>Histórico</Text>
                </View>
            </Link> */}
        </View>      
      }
    </View>
  );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#fff', 
        textAlign: 'center',
        marginTop: 32,
        paddingBottom: 8
    },
    appContainer: {
        backgroundColor: '#13163aff',
        flex: 1, 
        paddingTop: 32
    },
    appContent: {
        padding: 16,  
        // maxHeight: '78%',
    },
    appLinks: {
        backgroundColor: '#78f4ffff',
        position: 'absolute', 
        width: '100%',
        borderTopRightRadius: 22,
        borderTopLeftRadius: 22,
        padding: 24,
        paddingBottom: 48,
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    linkButton: {
        backgroundColor: 'transparent',
        width: 80,
        borderRadius: 50,
        gap: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    linkText: {
        color: '#13163aff',
        fontSize: 16,
        fontWeight: 800,
    }
});