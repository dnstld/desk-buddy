export function useFloorOptions(belowGroundLevels = 5, aboveGroundLevels = 50) {
  const options = [];

  // Below ground options (B1, B2, etc.)
  for (let i = belowGroundLevels; i > 0; i--) {
    options.push({
      value: -i,
      label: `B${i}`,
    });
  }

  // Ground floor
  options.push({
    value: 0,
    label: 'Ground floor',
  });

  // Above ground floors
  for (let i = 1; i <= aboveGroundLevels; i++) {
    let suffix = 'th';
    if (i % 100 >= 11 && i % 100 <= 13) {
      suffix = 'th';
    } else if (i % 10 === 1) {
      suffix = 'st';
    } else if (i % 10 === 2) {
      suffix = 'nd';
    } else if (i % 10 === 3) {
      suffix = 'rd';
    }

    options.push({
      value: i,
      label: `${i}${suffix} floor`,
    });
  }

  return options;
}
