import axios from "axios";
import  { useEffect, useState } from "react";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  Box,
  ListItemIcon,
  CircularProgress,
  Typography,
  Fab,
  AppBar,
  Drawer,
  Paper,
  Grid,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
export default function App() {
  const categories = [
    {
      type: "smileys-emotion",
      icon: <TagFacesIcon />,
    },
    { type: "people-body", icon: <EmojiPeopleIcon /> },
    { type: "animals-nature", icon: <EmojiNatureIcon /> },
    { type: "food-drink", icon: <FastfoodIcon /> },
  ];
  const [emojidata, setEmojidata] = useState([]);
  const [emojitype, setEmojitype] = useState("smileys-emotion");
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    axios
      .get(
        `https://emoji-api.com/categories/${emojitype}?access_key=57fe206d83fd12f1a95a0039018314e7577491d3`
      )
      .then((res) => {
        setEmojidata(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [emojitype]);
  useEffect(() => {
    document.onscroll = () => {
      document.startViewTransition(() => {
        if (document.documentElement.scrollTop > 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      });
    };
  }, [visible]);
  return (
    <>
      {visible && (
        <Fab
          size="small"
          color="primary"
          sx={{
            position:"fixed",
            right:10,
            bottom:12,
          }}
          onClick={() => {
            document.startViewTransition(() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            });
          }}
        >
          <ArrowUpwardIcon />
        </Fab>
      )}
      <Box sx={{ display: "flex" }}>
        <AppBar
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 4fr",
            placeItems: "center",
          }}
        >
          <IconButton
            color="inherit"
            sx={{ marginRight: "auto" }}
            onClick={() => setHide(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ marginInlineEnd: mobile ? 10 : 9 }}
          >
            Emoji-Moji
          </Typography>
        </AppBar>
        <Drawer
          open={hide}
          variant={mobile ? "temporary" : "permanent"}
          onClose={() => setHide(false)}
        >
          {categories.map((category, index) => {
            return (
              <ListItem key={index}>
                <ListItemButton
                  onClick={(e) => {
                    setEmojitype(e.currentTarget.textContent);
                    setHide(false);
                    setLoading(true);
                    setSelectedIndex(index);
                  }}
                  sx={{
                    backgroundColor: index === selectedIndex ? "#CAB7A2" : "",
                    "&:hover": {
                      backgroundColor: "#CAB7A2",
                      color: "white",
                    },
                  }}
                >
                  <ListItemIcon>{category.icon}</ListItemIcon>
                  <ListItemText
                    sx={{
                      "&:first-letter": {
                        textTransform: "uppercase",
                      },
                    }}
                  >
                    {category.type}
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </Drawer>
        {loading ? (
          <CircularProgress
            sx={{
              position: "absolute",
              left: mobile ? "45%" : "56%",
              top: "50%",
            }}
          />
        ) : (
          <Grid
            container
            spacing={mobile ? 3 : 1}
            sx={{
              placeItems: "center",
              marginLeft: mobile ? "-2rem" : 40,
              paddingBlockStart: 8,
              padding: mobile ? 2 : "",
            }}
          >
            {emojidata?.map((emoji, index) => {
              const { slug, character } = emoji;
              const newslug = slug.slice(5);
              const trimmedslug = newslug.startsWith("-")
                ? slug.slice(6)
                : slug.slice(5);
              return (
                <Grid item key={index} xs={6} sm={6} lg={3}>
                  <Paper
                    sx={{
                      p: 1,
                      width: mobile ? "100%" : 200,
                      height: mobile ? 100 : 100,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      "&:hover": {
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      textAlign="center"
                      sx={{
                        fontSize: 22,
                      }}
                    >
                      {character}
                    </Typography>
                    <Typography
                      variant="body1"
                      textAlign="center"
                      sx={{
                        "&:first-letter": {
                          textTransform: "uppercase",
                        },
                      }}
                    >
                      {trimmedslug}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </>
  );
}
