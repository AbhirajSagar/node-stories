export default function ProfileIcon({name}) 
{
  function getGradient(name) 
  {
    if(!name) return "linear-gradient(to right, rgb(107, 114, 128), rgb(55, 65, 81))";
    
    let hash = 0;
    for(let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const color1 = `hsl(${hash % 360}, 70%, 50%)`;
    const color2 = `hsl(${(hash + 60) % 360}, 70%, 60%)`;
    return `linear-gradient(to right, ${color1}, ${color2})`;
  }

  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xl" style={{ background: getGradient(name) }}>
      {name?.[0]?.toUpperCase()}
    </div>
  );
}