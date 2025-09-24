import { Taskbar } from "./taskbar";

export function Desktop() {
  const handleStartClick = () => {
    console.log("Start button clicked!");
    // TODO: Implement start menu functionality
  };

  return (
    <>
      <Taskbar onStartClick={handleStartClick} />
    </>
  );
}
