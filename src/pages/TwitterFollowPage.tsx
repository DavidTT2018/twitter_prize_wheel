import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Twitter } from "lucide-react";
import PageContainer from "../components/PageContainer";
import { verifyTwitterFollow } from "../services/api";

const TwitterFollowPage: React.FC = () => {
  const { state, dispatch } = useUser();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const twitterUsername = "Mattonkick";

  const handleFollowClick = async () => {
    if (!username.trim()) {
      setUsernameError("Please enter your Twitter username");
      return;
    }

    const cleanUsername = username.trim().replace(/^@/, "");
    dispatch({ type: "SET_TWITTER_USERNAME", payload: cleanUsername });

    try {
      const response = await verifyTwitterFollow(username);

      if (response.success) {
        alert("You already followed.");
        dispatch({ type: "VERIFY_TWITTER_FOLLOW" });
        navigate("/wheel-spin");
      } else {
        window.open(
          `https://twitter.com/intent/follow?screen_name=${twitterUsername}`,
          "twitter-follow-dialog",
          "width=600,height=600"
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyClick = async () => {
    if (!username.trim()) {
      setUsernameError("Please enter your Twitter username");
      return;
    }

    const cleanUsername = username.trim().replace(/^@/, "");
    dispatch({ type: "SET_TWITTER_USERNAME", payload: cleanUsername });

    setIsVerifying(true);
    setError(null);

    try {
      const response = await verifyTwitterFollow(username);

      if (response.success) {
        dispatch({ type: "VERIFY_TWITTER_FOLLOW" });
        navigate("/wheel-spin");
      } else {
        alert("You should follow Mattonkick");
        window.open(
          `https://twitter.com/intent/follow?screen_name=${twitterUsername}`,
          "twitter-follow-dialog",
          "width=600,height=600"
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setUsernameError("");
  };

  return (
    <PageContainer>
      <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold mb-6 text-white">
          Follow on Twitter
        </h1>

        <p className="text-xl mb-8">
          Follow us on Twitter to spin the wheel and win amazing prizes!
        </p>

        <input
          id="twitter-username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="@username"
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
        />
        {usernameError && (
          <p className="text-red-400 text-sm mt-2 text-left">{usernameError}</p>
        )}
        <div className="my-8 flex flex-col items-center">
          <button
            onClick={handleFollowClick}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#1DA1F2] hover:bg-[#1a94df] text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 mb-4 w-full sm:w-auto"
          >
            <Twitter size={24} />
            <span>Follow @{twitterUsername}</span>
          </button>

          <button
            onClick={handleVerifyClick}
            disabled={isVerifying}
            className={`px-8 py-3 mt-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 w-full sm:w-auto
              ${
                isVerifying
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
          >
            {isVerifying ? "Verifying..." : "I Followed, Activate wheel."}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
          <p className="text-sm text-blue-300">
            We need to verify that you've followed our Twitter account before
            you can spin the wheel. Click the verify button once you've
            followed.
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default TwitterFollowPage;