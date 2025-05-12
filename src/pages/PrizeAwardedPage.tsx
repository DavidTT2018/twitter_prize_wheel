import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Gift, Disc as Discord } from "lucide-react";
import PageContainer from "../components/PageContainer";
import confetti from "../utils/confetti";
import { supabase, generateUniqueCode } from "../services/supabase";

const PrizeAwardedPage: React.FC = () => {
  const { state } = useUser();
  const [uniqueCode, setUniqueCode] = useState<string>("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const generateAndStorePrize = async () => {
      const code = generateUniqueCode();
      setUniqueCode(code);
    };

    confetti();
    generateAndStorePrize();
  }, [state.prize]);

  const handleDiscordSubmit = async () => {
    if (!discordUsername.trim()) {
      setError("Please enter your Discord username");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("prize_claims")
        .insert({
          code: uniqueCode,
          prize: state.prize,
          discord_username: discordUsername.trim(),
          claimed: true,
          claimed_at: new Date().toISOString(),
        })

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("Error updating Discord username:", err);
      setError("Failed to save Discord username. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center">
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4">
            <Gift size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-white">
            Congratulations!
          </h1>
          <p className="text-xl text-yellow-300 font-bold mb-4">
            You won: {state.prize || "A Prize"}
          </p>

          <div className="bg-white/5 p-6 rounded-lg mb-6">
            <p className="text-lg mb-2">Your Unique Prize Code:</p>
            <div className="bg-white/10 p-4 rounded-lg font-mono text-2xl tracking-wider text-yellow-300">
              {uniqueCode}
            </div>
          </div>

          {!submitted ? (
            <div className="bg-white/5 p-6 rounded-lg mb-6">
              <p className="mb-4">
                Enter your Discord username to claim your prize:
              </p>
              <input
                type="text"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                placeholder="Discord username#0000"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400 mb-4"
              />
              <button
                onClick={handleDiscordSubmit}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg font-bold transition-all"
              >
                <Discord size={20} />
                <span>
                  {isSubmitting ? "Submitting..." : "Submit Discord Username"}
                </span>
              </button>
              {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
            </div>
          ) : (
            <div className="bg-green-500/20 border border-green-500 p-4 rounded-lg mb-6">
              <p className="text-green-300">
                Thanks! Join our Discord server to claim your prize.
              </p>
              <a
                href="https://discord.gg/CH2N2zT6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 mt-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg font-bold transition-all"
              >
                <Discord size={20} />
                <span>Join Discord Server</span>
              </a>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-300">
          <p>Save your unique code! You'll need it to claim your prize.</p>
          <p className="mt-2">This page can only be viewed once.</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default PrizeAwardedPage;