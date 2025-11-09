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
  CircularProgress,
  InputAdornment, // Import InputAdornment
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  YouTube,
  Email,
  Chat,
  Visibility, // Import the visibility icon
  VisibilityOff, // Import the visibility off icon
} from "@mui/icons-material";
import { useAppDispatch } from "../utils/hooks";
import { loginThunk, meThunk } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Manit_Logo_color_0-removebg-preview.png";

const socialLinks = [
  { icon: <LinkedIn />, href: "https://www.linkedin.com/in/karan-choudhary-8b62a6216/" },
  { icon: <Facebook />, href: "#" },
  { icon: <YouTube />, href: "#" },
  { icon: <Instagram />, href: "#" },
  { icon: <Twitter />, href: "#" },
];

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userIdOrEmail, setUserIdorEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

  const [queryVisible, setQueryVisible] = useState(false);
  const [queryName, setQueryName] = useState("");
  const [queryEmail, setQueryEmail] = useState("");
  const [queryMsg, setQueryMsg] = useState("");
  const [querySent, setQuerySent] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([
    "Welcome to MBC Portal. How can I help you?",
  ]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await dispatch(loginThunk({ userIdOrEmail, password })).unwrap();
      await dispatch(meThunk()).unwrap();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
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
    setChatMessages((prev) => [...prev, `You: ${chatInput}`, `Assistant: I received your message!`]);
    setChatInput("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #E0F7FA 0%, #FFFDE7 100%)",
      }}
    >
      {/* Navbar */}
      <AppBar position="static" sx={{ bgcolor: "#0A3D62" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <img src={Logo} alt="MANIT Logo" style={{ height: 50 }} />
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

      {/* Login Card */}
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
          elevation={8}
          sx={{
            p: 6,
            borderRadius: 4,
            width: "100%",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Stack spacing={3} component="form" onSubmit={onSubmit}>
            <Typography variant="h5" fontWeight={700} align="center" color="#1a237e">
              MBC PORTAL
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
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
              // Toggle between "password" and "text" type
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              InputProps={{
                // Add the eye icon at the end of the input field
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()} // Prevents focus loss on click
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#1287A5",
                "&:hover": { bgcolor: "#0A3D62" },
                py: 1.5,
                fontWeight: "600",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              size="large"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "LOGIN"}
            </Button>
            <Link href="#" underline="hover" align="center" color="#1287A5">
              Forgot Password?
            </Link>
          </Stack>
        </Paper>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: "#0A3D62", color: "white", py: 4, mt: "auto" }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={4}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Email />
              <Typography variant="body2">
                For issues, email us at{" "}
                <Link href="mailto:aisenh037@gmail.com" underline="hover" sx={{ color: "white" }}>
                  aisenh037@gmail.com
                </Link>
              </Typography>
            </Stack>

            {/* Query Form & Button */}
            <Box>
              {!queryVisible && (
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#1287A5", "&:hover": { bgcolor: "#0A3D62" } }}
                  onClick={() => setQueryVisible(true)}
                >
                  Send a Query
                </Button>
              )}
              {queryVisible && (
                <Box component="form" onSubmit={handleQuerySubmit} sx={{ bgcolor: "white", p: 2, borderRadius: 2, mt: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Send a Query
                  </Typography>
                  {querySent && <Alert severity="success" sx={{ mb: 1 }}>Your query has been sent!</Alert>}
                  <TextField label="Name" size="small" fullWidth sx={{ mb: 1 }} value={queryName} onChange={(e) => setQueryName(e.target.value)} required />
                  <TextField label="Email" size="small" fullWidth sx={{ mb: 1 }} value={queryEmail} onChange={(e) => setQueryEmail(e.target.value)} required />
                  <TextField label="Message" size="small" fullWidth multiline rows={3} sx={{ mb: 1 }} value={queryMsg} onChange={(e) => setQueryMsg(e.target.value)} required />
                  <Button type="submit" variant="contained" sx={{ bgcolor: "#1287A5", "&:hover": { bgcolor: "#0A3D62" }, fontWeight: 600 }}>Submit</Button>
                </Box>
              )}
            </Box>

            {/* Socials */}
            <Stack direction="row" spacing={1} justifyContent="center">
              {socialLinks.map((link, idx) => (
                <IconButton key={idx} color="inherit" component="a" href={link.href} target="_blank">
                  {link.icon}
                </IconButton>
              ))}
            </Stack>
          </Stack>

          <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2, opacity: 0.8 }}>
            Developed by Karan Choudhary & Siddak Rajpal, MDS NIT-B '26
          </Typography>
        </Container>
      </Box>

      {/* Floating Chat */}
      <Fab color="primary" sx={{ position: "fixed", bottom: 20, right: 20, bgcolor: "#1287A5", "&:hover": { bgcolor: "#0A3D62" }, transition: "all 0.3s ease-in-out" }} onClick={() => setChatOpen(true)}>
        <Chat />
      </Fab>

      <Dialog open={chatOpen} onClose={() => setChatOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Chat Assistant</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 300, overflowY: "auto" }}>
            {chatMessages.map((msg, idx) => (
              <Typography key={idx} variant="body2">{msg}</Typography>
            ))}
          </Box>
          <TextField placeholder="Type your message..." fullWidth value={chatInput} onChange={(e) => setChatInput(e.target.value)} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChatSend} variant="contained" sx={{ bgcolor: "#1287A5", "&:hover": { bgcolor: "#0A3D62" } }}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}