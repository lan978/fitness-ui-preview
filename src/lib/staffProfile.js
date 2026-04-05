const ROLE_AVATAR_TONE = {
  specialist: "bg-[#0D2B1F] text-white ring-[#0D2B1F]/10",
  strategist: "bg-[#8B6A3D] text-white ring-[#8B6A3D]/10",
  director: "bg-[#23406E] text-white ring-[#23406E]/10"
};

export function getStaffInitials(name) {
  const parts = String(name || "Luminaire")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  const value = parts.map((item) => item[0] || "").join("").toUpperCase();
  return value || "LM";
}

export function getStaffAvatarTone(roleKey) {
  return ROLE_AVATAR_TONE[roleKey] || "bg-[#1A1A1A] text-white ring-black/10";
}
