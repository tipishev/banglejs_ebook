// Combined scroller with scrollbar

// Constants for colors
const COLORS = {
  BLACK: "#000000",
  WHITE: "#FFFFFF",
  GRAY: "#808080",
  GREEN: "#00FF00",
  MAGENTA: "FF00FF",
};

// Constants for screen and font dimensions
const SCREEN_WIDTH = g.getWidth();
const SCREEN_HEIGHT = g.getHeight();
const FONT_SIZE = 20;
const LINE_SPACE = 3;

// Text margins
const TEXT_MARGIN_X = 5;

// Scrollbar dimensions
const SCROLLBAR_WIDTH = 7;

// Sample text to display
const TEXT = `
But as for Queequeg--why, Queequeg sat there among them--at the head
of the table, too, it so chanced; as cool as an icicle.  To be sure I
cannot say much for his breeding.  His greatest admirer could not
have cordially justified his bringing his harpoon into breakfast with
him, and using it there without ceremony; reaching over the table
with it, to the imminent jeopardy of many heads, and grappling the
beefsteaks towards him.  But THAT was certainly very coolly done by
him, and every one knows that in most people's estimation, to do
anything coolly is to do it genteelly.
`;

// Pre-wrap text to fit the screen width
const lines = g.wrapString(TEXT, FONT_SIZE * 3.2);

// Function to draw a line of text
function drawTextLine(index, rect) {
  g.setFontVector(FONT_SIZE);
  g.setFontAlign(-1, -1); // Left-aligned text
  g.setBgColor(COLORS.BLACK);
  g.setColor(COLORS.WHITE);
  g.clearRect(rect.x, rect.y, rect.x + rect.w, rect.y + rect.h); // Clear the row area
  g.drawString(lines[index], rect.x + TEXT_MARGIN_X, rect.y); // Draw the line text
}

// Function to draw the scrollbar
let scrollbarTimeout;
function drawScrollbar(currentIndex, totalRows) {
  const visibleRatio = SCREEN_HEIGHT / (totalRows * (FONT_SIZE + LINE_SPACE));
  const scrollbarHeight = Math.max(SCROLLBAR_WIDTH, SCREEN_HEIGHT * visibleRatio);
  const maxScroll = SCREEN_HEIGHT - scrollbarHeight;
  const scrollPosition = (currentIndex / (totalRows - 1)) * maxScroll;

  // Draw the scrollbar background
  g.setColor(COLORS.GRAY);
  g.fillRect(SCREEN_WIDTH - SCROLLBAR_WIDTH, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  // Draw the scrollbar handle
  g.setColor(COLORS.WHITE);
  g.fillRect(
    SCREEN_WIDTH - SCROLLBAR_WIDTH,
    scrollPosition,
    SCREEN_WIDTH,
    scrollPosition + scrollbarHeight
  );

  // Clear scrollbar after a delay
  if (scrollbarTimeout) clearTimeout(scrollbarTimeout);
  scrollbarTimeout = setTimeout(() => {
    g.setBgColor(COLORS.BLACK);
    g.clearRect(SCREEN_WIDTH - SCROLLBAR_WIDTH, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }, 1000);
}

// Initialize the scroller
E.showScroller({
  h: FONT_SIZE + LINE_SPACE, // Height of each scrollable row
  c: lines.length, // Number of scrollable rows
  draw: (index, rect) => {
    drawTextLine(index, rect);
  },
  select: (index) => {
    console.log(`Selected line: ${index + 1} of ${lines.length}`);
    drawScrollbar(index, lines.length);
  },
});

// Function to show the scrollable file list
function showFileList() {
  files = require("Storage").list("\.txt");
  E.showScroller({
    h: FONT_SIZE + LINE_SPACE * 2, // Height of each scrollable row
    c: files.length, // Number of scrollable rows
    draw: (idx, r) => {
       g.setBgColor((idx&1)?"#FF00FF":"#00FF00");
       g.setColor(COLORS.BLACK);
       g.clearRect(r.x,r.y,r.x+r.w-1,r.y+r.h-1);
       g.setFontVector(FONT_SIZE).drawString(files[idx], r.x+10, r.y+4);
    },
    select: (index) => {
      console.log(`Selected file: ${files[index]}`);
      E.showMessage(`You selected:\n${files[index]}`, "File Selected");
    },
  });
}


// Function to show the main menu
function showMenu() {
  E.showMenu({
    "Open": () => {
      showFileList();
    },
    "Go to Page": () => {
    },
    "Exit": () => {
      E.showMessage("Goodbye!", "Exiting");
    },
  });
}

// Button press event to show the menu
setWatch(() => {
  showMenu();
}, BTN, { repeat: true, edge: "falling" }); // Set button press to trigger the menu
