export async function fetchClasses() {
  try {
    const response = await fetch("/api/fetch-classes");
    const classes = await response.json();
    console.log("Fetched classes");
    return classes;
  } catch (error) {
    console.error(`Error fetching classes: ${error}`);
  }
}
