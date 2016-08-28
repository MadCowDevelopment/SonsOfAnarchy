using System;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using Newtonsoft.Json;
using Image = System.Windows.Controls.Image;


namespace CardMaker
{

    class Program
    {
        private static string _setDirectory;

        private const string TemplateFile = "Template.png";

        [STAThread]
        static void Main(string[] args)
        {
            _setDirectory = Path.Combine(Environment.CurrentDirectory, "SonsOfAnarchy");
            var cardSet = OpenCardSet(Path.Combine(_setDirectory, "cardset.json"));
            CreateCardImages(cardSet);
            CreateRandomizerCards(cardSet);

            var outputPath = Path.Combine(Environment.CurrentDirectory, "output", cardSet.Name);
            MergeImages(Directory.GetFiles(outputPath, "out_*.png"), cardSet.Width, cardSet.Height, outputPath, "story");
            MergeImages(Directory.GetFiles(outputPath, "rnd_*.png"), cardSet.Width, cardSet.Height, outputPath, "random");
        }

        private static void MergeImages(string[] images, int width, int height, string outputFolder, string filePrefix)
        {
            var maxColumns = (int)Math.Floor(168.0 / width);
            var maxRows = (int)Math.Floor(261.0 / height);

            var size = BitmapHelper.Mm2Pixel(maxColumns * width, maxRows * height);
            var outputPath = Path.Combine(Environment.CurrentDirectory, "output", outputFolder);

            var requiredPages = Math.Ceiling(images.Length / (double)(maxColumns * maxRows));

            for (int i = 0; i < requiredPages; i++)
            {
                var canvas = new Canvas();
                canvas.Width = size.Width;
                canvas.Height = size.Height;

                for (int y = 0; y < maxRows; y++)
                {
                    for (int x = 0; x < maxColumns; x++)
                    {
                        var index = (i * maxRows * maxColumns) + y * maxRows + x;
                        if (index >= images.Length) break;
                        var currentImage = images[index];
                        var offSetX = x * BitmapHelper.Mm2Pixel(width);
                        var offSetY = y * BitmapHelper.Mm2Pixel(height);

                        AddImage(currentImage, canvas, offSetX, offSetY);
                    }
                }

                BitmapHelper.ExportToPng(new Uri(Path.Combine(outputPath, $"{filePrefix}_{i:00}.png")), canvas);
            }
        }

        private static void CreateRandomizerCards(CardSet cardSet)
        {
            var size = BitmapHelper.Cm2Pixel(cardSet.Width / 10f, cardSet.Height / 10f);
            for (int i = 0; i < 9; i++)
            {
                var canvas = new Canvas();
                canvas.Width = size.Width;
                canvas.Height = size.Height;

                AddGradientBackground(canvas, Colors.DarkGray, Colors.White, 18, 20, 176, 134);

                AddImage(TemplateFile, canvas);

                AddTileGrid(canvas, i);

                AddText("Add 1 enemy to the highlighted site and displace enemies if necessary.", canvas, 20, 195, 170, 120, Brushes.Black, 20,
                    new FontFamily(new Uri(_setDirectory), "Carnivalee Freakshow"));
                AddText((i+1).ToString(), canvas, 192, 26, 17, 17, Brushes.White, FontWeights.Bold, 10);

                var outputPath = Path.Combine(Environment.CurrentDirectory, "output", cardSet.Name);
                Directory.CreateDirectory(outputPath);
                BitmapHelper.ExportToPng(new Uri(Path.Combine(outputPath, $"rnd_{i:00}.png")), canvas);
            }
        }

        private static void AddTileGrid(Canvas canvas, int index)
        {
            var uniformGrid = new UniformGrid();
            uniformGrid.Columns = 3;
            uniformGrid.Rows = 3;
            uniformGrid.Width = 112;
            uniformGrid.Height = 112;

            for (int i = 0; i < 9; i++)
            {
                var border = new Border();
                border.BorderThickness = new Thickness(2);
                border.CornerRadius = new CornerRadius(4);
                border.BorderBrush = Brushes.Black;
                border.Background = i == index ? Brushes.Green : Brushes.LightGray;
                border.Margin = new Thickness(3);
                uniformGrid.Children.Add(border);
            }

            canvas.Children.Add(uniformGrid);
            Canvas.SetLeft(uniformGrid, 50);
            Canvas.SetTop(uniformGrid, 32);
        }

        private static void AddGradientBackground(Canvas canvas, Color topColor, Color bottomColor, int top, int left, int width, int height)
        {
            var gradient = new LinearGradientBrush(topColor, bottomColor, new Point(0.5, 0), new Point(0.5, 1));
            
            var background = new Canvas();
            background.Width = width;
            background.Height = height;
            background.Background = gradient;

            canvas.Children.Add(background);
            Canvas.SetLeft(background, left);
            Canvas.SetTop(background, top);
        }

        private static void CreateCardImages(CardSet cardSet)
        {
            var size = BitmapHelper.Cm2Pixel(cardSet.Width/10f, cardSet.Height/10f);
            foreach (var card in cardSet.Cards)
            {
                var canvas = new Canvas();
                canvas.Width = size.Width;
                canvas.Height = size.Height;

                AddImage($"{card.Number}.png", canvas, 20, 22);
                AddImage(TemplateFile, canvas);

                AddText(card.Title, canvas, 20, 154, 170, 26, Brushes.White, FontWeights.Bold, 14);
                AddText(string.Join(" - ", card.Traits), canvas, 21, 179, 170, 16, Brushes.Black, FontWeights.Bold, 10);
                AddText(card.Text, canvas, 20, 195, 170, 86, Brushes.Black, 10);
                AddText($"\"{card.FlavorText}\" - {card.FlavorCharacter}", canvas, 20, 265, 170, 42, Brushes.Black, FontStyles.Italic,
                    FontWeights.Normal, 9);
                AddText(card.Number.ToString(), canvas, 192, 26, 17, 17, Brushes.White, FontWeights.Bold, 10);
                var outputPath = Path.Combine(Environment.CurrentDirectory, "output", cardSet.Name);
                Directory.CreateDirectory(outputPath);
                BitmapHelper.ExportToPng(new Uri(Path.Combine(outputPath, $"out_{card.Number:00}.png")), canvas);
            }
        }

        private static void AddText(string text, Canvas canvas, double left, double top, double width, double height, Brush foreground, double fontSize = 16, FontFamily fontfamily = null)
        {
            AddText(text, canvas, left, top, width, height, foreground, FontStyles.Normal, FontWeights.Normal, fontSize,
                fontfamily);
        }

        private static void AddText(string text, Canvas canvas, double left, double top, double width, double height,
            Brush foreground, FontWeight fontWeight, double fontSize = 16)
        {
            AddText(text, canvas, left, top, width, height, foreground, FontStyles.Normal, fontWeight, fontSize);
        }

        private static void AddText(string text, Canvas canvas, double left, double top, double width, double height,
            Brush foreground, FontStyle fontStyle, FontWeight fontWeight, double fontSize = 16, FontFamily fontFamily = null)
        {
            var textBlock = new TextBlock();
            textBlock.Margin = new Thickness(2);
            textBlock.Text = text;
            textBlock.Width = width;
            textBlock.Height = height;
            textBlock.Foreground = foreground;
            textBlock.FontSize = fontSize;
            textBlock.FontStyle = fontStyle;
            textBlock.FontWeight = fontWeight;
            textBlock.TextAlignment = TextAlignment.Center;
            textBlock.HorizontalAlignment = HorizontalAlignment.Center;
            textBlock.VerticalAlignment = VerticalAlignment.Center;
            textBlock.TextWrapping = TextWrapping.Wrap;
            if (fontFamily != null) textBlock.FontFamily = fontFamily;

            canvas.Children.Add(textBlock);
            Canvas.SetLeft(textBlock, left);
            Canvas.SetTop(textBlock, top);
        }

        private static void AddImage(string filename, Canvas canvas, double left = 0, double top = 0)
        {
            var path = Path.Combine(_setDirectory, filename);
            if (!File.Exists(path)) return;
            var templateImage = new BitmapImage(new Uri(path));
            var image = new Image();
            image.Source = templateImage;

            canvas.Children.Add(image);
            Canvas.SetLeft(image, left);
            Canvas.SetTop(image, top);
        }

        private static CardSet OpenCardSet(string filename)
        {
            return JsonConvert.DeserializeObject<CardSet>(File.ReadAllText(filename));
        }
    }
}