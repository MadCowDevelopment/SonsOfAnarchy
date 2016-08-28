using System.Collections.Generic;

namespace CardMaker
{
    public class CardSet
    {
        public string Name { get; set; }
        public List<Card> Cards { get; set; } = new List<Card>();
        public int Width { get; set; }
        public int Height { get; set; }
    }
}