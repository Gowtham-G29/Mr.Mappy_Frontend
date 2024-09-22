import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

function Main() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" disableGutters>
        <div className="bg-slate-800 opacity-100 bg-hero-pattern bg-no-repeat bg-cover bg-center min-h-screen flex justify-center items-center">
          <div className="flex flex-col justify-center items-center space-y-4 sm:space-y-4 lg:space-y-9 py-20 sm:py-2 lg:py-64 px-4 sm:px-6 lg:px-8">
            <h1 className="font-extrabold text-3xl sm:text-4xl  lg:text-6xl text-center text-white ">
              Welcome to Mr. Mappy
            </h1>
            <p className="font-semibold text-base sm:text-lg lg:text-xl text-center text-white">
              Tracking Your Activity Mappily!
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Main;


