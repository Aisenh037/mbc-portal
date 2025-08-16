import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Stack,
  TextField,
  Alert,
  Box,
  Link,
  IconButton,
  Paper,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  YouTube,
  Email,
  Chat,
} from "@mui/icons-material";
import { useAppDispatch } from "../utils/hooks";
import { loginThunk, meThunk } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Manit_Logo_color_0-removebg-preview.png";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userIdOrEmail, setUserIdorEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Query form state
  const [queryVisible, setQueryVisible] = useState(false);
  const [queryName, setQueryName] = useState("");
  const [queryEmail, setQueryEmail] = useState("");
  const [queryMsg, setQueryMsg] = useState("");
  const [querySent, setQuerySent] = useState(false);

  // Chat popup state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([
    "Welcome to MBC Portal. How can I help you?",
  ]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await dispatch(loginThunk({ userIdOrEmail, password })).unwrap();
      await dispatch(meThunk()).unwrap();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:aisenh037@gmail.com?subject=Query from ${queryName}&body=${queryMsg}\n\nContact Email: ${queryEmail}`;
    window.location.href = mailtoLink;
    setQuerySent(true);
    setQueryName("");
    setQueryEmail("");
    setQueryMsg("");
    setQueryVisible(false);
  };

  const handleChatSend = () => {
    if (chatInput.trim() === "") return;
    setChatMessages((prev) => [...prev, `You: ${chatInput}`]);
    setChatMessages((prev) => [
      ...prev,
      `Assistant: I received your message!`,
    ]);
    setChatInput("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ bgcolor: "#0A3D62" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <img src={Logo} alt="MANIT Logo" className="login-logo-img" />
            <Typography variant="h6" fontWeight="700">
              Maulana Azad National Institute of Technology
            </Typography>
          </Stack>
          <Stack direction="row" spacing={3}>
            <Button color="inherit">HOME</Button>
            <Button color="inherit">ABOUT</Button>
            <Button color="inherit">PROGRAMS</Button>
            <Button color="inherit">LOGIN</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 5,
            borderRadius: 3,
            width: "100%",
            bgcolor: "white",
          }}
        >
          <Stack spacing={3} component="form" onSubmit={onSubmit}>
            <Typography
              variant="h5"
              fontWeight={700}
              align="center"
              color="#1a237e"
            >
              MBC PORTAL
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              mb={2}
            >
              Enter your credentials to access the portal
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Email / User ID"
              value={userIdOrEmail}
              onChange={(e) => setUserIdorEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#1287A5",
                "&:hover": { bgcolor: "#0A3D62" },
                py: 1.5,
                fontWeight: "600",
                borderRadius: 2,
              }}
              size="large"
            >
              LOGIN
            </Button>
            <Link href="#" underline="hover" align="center" color="#1287A5">
              Forgot Password?
            </Link>
          </Stack>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{ bgcolor: "#0A3D62", color: "white", py: 4, mt: "auto" }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={4}
          >
            {/* Support Email */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Email />
              <Typography variant="body2">
                For issues, email us at{" "}
                <Link
                  href="mailto:aisenh037@gmail.com"
                  underline="hover"
                  sx={{ color: "white" }}
                >
                  aisenh037@gmail.com
                </Link>
              </Typography>
            </Stack>

            {/* Query Button & Form */}
            <Box>
              {!queryVisible && (
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#1287A5",
                    "&:hover": { bgcolor: "#0A3D62" },
                  }}
                  onClick={() => setQueryVisible(true)}
                >
                  Send a Query
                </Button>
              )}
              {queryVisible && (
                <Box
                  component="form"
                  onSubmit={handleQuerySubmit}
                  sx={{
                    bgcolor: "white",
                    color: "black",
                    p: 2,
                    borderRadius: 2,
                    mt: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Send a Query
                  </Typography>
                  {querySent && (
                    <Alert severity="success" sx={{ mb: 1 }}>
                      Your query has been sent!
                    </Alert>
                  )}
                  <TextField
                    label="Name"
                    size="small"
                    fullWidth
                    sx={{ mb: 1 }}
                    value={queryName}
                    onChange={(e) => setQueryName(e.target.value)}
                    required
                  />
                  <TextField
                    label="Email"
                    size="small"
                    fullWidth
                    sx={{ mb: 1 }}
                    value={queryEmail}
                    onChange={(e) => setQueryEmail(e.target.value)}
                    required
                  />
                  <TextField
                    label="Message"
                    size="small"
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 1 }}
                    value={queryMsg}
                    onChange={(e) => setQueryMsg(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: "#1287A5",
                      "&:hover": { bgcolor: "#0A3D62" },
                      fontWeight: 600,
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              )}
            </Box>

            {/* Socials */}
            <Stack direction="row" spacing={1} justifyContent="center">
              <IconButton
                color="inherit"
                component="a"
                href="https://www.linkedin.com/in/karan-choudhary-8b62a6216/"
                target="_blank"
              >
                <LinkedIn />
              </IconButton>
              <IconButton color="inherit">
                <Facebook />
              </IconButton>
              <IconButton color="inherit">
                <YouTube />
              </IconButton>
              <IconButton color="inherit">
                <Instagram />
              </IconButton>
              <IconButton color="inherit">
                <Twitter />
              </IconButton>
            </Stack>
          </Stack>

          {/* Developed By */}
          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            sx={{ mt: 2, opacity: 0.8 }}
          >
            Developed by Karan Choudhary & Siddak Rajpal, MDS NIT-B '26
          </Typography>
        </Container>
      </Box>

      {/* Floating Chatbot Icon */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          bgcolor: "#1287A5",
          "&:hover": { bgcolor: "#0A3D62" },
        }}
        onClick={() => setChatOpen(true)}
      >
        <Chat />
      </Fab>

      {/* Chat Popup */}
      <Dialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Chat Assistant</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            {chatMessages.map((msg, index) => (
              <Typography key={index} variant="body2">
                {msg}
              </Typography>
            ))}
          </Box>
          <TextField
            placeholder="Type your message..."
            fullWidth
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleChatSend}
            variant="contained"
            sx={{ bgcolor: "#1287A5", "&:hover": { bgcolor: "#0A3D62" } }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
