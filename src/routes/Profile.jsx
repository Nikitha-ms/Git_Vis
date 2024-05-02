import { useCallback, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaCodeFork } from "react-icons/fa6";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { username } = useParams();

  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedRepoFiles, setSelectedRepoFiles] = useState(null);
  const [selectedFolderContent, setSelectedFolderContent] = useState(null);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error(error);
    }
  }, [username]);

  const fetchRepos = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      const data = await response.json();

      setRepos(data);
      setSelectedRepo(data[0]);
    } catch (error) {
      console.error(error);
    }
  }, [username]);

  const fetchRepoFiles = useCallback(async () => {
    if (selectedRepo) {
      try {
        const response = await fetch(
          selectedRepo.contents_url.replace("{+path}", "")
        );
        const data = await response.json();
        setSelectedRepoFiles(data);
      } catch (error) {
        console.error(error);
      }
    }
  }, [selectedRepo]);

  const fetchFolderContent = useCallback(async (folder) => {
    if (folder) {
      try {
        const response = await fetch(folder.url);
        const data = await response.json();
        data?.unshift({
          name: "..",
          type: "dir",
          url: folder.url.replace(folder.name, ""),
        });
        setSelectedFolderContent(data);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchRepos();
  }, [fetchRepos, fetchUserData, username]);

  useEffect(() => {
    if (selectedRepo) fetchRepoFiles();
  }, [fetchRepoFiles, selectedRepo]);

  useEffect(() => {
    if (selectedFolderContent) {
      setSelectedRepoFiles(selectedFolderContent);
    }
  }, [selectedFolderContent, selectedRepo?.contents_url]);

  return (
    <div className="flex flex-col h-screen p-8">
      {userData ? (
        <div className="flex gap-4 p-4 h-full">
          <div className="flex flex-col w-1/4 border border-white rounded-xl p-4 h-full">
            <div className="flex justify-center items-center gap-2">
              <img
                src={userData?.avatar_url}
                alt="User avatar"
                className="w-24 h-24 rounded-full"
              />
              <div className="flex flex-col gap-2">
                <h1 className="text-white text-2xl font-bold">
                  {userData.name || username}
                </h1>
                <p className="text-white">{userData.bio}</p>
                <div className="flex gap-4">
                  <span className="text-white">
                    Followers: {userData.followers}
                  </span>
                  <span className="text-white">
                    Following: {userData.following}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4 overflow-y-auto">
              {repos ? (
                repos?.map((repo) => (
                  <span
                    key={repo.id}
                    className={`cursor-pointer ${
                      selectedRepo === repo ? "text-blue-500" : "text-white"
                    }`}
                    onClick={() => setSelectedRepo(repo)}
                  >
                    {repo.name}
                  </span>
                ))
              ) : (
                <h1 className="text-white">😟</h1>
              )}
            </div>
          </div>
          <div className="flex flex-col w-3/4 border border-white rounded-xl p-4 h-full overflow-y-auto">
            {selectedRepo ? (
              <>
                <h1 className="text-white text-2xl font-bold">
                  {selectedRepo.name}
                </h1>
                <p className="text-white">{selectedRepo.description}</p>
                <div className="flex gap-4">
                  <span className="text-white flex justify-center items-center">
                    <FaStar />: {selectedRepo.stargazers_count}
                  </span>
                  <span className="text-white flex justify-center items-center">
                    <FaCodeFork />: {selectedRepo.forks_count}
                  </span>
                </div>
                <div className="flex flex-col gap-2 mt-4 border border-white rounded-lg h-full overflow-y-auto">
                  <h1 className="text-white text-lg font-bold bg-slate-700 p-2 rounded-lg">
                    Files
                  </h1>
                  {selectedRepoFiles ? (
                    selectedRepoFiles?.map((file) => (
                      <span
                        key={file.sha}
                        className="text-white cursor-pointer px-2"
                        onClick={() => {
                          if (file.type === "dir") {
                            fetchFolderContent(file);
                          } else {
                            fetch(file.download_url)
                              .then((resp) => resp.blob())
                              .then((blob) => {
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.style.display = "none";
                                a.href = url;
                                a.download = file.name;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                              })
                              .catch(() =>
                                alert(
                                  "An error occurred while downloading the file"
                                )
                              );
                          }
                        }}
                      >
                        {file.name}
                      </span>
                    ))
                  ) : (
                    <h1 className="text-white">😟</h1>
                  )}
                </div>
              </>
            ) : (
              <h1 className="text-white text-2xl font-bold text-center">😟</h1>
            )}
          </div>
        </div>
      ) : (
        <h1 className="text-white text-2xl font-bold text-center">😟</h1>
      )}
    </div>
  );
};

export default Profile;
