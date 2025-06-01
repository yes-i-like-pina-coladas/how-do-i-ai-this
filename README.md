# How do I AI this?

A minimalist Chrome extension that encourages AI adoption by prompting users to consider AI solutions while browsing. The extension shows an elegant notification when visiting new pages, suggesting the use of AI tools to enhance productivity.

## Features

- 🎯 **Smart Prompts**: Gentle reminders to consider AI solutions while browsing
- 🎨 **Modern UI**: Clean, minimalist design with smooth animations
- 🌓 **Theme Support**: Light, dark, and system theme options
- ⚡ **Performance**: Lightweight and non-intrusive
- 🔒 **Privacy**: No data collection, runs entirely in your browser
- ⚙️ **Customizable**: Add your favorite AI tools and manage settings
- 🚫 **Smart Detection**: Automatically disabled on AI websites

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yes-i-like-pina-coladas/how-do-i-ai-this.git
   cd how-do-i-ai-this
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Make your changes
3. Build and test:
   ```bash
   npm run build
   ```

## Tech Stack

- ⚛️ React
- 🔷 TypeScript
- 🎨 TailwindCSS
- 📦 Vite
- 🗃️ Zustand
- 🔧 Chrome Extension Manifest V3

## Configuration

The extension can be configured through its popup interface:

- **Enable/Disable**: Toggle the extension on/off
- **Theme**: Choose between light, dark, or system theme
- **AI Tools**: Add up to 10 favorite AI tools
- **Notification Timing**: Shows on new page visits with a 5-minute cooldown per domain

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components inspired by [Tailwind UI](https://tailwindui.com/)
- Icons from [Lucide](https://lucide.dev/)

## Support

If you find this extension helpful, please consider:
- Starring the repository ⭐
- Reporting bugs 🐛
- Suggesting new features 💡
- Contributing to the code 👩‍💻

## Screenshots

<details>
<summary>Click to view screenshots</summary>

### Light Theme
![Light Theme](docs/light-theme.png)

### Dark Theme
![Dark Theme](docs/dark-theme.png)

### Settings Panel
![Settings](docs/settings.png)

</details> 