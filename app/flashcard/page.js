'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import { Container, Box, Typography, Grid, Card, CardActionArea, CardContent } from "@mui/material"

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return 
            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const fetchedFlashcards = []
            docs.forEach((doc) => {
                fetchedFlashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(fetchedFlashcards)
        }

        getFlashcard()
    }, [user, search])

    const handleCardClick = (id) => {
        setFlipped(prev => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Container maxWidth="100vw">
            <Grid container spacing={3} sx={{ mt: 4 }}>
               
                            {flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                                    <Card>
                                        <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                                            <CardContent>
                                                <Box sx={{ perspective: '1000px' }}>
                                                    <Box
                                                        sx={{
                                                            transition: 'transform 0.6s',
                                                            transformStyle: 'preserve-3d',
                                                            position: 'relative',
                                                            width: '100%',
                                                            height: '200px',
                                                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                            transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                width: "100%",
                                                                height: '100%',
                                                                backfaceVisibility: 'hidden',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                padding: 2,
                                                                boxSizing: 'border-box',
                                                            }}
                                                        >
                                                            <Typography variant="h5" component="div">
                                                                {flashcard.front}
                                                            </Typography>
                                                        </Box>
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                width: "100%",
                                                                height: '100%',
                                                                backfaceVisibility: 'hidden',
                                                                transform: 'rotateY(180deg)',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                padding: 2,
                                                                boxSizing: 'border-box',
                                                            }}
                                                        >
                                                            <Typography variant="h5" component="div">
                                                                {flashcard.back}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                  
        </Container>
    )
}
