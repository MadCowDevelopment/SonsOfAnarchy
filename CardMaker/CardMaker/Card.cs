using System.Collections.Generic;

namespace CardMaker
{
    public class Card
    {
        public int Number { get; set; }
        public string Title { get; set; }
        public List<string> Traits { get; set; } = new List<string>();
        public string Text { get; set; }
        public string FlavorText { get; set; }
        public string FlavorCharacter { get; set; }
    }
}