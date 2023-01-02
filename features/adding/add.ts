
import firestore from '@react-native-firebase/firestore';
import { uid } from '../../App';

export async function addToFirestore(codeID:string, name:string,pictureURL:string){
    

    await firestore().collection('items').doc(codeID).set({ itemID: codeID, name: name, pictureURL: pictureURL, owner: uid, dateAdded: new Date().getTime()});
    await firestore().collection('users').doc(uid).set({ items: { [codeID]: true }}, {merge:true});

}