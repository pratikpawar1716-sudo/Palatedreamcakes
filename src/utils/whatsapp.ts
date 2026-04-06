export const sendSweetstoryOrder = (type: 'grid' | 'bespoke' | 'custom' | 'quiz', data: any) => {
  const phone = "919322772234"; // Business number
  let message = "";

  const header = "✨ *THE LUXURY CAKE STUDIO - BESPOKE INQUIRY* ✨\n\n";
  const greeting = "Greetings from Pune! I've just explored your artisanal studio and would love to bring a vision to life.";

  switch (type) {
    case 'grid':
      message = `${header}${greeting}\n\n🍰 *COLLECTION MASTERPIECE*\n--------------------------\n*Product:* ${data.name}\n*Category:* ${productCategory(data.category)}\n*Price:* ₹${data.price.toLocaleString('en-IN')}\n*Ref ID:* ${data.id || 'N/A'}\n\nI'm inquiring about the availability of this specific creation for my upcoming celebration.`;
      break;
    case 'bespoke':
      message = `${header}${greeting}\n\n🎨 *3D STUDIO DESIGN*\n--------------------------\n*Base Flavor:* ${data.base}\n*Shape:* ${data.shape || 'Round'}\n*Tiers:* ${data.tiers || 1}\n*Artisanal Toppings:* ${data.toppings.length > 0 ? data.toppings.join(', ') : 'Minimalist'}\n*Desired Size:* ${data.size}\n*Personalization:* "${data.customName || 'N/A'}"\n\nI have meticulously designed this cake in your 3D Studio and would like to proceed with this bespoke creation.`;
      break;
    case 'custom':
      message = `${header}${greeting}\n\n🌟 *CUSTOM VISION REQUEST*\n--------------------------\n*Description:* ${data.description}\n\n✅ *REFERENCE IMAGE ATTACHED*\n(I have attached my reference image in the studio and am ready to share it here for our discussion.)\n\nI'd love to explore the artistic possibilities and receive a formal quote for this custom masterpiece.`;
      break;
    case 'quiz':
      message = `${header}${greeting}\n\n🔮 *TASTE PROFILE MATCH*\n--------------------------\n*Occasion:* ${data.occasion}\n*Guest Count:* ${data.count}\n*Flavor Palette:* ${data.palette}\n*Patron Name:* ${data.userName || 'Guest'}\n\nBased on my curated Taste Profile, I'd love to explore a cake that perfectly matches these preferences!`;
      break;
  }

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
};

const productCategory = (cat: string) => {
  switch (cat) {
    case 'Signature': return '🏆 Signature Collection';
    case 'Bento': return '🍱 Artisanal Bento';
    case 'Couture': return '👗 Couture Cakes';
    default: return cat;
  }
};
