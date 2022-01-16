const handleAction = async (message, sender, sendResponse): Promise<any> => {
  switch (message.request) {
    // Universal actions go here!
    default:
      return false;
  }
};

export default handleAction;
