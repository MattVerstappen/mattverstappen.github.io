(function () {
  'use strict';

  const ccTexturePath = 'assets/textures/';
  const ccNormalPath = 'assets/normal-maps/';

  window.ccPlanets = [
    {
      name: 'Sun', type: 'Star', radius: 150, rotationSpeed: 0.004, tilt: 0.02,
      color: '#ff9d18', atmosphereColor: '#ff7a00', atmosphere: 'Plasma', visual: 'Emissive solar surface',
      description: 'The star at the centre of the Solar System, rendered with a bright corona and animated plasma glow.',
      texture: ccTexturePath + 'sun.webp', emissive: true, specular: 0
    },
    {
      name: 'Mercury', type: 'Terrestrial', radius: 61, rotationSpeed: 0.006, tilt: 0.04,
      color: '#aaa29a', atmosphereColor: '#c9c0b8', atmosphere: 'Trace', visual: 'Craters and grey rock',
      description: 'A small airless world covered in impact craters and rocky plains.',
      texture: ccTexturePath + 'mercury.webp', specular: 0.02
    },
    {
      name: 'Venus', type: 'Terrestrial', radius: 80, rotationSpeed: -0.003, tilt: 0.12,
      color: '#d9a85e', atmosphereColor: '#ffc15c', atmosphere: 'Dense CO₂', visual: 'Surface / atmosphere toggle',
      description: 'A hot planet with a thick golden atmosphere. Weather mode adds the Venus atmosphere layer.',
      texture: ccTexturePath + 'venus-surface.webp', cloudTexture: ccTexturePath + 'venus-atmosphere.webp', specular: 0.03
    },
    {
      name: 'Earth', type: 'Terrestrial', radius: 91, rotationSpeed: 0.014, tilt: 0.38,
      color: '#3b88e6', atmosphereColor: '#63beff', atmosphere: 'Nitrogen / Oxygen', visual: 'Day, night, clouds, specular',
      description: 'Our home world with oceans, continents, clouds, atmosphere, night lights, specular oceans, and a normal map.',
      texture: ccTexturePath + 'earth-day.webp', nightTexture: ccTexturePath + 'earth-night.webp', cloudTexture: ccTexturePath + 'earth-clouds.webp',
      normalTexture: ccTexturePath + 'earth-normal-map.webp', specularTexture: ccTexturePath + 'earth-specular-map.webp', specular: 0.52
    },
    {
      name: 'Moon', type: 'Natural satellite', radius: 36, rotationSpeed: 0.006, tilt: 0.10,
      color: '#bdbdb8', atmosphereColor: '#d8d8d2', atmosphere: 'None', visual: 'Maria and craters',
      description: 'Earth’s Moon with dark maria, bright highlands, and cratered grey terrain.',
      texture: ccTexturePath + 'moon.webp', specular: 0.02
    },
    {
      name: 'Mars', type: 'Terrestrial', radius: 74, rotationSpeed: 0.013, tilt: 0.32,
      color: '#c25932', atmosphereColor: '#ff7d52', atmosphere: 'Thin CO₂', visual: 'Rust deserts and polar caps',
      description: 'The red planet, with dusty highlands, darker basalt regions, and bright polar caps.',
      texture: ccTexturePath + 'mars.webp', specular: 0.04
    },
    {
      name: 'Jupiter', type: 'Gas giant', radius: 126, rotationSpeed: 0.030, tilt: 0.05,
      color: '#d1a26e', atmosphereColor: '#f0d6ad', atmosphere: 'Hydrogen / Helium', visual: 'Cloud bands and storms',
      description: 'The largest planet, shown with turbulent bands and storm detail.',
      texture: ccTexturePath + 'jupiter.webp', specular: 0.08
    },
    {
      name: 'Saturn', type: 'Gas giant', radius: 112, rotationSpeed: 0.028, tilt: 0.44,
      color: '#e1c98f', atmosphereColor: '#ffe0a4', atmosphere: 'Hydrogen / Helium', visual: 'Bands and ring texture',
      description: 'A pale gas giant surrounded by a wide transparent ring texture.',
      texture: ccTexturePath + 'saturn.webp', ringTexture: ccTexturePath + 'saturn-ring.webp', rings: { inner: 1.35, outer: 2.2, tilt: 0.38 }, specular: 0.06
    },
    {
      name: 'Uranus', type: 'Ice giant', radius: 90, rotationSpeed: -0.019, tilt: 1.58,
      color: '#79d8df', atmosphereColor: '#8df8ff', atmosphere: 'Hydrogen / Methane', visual: 'Pale cyan haze',
      description: 'An icy blue-green planet with subtle methane haze and sideways rotation.',
      texture: ccTexturePath + 'uranus.webp', specular: 0.12
    },
    {
      name: 'Neptune', type: 'Ice giant', radius: 89, rotationSpeed: 0.021, tilt: 0.24,
      color: '#3156d4', atmosphereColor: '#5b84ff', atmosphere: 'Hydrogen / Methane', visual: 'Deep blue atmosphere',
      description: 'A deep cobalt ice giant with high-speed atmospheric storms and blue methane colour.',
      texture: ccTexturePath + 'neptune.webp', specular: 0.10
    }
  ];
})();
