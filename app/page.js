'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/nextjs"; // Added useUser
import { Container, Typography, AppBar, Toolbar, Button, Box, Grid } from "@mui/material";
import Head from "next/head";
import { NextResponse } from "next/server";

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser(); // Retrieve user details

  const handleSubmit = async (plan) => {
    if (!isLoaded || !isSignedIn) {
      console.error("User is not signed in or user data is not loaded.");
      return;
    }

    const priceMap = {
      basic: 500, // $5.00
      premium: 1000, // $10.00
      pro: 2000, // $20.00
    };
  
    try {
      const checkoutSession = await fetch("/api/checkout_session", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:3000',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: priceMap[plan], // Pass the selected plan's amount
          plan: plan, // Pass the selected plan
        }),
      });

      if (!checkoutSession.ok) {
        console.error('Error creating checkout session:', checkoutSession.status);
        return;
      }

      const checkout_session = await checkoutSession.json();

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkout_session.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  return (

    <Container maxWidth="100vw" sx={{ backgroundColor: '#00011e' }}>
      <Head>
        <title>Flashcard Saas</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard Saas
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>   
      <Box sx={{ textAlign: 'center', my: 8, py: 8 }}>
  <Typography variant="h2" sx={{ display: 'block', lineHeight: 1.2, color: "#e5e7eb"}}>
    Welcome to <br/> Flashcard<br />SaaS
  </Typography>
  <Typography variant="h5" sx={{ mt: 4, color: "#e5e7eb"}}>
    The easiest way to make flashcards from your text
  </Typography>
  <Button variant="contained"sx={{ mt: 3, color: "#e5e7eb" }} href="/generate">
    Get Started
  </Button>
</Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h6">Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Customer Support</Typography>
            <Typography>
              Never fear of losing your cards. Our customer support is open 24/7!
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Smart Flashcards</Typography>
            <Typography>
              Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Accessible Anywhere</Typography>
            <Typography>
              Access your flashcards from any device, at any time. Study on the go with ease.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h6">Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6">Basic</Typography>
              <Typography variant="h6">$5 / month</Typography>
              <Typography>
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleSubmit('basic')}>
                CHOOSE BASIC
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6">Premium</Typography>
              <Typography variant="h6">$10 / month</Typography>
              <Typography>
                More storage and access premium featured flashcards.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleSubmit('premium')}>
                CHOOSE PREMIUM
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6">Pro</Typography>
              <Typography variant="h6">$20 / month</Typography>
              <Typography>
                Unlimited flashcards and first priority to technical support.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleSubmit('pro')}>
                CHOOSE PRO
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>

  );
}
